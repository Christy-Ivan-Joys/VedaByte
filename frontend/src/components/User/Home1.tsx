import { useEffect, useRef } from 'react';
import BecomeInstructor from '../../../public/images/BecomeInstructor.jpg'
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home1 = () => {

    const controls = useAnimation()
    const imageControls = useAnimation()
    const ref:any = useRef()
    const onIntersection = (entries:any) => {
        if (entries[0].isIntersecting) {
            controls.start({ x: 0, opacity: 2 });
            imageControls.start({ x: 0, opacity: 2 });
        }
    };
    useEffect(()=>{
        const observer = new IntersectionObserver(onIntersection,{threshold:0.1})
        if(ref.current){
            observer.observe(ref.current)
        }
        return ()=>{
            observer.disconnect()
        }
    },[])

    return ( 
        <div ref={ref}className='flex flex-col md:flex-row items-center bg-zinc-900 w-screen h-90 border-zinc-200'>
            <motion.div className='flex-1 p-8' initial={{ x: -300, opacity: 0 }} animate={controls} transition={{ duration: 2 }}>
                <h1 className='text-3xl font-bold mb-4 text-white'>Become an Instructor</h1>
                <p className='mb-4 text-zinc-200 font-semibold'>
                    Share your knowledge and passion with students around the world.
                    Join our community of instructors and start teaching today!
                </p>
                <button className='bg-white  text-black font-semibold border-2 border-black px-4 py-2 rounded hover:bg-cyan hover:text-black'>
                   <Link to='/instructor/register'> Get Started</Link>
                </button>
            </motion.div>
            <motion.div className='flex' initial={{ x: 300, opacity: 0 }} animate={imageControls} transition={{ duration: 4 }}>
                <img src={BecomeInstructor} alt='Become an Instructor' className='w-full h-full object-cover' />
            </motion.div>
        </div>
    )
}

export default Home1;