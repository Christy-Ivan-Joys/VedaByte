import { useEffect, useState } from "react"
import { CategoryCardProps } from "../../types"


export const CategoryCard: React.FC<CategoryCardProps> = ({ Categories }) => {

  
    return (
        <div className="p-2">
            {Categories?.length ? (
                Categories.map((category, index) => (
                    <div className="mt-3 mb-4" >
                        <div className="flex bg-white rounded-lg shadow-2xl overflow-hidden h-24 gap-10" >
                            <div className="flex-shrink-0 p-4">

                                <img src={category.categoryImage} className="w-28 h-16 border-2 border-red-200 object-cover" />
                            </div>
                            <div className="flex-grow flex gap-16 justify-between items-center px-4">
                                <div className="flex items-center gap-5">

                                    <p className="text-sm font-semibold">{category.category}</p>
                                </div>
                                <div className="flex flex-col flex-grow">

                                </div>
                                <div className="flex gap-4 flex-shrink-0">
                                    <button className={`bg-cyan-500 w-24 h-8 rounded-2xl text-white text-sm font-semibold`} >Edit</button>
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
    )
}