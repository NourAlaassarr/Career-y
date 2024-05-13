import { session } from "neo4j-driver";
import { Neo4jConnection } from "../../../DB/Neo4j/Neo4j.js";
//UserSolveQuiz(any quiz) in Neo4j
export const Solve=async(req,res,next)=>{
    const{answer}=req.body
    const{QuizId}=req.query
    const UserId= req.authUser._id

    let session
    const driver = await Neo4jConnection();
    session = driver.session(); 
    let Grade=0;
    const Quizes=[]
    //Check if Quiz Exsits
    const ifQuizExists = await session.run(
        "MATCH (q:Quiz {_id: $QuizId}) RETURN q",
        { QuizId }
    )
    if (ifQuizExists.records.length == 0) {
        return next(new Error("Quiz does'\t exist", { cause: 400 }));
    }

    const QuizAttemps = await session.run(
        'MATCH (u:User {_id: $UserId})-[:TOOK]->(qa:Quiz {_id: $QuizId}) RETURN COUNT(qa) AS count',
        { UserId, QuizId }
    );
    
    const ISTAKEN = QuizAttemps.records[0].get("count").toNumber();

    if (ISTAKEN > 0) {
        // User has already taken the quiz
        return res.status(400).json({ Message: 'You have already taken this quiz' });
    } else {
  // Get Quiz information
    const QuizInfo = await session.run(
    'MATCH (q:Quiz {_id: $QuizId}) RETURN q.name AS QuizName',
    { QuizId }
);

const QuizName = QuizInfo.records[0].get("QuizName");

// Calculate Grade
const QuizAnswersResult = await session.run(
    "MATCH (q:Quiz {_id: $QuizId})-[:CONTAINS]->(question:Question) RETURN COLLECT(question.answer) AS answers",
    { QuizId }
);

const QuizAnswers = QuizAnswersResult.records[0].get("answers");


for (let i = 0; i < QuizAnswers.length; i++) {
    if (QuizAnswers[i] === answer[i]) {
    
        Grade++;
    }
}
 // Update user node with quiz results and create relationship
const result = await session.run(
    'MATCH (u:User {_id: $UserId}), (q:Quiz {_id: $QuizId}) ' +
    'CREATE (u)-[:TOOK { QuizName: $QuizName, Grade: $Grade }]->(q)',
    { UserId, QuizId, QuizName, Grade }
);

    res.status(200).json({ Message: 'Your grade is',Grade });

    }
    if (session) {
        await session.close();
    }
    

}
//UserGet All Grades+QuizName Neo4j
export const GetALLMarksAndGrades=async(req,res,next)=>{
    const UserId= req.authUser._id

    let session
    const driver = await Neo4jConnection();
    session = driver.session();

const AllInfo =await session.run( "MATCH (u:User {_id: $UserId})-[took:TOOK]->(quiz:Quiz)RETURN u, COLLECT({ QuizName: quiz.QuizName, Grade: took.Grade }) AS takenQuizzes",{
    UserId
});

console.log(AllInfo)
    const user = AllInfo.records[0].get('u').properties;
    const takenQuizzes = AllInfo.records[0].get('takenQuizzes');

    console.log('User:', user);
    console.log('Taken Quizzes:', takenQuizzes);
res.status(200).json({Message:"DONE",user,takenQuizzes})
if (session) {
    await session.close();
}
}


//Add CareerGoal
export const AddCareerGoal = async (req,res,next)=>{
    const {CareerGoalId}=req.body
    const UserId = req.authUser._id
    let session
    const driver = await Neo4jConnection();
    session = driver.session(); 
    // Check if career goal exists
    const CheckTrackExist = await session.run(
        `MATCH (c:Job { Nodeid: $careerGoalId })
        RETURN COUNT(c) AS count, c.name AS jobName`,
        { careerGoalId: CareerGoalId }
    );
    
    const count = CheckTrackExist.records[0].get('count').toNumber();
    if (count === 0) {
        return res.status(404).json({ error: 'Career goal not found' });
    }
    
    const jobName = CheckTrackExist.records[0].get('jobName');
    
    // Update the user node with the career goal
    const userCareer = await session.run(
        `MATCH (u:User { _id: $userId, status: 'Online' })
        SET u.CareerGoal = [$jobName, $careerGoalId]
        RETURN u`,
        { userId: UserId, jobName: jobName, careerGoalId: CareerGoalId }
    );
    
        // Access the first record (assuming only one record is returned)
        const updatedUser = userCareer.records[0].get('u').properties;
        
        await session.close();
        // Return the updated user
        return res.status(200).json({ message: 'Career goal updated successfully', user: updatedUser });
    }

//Add skills
export const AddSkills = async (req, res, next) => {
    const { Skills } = req.body;
    const UserId = req.authUser._id;

        // Create a new session
        const driver = await Neo4jConnection();
        const session = driver.session(); 

        // Check if Skills array is empty
        if (!Skills || Skills.length === 0) {
            return res.status(400).json({ error: 'Skills array is empty' });
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

        const count = checkNodeIdsQuery.records[0].get('count').toNumber();

        if (count !== Skills.length) {
            return res.status(404).json({ error: 'One or more NodeIds not found in the database' });
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

        const skillsWithName = fetchSkillsQuery.records.map(record => {
            return {
                Nodeid: record.get('Nodeid'),
                name: record.get('name')
            };
        });
        console.log(skillsWithName);
        const skillNames = skillsWithName.map(skill => skill.name);

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
        res.status(200).json({ message: 'Skills added successfully' });
    
}


//Recommend GapSkills in CareerGoal
export const GapSkills = async (req,res,next)=>{
    const UserId = req.authUser._id
    let session
    const driver = await Neo4jConnection();
    session = driver.session()

    const GapSkillsQuery = await session.run(`
    MATCH (u:User {_id: $userId})-[:HAS_SKILL]->(userSkill)
MATCH (job:Job {Nodeid: u.CareerGoal[1]})-[:REQUIRES]->(Skill)
WHERE NOT (u)-[:HAS_SKILL]->(Skill)
RETURN DISTINCT Skill.name AS gapSkill, 
                CASE WHEN EXISTS((job)-[:REQUIRES {mandatory: true}]->(Skill))
                     THEN true
                     ELSE false
                END AS mandatory

`, { userId: UserId });

// Extract gap skills from the query result
// const gapSkills = GapSkillsQuery.records.map(record => record.get('gapSkill'));
const gapSkills = GapSkillsQuery.records.map(record => {
    return {
        Skill: record.get('gapSkill'),
        mandatory: record.get('mandatory') === true // Convert to boolean
    };
});

await session.close();

// Return the gap skills as JSON
res.status(200).json({ gapSkills });

}
//recommend tracks According to the user skills 
export const RecommendTracks = async (req, res, next) => {
    const userId = req.authUser._id; // Ensure consistent naming convention
    let session;
    const driver = await Neo4jConnection();
    session = driver.session();

    try {
        const result = await session.run(`
            MATCH (user:User {_id: $userId})-[:HAS_SKILL]->(skill:Skill)
            MATCH (job:Job)-[:REQUIRES]->(skill)
            RETURN DISTINCT job
        `, { userId: userId });

        const jobs = result.records.map(record => record.get('job').properties);

        if (jobs.length === 0) {
            return res.status(404).json({ message: "No jobs found requiring the user's skills." });
        }

        res.json(jobs);
    } catch (error) {
        console.error("Error executing RecommendTracksQuery:", error);
        next(error); // Pass the error to the error handling middleware
    } finally {
        session.close(); // Close the session in the finally block
    }
};



//Get All UserSkills
//Recommend GapSkills in each track interestes user