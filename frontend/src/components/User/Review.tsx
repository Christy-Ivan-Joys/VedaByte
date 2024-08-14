import { useEffect, useState } from "react";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { review, ReviewProps } from "../../types";
import { useReviewsMutation, useSubmitcourseReviewMutation } from "../../utils/redux/slices/userApiSlices";
import { useErrorHandler } from "../../pages/User/ErrorBoundary";
import { Paginate } from "../../Helpers/Pagination";
import { getStars } from "./Stars";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../utils/redux/slices/userAuthSlice";

const Review: React.FC<ReviewProps> = (course) => {
    const [comment, setComment] = useState('')
    const [rating, setRating] = useState(0)
    const [fullReviews, setFullReviews] = useState<review[]>([])
    const [submitcourseReview] = useSubmitcourseReviewMutation()
    const handleError = useErrorHandler()
    const [reviews] = useReviewsMutation()
    const [Reviews, setPaginateReviews] = useState<review[]>([])
    const [errors, setErrors] = useState<{ comment: string, rating: string }>({ comment: '', rating: '' });
    const [currentPage, setCurrentPage] = useState(1)
    const [pages, setPages] = useState(0)
    const [isReviewed, setIsReviewed] = useState(false)
    const dispatch = useDispatch()
    const itemsPerPage = 3
    const studentInfo = useSelector((state: any) => state.userAuth.studentInfo);
    const [averageRating,setAverageRating] = useState<number>(0)

    useEffect(() => {
        const fetchReviews = async () => {
            if (course?.course?._id) {
                const courseId = course?.course?._id
                const reviewed = studentInfo?.reviews?.some((reviewedCourseId: any) => reviewedCourseId === courseId);
                setIsReviewed(reviewed)
                try {
                    const res = await reviews(courseId).unwrap()
                    const totalRating = res.reduce(
                        (sum: number, review: review) => sum + review.rating,
                        0
                      );
                      const average = totalRating / res.length || 0
                      setAverageRating(parseFloat(average.toFixed(2)));
                    setFullReviews(res)
                    const { paginatedItems, totalPages } = Paginate(res, currentPage, itemsPerPage)
                    setPaginateReviews(paginatedItems)
                    setPages(totalPages)
                } catch (error) {

                }
            }
        }
        fetchReviews()

    }, [course, reviews, currentPage, setIsReviewed])

    const handleReview = async () => {
        try {
            const courseId = course?.course?._id
            const newErrors = { comment: '', rating: '' };
            if (!comment.trim()) {
                newErrors.comment = 'Enter a comment to submit';
            }
            if (rating === 0) {
                newErrors.rating = 'select a rating to submit';
            }
            setErrors(newErrors);
            if (newErrors.comment === '' && newErrors.rating == '') {
                const data = { courseId, comment, rating }
                const res = await submitcourseReview({ data }).unwrap()
                console.log(res)
                dispatch(setUser({ ...res }))
            }

        } catch (error: any) {
            const message = error?.data?.message
            console.log()
            handleError(message)
        }

    }

    return (
        <div className="px-32 mx-auto p-6 bg-white shadow-md rounded-lg ">

            <h1 className="text-2xl font-semibold mb-4 text-center text-zinc-700">Review & Comments</h1>
            <div className="flex  justify-center   items-center mb-4">
                <div className=" flex flex-col items-center rounded-full ">
                    <h2 className="text-4xl font-bold">{averageRating}</h2>
                    <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                            <span key={index} className={`text-3xl ${index < averageRating ? 'text-yellow-500' : 'text-gray-300'}`}>&#9733;</span>
                              ))}
                </div>
                <p className="font-bold text-zinc-700">{fullReviews.length} <span className="font-semibold text-sm">Reviews</span></p>
            </div>
        </div>
            {
        isReviewed === false && (
            <div className="flex flex-col justify-start p-4 mb-5 border-2 mx-auto bg-white rounded-lg shadow-md w-full">
                <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                        Comment:
                    </label>
                    <textarea
                        id="comment"
                        name="comment"
                        rows={4}
                        className="mt-1 w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        placeholder="Enter your comment here"
                        onChange={(e) => setComment(e.target.value)}
                    />
                    {errors.comment ? <p className="flex justify-center items-center text-xs text-red-400">{errors.comment}</p> : ''}
                    {errors.rating ? <p className="flex justify-center items-center text-xs text-red-400">{errors.rating}</p> : ''}

                </div>

                <div className="flex justify-center gap-x-2 mb-4">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <div
                            key={num}
                            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 cursor-pointer ${rating === num ? 'bg-buttonGreen text-white' : 'bg-gray-200 text-gray-700'
                                }`}
                            onClick={() => setRating(num)}
                        >
                            {num}
                        </div>
                    ))}
                </div>

                <div>
                    <button className="flex bg-buttonGreen float-right rounded-lg px-2 text-white" onClick={handleReview}>Submit</button>
                </div>
            </div>
      )
   }
    <div>
        {Reviews.length ? (
            Reviews.map((review: review) => (
                <div className="mb-4 p-4 bg-gray-50 rounded-md shadow-sm ">
                    <div className="flex items-center mb-2">
                        <img src={review?.reviewerId?.profileImage} className="mr-2 bg-gray-300 w-8 h-8 rounded-full" />
                        <div>
                            <p className="font-semibold">{review?.reviewerId?.name}</p>
                            <p className="text-sm text-gray-500"></p>
                        </div>
                    </div>
                    <p>{review?.comment}</p>
                    <div className="flex items-center mt-2">
                        {getStars(review?.rating)}
                    </div>
                </div>
            ))
        ) : (
            <div>
                <p>No reviews found</p>
            </div>
        )}
        <Stack spacing={2} className="pagination-container flex justify-center gap-2 font-semibold mb-10  mt-10 items-center">
            <Pagination

                color="standard"
                count={pages}
                shape="rounded"
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
            />
        </Stack>


    </div>
        </div >
    );
}

export default Review
