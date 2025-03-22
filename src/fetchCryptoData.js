'use strict';

const axios = require('axios');
const { coingeckoApi, apiKey } = require('./config');

const fetchCryptoData = async () => {
    try {
        console.log('Fetching Top 5 Cryptos...');

        const topCoinsRes = await axios.get(`${coingeckoApi.topCoinsUrl}${apiKey}`);
        const topCoins = topCoinsRes.data.slice(0, 5);

        const data = [];

        for (const coin of topCoins) {
            console.log(`Fetching prices for ${coin.name} (${coin.symbol})...`);
            const tickersRes = await axios.get(
                coingeckoApi.coinTickersUrl.replace('{id}', coin.id),
                {
                    headers: {
                        'x-cg-demo-api-key': `${apiKey}`,
                    },
                }
            );

            const tickers = tickersRes.data.tickers;
            const usdtTickers = tickers.filter(
                ticker => ticker.target === 'USDT'
            ).slice(0, 3);

            if (usdtTickers.length > 0) {
                const avgPrice =
                    usdtTickers.reduce((sum, t) => sum + parseFloat(t.last), 0) / usdtTickers.length;

                data.push({
                    coin: coin.symbol,
                    averagePrice: avgPrice.toFixed(2),
                    exchanges: usdtTickers.map(t => t.market.name),
                });
            } else {
                console.warn(`No USDT prices found for ${coin.name}. Skipping.`);
            }
        }

        return data;
    } catch (err) {
        console.error('Error fetching crypto data:', err.response ? err.response.data : err.message);
        return null;
    }
};

module.exports = { fetchCryptoData };
