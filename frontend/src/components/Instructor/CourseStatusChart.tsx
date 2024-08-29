import React from 'react';
import { Chart } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Tooltip, Legend,PointElement } from 'chart.js';
import { getDate } from '../../Helpers/data';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Tooltip, Legend,PointElement);

interface EnrollmentDetail {
    enrollmentDate: string; 
    status: 'completed' | 'in-progress' | 'not-started';
    progress: number; 
}

interface CourseStatusChartProps {
    enrollmentDetails: EnrollmentDetail[];
}

const CourseStatusChart: React.FC<CourseStatusChartProps> = ({ enrollmentDetails }) => {
    const dates: string[] = [...new Set(enrollmentDetails.map((detail) => getDate(detail.enrollmentDate)))].sort();
    const statusCountsByDate = dates.map(date => {
        const detailsOnDate = enrollmentDetails.filter((detail) => getDate(detail.enrollmentDate) === date);
        return {
            completed: detailsOnDate.filter((detail) => detail.status === 'completed').length,
            inProgress: detailsOnDate.filter((detail) => detail.status === 'in-progress').length,
            notStarted: detailsOnDate.filter((detail) => detail.status === 'not-started').length,
        };
    });

    const averageProgressByDate = dates.map(date =>{
        const detailsOnDate = enrollmentDetails.filter((detail) => getDate(detail.enrollmentDate) === date);
        const totalProgress = detailsOnDate.reduce((sum, detail) => sum + detail.progress, 0)
        return (totalProgress / detailsOnDate.length).toFixed(2)
    })

    const chartData: ChartData<'bar' | 'line', number[], string> = {
        labels: dates,
        datasets: [
            {
                type: 'bar',
                label: 'Completed',
                data: statusCountsByDate.map(status => status.completed),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                type: 'bar',
                label: 'In Progress',
                data: statusCountsByDate.map(status => status.inProgress),
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
            },
            {
                type: 'bar',
                label: 'Not Started',
                data: statusCountsByDate.map(status => status.notStarted),
                backgroundColor: 'rgba(255, 205, 86, 0.6)',
                borderColor: 'rgba(255, 205, 86, 1)',
                borderWidth: 1,
            },
            {
                type: 'line',
                label: 'Average Progress',
                data: averageProgressByDate.map(Number),
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                pointBorderColor: '#fff',
            },
        ],
    };
console.log(chartData,'data')
    const options: ChartOptions<'bar' | 'line'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        if (tooltipItem.dataset.type === 'line') {
                            return `Average Progress: ${tooltipItem.formattedValue}`;
                        }
                        return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}`;
                    }
                }
            }
        },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            }
        }
    };

    return (
        <div>
            <h2>Status by Date with Average Progress</h2>
            <Chart type="bar" data={chartData} options={options} />
        </div>
    );
};

export default CourseStatusChart;
