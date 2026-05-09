# User API Endpoints Documentation

## Overview
These endpoints manage user profiles with Firebase Authentication. All endpoints (except `/api/users/search/email` with specific conditions) require a valid Firebase ID token in the `Authorization` header.

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <firebase_id_token>
```

### Getting a Firebase Token (Frontend)
```javascript
import { auth } from './firebase';

const user = auth.currentUser;
const token = await user.getIdToken();

// Use token in API calls
fetch('/api/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## Endpoints

### 1. **Get All Users**
Fetch a list of all users in the system.

```
GET /api/users
```

**Headers:**
```
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "user123",
      "email": "user@example.com",
      "displayName": "John Doe",
      "photoURL": "https://example.com/photo.jpg",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-20T14:45:00.000Z"
    },
    {
      "id": "user456",
      "email": "jane@example.com",
      "displayName": "Jane Smith",
      "photoURL": "https://example.com/photo2.jpg",
      "createdAt": "2024-01-16T09:20:00.000Z",
      "updatedAt": "2024-01-21T11:15:00.000Z"
    }
  ],
  "count": 2,
  "message": "Users fetched successfully"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Unauthorized: Invalid token"
}
```

---

### 2. **Get Single User by ID**
Fetch a specific user by their ID.

```
GET /api/users/:userId
```

**Parameters:**
- `userId` (string, required): The user's Firebase UID

**Headers:**
```
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoURL": "https://example.com/photo.jpg",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T14:45:00.000Z"
  },
  "message": "User fetched successfully"
}
```

**Error Responses:**

404 Not Found:
```json
{
  "success": false,
  "message": "User not found"
}
```

400 Bad Request:
```json
{
  "success": false,
  "message": "User ID is required"
}
```

---

### 3. **Create or Update User Profile**
Create a new user profile or update an existing one. The authenticated user can only create/update their own profile unless they are an admin.

```
POST /api/users
```

**Headers:**
```
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "displayName": "John Doe",
  "photoURL": "https://example.com/photo.jpg",
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc55e4bEb58Eb",
  "bio": "Software developer and blockchain enthusiast"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoURL": "https://example.com/photo.jpg",
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc55e4bEb58Eb",
    "bio": "Software developer and blockchain enthusiast",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T14:45:00.000Z"
  },
  "message": "User created/updated successfully"
}
```

**Error Responses:**

400 Bad Request:
```json
{
  "success": false,
  "message": "Email is required"
}
```

403 Forbidden (email mismatch):
```json
{
  "success": false,
  "message": "Unauthorized: Email mismatch"
}
```

---

### 4. **Delete User**
Delete a user profile. Users can only delete their own profile unless they are an admin.

```
DELETE /api/users/:userId
```

**Parameters:**
- `userId` (string, required): The user's Firebase UID

**Headers:**
```
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Responses:**

403 Forbidden:
```json
{
  "success": false,
  "message": "Unauthorized: You can only delete your own profile"
}
```

---

### 5. **Search Users by Email**
Search for users by their email address.

```
GET /api/users/search/email?email=user@example.com
```

**Query Parameters:**
- `email` (string, required): The email address to search for

**Headers:**
```
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "user123",
      "email": "user@example.com",
      "displayName": "John Doe",
      "photoURL": "https://example.com/photo.jpg"
    }
  ],
  "message": "Users found"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Email query parameter is required"
}
```

---

## Frontend Usage Examples

### React Component Example

```javascript
import React, { useState, useEffect } from 'react';
import { auth } from './firebase';

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError('User not authenticated');
          return;
        }

        const token = await user.getIdToken();

        const response = await fetch('http://localhost:3000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>All Users ({users.length})</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.displayName}</strong> ({user.email})
            {user.photoURL && <img src={user.photoURL} alt={user.displayName} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersList;
```

### Update User Profile

```javascript
async function updateUserProfile(displayName, photoURL) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const token = await user.getIdToken();

    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user.email,
        displayName,
        photoURL
      })
    });

    const data = await response.json();
    if (data.success) {
      console.log('Profile updated:', data.data);
    } else {
      console.error('Update failed:', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Search Users by Email

```javascript
async function searchUserByEmail(email) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const token = await user.getIdToken();

    const response = await fetch(
      `http://localhost:3000/api/users/search/email?email=${encodeURIComponent(email)}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

## Firestore Collection Structure

The users are stored in Firestore with the following structure:

```
users/
├── {userId1}/
│   ├── email: string
│   ├── displayName: string
│   ├── photoURL: string
│   ├── walletAddress: string (optional)
│   ├── bio: string (optional)
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
│
└── {userId2}/
    ├── email: string
    ├── displayName: string
    ├── photoURL: string
    └── ...
```

---

## Common Issues & Solutions

### Issue: "Unauthorized: Invalid token"
**Solution:** 
- Ensure the token is valid and not expired
- Get a fresh token using `user.getIdToken()`
- Check that the Authorization header format is correct: `Bearer <token>`

### Issue: "Email is required"
**Solution:**
- When creating/updating a user, always include the email field
- Example: `{ email: "user@example.com", displayName: "John" }`

### Issue: "Email mismatch"
**Solution:**
- Users can only update their own email if they match the authenticated user's email
- Admins can update any user's email
- Use the `/api/users` endpoint without specifying userId for the authenticated user

### Issue: CORS Error
**Solution:**
- Ensure the frontend URL is configured in the backend's CORS options
- Check the `.env` file for the correct `FRONTEND_URL`
- Example: `FRONTEND_URL=http://localhost:5173`

---

## Security Considerations

1. **Token Verification:** All endpoints verify Firebase ID tokens
2. **Email Validation:** Users cannot update other users' emails (unless admin)
3. **Data Sanitization:** Sensitive fields are filtered before sending to frontend
4. **Delete Protection:** Users can only delete their own profiles (unless admin)
5. **CORS Protection:** Only requests from configured frontend URLs are allowed

---

## Future Enhancements

- Add pagination for `/api/users` endpoint
- Add filtering options (by role, registration date, etc.)
- Add admin endpoints for user management
- Add user statistics endpoint
- Add batch operations
