import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"


export function ForgotPassword() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const navigate = useNavigate()
    const handleForgotPassword = (e: any) => {
        e.preventDefault()
        if (password === '' || confirmPassword === '') {
            toast.error('enter passwords correctly')
            return
        }
        if (password !== confirmPassword) {
            toast.error('passwords dont match')
            return
        }
        navigate('/')
    }
    return (
        <div>


            <div className="flex items-center justify-center p-2 slide-in mt-20">
                <form className="flex flex-col justify-center shadow-2xl sm:max-w-[400px] w-full mx-auto rounded p-10 bg-opacity-60 min-h-[500px]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }} onSubmit={handleForgotPassword}>
                    <h2 className="text-2xl font-bold py-4 text-gray-700">New credentials</h2>
                    <div className="flex flex-col py-1">
                        <label className="font-mono text-black" htmlFor="username">New password</label>
                        <input className="border-2 border-blue rounded-lg p-2 text-black" type="text" placeholder="enter password" id="username" value={password} onChange={(e) => setPassword(e.target.value)} />
                        {/* {Errors?.email && <p className=" font-normal text-xs" style={{ color: 'red' }}>{Errors.email}</p>} */}
                    </div>
                    <div className="flex flex-col py-1">
                        <label className="font-mono text-black" htmlFor="username">confirm password</label>
                        <input className="border-2 border-blue rounded-lg p-2 text-black" type="text" placeholder="confrim password" id="username" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        {/* {Errors?.email && <p className=" font-normal text-xs" style={{ color: 'red' }}>{Errors.email}</p>} */}
                    </div>

                    <button className="w-full bg-gradient-to-r from-indigo-700 via-purple-500 to-pink-500 rounded  border-2 border-gray-300 my-4 py-2 px-4 font-bold hover:floating-effect text-white" type="submit">update</button>


                </form>
            </div>
        </div>

    )
}