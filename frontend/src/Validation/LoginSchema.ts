import {z} from 'zod'


export const gmailSchema = z.object({
    email:z.string().email('Enter a valid email')
})

const LoginSchema = z.object({
    email:z.string().email('enter a valid email'),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character'),
})
export default LoginSchema