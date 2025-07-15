import { useState } from 'react'
import './App.css'
import apiService from './services/api'

function App({ navigate }) {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Get API service status for debugging
  const serviceStatus = apiService.getStatus()

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    
    try {
      // Validate inputs
      if (!apiService.isValidEmail(email)) {
        setErrorMessage('Please enter a valid email address')
        setIsLoading(false)
        return
      }

      // Check if email already exists
      const emailExists = await apiService.checkExistingEmail(email)
      if (emailExists) {
        setErrorMessage('This email is already on our waitlist!')
        setIsLoading(false)
        return
      }

      // Submit to API
      const result = await apiService.addToWaitlist({
        email: email.trim().toLowerCase()
      })

      if (result.success) {
        setIsSubmitted(true)
        setEmail('')
        setErrorMessage('')
        console.log('Successfully added to waitlist:', result.data)
      } else {
        setErrorMessage(result.message || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting to waitlist:', error)
      setErrorMessage('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      
      
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span className="brand">Abowe</span>
            </h1>
            <p className="hero-subtitle">
              The future of digital innovation is here. Join thousands of early adopters 
              who are already experiencing the next generation of technology.
            </p>
            
            {/* Waiting List Form */}
            <div className="waitlist-section">
              <h2>Join the Waiting List</h2>
              <p>Be among the first to experience something extraordinary.</p>
              
              {/* Service Status (for development) */}
              
              
              {isSubmitted ? (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <h3>You're on the list!</h3>
                  <p>We'll notify you as soon as we launch.</p>
                </div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} className="waitlist-form">
                  {errorMessage && (
                    <div className="error-message">
                      {errorMessage}
                    </div>
                  )}
                  <div className="form-group">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="loading-spinner"></span>
                    ) : (
                      'Join Waiting List'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Development Tools */}
    </div>
  )
}

export default App
