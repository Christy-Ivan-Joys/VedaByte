import { useNavigate } from "react-router-dom"
import { CourseCardProps } from "../../types"



export const CourseCard: React.FC<CourseCardProps> = ({ courses }) => {
    const navigate = useNavigate()
    const handleClick = () => {

    }
    const handleEdit = (id: string) => {

        navigate(`/instructor/editCourse/${id}`)

    }

    return (

        <div className="p-5 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {courses.length ? (

                courses.map(course => (
                    <div key={course._id} className="max-w-sm mx-auto bg-white rounded-lg  shadow-2xl overflow-hidden p-2 " onClick={handleClick}>
                        <div className="flex justify-center p-4">
                            <img src={course.courseImage} alt={`${course.name} Image`} className="w-full h-44 border-2 border-red-200" />
                        </div>
                        <div className="p-4">
                            <h2 className="text-md font-semibold mb-2">{course.name}</h2>
                            <p className="text-gray-600 mb-2">{course.category}</p>

                            <p className="text-end mb-2">Rating: 5000</p>
                            <div className="flex justify-between items-center">
                                <button className="w-24 bg-black rounded-lg h-7 text-sm text-white" onClick={() => handleEdit(course._id)}>Edit course</button>
                                <p className="text-end">Price: {course.price}</p>
                            </div>

                        </div>
                    </div>

                ))

            ) : (


                <div className="flex items-center justify-center w-full">
                    <h1 className="text-center font-semibold text-2xl text-buttonGreen">No courses to show!</h1>
                </div>
            )}

        </div>
    )
}