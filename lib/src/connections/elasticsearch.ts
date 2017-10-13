import { Client } from 'elasticsearch';

import config from '../config';
import Sales from '../models/sales';

const connect = async () => {
    await Sales.initialize();
};

const createClient = () => {
    return new Client({
        host: config.URLs.elasticsearch,
        log: 'warning',
    });
};

export { connect, createClient };
