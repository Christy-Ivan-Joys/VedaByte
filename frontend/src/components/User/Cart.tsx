import { useEffect, useState } from "react"
import Header from "./Header"
import { FaTimes } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { Course } from "../../types"
import { loadStripe } from '@stripe/stripe-js'
import { useCheckoutMutation, useRemoveCartItemMutation } from "../../utils/redux/slices/userApiSlices"
import { toast } from "react-toastify"
import { setUser } from "../../utils/redux/slices/userAuthSlice"

type cartItem = {
    courseId: Course
}
export const Cart = () => {
    const { studentInfo } = useSelector((state: any) => state.userAuth)
    const [cart, setCartItems] = useState<cartItem[]>([])
    const [Total, setTotal] = useState(0)
    const dispatch = useDispatch()
    const [checkout] = useCheckoutMutation()
    const [removeCartItem] = useRemoveCartItemMutation()
    const stripeKey = import.meta.env.VITE_STRIPE_SECRET_KEY as string;
    
    const handleCheckout = async () => {
        try {
            const stripe = await loadStripe(stripeKey)
            const userId = studentInfo._id
            const response = await checkout({ cart, userId }).unwrap()
            if (Total !== 0) {
                localStorage.setItem('Total', Total.toString())
            }
            await stripe?.redirectToCheckout({
                sessionId: response.id
            })
        } catch (error: any) {
            console.log(error)
            if (error?.data?.message === 'Cart is Empty') {
                toast.error('Cart is empty')
            }
        }
    }

    const handleRemoveItem = async (itemId: string) => {

        try {
            const res = await removeCartItem({ itemId })
            console.log(res)
            dispatch(setUser(res.data))
            setCartItems(res.data.cart)
            toast.success('Item removed')
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
       
        if (studentInfo) {
            if (studentInfo.cart.length){
                setCartItems(studentInfo.cart)
            } else {
                return
            }
        }
        const total = cart.reduce((acc, item) => {
            const price = parseInt(item.courseId.price)
            return acc + price
        }, 0)
        setTotal(total)
    }, [setCartItems, cart,studentInfo])
    console.log(studentInfo,'studentinfoo')
    return (
        <div className="">

            <Header />
            <div className="px-72 p-16">
                <div className=" flex flex-col justify-start  py-10   gap-5 ">
                    <h1 className="text-4xl font-semibold">Shopping cart </h1>
                    {/* <div className="w-full border-t border-gray-500"></div> */}
                </div>
                {cart.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8    ">
                        <div className="sm:col-span-2 shadow-2xl border-2 border-sky-100">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 border-b-2">
                                <div className="justify-between items-center">
                                    <p className="font-semibold text-lg text-zinc-700 "><span className="text-2xl text-zinc-700 text-bold">{`${cart.length}`}</span> Courses in cart</p>
                                </div>
                            </div>
                            {cart?.map((item) => (
                                <div className="relative  px-5  p-4" key={item?.courseId._id}>
                                    <p className="absolute top-2 right-2 text-red-500 cursor-pointer" onClick={() => handleRemoveItem(item.courseId._id)}>  <FaTimes /></p>
                                    <div className="flex justify-between items-center">
                                        <img src={item?.courseId?.courseImage} className="w-24 h-14 shadow-md" alt="" />
                                        <p className="text-md font-semibold text-zinc-700">{item?.courseId?.name}</p>
                                        <div className="flex flex-col justify-center items-center px-5 gap-3">
                                            <p className="text-lg font-semibold text-purple" >₹ {item?.courseId?.price}</p>
                                            <p className="text-sm  underline text-blue-500 cursor-pointer">Details</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col p-4 bg-white shadow-xl  rounded-md border-2 border-sky-100 ">
                            <h2 className=" flex text-xl font-semibold text-zinc-700 mb-4">Order Summary</h2>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-lg font-medium text-zinc-800">Total</span>
                                <span className="text-2xl font-bold text-purple">₹ {Total}</span>
                            </div>
                            <button className="bg-buttonGreen text-white p-3 rounded-sm mt-16 hover:bg-green-700 font-semibold text-lg" onClick={handleCheckout}>Checkout</button>
                        </div>
                    </div>
                ) : (
                    <p>No courses added in cart</p>
                )}
            </div>
        </div>

    )
}