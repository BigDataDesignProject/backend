import * as Koa from 'koa';
import * as KoaCompose from 'koa-compose';

import config from './config';

const app = new Koa();

const getMiddleware = () => {
    return KoaCompose([

    ]);
};

const start = () => {
    app.use(getMiddleware());
    app.listen(config.port, () => {
        console.log(`Server listening on port: ${config.port}`);
    });
};

export default { start };
