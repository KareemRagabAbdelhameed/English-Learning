import { useNavigate } from 'react-router-dom';
import grade1 from "../assets/first.jfif"
import grade2 from "../assets/second.avif"
import grade3 from "../assets/third.avif"

const gradeData = [
  {
    id: 10,
    title: "First Secondary",
    image: grade1,
    description: "Comprehensive English curriculum focusing on advanced literature analysis, academic writing, and professional communication skills.",
  },
  {
    id: 11,
    title: "Second Secondary",
    image: grade2,
    description: "Intensive program covering complex grammar structures, advanced vocabulary, and preparation for international English examinations.",
  },
  {
    id: 12,
    title: "Third Secondary",
    image: grade3,
    description: "Advanced English course preparing students for university level with focus on research writing, presentations, and academic discourse.",
  },
]

const Secondary = () => {
  const navigate = useNavigate()

  const handleGradeClick = (gradeId: number) => {
    navigate(`/grade/${gradeId}`)
  }

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
            Secondary Level
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Preparing students for academic excellence and international opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {gradeData.map((grade) => (
            <div 
              key={grade.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="relative h-64">
                <img
                  src={grade.image}
                  alt={grade.title}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white text-center px-4">
                    {grade.title}
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {grade.description}
                </p>
                <button 
                  onClick={() => handleGradeClick(grade.id)}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 transform hover:scale-[1.02]"
                >
                  Discover More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Secondary