import { useState } from "react"
import { validateSection } from "../../Helpers/validate"
import { useRef } from "react"
import { AddSectionModalProps } from "../../types"
import { uploadVideo } from "../../Helpers/Cloudinary"
import { toast } from "react-toastify"
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useAddSectionMutation } from "../../utils/redux/slices/instructorApiSlices"

export const AddSection: React.FC<AddSectionModalProps> = ({ onClose,courseId }) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [video, setVideo] = useState<File | null | any>(null)
    const [errors, setErrors] = useState<any>({})
    const videoRef = useRef<HTMLInputElement>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [addSection] = useAddSectionMutation()

    const handleSubmit = async () => {
        const validationErrors = validateSection(title, description, video)
        setErrors(validationErrors)

        if (Object.keys(validationErrors).length === 0) {

            try {
                setIsLoading(true)
                const vidoeData = new FormData()
                vidoeData.append('file', video)
                vidoeData.append('upload_preset', 'vedaByte')
                vidoeData.append('folder', 'vidoes')
                toast.info('Adding section...')
                const upload = await uploadVideo(vidoeData)
                const url = upload.url
                console.log(url, 'url successss')
                const newSection = { title: title, description: description, videoURL: url, duration: '',courseId }
                const response = await addSection(newSection).unwrap()
                console.log(response, 'response')
                setIsLoading(false)
                onClose()
                toast.success('Section Added')
            } catch (error) {
                console.log(error)
                setIsLoading(false)
                onClose()
            }
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-zinc-900 rounded-lg shadow-xl min-w-[600px] p-6">
                <h2 className="text-2xl mb-4 text-white">Enter the section details</h2>
                <div className="mb-4">
                    <label className="block text-gray-200 ">Title</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    {errors?.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-200">Description</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {errors.description ? <p className="text-red-500 text-sm">{errors.description}</p> : ''}
                </div>
                <div className=" flex flex-col">
                    <label htmlFor="section-video" className="text-md  text-white">Section video</label>
                    <input
                        type="file"
                        id="video"
                        className="border-2 bg-white border-gray-300 p-2 shadow-lg rounded-md"
                        name="video"
                        ref={videoRef}
                        onChange={(e) => setVideo(e.target.files ? e.target.files[0] : null)}
                        placeholder="Section video"
                    />
                    {errors.video && <p className="text-red-500 text-sm">{errors.video}</p>}
                </div>
                <div className="flex justify-end mt-3">
                    <button
                        className="bg-zinc-600 border-2 border-white text-white px-4 py-2 rounded mr-2"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    {isLoading ? (
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box>
                    ) : (
                        <button className="bg-zinc-600 border-2 border-white text-white px-6  rounded" onClick={handleSubmit}
                        >
                            Save
                        </button>
                    )}

                </div>
            </div>
        </div>
    )
}