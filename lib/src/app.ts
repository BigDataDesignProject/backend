import * as fs from 'fs';

import * as elasticsearch from './connections/elasticsearch';
import server from './server';

const csv = require('csv');

const start = async () => {
    try {
        await elasticsearch.connect();
        server.start();
//        writeTxtToStdOut();
    } catch (err) {
        console.error(err);
        process.kill(1);
    }
};

// const writeTxtToStdOut = () => {
//     const input = fs.createReadStream('../data/sales/wm-us-sales-store-item-day-history-hist_1735_1735.txt');
//     const parser = csv.parse({ delimiter: '\t' });

//     input.pipe(parser).pipe(csv.stringify()).pipe(process.stdout);
// };

start();
