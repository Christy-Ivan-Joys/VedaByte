import { useEffect, useMemo, useState } from "react";
import Header from "./Header"
import { CourseCard } from "./CourseCard";
import { useFetchCategoriesMutation, useFetchCoursesMutation } from "../../utils/redux/slices/userApiSlices";
import { useErrorHandler } from "../../pages/User/ErrorBoundary";
import { FaSearch, FaFilter } from "react-icons/fa";
import Modal from "../../pages/User/Modal";
import { Filter } from "../../Helpers/filters";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Paginate } from "../../Helpers/Pagination";
import '../../styles/course.css'
import Slideshow from "./Slideshow";
import Footer from "./Footer";


export const Course = () => {

    const [fetchCourses] = useFetchCoursesMutation()
    const [courses, setCoursesData] = useState<any | []>([])
    const [paginatedCourses, setPaginateCourses] = useState<[]>([])
    const [fetchCategories] = useFetchCategoriesMutation()
    const handleError = useErrorHandler()
    const [categories, setCategories] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [searchWord, setSearchWord] = useState('')
    const [filterOptions, setFilterOptions] = useState({ category: '', minPrice: '', maxPrice: '', sort: '' })
    const [currentPage, setCurrentPage] = useState(1)
    const [pages, setPages] = useState(0)
    const coursePerPage = 8

    const handleFilterChange = (filterType: any, value: any) => {

        setFilterOptions((prevOptions) => ({
            ...prevOptions,
            [filterType]: value
        }))
    }

    const handleSearch = (e: any) => {
        setSearchWord(e.target.value)
    }

    const onClose = () => {
        setIsOpen(false)
    }

    useEffect(() => {
        const getData = async () => {
            try {
                const Courses = await fetchCourses(undefined).unwrap();
                if (Courses){
                    const filteredCourses = Filter(Courses, filterOptions, searchWord);
                    setCoursesData(filteredCourses);
                }
            } catch (error: any) {
                handleError(error?.data?.message);
            }
        };
    
        const getCategories = async () => {
            try {
                const categories = await fetchCategories(undefined).unwrap();
                setCategories(categories);
            } catch (error: any) {
                handleError(error?.data?.message);
            }
        };
    
        getCategories();
        getData();
    }, [filterOptions, searchWord]);
    
    const paginatedData = useMemo(() => {
        return Paginate(courses, currentPage, coursePerPage);
    }, [courses, currentPage, coursePerPage]);
    
    useEffect(() => {
        const { paginatedItems, totalPages } = paginatedData;
        setPaginateCourses(paginatedItems);
        setPages(totalPages);
    }, [paginatedData]);

    useEffect(() => {
        setCoursesData(Filter(courses, filterOptions, searchWord));
    }, [filterOptions, searchWord])

    return (
        <div className="overflow-hidden">
            <Header />
            <Slideshow />
            <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
                <div className="flex justify-between items-center p-1 mt-10">
                    <div className="flex relative w-96">
                        <input
                            onChange={handleSearch}
                            className="h-10 border-2 w-full pl-12 pr-4 rounded-md shadow focus:outline-none"
                            type="text"
                            placeholder="Search courses"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FaSearch className="text-gray-500" />
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(true)} className="ml-4 bg-buttonGreen text-white px-2 py-2 rounded-md flex items-center">
                        <FaFilter size={12} className="mr-2" /> Filter
                    </button>
                    <Modal isOpen={isOpen} onClose={onClose} categories={categories} onFilterChange={handleFilterChange} />
                </div>
            </div>

            <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-20 mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 2xl:grid-cols-4  gap-x-8 gap-y-8 ">
                    <CourseCard courses={paginatedCourses} />
                </div>
                <Stack spacing={2} className="pagination-container flex justify-center gap-2 font-semibold mb-10  mt-10 items-center">
                    <Pagination

                        color="standard"
                        count={pages}
                        shape="rounded"
                        page={currentPage}
                        onChange={(_,value) => setCurrentPage(value)}
                    />
                </Stack>


            </div>
            <Footer />

        </div>
    )
}


