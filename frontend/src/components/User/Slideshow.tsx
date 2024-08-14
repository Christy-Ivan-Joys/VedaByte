import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import BannerHome from '../../../public/images/BannerHome.jpg';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { ArrowProps } from '../../types';

    const Slideshow: React.FC = () => {
        
    const PrevArrow: React.FC<ArrowProps> = ({ onClick }) => (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 px-10">
        <button onClick={onClick} className="bg-white text-black rounded-full p-2 shadow-lg  focus:outline-none">
            <FaArrowLeft size={20} />
        </button>
        </div>
    )

    const NextArrow: React.FC<ArrowProps> = ({ onClick }) => (
        <div className="absolute right-0 px-10 top-1/2 transform -translate-y-1/2 z-10">
        <button onClick={onClick} className="bg-white text-black rounded-full p-2 shadow-lg  focus:outline-none">
            <FaArrowRight size={20} />
        </button>
        </div>
    )

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    return (
    <Slider {...settings}>
      <div className="w-full h-screen relative hover-effect">
        <img src={BannerHome} alt="Banner 1" className="absolute left-0 w-full h-full object-cover transition-transform duration-500 ease-in-out" style={{ objectPosition: 'center top' }} />
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-60 p-4">
          <h1 className="text-white font-bold text-4xl typing-animation text-center">
            Unlock your potential with our engaging and interactive<br />
            courses designed to elevate your <span className="text-buttonGreen">skills</span> and <span className="text-buttonGreen">knowledge</span> to the next level<span className="text-6xl text-buttonGreen">.</span>
          </h1>
        </div>
      </div>
      <div className="w-full h-screen relative hover-effect">
        <img src={BannerHome} alt="Banner 2" className="absolute left-0 w-full h-full object-cover transition-transform duration-500 ease-in-out" style={{ objectPosition: 'center top' }} />
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4">
          <h1 className="text-white font-bold text-4xl typing-animation text-center">
            Discover new paths and expand your horizons with our expert-led courses.
          </h1>
        </div>
      </div>
      <div className="w-full h-screen relative hover-effect">
        <img src={BannerHome} alt="Banner 3" className="absolute left-0 w-full h-full object-cover transition-transform duration-500 ease-in-out" style={{ objectPosition: 'center top' }} />
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4">
          <h1 className="text-white font-bold text-4xl typing-animation text-center">
            Join a community of learners and achievers. Start your journey today!
          </h1>
        </div>
      </div>
    </Slider>
  );
};

export default Slideshow;
