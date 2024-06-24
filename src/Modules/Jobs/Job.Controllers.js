
import { v4 as uuidv4 } from 'uuid';
import { Neo4jConnection } from "../../../DB/Neo4j/Neo4j.js";



//Add Job offer -> JobID/SkillId  (Admin )
export const AddJobOffer = async (req, res, next) => {
    let session;
    
        const driver = await Neo4jConnection();
        session = driver.session();

        const { JobId } = req.query;
        const { Name, CompanyName, JobDescription, JobRequirements, salary_range, date_posted, employment_type, title } = req.body;

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
        session.close();
        res.status(201).json({ message: 'Job offer created', jobOffer });
       
        
    
};

 // Create the job offer and relate it to the company and the job/skill

//  const result = await session.run(`
//      MATCH (c:Company {CompanyId: $CompanyId})
//      MATCH (n:${relatedLabel} {${relatedLabel === 'Job' ? 'job_id' : 'skill_id'}: $JobId})
//      CREATE (jo:JobOffer {
//          job_id: $JobId,
//          title: $title,
//          job_description: $JobDescription,
//          job_requirements: $JobRequirements,
//          salary_range: $salary_range,
//          date_posted: date($date_posted),
//          employment_type: $employment_type
//      })-[:OFFERED_BY]->(c),
//      (jo)-[:ASSOCIATED_WITH]->(n)
//      RETURN jo
//  `, {
//      JobId,
//      CompanyId,
//      title,
//      JobDescription,
//      JobRequirements,
//      salary_range,
//      date_posted,
//      employment_type
//  });




//Update job offer

//delete job offer
//get all jobsOffers in track 

//get all jobsOffer 



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

}



//notifyUser

//get all jobsOffers in track