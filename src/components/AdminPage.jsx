import { useState, useEffect } from 'react'
import adminApi from '../services/adminApi'
import './AdminPage.css'

function AdminPage() {
  const [entries, setEntries] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  const goBack = () => {
    window.history.pushState({}, '', '/')
    window.location.reload()
  }

  useEffect(() => {
    loadData()
  }, [currentPage, sortBy, sortOrder])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      // Load entries and stats in parallel
      const [entriesData, statsData] = await Promise.all([
        adminApi.getWaitlistEntries({
          page: currentPage,
          limit: 50,
          sortBy,
          sortOrder
        }),
        adminApi.getStats()
      ])

      setEntries(entriesData.entries)
      setPagination(entriesData.pagination)
      setStats(statsData)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, email) => {
    if (!confirm(`Are you sure you want to delete ${email}?`)) {
      return
    }

    try {
      await adminApi.deleteEntry(id)
      loadData() // Reload data after deletion
    } catch (error) {
      alert(`Error deleting entry: ${error.message}`)
    }
  }

  const handleExport = async () => {
    try {
      await adminApi.exportWaitlist()
    } catch (error) {
      alert(`Error exporting data: ${error.message}`)
    }
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
    setCurrentPage(1)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️'
    return sortOrder === 'asc' ? '↑' : '↓'
  }

  if (loading && entries.length === 0) {
    return (
      <div className="admin-page">
        <div className="loading">Loading waitlist data...</div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="header-top">
          <button onClick={goBack} className="btn-back">
            ← Back to Landing
          </button>
        </div>
        <h1>Waitlist Admin</h1>
        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Entries</h3>
            <div className="stat-number">{stats.totalCount || 0}</div>
          </div>
        </div>
      </div>

      <div className="admin-actions">
        <button onClick={handleExport} className="btn-export">
          📥 Export CSV
        </button>
        <button onClick={loadData} className="btn-refresh">
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div className="error-message">
          ❌ Error: {error}
        </div>
      )}

      <div className="entries-table-container">
        <table className="entries-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('email')} className="sortable">
                Email {getSortIcon('email')}
              </th>
              <th onClick={() => handleSort('createdAt')} className="sortable">
                Created At {getSortIcon('createdAt')}
              </th>
              <th>Source</th>
              <th>IP Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry._id}>
                <td className="email-cell">{entry.email}</td>
                <td>{formatDate(entry.createdAt)}</td>
                <td>{entry.source || 'N/A'}</td>
                <td className="ip-cell">{entry.ipAddress || 'N/A'}</td>
                <td>
                  <button
                    onClick={() => handleDelete(entry._id, entry.email)}
                    className="btn-delete"
                    title="Delete entry"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {entries.length === 0 && !loading && (
          <div className="no-entries">
            No waitlist entries found.
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className="btn-page"
          >
            ← Previous
          </button>
          
          <span className="page-info">
            Page {pagination.currentPage} of {pagination.totalPages}
            ({pagination.totalCount} total entries)
          </span>
          
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="btn-page"
          >
            Next →
          </button>
        </div>
      )}

      {loading && entries.length > 0 && (
        <div className="loading-overlay">
          Loading...
        </div>
      )}
    </div>
  )
}

export default AdminPage
