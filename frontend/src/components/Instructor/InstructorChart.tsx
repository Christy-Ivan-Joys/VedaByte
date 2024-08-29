import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { instructorChartProps } from '../../types';
import { useFetchCategoriesMutation } from '../../utils/redux/slices/userApiSlices';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const InstructorChart: React.FC<instructorChartProps> = ({ courses }) => {
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(0);
  const [fetchCategories] = useFetchCategoriesMutation()
  const [categories, setCategories] = useState([])
  const [filter, setFilter] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
  });
  useEffect(() => {
    const fetchCats = async () => {
      const cats = await fetchCategories(undefined).unwrap()
      console.log(cats)
      setCategories(cats)
    }
    fetchCats()
  }, [])
  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < filteredCourses.length) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
    setCurrentPage(0);
  };

  const filterCourses = (courses: any) => {
    return courses.filter((course: any) => {
      console.log(course, 'course')

      const { category, minPrice, maxPrice } = filter;
      console.log(category, 'category', minPrice, 'min', maxPrice, 'max')
      let isMatch = true;
      if (category && course.course.category !== category) isMatch = false;
      if (minPrice && parseFloat(course.course.price) <= parseFloat(minPrice)) isMatch = false;
      if (maxPrice && parseFloat(course.course.price) >= parseFloat(maxPrice)) isMatch = false;
      return isMatch

    });
  };

  const filteredCourses = filterCourses(courses);
  console.log(filteredCourses, 'filter')
  const paginatedCourses = filteredCourses.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const data = {
    labels: paginatedCourses.map((course: any) => course.course.name),
    datasets: [
      {
        label: 'Number of Students',
        data: paginatedCourses.map((course: any) => course.count),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        yAxisID: 'y-students',
      },
      {
        label: 'Revenue',
        data: paginatedCourses.map((course: any) => parseFloat(course.course.price) * course.count),
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
        yAxisID: 'y-revenue',
      },
      {
        label: 'Price',
        data: paginatedCourses.map((course: any) => parseFloat(course.course.price)),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        yAxisID: 'y-price',
      },
    ],
  };

  const options: any = {
    scales: {
      'y-students': {
        beginAtZero: true,
        position: 'left',
        title: {
          display: true,
          text: 'Number of Students',
        },
      },
      'y-revenue': {
        beginAtZero: true,
        position: 'right',
        title: {
          display: true,
          text: 'Revenue',
        },
      },
      'y-price': {
        beginAtZero: true,
        position: 'right',
        title: {
          display: true,
          text: 'Price',
        },
        grid: {
          drawOnChartArea: false, // Keep grid lines for price separate
        },
      },
    },
  };

  const isNextDisabled = (currentPage + 1) * itemsPerPage >= filteredCourses.length;

  return (
    <div className='px-32 pt-3'>
      <div className="mb-4">
        <label>
          Category:
          <select
            name="category"
            value={filter.category}
            onChange={handleFilterChange}
            className="mx-2 p-2 border"
          >
            <option value="">All</option>
            {categories.map((category:any) => (
              <option key={category._id} value={category.category}>
                {category.category}
              </option>
            ))}
          </select>
        </label>
        <label>
          Min Price:
          <input
            type="number"
            name="minPrice"
            value={filter.minPrice}
            onChange={handleFilterChange}
            placeholder="Minimum Price"
            className="mx-2 p-2 border"
          />
        </label>
        <label>
          Max Price:
          <input
            type="number"
            name="maxPrice"
            value={filter.maxPrice}
            onChange={handleFilterChange}
            placeholder="Maximum Price"
            className="mx-2 p-2 border"
          />
        </label>
      </div>

      <div style={{ width: '900px' }}>
        <Bar data={data} options={options} />
      </div>
      <div className="flex justify-between mt-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={handlePrevPage}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={handleNextPage}
          disabled={isNextDisabled}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InstructorChart;
