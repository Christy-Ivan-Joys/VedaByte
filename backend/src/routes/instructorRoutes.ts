import express from 'express'
import { instructorInteractor } from '../interactors/instructorInteractor'
import { instructorRepository } from '../repositories/instructorRepository'
import instructorController from '../controllers/instructorController'
import { InstructorProtect } from '../middlewares/instructorAuthMiddleware'

const repository = new instructorRepository()
const interactor = new instructorInteractor(repository)
const controller = new instructorController(interactor)


const router = express.Router()


router.post('/register',controller.onCreateInstructor.bind(controller))
router.post('/login',controller.onInstructorLogin.bind(controller))
router.post('/add',controller.onAddCourse.bind(controller))
router.get('/courses',InstructorProtect,controller.onGetCourses.bind(controller))
router.patch('/update-image',InstructorProtect,controller.onUpdateProfileImage.bind(controller))
router.post('/verify-irefresh-token',controller.onVerifyRefreshToken.bind(controller))
router.patch('/update-profile',InstructorProtect,controller.onProfileUpdate.bind(controller))
router.post('/send-otp',InstructorProtect,controller.onSendMail.bind(controller))
router.get('/enrolled-students',InstructorProtect,controller.onFetchEnrolledStudents.bind(controller))
router.get('/categories',InstructorProtect,controller.onFetchAllCategories.bind(controller))
router.patch('/edit-course',InstructorProtect,controller.onEditCourse.bind(controller))
router.get('/imessages/:id',InstructorProtect,controller.onFetchInstructorMessages.bind(controller))
router.patch('/add-qualification',InstructorProtect,controller.onAddQualification.bind(controller))
router.patch('/add-certification',InstructorProtect,controller.onAddCertification.bind(controller))
router.patch('/add-section',InstructorProtect,controller.onAddSection.bind(controller))
router.patch('/delete-section',InstructorProtect,controller.onDeleteSection.bind(controller))
router.get('dashboard-data',InstructorProtect,controller.onFetchDashboardData.bind(controller))
router.get('/graph-data',InstructorProtect,controller.onGraphData.bind(controller))

export default router
