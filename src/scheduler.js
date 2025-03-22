'use strict';

const cron = require('cron');
const { fetchCryptoData } = require('./fetchCryptoData');
const { createDb } = require('./database');
const { storeCryptoData } = require('./storeData');
const { fetchIntervalSeconds } = require('./config');

const startScheduler = async () => {
    const db = await createDb();
    const job = new cron.CronJob(`*/${fetchIntervalSeconds} * * * * *`, async () => {
        try {
            console.log('Fetching crypto data...');
            const data = await fetchCryptoData();
            if (data) {
                console.log('Fetched data successfully! Now storing...');
                await storeCryptoData(db, data);
                console.log('Data stored successfully:', JSON.stringify(data, null, 2));
            } else {
                console.warn('No data fetched. Skipping storage.');
            }
        } catch (error) {
            console.error('Error in scheduled job:', error.message);
        }
    });

    job.start();
    console.log(`Scheduler started! Fetching data every ${fetchIntervalSeconds} seconds.`);
};

startScheduler();