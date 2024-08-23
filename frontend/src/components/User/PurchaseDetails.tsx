import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Enrollment } from "../../types";
import { useCancelEnrollmentMutation, useFetchStudentEnrollmentsMutation } from "../../utils/redux/slices/userApiSlices";
import { Panel } from "./Panel";
import Header from "./Header";
import { useErrorHandler } from "../../pages/User/ErrorBoundary";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../../utils/redux/slices/userAuthSlice";

const PurchaseDetails = () => {
    const { id } = useParams<{ id: string }>();

    const [fetchStudentEnrollments] = useFetchStudentEnrollmentsMutation();
    const [purchase, setPurchase] = useState<Enrollment | undefined>();
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
    const [cancelEnrollment] = useCancelEnrollmentMutation();
    const handleError = useErrorHandler()
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const enrollments: Enrollment[] = await fetchStudentEnrollments(undefined).unwrap();
                const matchedEnrollment = enrollments.find(record => record._id === id);
                if (matchedEnrollment) {
                    setPurchase(matchedEnrollment)
                }
            } catch (error){
                console.error("Error fetching enrollments:", error);
            }
        };
        fetchData();
    }, [id, fetchStudentEnrollments,selectedCourses]);

    const handleSelectCourse = (courseId: string) => {
        if (selectedCourses.includes(courseId)) {
            setSelectedCourses(selectedCourses.filter(id => id !== courseId));
        } else {
            setSelectedCourses([...selectedCourses, courseId]);
        }
    };

    const handleSelectAll = () => {
        if (selectedCourses.length === purchase?.EnrolledCourses.length) {
            setSelectedCourses([]);
        } else {
            setSelectedCourses(purchase?.EnrolledCourses.map(course => course.courseId._id) || []);
        }
    };

    const handleCancel = async () => {
        if (selectedCourses.length === 0) {
            toast.error('select courses to cancel')
            return
        }
        if (purchase) {
            try {
                const courseWithHighProgress: any = purchase?.EnrolledCourses?.filter((course) => {
                    return selectedCourses?.includes(course?.courseId) && course?.Progress > 20
                })
                if (courseWithHighProgress?.length > 0) {
                    toast.error('Cannot cancel courses progressed above 20%')
                    return
                }
                const user = await cancelEnrollment({ selectedCourses, enrollmentId: purchase._id }).unwrap();
                dispatch(setUser(user))
                setSelectedCourses([])
                toast.success('Enrollment cancelled successfully')
            } catch (error: any) {
                handleError(error.data.message)
                console.error("Error cancelling enrollment:", error);
            }
        }
    };

    return (
        <>
            <Header />
            <div className="overflow-hidden fixed w-screen shadow-lg">
                <Panel />
                <div className='main mt-3 overflow-y-auto'>
                    <div className="p-4">
                        <h1 className="text-xl font-semibold mb-4 text-center">Details</h1>
                        {purchase && (
                            <>
                                {purchase.EnrolledCourses.some(course => course.status) && (
                                    <div className="flex items-center mb-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedCourses.length === purchase.EnrolledCourses.length}
                                            onChange={handleSelectAll}
                                        />
                                        <label className="ml-2 text-sm">Select All Courses</label>
                                    </div>
                                )}
                                <div className="mb-4">
                                    {purchase.EnrolledCourses.length > 0 ? (
                                        purchase.EnrolledCourses.map((course) => (
                                            <div key={course.courseId._id} className={`flex items-center  mb-4 ${course.status === true ? 'bg-white' : 'bg-slate-400'}  rounded-lg shadow-md overflow-hidden`}>
                                                {course.status === true && (
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCourses.includes(course.courseId._id)}
                                                        onChange={() => handleSelectCourse(course.courseId._id)}
                                                        className="ml-4 mr-5 w-5 h-5"
                                                    />
                                                )}
                                                <img
                                                    src={course.courseId.courseImage}
                                                    alt={course.courseId.name}
                                                    className="w-12 ml-10 h-12 object-cover"
                                                />
                                                <div className="flex-grow p-4">
                                                    <h2 className="text-lg font-semibold">{course.courseId.name}</h2>
                                                    <p className="text-gray-800 text-lg font-semibold mt-2">₹ {course.courseId.price}</p>
                                                </div>
                                                <div className="px-10">
                                                    <p className="font-semibold text-lg">status : {course.status === true ? 'Enrolled' : 'cancelled'}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No courses found for this enrollment.</p>
                                    )}
                                </div>
                                {purchase.EnrolledCourses.some(course => course.status) && (
                                    <button
                                        className="bg-red-600 text-white py-2 px-4 rounded hover:cursor-pointer"
                                        onClick={handleCancel}
                                    >
                                     Cancel enrollment
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default PurchaseDetails;
