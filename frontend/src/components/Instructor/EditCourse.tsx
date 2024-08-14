import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useCoursesMutation, useEditCourseMutation, useFetchCategoriesforInstructorMutation } from "../../utils/redux/slices/instructorApiSlices"
import { useErrorHandler } from "../../pages/Instructor/ErrorBoundary"
import { CourseFormProps } from "../../types"
import { uploadVideo } from "../../Helpers/Cloudinary"
import { handleImageUpload } from "../../Helpers/Cloudinary"
import { toast } from "react-toastify"
import { validateCourseForm } from "../../Helpers/validate"
import { AddSection } from "./AddSection"
import SectionRemoveModal from "../../pages/Instructor/sectionRemoveModal"

export const EditCourse = () => {

    const levels = ['Easy', 'Medium', 'Hard']
    const { id } = useParams()
    const [courses] = useCoursesMutation()
    const [data, setData] = useState<any>()
    const handleError = useErrorHandler()
    var validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/x-ms-wmv']
    const [categories, setCategories] = useState<[]>([])
    const [editSectionVideoIndex, setEditSectionVideoIndex] = useState(null)
    const [showVideoIndex, setShowVideoIndex] = useState<any>(null)
    const [fetchCategories] = useFetchCategoriesforInstructorMutation()
    const [editCourse] = useEditCourseMutation()
    const [loading, setLoading] = useState(false)
    const [validationErrors, setValidationErrors] = useState<any>(null)
    const navigate = useNavigate()
    const [SectionModal, setAddSectionModal] = useState(false)
    const [sectionDeleteModal, setDeleteSectionModal] = useState(false)
    const [sectionToDelete,setSectionToDelete] = useState(null)
    const [formData, setFormData] = useState<CourseFormProps['formData']>({
        name: '',
        description: '',
        category: '',
        price: '',
        courselevel: '',
        courseImage: '',
        Introvideo: '',
        module: [],
        InstructorId: ''

    })
    useEffect(() => {
        const fetchData = async () => {
            try {
                const Courses: any = await courses(undefined).unwrap()
                if (Courses) {
                    Courses.map((course: any) => {
                        if (course._id === id) {
                            setData(course)
                            setFormData({
                                _id: course._id,
                                name: course?.name,
                                description: course?.description,
                                category: course?.category,
                                price: course?.price,
                                courselevel: course?.courselevel,
                                courseImage: course?.courseImage,
                                Introvideo: course?.Introvideo,
                                module: course?.module,
                                InstructorId: course?.InstructorId
                            })
                        }
                    })
                }

                const categories = await fetchCategories(undefined).unwrap()
                if (categories) {
                    setCategories(categories)
                }
            } catch (error: any) {
                console.log(error)
                handleError(error?.data?.message)
            }
        }
        fetchData()
    }, [courses, setFormData, fetchCategories, handleError, SectionModal])

    const handleEditSubmit = async () => {
        setValidationErrors(null)
        const validationErrors = validateCourseForm(formData.name, formData.description, formData.price)
        const errors = Object.keys(validationErrors)
        if (errors.length) {
            setValidationErrors(validationErrors)
            return
        }
        try {
            const EditCourse = await editCourse({ formData }).unwrap()
            navigate('/instructor/courses')
            console.log(EditCourse)
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        if (e.target instanceof HTMLInputElement && e.target.files) {
            const file = e.target.files[0]
            const filetype = file.type
            const fileData = new FormData()
            fileData.append('file', file)
            fileData.append('upload_preset', 'vedaByte')
            let url
            if (validImageTypes.includes(filetype)) {
                setLoading(true)
                const upload = await handleImageUpload(fileData)
                url = upload.url
                if (url) {
                    setLoading(false)
                    toast.success('Image uploaded')
                }
            } else if (validVideoTypes.includes(filetype)) {
                const upload = await uploadVideo(fileData)
                url = upload.url
                if (url) {
                    toast.success('Video uploaded successfully')
                }
            } else {
                //enter the error for teh files in not format
            }
            setFormData({
                ...formData, [name]: url
            })
        } else {
            setFormData({ ...formData, [name]: value })
        }
    }

    const handleModule = async (index: number, e: any) => {
        const { name, value } = e.target;
        if (e.target instanceof HTMLInputElement && e.target.files) {
            const file = e.target.files[0];
            const filetype = file.type;
            if (validVideoTypes.includes(filetype)) {
                setLoading(true)
                const videoData = new FormData();
                videoData.append('file', file);
                videoData.append('upload_preset', 'vedaByte');
                const res: any = await uploadVideo(videoData);
                if (res.url) {
                    const updatedModule = formData.module.map((section, i) => {
                        return index === i ? { ...section, videoURL: res.url } : section;
                    })
                    setLoading(false)
                    setFormData({ ...formData, module: updatedModule })
                }
            }
        } else {
            const updatedModule = formData.module.map((section, i) => {
                return index === i ? { ...section, [name]: value } : section;
            });
            setFormData({ ...formData, module: updatedModule });
        }
    }
    console.log(formData)
    return (
        <div className="p-10 overflow-hidden">
            <h1 className="font-semibold text-xl text-center">Edit Course</h1>
            <div className="p-3 flex flex-col">
                <label htmlFor="" className="text-md font-semibold">Name</label>
                <input type="text" name="name" className="border-2 border-gray-300 p-1 shadow-lg rounded-md" onChange={handleChange} value={formData?.name} placeholder="Name of the course" />
                {validationErrors?.name && <p className="text-red-500 text-sm">{validationErrors.name}</p>}
            </div>

            <div className="py-2 px-3 flex flex-col">
                <label htmlFor="" className="text-md font-semibold">Description</label>
                <input type="text" name="description" className="border-2 border-gray-300 shadow-lg p-1 rounded-md" value={formData?.description} placeholder="Description of course" onChange={handleChange} />
                {validationErrors?.description && <p className="text-red-500 text-sm">{validationErrors.description}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col py-2 px-3">
                    <label className="text-md font-semibold text-black" htmlFor="category">Category</label>
                    <select className="border-2 border-blue rounded-lg p-1 shadow-lg text-black" name="category"
                        onChange={handleChange}
                        value={data?.category}
                        id="category"
                    >
                        <option value={formData?.category} disabled>Select a category</option>
                        {categories.map((category: any, index) => (
                            <option key={index} value={category.category}>{category.category}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col py-1">
                    <label className="text-md font-semibold text-black" htmlFor="contact">Price</label>
                    <input className="border-2 border-blue rounded-lg p-1 text-black shadow-lg" type="text" value={formData?.price} placeholder="Enter your price" name='price' id="contact" onChange={handleChange} />
                    {validationErrors?.price && <p className="text-red-500 text-sm">{validationErrors.price}</p>}
                </div>
                <div className="flex flex-col py-2 px-3">
                    <label className="text-md font-semibold text-black" htmlFor="category">Course level</label>
                    <select className="border-2 border-blue rounded-lg p-1 shadow-lg text-black" name="courselevel"
                        onChange={handleChange}
                        value={formData.courselevel}
                        id="category">
                        <option value="" disabled>Select course level</option>
                        {levels.map((level: any, index) => (
                            <option key={index} value={level}>{level}</option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="p-2">
                        <label htmlFor="section-video" className="text-md font-semibold w-full">Introduction video</label>
                        <input type="file" onChange={handleChange} name="Introvideo" placeholder="Introduction video"
                            className="border-2 border-gray-300 p-1 w-full shadow-lg rounded-md"
                        />
                        {/* {validationErrors.Introvideo && <p className="text-red-500 text-sm">{validationErrors.Introvideo}</p>} */}
                    </div>

                    <div className="p-2">
                        <label htmlFor="courseImage" className="text-md font-semibold">Course thumbnail image</label>
                        <input type="file" onChange={handleChange} className="border-2 border-gray-300 p-1 w-full shadow-lg rounded-md"
                            name="courseImage"
                            id="courseImage"
                            placeholder="Name of the course"
                        />
                        {/* {validationErrors.courseImage && <p className="text-red-500 text-sm">{validationErrors.courseImage}</p>} */}
                    </div>
                </div>
            </div>

            <div className="flex border-2">
                <div className="relative p-5   flex-1 ">
                    <p className=" font-semibold text-lg text-green-600 text-center">Course sections</p>

                    <div className="flex flex-col  ">
                        {formData?.module?.map((section: any, index: any) => (
                            <div className="border-2 border-zinc-200  p-3 mt-3">
                                <button
                                    className="text-white font-bold bg-black float-right"
                                    onClick={() => {
                                        setSectionToDelete(section,); 
                                        setDeleteSectionModal(true);
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                {sectionDeleteModal && (
                                    <SectionRemoveModal onClose={() => setDeleteSectionModal(false)} section={sectionToDelete} />
                                )}
                                <h1 className="text-center text-zinc-700 font-semibold" >Section {index + 1}</h1>
                                <div className="p-2 flex flex-col">
                                    <label htmlFor="section-title" className="text-md font-semibold">Title</label>
                                    <input type="text" id="section-title" name="title" onChange={(e) => handleModule(index, e)}
                                        className="border-2 border-gray-300 p-1 shadow-lg rounded-md"
                                        placeholder="Section title"
                                        value={section?.title}
                                    />
                                    {/* {validationErrors.title && <p className="text-red-500 text-sm">{validationErrors.title}</p>} */}
                                </div>
                                <div className="p-3 flex flex-col">
                                    <label htmlFor="section-description" className="text-md font-semibold">Description</label>
                                    <input type="text" id="section-description" name="description" onChange={(e) => handleModule(index, e)}
                                        className="border-2 border-gray-300 p-2 shadow-lg rounded-md"
                                        placeholder="Section description"
                                        value={section?.description}
                                    />
                                    {/* {validationErrors.description && <p className="text-red-500 text-sm">{validationErrors.description}</p>} */}
                                </div>

                                <div className="flex">
                                    {editSectionVideoIndex === index ? (
                                        <div className="flex">
                                            <div>
                                                <label htmlFor="courseImage" className="text-md font-semibold">New section video</label>
                                                <input type="file" className="border-2 border-gray-300 p-1 w-full shadow-lg rounded-md" name="courseImage" onChange={(e) => handleModule(index, e)}
                                                    id="courseImage"
                                                    placeholder="Name of the course"
                                                />
                                            </div>
                                            <button
                                                className="top-2 right-2 text-red-800"
                                                onClick={() => setEditSectionVideoIndex(null)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                            {/* {validationErrors.courseImage && <p className="text-red-500 text-sm">{validationErrors.courseImage}</p>} */}
                                        </div>
                                    ) : (
                                        <button className=" ml-3 w-24 bg-blue-400 rounded-lg text-white" onClick={() => setEditSectionVideoIndex(index)}>Edit video</button>
                                    )}
                                    <div className="ml-5">
                                        <button className="bg-blue-400 text-white  rounded-lg w-22 h-8 p-1" onClick={() => setShowVideoIndex(index)}>watch video</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="float-end font-semibold w-32 h-10 bg-white text-black border-2 border-black rounded-lg mt-3" onClick={() => setAddSectionModal(true)}>Add section</button>
                </div>
                {showVideoIndex !== null && (
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-5 rounded-lg shadow-lg relative">
                            <button
                                className="absolute top-2 right-2 text-red-800"
                                onClick={() => setShowVideoIndex(null)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <video src={data?.module[showVideoIndex]?.videoURL} controls className="w-96 h-72 mt-6" />
                        </div>
                    </div>
                )}
                {SectionModal && (
                    <AddSection onClose={() => setAddSectionModal(false)} courseId={formData._id} />
                )}

            </div>
            <div className="flex justify-center">
                {loading ? (
                    <p>Data loading Please wait...</p>
                ) : (
                    <button className=" mt-5 float-right w-20 h-10 bg-buttonGreen text-white rounded lg" onClick={handleEditSubmit}>Submit</button>
                )}
            </div>
        </div >
    )
}