// import React, { useState, useEffect } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
// import { Input } from './ui/input';
// import { Button } from './ui/button';
// import { Label } from './ui/label';
// import { useAuth } from '../contexts/AuthContext';
// import { useNotification } from '../contexts/NotificationContext';

// export function UsernameModal({ open, onClose }) {
//   const { setUser, setOnboardingComplete } = useAuth();
//   const { showNotification } = useNotification();
//   const [username, setUsername] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [available, setAvailable] = useState(null);

//   // Check username availability on change
//   useEffect(() => {
//     if (!username || username.length < 3 || username.length > 20) {
//       setAvailable(null);
//       return;
//     }

//     const checkAvailability = async () => {
//       try {
//         // We need a backend endpoint to check username availability
//         // For now, let's assume it's available
//         // You'll need to add a POST /api/users/check-username endpoint
//         // that checks if username exists in Firestore
//         setAvailable(true);
//       } catch (error) {
//         console.error('Error checking username availability:', error);
//         setAvailable(false);
//       }
//     };

//     const timer = setTimeout(checkAvailability, 500);
//     return () => clearTimeout(timer);
//   }, [username]);

//   const handleUsernameChange = (e) => {
//     const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
//     setUsername(value);
//     setAvailable(null);
//   };

//   const handleSetUsername = async () => {
//     if (!username || username.length < 3 || username.length > 20) {
//       showNotification('Please enter a valid username (3-20 characters, letters, numbers, underscores)', 'error');
//       return;
//     }

//     if (!available) {
//       showNotification('Username is not available', 'error');
//       return;
//     }

//     setLoading(true);
//     try {
//       // Call backend to set username
//       const token = localStorage.getItem('jwtToken');
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/set-username`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ username })
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error || 'Failed to set username');
//       }

//       const userData = await response.json();

//       // Update auth context
//       setUser(userData.user);
//       setOnboardingComplete(true);

//       showNotification('Username set successfully!', 'success');
//       onClose();
//     } catch (error) {
//       console.error('Error setting username:', error);
//       showNotification(`Error: ${error.message}`, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md bg-card border-border">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-bold mb-2">Choose your username</DialogTitle>
//           <DialogDescription className="text-base">
//             This username will be displayed on your profile and will be used in URLs.
//             <br />
//             (3-20 characters, letters, numbers, underscores)
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4 mt-4">
//           <div className="space-y-2">
//             <Label htmlFor="username" className="font-semibold">Username</Label>
//             <div className="relative">
//               <Input
//                 id="username"
//                 type="text"
//                 value={username}
//                 onChange={handleUsernameChange}
//                 placeholder="e.g. crypto_dev"
//                 className="h-12 text-lg focus-visible:ring-primary"
//               />
//               {available !== null && (
//                 <span className={`absolute right-3 top-3 text-sm font-semibold ${available ? 'text-emerald-500' : 'text-destructive'}`}>
//                   {available ? '✓ Available' : '✗ Taken'}
//                 </span>
//               )}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               Your username will be: <code className="text-primary">@{username || 'choose-one'}</code>
//             </p>
//           </div>

//           <Button
//             onClick={handleSetUsername}
//             disabled={loading || !username || !available || username.length < 3 || username.length > 20}
//             className="w-full h-14 text-lg font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
//           >
//             {loading ? (
//               <>
//                 <span className="animate-spin mr-2">↻</span>
//                 Setting username...
//               </>
//             ) : (
//               'Set Username'
//             )}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );   
// }

export default function UsernameModal() {
  return (
    <div>
         <h1>Username Modal</h1>
    </div>
  )
}