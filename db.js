const mysql = require('mysql2/promise')
const config = require('./config')

module.exports = {
    query: async function(sql, varible = null){
        var db = await mysql.createConnection({
            host     : config.db.host,
            user     : config.db.user,
            password : config.db.pass,
            database : config.db.name
        });
    
        const [res, fields] = await db.execute(sql, varible);
        db.end;
        return res;
    }
}