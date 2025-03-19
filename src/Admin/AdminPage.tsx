import { useState, useRef, FormEvent } from 'react'
import axios from 'axios'

interface UploadResponse {
  videoUrl: string
  public_id: string
}

const AdminPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('')
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

  const uploadToCloudinary = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'english-videos');
    formData.append('cloud_name',`dqmp5l622`);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dqmp5l622/video/upload`,
        formData
      )
      console.log(response);
      console.log(response.data.url);
      console.log(response.data.public_id);
      return {
        videoUrl: response.data.url,
        public_id: response.data.public_id
      }
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error)
      throw error
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedGrade) {
      alert('Please select a grade')
      return
    }

    setIsUploading(true)
    try {
      let uploadResponse: UploadResponse | null = null

      if (uploadType === 'file' && selectedFile) {
        uploadResponse = await uploadToCloudinary(selectedFile)
      } else if (uploadType === 'youtube' && youtubeUrl) {
        // Send YouTube URL directly to backend
        const response = await axios.post('/api/videos', {
          type: 'youtube',
          url: youtubeUrl,
          gradeId: parseInt(selectedGrade)
        })
        return
      }

      if (uploadResponse) {
        // Send video details to your backend
        await axios.post('/api/videos', {
          type: 'cloudinary',
          url: uploadResponse.videoUrl,
          publicId: uploadResponse.public_id,
          gradeId: parseInt(selectedGrade)
        });

        // Reset form
        setSelectedFile(null)
        setYoutubeUrl('')
        setSelectedGrade('')
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        alert('Video uploaded successfully!')
      }
    } catch (error) {
      console.error('Error uploading video:', error)
      alert('Error uploading video. Please try again.')
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
                />
              </div>
            )}

            {/* Grade Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Grade
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select a grade</option>
                {grades.map((grade) => (
                  <option key={grade.id} value={grade.id}>
                    {grade.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUploading || (!selectedFile && !youtubeUrl) || !selectedGrade}
              className="w-full bg-sky-500 text-white py-2 px-4 rounded-lg font-semibold
                hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload Video'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminPage