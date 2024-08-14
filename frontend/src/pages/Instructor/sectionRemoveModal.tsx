import React, { useEffect, useState } from 'react'
import { DeleteSectionModalProps } from '../../types'
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useDeleteSectionMutation } from '../../utils/redux/slices/instructorApiSlices';
const SectionRemoveModal: React.FC<DeleteSectionModalProps> = ({ onClose, section }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [deleteSection] = useDeleteSectionMutation()
    const handleDelete = async () => {
        const sectionId =section._id
        alert(sectionId)
        const response = await deleteSection({sectionId}).unwrap()
        
        onClose()
    }


    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-10 flex justify-center items-center ">
            <div className="bg-zinc-900 rounded-lg shadow-xl min-w-[600px] p-6 slide-in">
                <h2 className="text-xl mb-4 text-white">Confirm to delete the section</h2>
                <div className="flex justify-end mt-3">
                    <button
                        className="bg-zinc-600 border-2 border-zinc-500 text-white px-4 py-2 rounded mr-2"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    {isLoading ? (
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box>
                    ) : (
                        <button className="bg-zinc-600 border-2 border-red-500 text-white px-6  rounded" onClick={handleDelete}
                        >
                            Confirm
                        </button>
                    )}

                </div>
            </div>
        </div>
    )
}

export default SectionRemoveModal
