import { Request, Response } from 'express';
import { ReactNode } from 'react';

declare global {
    namespace Express {
        interface Request {
            file?: any;
            files?: any;
        }
    }
}
declare global {
    namespace Express {
        interface Response {
            data?: any;
            files?: any;
        }
    }
}
export interface GoogleJwtPayload {
    iss: string;
    azp: string;
    aud: string;
    sub: string;
    email: string;
    email_verified: boolean;
    exp: number;
    family_name: string;
    given_name: string;
    iat: number;
    jti: string;
    name: string;
    nbf: number;
    picture?: string;
}
export interface FormData {
    firstname?: string,
    lastname?: string,
    name?: string;
    email: string;
    contact?: string;
    password?: string;
    confirmPassword?: string;
    googleUserId?: string;
    profileImage?: string;
}
export interface ValidationErrors {
    [key: string]: string;
}
export interface ErrorResponse {
    status: boolean;
    message: string;
}

export interface Student {
    _id: string,
    email: string,
    password: string,
    name: string,
    contact: string | any
    status: string,
    profileImage: string | any
}

export interface Tutor {
    _id: string,
    email: string,
    name: string,
    contact: string | any,
    status: string,
    profileImage: string,
    profession:string

}


export interface Module {
    _id?: any,
    title: string,
    videoURL: string,
    duration: string,
    description: string;
}

export interface CourseFormProps {
    formData: {
        _id?: string,
        name: string,
        description: string,
        category: string,
        price: string,
        courselevel: string,
        courseImage: any,
        Introvideo: any,
        module: Module[],
        InstructorId: string
    }
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
    handleModule: (data: { title: string, description: string, videoURL: string, duration: string }) => void;
   
}
export interface course1Errors {
    name: string,
    description: string,
    price: string,
    category: string,
    courselevel: string,
    courseImage: any,
    Introvideo: any
}
export interface course2Errors {
    title: string,
    video: any,
    duration: string,
    description: string,
}

export interface Course {
    _id: string;
    name: string;
    description: string;
    category: string;
    courseImage: string;
    price: string;
    Introvideo: string;
    courselevel: string;
    module: Section[];
    InstructorId: Tutor;
}

interface CourseCardProps {
    courses: Course[]
}
interface TutorCardProps {
    Tutors: Tutor[]
}
interface Application {
    _id: string;
    name: string;
    description: string;
    category: string;
    courseImage: string;
    price: string;
    courselevel: string;
    InstructorId: {
        name: string;
        profileImage: string;
        email: string;
        status: string;
        contact: string;
    }
    module: Section[]
}
interface Category {
    _id: string,
    category: string,
    categoryImage: string
}

interface ApplicationCardProps {
    Applications: Application[]
}
interface CategoryCardProps {
    Categories: Category[]
}


interface ChildrenProps {
    children: ReactNode
}
interface VideoModalProps {
    isOpen: boolean
    videoUrl: string | null | any, 
    onClose: (boolean) => void
}

interface ErrorType {

    message: string,
    error?: {
        data: {
            message: string
        }
    }
    status: number,
    data: {
        message: string
    }

}
interface ModalProps {
    isOpen: boolean;
    onClose: (type: boolean) => void;
    categories: object[];
    onFilterChange: (type: string, value: any) => void;
}
export type CloudinaryInput = Formdata
type Errorhandler = (error: string) => void


interface EnrolledCourse {
    courseId: mongoose.Types.ObjectId,
    Progress: number,
    completed: boolean,
    EnrolledAt: string,
    status:boolean
}
export interface Enrollment {

    _id: mongoose.Types.ObjectId,
    student: mongoose.Types.ObjectId,
    EnrolledCourses: EnrolledCourse[],
    Total: number
}
export interface EnrollmentCardProps {
    Enrollments: EnrolledCourse[]
}
export interface PurchaseCardProps {
    Purchases: Enrollment[]
}
interface QualificationModalProps{
    setQModalOpen:(type:boolean)=>void,
    AddNewQualification:(degree:string,institution:string)=>void

}
interface CetificationModalProps{
    setCModalOpen:(type:boolean)=>void,
    AddNewCertification:(type:string)=>void

}
export interface AddSectionModalProps{
    onClose:()=>void,
    courseId:string | any
  }
  export interface DeleteSectionModalProps{
    onClose:()=>void,
    section:Object| any
  }
  export interface ArrowProps {
    onClick?: () => void;
  }
  export interface ReviewProps{
   course:Object | any,
  }
  export type review={
    courseId:Course,
    reviewerId:Student,
    comment:string,
    rating:number,
    date:Date
  }
  export type instructorChartProps={
    courses: Array<{
        count: number;
        course:Course
      }>;
  }
  export type WalletModalProps = {
    setAddMoneyModal: (isOpen: boolean) => void;
  };
  export type WithdrawModalProps = {
    setWithdrawMoneyModal: (isOpen: boolean) => void;
  };