const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    const dataPath = path.join(__dirname, 'public', 'properties.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const { properties } = JSON.parse(rawData);

    console.log(`Migrating ${properties.length} properties...`);

    for (const property of properties) {
        // Remove ID to let Supabase generate new ones if needed, 
        // or keep it if you want to preserve IDs. 
        // Let's preserve them for now but ensure they don't conflict with identity columns.
        const { id, ...rest } = property;

        // Convert local relative image paths to absolute if they are stored in public/
        // Actually, for now we will keep them as is. 
        // In a real migration, we should upload them to Supabase Storage.

        const { data, error } = await supabase
            .from('properties')
            .insert([rest])
            .select();

        if (error) {
            console.error(`Error migrating property ${property.title}:`, error.message);
        } else {
            console.log(`Migrated: ${property.title}`);
        }
    }

    console.log('Migration complete!');
}

migrate();
