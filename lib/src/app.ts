import * as fs from 'fs';

import * as elasticsearch from './connections/elasticsearch';
import server from './server';

const csv = require('csv');

const start = async () => {
    try {
        await elasticsearch.connect();
        server.start();
    } catch (err) {
        console.error(err);
        process.kill(1);
    }
};

start();
