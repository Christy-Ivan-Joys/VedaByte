import { useEffect, useRef, useState } from "react"
import { CourseFormProps, course1Errors } from "../../../types"
import Shimmer from "../../utils/Shimmer"
import { useFetchCategoriesforInstructorMutation } from "../../../utils/redux/slices/instructorApiSlices"
import { useErrorHandler } from "../../../pages/Instructor/ErrorBoundary"

export const CourseForm1: React.FC<CourseFormProps & { validationErrors: course1Errors, setValidationErrors: (errors: course1Errors) => void }> = ({ formData, handleChange, validationErrors, setValidationErrors }) => {

    const stringRegex = /^(?!\s*$)(?!0+$).+/
    const priceRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
    var validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const videoRef = useRef<HTMLInputElement>(null)
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/x-ms-wmv']
    const levels = ['Easy','Medium','Hard']
    const [fetchCategoriesforInstructor] = useFetchCategoriesforInstructorMutation()
    const [categories, setCategories] = useState([])
    const handleError = useErrorHandler()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categories: any = await fetchCategoriesforInstructor(undefined).unwrap()
                console.log(categories)

                if (categories.error) {
                    throw new Error(categories.error.data.message)
                }

                setCategories(categories)
            } catch (error: any) {
                console.log(error)
                handleError(error.data.message)
            }
        }

        fetchData()
        let errors = {
            name: '',
            description: '',
            category: '',
            price: '',
            courselevel: '',
            courseImage: '',
            Introvideo: ''
        }

        if (!stringRegex.test(formData.name)) {
            errors.name = 'enter a valid course name'

        }
        if (!stringRegex.test(formData.category)) {
            errors.category = 'select a valid category'
        }
        if (!stringRegex.test(formData.description)) {
            errors.description = 'Enter a valid description'
        }
        if (!stringRegex.test(formData.courselevel)) {
            errors.courselevel = 'enter a valid course course level'
        }
        if (!priceRegex.test(formData.price)) {
            errors.price = 'enter a valid price'
        }
        if (formData.courseImage === null) {
            errors.courseImage = 'upload an image to continue'
        } else {
            if (formData.courseImage instanceof File) {
                let type = formData.courseImage.type
                if (!validImageTypes.includes(type)) {
                    errors.courseImage = 'Upload images with jpeg / png / gif formats'
                }
            }
        }

        if (formData.Introvideo === null) {
            errors.Introvideo = 'Upload introduction video !'

        } else {

            if (formData.Introvideo instanceof File) {
                let type = formData.Introvideo.type
                if (!validVideoTypes.includes(type)) {
                    errors.Introvideo = 'Upload video with valid format'
                }
            }
        }

        setValidationErrors(errors)

    }, [formData, setValidationErrors])
    console.log(validationErrors)

    return (
        <div>
            <h1 className="font-semibold text-xl">Step 1 : Primary details</h1>
            <div className="p-3 flex flex-col">
                <label htmlFor="" className="text-md font-semibold">Name</label>
                <input type="text" name="name" className="border-2 border-gray-300 p-2 shadow-lg rounded-md" onChange={handleChange} value={formData.name} placeholder="Name of the course" />
                {validationErrors.name && <p className="text-red-500 text-sm">{validationErrors.name}</p>}
            </div>

            <div className="py-2 px-3 flex flex-col">
                <label htmlFor="" className="text-md font-semibold">Description</label>
                <input type="text" name="description" className="border-2 border-gray-300 shadow-lg p-2 rounded-md" onChange={handleChange} value={formData.description} placeholder="Description of course" />
                {validationErrors.description && <p className="text-red-500 text-sm">{validationErrors.description}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col py-2 px-3">
                    <label className="text-md font-semibold text-black" htmlFor="category">Category</label>
                    <select className="border-2 border-blue rounded-lg p-2 shadow-lg text-black" name="category"
                        onChange={handleChange}
                        value={formData.category}
                        id="category"
                    >
                        <option value="" disabled>Select a category</option>
                        {categories.map((category:any, index) => (
                            <option key={index} value={category.category}>{category.category}</option>
                        ))}
                    </select>
                    {validationErrors.category && <p className="text-red-500 text-sm">{validationErrors.category}</p>}
                </div>
                <div className="flex flex-col py-1">
                    <label className="text-md font-semibold text-black" htmlFor="contact">Price</label>
                    <input className="border-2 border-blue rounded-lg p-2 text-black shadow-lg" type="text" placeholder="Enter your price" onChange={handleChange} value={formData.price} name='price' id="contact" />
                    {validationErrors.price && <p className="text-red-500 text-sm">{validationErrors.price}</p>}
                </div>
                 <div className="flex flex-col py-2 px-3">
                    <label className="text-md font-semibold text-black" htmlFor="category">Category</label>
                    <select className="border-2 border-blue rounded-lg p-2 shadow-lg text-black" name="courselevel"
                        onChange={handleChange}
                        value={formData.courselevel}
                        id="category">
                        <option value="" disabled>Select course level</option>
                        {levels.map((level:any, index) => (
                            <option key={index} value={level}>{level}</option>
                        ))}
                    </select>
                    {validationErrors.courselevel && <p className="text-red-500 text-sm">{validationErrors.courselevel}</p>}
                </div>

                <div className="p-3 flex flex-col">
                    <label htmlFor="section-video" className="text-md font-semibold">Section video</label>
                    <input
                        type="file"
                        id="video"
                        className="border-2 border-gray-300 p-2 shadow-lg rounded-md"
                        name="Introvideo"
                        ref={videoRef}
                        onChange={handleChange}
                        placeholder="Introduction video"
                    />
                    {validationErrors.Introvideo && <p className="text-red-500 text-sm">{validationErrors.Introvideo}</p>}
                </div>
            </div>
          
                <div className="p-3 flex flex-col">
                    <label htmlFor="" className="text-md font-semibold">Course thumpnail image</label>
                    <input type="file" className="border-2 border-gray-300 p-2 shadow-lg rounded-md" name="courseImage" id="courseImage" onChange={handleChange} placeholder="Name of the course" />
                    {validationErrors.courseImage && <p className="text-red-500 text-sm">{validationErrors.courseImage}</p>}
                </div>
          
        </div>
    )
}


