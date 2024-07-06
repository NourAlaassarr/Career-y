import express from 'express'
import { initiateApp } from "./src/utils/initiateApp.js";
import { config } from "dotenv"
import path from 'path'
import session from 'express-session';
config({ path: path.resolve('./config/Config.env') })
const App = express()


App.use(session({
    secret: '1234gsshjjdnnsdekekhwekhdl', // Replace with a random string (used to sign the session ID cookie)
    resave: false,
    saveUninitialized: true,
    cookie: { cookie: {
        maxAge: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    } }
}));

// App.get('/', (req, res) => {
//     res.send('Home route works!');
//   });
  
//   App.get('/test', (req, res) => {
//     res.send('Test route works!');
//   });
  
//   const port = process.env.PORT || 3000;
//   App.listen(port, () => {
//     console.log(`Server running on port ${port}`);
//   });
App.use((err, req, res, next) => {
    console.error('Runtime error:', err);
    res.status(500).send('Something went wrong!');
  });
initiateApp(App,express)
// export default App; 