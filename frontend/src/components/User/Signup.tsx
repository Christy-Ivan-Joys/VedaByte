import '../../styles/Login.css'
import "animate.css/animate.min.css"
import Login2 from '../../../public/images/Login1.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { jwtDecode } from 'jwt-decode'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useRegisterMutation } from '../../utils/redux/slices/userApiSlices'
import { ZodError } from 'zod'
import signupSchema from '../../Validation/SignupSchema'
import { GoogleJwtPayload, FormData, ValidationErrors } from '../../types'
import { toast } from 'react-toastify'
import { setUser } from '../../utils/redux/slices/userAuthSlice'
import { useDispatch } from 'react-redux'


export default function Signup() {
    const [firstname, setFfirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [contact, setContact] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [register] = useRegisterMutation()
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [Errors, setErrors] = useState<ValidationErrors>({})
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const clientId = "1061589456806-oa0c5cnd89bs3ln8l7onqih466gq1lmi.apps.googleusercontent.com"
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        let formData: FormData = {
            firstname,
            lastname,
            email,
            contact,
            password,
            confirmPassword
        }
        try {

            signupSchema.parse(formData)
            const name = `${firstname} ${lastname}`
            const data = { ...formData, name }
            delete data.firstname;
            delete data.lastname;
            delete data.confirmPassword
            const res = await register(data).unwrap()
            console.log(res)
            localStorage.setItem('secret',res.otp)
            // dispatch(setUser({ ...res.user }))
            navigate('/otp')

        } catch (error: any) {
            if (error instanceof ZodError) {
                console.log('error in here ')
                const validationErrors: ValidationErrors = {}
                error.errors.forEach((error) => {
                    validationErrors[error.path[0]] = error.message
                })
                setErrors(validationErrors)
                return          
            } else {
                console.log(error)
                console.log(error.status)
                const errorData = error.data.message
                
                if (errorData === 'User already exist') {
                    toast.error('Email already registered')
                } else if(error.status == 500) {
                         console.log('interenal')
                      navigate('*')
                }else{
                    toast.error('An unexpected error occoured')
                }

            }
        }
    }
    async function handleCallbackResponse(response: any) {
        const user = jwtDecode<GoogleJwtPayload>(response.credential)
        try {

            const email = user.email
            const name = user.name
            const googleUserId = user.sub
            const profileImage = user.picture
            const googleUser: FormData = {
                email,
                name,
                googleUserId,
                profileImage
            }

            const gmailUser = await register(googleUser).unwrap()
            const requestedOtp = gmailUser.otp
            dispatch(setUser({...gmailUser,requestedOtp}))
            navigate('/otp')
            
        } catch (error: any){
            const errorData = error.data.message
            if (errorData === 'User already exist') {
                toast.error('Email already registered')
            } else {
                toast.error('An unexpected error occoured')
            }
        }
    }

    useEffect(() => {

        const initializeGoogleSignIn = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCallbackResponse,
                });
                window.google.accounts.id.renderButton(
                    document.getElementById('googleButton'),
                    { theme: 'outline', size: 'large' }
                );
                window.google.accounts.id.prompt();
            }
        };
        const existingScript = document.querySelector(`script[src="https://accounts.google.com/gsi/client"]`);
        if (!existingScript) {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = initializeGoogleSignIn;
            document.body.appendChild(script)
        } else {
            initializeGoogleSignIn();
        }
    }, []);

    return (

        <div>
            <div className="h-screen flex flex-col">
                <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 h-full w-full" style={{ backgroundImage: `url()`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <div className="flex items-center justify-center p-6 sm:hidden">
                        <img src={Login2} alt="" className="w-full h-auto" />
                    </div>
                    <div className="hidden sm:flex items-center justify-center p-6">
                        <img src={Login2} alt="" className="p-16 mb-36 ml-20" />
                    </div>
                    <div className="flex items-center justify-center p-6 mb-20 slide-in">
                        <form className="flex flex-col justify-center shadow-2xl sm:max-w-[600px] w-full mx-auto rounded p-10 bg-opacity-60 min-h-[500px] " style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }} onSubmit={handleSubmit}>
                            <h2 className="text-2xl font-bold py-4 text-gray-700">Create your account</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col py-1">
                                    <label className="font-normal text-black" htmlFor="firstname">First name</label>
                                    <input className="border-2 border-blue rounded-lg p-2 text-black" type="text" name='firstname' placeholder="Enter your first name" value={firstname} onChange={(e) => setFfirstname(e.target.value)} />
                                    {Errors?.firstname && <p className=" font-normal text-xs" style={{ color: 'red' }}>{Errors.firstname}</p>}
                                </div>
                                <div className="flex flex-col py-1">
                                    <label className="font-normal text-black" htmlFor="lastname">Last name</label>
                                    <input className="border-2 border-blue rounded-lg p-2 text-black" type="text" placeholder="Enter your last name" name='lastname' id="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                                    {Errors?.lastname && <p className=" font-normal text-xs" style={{ color: 'red' }}>{Errors.lastname}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col py-1">
                                    <label className="font-normal text-black" htmlFor="email">Email</label>
                                    <input className="border-2 border-blue rounded-lg p-2 text-black" type="email" name='email' placeholder="Enter your email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    {Errors?.email && <p className=" font-normal text-xs" style={{ color: 'red' }}>{Errors.email}</p>}
                                </div>
                                <div className="flex flex-col py-1">
                                    <label className="font-normal text-black" htmlFor="contact">Contact</label>
                                    <input className="border-2 border-blue rounded-lg p-2 text-black" type="text" placeholder="Enter your contact" name='contact' id="contact" value={contact} onChange={(e) => setContact(e.target.value)} />
                                    {Errors?.contact && <p className=" font-normal text-xs" style={{ color: 'red' }}>{Errors.contact}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col py-1 relative">
                                    <label className="font-normal text-black" htmlFor="password">Password</label>
                                    <input className="border-2 rounded-lg p-2 text-black" type={passwordVisible ? 'text' : 'password'} placeholder="Password" name='password' id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <span
                                        className="absolute right-3 top-2/3 transform -translate-y-2/4 cursor-pointer"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                    >
                                        <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                                    </span>
                                    {Errors?.password ? <p className=" font-normal text-xs items-center" style={{ color: 'red' }}>{Errors.password}</p> : <p></p>}
                                </div>
                                <div className="flex flex-col py-1 relative">
                                    <label className="font-normal text-black" htmlFor="confirmPassword">Confirm password</label>
                                    <input className="border-2 rounded-lg p-2 text-black" type={passwordVisible ? 'text' : 'password'} placeholder="Confirm your password" name='confirm password' id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                    <span
                                        className="absolute right-3 top-2/3 transform -translate-y-2/4 cursor-pointer"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                    >
                                        <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                                    </span>
                                    {Errors?.confirmPassword && <p className=" font-normal text-xs" style={{ color: 'red' }}>{Errors.confirmPassword}</p>}
                                </div>
                            </div>
                            <button className="w-full bg-gradient-to-r from-lightBlue via-mediumBlue to-DarkBlue rounded border-2 border-gray-300  my-4 py-2 px-4 font-bold hover:floating-effect" type="submit">Create Account</button>
                            <div className="flex justify-between p-2 sm:justify-center gap-4">
                                <p className="flex items-center gap-2"><input className="ml-2" type="checkbox" name="remember" id="remember" />Remember Me</p>

                                <p className="text-blue-500 underline"><Link to='/login'>Already have an account ? login</Link></p>

                            </div>
                            <div className="flex justify-center my-4">
                                <div id='googleButton'>

                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

