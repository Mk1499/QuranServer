import mongoose from 'mongoose'; 

const teacherSchema = mongoose.Schema({
    // _id : mongoose.Schema.Types.ObjectId,
    email:{
        type:String,
        required:true
    }, 
    name:{
        type:String,
        required:true
    }, 
    arName:{
        type:String,
    }, 
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        required:false,
        default:"https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
    }, 
    samples:[{
        type:mongoose.Schema.Types.ObjectId , ref:'Sample'
    }], 
    students:[{
        type:mongoose.Schema.Types.ObjectId , ref:'Student'
    }],
    reviews:[{
        type:mongoose.Schema.Types.ObjectId , ref:'Review'
    }],
    price:{
        type:Number,
        default:0
    }, 
    role:{
        type:String
    }

   
})

export default mongoose.model('Teacher',teacherSchema); 