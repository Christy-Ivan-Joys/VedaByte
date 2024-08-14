import { useRef } from 'react';
import jsPDF from 'jspdf';
import CertificateBG from '../../../public/images/CertificateBG.png'
import { useSelector } from 'react-redux';
import html2canvas from 'html2canvas'

export const Certificate = () => {
    const certificateRef = useRef<HTMLDivElement | any>(null);
    const course: any = localStorage.getItem('certifiedCourse')
    const Course = JSON.parse(course)
    const studentInfo = useSelector((state: any) => state.userAuth.studentInfo);
    console.log(studentInfo)

    console.log(Course)
    const generatePDF = () => {

        const element = certificateRef.current
        html2canvas(element).then(canvas => {
            const imageData = canvas.toDataURL('image/png')
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [800, 600],
            });
             pdf.addImage(imageData, 'PNG', 0, 0, 800, 600);
            // Save the generated PDF
            pdf.save('certificate.pdf');
        }).catch((error)=>{
            console.log(error,'error in generating certificate pdf')
        })
    }

    return (
        <div className="flex flex-col items-center p-10 overflow-hidden" >
            <div ref={certificateRef} className="bg-white p-5 border-4 border-buttonGreen w-full h-[600px] text-center overflow-hidden" style={{ backgroundImage: `url(${CertificateBG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <h1 className="text-3xl text-gray-200 font-bold">VedaByte</h1>
                <h1 className="text-4xl text-gray-200 font-bold p-3">Certificate of Completion</h1>
                <p className="mt-4 text-lg">This is to certify that</p>
                <p className="mt-2 text-2xl font-semibold">{studentInfo?.name}</p>
                <p className="mt-4 text-lg">has successfully completed the course</p>
                <p className="mt-2 text-xl text-blue-200 font-semibold">{Course?.courseId.name}</p>
                <p className="mt-4 text-lg">on</p>
                <p className="mt-2 text-lg">[Date]</p>
                <div className='justify-end float-right mt-32 flex flex-col gap-3'>
                    <p className="text-lg font-semibold">{Course?.courseId?.InstructorId?.name}</p>
                    <p className="text-lg font-semibold">Instructor signature</p>
                </div>
            </div>

            <button
                onClick={generatePDF}
                className="mt-6 bg-blue-500 text-white py-2 px-4 rounded"
            >
                Download Certificate
            </button>
        </div>
    );
};

export default Certificate;
