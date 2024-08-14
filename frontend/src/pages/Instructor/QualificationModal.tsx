import { useState } from "react"
import { QualificationModalProps } from "../../types"


export const QualificationModal: React.FC<QualificationModalProps> = ({ setQModalOpen, AddNewQualification }) => {
    const [degree, setDegree] = useState('')
    const [institution, setInstitution] = useState('')


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
            <div className="bg-zinc-900 p-8 rounded-lg shadow-lg w-full max-w-sm slide-in">
                <p className="mb-4 text-white">Enter qualification details</p>
                <div className="flex flex-col justify-end gap-5">
                    <input className="outline-none border-b-2 p-2 rounded-lg" type="text" placeholder="Enter the qualification" value={degree}
                        onChange={(e) => setDegree(e.target.value)} />
                    <input className="outline-none border-b-2 p-2 rounded-lg" type="text" placeholder="Enter the institution" value={institution}
                        onChange={(e) => setInstitution(e.target.value)} />
                    <div className="flex gap-5">
                        <button
                            onClick={() => AddNewQualification(degree,institution)}
                            className="px-4  bg-cyan text-white rounded-lg"
                        >
                            Add
                        </button>
                        <button
                            onClick={() => setQModalOpen(false)}
                            className="px-2 py-1 bg-gray-300 rounded-lg mr-2"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}