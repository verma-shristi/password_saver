const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
mongoose.connect("mongodb+srv://admin:lf@123Shristi@cluster0.ibnzh.mongodb.net/authDB?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
});
var db = mongoose.connection;
if(!db){
    console.log("error");
}
else{
    console.log("connected");
}
const passwordSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    domain:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});
const paswrd = mongoose.model("password",passwordSchema);
module.exports=paswrd;