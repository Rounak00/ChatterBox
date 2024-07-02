const asyncHandler=require("express-async-handler")
const User=require("../model/userModel");
const generateToken=require("../config/generateToken");
const CryptoJs=require("crypto-js")
const CRYPTO_SECRET=require("../config/secret").Salt_Secret;
const registerUser=asyncHandler(async(req,res)=>{
    const {name,email,password,pic}=req.body;
    
    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please Enter all the fields")
    }

    const userExists=await User.findOne({email});
    if(userExists){res.status(400); throw new Error("User already exists");}
    const Hash_Password=CryptoJs.AES.encrypt(password,CRYPTO_SECRET ).toString()
    const user=await User.create({name,email,password:Hash_Password,pic});
    
    if(user){
       res.status(201).json({
         _id:user._id,
         name:user.name,
         email:user.email,
         pic:user.pic,
         token:generateToken(user._id),
       })
    }else{
        res.status(400);
        throw new Error("Failed to create account");
    }
});

const loginUser=asyncHandler(async(req,res)=>{
      const {email,password}=req.body;
      const user=await User.findOne({email});
      
      if(User && (await user.matchPassword(password))){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id),
          })
      }else{
        res.status(401);
        throw new Error("Invalid Email-Id or Password");
      }
})

const allUsers=asyncHandler(async(req,res)=>{
    const keyword=req.query.search?{
       $or:[{name:{$regex:req.query.search,$options:"i"}},
            {email:{$regex:req.query.search,$options:"i"}}
      ]
    } : {};
    const users=await User.find(keyword).find({_id:{$ne:req.user._id}});
    res.send(users);
})

module.exports={registerUser,loginUser,allUsers};