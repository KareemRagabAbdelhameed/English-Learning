import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import grade1 from '../assets/first.jfif'
import grade2 from '../assets/second.avif'
import grade3 from '../assets/third.avif'
import grade4 from '../assets/forth.avif'
import grade5 from '../assets/fifth.avif'
import grade6 from '../assets/sixth.avif'
import secondary1 from '../assets/first.jfif'
import secondary2 from '../assets/second.avif'
import secondary3 from '../assets/third.avif'
import lab1 from '../assets/first.jfif'
import lab2 from '../assets/second.avif'
import lab3 from '../assets/third.avif'
import apiBaseUrl from '../config/axiosConfig'

interface Video {
  id?: number
  title: string
  url: string
  grade: number[]
  lovedByCount: number
  type?: 'youtube' | 'cloudinary'
}

interface ApiResponse {
  data?: Video[]
  message?: string
  success?: boolean
}

const gradeImages = {
  1: grade1,
  2: grade2,
  3: grade3,
  4: grade4,
  5: grade5,
  6: grade6,
  7: secondary1,
  8: secondary2,
  9: secondary3,
  10: lab1,
  11: lab2,
  12: lab3,
}

const gradeTitles = {
  1: "First Grade",
  2: "Second Grade",
  3: "Third Grade",
  4: "Fourth Grade",
  5: "Fifth Grade",
  6: "Sixth Grade",
  7: "First Secondary Grade",
  8: "Second Secondary Grade",
  9: "Third Secondary Grade",
  10: "Laboratory Level 1",
  11: "Laboratory Level 2",
  12: "Laboratory Level 3",
}

const convertToEmbedUrl = (url: string): string => {
  if (url.includes('youtube.com/embed') || url.includes('cloudinary.com')) {
    return url
  }

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  const videoId = (match && match[2].length === 11) ? match[2] : null

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0`
  }

  return url
}

const GradePage = () => {
  const { gradeId } = useParams<{ gradeId: string }>()
  const numericGradeId = Number(gradeId)
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>("")
  const [videoLoadingStates, setVideoLoadingStates] = useState<Record<string, boolean>>({})
  const [videoErrorStates, setVideoErrorStates] = useState<Record<string, boolean>>({})
  const [emptyResponseMessage, setEmptyResponseMessage] = useState<string>("")

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        const response = await apiBaseUrl.get<ApiResponse>(`/videos?grade=${numericGradeId}`)
        
        const responseData = Array.isArray(response.data?.data) ? response.data.data : []
        
        const gradeVideos = responseData.filter((video: Video) => 
          Array.isArray(video.grade) && video.grade.includes(numericGradeId))
        
        const processedVideos = gradeVideos.map(video => ({
          ...video,
          url: convertToEmbedUrl(video.url)
        }))
        
        setVideos(processedVideos)
        
        if (processedVideos.length === 0 && response.data?.message) {
          setEmptyResponseMessage(response.data.message)
        } else {
          setEmptyResponseMessage("")
        }
        
        const initialLoadingStates = processedVideos.reduce((acc: Record<string, boolean>, video: Video) => {
          acc[video.url] = true
          return acc
        }, {})
        setVideoLoadingStates(initialLoadingStates)
      } catch (err) {
        console.error('Error fetching videos:', err)
        setError(err instanceof Error ? err.message : 'Failed to load videos. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (numericGradeId) {
      fetchVideos()
    }
  }, [numericGradeId])

  const handleVideoLoad = (videoUrl: string) => {
    setVideoLoadingStates(prev => ({ ...prev, [videoUrl]: false }))
  }

  const handleVideoError = (videoUrl: string) => {
    setVideoLoadingStates(prev => ({ ...prev, [videoUrl]: false }))
    setVideoErrorStates(prev => ({ ...prev, [videoUrl]: true }))
  }

  const handleDownload = (videoUrl: string, videoTitle: string) => {
    try {
      // Extract YouTube video ID
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = videoUrl.match(regExp);
      const videoId = (match && match[2].length === 11) ? match[2] : null;

      if (videoId) {
        // Open download service in new tab
        const downloadUrl = `https://www.y2mate.com/youtube/${videoId}`;
        window.open(downloadUrl, '_blank');
      } else if (videoUrl.includes('cloudinary.com')) {
        // Direct download for Cloudinary videos
        const downloadLink = document.createElement('a');
        downloadLink.href = videoUrl;
        downloadLink.download = `${videoTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } else {
        alert('Download is only available for YouTube and Cloudinary videos');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to initiate download. Please try again.');
    }
  };

  if (!gradeId || !gradeTitles[numericGradeId as keyof typeof gradeTitles]) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Grade Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            The grade you're looking for doesn't exist.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="relative h-96">
            <img
              src={gradeImages[numericGradeId as keyof typeof gradeImages]}
              alt={gradeTitles[numericGradeId as keyof typeof gradeTitles]}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent">
              <div className="absolute bottom-0 left-0 p-8">
                <h1 className="text-4xl font-bold text-white mb-4">
                  {gradeTitles[numericGradeId as keyof typeof gradeTitles]}
                </h1>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Course Videos
            </h2>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : videos.length === 0 ? (
              <div className="text-gray-600 dark:text-gray-300 text-center">
                {emptyResponseMessage || "No videos available for this grade yet."}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <div
                    key={video.url}
                    className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden transform transition-transform hover:scale-105 relative group"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(video.url, video.title);
                      }}
                      className="absolute top-2 left-2 z-20 bg-blue-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Download video"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                      </svg>
                    </button>

                    <div 
                      className="cursor-pointer"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <div className="relative pt-[56.25%]">
                        {videoLoadingStates[video.url] && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                          </div>
                        )}
                        {videoErrorStates[video.url] ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                            <div className="text-red-500">Failed to load video</div>
                          </div>
                        ) : (
                          <iframe
                            src={video.url}
                            title={video.title}
                            className="absolute top-0 left-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            onLoad={() => handleVideoLoad(video.url)}
                            onError={() => handleVideoError(video.url)}
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {video.title}
                          </h3>
                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <svg className="w-5 h-5 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
                            </svg>
                            {video.lovedByCount}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedVideo(null)
            }
          }}
        >
          <div className="relative w-full max-w-5xl bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="absolute top-4 right-16 z-10">
              <button
                onClick={() => handleDownload(selectedVideo.url, selectedVideo.title)}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                title="Download video"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
              </button>
            </div>

            <button
              className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 rounded-full p-2 z-10"
              onClick={() => setSelectedVideo(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative pt-[56.25%]">
              <iframe
                src={selectedVideo.url}
                title={selectedVideo.title}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedVideo.title}
              </h3>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <svg className="w-6 h-6 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
                </svg>
                {selectedVideo.lovedByCount}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GradePage