
import { v4 as uuidv4 } from 'uuid';
import { Neo4jConnection } from "../../../DB/Neo4j/Neo4j.js";
import { sendmailService } from '../../Services/SendEmailService.js'
import { SystemRoles } from '../../utils/SystemRoles.js';
import { Session } from 'neo4j-driver';


//Add Course 
export const AddCourse = async (req, res, next) => {
    let session;

        const driver = await Neo4jConnection();
        session = driver.session();

        const { JobId } = req.query;
        const { CourseName, CourseDescription, Duration, prerequisites, language, Courselink } = req.body;
        const UserId = req.authUser._id;
        const UserRole = req.authUser.role;

        // Check for missing required fields
        if (!CourseName || !CourseDescription || !Duration || !prerequisites || !language) {
            return next(new Error("Missing required fields", { cause: 404 }));
        }

        // Check if jobId exists
        const CheckJob = await session.run(
            `MATCH (j:Job {Nodeid: $JobId}) RETURN j`,
            { JobId }
        );
        if (CheckJob.records.length === 0) {
            return next(new Error("Job doesn't Exist", { cause: 404 }));
        }

        // Check if the course already exists
        const CourseResult = await session.run(
            `MATCH (c:Course {CourseName: $CourseName}) RETURN c`,
            { CourseName }
        );
        if (CourseResult.records.length > 0) {
            return next(new Error("Course Already Exists", { cause: 400 }));
        }

        // Create a new course
        const CourseId = uuidv4();

        if (UserRole === SystemRoles.User) {
            const AddCourseAndRelationshipQuery = `
            MATCH (u:User {_id: $UserId})
            CREATE (u)-[:COURSE_OWNER]->(c:Course {
                CourseId: $CourseId, 
                CourseName: $CourseName, 
                CourseDescription: $CourseDescription, 
                Duration: $Duration, 
                prerequisites: $prerequisites, 
                language: $language, 
                Courselink: $Courselink,
                Approved: false
            })
            RETURN c
        `;
        const AddCourseAndRelationshipParams = { 
            UserId, 
            CourseId, 
            CourseName, 
            CourseDescription, 
            Duration, 
            prerequisites, 
            language, 
            Courselink 
        };


        // Run the combined course creation and relationship query
        const result = await session.run(AddCourseAndRelationshipQuery, AddCourseAndRelationshipParams);
    //      // Create a relationship between the Job and the course
    //      const relationshipQuery = `
    //      MATCH (j:Job {Nodeid: $JobId}), (c:Course {CourseId: $CourseId})
    //      CREATE (j)-[:RELATED_COURSE]->(c)
    //  `;
    //  const relationshipParams = { JobId, CourseId: CourseId };

    //  // Run the relationship creation query
    //  await session.run(relationshipQuery, relationshipParams);
        if (result.records.length === 0) {
            return next (new Error('Course creation or relationship creation failed. No records returned.')) 
        }

        } 
        else if (UserRole === SystemRoles.Admin) {
            const AddCourseQuery = `
                CREATE (c:Course {
                    CourseId: $CourseId, 
                    CourseName: $CourseName, 
                    CourseDescription: $CourseDescription, 
                    Duration: $Duration, 
                    prerequisites: $prerequisites,
                    language: $language, 
                    Courselink: $Courselink,
                    Approved: true
                })
                RETURN c
            `;
            const AddCourseParams = { CourseId, CourseName, CourseDescription, Duration, prerequisites, language, Courselink };

            // Run the course creation query
            const courseResult = await session.run(AddCourseQuery, AddCourseParams);
        }
         // Create a relationship between the Job and the course
        const relationshipQuery = `
        MATCH (j:Job {Nodeid: $JobId}), (c:Course {CourseId: $CourseId})
        CREATE (j)-[:RELATED_COURSE]->(c)
    `;
    const relationshipParams = { JobId, CourseId };
    const relationshipResult = await session.run(relationshipQuery, relationshipParams);

        // Return a success response
        res.status(200).json({ message: "Course added successfully" });
        await session.close();
        
};

//delete course
export const DeleteCourse = async(req,res,next)=>{
    const{CourseId}=req.query
    let session;
    const driver = await Neo4jConnection(); 
    session = driver.session();

    const   DeleteResult = await session.run("MATCH (n:Course {CourseId: $CourseId}) RETURN n", { CourseId });

        if (DeleteResult.records.length === 0) {
            return next(new Error('Course not found' ,{cause:404}))
        }

        // Execute the DELETE query
        await session.run("MATCH (n:Course {CourseId: $CourseId}) DETACH DELETE n", { CourseId });

        // Respond with success message or appropriate response
        res.status(200).json({message: 'Course deleted successfully' });
}

//Approve/Reject course(Admin)
export const ApproveCourse = async(req,res,next)=>{
    const { CourseId } = req.query;
        let session;
        const driver = await Neo4jConnection();
        session = driver.session();

        const approveCourseQuery = `
            MATCH (c:Course {CourseId: $CourseId})
            SET c.Approved = true
            RETURN c
        `;
        const approveCourseParams = { CourseId };

        // Run the update query
        const result = await session.run(approveCourseQuery, approveCourseParams);

        // Check if the course was updated
        if (result.records.length === 0) {
            return next(new Error("Course not found or update failed", { cause: 404 }));
        }
        const updatedCourse = result.records[0].get('c');

        res.status(200).json({ message: "Course approved successfully"});
}

//getall Approved Courses
export const GetALLCourses = async(req,res,next)=>{
    let session;
    const driver = await Neo4jConnection();
    session = driver.session();
    
    const getAllCoursesQuery = `
            MATCH (c:Course {Approved: true})
            RETURN c
        `;

        const result = await session.run(getAllCoursesQuery);

        // Extract the courses from the result
        const courses = result.records.map(record => record.get('c').properties);

        // Return the courses as JSON response
        res.status(200).json({ courses });
}

export const GetALLUnapprovedCourses = async(req,res,next)=>{
    let session;
    const driver = await Neo4jConnection();
    session = driver.session();
    
    const getAllCoursesQuery = `
            MATCH (c:Course {Approved: false})
            RETURN c
        `;

        const result = await session.run(getAllCoursesQuery);

        // Extract the courses from the result
        const courses = result.records.map(record => record.get('c').properties);

        // Return the courses as JSON response
        res.status(200).json({ courses });
}

//Owner/Admin can uupdate Course
export const UpdateCourse = async(req,res,next)=>{
    const { CourseId } = req.query;
    const UserId = req.authUser._id

    const { Courselink,CourseName, CourseDescription, Duration, prerequisites, language } = req.body;
    let session;
    const driver = await Neo4jConnection();
    session = driver.session();

    // Check if Course exists
    const CourseCheckResults = await session.run(
        'MATCH (c:Course {CourseId:$CourseId}) RETURN c',
        { CourseId }
    );
    if (CourseCheckResults.records.length === 0) {
        return next(new Error("Course Doesn't exist", { cause: 404 }));
    }
        // Check if the user is authorized to update the course
        const result = await session.run(
            `
            MATCH (user:User {_id: $UserId})-[:COURSE_OWNER]->(course:Course {CourseId: $CourseId})
            RETURN user
            `,
            { UserId,CourseId }
        );

        const owner = result.records[0]?.get('user');

       // Check if the user is an admin
    const isAdmin = req.authUser.role; 
    console.log(isAdmin)

    if (!owner && isAdmin!='admin') {
        return next(new Error("Unauthorized: Only course owner or admin can update the course.", { cause: 403 })) ;
    }
    // Construct the update query dynamically
    let updateQuery = `
        MATCH (c:Course {CourseId: $CourseId})
        SET `;
    const params = { CourseId };

    const updateFields = [];
    if (CourseName) {
        updateFields.push('c.CourseName = $CourseName');
        params.CourseName = CourseName;
    }
    if (CourseDescription) {
        updateFields.push('c.CourseDescription = $CourseDescription');
        params.CourseDescription = CourseDescription;
    }
    if (Duration) {
        updateFields.push('c.Duration = $Duration');
        params.Duration = Duration;
    }
    if (prerequisites) {
        updateFields.push('c.prerequisites = $prerequisites');
        params.prerequisites = prerequisites;
    }
    if (language) {
        updateFields.push('c.language = $language');
        params.language = language;
    }
    if (Courselink) {
        updateFields.push('c.Courselink = $Courselink');
        params.Courselink = Courselink;
    }

    // Append date_modified to capture update time
    updateFields.push('c.date_modified = apoc.date.format(timestamp(), "ms", "yyyy-MM-dd HH:mm:ss")');

    updateQuery += updateFields.join(', ');

    // Run the update query
    await session.run(updateQuery, params);

    res.status(200).json({ message: "Course updated successfully" });
        
}

//get course Data
export const GetCourseDetails = async(req,res,next)=>{
    const { CourseId } = req.query;

    let session;
    const driver = await Neo4jConnection();
    session = driver.session();
    const CourseCheckResults = await session.run(
        'MATCH (c:Course {CourseId: $CourseId}) RETURN c',
        { CourseId }
    );

    if (CourseCheckResults.records.length === 0) {
        return next(new Error("Course Doesn't exist", { cause: 404 }));
    }

    const getCourseDetailsQuery = `MATCH (c:Course {CourseId: $CourseId}) RETURN c`;
        const result = await session.run(getCourseDetailsQuery, { CourseId });
        const CourseNode=result.records[0].get('c') 
        const courseData = CourseNode.properties;
        session.close();
        res.status(200).json({ Message: 'Success',courseData });
        
    
}


//recommend Course f tarck mo3yan
export const GetTrackCourses = async (req, res, next) => {
    const { TrackId } = req.query;
    let session;
    const driver = await Neo4jConnection();
    session = driver.session();

  
        const CourseCheckResults = await session.run(
            `MATCH (t:Job {Nodeid: $TrackId})-[:RELATED_COURSE]->(c:Course) RETURN c`,
            { TrackId }
        );

        if (CourseCheckResults.records.length === 0) {
            return next(new Error("Track has no related courses", { cause: 404 }));
        }

        const courses = CourseCheckResults.records.map(record => record.get('c').properties);
        res.status(200).json({ courses });
   
};

//Add Review TOBE
export const AddReview = async(req,res,next)=>{
}
