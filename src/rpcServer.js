'use strict'

const RPC = require('@hyperswarm/rpc')
const DHT = require('hyperdht')
const Hypercore = require('hypercore')
const Hyperbee = require('hyperbee')
const crypto = require('crypto')

const main = async () => {
    // hyperbee db
    const core = new Hypercore('./db/rpc-server')
    const hbee = new Hyperbee(core, { keyEncoding: 'utf-8', valueEncoding: 'binary' })
    await hbee.ready()

    const hypercore = new Hypercore('./db/crypto-prices'); // Set the file path for the database
    const hyperbee = new Hyperbee(hypercore, { keyEncoding: 'utf-8', valueEncoding: 'json' });
    await hyperbee.ready();

    // resolved distributed hash table seed for key pair
    let dhtSeed = (await hbee.get('dht-seed'))?.value
    if (!dhtSeed) {
        // not found, generate and store in db
        dhtSeed = crypto.randomBytes(32)
        await hbee.put('dht-seed', dhtSeed)
    }

    // start distributed hash table, it is used for rpc service discovery
    const dht = new DHT({
        port: 40001,
        keyPair: DHT.keyPair(dhtSeed),
        bootstrap: [{ host: '127.0.0.1', port: 30001 }] // note boostrap points to dht that is started via cli
    })
    await dht.ready()

    // resolve rpc server seed for key pair
    let rpcSeed = (await hbee.get('rpc-seed'))?.value
    if (!rpcSeed) {
        rpcSeed = crypto.randomBytes(32)
        await hbee.put('rpc-seed', rpcSeed)
    }

    // setup rpc server
    const rpc = new RPC({ seed: rpcSeed, dht })
    const rpcServer = rpc.createServer()
    await rpcServer.listen()
    console.log('rpc server started listening on public key:', rpcServer.publicKey.toString('hex'))

    // bind handlers to rpc server
    rpcServer.respond('ping', async (reqRaw) => {
        try {

            const request = JSON.parse(reqRaw.toString('utf-8'));
            console.log('request is:', request)
            if (request.type === 'getLatestPrices') {
                const pairs = request.pairs.map(pair => pair.toLowerCase());
                let latestEntry = null;

                for await (const entry of hyperbee.createReadStream({ reverse: true, limit: 1 })) {
                    latestEntry = entry;
                }

                if (!latestEntry || !latestEntry.value) {
                    return Buffer.from(JSON.stringify([]), 'utf-8');
                }

                const relevantData = latestEntry.value.filter(item =>
                    pairs.includes(item.coin.toLowerCase())
                );

                console.log('[DEBUG] Relevant Data:', relevantData);
                return Buffer.from(JSON.stringify(relevantData, null, 2), 'utf-8');
            } else if (request.type === 'getHistoricalPrices') {
                const { pairs, from, to } = request;
                const pairSet = new Set(pairs.map(pair => pair.toLowerCase()));

                const results = [];
                for await (const { key, value } of hyperbee.createReadStream({
                    gte: from.toString(),
                    lte: to.toString(),
                })) {
                    const filteredData = value.filter(item => pairSet.has(item.coin.toLowerCase()));
                    results.push({ timestamp: key, data: filteredData });
                }
                return Buffer.from(JSON.stringify(results), 'utf-8');
            }

            return Buffer.from(JSON.stringify({ error: 'Unknown request type' }), 'utf-8');
        } catch (error) {
            console.error('Error processing RPC request:', error.message);
            return Buffer.from(JSON.stringify({ error: error.message }), 'utf-8');
        }
    });
}

main().catch(console.error)
