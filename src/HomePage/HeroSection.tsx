import image from "../assets/Kareem Image.jpeg"

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
            
            <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start sm:space-x-6 space-y-4 sm:space-y-0">
              <div>
                <h4 className="text-xl sm:text-2xl font-bold text-white">500+</h4>
                <p className="text-sm sm:text-base text-sky-100">Students Taught</p>
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-bold text-white">98%</h4>
                <p className="text-sm sm:text-base text-sky-100">Success Rate</p>
              </div>
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
