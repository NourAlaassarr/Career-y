import { session } from "neo4j-driver";
import { Neo4jConnection } from "../../../DB/Neo4j/Neo4j.js";
import axios from "axios";

//Solve TopicQuiz
export const SolveQuiz = async (req, res, next) => {
    const { answer } = req.body;
    const { SkillId } = req.query;
    const UserId = req.authUser._id;
console.log(answer)

// Get current timestamp
const timestamp = new Date().toISOString();
    console.log("Current Timestamp:", timestamp);
    let session;

    const driver = await Neo4jConnection();
    session = driver.session();

    // Check if the quiz exists
    const ifQuizExists = await session.run(
        "MATCH (q:Skill {Nodeid: $SkillId}) RETURN q",
        { SkillId }
    );
    if (ifQuizExists.records.length === 0) {
        return next(new Error("Quiz does not exist", { cause: 400 }));
    }

     // Check if the user has already taken the quiz and retrieve the timestamp of the last attempt
     const quizAttemptsResult = await session.run(
        "MATCH (u:User {_id: $UserId})-[r:TOOK]->(qa:Skill {Nodeid: $SkillId}) RETURN r.timestamp AS lastAttempt",
        { UserId, SkillId }
    );

    if (quizAttemptsResult.records.length > 0) {
        const lastAttempt = quizAttemptsResult.records[0].get("lastAttempt");
        const lastAttemptDate = new Date(lastAttempt);
        const currentDate = new Date();

        console.log("Last Attempt Timestamp:", lastAttempt);
        console.log("Last Attempt Date:", lastAttemptDate);
        console.log("Current Date:", currentDate);

        // Check if 24 hours have passed since the last attempt
        const timeDifference = currentDate - lastAttemptDate;
        const hoursDifference = timeDifference / (1000 * 60 * 60);

        console.log("Hours Difference:", hoursDifference);

        if (hoursDifference < 24) {
            return next(new Error("You can retake the quiz after 24 hours", { cause: 400 }));
        } else {
            // Remove existing relationships
            await session.run(
                `
                MATCH (u:User {_id: $UserId})-[r:TOOK|PASSED|FAILED]->(q:Skill {Nodeid: $SkillId})
                DELETE r
                `,
                { UserId, SkillId }
            );
        }
    }
    const quizInfoResult = await session.run(
        "MATCH (q:Skill {Nodeid: $SkillId}) RETURN q.name AS QuizName",
        { SkillId }
    );
    const quizInfoRecord = quizInfoResult.records[0];
    const QuizName = quizInfoRecord ? quizInfoRecord.get("QuizName") : "";

    // Get Quiz information
    const quizQuestionsResult = await session.run(
        `
        MATCH (q:Skill {Nodeid: $SkillId})-[:HAS_QUESTION]->(question:Question)
        OPTIONAL MATCH (question)-[rel:HAS_OPTION]->(option:Option)
        WHERE rel.correct = true
        RETURN question.id AS questionId, option.id AS answerId
        ORDER BY question.order
        `,
        { SkillId }
    );
    
    const quizQuestions = quizQuestionsResult.records.map(record => ({
        questionId: record.get("questionId"),
        answerId: record.get("answerId")
    }));
    console.log("Quiz Name:", QuizName);
    console.log("Quiz Questions with Correct Answers:", quizQuestions);

    let Grade = 0;
    for (let i = 0; i < answer.length; i++) {
        const userAnswer = answer[i];
        const correctAnswer = quizQuestions.find(q => q.questionId === userAnswer.questionId);
        if (correctAnswer && userAnswer.answerId === correctAnswer.answerId) {
            Grade++;
        }
    }
    const totalQuestions = quizQuestions.length;
    const Pass = Grade > totalQuestions / 2;

        // Update user node with quiz results and create relationship
        let query =
            "MATCH (u:User {_id: $UserId}), (q:Skill {Nodeid: $SkillId}) " +
            "CREATE (u)-[:TOOK { QuizName: $QuizName, Grade: $Grade, TotalQuestions: $totalQuestions, Pass: $Pass,timestamp: $timestamp }]->(q)";

        if (Pass) {
            query +=
                " MERGE (u)-[:HAS_SKILL]->(q)";
        }
        
        await session.run(query, {
            UserId,
            SkillId,
            QuizName,
            Grade,
            totalQuestions,
            Pass,
            timestamp,
        });

        res.status(200).json({
            Message: "Your grade is",
            Grade,
            TotalQuestions: totalQuestions,
        });
    }
//UserGet All Grades+QuizName Neo4j
// export const GetALLMarksAndGrades = async (req, res, next) => {
//     const UserId = req.authUser._id;

//     let session;
//     const driver = await Neo4jConnection();
//     session = driver.session();

//     const AllInfo = await session.run(
//         "MATCH (u:User {_id: $UserId})-[took:TOOK]->(quiz:Skill)RETURN u, COLLECT({ QuizName: took.QuizName, Grade: took.Grade, Pass: took.Pass }) AS takenQuizzes",
//         {
//             UserId,
//         }
//     );

//     console.log(AllInfo);
//     const user = AllInfo.records[0].get("u").properties;
//     const takenQuizzes = AllInfo.records[0].get("takenQuizzes");

//     console.log("User:", user);
//     console.log("Taken Quizzes:", takenQuizzes);
//     res.status(200).json({ Message: "DONE", user, takenQuizzes });
//     if (session) {
//         await session.close();
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
             OPTIONAL MATCH (u)-[tookTrack:TOOK_TrackQuiz]->(trackQuiz:Job)
             RETURN u, 
             COLLECT({
                QuizName: quiz.name, 
                TotalQuestions: took.TotalQuestions,
                Grade: took.Grade, 
                Pass: took.Pass 
             }) AS takenQuizzes,
             COLLECT({
                TrackId: trackQuiz.Nodeid, 
                TrackName: trackQuiz.name,
                Grade: tookTrack.grade, 
                TotalQuestions: tookTrack.TotalQuestions, 
                Pass: tookTrack.pass 
             }) AS trackQuizzes`,
            { UserId }
        );

        const user = AllInfo.records[0].get("u").properties;
        const takenQuizzes = AllInfo.records[0].get("takenQuizzes");
        const trackQuizzes = AllInfo.records[0].get("trackQuizzes");


        res.status(200).json({ Message: "DONE", takenQuizzes, trackQuizzes });
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

//Recommend GapSkills in CareerGoal
export const GapSkills = async (req, res, next) => {
    const UserId = req.authUser._id;
    let session;
    const driver = await Neo4jConnection();
    session = driver.session();

    const GapSkillsQuery = await session.run(
        `
    MATCH (u:User {_id: $userId})-[:HAS_SKILL]->(userSkill)
MATCH (job:Job {Nodeid: u.CareerGoal[1]})-[:REQUIRES]->(Skill)
WHERE NOT (u)-[:HAS_SKILL]->(Skill)
RETURN DISTINCT Skill.name AS gapSkill, 
                CASE WHEN EXISTS((job)-[:REQUIRES {mandatory: true}]->(Skill))
                     THEN true
                     ELSE false
                END AS mandatory

`,
        { userId: UserId }
    );

    // Extract gap skills from the query result
    // const gapSkills = GapSkillsQuery.records.map(record => record.get('gapSkill'));
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
//Get All User Profile Skills
export const GetUserDetails = async (req, res, next) => {
    const UserID = req.authUser._id;
    let session;
    const driver = await Neo4jConnection();
    session = driver.session();
    const query = `
    MATCH (u:User {_id: $UserID})
    OPTIONAL MATCH (u)-[r:HAS_SKILL]->(s:Skill)
    RETURN u, collect(s) as skills;
`;

    const result = await session.run(query, { UserID });

    const userRecord = result.records[0];
    const user = userRecord.get("u").properties;
    const skills = userRecord.get("skills").map((skill) => skill.properties);

    const userDetails = {
        ...user,
        skills: skills,
    };

    res.status(200).json(userDetails);
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

//Add review on Course
