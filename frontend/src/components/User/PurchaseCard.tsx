import { useState, useEffect } from "react"
import { Enrollment, PurchaseCardProps } from "../../types"
import { useNavigate } from "react-router-dom"


export const PurchaseCard: React.FC<PurchaseCardProps> = ({Purchases}) => {

    const [purchases, setPurchases] = useState<Enrollment[]>([])
    const navigate = useNavigate()
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    useEffect(() => {
        setPurchases(Purchases)
    }, [Purchases])

    const handleDetails = (purchaseId: string) => {
        navigate(`/purchaseDetails/${purchaseId}`)
    }

    const handleClick = () =>{

    }

   

    return (

        <div>
            {purchases.length ? (
                purchases.map((record, index) => (
                    <div className="mt-3 mb-4" key={index}>
                        <div className="flex bg-white rounded-lg shadow-2xl overflow-hidden h-24 gap-10" onClick={handleClick}>
                            <div className="flex-shrink-0 p-4 flex justify-center items-center gap-3">
                                <p className="text-sm font-semibold">{record?.EnrolledCourses[0]?.EnrolledAt ? formatDate(record.EnrolledCourses[0].EnrolledAt) : 'No date available'}</p>
                            </div>
                            <div className="flex-grow flex gap-16 justify-between items-center px-4">
                                <div className="flex items-center gap-5">
                                    <p className="text-sm font-semibold">Payment : Card</p>
                                </div>
                                <div className="flex flex-col flex-grow">
                                    <h1 className="text-zinc-800 text-sm font-semibold">Enrolled {record?.EnrolledCourses?.length} <span>{record?.EnrolledCourses?.length >1 ? 'Courses' :'course'}</span></h1>
                                    <p className="text-sm font-semibold"><span className="text-buttonGreen">Total</span> : {record?.Total}</p>
                                </div>
                                <div className="flex gap-4 flex-shrink-0">
                                    <button className="bg-black w-24 h-8 rounded-2xl text-white text-sm font-semibold" onClick={()=>handleDetails(record._id)}>Details</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No purchase records found</p>
            )}
        </div>

    )
}