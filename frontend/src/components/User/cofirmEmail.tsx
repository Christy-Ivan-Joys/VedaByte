import { useState } from "react"
import { useSendOtpMutation } from "../../utils/redux/slices/userApiSlices"
import { useNavigate } from "react-router-dom"
import { ZodError } from "zod"


export function ConfirmEmail() {
    const [sendOtp] = useSendOtpMutation()
    const [email, setEmail] = useState('')
    const navigate = useNavigate()
    const handleConfirm = async (e: any) => {
        e.preventDefault()
        const otp = await sendOtp({email}).unwrap()
        console.log(otp)
        localStorage.setItem('secret',otp)
        localStorage.setItem('action','forgotPassword')
        navigate('/otp')
        try {

        } catch (error: any) {
            console.log(error)
            if (error instanceof ZodError) {

            }
        }

    }

    return (



        <div>


            <div className="flex items-center justify-center p-2 slide-in mt-20">
                <form className="flex flex-col justify-center shadow-2xl sm:max-w-[400px] w-full mx-auto rounded p-10 bg-opacity-60 min-h-[500px]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }} onSubmit={handleConfirm}>
                    <h2 className="text-2xl font-bold py-4 text-gray-700">Confirm email</h2>
                    <div className="flex flex-col py-1">
                        <label className="font-mono text-black" htmlFor="username">Email</label>
                        <input className="border-2 border-blue rounded-lg p-2 text-black" type="text" placeholder="enter email" id="gmail" value={email} onChange={(e) => setEmail(e.target.value)} />
                        {/* {Errors?.email && <p className=" font-normal text-xs" style={{ color: 'red' }}>{Errors.email}</p>} */}
                    </div>

                    <button className="w-full bg-gradient-to-r from-indigo-700 via-purple-500 to-pink-500 rounded  border-2 border-gray-300 my-4 py-2 px-4 font-bold hover:floating-effect text-white" type="submit">verify</button>


                </form>
            </div>
        </div>


    )
}