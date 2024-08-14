import Header from "./Header"
import '../../styles/Login.css'
import "animate.css/animate.min.css"
import Cookies from "js-cookie"
import Login2 from '../../../public/images/Login2.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react"
import { useLoginMutation} from "../../utils/redux/slices/userApiSlices"
import LoginSchema from "../../Validation/LoginSchema"
import { ZodError } from "zod"
import { useDispatch } from "react-redux"
import { setUser } from "../../utils/redux/slices/userAuthSlice"
import { jwtDecode } from "jwt-decode"
import { GoogleJwtPayload, FormData } from "../../types"
import { toast } from "react-toastify"
import { StudentLogout } from "../../Helpers/Home"

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
    const [login] = useLoginMutation()
    const [Errors, setErrors] = useState<ValidationErrors>({})

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const clientId = "1061589456806-oa0c5cnd89bs3ln8l7onqih466gq1lmi.apps.googleusercontent.com"
    const data: Formdata = {
        email,
        password
    }
    const handleLogin = async (e: any) => {
        e.preventDefault()
        try {
            LoginSchema.parse(data)
            const student = await login(data).unwrap()

            setErrors({})
            dispatch(setUser({ ...student.user }))

            navigate('/')
        } catch (error: any) {
            console.log(error)
            if (error instanceof ZodError) {
                const validationErrors: ValidationErrors = {}
                error.errors.forEach((err) => {
                    validationErrors[err.path[0]] = err.message
                })
                setErrors(validationErrors)
                return
            } else {
                setErrors({})
                const ErrorMessage = error.data.message
                if (ErrorMessage === 'Invalid password') {
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
        console.log(user)
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
            console.log(googleUser)
            const res = await login(googleUser).unwrap()
           
            dispatch(setUser({ ...res.user }))

            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const accessToken = Cookies.get('StudentAccessToken')
        console.log(accessToken,'studentAccesstoken')
        if(accessToken){
            navigate('/')
        }else{
            StudentLogout(dispatch)
            navigate('/login')
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

            initializeGoogleLogin()

        }

    }, [])



        return (
            <div >
                <Header />
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full " style={{ backgroundImage: `url()`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'fixed' }}>
                        <div className="hidden sm:block">
                            <img src={Login2} alt="" className="p-16 mb-42 ml-20" />
                        </div>
                        <div className="flex items-center justify-center p-2 slide-in mb-20">
                            <form className="flex flex-col justify-center shadow-2xl sm:max-w-[420px] w-full mx-auto rounded p-10 bg-opacity-60 min-h-[500px]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }} onSubmit={handleLogin}>
                                <h2 className="text-2xl font-bold  text-gray-700">Welcome !</h2>
                                <p className="text-sm font-normal  text-gray-700">Please signin to continue</p>
                                <div className="flex flex-col py-4">
                                    <label className="font-mono text-black" htmlFor="username">Username</label>
                                    <input className="border-2 border-blue rounded-lg p-2 text-black" type="text" placeholder="Username" id="username" value={email} onChange={(e) => setGmail(e.target.value)} />
                                    {Errors?.email && <p className=" font-normal text-xs" style={{ color: 'red' }}>{Errors.email}</p>}
                                </div>
                                <div className="flex flex-col py-1">
                                    <label className="font-mono text-black" htmlFor="password">Password</label>
                                    <input className="border-2 rounded-lg p-2 text-black" type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" id="password" value={password} />
                                    {Errors?.password ? <p className=" font-normal text-xs" style={{ color: 'red' }}>{Errors.password}</p> : <p></p>}
                                </div>
                                <button className="w-full bg-gradient-to-r from-indigo-700 via-purple-500 to-pink-500 rounded  border-2 border-gray-300 my-4 py-2 px-4 font-bold hover:floating-effect text-white" type="submit">Login</button>
                                <div className="flex justify-between p-2 sm:justify-center gap-14">
                                    <p className="text-blue-500 underline text-center"><Link to='/instructor/login'>Join as instructor</Link></p>
                                    <p className="text-center">
                                        <p className="text-blue-500 underline"><Link to='/signup'>Create an account</Link></p>
                                    </p>
                                </div>
                                <div className="flex justify-center my-4">
                                    <div id='googleButton'>

                                    </div>

                                </div>
                                <div className=" flex justify-center items-center">
                                    <p className="font-normal text-sm text-blue-500 ">forgot password ? <Link to='/confirmEmail'><span className="underline">click here</span></Link></p>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }