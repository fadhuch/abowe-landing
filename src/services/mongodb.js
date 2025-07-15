// MongoDB Atlas Data API service for frontend
// This provides a secure way to connect to MongoDB from the frontend

class MongoDBService {
  constructor() {
    // Atlas Data API configuration from environment variables
    this.dataSource = import.meta.env.VITE_ATLAS_DATA_SOURCE || "Cluster0"
    this.database = import.meta.env.VITE_ATLAS_DATABASE || "abowe-whitelist" 
    this.collection = import.meta.env.VITE_ATLAS_COLLECTION || "waitlist"
    this.apiKey = import.meta.env.VITE_ATLAS_API_KEY
    this.appId = import.meta.env.VITE_ATLAS_APP_ID
    
    // Construct the Data API endpoint URL
    this.baseUrl = this.appId 
      ? `https://data.mongodb-api.com/app/${this.appId}/endpoint/data/v1`
      : null
    
    // Check if Data API is configured
    this.isConfigured = !!(this.apiKey && this.appId)
    
    if (!this.isConfigured) {
      console.warn('MongoDB Atlas Data API not configured. Using demo mode.')
      console.log('To enable real database connection:')
      console.log('1. Set up MongoDB Atlas Data API in your cluster')
      console.log('2. Add VITE_ATLAS_APP_ID and VITE_ATLAS_API_KEY to .env.local')
    }
  }

  async addToWaitlist(userData) {
    try {
      // Validate input data
      if (!this.isValidName(userData.name)) {
        throw new Error('Invalid name provided')
      }
      
      if (!this.isValidEmail(userData.email)) {
        throw new Error('Invalid email provided')
      }

      const document = {
        name: userData.name,
        email: userData.email,
        createdAt: new Date().toISOString(),
        source: 'landing-page'
      }

      if (this.isConfigured) {
        // Use real MongoDB Atlas Data API
        const response = await fetch(`${this.baseUrl}/action/insertOne`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.apiKey,
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            dataSource: this.dataSource,
            database: this.database,
            collection: this.collection,
            document: document
          })
        })

        if (!response.ok) {
          const errorData = await response.text()
          throw new Error(`Data API request failed: ${response.status} ${errorData}`)
        }

        const result = await response.json()
        
        if (result.error) {
          throw new Error(result.error)
        }

        return { 
          success: true, 
          data: { insertedId: result.insertedId },
          message: 'Successfully added to waitlist'
        }
      } else {
        // Demo mode - simulate database operation
        console.log('DEMO MODE: Simulating database insert')
        console.log('Document that would be inserted:', document)
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Store in localStorage for demo purposes
        const existingEntries = JSON.parse(localStorage.getItem('waitlist') || '[]')
        const newEntry = { ...document, _id: this.generateId() }
        existingEntries.push(newEntry)
        localStorage.setItem('waitlist', JSON.stringify(existingEntries))
        
        console.log('Demo: Stored in localStorage. Current waitlist:', existingEntries)
        
        return { 
          success: true, 
          data: { insertedId: newEntry._id },
          message: 'Successfully added to waitlist (Demo Mode)'
        }
      }
      
    } catch (error) {
      console.error('Error adding to waitlist:', error)
      return { 
        success: false, 
        message: `Failed to add to waitlist: ${error.message}`,
        error: error.message 
      }
    }
  }

  // Check if email already exists (for demo mode)
  async checkExistingEmail(email) {
    if (this.isConfigured) {
      try {
        const response = await fetch(`${this.baseUrl}/action/findOne`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.apiKey
          },
          body: JSON.stringify({
            dataSource: this.dataSource,
            database: this.database,
            collection: this.collection,
            filter: { email: email.toLowerCase() }
          })
        })

        const result = await response.json()
        return !!result.document
      } catch (error) {
        console.error('Error checking existing email:', error)
        return false
      }
    } else {
      // Demo mode - check localStorage
      const existingEntries = JSON.parse(localStorage.getItem('waitlist') || '[]')
      return existingEntries.some(entry => entry.email.toLowerCase() === email.toLowerCase())
    }
  }

  // Get waitlist count (for demo purposes)
  async getWaitlistCount() {
    if (this.isConfigured) {
      try {
        const response = await fetch(`${this.baseUrl}/action/aggregate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.apiKey
          },
          body: JSON.stringify({
            dataSource: this.dataSource,
            database: this.database,
            collection: this.collection,
            pipeline: [{ $count: "total" }]
          })
        })

        const result = await response.json()
        return result.documents[0]?.total || 0
      } catch (error) {
        console.error('Error getting waitlist count:', error)
        return 0
      }
    } else {
      // Demo mode
      const existingEntries = JSON.parse(localStorage.getItem('waitlist') || '[]')
      return existingEntries.length
    }
  }

  // Helper method to generate a simple ID for demo
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Method to validate email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Method to validate name
  isValidName(name) {
    return name && name.trim().length >= 2 && name.trim().length <= 50
  }

  // Get configuration status
  getStatus() {
    return {
      configured: this.isConfigured,
      mode: this.isConfigured ? 'Production (Atlas Data API)' : 'Demo (LocalStorage)',
      dataSource: this.dataSource,
      database: this.database,
      collection: this.collection
    }
  }
}

export default new MongoDBService()
