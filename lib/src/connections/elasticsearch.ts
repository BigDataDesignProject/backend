import { Client } from 'elasticsearch';

import config from '../config';
import Inventory from '../models/inventory';
import Sales from '../models/sales';

const connect = async () => {
    await Promise.all([
        Sales.initialize(),
        Inventory.initialize(),
    ]);
};

const createClient = () => {
    return new Client({
        host: config.URLs.elasticsearch,
    });
};

export { connect, createClient };
