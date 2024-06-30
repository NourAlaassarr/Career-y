import request from 'supertest';
import App from './index.js';

describe('Express App Tests', () => {
    it('should return 200 for the home route', async () => {
        const res = await request(App).get('/');
        expect(res.status).toBe(200);
        expect(res.text).toBe("Home");
    });

    it('should return 404 for an unknown route', async () => {
        const res = await request(App).get('/unknown-route');
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ Message: '404 URL Not Found' });
    });

    // Add more tests for other routes as needed
});



