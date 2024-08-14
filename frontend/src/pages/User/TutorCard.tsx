import {  FaUser } from "react-icons/fa"
import logo from '../../../public/images/Business.jpg'
import { Tutor, TutorCardProps } from "../../types"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const TutorCard: React.FC<TutorCardProps> = ({ Tutors }) => {
    const navigate = useNavigate()
    const [tutors, setTutors] = useState<Tutor[]>([])
    useEffect(() => {
        setTutors(Tutors)
    }, [Tutors])
    console.log(tutors, 'tutors')

    const handleClick = (id: string) => {
        navigate(`/tutorDetails/${id}`)
    }

    return (
        <>
            {tutors?.length ? (
                tutors?.map((tutor) => (
                    <div className=" w-80 h-full rounded overflow-hidden shadow-lg bg-white  border-2 border-blue-200" onClick={() => handleClick(tutor._id)}>
                        <img className="w-96 h-32 object-cover" src={logo} alt="Classroom" />
                        <div className="px-6 py-4 text-center">
                            <div className="relative w-28 h-28 mx-auto mb-4">
                                {tutor?.profileImage ? (
                                    <img className="w-full h-full rounded-full border-2 border-white -mt-16 object-cover" src={tutor?.profileImage} alt="Instructor" />

                                ) : (
                                    <p className="flex justify-center items-center text-white bg-zinc-700 w-full h-full text-md rounded-full -mt-16 object-cover"><FaUser size={30} /></p>

                                )}

                            </div>
                            <div className="font-bold text-xl mb-2">{tutor?.name}</div>
                            <p className="font-semibold text-zinc-800 mb-4">{tutor?.profession}</p>
                        </div>
                        <div className="px-6 pt-4 pb-2 border-t flex justify-between items-center">

                            <button className="bg-cyan w-20 h-8 rounded-full text-white font-semibold ">Details</button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex justify-center items-center">
                    <p className="flex justify-center items-center ml-32 text w-full bg-white  text-red-500">
                        No instructors found
                    </p>
                </div>


            )}


        </>

    )
}