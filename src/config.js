module.exports = {
    apiKey: 'CG-AsUkpPcJBQqMSBeHSiVo8Wuc', // This is Demo key, shold replace with coingecko Pro API Key
    coingeckoApi: {
        topCoinsUrl: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&x_cg_demo_api_key=',
        coinTickersUrl: 'https://api.coingecko.com/api/v3/coins/binancecoin/tickers',
    },
    dhtBootstrap: [{ host: '127.0.0.1', port: 30001 }],
    fetchIntervalSeconds: 30,
};
