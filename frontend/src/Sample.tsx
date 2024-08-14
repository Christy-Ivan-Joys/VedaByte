import Header from './components/User/Header.tsx'
import './styles/Home.css'
import { Link, useNavigate } from 'react-router-dom'
import {reveal} from './Helpers/Home.ts'
import { useEffect } from 'react'
import sheet from '../public/images/tutorsheet2.jpg'
import instructor from '../public/images/startTeaching.jpg'
import '../src/styles/Home.css'


export default function Sample() {
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/')
    } else {
      navigate('/login')
    }
    reveal()
    window.addEventListener('scroll', reveal);
    return () => {

      window.removeEventListener('scroll', reveal)

    }


  }, [navigate])



  return (
    <div>
      <Header />
      <div className='flex justify-center items-center Home' style={{ backgroundColor: 'rgba(10, 4, 4, 0.379)' }} >

        <div className='relative search-container'>
          <h1 className=' flex text-black  mainLogo'>VedaByte .</h1>
          <input
            type="text"
            placeholder='search for courses'
            className='pl-11 pr-20    rounded-full bg-white outline-none'
            style={{ width: 500, height: 55 }}
          />
          <span className="search-icon "></span>
        </div>
      </div>

      <div className='flex flex-col bg-gradient-to-r from-slate-950 via-slate-700  to-gray-900 min-h-[600px] justify-center items-center category'>
        <div className='w-full flex justify-between items-center px-44'>
          <h1 className='text-3xl text-white font-extrabold p-5'>Find your right course</h1>
          <button className='bg-blue-500 rounded p-3 h-12  text-white font-medium justify-end mr-5'>View all courses</button>
        </div>
        <div className='cards'>

          <div className='flex flex-wrap justify-center items-center space-x-9'>
            <div className="bg-white rounded-lg shadow-lg h-72 w-52 card">
              <h2 className="text-xl font-bold mb-2 text-white"></h2>
            </div>
            <div className="bg-white rounded-lg shadow-lg h-72 w-52 card">
              <h2 className="text-xl font-bold mb-2 text-white"></h2>
            </div>
            <div className="bg-white rounded-lg shadow-lg h-72 w-52 card">
              <h2 className="text-xl font-bold mb-2 text-white"></h2>
            </div>
            <div className="bg-white rounded-lg shadow-lg h-72 w-52 card">
              <h2 className="text-xl font-bold mb-2 text-white"></h2>
            </div>

          </div>
        </div>
      </div>
      <div className="flex  justify-center items-center  max-h-[500px] ">
        <div className="relative w-full h-full">
          <img src={sheet} className="w-full h-full object-cover " alt="Tutor Sheet" style={{ width: '100%', height: '55%' }} />
          <div className="absolute top-20 left-20 bg-blue-400 h-64 rounded-lg justify-center p-10  border-2 border-black" style={{ width: '610px', boxShadow: '10px 10px 0px rgba(0, 0, 0, 1)' }}>
            <h2 className='text-black text-2xl font-bold instructor-Heading'>Become an instructor</h2>
            <br />
            <p className='font-semibold text-black'>Join us today and become part of a revolution in education. Together, we can inspire, educate, and shape the future.</p>
            <br />
            <Link to='/instructor/register'><button className=' bg-gradient-to-r from-sky-600 via-mediumBlue to-DarkBlue border border-black p-3 h-12 rounded justify-center items-center text-white font-bold'>Join now </button></Link>
          </div>
          <div className="absolute top-20 right-20 flex justify-end items-center h-64">
            <img src={instructor} className="h-full rounded-lg border-2 border-black" alt="Instructor" style={{ boxShadow: '10px 10px 0px rgba(1, 1, 1, 1)' }} />
          </div>
        </div>
      </div>
      <div className=' min-h-[500px] bg-gradient-to-r from-purple via-pink-500 to-purple '>
        <div className="flex h-screen justify-center items-center ">
          <div className="relative bg-gradient-to-b from-black to-gray-800 rounded-lg shadow-lg w-full text-white overflow-hidden max-w-[350px]">
            <img src="path_to_your_image.jpg" alt="Course Cover" className="w-full h-40 object-cover" />
            <div className="p-10 flex flex-col">
              <h2 className="text-2xl font-bold mb-4">Course Title</h2>
              <p className="mb-4">This is a brief description of the course. It provides an overview of what you will learn and the key topics covered.</p>
              <div className="flex justify-end">
                <button className="bg-gradient-to-r from-purple-900 to-pink-600 hover:from-gray-600 hover:to-gray-400 p-3 rounded text-white font-bold">Enroll Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// <>
// <div>

//   <div className='navbar flex items-center justify-between bg-gray-950 p-2'>
//     <img src={logo} alt="logo" className='w-14 ml-4' />
//     <div className='flex-1 flex justify-center'>
//       <ul className='hidden sm:flex gap-28 items-center font-medium text-white'>
//         {menuItems.map((item) => (
//           <li key={item} onClick={()=>Setactive(item)} className={`py-4 ${active===item ? 'border-b-4 border-cyan-400':'hover:border-b-4 hover:border-cyan-400'} text-white`}><Link to='/'>{item}</Link></li>
//         ))}
//       </ul>
//     </div>
//     <div className='hidden sm:flex justify-center w-auto'>
//       <img src={cart} alt="" className='w-8 mr-7' />
//       <img src={profile} alt="profile" className='w-8 mr-4' />
//       {studentInfo? <p className='font-bold text-white' onClick={handleLogout}>logout</p>:''}
      
//     </div>
//     <button
//       className='sm:hidden text-white justify-end'
//       onClick={() => setIsOpen(!isOpen)}
//     >
//       ☰
//     </button>
//   </div>
//   {isOpen && (
//     <div className='fixed inset-0 bg-black bg-opacity-50 z-50'>
//       <div className='fixed top-0 left-0 h-full w-64 bg-HeaderColor p-4'>
//         <button className='text-white mb-4' onClick={() => setIsOpen(false)}>
//           ✕
//         </button>
//         <ul className='flex flex-col gap-4 font-medium text-white'>
//           <li><Link to='/'>Home</Link></li>
//           <li>Courses</li>
//           <li>Tutors</li>
//           <li>Contact</li>
//         </ul>
//       </div>
//     </div>
//   )}
// </div>
// </>