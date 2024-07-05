import express from 'express'
import { initiateApp } from "./src/utils/initiateApp.js";
import { config } from "dotenv"
import path from 'path'
import session from 'express-session';
import Neo4jStore from "./DB/Neo4j/Neo4j-store.js"
config({ path: path.resolve('./config/Config.env') })
const App = express()


// Session Configuration
App.use(session({
    store: new Neo4jStore({
      uri: 'neo4j+s://65fa83cd.databases.neo4j.io',
      user: 'neo4j',
      password: 'J3Za7a-_2F3uoUdBSFFMEGN57kHoS_2-vAz_l1kTCKU'
    }),
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: false // Set to true if using HTTPS
    }
  }))
initiateApp(App,express)
export default App; 