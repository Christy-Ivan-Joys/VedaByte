import { useEffect, useRef, useState } from "react"
import { CourseFormProps, course2Errors } from "../../../types"
import { toast } from "react-toastify";
import  { Shimmer2 } from "../../utils/Shimmer";


export const CourseForm2: React.FC<CourseFormProps & { validationErrors: course2Errors, setValidationErrors: (errors: course2Errors) => void }> = ({ formData, handleModule, validationErrors, setValidationErrors }) => {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [video, setVideo] = useState<File | null | any>(null)
    const [duration, setDuration] = useState('')
    const videoRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    
    const validVideoTypes = [
        'video/mp4',
        'video/webm',
        'video/ogg',
        'video/quicktime',
        'video/x-msvideo',
        'video/x-matroska',
        'video/x-ms-wmv',
    ]
    
    const handleVideoUpload = async (data: any) => {
        const res = await fetch(`https://api.cloudinary.com/v1_1/dzhdkfjsw/video/upload`, {
            method: 'POST',
            body: data
        })
        return await res.json()
    }

    const handleAddSection = async (e: any) => {
        e.preventDefault()

        const errorEntries = Object.entries(validationErrors);
        const firstErrorEntry = errorEntries.find(([_,value]) => value !== '');
        if (firstErrorEntry) {
            const [errorField, errorMessage] = firstErrorEntry;
            toast.error(`Enter valid ${errorField}: ${errorMessage} to add section`);
            return;
        }
        try {
            if (video !== null) {
                setLoading(true)
                const vidoeData = new FormData()
                vidoeData.append('file', video)
                vidoeData.append('upload_preset', 'vedaByte')
                vidoeData.append('folder', 'vidoes')
                toast.info('Uploading video...');
                const upload = await handleVideoUpload(vidoeData)
                const videoURL = upload.url
                handleModule({ title, description, videoURL, duration })

            }

            setTitle('')
            setDescription('')
            setDuration('')

            if (videoRef.current) {
                videoRef.current.value = '';
            }
            setLoading(false)
            toast.success('section added successfully')

        } catch (error) {
            console.log(error, 'erorrororrr')
        }
    }


    useEffect(() => {
        const stringRegex = /^(?!\s*$)(?!0+$).+/
        let errors = {
            title: '',
            description: '',
            video: '',
            duration: ''
        }
        if (!stringRegex.test(title)) {
            errors.title = 'Enter a valid title'
        }
        if (!stringRegex.test(description)) {
            errors.description = 'Enter a valid description'
        }


        if (video === null) {
            errors.video = 'upload a video to continue'
        } else {
            if (video instanceof File) {
                let type = video.type
                if (!validVideoTypes.includes(type)) {
                    errors.video = 'Upload images with mp4 / webm format'
                }
            }
        }
        console.log(formData)
        setValidationErrors(errors)
    }, [setValidationErrors, title, description, video])

    return (

        <div className="flex">
            <div className="relative p-5   flex-1">
                <p className=" font-semibold text-lg text-green-600">Add section</p>
                <form className="flex flex-col ">
                    <div className="p-3 flex flex-col">
                        <label htmlFor="section-title" className="text-md font-semibold">Title</label>
                        <input
                            type="text"
                            id="section-title"
                            name="title"

                            onChange={(e) => setTitle(e.target.value)}
                            className="border-2 border-gray-300 p-2 shadow-lg rounded-md"
                            placeholder="Section title"
                            value={title}
                        />
                        {validationErrors.title && <p className="text-red-500 text-sm">{validationErrors.title}</p>}
                    </div>
                    <div className="p-3 flex flex-col">
                        <label htmlFor="section-description" className="text-md font-semibold">Description</label>
                        <input
                            type="text"
                            id="section-description"
                            name="description"
                            onChange={(e) => setDescription(e.target.value)}
                            className="border-2 border-gray-300 p-2 shadow-lg rounded-md"
                            placeholder="Section description"
                            value={description}
                        />
                        {validationErrors.description && <p className="text-red-500 text-sm">{validationErrors.description}</p>}
                    </div>
                    <div className="p-3 flex flex-col">
                        <label htmlFor="section-video" className="text-md font-semibold">Section video</label>
                        <input
                            type="file"
                            id="video"
                            className="border-2 border-gray-300 p-2 shadow-lg rounded-md"
                            name="video"
                            ref={videoRef}
                            onChange={(e) => setVideo(e.target.files ? e.target.files[0] : null)}
                            placeholder="Section video"

                        />
                        {validationErrors.video && <p className="text-red-500 text-sm">{validationErrors.video}</p>}
                    </div>
                    <input
                        type="hidden"
                        name="duration"
                        className="border-2 border-gray-300 p-2 shadow-lg rounded-md"
                        placeholder="Duration"
                    />
                    <div className="flex justify-end p-3">
                        <button onClick={handleAddSection} className="bg-blue-800 text-white w-28 h-10 font-semibold rounded-full shadow-lg ">
                            Add section
                        </button>
                    </div>
                </form>
                {loading && <Shimmer2 />} {/* Step 3: Conditional rendering */}
            </div>

        </div>
    );
};
