const sql = require('mssql');

const dbConfig = {
    user: '', // deixa vazio se usar Windows Auth
    password: '',
    server: 'localhost\\SQLEXPRESS', // ⚠️ MUITO IMPORTANTE
    database: 'CafeSaaS',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};
