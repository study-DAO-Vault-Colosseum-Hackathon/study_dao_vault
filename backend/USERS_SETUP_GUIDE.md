# User Endpoints - Setup & Testing Guide

## What Was Implemented

### 1. **Extended User Repository** (`backend/repositories/userRepository.js`)
Added the following methods to manage users:
- `getAllUsers()` - Fetch all users
- `getUserById(userId)` - Get a specific user
- `createOrUpdateUser(userId, userData)` - Create/update user profile
- `deleteUser(userId)` - Delete a user
- `searchUsersByEmail(email)` - Search users by email

### 2. **New Users Route** (`backend/routes/users.js`)
Created REST endpoints:
- `GET /api/users` - List all users
- `GET /api/users/:userId` - Get single user
- `GET /api/users/search/email?email=...` - Search by email
- `POST /api/users` - Create/update profile
- `DELETE /api/users/:userId` - Delete profile

All routes are protected with Firebase token authentication.

### 3. **Server Integration** (`backend/src/index.js`)
- Imported the new users router
- Registered at `/api/users` path

---

## Database Structure (Firestore)

Users are stored in Firestore with this structure:

```
users/
├── {firebaseUID1}/
│   ├── email: "user@example.com"
│   ├── displayName: "John Doe"
│   ├── photoURL: "https://..."
│   ├── walletAddress: "0x..." (optional)
│   ├── createdAt: "2024-01-15T10:30:00Z"
│   └── updatedAt: "2024-01-15T10:30:00Z"
│
└── {firebaseUID2}/
    ├── email: "another@example.com"
    ├── displayName: "Jane Smith"
    └── ...
```

---

## Testing the Endpoints

### Prerequisites
1. Node.js installed
2. Firebase Admin credentials configured
3. Backend server running on `http://localhost:3000`
4. User authenticated with Firebase

### Option 1: Using cURL (Linux/Mac/PowerShell)

```bash
# Set your token (from Firebase)
TOKEN="your_firebase_id_token_here"

# Get all users
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Get a specific user
curl -X GET http://localhost:3000/api/users/user123 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Search users by email
curl -X GET "http://localhost:3000/api/users/search/email?email=user@example.com" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Create/update user
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoURL": "https://example.com/photo.jpg",
    "walletAddress": "0x..."
  }'

# Delete user
curl -X DELETE http://localhost:3000/api/users/user123 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### Option 2: Using Postman

1. **Create a new request** - Set method to `GET`
2. **URL**: `http://localhost:3000/api/users`
3. **Headers**:
   ```
   Authorization: Bearer <your_firebase_token>
   Content-Type: application/json
   ```
4. **Send** - You should see all users

### Option 3: Using test-token.js (Frontend)

```javascript
import { auth } from './firebase';

async function testGetAllUsers() {
  const user = auth.currentUser;
  if (!user) {
    console.log('Please log in first');
    return;
  }

  const token = await user.getIdToken();

  const response = await fetch('http://localhost:3000/api/users', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  console.log('All users:', data);
}

testGetAllUsers();
```

---

## How to Set Up Firebase Auth on Frontend

### 1. Ensure Firebase is configured (`frontend/src/firebase/firebase.js`)

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```

### 2. Google Sign-In Setup

```javascript
import { auth, googleProvider } from './firebase/firebase';
import { signInWithPopup } from 'firebase/auth';

async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log('Signed in as:', user.email);
    
    // Get token for API calls
    const token = await user.getIdToken();
    console.log('Token:', token);
  } catch (error) {
    console.error('Sign-in error:', error);
  }
}
```

### 3. Create a Custom Hook for Fetching Users

```javascript
// frontend/src/hooks/useUsers.js
import { useState, useEffect } from 'react';
import { auth } from '../firebase/firebase';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        const token = await user.getIdToken();
        const response = await fetch('http://localhost:3000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch users');

        const data = await response.json();
        setUsers(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
}
```

### 4. Use the Hook in a Component

```javascript
// frontend/src/components/UsersList.jsx
import React from 'react';
import { useUsers } from '../hooks/useUsers';

export function UsersList() {
  const { users, loading, error } = useUsers();

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>All Users ({users.length})</h1>
      <div className="users-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            {user.photoURL && (
              <img src={user.photoURL} alt={user.displayName} />
            )}
            <h3>{user.displayName}</h3>
            <p>{user.email}</p>
            <p className="created-at">
              Joined: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Environment Variables Needed

### Backend (.env)
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FRONTEND_URL=http://localhost:5173
PORT=3000
```

### Frontend (.env)
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

---

## Common Issues & Fixes

### Issue: "Unauthorized: Invalid token"
**Cause:** Token is expired or invalid
**Fix:**
```javascript
// Always get fresh token
const token = await user.getIdToken(true); // Force refresh
```

### Issue: CORS Error
**Cause:** Frontend URL not in backend CORS config
**Fix:** Update `.env` with correct `FRONTEND_URL`

### Issue: "User not found" when user exists
**Cause:** User ID doesn't match Firebase UID
**Fix:** 
```javascript
// Use user.uid from Firebase
const userId = auth.currentUser.uid;
```

### Issue: Firestore connection error
**Cause:** Firebase credentials not configured
**Fix:**
1. Check `.env` has all Firebase variables
2. Or place `serviceAccountKey.json` in backend folder
3. Verify Firebase Admin SDK initialization

---

## Next Steps

1. **Test the endpoints** using cURL, Postman, or the frontend
2. **Create a Users List Component** to display all users
3. **Add User Profile Page** to view individual users
4. **Implement Search UI** to find users by email
5. **Add User Management Dashboard** for admins

---

## Support Files

- Full API documentation: [USER_API_ENDPOINTS.md](./USER_API_ENDPOINTS.md)
- User Repository: [repositories/userRepository.js](./repositories/userRepository.js)
- Users Route: [routes/users.js](./routes/users.js)
- Authentication Middleware: [middleware/auth.js](./middleware/auth.js)
