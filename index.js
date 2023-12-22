import  express  from "express";
import { initiateApp } from "./src/utils/initiateApp.js";
import { config } from "dotenv"
import path from 'path'
config({ path: path.resolve('./config/Config.env') })
const App = express()

initiateApp(App,express)
