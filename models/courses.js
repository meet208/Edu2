const mongoose=require('mongoose');
var CourseSchema= new mongoose.Schema({
    title:String,
    description:String,
    timestamp: { type: Date, default: Date.now },
    likes:{ type:Number, default:0 },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    instructor:String,
    aboutInstructor:String,
    price:Number, 
    imageUrl:String,
    videoUrl:String,
    fileName:String,
    enrolledUsers:{ type:Number, default:0 },
    watchHours:Number,
    isLive:{type:Boolean, default:0}
});
module.exports=mongoose.model('Course',CourseSchema);


