'use strict';

const storeCryptoData = async (db, data) => {
    try {
        const timestamp = Date.now().toString();
        await db.put(timestamp, data);
        console.log(`[${new Date().toISOString()}] Data stored successfully.`);
    } catch (error) {
        console.error('Error storing data:', error.message);
    }
};

module.exports = { storeCryptoData };
