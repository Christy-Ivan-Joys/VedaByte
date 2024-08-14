import { useEffect, useState } from "react"
import { useFetchEnrolledStudentsMutation } from "../utils/redux/slices/instructorApiSlices"


export const useFetchEnrolledCoursesStudents = (handleError: (message: string) => void) => {
    const [fetchEnrolledStudents] = useFetchEnrolledStudentsMutation()
    const [Students, setStudents] = useState([])

    useEffect(() => {
        const fetchStudentsEnrolled = async () => {
            try {

                const students: any = await fetchEnrolledStudents(undefined).unwrap()
                console.log(students)
                if (students.error) {
                    throw new Error(students.error.data.message)
                }
                setStudents(students)
            } catch (error: any) {

                console.log(error)
                if (       
                    error?.data?.message === "Access token is required" ||
                    error?.data?.message === "User not found" ||
                    error?.data?.message === "Invalid token") {
                    handleError(error?.data?.message);    
                }
            }
        }
        fetchStudentsEnrolled()
    }, [fetchEnrolledStudents,handleError])

   return Students
}