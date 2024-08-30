import { createContext, useState, useEffect, useContext } from "react"

import { ChildrenProps, ErrorType, Errorhandler } from "../../types"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux"
import { setUser } from "../../utils/redux/slices/userAuthSlice"
import { CircularProgress } from '@mui/material'
import { useVerifyStudentRefreshTokenMutation } from "../../utils/redux/slices/userApiSlices"
import { StudentLogout } from "../../Helpers/Home"

const ErrorBoundaryContext = createContext<Errorhandler>(() => { })

export const ErrorBoundary: React.FC<ChildrenProps> = ({ children }) => {
    const [hasError, setHasError] = useState(false)
    const [TokenError, setError] = useState<ErrorType | null | any>(null)
    const [verifyStudentRefreshToken] = useVerifyStudentRefreshTokenMutation()
    const [reset, setReset] = useState(false)
  
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const handleTokenRefresh = async () => {
        try {
          
            setLoading(true)
            const refresh = await verifyStudentRefreshToken(undefined)
            if (refresh.data) {
                setLoading(false)
                setError(null)
                window.location.reload()
            } else {
                setError(null)
                throw new Error('Refresh token expired')
            }

        } catch (error: any) {
            if (error.message === 'Refresh token expired'){
                setLoading(false)
                dispatch(setUser(null))
                navigate('/login')
                StudentLogout(dispatch)
                toast.error('Token expired ! login again')
            } else {
                toast.error('Unexpected error occured')
            }
            navigate('/login')
        }
    }

    useEffect(() => {
        
        if (hasError && TokenError && reset) {

            if (TokenError === 'Access token is required' || TokenError === 'Invalid token' || TokenError === 'User not found') {
                handleTokenRefresh()

            } else {
                setHasError(false)
                setError(null)
                return
            }
        } else {
            return
        }
    }, [TokenError, hasError])

    const errorHandler = (error: string) => {
        if (error === 'Access token is required' || error === 'Invalid token' || error === 'User not found'){
            setError(error)
        }else if(error === 'User is blocked'){
              StudentLogout(dispatch)
              navigate('/login')
              toast.error('user is blocked')
        }else{
            return
        }
    }

    const handleReset = (value: boolean) => {
        setReset(value)
        setHasError(true)
        setError(TokenError)
        
    }

    const FallBackComponent = () => {
        return (
            <div className="flex justify-center items-center w-screen h-screen p-32 bg-slate-950">
                <div className=" rounded-lg shadow-lg  w-full h-full flex flex-col justify-center items-center ">
        

                    <h1 className="text-4xl text-center text-white mb-4 font-bold ">Something went wrong !</h1>
                    <h1 className="text-lg text-center mb-4 font-semibold text-slate-400 ">Token expired</h1>
                    <button onClick={() => handleReset(true)} className="bg-blue-700 rounded-lg text-lg font-semibold text-white w-28 h-10 hover:text-black hover:bg-white">
                        Try again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <ErrorBoundaryContext.Provider value={errorHandler}>
            {TokenError ? FallBackComponent() : children}
            {loading && (
                <div className="flex justify-center items-center w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-50">
                    <CircularProgress />
                </div>
            )}
        </ErrorBoundaryContext.Provider>
    )
}

export const useErrorHandler = () => {
    return useContext(ErrorBoundaryContext)
}