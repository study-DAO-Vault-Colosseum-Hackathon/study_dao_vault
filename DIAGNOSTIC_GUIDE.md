/**
 * Quick Diagnostic Guide for Q&A System
 * Run these checks in browser console to verify everything is working
 */

// 1. Check Socket Connection
console.log('🔌 SOCKET CONNECTION:');
const { socket, isConnected } = useContext(SocketContext);
console.log('Socket ID:', socket?.id);
console.log('Is Connected:', isConnected);

// 2. Check Supabase Client
console.log('\n📊 SUPABASE CONNECTION:');
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Has Anon Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

// 3. Check User Auth
console.log('\n👤 USER AUTH:');
console.log('User ID:', auth.currentUser?.uid);
console.log('User Email:', auth.currentUser?.email);

// 4. Check Messages Loaded
console.log('\n📝 QUESTIONS LOADED:');
console.log('Total messages:', messages.length);
console.log('Questions:', messages.filter(m => m.is_question).length);
console.log('Replies:', messages.filter(m => !m.is_question).length);

// 5. Check if questions table exists and is readable
async function testSupabaseAccess() {
  try {
    const { data, error } = await supabase.from('questions').select('count').limit(1);
    console.log('✅ Can read questions table:', !error);
    if (error) console.error('Error:', error);
  } catch (err) {
    console.error('❌ Cannot access questions table:', err);
  }
}

testSupabaseAccess();
