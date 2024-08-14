import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function Otp() {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [originalOtp, setOriginal] = useState<string | null>('')
    const [time, setTimer] = useState(90)
    const [showResend, setShowResend] = useState(false)
    const { studentInfo } = useSelector((state: any) => state.userAuth)
    const navigate = useNavigate()
    const handleChange = (e: any, index: any) => {
        const value = e.target.value;

        if (/^[0-9]?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value && index < 3) {
                const nextInput = document.getElementById(`otp-input-${index + 1}`);
                if (nextInput) {
                    nextInput.focus();
                }
            }
        }
    }

    const handleKeyDown = (e: any, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-input-${index - 1}`);
            if (prevInput) {
                prevInput.focus();
            }
        }
    }
    const handleOtp = (e: any) => {
        e.preventDefault()

        const action = localStorage.getItem('action')

        const userOtp = otp.join('')
        if (originalOtp === userOtp){
            if (action === 'changePassword') {
                alert('resetp')
                localStorage.setItem('secret', '')
                localStorage.setItem('action', '')
                navigate('/resetPassword')
            } else if (action === 'forgotPassword') {
                alert('forgotp')
                localStorage.setItem('secret', '')
                localStorage.setItem('action', '')
                navigate('/forgotpassword')
            } else {
                localStorage.setItem('secret', '')
                navigate('/login')

            }


        } else {
            toast.error('Entered wrong otp')
        }
    }
    useEffect(() => {
        const realOtp = localStorage.getItem('secret')
        console.log(realOtp)
        setOriginal(realOtp)
        if (originalOtp) {
            localStorage.setItem('secret', '')
        }

        const counter = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer > 0) {
                    return prevTimer - 1
                } else {
                    clearInterval(counter)
                    setShowResend(true)
                    return 0
                }
            })
        }, 1000)

        return () => clearInterval(counter)

    }, [])
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };


    return (
        <div className="flex items-center justify-center p-2 bg-zinc-900 w-screen h-screen">
            <form
                className="flex flex-col justify-center items-center slide-in bg-white shadow-2xl sm:max-w-[500px] w-full rounded p-10 min-h-[350px]"
                onSubmit={handleOtp}
            >
                <h1 className="font-bold font-sans text-2xl">OTP</h1>
                <p className="font-bold font-sans text-2xl p-2">Verification Code</p>
                <p className="font-normal font-sans text-sm">Enter the otp send to your email</p>
                <div className="flex space-x-4  py-6 text-black">
                    {otp.map((num, index) => (
                        <input
                            key={index}
                            id={`otp-input-${index}`}
                            type="text"
                            maxLength={1}
                            value={num}
                            className="w-12 h-12 text-center text-xl bg-slate-950 text-white border-gray-600 rounded"
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                    ))}
                </div>
                <div className="text-blue-500 font-bold   py-2">
                    {showResend ? (
                        <Link to="/login">Resend OTP ?</Link>
                    ) : (
                        <span >Resend OTP in {formatTime(time)}</span>
                    )}
                </div>
                <button type="submit" className="bg-gradient-to-r text-white font-bold from-lightBlue via-mediumBlue to-DarkBlue rounded py-2 px-10">
                    Verify
                </button>
            </form>
        </div>
    );
}
