import express from 'express'
import  userController  from '../controllers/userController'
import  {userInteractor } from '../interactors/userInteactor'
import { userRepository } from '../repositories/userRepository'
import { protect } from '../middlewares/authMiddleware'

const repository = new userRepository()
const interactor = new userInteractor(repository)
const controller = new userController(interactor)

const router = express.Router()

router.post('/register',controller.onCreateUser.bind(controller))
router.post('/login',controller.onUserLogin.bind(controller))
router.post('/send-otp',controller.sendOtp.bind(controller))
router.get('/courses',controller.getCourses.bind(controller))
router.post('/add-to-cart',controller.onAddToCart.bind(controller))
router.post('/checkout',controller.onCheckout.bind(controller))
router.post('/enroll',controller.onEnroll.bind(controller))
router.post('/change-password',controller.onChangePassword.bind(controller))
router.post('/change-image',controller.onChangeProfileImage.bind(controller))
router.post('/edit-profile',protect,controller.onEditUserDetails.bind(controller))
router.post('/verify-rtoken',controller.onRefreshToken.bind(controller))
router.delete('/remove',protect,controller.onRemoveCartItem.bind(controller))
router.get('/enrolled-courses',protect,controller.onFetchEnrolledCourses.bind(controller))
router.get('/student-enrollments',protect,controller.onFetchEnrollments.bind(controller))
router.get('/categories',controller.onFetchCategories.bind(controller))
router.patch('/progress',protect,controller.onUpdateModuleProgress.bind(controller))
router.get('/messages/:id',protect,controller.onFetchAllMessages.bind(controller))
router.get('/instructors',controller.onGetTutors.bind(controller))
router.get('/inst-courses/:id',protect,controller.onGetInstructorCourses.bind(controller))
router.post('/review-course',protect,controller.onPostCourseReview.bind(controller))
router.get('/reviews/:id',controller.onGetReviews.bind(controller))
router.post('/cancel-enrollment',protect,controller.onCancelEnrollment.bind(controller))
router.post('/create-wallet-intent',protect,controller.onCreateWalletAddIntent.bind(controller))
router.post('/add-to-wallet',protect,controller.onAddtoWallet.bind(controller))
router.get('/wallet-transactions',protect,controller.onGetWalletTransactions.bind(controller))
export default router
              