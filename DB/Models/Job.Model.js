import { Schema ,model } from "mongoose";

const jobSchema = new Schema({
JobName:{

},
JobDetails:{

},
CompanyName:{
type:String,
},
Salary:{
type:Number,
},
JobResponsibilities:{
type:String,
},
JobRequirements:{
    type:String,
},
Jobtype:{
    type:String,
enum:['FullTime','PartTime'],
},
Location:{
    type:String,
    required:true,
},

})