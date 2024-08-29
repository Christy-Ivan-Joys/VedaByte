import { FaSearch, FaPlus, FaMoneyBillWave } from "react-icons/fa"
import Header from "./Header"
import { Panel } from "./Panel"
import { Pagination, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import WalletModal from "../../pages/User/WalletModal"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useSelector } from "react-redux"
import { useWalletTransactionsMutation } from "../../utils/redux/slices/userApiSlices"
import { Paginate } from "../../Helpers/Pagination"
import '../../styles/spinner.css'
import WithdrawModal from "../../pages/User/WithdrawModal"
const Transactions = () => {
    const [addMoneyModal, setAddMoneyModal] = useState<boolean>(false)
    const [withdrawMoneyModal,setWithdrawMoneyModal] = useState<boolean>(false)
    const publishKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string
    const stripePromise = loadStripe(publishKey);
    const { studentInfo } = useSelector((state: any) => state.userAuth)
    const [walletPayments, setWalletPayments] = useState<[]>([])
    const [walletTransactions] = useWalletTransactionsMutation()
    const [currentPage, setCurrentPage] = useState(1)
    const [pages, setPages] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const coursePerPage = 6
    useEffect(() => {
        const fetchTransactions = async () => {
            setIsLoading(true)
            const transactions: any = await walletTransactions(undefined).unwrap()
            const { totalPages, paginatedItems } = Paginate(transactions.transactions, currentPage, coursePerPage)
            setWalletPayments(paginatedItems)
            setPages(totalPages)
            setIsLoading(false)
        }
        fetchTransactions()
    }, [currentPage, walletPayments])

    return (

        <>
            <Header />
            <div className="overflow-hidden fixed w-screen shadow-lg ">
                <Panel />
                <div className='main mt-3 overflow-auto'>
                    <div className="overflow-x-auto p-10 mt-2 bg-white shadow-xl rounded-lg border-2 border-sky-100 mb-10">
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
                        <div className="flex w-full md:w-1/2 lg:w-1/3 shadow-xl border-2 bg-zinc-900 border-sky-100 h-32 mt-3 rounded-md">
                            <div className="p-5 flex flex-col gap-2  w-full h-full">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-xl text-zinc-200">Wallet</p>
                                    <button
                                        onClick={() => setAddMoneyModal(true)}
                                        className="p-2 rounded-full hover:scale-110  bg-buttonGreen text-white hover:bg-buttonGreenHover"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                                <p className="font-semibold text-xl text-zinc-200 hover:scale-110 hover:translate-x-3 hover:text-cyan">Bal . ₹{studentInfo?.wallet}</p>
                                <button className="flex justify-end items-center text-white text-sm hover:text-cyan">
                                    <FaMoneyBillWave className="mr-2" /> Withdraw
                                </button>
                            </div>
                        </div>
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold mb-4">Wallet Transactions</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {walletPayments.length > 0 ? (
                                    walletPayments.map((transaction: any) => (
                                        <div key={transaction.id} className="p-4 border rounded-lg shadow-md bg-gray-100">
                                            <h3 className="text-lg font-bold">Transaction ID: {transaction.id}</h3>
                                            <p>Amount: ₹{transaction.amount / 100}</p>
                                            <p>Status: {transaction.status}</p>
                                            <p>Date: {new Date(transaction.created * 1000).toLocaleDateString()}</p>
                                        </div>
                                    ))
                                ) : (
                                    isLoading ? (
                                        <div className="flex justify-center items-center">
                                            <div className="flex loader"></div>
                                        </div>
                                    ) : (
                                        <p>No transactions found.</p>
                                    )
                                )}
                            </div>
                        </div>
                        <div className="flex justify-center mt-6 mb-4">
                            <Stack spacing={2} className="pagination-container flex justify-center gap-2 font-semibold items-center">
                                <Pagination
                                    color="standard"
                                    count={pages}
                                    shape="rounded"
                                    page={currentPage}
                                    onChange={(_, value) => setCurrentPage(value)}
                                />
                            </Stack>
                        </div>
                    </div>
                    <Elements stripe={stripePromise}>
                        {addMoneyModal && <WalletModal setAddMoneyModal={setAddMoneyModal} />}
                    </Elements>
                    <Elements stripe={stripePromise}>
                        {withdrawMoneyModal && <WithdrawModal setWithdrawMoneyModal={setWithdrawMoneyModal} />}
                    </Elements>
                </div>
            </div >
        </>
    )
}

export default Transactions
