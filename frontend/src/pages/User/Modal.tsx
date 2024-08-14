import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { FaTimes } from 'react-icons/fa';
import { ModalProps } from '../../types';

const Modal:React.FC<ModalProps> = ({ isOpen, onClose, categories, onFilterChange }) => {
    const animation = useSpring({
        transform: isOpen ? 'translateX(0%)' : 'translateX(100%)',
        config: { duration: 500 },
    });

    return (
        <animated.div style={animation} className="fixed inset-0 z-50 flex items-center justify-end  bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Filters</h2>
                    <button onClick={()=>onClose(false)}  className="text-gray-500">
                        <FaTimes size={24} />
                    </button>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Categories</h3>
                    {categories.map((category:any, index) => (
                        <div key={index} className="mb-2">
                            <input
                                type="checkbox"
                                id={`category-${index}`}
                                onChange={() => onFilterChange('category', category.category)}
                            />
                            <label htmlFor={`category-${index}`} className="ml-2">
                               {category.category}
                            </label>
                        </div>
                    ))}
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Price</h3>
                    <input
                        type="number"
                        placeholder="Min Price"
                        className="border p-2 w-full mb-2"
                        onChange={(e) => onFilterChange('minPrice', e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Max Price"
                        className="border p-2 w-full mb-2"
                        onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                    />
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Sort By</h3>
                    <select
                        className="border p-2 w-full mb-2"
                        onChange={(e) => onFilterChange('sort', e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="asc">Price: Low to High</option>
                        <option value="desc">Price: High to Low</option>
                    </select>
                </div>
                <button  className="mt-4 bg-buttonGreen text-white py-2 px-4 rounded">
                    Apply Filters
                </button>
            </div>
        </animated.div>
    );
};

export default Modal;
