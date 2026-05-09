import React, { useEffect, useState } from 'react';

const UserList = ({user = null}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const userWalletAddress =
    user?.walletAddress ||
    user?.address ||
    user?.publicKey ||
    user?.wallet?.address ||
    user?.uid ||
    'Wallet not connected';
  const formattedWalletAddress =
    userWalletAddress.length > 9
      ? `${userWalletAddress.slice(0, 3)}...${userWalletAddress.slice(-3)}`
      : userWalletAddress;
  useEffect(() => {
    console.log(userWalletAddress)
    const fetchUsers = async () => {
      try {
        // Replace with your actual Render/Localhost URL
        const response = await fetch('http://localhost:3000/api/auth/getalluser');
        const data = await response.json();
        console.log(data);
        // Ensure data is an array before setting state
        setUsers(Array.isArray(data) ? data : data.users || []);
        console.log(users);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="text-center p-10">Loading users...</div>;

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">Vault Members</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user._id} className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg hover:border-blue-500 transition-all">
            <h3 className="text-xl font-semibold text-blue-400">{user.displayName}</h3>
            <p className="text-gray-400 text-sm mb-4">{user.email}</p>
            
            <div className="space-y-3 mb-4">
              <div className="text-sm">
                <span className="text-gray-500">UID:</span>
                <p className="text-gray-300 font-mono">{user.uid || user._id}</p>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Wallet Address:</span>
                <p className="text-gray-300 font-mono break-all">{user.walletAddress || 'N/A'}</p>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Wallet Points:</span>
                <p className="text-yellow-400 font-semibold">{user.walletPoints || 0}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-700 px-3 py-1 rounded-full text-xs">
                Role: {user.role || 'Students'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;