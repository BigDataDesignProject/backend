import * as Koa from 'koa';
import * as KoaCompose from 'koa-compose';

import config from './config';
import salesRoutes from './routes/sales';

const app = new Koa();

const getMiddleware = () => {
    return KoaCompose([
        salesRoutes.routes(),
        salesRoutes.allowedMethods(),
    ]);
};

const start = () => {
    app.use(getMiddleware());
    app.listen(config.port, () => {
        console.log(`Server listening on port: ${config.port}`);
    });
};

export default { start };
