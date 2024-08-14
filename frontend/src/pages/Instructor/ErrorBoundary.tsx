import { createContext, useState, useEffect, useContext } from "react"
import { ChildrenProps, Errorhandler } from "../../types"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux"
import { CircularProgress } from '@mui/material'
import { useVerifyIRefreshTokenMutation } from "../../utils/redux/slices/instructorApiSlices"
import { InstructorLogout } from "../../Helpers/Home"

const IErrorBoundaryContext = createContext<Errorhandler>(() => { })

export const IErrorBoundary: React.FC<ChildrenProps> = ({ children }) => {

    const [hasError, setHasError] = useState(false)
    const [TokenError, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const [verifyIRefreshToken] = useVerifyIRefreshTokenMutation()

    const handleITokenRefresh = async () => {
        try {

            setLoading(true)
            const refresh = await verifyIRefreshToken(undefined)

            if (refresh.data) {
                setLoading(false)
                setHasError(false)
                setError('')
                window.location.reload()
            } else {
                console.log(refresh, 'refresh tokne error')
                setLoading(false)
                throw new Error('Refresh token expired')
            }

        } catch (error: any) {
            if (error.message === 'Refresh token expired') {
                setLoading(false)
                InstructorLogout(dispatch)
                setHasError(false)
                navigate('/instructor/login')
                toast.error('Token expired')
            } else {
                toast.error('Unexpected error occured')
            }
            navigate('/instructor/login')
        }
    }

    useEffect(() => {
        if (hasError && TokenError) {

            if (TokenError === 'Access token is required' || TokenError === 'Invalid token') {

                handleITokenRefresh()
            } else {
                setError(null)
                setHasError(false)
                return
            }
        } else {
            return
        }
    }, [TokenError, hasError])

    const errorHandler = (error: string) => {
        if (error === 'Access token is required' || error === 'Invalid token' || error === 'User not found') {
            setError(error)
            setHasError(true)
        } else {
            return
        }


    }


    const FallBack = () => {
        return (
            <div className="flex justify-center items-center w-screen h-screen p-32 bg-slate-950">
                <div className=" rounded-lg shadow-lg  w-full h-full flex flex-col justify-center items-center ">
                    <h1 className="text-4xl text-center text-white mb-4 font-bold ">Something went wrong !</h1>
                    <h1 className="text-lg text-center mb-4 font-semibold text-slate-400 ">Token expired</h1>
                    <button onClick={handleITokenRefresh} className="bg-blue-700 rounded-lg text-lg font-semibold text-white w-28 h-10 hover:text-black hover:bg-white">
                        Try again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <IErrorBoundaryContext.Provider value={errorHandler}>
            {hasError ? FallBack() : children}
            {loading && (
                <div className="flex justify-center items-center w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-50">
                    <CircularProgress />
                </div>
            )}
        </IErrorBoundaryContext.Provider>
    )
}
export const useErrorHandler = () => {

    return useContext(IErrorBoundaryContext)
}