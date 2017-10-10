import { Client } from 'elasticsearch';

import config from '../config';

const createClient = () => {
    return new Client({
        host: config.URLs.elasticsearch,
        log: 'warning',
    });
};

export { createClient };
