import { Link } from "react-router-dom"
import image from "../assets/mr-osama.jpeg"

const HeroSection = () => {
  return (
    <div>
      <section className="bg-gradient-to-br from-sky-400 via-sky-500 to-sky-600 dark:from-sky-700 dark:to-sky-900">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="text-center lg:text-left mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mx-auto lg:mx-0 mb-4 text-3xl font-extrabold tracking-tight leading-none sm:text-4xl md:text-5xl xl:text-6xl text-white">
              Mr. Osama Mashour
            </h1>
            <p className="max-w-2xl mx-auto lg:mx-0 mb-6 font-light text-sky-100 text-sm sm:text-base lg:mb-8 md:text-lg lg:text-xl">
              Dedicated English Language Instructor with over 10 years of experience in teaching students of all levels
            </p>
            

            {/* Added Contact Button */}
            <div className="mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 text-base font-medium text-center text-sky-600 bg-white rounded-lg hover:bg-sky-50 focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-900 transition-all duration-300 transform hover:scale-105"
              >
                Contact Me
                <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </Link>
            </div>
          </div>
          <div className="mt-8 lg:mt-0 lg:col-span-5 flex items-center justify-center">
            <img 
              src={image} 
              alt="English Teacher" 
              className="rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md lg:w-3/4 object-cover ring-4 ring-white/20" 
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default HeroSection
