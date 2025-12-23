const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
    process.exit(1);
}

async function migrate() {
    const dataPath = path.join(__dirname, 'public', 'properties.json');
    console.log('Reading properties from:', dataPath);

    if (!fs.existsSync(dataPath)) {
        console.error('properties.json not found!');
        return;
    }

    const rawData = fs.readFileSync(dataPath, 'utf8');
    let properties = [];
    try {
        properties = JSON.parse(rawData).properties || [];
    } catch (e) {
        console.error('Failed to parse properties.json:', e);
        return;
    }

    console.log(`Found ${properties.length} properties to migrate...`);

    const url = `${supabaseUrl}/rest/v1/properties`;
    const headers = {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal' // Don't return the inserted rows to save bandwidth
    };

    for (const property of properties) {
        // Remove ID to let Supabase generate new ones.
        // This is required because the column is GENERATED ALWAYS AS IDENTITY.
        const { id, ...cleanProperty } = property;

        // Ensure date_added is valid or null
        if (!cleanProperty.date_added) cleanProperty.date_added = new Date().toISOString().split('T')[0];

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(cleanProperty)
            });

            if (!response.ok) {
                const text = await response.text();
                console.error(`Failed to migrate "${property.title}": ${response.status} ${text}`);
            } else {
                console.log(`Migrated: "${property.title}"`);
            }
        } catch (e) {
            console.error(`Network error migrating "${property.title}":`, e.message);
        }
    }

    console.log('Migration complete!');
}

migrate();
