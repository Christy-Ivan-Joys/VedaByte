import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { useState } from "react"
import { validatePassword } from "../../Helpers/validate"
import { toast } from "react-toastify"
import { useUpdateProfileDetailsMutation } from "../../utils/redux/slices/instructorApiSlices"
import { useDispatch } from "react-redux"
import { setInstructor } from "../../utils/redux/slices/instructorAuthSlice"
export const ResetPassword = () => {
    const [currentpassword, setcurrentPassword] = useState('')
    const [newpassword, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [updateProfileDetails] = useUpdateProfileDetailsMutation()
    const dispatch = useDispatch()
    const [isEdit,setisEdit] = useState(false)
    const handleChangePassword = async() => {
        const errorMessages = validatePassword(currentpassword, newpassword, confirmPassword)
        if (errorMessages) {
            toast.error(errorMessages)
            return
        }
      
    
        setisEdit(false)
        const data = {newpassword}
        const update = await updateProfileDetails({ data })
        console.log(update)
        dispatch(setInstructor({ ...update.data }))


    }

    return (

        <>

            <div className="flex">
                <Sidebar />
                <div className="content ">
                    <Header />




                    <div className="min-h-screen/2 flex flex-col  justify-center items-center   px-20 border-2 mt-5">
                        <h1 className="font-semibold text-2xl text-zinc-700">Change password</h1>
                        <form className="py-10 px-32 mt-5 shadow-xl rounded-lg w-full max-w-2xl flex flex-col justify-center border-2 border-sky-100 gap-8 items-center bg-white" onSubmit={handleChangePassword}>
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







        </>
    )

}