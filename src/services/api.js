// REST API service for frontend
// Connects to our Express.js backend which handles MongoDB operations

class APIService {
  constructor() {
    // API base URL - adjust based on environment
    this.baseUrl = import.meta.env.VITE_API_URL || 'https://api.abowe.ae/api'
    
    console.log('🔗 API Service initialized with base URL:', this.baseUrl)
  }

  // Helper method for making API requests
  async makeRequest(endpoint, options = {}) {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      }

      console.log(`📡 Making ${config.method || 'GET'} request to:`, url)
      
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      return data
    } catch (error) {
      console.error(`❌ API request failed:`, error)
      throw error
    }
  }

  // Add user to waitlist
  async addToWaitlist(userData) {
    try {
      const result = await this.makeRequest('/waitlist', {
        method: 'POST',
        body: JSON.stringify({
          email: userData.email.trim().toLowerCase()
        })
      })

      console.log('✅ Successfully added to waitlist:', result.data)
      return result

    } catch (error) {
      console.error('❌ Error adding to waitlist:', error)
      
      // Return a consistent error format
      return {
        success: false,
        message: error.message || 'Failed to add to waitlist. Please try again.',
        error: error.message
      }
    }
  }

  // Check if email already exists
  async checkExistingEmail(email) {
    try {
      const result = await this.makeRequest('/waitlist/check', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      })

      return result.exists || false

    } catch (error) {
      console.error('❌ Error checking email:', error)
      // If there's an error, assume email doesn't exist to allow submission
      return false
    }
  }

  // Get waitlist statistics
  async getWaitlistStats() {
    try {
      const result = await this.makeRequest('/waitlist/stats')
      return result.data
    } catch (error) {
      console.error('❌ Error getting waitlist stats:', error)
      return { totalCount: 0 }
    }
  }

  // Health check
  async healthCheck() {
    try {
      const result = await this.makeRequest('/health')
      console.log('💚 API Health Check:', result)
      return result
    } catch (error) {
      console.error('❤️‍🩹 API Health Check failed:', error)
      return { status: 'ERROR', message: error.message }
    }
  }

  // Validation helpers (same as before but moved here for consistency)
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Get service status
  getStatus() {
    return {
      configured: true,
      mode: 'Production (REST API)',
      baseUrl: this.baseUrl,
      type: 'REST API'
    }
  }
}

export default new APIService()
