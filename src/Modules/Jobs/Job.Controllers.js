
import { v4 as uuidv4 } from 'uuid';
import { Neo4jConnection } from "../../../DB/Neo4j/Neo4j.js";
import { sendmailService } from '../../Services/SendEmailService.js'
import { emailTemplate } from '../../utils/EmailTemplate.js'
import{jobOfferEmailTemplate}from'../../utils/JobOfferEmailTemplate.js'

//Add Job offer -> JobID/SkillId  (Admin ) + Notify Users
export const AddJobOffer = async (req, res, next) => {
    let session;
    
        const driver = await Neo4jConnection();
        session = driver.session();

        const { JobId } = req.query;
        const {CompanyName, JobDescription, JobRequirements, salary_range, date_posted, employment_type, title } = req.body;

        if (!title || !CompanyName || !JobDescription || !JobRequirements || !salary_range || !date_posted || !employment_type) {
            return next(new Error("Missing required fields", { cause: 404 }));
        }

        let relatedLabel;
        let relatedNode;

        // Check if the JobId corresponds to a Job node
        const jobResult = await session.run(`
            MATCH (n:Job {Nodeid: $JobId})
            RETURN n
        `, { JobId });

        if (jobResult.records.length > 0) {
            relatedNode = jobResult.records[0].get('n');
            relatedLabel = 'Job';
        }

        // If not found as a Job, check if it corresponds to a Skill node
        if (!relatedNode) {
            const skillResult = await session.run(`
                MATCH (n:Skill {Nodeid: $JobId})
                RETURN n
            `, { JobId });

            if (skillResult.records.length > 0) {
                relatedNode = skillResult.records[0].get('n');
                relatedLabel = 'Skill';
            }
        }

        if (!relatedNode) {
            return next(new Error('Job or Skill not found', { cause: 404 }));
        }
        // Generate a UUID for the job offer
        const jobOfferId = uuidv4();

        // Create the job offer and relate it to the job/skill
        const result = await session.run(`
            MATCH (n:${relatedLabel} {Nodeid: $JobId})
            CREATE (jo:JobOffer {
                jobOfferId: $jobOfferId,
                title: $title,
                CompanyName: $CompanyName,
                JobDescription: $JobDescription,
                JobRequirements: $JobRequirements,
                salary_range: $salary_range,
                date_posted: date($date_posted),
                employment_type: $employment_type
            })-[:BELONGS_TO]->(n)
            RETURN jo
        `, {
            jobOfferId,
            JobId,
            title,
            CompanyName,
            JobDescription,
            JobRequirements,
            salary_range,
            date_posted,
            employment_type
        });

        const jobOffer = result.records[0].get('jo');
 //Send Email to users that have this skill/Roadmap // Query users whose CareerGoal property matches JobId or any parent JobId
// Query users whose CareerGoal property matches JobId or any parent JobId
let usersQuery;
if (relatedLabel === 'Skill') {
    // If relatedLabel is Skill, find its parent Job
     usersQuery = `
            MATCH (s:Skill {Nodeid: $JobId})<-[:REQUIRES]-(j:Job)
            WITH COLLECT(j.Nodeid) AS jobIds
            MATCH (u:User)
            WHERE ANY(goal IN u.CareerGoal WHERE goal IN jobIds)
            RETURN DISTINCT u.Email AS email
        `;
console.log("hey")
} else {
    // If relatedLabel is Job, directly use JobId
    usersQuery = `
            MATCH (j:Job {Nodeid: $JobId})
            OPTIONAL MATCH (j)-[:REQUIRES*]->(parentJob:Job)
            WITH COLLECT(j.Nodeid) + COLLECT(parentJob.Nodeid) AS jobIds
            MATCH (u:User)
            WHERE ANY(goal IN u.CareerGoal WHERE goal IN jobIds)
            RETURN DISTINCT u.Email AS email
        `;
            console.log("ho")
}

  // Collect all email addresse
  const usersResult = await session.run(usersQuery, { JobId });
        
  const emails = usersResult.records.map(record => record.get('email'));
  console.log(emails)
  if (emails.length > 0) {
    const jobData = {
        jobTitle: title,
        companyName: CompanyName,
        jobDescription: JobDescription,
    };

    // Function to send job offer emails
    const sendJobOfferEmails = async (emails, jobData) => {
        const { jobTitle, companyName, jobDescription } = jobData;
        const subject = 'New Job Offer at Career-y';

        for (let i = 0; i < emails.length; i++) {
            const message = jobOfferEmailTemplate({
                jobTitle,
                companyName,
                jobDescription,
                
            });

            const isEmailSent = await sendmailService({
                to: emails[i],
                subject: subject,
                message: message
            });

            if (!isEmailSent) {
                throw new Error("Failed to Send Email");
            }
        }
    };

    // Send job offer emails
    await sendJobOfferEmails(emails, jobData);
}

session.close();
res.status(201).json({ message: 'Job offer created', jobOffer });
}

export const GetAllJobOffers = async (req, res, next) => {
    let session;
        const driver = await Neo4jConnection(); // Assuming Neo4jConnection returns a driver instance
        session = driver.session();

        // Query to fetch all job offers
        const jobResult = await session.run(`
            MATCH (n:JobOffer) RETURN n
        `);

        // Extract data from jobResult
        const jobOffers = jobResult.records.map(record => {
            const node = record.get('n');
            const properties = node.properties;

            // Format date_posted as YYYY-MM-DD
            if (properties.date_posted) {
                const { year, month, day } = properties.date_posted;
                properties.date_posted = `${year}-${month}-${day}`;
            }

            return properties;
        });

        // Close session and return the response
        session.close();
        res.status(200).json(jobOffers);
} 

//delete JobOffer (Admin )
export const DeleteJob=async(req,res,next)=>{
    const{JobOfferId}=req.query
    let session;
    const driver = await Neo4jConnection(); 
    session = driver.session();

    const   DeleteResult = await session.run("MATCH (n:JobOffer {jobOfferId: $JobOfferId}) RETURN n", { JobOfferId });

        if (DeleteResult.records.length === 0) {
            return next(new Error('JobOffer not found' ,{cause:404}))
        }

        // Execute the DELETE query
        await session.run("MATCH (n:JobOffer {jobOfferId: $JobOfferId}) DETACH DELETE n", { JobOfferId });

        // Respond with success message or appropriate response
        res.status(200).json({message: 'JobOffer deleted successfully' });
}

//update JobOffer (Admin)
export const UpdateJobOffer=async(req,res,next)=>{
    const { JobOfferId } = req.query;
    const {CompanyName, JobDescription, JobRequirements, salary_range, date_posted, employment_type, title } = req.body;
    const driver = await Neo4jConnection();
    let session = driver.session();
    // Check if JobOffer exists
    const JobCheckResults = await session.run(
        'MATCH (j:JobOffer {jobOfferId:$JobOfferId}) RETURN j',
        { JobOfferId }
    );
    if (JobCheckResults.records.length === 0) {
        return next(new Error("Skill Doesn't exist", { cause: 404 }));
    }
     // Constructing the Cypher query based on provided fields
     let updateQuery = 'MATCH (j:JobOffer {jobOfferId: $JobOfferId}) SET ';
     const params = { JobOfferId };

     // Only include fields that were actually provided in the request body
     const updateFields = [];
     // Only include fields that were actually provided in the request body
     if (CompanyName) {
        updateFields.push('j.CompanyName = $CompanyName');
         params.CompanyName = CompanyName;
     }
     if (JobDescription) {
         updateFields.push('j.JobDescription = $JobDescription');
         params.JobDescription = JobDescription;
     }
     if (JobRequirements) {
         updateFields.push('j.JobRequirements = $JobRequirements');
         params.JobRequirements = JobRequirements;
     }
     if (salary_range) {
         updateFields.push('j.salary_range = $salary_range');
         params.salary_range = salary_range;
     }
     if (date_posted) {
         updateFields.push('j.date_posted = $date_posted');
         params.date_posted = date_posted;
     }
     if (employment_type) {
         updateFields.push('j.employment_type = $employment_type');
         params.employment_type = employment_type;
     }
     if (title) {
         updateQuery += 'j.title = $title, ';
         params.title = title;
     }
     
     updateFields.push('j.date_modified = apoc.date.format(timestamp(), "ms", "yyyy-MM-dd HH:mm:ss")');
     updateQuery += updateFields.join(', ');

     // Run the update query
     await session.run(updateQuery, params);

     session.close();
     res.status(200).json({ message: "Job Offer updated successfully" });

}

//get all jobsOffers in track
