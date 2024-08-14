import { useEffect, useState } from "react"
import Header from "./Header"
import { Panel } from "./Panel"
import { toast } from "react-toastify"
import { useChangePasswordMutation } from "../../utils/redux/slices/userApiSlices"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export const ResetPassword = () => {
    const [newpassword, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [currentpassword, setcurrentPassword] = useState('')
    const { studentInfo } = useSelector((state: any) => state.userAuth)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    const navigate = useNavigate()
    const [changePassword] = useChangePasswordMutation()

    const handleChangePassword = async (e: any) => {
        e.preventDefault()
        const userId = studentInfo._id
        if (!currentpassword) {
            toast.error('Enter the current password')
            return
        }
        if (!passwordRegex.test(newpassword)) {
            toast.error('enter a valid new password')
            return
        }
        if (!confirmPassword) {
            toast.error('Enter confirm password')
            return
        }
        if (confirmPassword !== newpassword) {
            toast.error('passwords not matched !')
            return
        }

        alert('password correct')
        try {

            const response: any = await changePassword({ newpassword, currentpassword, userId })
            console.log(response)
            if (response.error) {
                throw response.error
            }
            toast.success('Password changed')
            navigate('/profile')
            console.log(newpassword, confirmPassword)

        } catch (error: any) {
           
            if (error.data === 'Current password is wrong') {
                toast.error('current password is wrong')
            } else {
                toast.error(error.data)
            }
        }
    }

    useEffect(() => {

    }, [newpassword])

    return (
        <>

            <Header />
            <div className="overflow-hidden fixed w-screen shadow-lg  ">
                <Panel />
                <div className='main  mt-5'>
                    <div className='p-5 '>
                        <div className="min-h-screen/2 flex flex-col  justify-center items-center   px-20">
                            <h1 className="font-semibold text-2xl text-zinc-700">Change password</h1>
                            <form className="py-8 px-32 mt-5 shadow-xl rounded-lg w-full max-w-2xl flex flex-col justify-center border-2 border-sky-100 gap-8 items-center" onSubmit={handleChangePassword}>
                                <div className="flex flex-col py-1 w-full ">
                                    <label className="font-mono text-black" htmlFor="password">Enter current Password</label>
                                    <input className="border-2 rounded-lg p-2 text-black focus:outline-none" type="password" onChange={(e) => setcurrentPassword(e.target.value)} placeholder="Password" id="currentpassword" value={currentpassword} />
                                    {/* {Errors?.password ? <p className=" font-normal text-xs" style={{ color: 'red' }}>{Errors.password}</p> : <p></p>} */}
                                </div>
                                <div className="flex flex-col py-1 w-full ">
                                    <label className="font-mono text-black" htmlFor="password">Enter new Password</label>
                                    <input className="border-2 rounded-lg p-2 text-black focus:outline-none" type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" id="newPassword" value={newpassword} />
                                    {/* {Errors?.password ? <p className=" font-normal text-xs" style={{ color: 'red' }}>{Errors.password}</p> : <p></p>} */}
                                </div>
                                <div className="flex flex-col py-1 w-full">
                                    <label className="font-mono text-black" htmlFor="password">Confirm Password</label>
                                    <input className="border-2 rounded-lg p-2 text-black focus:outline-none" type="password" onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Password" id="confirmpassword" value={confirmPassword} />
                                    {/* {Errors?.password ? <p className=" font-normal text-xs" style={{ color: 'red' }}>{Errors.password}</p> : <p></p>} */}
                                </div>
                                <button className="text-semibold text-md text-white h-10  px-5 bg-buttonGreen rounded-md w-42 " type="submit">Change password</button>
                                <div className=" flex flex-col text-red-500 justify-center items-center px-5">
                                    <p className="text-xs"> Hint : Must be at least 8 characters long, one number, and one special character</p>
                                    <p className="text-xs">       Include at least one uppercase letter, one lowercase letter</p>
                                </div>
                            </form>

                        </div>

                    </div>
                </div>
            </div>


        </>
    )
}