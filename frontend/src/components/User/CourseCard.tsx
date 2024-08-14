import { FaBook,FaCheck } from "react-icons/fa"
import { CourseCardProps } from "../../types"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"


export const CourseCard: React.FC<CourseCardProps> = ({ courses }) => {
    const { studentInfo } = useSelector((state: any) => state.userAuth)

    const navigate = useNavigate()
    const [data, setData] = useState(courses)
    useEffect(() => {

    }, [data, setData])
    const handleCourseDetails = (id: string) => {
        console.log(data, 'in card')
        navigate(`/courseDetails/${id}`)

    }

    return (
        <>
            {courses?.length ? (
                courses?.map((course, index) => (
                    <div key={index} className="w-80 shadow-2xl rounded-md transform transition-transform duration-700 ease-in-out hover:scale-105" onClick={() => handleCourseDetails(course._id)}>
                        <div className="relative">
                            <img
                                src={course?.courseImage}
                                alt="Image"
                                className="w-80 h-60 object-cover rounded-t-lg "
                            />
                            <label htmlFor="" className="absolute top-0 left-0 bg-buttonGreen px-5 text-white font-semibold text-sm h-7 inline-flex items-center justify-center">{course?.category}</label>
                        </div>
                        <div className="w-80 shadow-2xl rounded-lg">
                            <div className="p-3">
                                <p className="font-semibold text-lg h-16">{course?.name}</p>
                                <div className=" flex px-2 justify-between  text-zinc-700">
                                    <span className='flex justify-center items-center gap-3'><FaBook />{course?.module?.length - 1} Lessons</span>
                                </div>
                            </div>
                            <div className="w-full h-20 bg-gray-100 flex justify-between px-5 items-center">
                                <div className='flex justify-center items-center'>
                                    <p className='text-buttonGreen font-bold text-xl justify-center items-center'><span className='text-gray-600 font-bold'>₹ </span>{course.price}</p>
                                </div>
                                {studentInfo && studentInfo?.enrollments?.includes(course?._id) ? (
                                    <div className='flex justify-center items-center'>
                                        <p className="flex font-semibold text-zinc-700">Enrolled <span className="text-white bg-black rounded-full p-2 ml-2"><FaCheck/></span></p>
                                    </div>
                                ) : (
                                    <div className='flex justify-start items-start '>
                                        <button className='bg-gradient-to-r from-startgreen via-middlegreen to-endgreen p-2 w-24 rounded-sm text-white hover:bg-white hover:text-black'>Enroll</button>
                                    </div>
                                )}

                            </div>
                        </div >

                    </div >

                ))
            ) : (
                <div className="flex justify-center items-center">
                    <h1 className="text-buttonGreen font-bold text-2xl text-center">No courses found !</h1>
                </div>
            )
            }

        </>

    )
}