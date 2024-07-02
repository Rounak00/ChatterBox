const expressAsyncHandler = require("express-async-handler");
const Message = require("../model/messageModel");
const User = require("../model/userModel");
const Chat = require("../model/chatModel");

const allMessages=expressAsyncHandler(async(req,res)=>{
    try{
        const message=await Message.find({chat:req.params.chatId}).populate("sender","name pic email").populate("chat");

        res.json(message);
    }catch(error){
        throw new Error(error.message);
    }
})

const sendMessage=expressAsyncHandler(async(req,res)=>{
    const  {content,chatId}=req.body;
    if(!chatId || !content){
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }
    var newMessage={
        sender:req.user._id,
        content:content,
        chat:chatId
    }
    try{
        var message=await Message.create(newMessage);

        message=await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
          path: "chat.users",
          select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };
