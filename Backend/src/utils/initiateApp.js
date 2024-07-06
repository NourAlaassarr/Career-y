import {GlobalResponse} from './ErrorHandling.js'
// import {DBconnection}  from '../../DB/connections.js'
import * as router from '../Modules/index.Routes.js'
import { gracefulShutdown } from 'node-schedule'
import{notificationJob} from './Crons.js'

import cors from 'cors'
// import connectDB from '../../DB/Neo4j/Neo4j.js';
// import { driver } from 'neo4j-driver'
import {Neo4jConnection}from'../../DB/Neo4j/Neo4j.js'

export const initiateApp= async(App,express)=>{
    const Port =process.env.PORT || 5000
    App.use(express.json())
    App.use(express.urlencoded({ extended: true }));
    App.use(cors()) // allow anyone

    await Neo4jConnection()
    // DBconnection()
    App.use('/Auth',router.AuthRoutes)
    App.use('/Quiz',router.QuizRoutes)
    App.use('/Job',router.JobRoutes)
    App.use('/User',router.UserRoutes)
    App.use('/Roadmap',router.RoadmapsRoutes)
    App.use('/Test',router.TestRoutes)
    App.use('/JobOffer',router.JobOfferRoutes)
    App.use('/Course',router.CourseRoutes)
    App.use('/Admin',router.AdminRoutes)
    App.all('*',(req,res,next)=> res.status(404).json({Message:'404  URL Not Found'}))

    App.use(GlobalResponse)
    App.use((err ,req,res,next)=>{
        if(err){
            //cause
            return res.status(err['cause'] || 500).json({Message:err.Message})
        }
    })
    App.get('/',(req,res)=>res.send("Home"))
    
    //Crons
    notificationJob();
   const server= App.listen(Port,()=>{
        console.log(`---------------Server is Running on port number ${Port} !---------------`)
    })
    return server;
   
}

