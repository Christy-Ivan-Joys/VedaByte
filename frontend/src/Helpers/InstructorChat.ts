import { useEffect, useState } from "react"
import { useFetchEnrolledStudentsMutation, useInstructorMessagesMutation } from "../utils/redux/slices/instructorApiSlices"


export const useFetchEnrolledCoursesStudents = (handleError: (message: string) => void) => {
    const [fetchEnrolledStudents] = useFetchEnrolledStudentsMutation()
    const [students, setStudents] = useState([])
    const [instMessages, setInstructorMessages] = useState([])
    const [fetchChange, setFetchChange] = useState(false)
    const [instructorMessages] = useInstructorMessagesMutation()

    useEffect(() => {
        console.log('hook working')
        const fetchStudentsEnrolled = async () => {
            try {

                const students: any = await fetchEnrolledStudents(undefined).unwrap()
                if (students.error) {
                    throw new Error(students.error.data.message)
                }
                const messages = await instructorMessages(undefined).unwrap()
                setInstructorMessages(messages)
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
    }, [fetchEnrolledStudents, handleError,fetchChange])
    return {students,instMessages,setFetchChange}
}