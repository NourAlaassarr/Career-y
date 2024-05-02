import neo4j from 'neo4j-driver';

const URI = 'neo4j+s://65fa83cd.databases.neo4j.io';
const USER = 'neo4j';
const PASSWORD = 'J3Za7a-_2F3uoUdBSFFMEGN57kHoS_2-vAz_l1kTCKU';

const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

export const Neo4jConnection = async () => {
    try {
        await driver.verifyConnectivity();
        console.log('Connected to Neo4j successfully.');
        return driver;
    } catch (error) {
        console.error('Unable to connect to Neo4j:', error);
        throw error;
    }
};
// connection.js
// import neo4j from 'neo4j-driver';

// let driverInstance = null;

// export const connectDB = async () => {
//   try {
//     if (driverInstance) {
//       console.log('Using existing connection to Neo4j');
//       return driverInstance;
//     }

//     const URI = 'neo4j+s://65fa83cd.databases.neo4j.io';
//     const USER = 'neo4j';
//     const PASSWORD = 'J3Za7a-_2F3uoUdBSFFMEGN57kHoS_2-vAz_l1kTCKU';

//     const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

//     await driver.verifyConnectivity();
//     console.log('Connected to Neo4j successfully');

//     driverInstance = driver;
//     return driver;
//   } catch (error) {
//     console.error('Failed to connect to Neo4j:', error.message);
//     throw error;
//   }
// };

// const neo4jDriver = await connectDB();  // Initialize the driver

// export { neo4jDriver };  // Export the initialized driver
// export default connectDB