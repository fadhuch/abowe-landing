# Admin Panel Documentation

## Overview

The admin panel provides a comprehensive interface to manage and view all waitlist entries. Access it by visiting `/admin` on your website.

## Features

### 📊 Dashboard
- **Total Entries**: View the total number of waitlist subscribers
- **Real-time Stats**: Updated statistics from the database

### 📋 Waitlist Management
- **View All Entries**: Paginated list of all waitlist subscribers
- **Sort Options**: Sort by email or creation date (ascending/descending)
- **Search & Filter**: Easy navigation through entries

### 🗑️ Entry Management
- **Delete Entries**: Remove individual entries with confirmation
- **Bulk Operations**: Export all data for external use

### 📥 Data Export
- **CSV Export**: Download complete waitlist as CSV file
- **Formatted Data**: Includes email, creation date, source, IP address, and user agent

## Access

### Navigation
- **From Landing Page**: Click the discrete "Admin" button in the top-left corner
- **Direct URL**: Visit `/admin` directly
- **Back Navigation**: Use "← Back to Landing" button to return

### URL Structure
- Main site: `http://localhost:5173/`
- Admin panel: `http://localhost:5173/admin`

## Data Fields

Each waitlist entry contains:
- **Email**: Subscriber's email address
- **Created At**: Timestamp of subscription
- **Source**: Origin of the signup (landing-page)
- **IP Address**: User's IP address (for analytics)
- **User Agent**: Browser/device information

## API Endpoints (Admin)

### Get All Entries
```http
GET /api/admin/waitlist?page=1&limit=50&sortBy=createdAt&sortOrder=desc
```

### Delete Entry
```http
DELETE /api/admin/waitlist/:id
```

### Export CSV
```http
GET /api/admin/waitlist/export
```

## Security Considerations

⚠️ **Important Notes:**

1. **No Authentication**: The admin panel currently has no authentication
2. **Production Risk**: Add authentication before deploying to production
3. **Data Privacy**: Handle personal data (emails) according to privacy laws
4. **Access Control**: Restrict admin access in production environments

## Recommended Production Setup

For production deployment, consider:

1. **Authentication System**
   ```javascript
   // Add login protection
   const requireAuth = (req, res, next) => {
     // Implement authentication logic
   }
   
   app.use('/api/admin/*', requireAuth)
   ```

2. **Environment-based Access**
   ```javascript
   // Only enable admin in development/staging
   if (process.env.NODE_ENV !== 'production') {
     app.use('/api/admin', adminRoutes)
   }
   ```

3. **Rate Limiting**
   ```javascript
   // Limit admin API calls
   const adminLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   })
   ```

## Responsive Design

The admin panel is fully responsive:
- **Desktop**: Full table view with all columns
- **Tablet**: Horizontal scrolling for table
- **Mobile**: Stacked layout with essential information

## Performance Features

- **Pagination**: Handles large datasets efficiently (50 entries per page)
- **Sorting**: Database-level sorting for performance
- **Loading States**: Visual feedback during data operations
- **Error Handling**: Comprehensive error messages and recovery

## Usage Examples

### Viewing Entries
1. Navigate to `/admin`
2. Browse entries in the table
3. Use pagination for large datasets
4. Click column headers to sort

### Exporting Data
1. Click "📥 Export CSV" button
2. File downloads automatically
3. Open in spreadsheet software
4. Use for email marketing, analytics, etc.

### Managing Entries
1. Locate entry to delete
2. Click 🗑️ button
3. Confirm deletion in popup
4. Entry is permanently removed

## Troubleshooting

### Common Issues

1. **Admin page not loading**
   - Check if API server is running on port 5001
   - Verify `/api/admin/waitlist` endpoint responds

2. **No data showing**
   - Ensure MongoDB connection is active
   - Check for entries in the database
   - Verify API endpoints return data

3. **Export not working**
   - Check browser's download settings
   - Ensure CSV endpoint returns proper headers
   - Try different browser if needed

### Development Tools

The admin panel includes development features:
- Console logging for debugging
- Error boundaries for graceful failures
- Loading indicators for all operations

## File Structure

```
src/
├── components/
│   ├── AdminPage.jsx       # Main admin component
│   └── AdminPage.css       # Admin-specific styles
├── services/
│   └── adminApi.js         # Admin API client
└── Router.jsx              # Simple routing system
```

## Future Enhancements

Potential improvements:
- **Authentication**: User login system
- **Real-time Updates**: WebSocket integration
- **Advanced Filtering**: Search by email, date ranges
- **Bulk Actions**: Select multiple entries for operations
- **Analytics**: Charts and graphs for signup trends
- **Email Integration**: Send emails directly from admin panel
