'use strict';

const RPC = require('@hyperswarm/rpc');
const DHT = require('hyperdht');
const { dhtBootstrap } = require('./config');

const dht = new DHT({ bootstrap: dhtBootstrap });
const rpc = new RPC({ dht });

const fetchLatestPrices = async (serverPublicKey, pairs) => {
    try {
        console.log('Fetching latest prices...');

        const requestPayload = Buffer.from(JSON.stringify({ type: 'getLatestPrices', pairs }), 'utf-8');
        const responseRaw = await rpc.request(Buffer.from(serverPublicKey, 'hex'), 'ping', requestPayload);
        const response = JSON.parse(responseRaw.toString('utf-8'));
        return response;
    } catch (error) {
        console.error('Error fetching latest prices:', error.message);
    }
};

const fetchHistoricalPrices = async (serverPublicKey, pairs, from, to) => {
    try {
        console.log(`Fetching historical prices for ${pairs} from ${from} to ${to}...`);

        const requestPayload = Buffer.from(JSON.stringify({ type: 'getHistoricalPrices', pairs, from, to }), 'utf-8');
        const responseRaw = await rpc.request(Buffer.from(serverPublicKey, 'hex'), 'ping', requestPayload);
        const response = JSON.parse(responseRaw.toString('utf-8'));
        return response;
    } catch (error) {
        console.error('Error fetching historical prices:', error.message);
    }
};

(async () => {
    const serverPublicKey = process.argv[2];
    if (!serverPublicKey) {
        console.error('Error: Please provide the server public key.');
        return;
    }

    // Fetch latest prices for "btc", "eth", "xrp", "bnb", and "usdt"
    const pairs = ['btc', 'eth', 'xrp', 'bnb', 'usdt'];
    const latestPriceResponse = await fetchLatestPrices(serverPublicKey, pairs);
    console.log('Finally Latest Prices are:', JSON.stringify(latestPriceResponse, null, 2));

    // Fetch historical prices for last 10 minutes
    const from = Date.now() - 10 * 60 * 1000; // 10 minutes ago
    const to = Date.now(); // Current time
    const historicalPriceResponse = await fetchHistoricalPrices(serverPublicKey, pairs, from, to);
    console.log('Finally Historical Prices are:', JSON.stringify(historicalPriceResponse, null, 2));
})();
