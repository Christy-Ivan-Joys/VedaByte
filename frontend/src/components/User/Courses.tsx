
import '../../styles/Home.css'
import { Link } from 'react-router-dom'
import { useFetchCategoriesMutation } from '../../utils/redux/slices/userApiSlices'
import { useEffect, useState } from 'react'
import { useErrorHandler } from '../../pages/User/ErrorBoundary'
import { ArrowProps, ErrorType } from '../../types'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';


export const Courses = () => {
    const [fetchCategories] = useFetchCategoriesMutation()
    const handleError = useErrorHandler()
    const [data, setData] = useState<any>()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categories = await fetchCategories(undefined)
                if (categories.error) {
                    const errorData = categories.error as ErrorType;
                    const errorMessage = errorData.data?.message || errorData.message 
                    || 'An unknown error occurred'
                    throw new Error(errorMessage)
                }
                setData(categories.data)

            } catch (error: any) {
                handleError(error.message)
            }
        }
        fetchData()
    }, [setData])
    const PrevArrow: React.FC<ArrowProps> = ({ onClick }) => (
        <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
            <button onClick={onClick} className="text-white  h-full p-1 shadow-lg hover:bg-black hover:bg-opacity-40 focus:outline-none">
                <FaArrowLeft size={20} />
            </button>
        </div>
    );
    const NextArrow: React.FC<ArrowProps> = ({ onClick }) => (
        <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
            <button onClick={onClick} className="text-white  h-full p-1 shadow-lg hover:bg-black hover:bg-opacity-40 focus:outline-none">
                <FaArrowRight size={20} />
            </button>
        </div>
    );

const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                }
            }
        ]
    }

   return (
        <div className='flex flex-col bg-zinc-200 min-h-[500px] justify-center items-center category mb-10'>
            <div className='w-full flex justify-between items-center px-16'>
                <h1 className='text-3xl text-black font-bold p-5'>Find your right course</h1>
                <button className='bg-blue-500 rounded p-3 h-10 flex justify-center items-center  text-white font-medium mr-5'>
                    <Link to='/courses'>View all courses</Link>
                </button>
            </div>
            <div className='cards p-10 w-full'>
                <Slider {...settings}>
                    {data?.map((category: any) => (
                        <div key={category._id} className="bg-white shadow-lg h-72 w-52 card relative  transform transition-transform duration-300 ease-in-out hover:scale-105">
                            <img src={category?.categoryImage} alt="Development" className='w-full h-full object-cover transform transition-transform duration-700 ease-in-out hover:scale-105' />
                            <h2 className="text-lg font-bold text-white absolute bottom-0 left-0 w-full bg-black bg-opacity-5 text-center p-2">{category?.category}</h2>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    )
}
