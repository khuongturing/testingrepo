const instances = {
    development: 1,
    staging: 2,
    production: 3
};

module.exports = {
    apps: [{
        name: 'turing-api',
        script: 'dist/index.js',

        // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
        instances: instances[process.env.NODE_ENV],
        watch: true,
        ignore_watch: ['node_modules'],
        autorestart: true,
        max_restarts: 1,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'development'
        },
        env_staging: {
            NODE_ENV: 'staging'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }],
};
