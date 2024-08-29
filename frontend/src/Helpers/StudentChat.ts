import { useState, useEffect } from "react";
import { useFetchEnrolledCoursesMutation, useMessagesFromStudentMutation } from "../utils/redux/slices/userApiSlices";

export const useFetchEnrolledCoursesTutors = (handleError: (message: any) => void) => {

  const [instructors, setInstructors] = useState([]);
  const [fetchEnrolledCourses] = useFetchEnrolledCoursesMutation();
  const [messagesFromStudent] = useMessagesFromStudentMutation()
  const [studentMessages, setMessages] = useState([])
  const [fetchChange, setFetchChange] = useState(false)
  useEffect(() => {
    const fetchEnrolledCoursesTutors = async () => {
      try {
        const courses: any = await fetchEnrolledCourses(undefined);
        if (courses.error) {
          throw new Error(courses.error.data.message);
        }
        const uniqueInstructorIds: Set<string> = new Set();
        const uniqueInstructors: any = []
        courses.data.forEach((course: any) => {
          const instructorId = course.courseId.InstructorId._id;
          if (!uniqueInstructorIds.has(instructorId)) {
            uniqueInstructorIds.add(instructorId);
            uniqueInstructors.push(course.courseId.InstructorId);
          }
        })
        const instructorIdsArray = Array.from(uniqueInstructorIds);

        const messages = await messagesFromStudent({ uniqueInstructorIds: instructorIdsArray }).unwrap();
        setMessages(messages)
        setInstructors(uniqueInstructors);

      } catch (error: any) {
        console.log(error.message)
        if (
          error?.message === "Access token is required" ||
          error?.message === "User not found" ||
          error?.message === "Invalid token"

        ) {
          handleError(error.message);
        }
      }
    };

    fetchEnrolledCoursesTutors();
  }, [fetchEnrolledCourses, handleError, messagesFromStudent,fetchChange]);
  return { instructors, studentMessages,setFetchChange };
};


