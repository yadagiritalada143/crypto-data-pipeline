const { createDb } = require('./database');

const inspectDb = async () => {
    const db = await createDb();

    console.log('Inspecting database...');

    // Iterate through stored entries
    for await (const { key, value } of db.createReadStream()) {
        console.log(`Timestamp: ${key}`);
        console.log(`Data: ${JSON.stringify(value, null, 2)}\n`);
    }
};

inspectDb().catch(console.error);
