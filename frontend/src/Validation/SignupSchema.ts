import { z } from 'zod'



const signupSchema = z.object({
    firstname: z.string().min(1, 'firstname is required'),
    lastname: z.string().min(1, 'lastname is required'),
    email: z.string().email('Invalid email address'),
    contact: z.string().regex(/^\d{10}$/, 'Contact must atleast 10 digit number'),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character'),
    confirmPassword: z.string().min(8,'confirm password must be atleast 8 characters')
}).refine(data=>data.password === data.confirmPassword,{
    message:'Passwords dont match',
    path:['confirmPassword'],
})
export default signupSchema
