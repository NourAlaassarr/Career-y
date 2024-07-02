// // src/__tests__/auth.test.js
// import request from 'supertest';
// import app from '../../index.js'; // Ensure the path is correct
// import { Neo4jConnection } from '../../DB/Neo4j/Neo4j.js'; // Adjust the path to where your Neo4jConnection function is

// let driver;
// let session;
// let server;

// describe('Basic App Test', () => {
//   beforeAll(async () => {
//     driver = await Neo4jConnection();
//     session = driver.session();

//     // Start the server only if it's not already running
//     server = app.listen(8001, () => {
//       console.log('Test server is running on port 8001');
//     });

//     await session.run(
//       'CREATE (u:User {Email: $Email, password: $password, _id: $id, role: $role})',
//       {
//         Email: 'test@example.com',
//         password: '$2b$10$VhTl0Hj3B/eHgJUnCgx6MeJW.LuRuIMkI1X21oGqB/Kjlq0pjBLZG', // bcrypt hash for "password123"
//         id: '1',
//         role: 'user',
//       }
//     );
//   });

//   afterAll(async () => {
//     await session.run('MATCH (u:User {Email: $Email}) DELETE u', { Email: 'test@example.com' });
//     await session.close();
//     await driver.close();

//     // Wrap server.close in a Promise to ensure it completes before finishing the test
//     await new Promise((resolve, reject) => {
//       server.close((err) => {
//         if (err) {
//           console.error('Error closing the server', err);
//           reject(err);
//         } else {
//           console.log('Server closed');
//           resolve();
//         }
//       });
//     });
//   });

//   it('should respond with a 404 for unknown routes', async () => {
//     const res = await request(app).get('/unknown-route');
//     expect(res.status).toBe(404);
//   });
// });
// src/__tests__/auth.test.js
// src/__tests__/auth.test.js
import request from 'supertest';
import app from '../../index.js'; // Ensure the path is correct
import { Neo4jConnection } from '../../DB/Neo4j/Neo4j.js'; // Adjust the path to where your Neo4jConnection function is

let driver;
let session;
let server;

describe('Basic App Test', () => {
  beforeAll(async () => {
    driver = await Neo4jConnection();
    session = driver.session();

    // Start the server only if it's not already running
    server = app.listen(8001, () => {
      console.log('Test server is running on port 8001');
    });

    await session.run(
      'CREATE (u:User {Email: $Email, password: $password, _id: $id, role: $role})',
      {
        Email: 'test@example.com',
        password: '$2b$10$VhTl0Hj3B/eHgJUnCgx6MeJW.LuRuIMkI1X21oGqB/Kjlq0pjBLZG', // bcrypt hash for "password123"
        id: '1',
        role: 'user',
      }
    );
  });

  afterAll(async () => {
    await session.run('MATCH (u:User {Email: $Email}) DELETE u', { Email: 'test@example.com' });
    await session.close();
    await driver.close();

    // Wrap server.close in a Promise to ensure it completes before finishing the test
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          console.error('Error closing the server', err);
          reject(err);
        } else {
          console.log('Server closed');
          resolve();
        }
      });
    });
  });

  it('should respond with a 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.status).toBe(404);
  });
});

describe('CareerGoalUserProgress Test', () => {
  beforeAll(async () => {
    driver = await Neo4jConnection();
    session = driver.session();

    // Create test data for user and job
    await session.run(
      'CREATE (u:User {Email: $Email, password: $password, _id: $id, role: $role, CareerGoal: $careerGoal})',
      {
        Email: 'test2@example.com',
        password: '$2b$10$VhTl0Hj3B/eHgJUnCgx6MeJW.LuRuIMkI1X21oGqB/Kjlq0pjBLZG', // bcrypt hash for "password123"
        id: '2',
        role: 'user',
        careerGoal: ['goal1', 'goal2']
      }
    );

    await session.run(
      'CREATE (j:Job {Nodeid: $careerGoalId})-[:REQUIRES {mandatory: true}]->(s:Skill {name: $skillName})',
      {
        careerGoalId: 'goal2',
        skillName: 'Test Skill'
      }
    );

    await session.run(
      'MATCH (u:User {_id: $userId}), (s:Skill {name: $skillName}) CREATE (u)-[:TOOK {Pass: true}]->(s)',
      {
        userId: '2',
        skillName: 'Test Skill'
      }
    );
  });

  afterAll(async () => {
    const cleanupSession = driver.session();
    await cleanupSession.run('MATCH (u:User {Email: $Email}) DETACH DELETE u', { Email: 'test2@example.com' });
    await cleanupSession.run('MATCH (j:Job {Nodeid: $careerGoalId}) DETACH DELETE j', { careerGoalId: 'goal2' });
    await cleanupSession.run('MATCH (s:Skill {name: $skillName}) DETACH DELETE s', { skillName: 'Test Skill' });
    await cleanupSession.close();
    await driver.close();
  });

  it('should return user progress towards their career goal', async () => {
    const res = await request(app)
      .get('/User/CareerGoalUserProgress') // Adjust this route to your actual route
      .set('Authorization', 'Bearer test-token'); // Set authorization token if required

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('Your Progress is');
  });
});
