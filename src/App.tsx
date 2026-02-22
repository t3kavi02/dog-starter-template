import { useState, useEffect } from 'react'
import './App.css'

interface DogResponse {
  success: boolean
  data: {
    imageUrl: string
    status: string
  }
}

function App() {
  const [dogImage, setDogImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDogImage = async () => {
    setLoading(true)
    setError(null)
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
      const response = await fetch(`${backendUrl}/api/dogs/random`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch dog image')
      }
      
      const data: DogResponse = await response.json()
      
      if (data.success && data.data.imageUrl) {
        setDogImage(data.data.imageUrl)
      } else {
        setError('Invalid response from API')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setDogImage(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDogImage()
  }, [])

  return (
    <div className="app-container">
      <h1>🐕 Random Dog Image</h1>
      
      <div className="content">
        {loading && <p className="loading">Loading...</p>}
        
        {error && (
          <div className="error">
            <p>Error: {error}</p>
            <p className="hint">Make sure the server is running on http://localhost:5000</p>
          </div>
        )}
        
        {dogImage && (
          <div className="dog-container">
            <img src={dogImage} alt="Random dog" className="dog-image" />
          </div>
        )}
      </div>
      
      <button onClick={fetchDogImage} disabled={loading} className="fetch-button">
        {loading ? 'Loading...' : 'Get Another Dog'}
      </button>
    </div>
  )
}

export default App
