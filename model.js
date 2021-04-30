const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const cookies=require("cookie-parser")
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
const registerSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});
registerSchema.pre("save",async function(next){
    this.password =await  bcrypt.hash(this.password,10);
    next();
})
registerSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({this:this._id.toString()},"heythisissecretkeywhichis32characterslongkey");
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        throw error;
    }
}
const register = mongoose.model("register",registerSchema);
module.exports=register;