import {scheduleJob} from 'node-schedule'
import { sendNotification}from '../Modules/Jobs/Job.Controllers.js'
// import moment from 'moment'
import moment  from 'moment-timezone'
// export const job = () =>{
//     scheduleJob('* * * * * *', function () {
//     console.log('The answer to life, the universe, and everything!');}
// )};


// Cron job for sending notifications
export const notificationJob = () => {
    scheduleJob('0 0 * * *', async function () { // This runs at midnight every day
        console.log('Running the sendNotification cron job');
        
        // Mock request, response, and next objects
        const req = {};
        const res = {
            json: (message) => console.log(message)
        };
        const next = (error) => console.error(error);

        try {
            await sendNotification(req, res, next);
        } catch (error) {
            console.error('Error running the cron job:', error);
        }
    });
};