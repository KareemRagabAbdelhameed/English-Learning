import { useState, useRef, FormEvent } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import apiBaseUrl from '../config/axiosConfig'

interface UploadResponse {
  videoUrl: string
  public_id: string
}

// Add this interface near the top with other interfaces
interface VideoProps {
  videoId: string;
}

const AdminPage = ({ videoId }: VideoProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [selectedGrades, setSelectedGrades] = useState<string[]>([])
  const [videoTitle, setVideoTitle] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadType, setUploadType] = useState<'file' | 'youtube'>('file')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const grades = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Grade ${i + 1}`
  }))

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleGradeChange = (gradeId: string) => {
    setSelectedGrades(prevGrades => {
      if (prevGrades.includes(gradeId)) {
        return prevGrades.filter(id => id !== gradeId)
      }
      return [...prevGrades, gradeId]
    })
  }

  const uploadToCloudinary = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'english-videos')
    formData.append('cloud_name', 'dqmp5l622')

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dqmp5l622/video/upload`,
        formData
      )
      return {
        videoUrl: response.data.url,
        public_id: response.data.public_id
      }
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error)
      throw error
    }
  }

  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (selectedGrades.length === 0) {
      Swal.fire({
        title: 'Error',
        text: 'Please select at least one grade',
        icon: 'error',
        confirmButtonColor: '#0ea5e9'
      })
      return
    }
    if (!videoTitle.trim()) {
      Swal.fire({
        title: 'Error',
        text: 'Please enter a video title',
        icon: 'error',
        confirmButtonColor: '#0ea5e9'
      })
      return
    }

    if (uploadType === 'youtube' && !youtubeUrl) {
      Swal.fire({
        title: 'Error',
        text: 'Please enter a YouTube URL',
        icon: 'error',
        confirmButtonColor: '#0ea5e9'
      })
      return
    }

    setIsUploading(true)
    try {
      let uploadResponse: UploadResponse | null = null
      let youtubeVideoId: string | null = null

      if (uploadType === 'file' && selectedFile) {
        uploadResponse = await uploadToCloudinary(selectedFile)
      } else if (uploadType === 'youtube') {
        youtubeVideoId = extractYouTubeId(youtubeUrl)
        if (!youtubeVideoId) {
          throw new Error('Invalid YouTube URL')
        }
      }

      const payload = {
        title: videoTitle,
        grade: selectedGrades.map(Number),
        ...(uploadType === 'file' && uploadResponse
          ? {
              type: 'cloudinary',
              videoUrl: uploadResponse.videoUrl,
              videoPublicId: uploadResponse.public_id
            }
          : {
              type: 'youtube',
              videoUrl: youtubeUrl,
              videoPublicId: youtubeVideoId || '' // Using YouTube video ID as public_id
            })
      }

      await apiBaseUrl.post('/videos', payload, {
        withCredentials: true
      })

      // Reset form
      setSelectedFile(null)
      setYoutubeUrl('')
      setSelectedGrades([])
      setVideoTitle('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      await Swal.fire({
        title: 'Success!',
        text: 'Video uploaded successfully',
        icon: 'success',
        confirmButtonColor: '#0ea5e9'
      })
    } catch (error) {
      console.error('Error uploading video:', error)
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to upload video. Please try again.',
        icon: 'error',
        confirmButtonColor: '#0ea5e9'
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Upload Video</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Video Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Video Title
              </label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Enter video title"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Upload Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Type
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setUploadType('file')}
                  className={`px-4 py-2 rounded-lg ${
                    uploadType === 'file'
                      ? 'bg-sky-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadType('youtube')}
                  className={`px-4 py-2 rounded-lg ${
                    uploadType === 'youtube'
                      ? 'bg-sky-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  YouTube URL
                </button>
              </div>
            </div>

            {/* File Upload Input */}
            {uploadType === 'file' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Video File
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="video/*"
                  className="block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-sky-50 file:text-sky-700
                    hover:file:bg-sky-100
                    dark:file:bg-gray-700 dark:file:text-gray-300"
                />
              </div>
            )}

            {/* YouTube URL Input */}
            {uploadType === 'youtube' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  YouTube URL
                </label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            )}

            {/* Grade Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Grades
              </label>
              <div className="grid grid-cols-3 gap-2">
                {grades.map((grade) => (
                  <label
                    key={grade.id}
                    className="flex items-center space-x-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGrades.includes(grade.id.toString())}
                      onChange={() => handleGradeChange(grade.id.toString())}
                      className="rounded text-sky-500 focus:ring-sky-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{grade.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUploading || 
                (uploadType === 'file' && !selectedFile) || 
                (uploadType === 'youtube' && !youtubeUrl) || 
                selectedGrades.length === 0 || 
                !videoTitle.trim()}
              className="w-full bg-sky-500 text-white py-2 px-4 rounded-lg font-semibold
                hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload Video'}
            </button>
          </form>

          {/* Add Video Management Buttons */}
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Video Management</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  // Add your edit logic here
                  console.log('Edit video clicked')
                }}
                className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg font-semibold
                  hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                Edit Video
              </button>
              <button
                onClick={() => {
                  // Add your delete logic here
                  Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ef4444',
                    cancelButtonColor: '#6b7280',
                    confirmButtonText: 'Yes, delete it!'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      // Add your delete API call here
                      console.log('Delete video confirmed')
                    }
                  })
                }}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-semibold
                  hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete Video
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
