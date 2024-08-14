import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Enrollment } from "../../types";
import { useCancelEnrollmentMutation, useFetchStudentEnrollmentsMutation } from "../../utils/redux/slices/userApiSlices";
import { Panel } from "./Panel";
import Header from "./Header";

const CancelPurchase = () => {
    const { id } = useParams<{ id: string }>();

    const [fetchStudentEnrollments] = useFetchStudentEnrollmentsMutation();
    const [purchase, setPurchase] = useState<Enrollment | undefined>();
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
    const[cancelEnrollment] = useCancelEnrollmentMutation()
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const enrollments: Enrollment[] = await fetchStudentEnrollments(undefined).unwrap();
                const matchedEnrollment = enrollments.find(record => record._id === id);
                if (matchedEnrollment) {
                    setPurchase(matchedEnrollment);
                }
            } catch (error) {
                console.error("Error fetching enrollments:", error);
            }
        }
        fetchData();
    }, [id, fetchStudentEnrollments]);

    const handleSelectCourse = (courseId: string) => {
        if (selectedCourses.includes(courseId)) {
            setSelectedCourses(selectedCourses.filter(id => id !== courseId));
        } else {
            setSelectedCourses([...selectedCourses, courseId]);
        }
    };

    const handleSelectAll = () => {
        if (selectedCourses.length === purchase?.EnrolledCourses.length) {
            setSelectedCourses([])
        } else {
            setSelectedCourses(purchase?.EnrolledCourses.map(course => course.courseId) || []);
        }
    };

    const handleCancel = async() => {
        alert('enrer')
        const enrollmentId = purchase?._id
        
     const result = await cancelEnrollment({selectedCourses,enrollmentId}).unwrap()
     console.log(result,'this is result')
    }  

    return (
        <>
            <Header />
            <div className="overflow-hidden fixed w-screen shadow-lg ">
                <Panel />
                <div className='main mt-3 overflow-y-auto '>
                    <div className="p-4">
                        <h1 className="text-xl font-semibold mb-4 text-center">Cancel Enrollment</h1>
                        <div className="flex items-center mb-4 ">
                            <input
                                type="checkbox"
                                checked={selectedCourses.length === purchase?.EnrolledCourses.length}
                                onChange={handleSelectAll}
                            />
                            <label className="ml-2 text-sm">Select All Courses</label>
                        </div>
                        <div className="mb-4">
                            {purchase?.EnrolledCourses?.map((course) => (
                                <div key={course.courseId._id} className="flex items-center mb-4 bg-white rounded-lg shadow-md overflow-hidden">
                                    <input
                                        type="checkbox"
                                        checked={selectedCourses.includes(course.courseId._id)}
                                        onChange={() => handleSelectCourse(course.courseId._id)}
                                        className="ml-4 mr-5 w-5 h-5"
                                    />
                                    <img   
                                        src={course.courseId.courseImage}
                                        alt={course.courseId.name}
                                        className="w-12 h-12 object-cover"
                                    />
                                    <div className="flex-grow p-4">
                                        <h2 className="text-lg font-semibold">{course.courseId.name}</h2>
                                        <p className="text-gray-800 text-lg font-semibold mt-2">₹ {course.courseId.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            className="bg-red-600 text-white py-2 px-4 rounded"
                            disabled={selectedCourses.length === 0}
                            onClick={handleCancel}
                        >
                            Cancel Selected Courses
                        </button>
                    </div>
                </div>
            </div>
        </>

    );
}

export default CancelPurchase;
