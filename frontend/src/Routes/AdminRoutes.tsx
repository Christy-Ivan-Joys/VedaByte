import { Route, Routes } from "react-router-dom";
import { Login } from '../components/Admin/Login'
import { Dashboard } from "../components/Admin/Dashboard";
import { Students } from "../components/Admin/Students";
import { Tutors } from "../components/Admin/Tutors";
import { NotFound } from "../components/Admin/Notfound";
import { Notifications } from "../components/Admin/Notifications";
import { Applications } from "../components/Admin/Applications";
import { ApplicationDetails } from "../components/Admin/ApplicationDetails";
import { Category } from "../components/Admin/Category";
import { ErrorBoundary } from "../components/Admin/ErrorBoundary";
export function AdminRoutes() {
    return (
        <ErrorBoundary>
            <Routes>

                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/students" element={<Students />} />
                <Route path="/tutors" element={<Tutors />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/category" element={<Category />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/applicationDetails/:_id" element={<ApplicationDetails />} />
                <Route />
                <Route />
                <Route path='*' element={<NotFound />} />
            </Routes>
        </ErrorBoundary>
    )
}