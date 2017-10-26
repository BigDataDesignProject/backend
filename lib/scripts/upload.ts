import * as fs from 'fs';
import * as request from 'request';
import { Readable } from 'stream';

import config from '../src/config';

const uploadFile = (route: string, fileStream: Readable) => {
    return new Promise((resolve, reject) => {
        const options: request.Options = {
            url: `http://localhost:${config.port}/${route}`,
            method: 'POST',
            timeout: 3600000,
            formData: {
                file: fileStream,
            },
        };

        request(options, (err, res) => {
            if (err) {
                return reject(err);
            } else {
                resolve();
            }
        });
    });
};

const uploadInventory = async () => {
    const regex = /(wm-us-inventory-store-item-day-back-hist).*(\.txt)/;
    const dir = fs.readdirSync('../data/inventory');
    for (const file of dir) {
        if (regex.test(file)) {
            const stream = fs.createReadStream(`../data/inventory/${file}`);
            await uploadFile('inventory', stream);
        }
    }
};

const uploadSales = async () => {
    const regex = /(wm-us-sales-store-item-day-history-hist).*(\.txt)/;
    const dir = fs.readdirSync('../data/sales');
    for (const file of dir) {
        if (regex.test(file)) {
            const stream = fs.createReadStream(`../data/sales/${file}`);
            try {
                await uploadFile('sales', stream);
            } catch (err) {
                console.error(err);
            }
        }
    }
};

const uploadAll = async () => {
    await uploadSales();
    await uploadInventory();
    console.log('done uploading');
};

export {
    uploadInventory,
    uploadSales,
    uploadAll,
};

uploadAll();
