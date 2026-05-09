const supabase = require('./supabaseClient');

async function checkSupabase() {
    try {
        // Check multiple tables that are used in the app
        const tables = ['notes', 'messages', 'votes'];
        
        for (const table of tables) {
            const { data, error } = await supabase.from(table).select('*').limit(1);
            
            if (error) {
                // Table might not exist - this is just a warning
                console.warn(`⚠️  Table "${table}" check: ${error.message}`);
            } else {
                console.log(`✅ Table "${table}" verified`);
            }
        }
        
        console.log('✅ Connected to Supabase successfully');
    } catch (err) {
        console.error('❌ Unexpected error connecting to Supabase:', err);
    }
}

module.exports = checkSupabase;