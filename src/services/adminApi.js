// Admin API service for managing waitlist entries

class AdminAPIService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
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

      const response = await fetch(url, config)
      
      // Handle CSV downloads
      if (response.headers.get('content-type')?.includes('text/csv')) {
        return response
      }
      
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      return data
    } catch (error) {
      console.error('❌ Admin API request failed:', error)
      throw error
    }
  }

  // Get all waitlist entries with pagination
  async getWaitlistEntries(options = {}) {
    try {
      const params = new URLSearchParams({
        page: options.page || 1,
        limit: options.limit || 50,
        sortBy: options.sortBy || 'createdAt',
        sortOrder: options.sortOrder || 'desc'
      })

      const result = await this.makeRequest(`/admin/waitlist?${params}`)
      return result.data
    } catch (error) {
      console.error('❌ Error getting waitlist entries:', error)
      throw error
    }
  }

  // Delete a waitlist entry
  async deleteEntry(id) {
    try {
      const result = await this.makeRequest(`/admin/waitlist/${id}`, {
        method: 'DELETE'
      })
      return result
    } catch (error) {
      console.error('❌ Error deleting entry:', error)
      throw error
    }
  }

  // Export waitlist as CSV
  async exportWaitlist() {
    try {
      const response = await this.makeRequest('/admin/waitlist/export')
      
      // Create download link
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Get filename from response headers or use default
      const disposition = response.headers.get('content-disposition')
      const filename = disposition 
        ? disposition.split('filename=')[1].replace(/"/g, '')
        : `waitlist-export-${new Date().toISOString().split('T')[0]}.csv`
      
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      return { success: true, message: 'Export started' }
    } catch (error) {
      console.error('❌ Error exporting waitlist:', error)
      throw error
    }
  }

  // Get waitlist statistics
  async getStats() {
    try {
      const result = await this.makeRequest('/waitlist/stats')
      return result.data
    } catch (error) {
      console.error('❌ Error getting stats:', error)
      throw error
    }
  }
}

export default new AdminAPIService()
