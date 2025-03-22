const Hypercore = require('hypercore');
const Hyperbee = require('hyperbee');

const createDb = async () => {
    const hypercore = new Hypercore('./db/crypto-prices'); // Set the file path for the database
    const hyperbee = new Hyperbee(hypercore, { keyEncoding: 'utf-8', valueEncoding: 'json' });
    await hyperbee.ready();
    return hyperbee;
};

module.exports = { createDb };
