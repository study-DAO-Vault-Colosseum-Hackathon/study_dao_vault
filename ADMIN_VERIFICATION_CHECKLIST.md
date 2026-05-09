# Admin Dashboard Verification Checklist

## Pre-Setup Verification

### Backend Status
- [ ] Backend server is running on `http://localhost:3000`
- [ ] No errors in console when starting server
- [ ] Firebase is properly configured and connected
- [ ] Firestore users collection exists

### Frontend Status
- [ ] React app is running on `http://localhost:5173` (or your dev port)
- [ ] AdminDashboard component is imported
- [ ] Component is added to your routes/pages

## Implementation Checklist

### Backend Changes ✓

#### 1. CORS Configuration (`backend/src/index.js`)
```
✓ Added 'PATCH' to methods
✓ Added 'x-user-id' to allowedHeaders
```
**How to verify:**
```javascript
// Check corsOptions around line 40-45
const corsOptions = {
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
};
```

#### 2. Admin Routes (`backend/routes/auth.js`)
```
✓ checkAdminAccess middleware implemented
✓ GET /api/auth/admin/users endpoint
✓ GET /api/auth/admin/user/:id endpoint
✓ PATCH /api/auth/admin/user/:id endpoint
✓ DELETE /api/auth/admin/user/:id endpoint
✓ PATCH /api/auth/admin/user/:id/role endpoint
✓ PATCH /api/auth/admin/user/:id/points endpoint
✓ PATCH /api/auth/admin/user/:id/ban endpoint
```

### Frontend Changes ✓

#### 1. AdminDashboard Component Created
```
✓ File: frontend/src/pages/AdminDashboard.jsx
✓ Component handles all admin operations
✓ Full error handling and user feedback
✓ Search and filter functionality
✓ Modal dialogs for edit and ban operations
```

#### 2. Userlist Component Updated
```
✓ Displays wallet address
✓ Displays wallet points
✓ Displays UID
```

## Testing Steps

### Step 1: Verify Backend is Running
```bash
# In one terminal, ensure backend is running
cd backend
npm run dev
# or npm start

# Output should include:
# "Server listening on port 3000"
```

### Step 2: Check CORS Configuration
```bash
# Open browser console and test
curl -X OPTIONS http://localhost:3000/api/auth/admin/users \
  -H "x-user-id: test-user" \
  -H "Content-Type: application/json"

# Should get 200 response with proper CORS headers
```

### Step 3: Test API Endpoints
```bash
# Get all users
curl -X GET http://localhost:3000/api/auth/admin/users \
  -H "x-user-id: test-user" \
  -H "Content-Type: application/json"

# Expected response: Array of users
```

### Step 4: Import and Test Component
```jsx
// In your main app file or route
import AdminDashboard from './pages/AdminDashboard';

// Add route
<Route path="/admin" element={<AdminDashboard user={currentUser} />} />

// Navigate to http://localhost:5173/admin
```

### Step 5: Verify Features
From the admin dashboard:
- [ ] Can see list of users
- [ ] Can search by name/email/UID
- [ ] Can filter by role
- [ ] Can edit user details
- [ ] Can update wallet points
- [ ] Can change user role
- [ ] Can ban/unban users
- [ ] Can delete users
- [ ] Refresh button works
- [ ] Success messages appear
- [ ] Error messages are helpful

## Common Issues & Solutions

### Issue: "Failed to fetch users"

**Checklist:**
- [ ] Backend server is running
- [ ] CORS configuration includes PATCH method
- [ ] CORS configuration includes x-user-id header
- [ ] Browser console shows correct URL being called
- [ ] Network tab shows the request being sent
- [ ] Response status is not 404 or 500

**Debug Steps:**
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh admin dashboard
4. Look for `/admin/users` request
5. Check request headers include `x-user-id`
6. Check response status and message

### Issue: CORS Error (Cross-Origin Request Blocked)

**Solution:**
1. Check `corsOptions` in `backend/src/index.js`
2. Restart backend server
3. Verify frontend URL matches `FRONTEND_URL` env variable
4. Check browser console for exact CORS error

### Issue: "User not found" or Empty User List

**Checklist:**
- [ ] Firestore has users collection
- [ ] Users collection has documents
- [ ] User documents have required fields
- [ ] Firebase connection is working

**Verify:**
1. Go to Firestore Console
2. Check if `users` collection exists
3. Check if there are documents in the collection
4. Verify document structure

### Issue: Wallet Points Not Showing

**Solution:**
1. Check if user documents have `walletPoints` field
2. If missing, add field with value: 0
3. Refresh dashboard

### Issue: Role Selection Not Working

**Solution:**
1. Check that user document has `role` field
2. Valid values: `"student"`, `"mentor"`, `"admin"`
3. Try editing the user directly

## Data Structure Verification

### Expected Firestore User Document
```json
{
  "displayName": "John Doe",
  "email": "john@example.com",
  "walletAddress": "0x123abc...",
  "walletPoints": 100,
  "role": "student",
  "banned": false,
  "deleted": false,
  "createdAt": "2024-01-01T00:00:00Z",
  "magicId": "did:ethr:...",
  "username": "johndoe"
}
```

### Missing Fields to Add
If any of these fields are missing from user documents, add them:
- `walletPoints`: number (default: 0)
- `role`: string (default: "student")
- `banned`: boolean (default: false)
- `deleted`: boolean (default: false)

## Performance Checklist

- [ ] Loading all users takes < 3 seconds
- [ ] Search filters in real-time
- [ ] Edit modal opens instantly
- [ ] Updates reflect within 1-2 seconds
- [ ] No memory leaks (check DevTools Performance tab)

## Security Checklist

- [ ] Admin endpoints require x-user-id header
- [ ] No sensitive data exposed in responses
- [ ] Admins cannot delete their own accounts
- [ ] User IDs are not exposed in URLs unnecessarily
- [ ] All operations log who made the change

## Deployment Checklist

Before deploying to production:
- [ ] Change NODE_ENV to 'production'
- [ ] Enable strict admin role checking
- [ ] Update API_BASE_URL for production
- [ ] Enable database backups
- [ ] Set up admin activity logging
- [ ] Configure proper CORS origins
- [ ] Implement rate limiting
- [ ] Add Two-Factor Authentication for admins
- [ ] Set up audit logs
- [ ] Test all endpoints in production

## Next Steps

1. **Complete all verification steps above**
2. **Test each feature in the admin dashboard**
3. **Fix any issues using the troubleshooting guide**
4. **Document any custom modifications**
5. **Train admins on how to use the dashboard**
6. **Set up monitoring and logging**

## Support Resources

- API Documentation: `ADMIN_DASHBOARD_SETUP.md`
- Test Script: `test-admin-api.js`
- Component: `frontend/src/pages/AdminDashboard.jsx`
- Backend Routes: `backend/routes/auth.js`

## Sign-Off

Once all items are checked, the admin dashboard is ready for use:

```
Date Verified: _______________
Verified By: __________________
Status: ✓ Ready for Production
```
