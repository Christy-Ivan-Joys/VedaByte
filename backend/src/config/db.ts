import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
export const connectDB=  async()=>{
    try {
        
        const connectionString = process.env.MONGO_URL ? process.env.MONGO_URL : ''
        
        const connect = await  mongoose.connect(connectionString,{

        })
        console.log('Database connected successfully')
    } catch (error) {
         console.log('error in database connection',error)
    }           
}               
