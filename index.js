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
    cookie: { secure: false } // Set secure to true in production (HTTPS)
}));

initiateApp(App,express)
