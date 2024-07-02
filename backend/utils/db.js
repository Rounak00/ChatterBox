const mongoose= require("mongoose")
const DB_URL=require("../config/secret").DB_URL;

const ConnectDB=async()=>{
    try{
        const Conn=await mongoose.connect(DB_URL)
        console.log(`MongoDB connected : ${Conn.connection.host}`)
    }catch(error){
        console.log(`Error: ${error.message}`)
    }
};

module.exports=ConnectDB;