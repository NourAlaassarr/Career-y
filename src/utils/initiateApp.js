import {GlobalResponse} from './ErrorHandling.js'
import {DBconnection}  from '../../DB/connections.js'
import * as router from '../Modules/index.Routes.js'
import { gracefulShutdown } from 'node-schedule'
import{changeCouponStatus} from './Crons.js'
import cors from 'cors'


export const initiateApp=(App,express)=>{
    const Port =process.env.PORT || 5000
    App.use(express.json())
    
    App.use(cors()) // allow anyone
    DBconnection()
    
    App.use('/Auth',router.AuthRoutes)
    
    App.all('*',(req,res,next)=> res.status(404).json({Message:'404  URL Not Found'}))

    App.use(GlobalResponse)
    App.use((err ,req,res,next)=>{
        if(err){
            //cause
            return res.status(err['cause'] || 500).json({Message:err.Message})
        }
    })
    App.get('/',(req,res)=>res.send("Home"))
    App.listen(Port,()=>{
        console.log(`---------------Server is Running on port number ${Port} !---------------`)
    })
}

