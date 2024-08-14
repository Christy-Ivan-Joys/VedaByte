import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 pt-16 mt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          {/* Company Info */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0 pl-10">
            <h2 className="text-xl font-bold mb-2 text-emerald-400">VedaByte</h2>
            <p className="text-sm text-zinc-200">
              Your company's tagline or a brief description goes here.
            </p>
          </div>

          {/* Quick Links */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h2 className="text-lg  mb-2 text-white">Quick Links</h2>
            <ul className="list-none flex flex-col gap-3">
              <li>
                <Link to="/" className="text-sm hover:text-gray-400">
                  Home 
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-gray-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sm hover:text-gray-400">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-gray-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0 ">
            <h2 className="text-lg  mb-2 text-white">Resources</h2>
            <ul className="list-none flex flex-col gap-3">
              <li>
                <Link to="/blog" className="text-sm hover:text-gray-400">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm hover:text-gray-400">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-sm hover:text-gray-400">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-sm hover:text-gray-400">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0  ">
            <h2 className="text-lg  mb-2 text-white">Contact Us</h2>
            <p className="text-sm ">
              123 Main St, Suite 100 <br />
              Anytown, USA <br />
              (123) 456-7890 <br />
              christyivanjoys@gmail.com
            </p>
          </div>
        </div>

        <div className="mt-8   pt-4 text-center text-sm">
          &copy; {new Date().getFullYear()} <span className='text-emerald-400 font-semibold'> VedaByte . </span> All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
