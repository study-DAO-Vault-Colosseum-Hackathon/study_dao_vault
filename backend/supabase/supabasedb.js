const supabase = require('./supabaseClient');

async function checkSupabase() {
    try {
        // We try to fetch the table names or just one simple row
        const { data, error } = await supabase.from('notes').select('*').limit(1);

        if (error) {
            console.error(' Supabase connection error:', error.message);
        } else {
            console.log('Connected to Supabase successfully');
        }
    } catch (err) {
        console.error(' Unexpected error connecting to Supabase:', err);
    }
}

module.exports = checkSupabase;