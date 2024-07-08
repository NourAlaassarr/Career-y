import send_Email from '../../utils/email.js';
import { v4 as uuidv4 } from 'uuid';
import { Neo4jConnection } from "../../../DB/Neo4j/Neo4j.js";
import { sendmailService } from '../../Services/SendEmailService.js'
import { emailTemplate } from '../../utils/EmailTemplate.js'
import{jobOfferEmailTemplate}from'../../utils/JobOfferEmailTemplate.js'

//Add Job offer -> JobID/SkillId  (Admin only ) + Notify Users
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

//delete JobOffer (Admin only)
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

//update JobOffer (Admin only)
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
export const GetAllJobsIntrack=async(req,res,next)=>{
    const{JobId}=req.query
    let session;
    const driver = await Neo4jConnection(); 
    session = driver.session(); 
    
    const JobCheckResults = await session.run(
        'MATCH (j:Job {Nodeid:$JobId}) RETURN j',
        { JobId }
    );
    if (JobCheckResults.records.length === 0) {
        return next(new Error("Skill Doesn't exist", { cause: 404 }));
    }
    const result = await session.run(
        'MATCH (j:Job {Nodeid: $JobId})-[:REQUIRES]->(s:Skill)<-[:BELONGS_TO]-(jo:JobOffer) RETURN jo',
        { JobId: JobId }
    );

    // Process the result
    const jobOffers = result.records.map(record => record.get('jo').properties);

    // Send the result as a response
    res.status(200).json(jobOffers);
}

//get jobOffer Detail
export const GetJobDetails = async(req,res,next)=>{
    const { jobOfferId } = req.query;

    let session;
    const driver = await Neo4jConnection();
    session = driver.session();
    const JobOfferCheckResults = await session.run(
        'MATCH (c:JobOffer {jobOfferId: $jobOfferId}) RETURN c',
        { jobOfferId }
    );

    if (JobOfferCheckResults.records.length === 0) {
        return next(new Error("JobOffer Doesn't exist", { cause: 404 }));
    }

    const getJobDetailsQuery = `MATCH (c:JobOffer {jobOfferId: $jobOfferId}) RETURN c`;
        const result = await session.run(getJobDetailsQuery, { jobOfferId });
        const JobOfferNode=result.records[0].get('c') 
        const JobData = JobOfferNode.properties;
        // Transform the date fields
        if (JobData.date_posted) {
            const year = JobData.date_posted.year.low;
            const month = JobData.date_posted.month.low;
            const day = JobData.date_posted.day.low;
            JobData.date_posted = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }
        res.status(200).json({ Message: 'Success',JobData });
        session.close();
    
}


// export const sendNotification = async (req, res, next) => {
//     const { email } = req.body;

//     // Validate email input
//     if (!email) {
//         return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Email is required' });
//     }

//     let session;
//     try {
//         const driver = await Neo4jConnection();
//         session = driver.session();

//         // Fetch all job offers
//         const jobOffersResult = await session.run(`
//             MATCH (jo:JobOffer)
//             RETURN jo
//         `);

//         // Process the result
//         const jobOffers = jobOffersResult.records.map(record => record.get('jo').properties);

//         // Check if there are any job offers
//         if (jobOffers.length === 0) {
//             return res.status(StatusCodes.NOT_FOUND).json({ message: 'No job offers found' });
//         }

//         // Close the session
//         await session.close();

//         // Create a formatted job offers message
//         const jobOffersMessage = jobOffers.map(offer => `
//             Title: ${offer.title}
//             Company: ${offer.CompanyName}
//             Description: ${offer.JobDescription}
//             Requirements: ${offer.JobRequirements}
//             Salary Range: ${offer.salary_range}
//             Date Posted: ${offer.date_posted}
//             Employment Type: ${offer.employment_type}
//         `).join('\n\n');

//         await send_Email({
//             to: email,
//             subject: 'All Job Offers',
//             text: jobOffersMessage,
//         });

//         return res.status(StatusCodes.OK).json({ message: 'Job offers sent successfully' });

//     } catch (error) {
//         if (session) {
//             await session.close();
//         }
//         return next(error);
//     }

// }



// //Crons
// export const sendNotification = async (req, res, next) => {
//     let session;

//     try {
//         const driver = await Neo4jConnection();
//         session = driver.session();

//         // Retrieve all distinct job names to populate frameworks array
//         const frameworksResult = await session.run(
//             `
//             MATCH (j:Job)
//             RETURN DISTINCT j.name AS framework
//             `
//         );

//         const frameworks = frameworksResult.records.map(record => record.get('framework'));
//         console.log("Frameworks:", frameworks);

//         if (frameworks.length === 0) {
//             await session.close();
//             return res.json({ message: 'No job frameworks found' });
//         }

//         const jobOffersResult = await session.run(
//             `
//             MATCH (j:Job)-[:REQUIRES]->(s:Skill)<-[:BELONGS_TO]-(jo:JobOffer)
//             WHERE j.name IN $frameworks
//             RETURN jo, j.name AS framework
//             `, { frameworks }
//         );

//         const jobOffers = jobOffersResult.records.map(record => {
//             const offer = record.get('jo').properties;
//             offer.framework = record.get('framework');

//             // Check for the timestamp field
//             if (offer.timestamp) {
//                 offer.date_posted = new Date(offer.timestamp.low);
//             } else if (offer.date_posted && offer.date_posted.year && offer.date_posted.month && offer.date_posted.day) {
//                 offer.date_posted = new Date(offer.date_posted.year.low, offer.date_posted.month.low - 1, offer.date_posted.day.low);
//             } else {
//                 console.error(`Missing date information for job offer: ${offer}`);
//             }

//             return offer;
//         });

//         console.log(jobOffers);

//         if (jobOffers.length === 0) {
//             await session.close();
//             return res.json({ message: 'No job offers found' });
//         }

//         const oneWeekAgo = new Date();
//         oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

//         for (const framework of frameworks) {
//             const usersResult = await session.run(`
//                 MATCH (u:User)
//                 WHERE ANY(goal IN u.CareerGoal WHERE goal = $framework)
//                 RETURN u.Email AS email
//             `, { framework });

//             const users = usersResult.records.map(record => record.get('email'));
//             console.log(users);

//             const jobOffersMessage = jobOffers
//     .filter(offer => offer.framework.toLowerCase() === framework.toLowerCase() && offer.date_posted > oneWeekAgo)
//     .map(offer => jobOfferEmailTemplate({
//         jobTitle: offer.title,
//         companyName: offer.CompanyName,
//         jobDescription: offer.JobDescription,
//         salaryRange: offer.salary_range,
//         employmentType: offer.employment_type
//     }))
//     .join('\n\n');

//             if (!jobOffersMessage) continue;

//             for (const userEmail of users) {
//                 try {
//                     const success = await sendmailService({
//                         to: userEmail,
//                         subject: `Job Offers for ${framework}`,
//                         message: jobOffersMessage,
//                     });
//                     if (success) {
//                         console.log(`Email sent to ${userEmail} for framework ${framework}`);
//                     } else {
//                         console.error(`Failed to send email to ${userEmail}`);
//                     }
//                 } catch (emailError) {
//                     console.error(`Failed to send email to ${userEmail}: `, emailError);
//                 }
//             }
//         }

//         await session.close();
//         return res.json({ message: 'Job offers sent successfully' });

//     } catch (error) {
//         console.error('Error in sendNotification:', error);
//         if (session) {
//             await session.close();
//         }
//         return next(error);
//     }
// };


export const sendNotification = async (req, res, next) => {
    let session;

    try {
        const driver = await Neo4jConnection();
        session = driver.session();

        // Retrieve all distinct job names to populate frameworks array
        const frameworksResult = await session.run(
            `
            MATCH (j:Job)
            RETURN DISTINCT j.name AS framework
            `
        );

        const frameworks = frameworksResult.records.map(record => record.get('framework'));
        console.log("Frameworks:", frameworks);

        if (frameworks.length === 0) {
            await session.close();
            return res.json({ message: 'No job frameworks found' });
        }

        const jobOffersResult = await session.run(
            `
            MATCH (j:Job)-[:REQUIRES]->(s:Skill)<-[:BELONGS_TO]-(jo:JobOffer)
            WHERE j.name IN $frameworks
            RETURN jo, j.name AS framework
            `, { frameworks }
        );

        const jobOffers = jobOffersResult.records.map(record => {
            const offer = record.get('jo').properties;
            offer.framework = record.get('framework');

            // Check for the timestamp field
            if (offer.timestamp) {
                offer.date_posted = new Date(offer.timestamp.low);
            } else if (offer.date_posted && offer.date_posted.year && offer.date_posted.month && offer.date_posted.day) {
                offer.date_posted = new Date(offer.date_posted.year.low, offer.date_posted.month.low - 1, offer.date_posted.day.low);
            } else {
                console.error(`Missing date information for job offer: ${offer}`);
            }

            return offer;
        });

        console.log(jobOffers);

        if (jobOffers.length === 0) {
            await session.close();
            return res.json({ message: 'No job offers found' });
        }

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        for (const framework of frameworks) {
            const usersResult = await session.run(`
                MATCH (u:User)
                WHERE ANY(goal IN u.CareerGoal WHERE goal = $framework)
                RETURN u.Email AS email
            `, { framework });

            const users = usersResult.records.map(record => record.get('email'));
            console.log(users);

            const jobOffersMessage = jobOffers
                .filter(offer => 
                    offer.framework &&
                    framework &&
                    offer.framework.toLowerCase() === framework.toLowerCase() && 
                    offer.date_posted > oneWeekAgo
                )
                .map(offer => jobOfferEmailTemplate({
                    jobTitle: offer.title,
                    companyName: offer.CompanyName,
                    jobDescription: offer.JobDescription,
                    salaryRange: offer.salary_range,
                    employmentType: offer.employment_type
                }))
                .join('\n\n');

            if (!jobOffersMessage) continue;

            for (const userEmail of users) {
                try {
                    const success = await sendmailService({
                        to: userEmail,
                        subject: `Job Offers for ${framework}`,
                        message: jobOffersMessage,
                    });
                    if (success) {
                        console.log(`Email sent to ${userEmail} for framework ${framework}`);
                    } else {
                        console.error(`Failed to send email to ${userEmail}`);
                    }
                } catch (emailError) {
                    console.error(`Failed to send email to ${userEmail}: `, emailError);
                }
            }
        }

        await session.close();
        return res.json({ message: 'Job offers sent successfully' });

    } catch (error) {
        console.error('Error in sendNotification:', error);
        if (session) {
            await session.close();
        }
        return next(error);
    }
}




































// export const sendNotification = async (req, res, next) => {
//     const frameworks = ['Frontend', 'Backend'];
//     let session;

//     try {
//         const driver = await Neo4jConnection();
//         session = driver.session();

//         const jobOffersResult = await session.run(
//             `
//             MATCH (j:Job)-[:REQUIRES]->(s:Skill)<-[:BELONGS_TO]-(jo:JobOffer)
//             WHERE j.name IN $frameworks
//             RETURN jo, j.name AS framework
//             `, { frameworks }
//         );

//         const jobOffers = jobOffersResult.records.map(record => {
//             const offer = record.get('jo').properties;
//             offer.framework = record.get('framework');
//             offer.date_posted = {
//                 year: offer.date_posted.year.low,
//                 month: offer.date_posted.month.low,
//                 day: offer.date_posted.day.low
//             };
//             return offer;
//         });

//         console.log(jobOffers);

//         if (jobOffers.length === 0) {
//             await session.close();
//             return res.json({ message: 'No job offers found' });
//         }

//         for (const framework of frameworks) {
//             const usersResult = await session.run(`
//                 MATCH (u:User)
//                 WHERE ANY(goal IN u.CareerGoal WHERE goal = $framework)
//                 RETURN u.Email AS email
//             `, { framework });

//             const users = usersResult.records.map(record => record.get('email'));
//             console.log(users);

//             const jobOffersMessage = jobOffers
//                 .filter(offer => offer.framework.toLowerCase() === framework.toLowerCase())
//                 .map(offer => {
//                     const datePosted = `${offer.date_posted.year}-${offer.date_posted.month}-${offer.date_posted.day}`;
//                     return `
//                     Title: ${offer.title}
//                     Company: ${offer.CompanyName}
//                     Description: ${offer.JobDescription}
//                     Requirements: ${offer.JobRequirements}
//                     Salary Range: ${offer.salary_range}
//                     Date Posted: ${datePosted}
//                     Employment Type: ${offer.employment_type}
//                     `;
//                 }).join('\n\n');

//             if (!jobOffersMessage) continue;

//             for (const userEmail of users) {
//                 try {
//                     await send_Email({
//                         to: userEmail,
//                         subject: `Job Offers for ${framework}`,
//                         text: jobOffersMessage,
//                     });
//                     console.log(`Email sent to ${userEmail} for framework ${framework}`);
//                 } catch (emailError) {
//                     console.error(`Failed to send email to ${userEmail}: `, emailError);
//                 }
//             }
//         }

//         await session.close();
//         return res.json({ message: 'Job offers sent successfully' });

//     } catch (error) {
//         console.error('Error in sendNotification: ', error);
//         if (session) {
//             await session.close();
//         }
//         return next(error);
//     }
// };
