import { createContext, useState } from "react"



interface CourseFormContextType{
    showAddCourse:boolean
    handleAddCourseClick:()=>void
    handleCloseForm:()=>void
}
const defaultValue:CourseFormContextType={
    showAddCourse:false,
    handleAddCourseClick:()=>{},
    handleCloseForm:()=>{}
}

export const CourseFormContext = createContext<CourseFormContextType>(defaultValue)
export function CourseFormProvider({ children }: any) {

    const [showAddCourse, setShowAddCourse] = useState(false)
    const handleAddCourseClick = () => {
        setShowAddCourse(true)
    }
    const handleCloseForm = () => {
        setShowAddCourse(false)
    }
    return (
       <CourseFormContext.Provider value={{showAddCourse,handleAddCourseClick,handleCloseForm}}>
            {children}
       </CourseFormContext.Provider>
    )
}