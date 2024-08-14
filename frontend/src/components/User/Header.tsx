import '../../styles/Header.css';
import logo from '../../../public/images/5582931.png';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingBag, FaUser, FaSearch, FaBars } from 'react-icons/fa';
import { setUser } from '../../utils/redux/slices/userAuthSlice';
import { Link } from 'react-router-dom';
import { StudentLogout } from '../../Helpers/Home';

function Header() {

  const [isUser, setIsUser] = useState(false)
  const [searchVisible, setSearchVisible] = useState(false);
  const studentInfo = useSelector((state: any) => state.userAuth.studentInfo);
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    console.log('Student info changed:', studentInfo);
    if (studentInfo?.name) {
      setIsUser(true);
    } else {
      setIsUser(false);
    }
  }, [studentInfo]);

  const handleLogout = (e: any) => {
    e.preventDefault();
    StudentLogout(dispatch)
    dispatch(setUser(null));
    navigate('/login')
  };

  return (
    <div className='w-screen h-20 shadow-lg '>
      <div className="flex justify-between items-center p-5 h-24 px-10">
        {/* <img src={logo} alt="logo" className="w-14 h-11 ml-4 md:ml-16" /> */}
        <h1 className='font-bold text-black text-xl'>Veda<span className='text-buttonGreen font-bold text-2xl'>B</span>yte <span className='text-buttonGreen text-3xl'>.</span></h1>
                 
        <div className="flex  items-center  slide-in">
          <ul className="hidden md:flex gap-16 nav-elems hover:cursor-pointer mx-auto">
            <li>
              <button className="text-endgreen border-2 border-buttonGreen w-24 h-8 rounded hover:bg-buttonGreen hover:text-white">
                <Link to='/courses'>Courses</Link>
              </button>
            </li>
            <li className="text-middlegreen">
              <Link to='/'>Home</Link>
            </li>
            <li className="text-middlegreen">
              <Link to='/tutors'>Tutors</Link>
            </li>
            <li className="text-middlegreen">Blog</li>
          </ul>
          <button className="md:hidden text-endgreen" onClick={() => setSidebarOpen(true)}>
            <FaBars size={24} />
          </button>
        </div>
        <div className="flex justify-between items-center px-4 py-2 bg-white ">
          {studentInfo && isUser ? (
            <div className="hidden md:flex items-center text-black gap-14">
              <div className="flex items-center gap-2">
                <div className="hover:cursor-pointer text-black" onClick={() => setSearchVisible(!searchVisible)}>
                  <FaSearch size={20} />
                </div>
                {searchVisible && (
                  <input
                    type="text"
                    className="ml-2 p-2 focus:outline-buttonGreen focus:border-transparent rounded-full text-black slide-in"
                    placeholder="Search..."
                    autoFocus
                  />
                )}
              </div>
              <p className='text-endgreen'>
                <Link to='/cart'>
                  <FaShoppingBag size={23} />
                </Link>
              </p>
              <div className="relative flex justify-center items-center">
                <div className="relative group">
                  {studentInfo.profileImage ? (
                    <img src={studentInfo.profileImage} className="flex text-white bg-endgreen rounded-full border-2 border-zinc-900 w-8 h-8 justify-center items-center cursor-pointer" />
                  ) : (
                    <div className="flex text-white bg-endgreen rounded-full w-8 h-8 justify-center items-center cursor-pointer">
                      <FaUser />
                    </div>
                  )}
                  <div className="absolute hidden group-hover:block bg-black text-white shadow-md rounded right-0 slide-in z-50">
                    <ul className="py-2">
                      <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                        <Link to='/profile'>Profile</Link>
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={handleLogout}>
                        Logout
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            location.pathname !== '/login' && (
              <div className="flex flex-grow justify-center items-center">
                <button className="text-white nav-elems bg-buttonGreen w-20 h-8 rounded hover:text-black hover:bg-white mr-16 slide-in">
                  <Link to='/login'>Log In</Link>
                </button>
              </div>
            )
          )}
        </div>
      </div>



      {
        sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)}></div>
        )
      }
      <div className={`fixed top-0 left-0 w-64 bg-white shadow-lg h-full z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
        <button className="p-4 text-right" onClick={() => setSidebarOpen(false)}>X</button>
        <ul className="flex flex-col p-4 gap-4">
          <li>
            <button className="text-endgreen border-2 border-buttonGreen w-full h-8 rounded hover:bg-buttonGreen hover:text-white">
              <Link to='/courses' onClick={() => setSidebarOpen(false)}>Courses</Link>
            </button>
          </li>
          <li className="text-middlegreen">
            <Link to='/' onClick={() => setSidebarOpen(false)}>Home</Link>
          </li>
          <li className="text-middlegreen">
            <Link to='/tutors' onClick={() => setSidebarOpen(false)}>Tutors</Link>
          </li>
          <li className="text-middlegreen">Blog</li>
          {studentInfo && isUser && (
            <li className="text-middlegreen">
              <button className="text-endgreen border-2 border-buttonGreen w-full h-8 rounded hover:bg-buttonGreen hover:text-white">
                <Link to='/profile' onClick={() => setSidebarOpen(false)}>Profile</Link>
              </button>
              <button className="text-endgreen border-2 border-buttonGreen w-full h-8 rounded hover:bg-buttonGreen hover:text-white mt-2" onClick={() => { handleLogout; setSidebarOpen(false); }}>
                Logout
              </button>
            </li>
          )}
          {studentInfo && isUser ? null
            : (
              location.pathname !== '/login' ? (
                <li>
                  <button className="text-white bg-buttonGreen w-full h-8 rounded hover:text-black hover:bg-white" onClick={() => setSidebarOpen(false)}>
                    <Link to='/login'>Log In</Link>
                  </button>
                </li>
              ) : (
                <div className=''>

                </div>
              ))
          }
        </ul>
      </div>
    </div >
  );
}

export default Header;
