
import { Route, Routes } from 'react-router-dom'

import StudentRoutes from './Routes/StudentRoutes'
import { InstuctorRoutes } from './Routes/InstructorRoutes'
import { AdminRoutes } from './Routes/AdminRoutes'
export default function Routing() {

    return (
      
            <Routes>
                <Route path='/*' element={<StudentRoutes />} />
                <Route path='instructor/*' element={<InstuctorRoutes />} />
                <Route path='admin/*' element={<AdminRoutes />} />
            </Routes>
     
    )
}
