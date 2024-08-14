import jwt from 'jsonwebtoken'
import { studentSchema } from '../../models/studentSchema';
import { instructorSchema } from '../../models/instructorSchema';
import { ObjectId } from 'mongoose';
import { chatSchema } from '../../models/chatSchema';


export const verifyUser = async (token: any): Promise<any> => {
        
    try {
        let decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        if (decoded && typeof decoded !== 'string' && 'userId' in decoded && 'role' in decoded){
            const userId = decoded.userId;
            const role = decoded.role;
            if (role === 'Student') {
                const user:any = await studentSchema.findById(userId);
                return {user,role}
            } else if (role === 'Instructor') {
                console.log('InstructorAuth in socket')
                const user:any = await instructorSchema.findById(userId);
                
                return {user,role}
            }
        }

        throw new Error('Invalid token');
    } catch (error) {
        throw new Error('Invalid token');
    }
}

export const saveMessageToDatabase = async (sender:any, recipient:any, message: string,Time:string,type:string): Promise<any | null> => {
    const newChat = await chatSchema.create({ sender,recipient,message,Time,type})
    return newChat

}