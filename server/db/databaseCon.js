var mysql = require('mysql2/promise');
var config = require(__dirname+'/databaseInfo.js').local;

module.exports.init = function() {
    return mysql.createPool({
        host : config.host,
        port : config.port,
        user : config.user,
        password : config.password,
        database : config.database,
        multipleStatements: true
    })
};
module.exports.open = async function (con){
    try{
        await con.getConnection(async conn=> conn);
        console.info('mysql is connected successfully.');
    } catch(e){
        console.err('mysql connection error : '+err);
    }
};

// var connection = mysql.createConnection({
//     host        :   'localhost',
//     user        :   'root',
//     password    :   '12551255',
//     database    :   'monitoring'
// });

// connection.connect();
// connection.query('SELECT 1+1 AS solution', function(err, rows, fields) {
//     if (err) throw err;

//     console.log('The solution is : ', rows[0].solution);
// })
// connection.end();
