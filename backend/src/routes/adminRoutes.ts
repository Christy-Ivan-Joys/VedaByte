import express from 'express'
import { AdminRepository } from '../repositories/adminRepository'
import { AdminInteractor } from '../interactors/adminInteractor'
import AdminController from '../controllers/adminController'
import { adminProtect } from '../middlewares/adminAuthMiddleware'

const repository = new AdminRepository()
const interactor = new AdminInteractor(repository)
const controller = new AdminController(interactor)

const router = express.Router()

router.post('/login',controller.onAdminLogin.bind(controller))
router.get('/all-students',adminProtect,controller.studentsData.bind(controller))
router.get('/all-tutors',adminProtect,controller.tutorsData.bind(controller))
router.post('/change-status',adminProtect,controller.onChangeStatus.bind(controller))
router.get('/applications',adminProtect,controller.applications.bind(controller))
router.post('/course-approval',adminProtect,controller.onChangeApproval.bind(controller))
router.post('/add-category',adminProtect,controller.onCreateCategory.bind(controller))
router.get('/fetch-categories',adminProtect,controller.onFetchCategories.bind(controller))
router.post('/verify-arefresh-token',controller.onRefreshToken.bind(controller))

export default router