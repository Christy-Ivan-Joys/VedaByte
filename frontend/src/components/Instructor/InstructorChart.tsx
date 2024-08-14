// InstructorChart.tsx
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { instructorChartProps } from '../../types';

// Register necessary chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const InstructorChart: React.FC<instructorChartProps> = ({ courses }) => {
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(0);

  const handleNextPage = () => {
    console.log('Next Page Clicked');
    if ((currentPage + 1) * itemsPerPage < courses.length) {
      setCurrentPage(prevPage => {
        console.log('Updating to Next Page:', prevPage + 1);
        return prevPage + 1;
      });
    }
  };

  const handlePrevPage = () => {
    console.log('Previous Page Clicked');
    if (currentPage > 0) {
      setCurrentPage(prevPage => {
        console.log('Updating to Previous Page:', prevPage - 1);
        return prevPage - 1;
      });
    }
  };

  useEffect(() => {
    console.log('Current Page:', currentPage);
    console.log('Paginated Courses:', courses.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    ));
  }, [currentPage, courses]);

  const paginatedCourses = courses.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const data = {
    labels: paginatedCourses.map(course => course.course.name),
    datasets: [
      {
        label: 'Number of Students',
        data: paginatedCourses.map(course => course.count),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        yAxisID: 'y-students',
      },
      {
        label: 'Revenue',
        data: paginatedCourses.map(course => parseFloat(course.course.price) * course.count),
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
        yAxisID: 'y-revenue',
      },
    ],
  };

  const options:any = {
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
    },
  };

  const isNextDisabled = (currentPage + 1) * itemsPerPage >= courses.length;
  console.log(isNextDisabled, 'this is it');

  return (
    <div className='p-10'>
      <div style={{ width: '1000px' }}>
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
