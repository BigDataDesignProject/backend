import * as Koa from 'koa';
import * as KoaCompose from 'koa-compose';
import * as koaLogger from 'koa-logger';

import config from './config';
import inventoryRoutes from './routes/inventory';
import salesRoutes from './routes/sales';

const app = new Koa();

const middleware =  KoaCompose([
    koaLogger(),
    salesRoutes.routes(),
    salesRoutes.allowedMethods(),
    inventoryRoutes.routes(),
    inventoryRoutes.allowedMethods(),
]);


const start = () => {
    app.use(middleware);
    app.listen(config.port, () => {
        console.log(`Server listening on port: ${config.port}`);
    });
};

export default { start };
