import { FaYoutube } from "react-icons/fa"
import Header from "./Header"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useFetchCoursesMutation, useFetchEnrolledCoursesMutation, useUpdateProgressMutation } from "../../utils/redux/slices/userApiSlices";
import { Course, EnrolledCourse, Module } from "../../types";
import { useRef } from "react";
import { useCallback } from "react";
import { useErrorHandler } from "../../pages/User/ErrorBoundary";
import { useSelector } from "react-redux";

export const Videos = () => {

    const { id } = useParams()
    const [fetchCourses] = useFetchCoursesMutation()
    const studentInfo = useSelector((state: any) => state.userAuth.studentInfo)
    const [course, setCourseData] = useState<Course | null | any>(null)
    const [enrollment, setEnrollment] = useState<EnrolledCourse | null | any>(null)
    const [selectedSection, setSelectedSection] = useState<Module | null>(null)
    const handleError = useErrorHandler()
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [updateSectionProgress] = useUpdateProgressMutation()
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [fetchEnrolledCourses] = useFetchEnrolledCoursesMutation()
    const [progress,setProgress] = useState(0)
    useEffect(() => {
        const getData = async () => {
            try {
                const courses = await fetchCourses({
                    studentInfo,
                    page:'0',
                    limit:'0'
                }).unwrap()
                const enrolledCourses = await fetchEnrolledCourses(undefined).unwrap()
                if (enrolledCourses) {
                    const enrolledCourse: EnrolledCourse = enrolledCourses.find((enrollment: any) => {
                        return enrollment.courseId._id === id
                    })
                    console.log(enrolledCourse.Progress,'tnis is the progress')
                    setProgress(enrolledCourse?.Progress)
                    setEnrollment(enrolledCourse)
                }
                if (courses) {
                    const course = courses.find((course: any) => {
                        return course._id === id
                    })
                    setCourseData(course)
                    setSelectedSection(course.module[0])
                }
            } catch (error: any) {
                console.log(error,'this is the eroror')
                handleError(error?.data?.message)
            }
        }
        getData()
    }, [fetchCourses, id])

    const handleSelectSection = (section: Module) => {
        setSelectedSection(section)
    }
    const handleTimeUpdate = useCallback((e: any) => {
        setCurrentTime(e.currentTarget.currentTime)
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(async () => {
            try {
                const progress = (currentTime / duration) * 100;
                const data = {
                    courseId: course._id,
                    moduleId: selectedSection?._id,
                    progress: progress,
                }
                const update = await updateSectionProgress({ data }).unwrap();
                update.EnrolledCourses.map((Course:EnrolledCourse)=>{
                    if(Course.courseId._id === course._id){
                         setProgress(Course?.Progress)
                    }
                })
                console.log('Update Response:', update);
            } catch (error: any) {
                handleError(error.data.message)
                console.error('Error updating section progress:', error);
            }
        }, 2000)
    },[currentTime, duration, selectedSection, updateSectionProgress,progress]);

    const handleLoadedMetadata = (event: React.SyntheticEvent<HTMLVideoElement, Event>) => {

        setDuration(event.currentTarget.duration)
    }
    
    return (
        <div className="overflow-hidden">
            <Header />
            <div className="px-52 py-10">
                <h1 className="font-semibold text-xl text-zinc-800 ml-24">Section :{ } {selectedSection?.title}</h1>
                <div className=" flex  justify-center items-center p-3">
                    <div className="w-full h-full flex justify-center items-center">
                        {selectedSection?.videoURL && (
                            <video key={selectedSection?.videoURL}  onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} controls width={900}>
                                <source src={selectedSection?.videoURL} type="video/mp4"/>
                            </video>
                        )}
                    </div>
                </div>
                <div className="flex flex-col px-16 gap-5 ">
                    <h1 className="font-semibold text-xl text-zinc-800">Course Sections</h1>
                    <div className="flex flex-col gap-3">
                        {course?.module?.map((section: any, index: any) => (
                            <div key={index} className={`flex justify-between items-center w-full h-10 border-2 border-zinc-200 ${selectedSection?.videoURL === section.videoURL ? 'bg-indigo-600' : 'bg-indigo-500'} rounded-md px-5`} onClick={() => handleSelectSection(section)}>
                                <div className="flex gap-5 text-white font-md text-sm">
                                    <p>Section : <span className="text-zinc-800 font-semibold" >{index + 1}</span>  {section.title}</p>
                                </div>
                                <div className="flex gap-5">
                                    <p className="flex text-3xl font-medium text-white  gap-2 justify-start items-center">
                                        <span className="text-sm text-zinc-200">Duration{section.duration}</span>
                                        <FaYoutube />
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center items-center">
                        <div className="flex flex-col items-center gap-5">
                            <h1 className="font-semibold text-xl text-zinc-800">Progress</h1>
                            <div className="flex justify-center items-center w-96 h-10 p-5 bg-zinc-900 rounded-full shadow-lg relative">
                                <div className="flex w-full bg-gray-200 h-2 rounded-md relative overflow-hidden">
                                    <div className="bg-green-500 h-full rounded-md" style={{ width: `${enrollment?.Progress}%` }}></div>
                                    <div
                                        className="absolute  transform -translate-y-1/2 rounded-full bg-green-700  border-zinc-900"
                                        style={{
                                            width: '20px',
                                            height: '25px',
                                            left: `calc(${enrollment?.Progress}% - 10px)`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <h1 className="font-semibold">{Math.round(enrollment?.Progress)} %</h1>
                        </div>
                    </div>



                </div>

            </div>
        </div>
    )
}