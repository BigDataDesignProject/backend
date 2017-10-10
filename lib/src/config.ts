const env = process.env.NODE_ENV || 'dev';

const config = {
    name: 'backend',
    port: process.env.port || 40404,
    env: env,
    URLs: {
        elasticsearch: env === 'dev' ? 'localhost:9200' : '',
    },
};

export default config;
