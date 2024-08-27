import { Route, Routes } from "react-router-dom";
import Login from "../components/Instructor/Login"
import Register from "../components/Instructor/Register";
import Otp from "../components/Instructor/Otp";
import { Dashboard } from "../components/Instructor/Dashboard";
import { Students } from "../components/Instructor/Students";
import { Profile } from "../components/Instructor/Profile";
import { NotFound } from "../components/Admin/Notfound";
import { Courses } from "../components/Instructor/Courses";
import { CourseFormProvider } from "../components/Instructor/CourseFormContext";
import { AddCourse } from "../components/Instructor/AddCourse";
import { ResetPassword } from "../components/Instructor/ResetPassword";
import { IErrorBoundary } from "../pages/Instructor/ErrorBoundary";
import { Chat } from "../components/Instructor/Chat";
import { EditCourse } from "../components/Instructor/EditCourse";
import ProtectedRoute from "../components/Instructor/Protect";
import Enrollments from "../components/Instructor/Enrollments";
export function InstuctorRoutes() {
    return (
        <IErrorBoundary>
            <CourseFormProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/otp" element={<Otp />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/students" element={<Students/>}/>
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/addcourse" element={<ProtectedRoute><AddCourse /></ProtectedRoute>} />
                    <Route path="/404" element={<NotFound />} />
                    <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
                    <Route path="/resetPassword" element={<ResetPassword />} />
                    <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                    <Route path="/editCourse/:id" element={<ProtectedRoute><EditCourse /></ProtectedRoute>} />
                    <Route path="/enrollments" element={<ProtectedRoute><Enrollments /></ProtectedRoute>}></Route>
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </CourseFormProvider>
        </IErrorBoundary>
    )
}