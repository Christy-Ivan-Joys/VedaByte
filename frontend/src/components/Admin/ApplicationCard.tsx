
import { useEffect, useState } from "react"
import { Application, ApplicationCardProps } from "../../types"
import { FaUserCircle } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { useApproveOrrejectMutation } from "../../utils/redux/slices/adminApiSlices"
export const ApplicationCard: React.FC<ApplicationCardProps> = ({ Applications }) => {
    const [data, setData] = useState<Application[]>([])
    const navigate = useNavigate()

    const [approveOrreject] = useApproveOrrejectMutation()

    useEffect(() => {

        setData(Applications)
    }, [Applications])

    const handleClick = () => {

    }
    const handleDetails = (_id: string) => {

        navigate(`/admin/applicationDetails/${_id}`)
    }
   

    const handleApprove = async(id: string, action: string) => {
             alert('id')
            console.log(id,action)
            const result = await approveOrreject({id,action}).unwrap()
            console.log(result)
    
    }
    useEffect(()=>{

    },[handleApprove])
    return (
        <div className="p-2">
            {data.length ? (
                data.map((application, index) => (
                    <div className="mt-3 mb-4" key={index}>
                        <div className="flex bg-white rounded-lg shadow-2xl overflow-hidden h-24 gap-10" onClick={handleClick}>
                            <div className="flex-shrink-0 p-4">

                                <img src={application.courseImage} alt={application.name} className="w-28 h-16 border-2 border-red-200" />
                            </div>
                            <div className="flex-grow flex gap-16 justify-between items-center px-4">
                                <div className="flex items-center gap-5">
                                    {application.InstructorId.profileImage ? (
                                        <img
                                            src={application.InstructorId.profileImage}
                                            alt={application.InstructorId.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                    ) : (
                                        <FaUserCircle size={38} />
                                    )}
                                    <p className="text-sm font-semibold">{application.InstructorId.name}</p>
                                </div>
                                <div className="flex flex-col flex-grow">
                                    <h1 className="text-zinc-800 font-semibold">{application.name}</h1>
                                    <p className="text-sm font-semibold">{application.category}</p>
                                    <p className="text-sm font-semibold">Price: {application.price}</p>
                                </div>
                                <div className="flex gap-4 flex-shrink-0">
                                    <button className={`bg-cyan w-24 h-8 rounded-2xl text-white text-sm font-semibold`} onClick={() => handleApprove(application._id, 'Approve')}>Approve</button>
                                    <button className={`bg-red-600 w-24 h-8 rounded-2xl text-white text-sm font-semibold`} onClick={() => handleApprove(application._id, 'Reject')}>Reject</button>

                                    <button className="bg-black w-24 h-8 rounded-2xl text-white text-sm font-semibold" onClick={() => handleDetails(application._id)}>Details</button>

                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div>
                    <h1>No Applications to show</h1>
                </div>
            )}
        </div>
    );
}