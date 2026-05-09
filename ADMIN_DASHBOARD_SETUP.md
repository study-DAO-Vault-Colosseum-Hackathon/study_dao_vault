# Admin Dashboard Setup Guide

## Overview
The Admin Dashboard provides comprehensive user management capabilities with full CRUD operations, role management, and wallet points control. This guide will help you set it up and use it effectively.

## Backend Configuration

### 1. CORS Configuration
The backend server (`backend/src/index.js`) has been updated to support:
- ✅ PATCH method
- ✅ x-user-id header
- ✅ CORS for all required methods

**Current CORS Config:**
```javascript
const corsOptions = {
  origin: FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
};
```

### 2. Admin Endpoints

All endpoints are prefixed with `/api/auth/admin/` and require the `x-user-id` header.

#### Get All Users
```http
GET /api/auth/admin/users
Headers: x-user-id: <user-id>
```
**Response:**
```json
[
  {
    "_id": "user-doc-id",
    "uid": "user-doc-id",
    "displayName": "John Doe",
    "email": "john@example.com",
    "walletAddress": "0x123abc...",
    "walletPoints": 100,
    "role": "student",
    "banned": false,
    "deleted": false,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### Get Specific User
```http
GET /api/auth/admin/user/:id
Headers: x-user-id: <user-id>
```

#### Update User
```http
PATCH /api/auth/admin/user/:id
Headers: 
  x-user-id: <user-id>
  Content-Type: application/json

Body:
{
  "displayName": "Updated Name",
  "email": "newemail@example.com",
  "walletPoints": 150
}
```

#### Delete User (Soft Delete)
```http
DELETE /api/auth/admin/user/:id
Headers: x-user-id: <user-id>
```

#### Update User Role
```http
PATCH /api/auth/admin/user/:id/role
Headers: 
  x-user-id: <user-id>
  Content-Type: application/json

Body:
{
  "role": "mentor"  // Options: "student", "mentor", "admin"
}
```

#### Update Wallet Points
```http
PATCH /api/auth/admin/user/:id/points
Headers: 
  x-user-id: <user-id>
  Content-Type: application/json

Body:
{
  "points": 50,
  "action": "add"  // Options: "set", "add", "subtract"
}
```

#### Ban/Unban User
```http
PATCH /api/auth/admin/user/:id/ban
Headers: 
  x-user-id: <user-id>
  Content-Type: application/json

Body:
{
  "ban": true,
  "reason": "Violation of community guidelines"
}
```

## Frontend Integration

### 1. Import AdminDashboard Component
```jsx
import AdminDashboard from './pages/AdminDashboard';
```

### 2. Usage in Your App
```jsx
// In your routing or main component
<AdminDashboard user={currentUser} />
```

### 3. User Object Requirements
The `user` prop should contain at least one of these identifiers:
```javascript
{
  uid: "user-id",           // Firebase UID or Magic Link ID
  userId: "user-id",        // Alternative UID field
  id: "user-id",            // Alternative UID field
  role: "admin"             // Optional: for future strict role checking
}
```

### 4. Fallback User ID Detection
The component automatically tries to get user ID from:
1. `user.uid`
2. `user.userId`
3. `user.id`
4. `localStorage.getItem('userId')`
5. Default: `'admin-user'` (for development)

## Features

### Dashboard Capabilities

#### 1. User Search & Filter
- Search by name, email, or UID
- Filter by role (Student, Mentor, Admin)
- Real-time filtering

#### 2. User Management
- **Edit**: Update name, email, and wallet points
- **Delete**: Soft delete users (marks as deleted)
- **Ban**: Ban/unban users with reasons
- **Role Management**: Change user roles on-the-fly

#### 3. Wallet Points Management
- Add points to users
- Subtract points from users
- Set exact point values

#### 4. Status Indicators
- Active (Green)
- Banned (Red)
- Deleted (Gray)

## Troubleshooting

### Issue: "Failed to fetch users"

**Solution 1: Check CORS Configuration**
- Verify backend has updated CORS settings
- Restart backend server

**Solution 2: Check User ID**
- Open browser DevTools (F12)
- Go to Network tab
- Make a request to admin dashboard
- Check the `x-user-id` header is being sent
- Check the request headers in the Network tab

**Solution 3: Check Firestore Connection**
- Verify Firebase is properly configured
- Check that users collection exists in Firestore
- Verify user documents have required fields

### Issue: "User updated successfully" but data doesn't show

**Solution:**
- Click the "Refresh" button to reload users
- Check browser console for errors
- Verify the user exists in Firestore

### Issue: CORS Error

**Solution:**
- Ensure backend index.js has updated corsOptions
- Check that `x-user-id` is in allowedHeaders
- Verify frontend is using correct API_BASE_URL
- Restart backend server after changes

### Issue: Can't see wallet address or points

**Solution:**
- Verify user documents in Firestore have `walletAddress` and `walletPoints` fields
- Add these fields to existing users if missing
- Format: `walletAddress` (string), `walletPoints` (number)

## Development Mode

The admin middleware currently runs in **development mode**, which bypasses strict role checking. This allows testing without admin role assignment.

To enable strict role checking, update the middleware in `backend/routes/auth.js`:

```javascript
const checkAdminAccess = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Remove development mode bypass
    // Enable strict role checking
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.adminId = userId;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## Best Practices

1. **Always backup user data** before making bulk changes
2. **Use soft deletes** instead of permanent deletion
3. **Document ban reasons** for audit purposes
4. **Verify user identity** before major operations
5. **Monitor activity logs** for suspicious admin actions
6. **Regularly audit admin accounts** for unauthorized access

## Security Considerations

- The admin endpoints require `x-user-id` header
- No sensitive data is exposed in responses
- Admins cannot delete their own accounts
- All operations are logged with timestamps and admin ID
- Consider implementing admin authorization tokens in production

## Future Enhancements

- [ ] Admin activity logging
- [ ] Bulk user operations
- [ ] Email notifications for admin actions
- [ ] User activity history
- [ ] Advanced filtering and export
- [ ] Two-factor authentication for admin accounts
- [ ] Rate limiting for admin endpoints
- [ ] Admin audit logs
