import * as fs from 'fs';

import * as elasticsearch from './connections/elasticsearch';
import server from './server';
import { initialize } from './utils/geocode';

const start = async () => {
    try {
        await elasticsearch.connect();
        await initialize();
        server.start();
    } catch (err) {
        console.error(err);
        process.kill(1);
    }
};

start();
