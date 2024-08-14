import Cookies from "js-cookie";
import { setUser } from "../utils/redux/slices/userAuthSlice";
import { useDispatch } from "react-redux";
import { setInstructor } from "../utils/redux/slices/instructorAuthSlice";

export const reveal = () => {

    let reveals = document.querySelectorAll('.card')
    for (let i = 0; i < reveals.length; i++) {
        let windowHeight = window.innerHeight;
        let revealTop = reveals[i].getBoundingClientRect().top;
        let revealPoint = 150
        if (revealTop < windowHeight - revealPoint) {
            reveals[i].classList.add('active')
        } else {
            reveals[i].classList.remove('active')
        }
    }
}


export const StudentLogout = async (dispatch:any) => {
    Cookies.remove('StudentAccessToken', { path: '/' })
    Cookies.remove('StudentRefreshToken', { path: '/' })
    dispatch(setUser({}))
    return
}
export const InstructorLogout = async (dispatch:any) => {
    Cookies.remove('InstructorAccessToken', { path: '/' })
    Cookies.remove('InstructorRefreshToken', { path: '/' })
    dispatch(setInstructor({}))
    return
}
