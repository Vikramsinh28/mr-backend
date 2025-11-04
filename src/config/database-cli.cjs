require('dotenv').config();

module.exports = {
    development: {
        url: process.env.DATABASE_URL,
        dialect: 'postgres',
        dialectOptions: {
            ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('supabase.co') ? {
                require: true,
                rejectUnauthorized: false,
            } : false,
        },
        logging: false,
    },
    test: {
        url: process.env.DATABASE_URL,
        dialect: 'postgres',
        dialectOptions: {
            ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('supabase.co') ? {
                require: true,
                rejectUnauthorized: false,
            } : false,
        },
        logging: false,
    },
    production: {
        url: process.env.DATABASE_URL,
        dialect: 'postgres',
        dialectOptions: {
            ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('supabase.co') ? {
                require: true,
                rejectUnauthorized: false,
            } : false,
        },
        logging: false,
    }
};

