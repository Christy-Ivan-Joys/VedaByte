import { admin } from "../entities/adminEntity";
import { adminInteractorInterface } from "../interfaces/adminInterfaces/iAdminInteractor";
import { AdminRepositoryInterface } from "../interfaces/adminInterfaces/iAdminRepository";
import { generateRefreshToken, generateToken } from "../utils/jwt";
import { course, instructor } from "../entities/instructorEntity";
import { category } from "../entities/categoryEntity";
import { Response } from "express";
import jwt from 'jsonwebtoken'

export class AdminInteractor implements adminInteractorInterface {
    private repository: AdminRepositoryInterface;
    constructor(repository: AdminRepositoryInterface) {
        this.repository = repository
    }

    async loginAdmin(input: any, res: any) {
        const user = await this.repository.login(input)
        const identity = 'Admin'

        if (user) {
            const encryptedPassword: any = user.password
            if (encryptedPassword === input.password) {
                await generateToken(res, user._id.toString(), identity)
                await generateRefreshToken(res, user._id.toString(), identity)
                return { user }
            } else {
                throw new Error('Invalid password')
            }
        } else {
            throw new Error('User not found')
        }
    }
    async getStudents() {
        const students = await this.repository.allStudents()
        if (students) {
            return students
        } else {
            throw new Error('No students registered !')
        }

    }
    async getTutors() {

        const tutors = await this.repository.allTutors()
        if (tutors) {
            return tutors
        } else {
            throw new Error('No tutors found')
        }

    }
    async statusChange(input: any) {
        let block = 'Blocked'
        let unBlock = 'Active'
        const role = input.role

        if (role === 'Student') {
            if (input.status === 'Active') {

                const status = await this.repository.userStatus(input.id, block)
                return status
            } else {
                const status = await this.repository.userStatus(input.id, unBlock)
                return status
            }
        } else {
            if (input.status === 'Active') {
                const status = await this.repository.tutorStatus(input.id, block)
                return status
            } else {
                const status = await this.repository.tutorStatus(input.id, unBlock)
                return status
            }
        }
    }

    async getApplications(): Promise<course | null> {
        const data = await this.repository.allApplications()
        return data
    }
    async courseApproval(id: string, action: string): Promise<any> {
        if (action === 'Approve') {
            const data = await this.repository.courseApproveOrReject(id, action)
        }
    }
    async addNewCategory(category: string, image: string): Promise<category> {
        const exist = await this.repository.findCategory(category)
        if (exist) {

            throw new Error('Category already exist')

        }

        const update = await this.repository.addCategory(category, image)
        return update
    }
    
    async getAllCategories(){
        const data = await this.repository.fetchAllCategories()
        if (data.length) {
            return data
        }
        throw new Error('No categories found')
    }

    async verifyRefreshToken(token: string, res: Response){
        const identity = 'Admin'
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_KEY as string)
            let Id
            if (decoded && typeof decoded !== 'string' && 'userId' in decoded) {
                Id = decoded.userId
                console.log(Id)
            }
            const accessToken = generateToken(res, Id, identity)
            generateRefreshToken(res, Id, identity)
            return accessToken
        }else{
            throw new Error('No refresh token found')
        }
    }
}
