import { useEffect} from "react"
import { FaCheck } from "react-icons/fa"
import { Link, useLocation } from "react-router-dom"
import { useEnrollMutation } from "../../utils/redux/slices/userApiSlices"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "../../utils/redux/slices/userAuthSlice"



export const Success = () => {
    const location = useLocation()
    const [enroll] = useEnrollMutation()
    const {studentInfo} = useSelector((state:any)=>state.userAuth)
    const dispatch = useDispatch()
    useEffect(() => {

        const handleSuccess = async () => {
            const query = new URLSearchParams(location.search)
            
            const sessionId = query.get('session_id')
            const total =  localStorage.getItem('Total')
            
            if (sessionId && total){
                const userId = studentInfo._id
                console.log('worked')
                const res = await enroll({userId,total})
                dispatch(setUser({...res.data}))
                localStorage.removeItem('Total')
            }
        }
        handleSuccess()
    },[])
    return (
        <div className="bg-white w-screen h-screen flex flex-col justify-center items-center gap-10">
            <div className="bg-buttonGreen w-52 h-52 rounded-full flex justify-center items-center border-2 border-green-600">
                <p className=" text-xl text-white slide-in"><FaCheck size={100} /></p>
            </div>
            <div className="flex ">
                <p className="text-black font-semibold text-3xl ">Transaction successfull </p>

            </div>
            <p className="underline"><Link to='/'>click to continue</Link></p>

        </div>
    )
}