import { useNavigate } from "react-router-dom";
import { EnrollmentCardProps } from "../../types";
import { FaUserCircle } from "react-icons/fa";

export const EnrolledCoursesCard: React.FC<EnrollmentCardProps> = ({ Enrollments }) => {

    const navigate = useNavigate()
    // const handleClick = (id: string) => {
    //     onClick={() => handleClick(enrollment.courseId._id)}
    //     alert(id)
    //     navigate(`/courseDetails/${id}`)
    // }

    const handleCertificate = (enrollment: any, e: any) => {
        e.preventDefault()
        const course = JSON.stringify(enrollment)
        localStorage.setItem('certifiedCourse', course)
        navigate('/certificate')
    }

    return (
        <div className="p-2 ">
            {Enrollments.length ? (
                Enrollments.map((enrollment) => (
                    <div className="mt-3 ">
                        <div className="flex  rounded-lg shadow-xl overflow-hidden h-24 gap-10 " >
                            <div className="flex-shrink-0 p-4">

                                <img src={enrollment.courseId.courseImage} className="w-28 h-16 border-2 border-red-200" />
                            </div>
                            <div className="flex-grow flex gap-16 justify-between items-center px-4">
                                <div className="flex items-center gap-5">
                                    {enrollment?.courseId?.InstructorId?.profileImage ? (
                                        <img
                                            src={enrollment.courseId?.InstructorId?.profileImage}

                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <FaUserCircle size={37} />
                                    )}
                                    <p className="text-sm font-bold"><span className="text-buttonGreen font-semibold">Instructor</span>  : {enrollment.courseId?.InstructorId?.name}</p>
                                </div>
                                <div className="flex flex-col flex-grow gap-2">
                                    <h1 className="text-zinc-800 font-semibold"></h1>
                                    <p className="text-sm font-semibold">Progress: {Math.round(enrollment.Progress)} %</p>
                                    <p className="text-sm font-semibold">Price : {enrollment.courseId.price} </p>
                                </div>
                                <div className="flex gap-4 flex-shrink-0">
                                    {enrollment.completed === true ? (
                                        <button className="text-sm font-semibold w-full h-7 p-1 rounded-full border-2 border-pink-700 bg-pink-300" onClick={(e) => handleCertificate(enrollment, e)}>Download certificate</button>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div>
                    <h1 className="flex justify-center items-center mt-10 font-semibold text-2xl text-buttonGreen">No courses to show !</h1>
                </div>
            )}
        </div>
    );
}