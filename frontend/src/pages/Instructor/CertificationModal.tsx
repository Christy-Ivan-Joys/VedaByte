import { useState } from "react"
import { CetificationModalProps } from "../../types"
export const CertificationModal: React.FC<CetificationModalProps> = ({ setCModalOpen, AddNewCertification }) => {
    const [certification, setCertification] = useState('')

    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
            <div className="bg-zinc-900 p-8 rounded-lg shadow-lg w-full max-w-sm slide-in">
                <p className="mb-4 text-white">Enter qualification details</p>
                <div className="flex flex-col justify-end gap-5">
                    <input className="outline-none border-b-2 p-2 rounded-lg" type="text" placeholder="Enter the certification" value={certification}
                        onChange={(e) => setCertification(e.target.value)} />
                    <div className="flex gap-5">
                        <button
                            onClick={() => AddNewCertification(certification)}
                            className="px-4  bg-cyan text-black rounded-lg"
                        >
                            Add
                        </button>
                        <button
                            onClick={() => setCModalOpen(false)}
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