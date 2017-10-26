import * as Router from 'koa-router';

import Inventory from '../models/inventory';

const asyncBusboy = require('async-busboy');

const inventoryRoutes = new Router({ prefix: '/inventory' });

inventoryRoutes.post('/', async (ctx, next) => {
    const { files, fields } = await asyncBusboy(ctx.req);
    try {
        await Inventory.upload(files[0].path);
        ctx.status = 200;
    } catch (err) {
        console.error(err);
        ctx.body = JSON.stringify(err, null, 2);
        ctx.status = 500;
    }

    await next();
});

export default inventoryRoutes;
