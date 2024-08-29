import { Request, Response, NextFunction } from 'express'
import { userInteractor } from '../interactors/userInteactor';
import { HttpStatusCodes } from '../utils/Helpers/errorResponse';


export default class userController {
  private interactor: userInteractor;
  constructor(interactor: userInteractor) {
    this.interactor = interactor;
  }

  async onCreateUser(req: Request, res: Response, next: NextFunction) {

    try {

      const user = req.body
      const data = await this.interactor.createUser(user)
      return res.status(200).json(data)

    } catch (error: any) {
      next(error)
    }
  }

  async onUserLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.body
      const data = await this.interactor.userLogin(user, res)
      res.status(200).json(data)
    } catch (error: any) {
      next(error)
    }
  }

  async onDeleteUser(req: Request, res: Response, next: NextFunction) {

  }

  async sendOtp(req: Request, res: Response, next: NextFunction) {
    try {

      const email = req.body.email
      const otp = await this.interactor.sendOtp(email, req)
      return res.status(200).json(otp)

    } catch (error: any) {
      next(error)
    }
  }

  async getCourses(req: Request, res: Response, next: NextFunction) {
    try {

      const user = req.body.studentInfo
      const page = parseInt(req.query.page as any) ;
      const limit = parseInt(req.query.limit as any) ;
      const pageData = {page,limit}
      console.log(pageData,'pageData')
      const data = await this.interactor.allCourses(user, pageData)
      return res.status(HttpStatusCodes.OK).json(data)
    } catch (error: any) {
      next(error)
    }
  }

  async onAddToCart(req: Request, res: Response, next: NextFunction) {
    try {

      const input = req.body
      const user = await this.interactor.addNewCartItem(input)
      res.status(HttpStatusCodes.OK).json(user)
    } catch (error: any) {
      next(error)
    }
  }

  async onCheckout(req: Request, res: Response, next: NextFunction) {
    try {

      const products = req.body.cart
      const userId = req.body.userId
      const data = await this.interactor.checkoutSession(products, userId)
      res.json({ id: data })
    } catch (error: any) {
      next(error)
    }
  }

  async onEnroll(req: Request, res: Response, next: NextFunction) {
    try {

      const userId = req.body.userId
      const total = req.body.total
      const data = await this.interactor.enrollCourse(userId, total)
      res.status(HttpStatusCodes.CREATED).json(data)

    } catch (error: any) {
      next(error)
    }
  }

  async onChangePassword(req: Request, res: Response, next: NextFunction) {
    try {

      const newPassword = req.body.newpassword
      const currentPassword = req.body.currentpassword
      const userId = req.body.userId
      const data = await this.interactor.passwordChange(newPassword, currentPassword, userId)

      res.status(HttpStatusCodes.OK).json(data)
    } catch (error: any) {
      next(error)
    }
  }

  async onChangeProfileImage(req: Request, res: Response, next: NextFunction) {

    try {
      const url = req.body.imageUrl
      const userId = req.body.userId
      const data = await this.interactor.changeProfileImage(url, userId)
      res.status(HttpStatusCodes.OK).json(data)
    } catch (error) {
      next(error)
    }
  }

  async onEditUserDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.body.user
      const details = req.body.data
      const data = await this.interactor.updateProfileDetails(user, details)
      res.status(HttpStatusCodes.OK).json(data)
    } catch (error: any) {
      next(error)

    }
  }

  async onRefreshToken(req: Request, res: Response, next: NextFunction) {
    try {

      let refreshToken = req.cookies.StudentRefreshToken
      const result = await this.interactor.verifyRefreshToken(refreshToken, res)
      res.status(HttpStatusCodes.OK).json(result)
    } catch (error: any) {
      next(error)
    }
  }

  async onRemoveCartItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.body.user._id
      const itemId = req.body.itemId
      const update = await this.interactor.removeCartItem(userId, itemId)
      res.status(HttpStatusCodes.OK).json(update)
    } catch (error: any) {
      next(error)
    }
  }

  async onFetchEnrolledCourses(req: Request, res: Response, next: NextFunction) {
    try {

      const userId = req.body.user._id
      const data = await this.interactor.fetchEnrolledCourses(userId)
      res.status(200).json(data)

    } catch (error: any) {
      next(error)
    }
  }
  async onFetchEnrollments(req: Request, res: Response, next: NextFunction) {
    try {

      const userId = req.body.user._id
      const data = await this.interactor.fetchAllEnrollments(userId)
      res.status(HttpStatusCodes.OK).json(data)

    } catch (error) {

      res.status(400).json(error)

    }
  }
  async onFetchCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.interactor.fetchAllCategories()
      res.status(HttpStatusCodes.OK).json(data)
    } catch (error: any) {
      if (error.message === 'No categories found') {
        res.status(404).json({ message: error.message })
      } else {
        res.status(400).json({ message: error.message })
      }
    }
  }
  async onUpdateModuleProgress(req: Request, res: Response, next: NextFunction) {

    try {
      const data = req.body.data
      const userId = req.body.user._id
      const result = await this.interactor.updateModuleProgress(data, userId)
      res.status(HttpStatusCodes.OK).json(result)

    } catch (error: any) {
      console.log(error)
      res.status(400).json({ message: error.message })
    }
  }
  async onFetchAllMessages(req: Request, res: Response, next: NextFunction) {
    const InstructorId = req.params.id
    const studentId = req.body.user._id
    try {
      const data = await this.interactor.fetchAllMessages(InstructorId, studentId)
      console.log(data, 'messages')
      res.status(HttpStatusCodes.OK).json(data)
    } catch (error: any) {
      console.log(error)
      res.status(400).json({ message: error?.message })
    }
  }

  async onGetTutors(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.interactor.fetchAllTutors()
      res.status(HttpStatusCodes.OK).json(data)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async onGetInstructorCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const InstructorId = req.params.id
      const data = await this.interactor.getAllCourses(InstructorId)
      res.status(HttpStatusCodes.OK).json(data)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async onPostCourseReview(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewerId = req.body.user._id
      const data = { ...req.body.data, reviewerId }
      const update = await this.interactor.postCourseReview(data)
      res.status(HttpStatusCodes.OK).json(update)
    } catch (error: any) {
      next(error)
    }
  }

  async onGetReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.id
      const data = await this.interactor.getCourseReviews(courseId)
      res.status(HttpStatusCodes.OK).json(data)
    } catch (error: any) {
      next(error)
    }
  }

  async onCancelEnrollment(req: Request, res: Response, next: NextFunction) {

    try {

      const userId = req.body.user._id
      const selectedCourses = req.body.selectedCourses
      const enrollmentId = req.body.enrollmentId
      const data = await this.interactor.cancelEnrollment({ selectedCourses, enrollmentId, userId })
      res.status(HttpStatusCodes.OK).json(data)

    } catch (error) {
      console.log(error)
      next(error)
    }
  }
  async onCreateWalletAddIntent(req: Request, res: Response, next: NextFunction) {

    try {
      const amount = req.body.amount
      const data = await this.interactor.makeWalletIntent(amount)
      res.status(HttpStatusCodes.CREATED).json(data)
    } catch (error) {
      next(error)
    }
  }
  async onAddtoWallet(req: Request, res: Response, next: NextFunction) {

    try {
      const amount = req.body.amount
      const userId = req.body.user._id
      const data = await this.interactor.addMoneyToWallet(amount, userId)
      res.status(HttpStatusCodes.OK).json(data)
    } catch (error) {
      next(error)
    }
  }

  async onGetWalletTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.interactor.allWalletTransactions()
      res.status(HttpStatusCodes.OK).json(data)
    } catch (error) {
      next(error)
    }
  }
  async onGetStudentMessages(req: Request, res: Response, next: NextFunction) {

    try {
      const studentId = req.body.user._id
      const instructorIds = req.body.uniqueInstructorIds
      const data = await this.interactor.getStudentMessages(studentId, instructorIds)
      res.status(HttpStatusCodes.OK).json(data)
    } catch (error) {

    }
  }
}
