import { useNavigate } from 'react-router-dom';
import grade1 from '../../src/assets/first.jfif';
import grade2 from '../../src/assets/second.avif';
import grade3 from '../../src/assets/third.avif';
import grade4 from '../../src/assets/forth.avif';
import grade5 from '../../src/assets/fifth.avif';
import grade6 from '../../src/assets/sixth.avif';

const gradeData = [
  {
    id: 1,
    title: "First Grade",
    image: grade1,
    description: "Start your child's English learning journey with fundamental vocabulary, basic grammar, and fun interactive activities.",
  },
  {
    id: 2,
    title: "Second Grade",
    image: grade2,
    description: "Build upon the basics with expanded vocabulary, simple sentences, and engaging reading exercises.",
  },
  {
    id: 3,
    title: "Third Grade",
    image: grade3,
    description: "Develop stronger language skills through comprehensive reading, writing, and speaking activities.",
  },
  {
    id: 4,
    title: "Fourth Grade",
    image: grade4,
    description: "Enhance communication skills with advanced vocabulary, grammar structures, and creative writing.",
  },
  {
    id: 5,
    title: "Fifth Grade",
    image: grade5,
    description: "Master complex language concepts through literature, composition, and interactive discussions.",
  },
  {
    id: 6,
    title: "Sixth Grade",
    image: grade6,
    description: "Prepare for secondary education with advanced reading comprehension, writing skills, and critical thinking.",
  },
];

const Preparatory = () => {
  const navigate = useNavigate();

  const handleGradeClick = (gradeId: number) => {
    navigate(`/grade/${gradeId}`);
  };

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Preparatory Level Courses
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Choose the appropriate grade level for your child's English learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gradeData.map((grade) => (
            <div 
              key={grade.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
            >
              <div className="relative h-64">
                <img
                  src={grade.image}
                  alt={`Grade ${grade.id}`}
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
  );
};

export default Preparatory;