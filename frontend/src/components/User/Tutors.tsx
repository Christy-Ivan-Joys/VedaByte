import Header from "./Header";
import { FaSearch } from "react-icons/fa";
import '../../styles/tutors.css';
import { useEffect, useState } from "react";
import { useInstructorsMutation } from "../../utils/redux/slices/userApiSlices";
import { TutorCard } from "../../pages/User/TutorCard";
import { Paginate } from "../../Helpers/Pagination";
import Pagination from '@mui/material/Pagination';
import tutor1 from '../../../public/images/tutor1.jpg'
import Stack from '@mui/material/Stack'
import Footer from "./Footer";
import { useErrorHandler } from "../../pages/User/ErrorBoundary";
import '../../styles/spinner.css'

export const Tutors = () => {
    const [tutors] = useInstructorsMutation();
    const [searchWord, setSearchWord] = useState('');
    const [tutorsData, setTutors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [pages, setPages] = useState(0)
    const [loading, setLoading] = useState(false)
    const handleError = useErrorHandler()
    const coursePerPage = 8

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const instructor = await tutors(undefined).unwrap();
                const regex = new RegExp(searchWord, 'i');
                const filteredtutors = instructor.filter((tutor: any) => regex.test(tutor.name) || regex.test(tutor.profession));
                const { paginatedItems, totalPages } = Paginate(filteredtutors, currentPage, coursePerPage)
                setTutors(paginatedItems)
                setPages(totalPages)
                setLoading(false)
            } catch (error: any){
                handleError(error.data.message)
                console.log(error)
            }
        };

        fetchData();
    }, [tutors, currentPage, searchWord])

    return (
        <div className="overflow-hidden">
            <Header />
            <div className="flex justify-center items-center h-96 relative">
                <img src={tutor1} className="absolute inset-0 w-full h-full object-cover" alt="Tutor" />
                <div className="flex flex-col justify-center gap-5 items-center text-center text-4xl sm:text-6xl font-bold border-2 w-full h-full bg-black bg-opacity-50">
                    <div className="flex flex-col  items-center mb-4">
                        <h1 className="text-3xl font-bold text-center text-buttonGreen z-10">Meet our Instructors</h1>
                        <p className="text-lg  mt-2 z-10">Meet our expert instructors who are passionate about teaching and committed to helping you succeed.</p>
                    </div>
                    <div className="flex relative w-96 text-black">
                        <input
                            onChange={(e) => setSearchWord(e.target.value)}
                            className="h-10 border-2 w-full pl-12 pr-4 text-sm rounded-full shadow focus:outline-none"
                            type="text"
                            placeholder="Search"
                            value={searchWord}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FaSearch size={20} className="text-buttonGreen" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center px-10 py-16">
                {tutorsData.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-5">
                        <TutorCard Tutors={tutorsData} />
                    </div>
                ):(
                    loading ? (
                        <div className="flex justify-center items-center">
                            <div className="flex loader"></div>
                        </div>
                    ) : (
                        <p>No tutors data available</p>
                    )
                )}
            </div>
            <Stack spacing={2} className="pagination-container flex justify-center gap-2 font-semibold mb-10 mt-10 items-center">
                <Pagination
                    color="standard"
                    count={pages}
                    shape="rounded"
                    page={currentPage}
                    onChange={(_, value) => setCurrentPage(value)}
                />
            </Stack>
            <Footer />
        </div >
    );
};
