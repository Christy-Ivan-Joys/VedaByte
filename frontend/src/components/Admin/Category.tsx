
import { Sidebar } from "./Sidebar"
import { FaSearch } from "react-icons/fa"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useAddCategoryMutation, useFetchAllCategoriesMutation } from "../../utils/redux/slices/adminApiSlices"
import { CategoryCard } from "./CategoryCard"
import Header from "./Header"


export const Category = () => {
    const [isModalOpen, setModalOpen] = useState(false)
    const [categoryName, setCategoryName] = useState('')
    const [image, setImage] = useState<any>(null)
    const nameRegex = /^[A-Z][\w\s!@#$%^&*(),.?":{}|<>-]*[^\s]$/;
    const [error, setError] = useState('')
    const [addCategory] = useAddCategoryMutation()
    const [loading, isLoading] = useState(false)
    const [fetchAllCategories] = useFetchAllCategoriesMutation()
    const [categories, setCategories] = useState<any>([])
    let validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif']

    useEffect(() => {
        const fetchData = async () => {

            const category = await fetchAllCategories(undefined)
            if (category.data) {
                setCategories(category.data)
            }
        }
        fetchData()

    }, [setCategories])
    const handleSaveCategory = async () => {
        if (!nameRegex.test(categoryName)) {
            setError('Category name must start with a capital letter, contain no digits, and have no leading or trailing spaces.');
            return
        }

        if (image === null) {
            setError('Add category image to submit')
            return
        }
        isLoading(true)
        const imageData = new FormData()
        imageData.append('file', image)
        imageData.append('upload_preset', 'vedaByte')
        const handleImageUpload = async (imageData: any) => {
            const upload = await fetch(`https://api.cloudinary.com/v1_1/dzhdkfjsw/image/upload`, {
                method: 'POST',
                body: imageData
            })
            return await upload.json()
        }

        const upload = await handleImageUpload(imageData)
        const url = upload.url
        isLoading(false)
        if (!url) {
            toast.error('Unbale to upload image.Try again !')
            setImage(null)
            return
        }
        setError('')
        try {
            const update = await addCategory({ categoryName, url }).unwrap()
            console.log(update)
            setCategoryName('')
            setImage(null)
            toast.success('Category added')
            setModalOpen(false)
        } catch (error: any) {
            if (error.data.message === 'Category already exist') {
                toast.error('Category already exist')
                setCategoryName('')
            } else {

            }
        }
    }

    const handleImage = (image: File) => {
        setError('')
        const type = image.type
        alert(type)
        if (!validImageTypes.includes(type)) {
            setError('Upload images with jpeg / png / gif formats')
            return
        }

        setImage(image)

    }


    const handleAddClick = () => {
        setModalOpen(true)
    }
    const handleCloseModal = () => {
        setModalOpen(false)
    }
    const handleFilter = () => {

    }
    return (
        <div className="main-layout">
            <Sidebar />
            <div className="content ">
                <Header />
                <div className="overflow-x-auto p-10 mt-2 bg-gray-300 shadow-xl rounded-lg border-2  ">

                    <div className="px-8 p-5 flex justify-between items-center">
                        <div className="flex gap-5">
                            <button className="bg-black text-white text-md font-semibold w-28 rounded-md h-8" onClick={handleAddClick} >Add +</button>
                        </div>
                        <div className="relative w-72">
                            <input
                                type="text"
                                className="w-full h-10 pl-10 pr-4 rounded-3xl shadow focus:outline-none"
                                placeholder="Search"
                            // onChange={(e) => handleFilter(e.target.value)}
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-black pointer-events-none">
                                <FaSearch />
                            </div>
                        </div>
                    </div>
                    <div className="w-screen/2 border-t border-gray-500"></div>
                    <CategoryCard Categories={categories} />

                </div>
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
                        <div className="bg-zinc-900 p-8 rounded-lg shadow-lg w-full max-w-lg mx-4 relative slide-in">
                            <button
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                                onClick={handleCloseModal}
                            >
                                &times;
                            </button>
                            <h2 className="text-2xl font-semibold text-zinc-200 mb-4 ">Add Category</h2>
                            <input
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="Category Name"
                                className="w-full p-2 border focus:outline-none border-gray-300 rounded-md mb-4"
                            />
                            <input type="file" className="border-2 border-gray-300 p-2 bg-white shadow-lg rounded-md" name="courseImage" id="courseImage" onChange={(e: any) => handleImage(e.target.files[0])} placeholder="Name of the course" />
                            {loading ? (
                                <div>
                                    isLoadinggg............
                                </div>
                            ) : (
                                <button
                                    onClick={handleSaveCategory}
                                    className="bg-buttonGreen flex  mt-3  text-white py-1 px-4 rounded-md hover:bg-white hover:text-black"
                                >
                                    Save
                                </button>
                            )}

                            {error && <h2 className="text-xs font-normal mt-2 text-red-400">{error}</h2>}

                        </div>

                    </div>
                )}

            </div>
        </div >
    )
}