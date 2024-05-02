import mongoose from "mongoose";

export const DBconnection = async()=>{
    //"mongodb://127.0.0.1:27017/Career-y"
    return await mongoose.connect(process.env.DB_CONNECTION_URL_CLOUD)
    .then((res)=>console.log('Connection has been established successfully.'))
    .catch((err)=>console.log('Unable to connect to the database.',err))
}
