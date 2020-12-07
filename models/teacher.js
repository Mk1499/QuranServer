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

   
})

export default mongoose.model('Teacher',teacherSchema); 