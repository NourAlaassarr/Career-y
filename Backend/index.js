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


initiateApp(App,express)
export default App; 