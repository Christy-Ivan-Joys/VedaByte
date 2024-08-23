import { Route, Routes } from 'react-router-dom'
import Login from '../components/User/Login'
import App from '../Sample'
import Signup from '../components/User/Signup'
import Otp from '../components/User/Otp'
import { ConfirmEmail } from '../components/User/cofirmEmail'
import { Home } from '../components/User/Home'
import { NotFound } from '../components/Admin/Notfound'
import Sample from '../Sample'
import { CourseDetails } from '../components/User/CourseDetails'
import { Cart } from '../components/User/Cart'
import { Checkout } from '../components/User/Checkout'
import { Success } from '../components/User/Success'
import { Course } from '../components/User/Course'
import { UserProfile } from '../pages/User/UserProfile'
import { ResetPassword } from '../components/User/ResetPassword'
import { ForgotPassword } from '../components/User/Forgotpassword'
import { ErrorBoundary } from '../pages/User/ErrorBoundary'
import { EnrolledCourses } from '../components/User/EnrolledCourses'
import { Videos } from '../components/User/Videos'
import { Purchases } from '../components/User/Purchases'
import { Chat } from '../components/User/Chat'
import Certificate from '../components/User/Certificate'
import { Tutors } from '../components/User/Tutors'
import { TutorDetails } from '../components/User/tutorDetails'
import CancelPurchase from '../components/User/CancelPurchase'
import Transactions from '../components/User/Transactions'
import PurchaseDetails from '../components/User/PurchaseDetails'

export default function StudentRoutes() {
    return (
        <ErrorBoundary>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/sample' element={<App />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/otp' element={<Otp />} />
                <Route path='/confirmEmail' element={<ConfirmEmail />} />
                <Route path='*' element={<NotFound />} />
                <Route path='/sample' element={<Sample />} />
                <Route path='/courseDetails/:id' element={<CourseDetails />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/checkout' element={<Checkout />} />
                <Route path='/success' element={<Success />} />
                <Route path='/courses' element={<Course />} />
                <Route path='/profile' element={<UserProfile/>}/>
                <Route path='/resetPassword' element={<ResetPassword />} />
                <Route path='/forgotpassword' element={<ForgotPassword />} />
                <Route path='/enrolledCourses' element={<EnrolledCourses />} />
                <Route path='/purchases' element={<Purchases />} />
                <Route path='/videos/:id' element={<Videos />}></Route>
                <Route path='/chat' element={<Chat />}></Route>
                <Route path='/certificate' element={<Certificate />}></Route>
                <Route path='/404' element={<NotFound/>}></Route>
                <Route path='/tutors' element={<Tutors />}></Route>
                <Route path='/tutorDetails/:id' element={<TutorDetails />}></Route>
                <Route path='/cancelPurchase/:id' element={<CancelPurchase/>}></Route>
                <Route path='/transactions' element={<Transactions/>}></Route>
                <Route path='/purchaseDetails/:id' element={<PurchaseDetails/>}></Route>
            </Routes>
        </ErrorBoundary>
    )
}