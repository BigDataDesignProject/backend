import * as Router from 'koa-router';

import Sales from '../models/sales';

const asyncBusboy = require('async-busboy');

const salesRoutes = new Router({ prefix: '/sales' });

salesRoutes.post('/', async (ctx, next) => {
    const { files, fields } = await asyncBusboy(ctx.req);
    try {
        await Sales.upload(files[0].path);
        ctx.status = 200;
    } catch (err) {
        console.error(err);
        ctx.body = JSON.stringify(err, null, 2);
        ctx.status = 500;
    }

    await next();
});

export default salesRoutes;
