import { useState, useEffect } from "react";
import { useFetchEnrolledCoursesMutation } from "../utils/redux/slices/userApiSlices";

export const useFetchEnrolledCoursesTutors = (handleError: (message: any) => void) => {

  const [instructors, setInstructors] = useState([]);
  const [fetchEnrolledCourses] = useFetchEnrolledCoursesMutation();

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
          if (!uniqueInstructorIds.has(instructorId)){
            uniqueInstructorIds.add(instructorId);     
            uniqueInstructors.push(course.courseId.InstructorId);
          }
        })
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
  }, [fetchEnrolledCourses, handleError]);
  console.log(instructors, 'instructors')
  return instructors;
};


