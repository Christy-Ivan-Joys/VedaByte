
import '../../styles/Login.css'
import "animate.css/animate.min.css"
import Login2 from '../../../public/images/Login2.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from "react"
import { toast } from 'react-toastify'
import LoginSchema from '../../Validation/LoginSchema'
import { useDispatch } from 'react-redux'
import { setInstructor } from '../../utils/redux/slices/instructorAuthSlice'
import { ZodError } from 'zod'
import { jwtDecode } from "jwt-decode"
import { GoogleJwtPayload, FormData } from "../../types"
import { useSigninMutation} from '../../utils/redux/slices/instructorApiSlices'
import Cookies from 'js-cookie'
import { useErrorHandler } from '../../pages/Instructor/ErrorBoundary'

interface Formdata {
    email: string,
    password: string
}
interface ValidationErrors {
    [key: string]: string
}


export default function Login() {

    const [email, setGmail] = useState('')
    const [password, setPassword] = useState('')
    const [signin] = useSigninMutation()
    const handleError = useErrorHandler()
    const [Errors, setErrors] = useState<ValidationErrors>({})
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const clientId = "1061589456806-oa0c5cnd89bs3ln8l7onqih466gq1lmi.apps.googleusercontent.com"
    const handleLogin = async (e: any) => {
        e.preventDefault()
        const data: Formdata = {
            email,
            password

        }
        try {

            LoginSchema.parse(data)
            const res = await signin(data).unwrap()
            setErrors({})
            console.log(res,'res in login')
            dispatch(setInstructor({ ...res}))
            navigate('/instructor/dashboard')

        } catch (error: any){
            console.log(error)
            if (error instanceof ZodError) {
                const validationErrors: ValidationErrors = {}
                error.errors.forEach((err) => {
                    validationErrors[err.path[0]] = err.message
                })
                console.log(validationErrors, 'validation')
                setErrors(validationErrors)
                return
            }else{
                const ErrorMessage = error?.data?.message
                if (ErrorMessage === 'Invalid password'){
                    toast.error('Invalid credentials')
                } else if (ErrorMessage === 'User not found') {
                    toast.error('Account not found.create an account!')
                    navigate('/signup')
                }
            }
        }
    }
    const handleCallBackResponse = async (response: any) => {

        const user = jwtDecode<GoogleJwtPayload>(response.credential)
        const email = user.email
        const googleUserId = user.sub
        const name = user.name
        const profileImage = user.picture
        const googleUser: FormData = {
            email,
            googleUserId,
            name,
            profileImage
        }

        try {
            
            const res = await signin(googleUser).unwrap()
            localStorage.setItem('token', res.accessToken)
            dispatch(setInstructor({ ...res }))
            navigate('/instructor/dashboard')

        } catch (error: any) {

            const ErrorMessage = error.data.message
            if (ErrorMessage === 'Invalid password') {
                toast.error('Invalid credentials')
            } else if (ErrorMessage === 'User not found') {
                toast.error('Account not found.create an account!')
                navigate('/signup')
            }else if(ErrorMessage === 'Manual user') {
                    toast.error('Account not authenticated with google.Enter gmail and password')
            }
        }
    }
    
    useEffect(() => {
        const accessToken= Cookies.get('InstructorAccessToken')
        if(accessToken){
            navigate('/instructor/dashboard')
        }else{
           handleError('Access Token is required')
        }
        const initializeGoogleLogin = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCallBackResponse
                })
                window.google.accounts.id.renderButton(
                    document.getElementById('googleButton'),
                    { theme: 'outline', size: 'large' }
                )
                window.google.accounts.id.prompt()
            }
        }
        const existingScript = document.querySelector(`script[src="https://accounts.google.com/gsi/client"]`);
        if (!existingScript) {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = initializeGoogleLogin;
            document.body.appendChild(script);
        } else {
            initializeGoogleLogin();
        }
    }, [])


    return (
        <div >

            <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full " style={{ backgroundImage: `url()`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'fixed' }}>
                    <div className="hidden sm:block">
                        <img src={Login2} alt="" className="p-16 mb-42 ml-20" />
                    </div>
                    <div className="flex items-center justify-center p-2 slide-in mb-20">
                        <form className="flex flex-col justify-center shadow-2xl sm:max-w-[400px] w-full mx-auto rounded p-10 bg-opacity-60 min-h-[500px]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }} onSubmit={handleLogin}>
                            <h2 className="text-2xl font-bold py-4 text-gray-700">Instructor Login</h2>
                            <div className="flex flex-col py-1">
                                <label className="font-mono text-black" htmlFor="username">Username</label>
                                <input className="border-2 border-blue rounded-lg p-2 text-black" type="text" placeholder="Username" id="username" value={email} onChange={(e) => setGmail(e.target.value)} />
                                {Errors?.email && <p className=" font-normal text-xs" style={{ color: 'red' }}>{Errors.email}</p>}
                            </div>
                            <div className="flex flex-col py-1">
                                <label className="font-mono text-black" htmlFor="password">Password</label>
                                <input className="border-2 rounded-lg p-2 text-black" type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" id="password" value={password} />
                                {Errors?.password && <p className=" font-normal text-xs" style={{ color: 'red' }}>{Errors.password}</p>}
                            </div>
                            <button className="w-full bg-gradient-to-r from-indigo-700 via-purple-500 to-pink-500 rounded  border-2 border-gray-300 my-4 py-2 px-4 font-bold hover:floating-effect text-white" type="submit">Login</button>
                            <div className="flex justify-between p-2 sm:justify-center gap-4">
                                <p className="flex items-center gap-2"><input className="ml-2" type="checkbox" name="remember" id="remember" />Remember Me</p>
                                <p className="text-center">
                                    <p className="text-blue-800 font-semibold underline"><Link to='/instructor/register'>Create an account</Link></p>
                                </p>
                            </div>
                            <div className="flex justify-center my-4">
                                <div id='googleButton'>

                                </div>
                            </div>
                            <div className=" flex justify-center items-center">
                                <p className=" text-sm text-blue-800 font-semibold ">forgot password ? <Link to='/confirmEmail'><span className="underline">click here</span></Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}