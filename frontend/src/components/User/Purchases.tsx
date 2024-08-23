import { useEffect, useState } from "react"
import { useFetchStudentEnrollmentsMutation } from "../../utils/redux/slices/userApiSlices"
import { useErrorHandler } from '../../pages/User/ErrorBoundary'
import Header from "./Header"
import { Panel } from "./Panel"
import { FaSearch } from "react-icons/fa"
import { PurchaseCard } from "./PurchaseCard"
import { Paginate } from "../../Helpers/Pagination"
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export const Purchases = () => {
    const [fetchStudentEnrollments] = useFetchStudentEnrollmentsMutation()
    const handleError = useErrorHandler()
    const [Purchases, setPurchases] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [pages, setPages] = useState(0)
    const cardsPerPage = 4

    useEffect(() => {
        const Enrollments = async () => {
            try {
                const enrollments = await fetchStudentEnrollments(undefined).unwrap()
                const { totalPages, paginatedItems } = Paginate(enrollments, currentPage, cardsPerPage)
                setPages(totalPages)
                setPurchases(paginatedItems)
            }catch(error:any){
                const message = error.data.message
                handleError(message)
            }
        }
        Enrollments()
    }, [currentPage])


    return (

        <>
            <Header />
            <div className="overflow-hidden fixed w-screen shadow-lg ">
                <Panel />
                <div className='main mt-3 overflow-y-auto '>
                    <div className="overflow-x-auto p-10 mt-2 bg-white shadow-xl rounded-lg border-2 border-sky-100 ">
                        <div className="px-8 p-2 flex justify-between items-center">
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
                        <PurchaseCard Purchases={Purchases} />
                        <Stack spacing={2} className="pagination-container flex justify-center gap-2 font-semibold mb-4 items-center">
                            <Pagination
                                color="standard"
                                count={pages}
                                shape="rounded"
                                page={currentPage}
                                onChange={(_,value) => setCurrentPage(value)}
                            />
                        </Stack>
                    </div>
                </div>
            </div>
        </>
    )
}