import { Request, Response, NextFunction } from "express";
import { adminInteractorInterface } from "../interfaces/adminInterfaces/iAdminInteractor";

export default class adminController {
    private interactor: adminInteractorInterface;
    constructor(interactor:adminInteractorInterface){
        this.interactor = interactor
    }

    async onAdminLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const admin = req.body
            const data = await this.interactor.loginAdmin(admin, res)
            res.status(200).json(data)
        } catch (error: any) {

            return res.status(400).json({ message: error.message })

        }
    }

    async studentsData(req: Request, res: Response, next: NextFunction) {
        try {

            const data = await this.interactor.getStudents()
            res.status(200).json(data)

        } catch (error: any) {

            return res.status(400).json({ message: error.message })
            
        }
    }
    async tutorsData(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.interactor.getTutors()
            res.status(200).json(data)

        } catch (error: any) {

            return res.status(400).json({ message: error.message })
        }
    }

    async onChangeStatus(req: Request, res: Response, next: NextFunction) {

        try {
            const data = req.body
            const status = await this.interactor.statusChange(data)
            res.status(200).json(status)
        } catch (error) {
             
            console.log(error, 'error in onchange admin Cotlrl')
        }

    }

    async applications(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            const data = await this.interactor.getApplications()
            if (data !== null) {
                res.status(200).json(data)
            } else {
                res.status(404).json({ message: 'No applications found' })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' })
        }

    }
    async onChangeApproval(req: Request, res: Response, next: NextFunction) {

        try {
            const id = req.body.id
            const action = req.body.action
            const data = await this.interactor.courseApproval(id, action)
        } catch (error) {

        }
    }
    async onCreateCategory(req: Request, res: Response, next: NextFunction) {

        try {

            const category = req.body.categoryName
            const image = req.body.url
            const data = await this.interactor.addNewCategory(category, image)
            res.status(201).json(data)

        } catch (error: any) {
            if (error.message === 'Category already exist') {
            res.status(409).json({ message: error.message })
            }else{
            res.status(400).json({ message: error.message })
            }
        }
    }

    async onFetchCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.interactor.getAllCategories()
            res.status(200).json(data)
        } catch (error: any){
            if(error.message === 'No categories found'){
                res.status(404).json({ message: error.message })
            } else {
                res.status(400).json({ message: error.message })
            }
        }
    }
    async onRefreshToken(req: Request, res: Response, next: NextFunction) {
        try {
    
          let refreshToken = req.cookies.AdminRefreshToken
          const result = await this.interactor.verifyRefreshToken(refreshToken, res)
          res.status(200).json(result)
        } catch (error: any) {
          next(error)
        }
      }
}