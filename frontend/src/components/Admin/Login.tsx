import { useEffect, useState } from "react"
import { ZodError } from "zod"
import { useAdminloginMutation } from "../../utils/redux/slices/adminApiSlices"
import LoginSchema from "../../Validation/LoginSchema"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

interface Formdata {
    email: string,
    password: string
}
interface ValidationErrors {
    [key: string]: string
}

export function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [Errors, setErrors] = useState<ValidationErrors>({})
    const [admilogin] = useAdminloginMutation()
    const navigate = useNavigate()
   
    useEffect(() => {
         const token = localStorage.getItem('token')
         if(token){
            navigate('/admin/dashboard')
         }else{
            navigate('/admin/login')
         }
    },[])

    const handleLogin = async (e: any) => {
        e.preventDefault()
        const data: Formdata = {
            email,
            password
        }
        try {

            LoginSchema.parse(data)
            const res = await admilogin(data).unwrap()
            setErrors({})
            console.log(res)
            const token = res.token
            localStorage.setItem('token',token)
            navigate('/admin/dashboard')
           
            
        } catch (error: any) {

            if (error instanceof ZodError) {
                const validationErrors: ValidationErrors = {}
                error.errors.forEach((err) => {
                    validationErrors[err.path[0]] = err.message
                })
                setErrors(validationErrors)
                return
            } else {
                setErrors({})
                const errorMessage = error.data.message
                console.log(errorMessage)
                if (errorMessage === 'Invalid password') {
                    toast.error('Invalid credentials')

                } else if (errorMessage === 'User not found') {
                    toast.error('User not found')
                }
            }
        }

    }

    return (
        <div className="flex items-center justify-center p-2 slide-in ">
            <form className="flex flex-col justify-center shadow-2xl sm:max-w-[400px] w-full mx-auto rounded p-10  bg-opacity-60 min-h-[500px] mt-20" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }} onSubmit={handleLogin}>
                <h2 className="text-2xl font-bold py-4 text-gray-700">Admin Login</h2>
                <div className="flex flex-col py-1">
                    <label className="font-mono text-black" htmlFor="username">Username</label>
                    <input className="border-2 border-blue rounded-lg p-2 text-black" type="text" placeholder="Username" id="username" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {Errors?.email && <p className=" font-normal text-xs" style={{ color: 'red' }}>{Errors.email}</p>}
                </div>
                <div className="flex flex-col py-1">
                    <label className="font-mono text-black" htmlFor="password">Password</label>
                    <input className="border-2 rounded-lg p-2 text-black" type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" id="password" value={password} />
                    {Errors?.password && <p className=" font-normal text-xs" style={{ color: 'red' }}>{Errors.password}</p>}
                </div>
                <button className="w-full bg-gradient-to-r from-indigo-700 via-purple-500 to-pink-500 rounded  border-2 border-gray-300 my-4 py-2 px-4 font-bold hover:floating-effect text-white" type="submit">Login</button>
                <div className="flex justify-between p-2 sm:justify-center gap-4">

                </div>
                <div className="flex justify-center my-4">
                    <div id='googleButton'>

                    </div>

                </div>
            </form>
        </div>
    )
}