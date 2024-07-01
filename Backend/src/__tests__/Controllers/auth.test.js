import { SignUp } from '../../Modules/Auth/Auth.Controllers.js';
import { v4 as uuidv4 } from 'uuid';
import { Neo4jConnection } from '../../../DB/Neo4j/Neo4j.js';

// Mock Neo4jConnection
jest.mock('../../../DB/Neo4j/Neo4j.js');

// Mock request object
const request = {
    body: {
        UserName: "test",
        Email: "test@gmail.com",
        password: "test",
        ConfirmPassword: "test"
    }
};

// Mock response object
const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
};

describe('SignUp Controller', () => {
    it('Should send a status code 400 when user exists', async () => {
        // Mock Neo4jConnection run method to simulate existing user
        Neo4jConnection.run.mockImplementation(async (query, params) => {
            if (query.includes('MATCH (u:User {Email: $Email})')) {
                // Simulate user already exists
                return { records: [{ get: () => ({ email: 'test@gmail.com' }) }] };
            }
            return { records: [] };
        });

        // Call the SignUp function with the mocked request and response
        await SignUp(request, response);

        // Assert the response status and json
        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });
});
