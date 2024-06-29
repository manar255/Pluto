require('dotenv').config();

module.exports ={
    development:{
        username: process.env.database_user,
        password: process.env.database_password,
        database: process.env.database_name,
        host: process.env.database_host,
        port: process.env.database_port,
        dialect: process.env.DIALECT,
        
    },
    production:{
        username: process.env.database_user,
        password: process.env.database_password,

        database: process.env.database_name,

        host: process.env.database_host,
        port: process.env.database_port,
        dialect: process.env.DIALECT,
        logging:true
    }
}
