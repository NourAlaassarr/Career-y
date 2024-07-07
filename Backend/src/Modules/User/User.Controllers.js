import { session } from "neo4j-driver";
import { Neo4jConnection } from "../../../DB/Neo4j/Neo4j.js";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import {convertNeo4jDatetimeToISO} from "../../utils/ConverNeo4jDateTimes.js";

//UserGet All Grades+QuizName Neo4j
// export const GetALLMarksAndGrades = async (req, res, next) => {
//     const UserId = req.authUser._id;

//     let session;
//     const driver = await Neo4jConnection();
//     session = driver.session();

//     try {
//         const AllInfo = await session.run(
//             `MATCH (u:User {_id: $UserId})
//              OPTIONAL MATCH (u)-[took:TOOK]->(quiz:Skill)
//              OPTIONAL MATCH (u)-[tookTrack:TOOK_TRACK_QUIZ]->(trackQuiz:Job)
//              RETURN u, 
//              [quiz IN COLLECT({
//                 QuizName: quiz.name, 
//                 TotalQuestions: took.TotalQuestions,
//                 Grade: took.Grade, 
//                 Pass: took.Pass 
//              }) WHERE quiz.QuizName IS NOT NULL] AS takenQuizzes,
//              [trackQuiz IN COLLECT({
//                 TrackId: trackQuiz.Nodeid, 
//                 TrackName: trackQuiz.name,
//                 Grade: tookTrack.grade, 
//                 TotalQuestions: tookTrack.TotalQuestions, 
//                 Pass: tookTrack.pass 
//              }) WHERE trackQuiz.TrackId IS NOT NULL] AS trackQuizzes,
//              EXISTS((u)-[:TOOK_TRACK_QUIZ]->(:Job)) AS hasTakenTrackQuiz`,
//             { UserId }
//         );

//         const user = AllInfo.records[0].get("u").properties;
//         const takenQuizzes = AllInfo.records[0].get("takenQuizzes");
//         const trackQuizzes = AllInfo.records[0].get("trackQuizzes");
//         const hasTakenTrackQuiz = AllInfo.records[0].get("hasTakenTrackQuiz");

//         res.status(200).json({ 
//             Message: "DONE", 
//             user, 
//             takenQuizzes, 
//             trackQuizzes,
//             hasTakenTrackQuiz 
//         });
//     } catch (error) {
//         console.error('Error fetching marks and grades:', error);
//         next(error);
//     } finally {
//         if (session) {
//             await session.close();
//         }
//     }
// };


export const GetALLMarksAndGrades = async (req, res, next) => {
    const UserId = req.authUser._id;

    let session;
    const driver = await Neo4jConnection();
    session = driver.session();

    try {
        const AllInfo = await session.run(
            `MATCH (u:User {_id: $UserId})
             OPTIONAL MATCH (u)-[took:TOOK]->(quiz:Skill)
             OPTIONAL MATCH (u)-[tookTrack:TOOK_TRACK_QUIZ]->(trackQuiz:Job)
             RETURN 
             [quiz IN COLLECT(DISTINCT {
                QuizName: quiz.name, 
                TotalQuestions: took.TotalQuestions,
                Grade: took.Grade, 
                Pass: took.Pass 
             }) WHERE quiz.QuizName IS NOT NULL] AS takenQuizzes,
             [trackQuiz IN COLLECT(DISTINCT {
                TrackId: trackQuiz.Nodeid, 
                TrackName: trackQuiz.name,
                Grade: tookTrack.Grade, 
                TotalQuestions: tookTrack.TotalQuestions, 
                Pass: tookTrack.Pass 
             }) WHERE trackQuiz.TrackId IS NOT NULL] AS trackQuizzes,
             EXISTS((u)-[:TOOK_TRACK_QUIZ]->(:Job)) AS hasTakenTrackQuiz`,
            { UserId }
        );

        const takenQuizzes = AllInfo.records[0].get("takenQuizzes");
        const trackQuizzes = AllInfo.records[0].get("trackQuizzes");
        const hasTakenTrackQuiz = AllInfo.records[0].get("hasTakenTrackQuiz");

        res.status(200).json({ 
            Message: "DONE", 
            takenQuizzes, 
            trackQuizzes,
            hasTakenTrackQuiz 
        });
    } catch (error) {
        console.error('Error fetching marks and grades:', error);
        next(error);
    } finally {
        if (session) {
            await session.close();
        }
    }
};



//Add CareerGoal
export const AddCareerGoal = async (req, res, next) => {
    const { CareerGoalId } = req.query;
    const UserId = req.authUser._id;
    let session;
    
    const driver = await Neo4jConnection();
    session = driver.session();
    // Check if career goal exists
    const CheckTrackExist = await session.run(
        `MATCH (c:Job { Nodeid: $careerGoalId })
        RETURN COUNT(c) AS count, c.name AS jobName`,
        { careerGoalId: CareerGoalId }
    );

    const count = CheckTrackExist.records[0].get("count").toNumber();
    if (count === 0) {
        return next(new Error("Career goal not found"), { cause: 400 });
    }

    const jobName = CheckTrackExist.records[0].get("jobName");

    // Update the user node with the career goal
    const userCareer = await session.run(
        `MATCH (u:User { _id: $userId, status: 'Online' })
        SET u.CareerGoal = [$jobName, $careerGoalId]
        RETURN u`,
        { userId: UserId, jobName: jobName, careerGoalId: CareerGoalId }
    );

    // Access the first record (assuming only one record is returned)
    const updatedUser = userCareer.records[0].get("u").properties;

    await session.close();
    // Return the updated user
    return res
        .status(200)
        .json({ message: "Career goal updated successfully", user: updatedUser });
};

//Add skills
export const AddSkills = async (req, res, next) => {
    const { Skills } = req.body;
    const UserId = req.authUser._id;

    // Create a new session
    const driver = await Neo4jConnection();
    const session = driver.session();

    // Check if Skills array is empty
    if (!Skills || Skills.length === 0) {
        return res.status(400).json({ error: "Skills array is empty" });
    }

    // Query to check if all NodeIds exist in the database
    const checkNodeIdsQuery = await session.run(
        `
            MATCH (s:Skill)
            WHERE s.Nodeid IN $skillNodeIds
            RETURN COUNT(s) AS count
            `,
        { skillNodeIds: Skills } // Use the Skills array directly
    );

    const count = checkNodeIdsQuery.records[0].get("count").toNumber();

    if (count !== Skills.length) {
        return res
            .status(404)
            .json({ error: "One or more NodeIds not found in the database" });
    }
    // Fetch names of skills
    const fetchSkillsQuery = await session.run(
        `
            MATCH (s:Skill)
            WHERE s.Nodeid IN $skillNodeIds
            RETURN s.Nodeid AS Nodeid, s.name AS name
            `,
        { skillNodeIds: Skills }
    );

    const skillsWithName = fetchSkillsQuery.records.map((record) => {
        return {
            Nodeid: record.get("Nodeid"),
            name: record.get("name"),
        };
    });
    console.log(skillsWithName);
    const skillNames = skillsWithName.map((skill) => skill.name);

    // Add skills array to the user node as an array of objects
    const addUserSkillsQuery = await session.run(
        `
            MATCH (u:User { _id: $userId, status: 'Online' })
            SET u.skills = $skillNames
            WITH u
            UNWIND $skills AS skill
            MATCH (s:Skill { Nodeid: skill.Nodeid })
            MERGE (u)-[:HAS_SKILL]->(s)
            `,
        { userId: UserId, skillNames: skillNames, skills: skillsWithName }
    );

    // Close the session
    await session.close();

    // Handle the result as needed
    res.status(200).json({ message: "Skills added successfully" });
};
// //Recommend GapSkills in CareerGoal
export const GapSkills = async (req, res, next) => {
    const UserId = req.authUser._id;
    let session;
    const driver = await Neo4jConnection();
    session = driver.session();

    const GapSkillsQuery = await session.run(`
        MATCH (u:User {_id: $userId})-[:HAS_SKILL]->(userSkill)
        MATCH (job:Job {Nodeid: u.CareerGoal[1]})
        OPTIONAL MATCH (job)-[:REQUIRES]->(relatedJob:Job)
        WITH u, job, COLLECT(DISTINCT relatedJob) AS relatedJobs
        UNWIND relatedJobs + job AS j
        MATCH (j)-[:REQUIRES]->(s:Skill)
        WHERE NOT (u)-[:HAS_SKILL]->(s)
        RETURN DISTINCT s.name AS gapSkill, 
                        CASE WHEN EXISTS((j)-[:REQUIRES {mandatory: true}]->(s))
                             THEN true
                             ELSE false
                        END AS mandatory
        `,
        { userId: UserId }
    );

    // Extract gap skills from the query result
    const gapSkills = GapSkillsQuery.records.map((record) => {
        return {
            Skill: record.get("gapSkill"),
            mandatory: record.get("mandatory") === true, // Convert to boolean
        };
    });

    await session.close();

    // Return the gap skills as JSON
    res.status(200).json({ gapSkills });
};


//recommend tracks According to the user skills
export const RecommendTracks = async (req, res, next) => {
    const userId = req.authUser._id; // Ensure consistent naming convention

    let session;
    const driver = await Neo4jConnection();
    session = driver.session();

    const result = await session.run(
        `
            MATCH (user:User {_id: $userId})-[:HAS_SKILL]->(skill:Skill)
            MATCH (job:Job)-[:REQUIRES]->(skill)
            RETURN DISTINCT job
        `,
        { userId: userId }
    );

    const jobs = result.records.map((record) => record.get("job").properties);
    if (jobs.length === 0) {
        return next(new Error("No jobs found requiring the users skills"), {
            cause: 404,
        });
    }
    res.status(200).json({ Message: "done", jobs });
    session.close(); // Close the session in the finally block
};


// Get All User Profile Skills and Feedbacks
export const GetUserDetails = async (req, res, next) => {
    const UserID = req.authUser._id;
    let session;
    const driver = await Neo4jConnection();
    session = driver.session();

    const query = `
    MATCH (u:User {_id: $UserID})
    OPTIONAL MATCH (u)-[:HAS_SKILL]->(s:Skill)
    OPTIONAL MATCH (u)-[:GAVE_FEEDBACK]->(f:Feedback)
    WITH u, collect(DISTINCT s) as skills, collect(DISTINCT f) as feedbacks
    RETURN u, skills, feedbacks;
    `;
    try {
        const result = await session.run(query, { UserID });

        if (result.records.length === 0) {
            return next(new Error("User not found", { cause: 404 }));
        }

        const userRecord = result.records[0];
        const user = userRecord.get("u").properties;
        const skills = userRecord.get("skills").map((skill) => skill.properties);
        const feedbacks = userRecord.get("feedbacks").map((feedback) => {
            let feedbackProps = feedback.properties;

            // Convert Neo4j datetime object to JavaScript Date object for createdAt and updatedAt
            feedbackProps.createdAt = convertNeo4jDatetimeToISO(feedbackProps.createdAt);
            feedbackProps.updatedAt = convertNeo4jDatetimeToISO(feedbackProps.updatedAt);

            return feedbackProps;
        });

        const userDetails = {
            ...user,
            skills: skills,
            feedbacks: feedbacks,
        };

        res.status(200).json(userDetails);
    } catch (error) {
        console.error(error);
        return next(new Error("Internal Server Error"), { cause: 500 });
    } finally {
        if (session) {
            await session.close();
        }
    }
};
//Track User's Progress Only Mandatoury Skills
export const CareerGoalUserProgress = async (req, res, next) => {
    const userId = req.authUser._id;
    let session;
    const driver = await Neo4jConnection();
    session = driver.session();

    //Get CareerGoal
    const Nodes = await session.run(
        `MATCH (user:User { _id: $userId})
        RETURN user.CareerGoal AS CareerGoal`,
        { userId }
    );
    const careerGoalArray = Nodes.records[0].get("CareerGoal");
    //Get the id of the CareerGoal
    const careerGoalId = careerGoalArray[1]; 
    console.log(careerGoalId);
    //Track Progress
    const skillNodes = await session.run(
        `MATCH (j:Job {Nodeid: $careerGoalId})
        MATCH (j)-[r:REQUIRES]->(s:Skill)
        WHERE r.mandatory = true
        WITH s, count(s) AS count
        RETURN s, count`,
        { careerGoalId }
    );

    const skills = skillNodes.records.map((record) => record.get("s").properties);
    const counts = skillNodes.records.map((record) =>
        record.get("count").toNumber()
    );
    const totalCount = counts.reduce((sum, count) => sum + count, 0);

    const results = {
        skills,
        totalCount,
    };

    // console.log(results);
    const userSkillCountNodes = await session.run(
        `MATCH (u:User { _id: $userId })-[:TOOK { Pass: true }]->(s:Skill)<-[:REQUIRES]-(j:Job { Nodeid: $careerGoalId })
        RETURN count(s) AS userSkillCount`,
        { userId, careerGoalId }
    );
    
    
    const userSkillCount = userSkillCountNodes.records[0].get("userSkillCount").toNumber();

    const userProgress = (userSkillCount / totalCount) * 100;
    console.log(userProgress);
    res.status(200).json({ "Your Progress is" : userProgress +"%"});
};

//Get All User Profile Skills
export const GetALLUserSkills = async (req, res, next) => {
    const UserID = req.authUser._id;
    let session;
    

        const driver = await Neo4jConnection();
        session = driver.session();

        const query = `
            MATCH (u:User {_id: $UserID})
            OPTIONAL MATCH (u)-[r:HAS_SKILL]->(s:Skill)
            RETURN collect(s) as skills
        `;

        const result = await session.run(query, { UserID });

        if (result.records.length === 0) {
            await session.close();
            return res.status(404).json({ message: 'User not found' });
        }

        const skills = result.records[0].get('skills').map(skill => skill.properties);

        await session.close();

        res.status(200).json({ skills });
};

//Add FeedBack on Career-y
export const AddFeedBack = async (req, res, next) => {
    const { feedback } = req.body;
    const UserId = req.authUser._id;
    let session;
    const driver = await Neo4jConnection();
    session = driver.session();
    if(!feedback){
        return next(new Error("Feedback is required"), { cause: 400 });
    }
    const checkResult = await session.run(
        `MATCH (u:User { _id: $UserId })-[:GAVE_FEEDBACK]->(f:Feedback)
         RETURN f`,
        { UserId }
      );
  
      if (checkResult.records.length > 0) {
        return next(new Error("You have already provided a feedback", { cause: 400 }));
      }
    const FeedbackId = uuidv4();
    const result = await session.run(
        `MATCH (u:User { _id: $UserId })
         CREATE (f:Feedback { feedback: $feedback, createdAt: datetime(),FeedbackId: $FeedbackId  })
         CREATE (u)-[:GAVE_FEEDBACK]->(f)
         RETURN f`,
        { UserId, feedback,FeedbackId}
      );
  
      if (result.records.length === 0) {
        return next(new Error("User not found", { cause: 404 }));
      }
  
      const createdFeedback = result.records[0].get('f');
      res.status(201).json({ Message: "Feedback Added Successfully"});
    }

//Update FeedBack on Career-y
export const UpdateFeedBack = async (req, res, next) => {
    const { feedback } = req.body;

    const UserId = req.authUser._id;
    let session;
    const driver = await Neo4jConnection();
    session = driver.session();
    if(!feedback){
        return next(new Error("Feedback is required"), { cause: 400 });
    }
    // Update the existing feedback
    const result = await session.run(
        `MATCH (u:User { _id: $UserId })-[:GAVE_FEEDBACK]->(f:Feedback)
         SET f.feedback = $feedback, f.updatedAt = datetime()
         RETURN f`,
        { UserId, feedback }
    );

    if (result.records.length === 0) {
        return next(new Error("Feedback not found or you're not authorized to update this feedback", { cause: 404 }));
    }

    const updatedFeedback = result.records[0].get('f').properties;
    res.status(200).json({Message:"Feedback Updated Successfully"});

}


//Add Rate on Course TOBE
// export const AddRate = async (req, res, next) => {
//     const { rate } = req.body;
//     // Validate rate
//     if (rate < 1 || rate > 5) {
//         return next(new Error("Rate must be between 1 and 5"), { cause: 400 });
//     }

//     const UserId = req.authUser._id;
//     let session;
//     const driver = await Neo4jConnection();
//     session = driver.session();
// }






// export const GapSkills = async (req, res, next) => {
//     const UserId = req.authUser._id;
//     let session;
//     const driver = await Neo4jConnection();
//     session = driver.session();

//     const GapSkillsQuery = await session.run(
//         `
//     MATCH (u:User {_id: $userId})-[:HAS_SKILL]->(userSkill)
// MATCH (job:Job {Nodeid: u.CareerGoal[1]})-[:REQUIRES]->(Skill)
// WHERE NOT (u)-[:HAS_SKILL]->(Skill)
// RETURN DISTINCT Skill.name AS gapSkill, 
//                 CASE WHEN EXISTS((job)-[:REQUIRES {mandatory: true}]->(Skill))
//                      THEN true
//                      ELSE false
//                 END AS mandatory

// `,
//         { userId: UserId }
//     );

//     // Extract gap skills from the query result
//     // const gapSkills = GapSkillsQuery.records.map(record => record.get('gapSkill'));
//     const gapSkills = GapSkillsQuery.records.map((record) => {
//         return {
//             Skill: record.get("gapSkill"),
//             mandatory: record.get("mandatory") === true, // Convert to boolean
//         };
//     });

//     await session.close();

//     // Return the gap skills as JSON
//     res.status(200).json({ gapSkills });
// };