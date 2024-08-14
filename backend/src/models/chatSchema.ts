import mongoose from "mongoose";


const chatModel = new mongoose.Schema({
    sender: {
        type: Object,
        required: true
    },
    recipient:{
        type:Object,
        required:true,
    },
    message:{
        type:String,
        required:true
    },
    Time: {
        type: String,
        default:null
    },
    type:{
        type:String,
        require:true   
    }
})


export const chatSchema = mongoose.model('Chat', chatModel)
                            