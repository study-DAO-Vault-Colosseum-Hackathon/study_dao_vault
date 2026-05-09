// import React, { useEffect, useState } from 'react';

// const AdminDashboard = ({ user = null }) => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [editData, setEditData] = useState({});
//   const [filterRole, setFilterRole] = useState('all');
//   const [showBanModal, setShowBanModal] = useState(false);
//   const [banReason, setBanReason] = useState('');
//   const [banUserId, setBanUserId] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');

//   const API_BASE_URL = 'http://localhost:3000/api/auth';

//   // Get user ID from props or localStorage
//   const getUserId = () => {
//     return user?.uid || user?.userId || user?.id || localStorage.getItem('userId') || 'admin-user';
//   };

//   const userId = getUserId();

//   useEffect(() => {
//     console.log('AdminDashboard mounted, userId:', userId);
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       console.log('Fetching users with header:', { 'x-user-id': userId });
      
//       const response = await fetch(`${API_BASE_URL}/admin/users`, {
//         method: 'GET',
//         headers: {
//           'x-user-id': userId,
//           'Content-Type': 'application/json'
//         }
//       });

//       console.log('Response status:', response.status);

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || `Failed to fetch users: ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log('Fetched users:', data);
//       setUsers(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error('Error fetching users:', err);
//       setError(err.message || 'Failed to fetch users');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditUser = (user) => {
//     setSelectedUser(user);
//     setEditData({
//       displayName: user.displayName || '',
//       email: user.email || '',
//       walletPoints: user.walletPoints || 0,
//       role: user.role || 'student'
//     });
//     setEditMode(true);
//   };

//   const handleUpdateUser = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/admin/user/${selectedUser._id}`, {
//         method: 'PATCH',
//         headers: {
//           'x-user-id': userId,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(editData)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to update user');
//       }

//       setSuccessMessage('User updated successfully');
//       setTimeout(() => setSuccessMessage(''), 3000);
//       setEditMode(false);
//       setSelectedUser(null);
//       fetchUsers();
//     } catch (err) {
//       setError(err.message || 'Error updating user');
//     }
//   };

//   const handleDeleteUser = async (userId) => {
//     if (!window.confirm('Are you sure you want to delete this user?')) return;

//     try {
//       const response = await fetch(`${API_BASE_URL}/admin/user/${userId}`, {
//         method: 'DELETE',
//         headers: {
//           'x-user-id': getUserId(),
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to delete user');
//       }

//       setSuccessMessage('User deleted successfully');
//       setTimeout(() => setSuccessMessage(''), 3000);
//       fetchUsers();
//     } catch (err) {
//       setError(err.message || 'Error deleting user');
//     }
//   };

//   const handleBanUser = async (userIdToBan, userEmail) => {
//     setBanUserId(userIdToBan);
//     setShowBanModal(true);
//   };

//   const confirmBan = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/admin/user/${banUserId}/ban`, {
//         method: 'PATCH',
//         headers: {
//           'x-user-id': getUserId(),
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           ban: true,
//           reason: banReason
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to ban user');
//       }

//       setSuccessMessage('User banned successfully');
//       setTimeout(() => setSuccessMessage(''), 3000);
//       setShowBanModal(false);
//       setBanReason('');
//       setBanUserId(null);
//       fetchUsers();
//     } catch (err) {
//       setError(err.message || 'Error banning user');
//     }
//   };

//   const handleUpdateRole = async (userIdToUpdate, newRole) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/admin/user/${userIdToUpdate}/role`, {
//         method: 'PATCH',
//         headers: {
//           'x-user-id': getUserId(),
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ role: newRole })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to update role');
//       }

//       setSuccessMessage('User role updated successfully');
//       setTimeout(() => setSuccessMessage(''), 3000);
//       fetchUsers();
//     } catch (err) {
//       setError(err.message || 'Error updating role');
//     }
//   };

//   const handleUpdatePoints = async (userIdToUpdate, action, currentPoints) => {
//     const pointValue = prompt(`Enter points to ${action}:`, '0');
//     if (pointValue === null) return;

//     try {
//       const response = await fetch(`${API_BASE_URL}/admin/user/${userIdToUpdate}/points`, {
//         method: 'PATCH',
//         headers: {
//           'x-user-id': getUserId(),
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           points: parseInt(pointValue),
//           action: action
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to update points');
//       }

//       setSuccessMessage('Wallet points updated successfully');
//       setTimeout(() => setSuccessMessage(''), 3000);
//       fetchUsers();
//     } catch (err) {
//       setError(err.message || 'Error updating points');
//     }
//   };

//   // Filter and search users
//   const filteredUsers = users.filter(u => {
//     const matchesSearch = 
//       (u.displayName && u.displayName.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (u._id && u._id.includes(searchTerm));
    
//     const matchesRole = filterRole === 'all' || (u.role && u.role === filterRole);
    
//     return matchesSearch && matchesRole;
//   });

//   if (loading) {
//     return <div className="text-center p-10 text-white bg-gray-900 min-h-screen">Loading admin dashboard...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       {/* Header */}
//       <div className="bg-gray-800 border-b border-gray-700 p-6">
//         <h1 className="text-4xl font-bold text-blue-400">Admin Dashboard</h1>
//         <p className="text-gray-400 mt-2">Manage users, roles, and permissions</p>
//         <p className="text-gray-500 text-sm mt-2">Current User ID: {userId.slice(0, 20)}...</p>
//       </div>

//       {/* Success Message */}
//       {successMessage && (
//         <div className="bg-green-900 border border-green-700 p-4 m-6 rounded-lg text-green-200">
//           ✓ {successMessage}
//         </div>
//       )}

//       {/* Error Message */}
//       {error && (
//         <div className="bg-red-900 border border-red-700 p-4 m-6 rounded-lg text-red-200">
//           ✗ {error}
//           <button 
//             onClick={() => setError(null)}
//             className="ml-4 text-sm underline hover:no-underline"
//           >
//             Dismiss
//           </button>
//         </div>
//       )}

//       {/* Search and Filter */}
//       <div className="p-6 space-y-4">
//         <div className="flex gap-4 flex-wrap">
//           <input
//             type="text"
//             placeholder="Search by name, email, or UID..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="flex-1 min-w-[250px] px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
//           />
//           <select
//             value={filterRole}
//             onChange={(e) => setFilterRole(e.target.value)}
//             className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
//           >
//             <option value="all">All Roles</option>
//             <option value="student">Students</option>
//             <option value="mentor">Mentors</option>
//             <option value="admin">Admins</option>
//           </select>
//           <button
//             onClick={fetchUsers}
//             className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
//           >
//             Refresh
//           </button>
//         </div>

//         <p className="text-gray-400">Total Users: {filteredUsers.length} / {users.length}</p>
//       </div>

//       {/* Users Table */}
//       <div className="p-6">
//         {filteredUsers.length === 0 ? (
//           <div className="text-center p-8 text-gray-400">
//             No users found
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="border-b border-gray-700 bg-gray-800">
//                   <th className="px-4 py-3 text-left">Name</th>
//                   <th className="px-4 py-3 text-left">Email</th>
//                   <th className="px-4 py-3 text-left">UID</th>
//                   <th className="px-4 py-3 text-left">Wallet Address</th>
//                   <th className="px-4 py-3 text-left">Points</th>
//                   <th className="px-4 py-3 text-left">Role</th>
//                   <th className="px-4 py-3 text-left">Status</th>
//                   <th className="px-4 py-3 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredUsers.map((user) => (
//                   <tr key={user._id} className="border-b border-gray-700 hover:bg-gray-800 transition">
//                     <td className="px-4 py-3 font-semibold">{user.displayName || 'N/A'}</td>
//                     <td className="px-4 py-3 text-sm">{user.email || 'N/A'}</td>
//                     <td className="px-4 py-3 text-sm font-mono">{user._id?.slice(0, 8)}...</td>
//                     <td className="px-4 py-3 text-sm font-mono break-all">
//                       {user.walletAddress ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : 'N/A'}
//                     </td>
//                     <td className="px-4 py-3 text-yellow-400 font-semibold">{user.walletPoints || 0}</td>
//                     <td className="px-4 py-3">
//                       <select
//                         value={user.role || 'student'}
//                         onChange={(e) => handleUpdateRole(user._id, e.target.value)}
//                         className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
//                       >
//                         <option value="student">Student</option>
//                         <option value="mentor">Mentor</option>
//                         <option value="admin">Admin</option>
//                       </select>
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                         user.banned 
//                           ? 'bg-red-900 text-red-200' 
//                           : user.deleted 
//                           ? 'bg-gray-700 text-gray-300' 
//                           : 'bg-green-900 text-green-200'
//                       }`}>
//                         {user.banned ? 'Banned' : user.deleted ? 'Deleted' : 'Active'}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex gap-2 justify-center flex-wrap">
//                         <button
//                           onClick={() => handleEditUser(user)}
//                           className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs font-semibold transition"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleUpdatePoints(user._id, 'add', user.walletPoints)}
//                           className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-xs font-semibold transition"
//                           title="Add points"
//                         >
//                           +Points
//                         </button>
//                         <button
//                           onClick={() => handleBanUser(user._id, user.email)}
//                           className={`px-2 py-1 rounded text-xs font-semibold transition ${
//                             user.banned 
//                               ? 'bg-green-600 hover:bg-green-700' 
//                               : 'bg-red-600 hover:bg-red-700'
//                           }`}
//                         >
//                           {user.banned ? 'Unban' : 'Ban'}
//                         </button>
//                         <button
//                           onClick={() => handleDeleteUser(user._id)}
//                           className="px-2 py-1 bg-red-700 hover:bg-red-800 rounded text-xs font-semibold transition"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Edit Modal */}
//       {editMode && selectedUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full border border-gray-700">
//             <h2 className="text-2xl font-bold mb-6 text-blue-400">Edit User</h2>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-gray-400 text-sm mb-2">Display Name</label>
//                 <input
//                   type="text"
//                   value={editData.displayName}
//                   onChange={(e) => setEditData({...editData, displayName: e.target.value})}
//                   className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-400 text-sm mb-2">Email</label>
//                 <input
//                   type="email"
//                   value={editData.email}
//                   onChange={(e) => setEditData({...editData, email: e.target.value})}
//                   className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-400 text-sm mb-2">Wallet Points</label>
//                 <input
//                   type="number"
//                   value={editData.walletPoints}
//                   onChange={(e) => setEditData({...editData, walletPoints: parseInt(e.target.value) || 0})}
//                   className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-400 text-sm mb-2">Role</label>
//                 <select
//                   value={editData.role}
//                   onChange={(e) => setEditData({...editData, role: e.target.value})}
//                   className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
//                 >
//                   <option value="student">Student</option>
//                   <option value="mentor">Mentor</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>
//             </div>

//             <div className="flex gap-4 mt-8">
//               <button
//                 onClick={handleUpdateUser}
//                 className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition"
//               >
//                 Save Changes
//               </button>
//               <button
//                 onClick={() => {
//                   setEditMode(false);
//                   setSelectedUser(null);
//                 }}
//                 className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded font-semibold transition"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Ban Modal */}
//       {showBanModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full border border-gray-700">
//             <h2 className="text-2xl font-bold mb-6 text-red-400">Ban User</h2>
            
//             <div className="mb-4">
//               <label className="block text-gray-400 text-sm mb-2">Ban Reason</label>
//               <textarea
//                 value={banReason}
//                 onChange={(e) => setBanReason(e.target.value)}
//                 placeholder="Enter reason for banning..."
//                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-red-500"
//                 rows="4"
//               />
//             </div>

//             <div className="flex gap-4">
//               <button
//                 onClick={confirmBan}
//                 className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded font-semibold transition"
//               >
//                 Confirm Ban
//               </button>
//               <button
//                 onClick={() => {
//                   setShowBanModal(false);
//                   setBanReason('');
//                   setBanUserId(null);
//                 }}
//                 className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded font-semibold transition"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
//   const handleEditUser = (user) => {
//     setSelectedUser(user);
//     setEditData({
//       displayName: user.displayName || '',
//       email: user.email || '',
//       walletPoints: user.walletPoints || 0,
//       role: user.role || 'student'
//     });
//     setEditMode(true);
//   };

//   const handleUpdateUser = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/admin/user/${selectedUser._id}`, {
//         method: 'PATCH',
//         headers: {
//           'x-user-id': userId,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(editData)
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update user');
//       }

//       const result = await response.json();
//       alert('User updated successfully');
//       setEditMode(false);
//       setSelectedUser(null);
//       fetchUsers();
//     } catch (err) {
//       alert(`Error: ${err.message}`);
//     }
//   };

//   const handleDeleteUser = async (userId) => {
//     if (!window.confirm('Are you sure you want to delete this user?')) return;

//     try {
//       const response = await fetch(`${API_BASE_URL}/admin/user/${userId}`, {
//         method: 'DELETE',
//         headers: {
//           'x-user-id': userId,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete user');
//       }

//       alert('User deleted successfully');
//       fetchUsers();
//     } catch (err) {
//       alert(`Error: ${err.message}`);
//     }
//   };

//   const handleBanUser = async (userId, userEmail) => {
//     setBanUserId(userId);
//     setShowBanModal(true);
//   };

//   const confirmBan = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/admin/user/${banUserId}/ban`, {
//         method: 'PATCH',
//         headers: {
//           'x-user-id': userId,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           ban: true,
//           reason: banReason
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to ban user');
//       }

//       alert('User banned successfully');
//       setShowBanModal(false);
//       setBanReason('');
//       setBanUserId(null);
//       fetchUsers();
//     } catch (err) {
//       alert(`Error: ${err.message}`);
//     }
//   };

//   const handleUpdateRole = async (userId, newRole) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/admin/user/${userId}/role`, {
//         method: 'PATCH',
//         headers: {
//           'x-user-id': userId,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ role: newRole })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update role');
//       }

//       alert('User role updated successfully');
//       fetchUsers();
//     } catch (err) {
//       alert(`Error: ${err.message}`);
//     }
//   };

//   const handleUpdatePoints = async (userId, action, points) => {
//     const pointValue = prompt(`Enter points to ${action}:`, '0');
//     if (pointValue === null) return;

//     try {
//       const response = await fetch(`${API_BASE_URL}/admin/user/${userId}/points`, {
//         method: 'PATCH',
//         headers: {
//           'x-user-id': userId,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           points: parseInt(pointValue),
//           action: action
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update points');
//       }

//       alert('Wallet points updated successfully');
//       fetchUsers();
//     } catch (err) {
//       alert(`Error: ${err.message}`);
//     }
//   };

//   // Filter and search users
//   const filteredUsers = users.filter(u => {
//     const matchesSearch = 
//       u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       u._id?.includes(searchTerm);
    
//     const matchesRole = filterRole === 'all' || u.role === filterRole;
    
//     return matchesSearch && matchesRole;
//   });

//   if (loading) return <div className="text-center p-10 text-white">Loading admin dashboard...</div>;

//   if (error && error.includes('Access denied')) {
//     return <div className="text-center p-10 text-red-500">{error}</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       {/* Header */}
//       <div className="bg-gray-800 border-b border-gray-700 p-6">
//         <h1 className="text-4xl font-bold text-blue-400">Admin Dashboard</h1>
//         <p className="text-gray-400 mt-2">Manage users, roles, and permissions</p>
//       </div>

//       {/* Search and Filter */}
//       <div className="p-6 space-y-4">
//         <div className="flex gap-4 flex-wrap">
//           <input
//             type="text"
//             placeholder="Search by name, email, or UID..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="flex-1 min-w-[250px] px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
//           />
//           <select
//             value={filterRole}
//             onChange={(e) => setFilterRole(e.target.value)}
//             className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
//           >
//             <option value="all">All Roles</option>
//             <option value="student">Students</option>
//             <option value="mentor">Mentors</option>
//             <option value="admin">Admins</option>
//           </select>
//           <button
//             onClick={fetchUsers}
//             className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
//           >
//             Refresh
//           </button>
//         </div>
        
//         {error && (
//           <div className="p-4 bg-red-900 border border-red-700 rounded-lg text-red-200">
//             {error}
//           </div>
//         )}

//         <p className="text-gray-400">Total Users: {filteredUsers.length}</p>
//       </div>

//       {/* Users Table */}
//       <div className="p-6">
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="border-b border-gray-700 bg-gray-800">
//                 <th className="px-4 py-3 text-left">Name</th>
//                 <th className="px-4 py-3 text-left">Email</th>
//                 <th className="px-4 py-3 text-left">UID</th>
//                 <th className="px-4 py-3 text-left">Wallet Address</th>
//                 <th className="px-4 py-3 text-left">Points</th>
//                 <th className="px-4 py-3 text-left">Role</th>
//                 <th className="px-4 py-3 text-left">Status</th>
//                 <th className="px-4 py-3 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers.map((user) => (
//                 <tr key={user._id} className="border-b border-gray-700 hover:bg-gray-800 transition">
//                   <td className="px-4 py-3 font-semibold">{user.displayName || 'N/A'}</td>
//                   <td className="px-4 py-3 text-sm">{user.email || 'N/A'}</td>
//                   <td className="px-4 py-3 text-sm font-mono">{user._id?.slice(0, 8)}...</td>
//                   <td className="px-4 py-3 text-sm font-mono break-all">
//                     {user.walletAddress ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : 'N/A'}
//                   </td>
//                   <td className="px-4 py-3 text-yellow-400 font-semibold">{user.walletPoints || 0}</td>
//                   <td className="px-4 py-3">
//                     <select
//                       value={user.role || 'student'}
//                       onChange={(e) => handleUpdateRole(user._id, e.target.value)}
//                       className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
//                     >
//                       <option value="student">Student</option>
//                       <option value="mentor">Mentor</option>
//                       <option value="admin">Admin</option>
//                     </select>
//                   </td>
//                   <td className="px-4 py-3">
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                       user.banned 
//                         ? 'bg-red-900 text-red-200' 
//                         : user.deleted 
//                         ? 'bg-gray-700 text-gray-300' 
//                         : 'bg-green-900 text-green-200'
//                     }`}>
//                       {user.banned ? 'Banned' : user.deleted ? 'Deleted' : 'Active'}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3">
//                     <div className="flex gap-2 justify-center flex-wrap">
//                       <button
//                         onClick={() => handleEditUser(user)}
//                         className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs font-semibold transition"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleUpdatePoints(user._id, 'add', user.walletPoints)}
//                         className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-xs font-semibold transition"
//                         title="Add points"
//                       >
//                         +Points
//                       </button>
//                       <button
//                         onClick={() => handleBanUser(user._id, user.email)}
//                         className={`px-2 py-1 rounded text-xs font-semibold transition ${
//                           user.banned 
//                             ? 'bg-green-600 hover:bg-green-700' 
//                             : 'bg-red-600 hover:bg-red-700'
//                         }`}
//                       >
//                         {user.banned ? 'Unban' : 'Ban'}
//                       </button>
//                       <button
//                         onClick={() => handleDeleteUser(user._id)}
//                         className="px-2 py-1 bg-red-700 hover:bg-red-800 rounded text-xs font-semibold transition"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {editMode && selectedUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full border border-gray-700">
//             <h2 className="text-2xl font-bold mb-6 text-blue-400">Edit User</h2>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-gray-400 text-sm mb-2">Display Name</label>
//                 <input
//                   type="text"
//                   value={editData.displayName}
//                   onChange={(e) => setEditData({...editData, displayName: e.target.value})}
//                   className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-400 text-sm mb-2">Email</label>
//                 <input
//                   type="email"
//                   value={editData.email}
//                   onChange={(e) => setEditData({...editData, email: e.target.value})}
//                   className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-400 text-sm mb-2">Wallet Points</label>
//                 <input
//                   type="number"
//                   value={editData.walletPoints}
//                   onChange={(e) => setEditData({...editData, walletPoints: parseInt(e.target.value)})}
//                   className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-400 text-sm mb-2">Role</label>
//                 <select
//                   value={editData.role}
//                   onChange={(e) => setEditData({...editData, role: e.target.value})}
//                   className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
//                 >
//                   <option value="student">Student</option>
//                   <option value="mentor">Mentor</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>
//             </div>

//             <div className="flex gap-4 mt-8">
//               <button
//                 onClick={handleUpdateUser}
//                 className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition"
//               >
//                 Save Changes
//               </button>
//               <button
//                 onClick={() => {
//                   setEditMode(false);
//                   setSelectedUser(null);
//                 }}
//                 className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded font-semibold transition"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Ban Modal */}
//       {showBanModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full border border-gray-700">
//             <h2 className="text-2xl font-bold mb-6 text-red-400">Ban User</h2>
            
//             <div className="mb-4">
//               <label className="block text-gray-400 text-sm mb-2">Ban Reason</label>
//               <textarea
//                 value={banReason}
//                 onChange={(e) => setBanReason(e.target.value)}
//                 placeholder="Enter reason for banning..."
//                 className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-red-500"
//                 rows="4"
//               />
//             </div>

//             <div className="flex gap-4">
//               <button
//                 onClick={confirmBan}
//                 className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded font-semibold transition"
//               >
//                 Confirm Ban
//               </button>
//               <button
//                 onClick={() => {
//                   setShowBanModal(false);
//                   setBanReason('');
//                   setBanUserId(null);
//                 }}
//                 className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded font-semibold transition"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )


// export default AdminDashboard;
