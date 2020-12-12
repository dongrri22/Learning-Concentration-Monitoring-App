const databaseCon = require(__dirname+'/databaseCon.js');




module.exports.writeYawnTime = async function(connection, dateString){
    const mysqlDate = toMysqlFormat(dateString);
    //yawnTime table 체크.
    await checkYawnTable(connection);

    // DB에 기록 시작.
    try{
        await connection.query('START TRANSACTION');
        await connection.query(`
            INSERT INTO yawn VALUES("${uuidgen()}", ${0}, "${mysqlDate}");
        `)
        await connection.query('COMMIT');
        console.log("insert yawn time successfully.")
    }catch(e){
        console.log('Database error(writeYawnTime). - '+e);
        await connection.query('ROLLBACK');
    }
    


    //connection.query('INSERT INTO yawn VALUES '+date.prototype.toMysqlFormat);
}
module.exports.writeAfkTime = async function(connection, dateString){
    const mysqlDate = toMysqlFormat(dateString);
    await checkAfkTable(connection);

    // DB에 기록 시작.
    try{
        await connection.query('START TRANSACTION');
        await connection.query(`
            INSERT INTO afk VALUES("${uuidgen()}", ${0}, "${mysqlDate}");
        `)
        await connection.query('COMMIT');
        console.log("insert afk time successfully.");
        
    }catch(e){
        console.log('Database error(writeAfkTime). - '+e);
        await connection.query('ROLLBACK');
    }
}

/*--------------------------------------------------------------*/
/*                     기본 DB 함수                              */
/*--------------------------------------------------------------*/

async function checkUserTable(connection){
    const sql_checkUser = `SELECT * FROM user`;
    try{
        //트랜잭션 시작.
        await connection.query('START TRANSACTION');
        const [results] = await connection.query(sql_checkUser);
        //user(0)가 DB에 있을 때 -> 추가 작업 없음.
        if(results.length != 0){
            console.log("user(userId: 0) exists in DB.");
        }
        //user(0)가 DB에 없을 때 -> user(0) isnert.
        else if(results.length == 0){
            process.stdout.write("user doesn't exist in DB... ");
            await connection.query(`INSERT INTO user VALUES("${uuidgen()}", 0)`);
            process.stdout.write("insert user(0) successfully.\n");
            
        }
        //트랜잭션 종료.
        await connection.query('COMMIT');

    } catch(e){
        //user table이 DB에 없을 때
        //-> 1. CREATE user table.
        //-> 2. INSERT user record.
        //-> 3. COMMIT.
        if(e.code === 'ER_NO_SUCH_TABLE'){
            process.stdout.write("user table isn't exist... ");
            await connection.query(
                `CREATE TABLE user (
                    uuid varchar(36) NOT NULL PRIMARY KEY,
                    userId integer(4) NOT NULL
                );
                INSERT INTO user(uuid, userId) VALUES("${uuidgen()}", 0);`
            );
            await connection.query('COMMIT');
            process.stdout.write("create user table successfully.\n");
            console.log("user doesn't exist in DB... insert user(0) successfully.")

        }
        else{
            console.error("Database error. - "+e);
            await connection.query('ROLLBACK');
        }
    }
}
async function checkYawnTable(connection){
    const sql_checkYawnTable = `SELECT * FROM yawn`;
    try{
        await connection.query(sql_checkYawnTable);

    } catch(e){
        //yawn table이 DB에 없을 때
        //-> 1. CREATE table.
        //-> 2. INSERT record.
        //-> 3. COMMIT.
        if(e.code === 'ER_NO_SUCH_TABLE'){
            await connection.query('START TRANSACTION');
            process.stdout.write("yawn table isn't exist... ");
            await connection.query(
                `CREATE TABLE yawn (
                    uuid varchar(36) NOT NULL PRIMARY KEY,
                    userId integer(4) NOT NULL,
                    time datetime NOT NULL
                );`
            );
            await connection.query('COMMIT');
            process.stdout.write("create yawn table successfully.\n");

        }
        else{
            console.error("Database error. - "+e);
        }
    }
}
async function checkAfkTable(connection){
    const sql_checkYawnTable = `SELECT * FROM afk`;
    try{
        await connection.query(sql_checkYawnTable);

    } catch(e){
        //afk table이 DB에 없을 때
        //-> 1. CREATE table.
        //-> 2. INSERT record.
        //-> 3. COMMIT.
        if(e.code === 'ER_NO_SUCH_TABLE'){
            await connection.query('START TRANSACTION');
            process.stdout.write("afk table isn't exist... ");
            await connection.query(
                `CREATE TABLE afk (
                    uuid varchar(36) NOT NULL PRIMARY KEY,
                    userId integer(4) NOT NULL,
                    time datetime NOT NULL
                );`
            );
            await connection.query('COMMIT');
            process.stdout.write("create afk table successfully.\n");

        }
        else{
            console.error("Database error. - "+e);
        }
    }
}
module.exports.connect = async function(){
    //db 설정
    var connection = databaseCon.init();
    await databaseCon.open(connection);
    await checkUserTable(connection);
    return connection;
    
};

module.exports.disconnect = async function(connection){
    await connection.end();
    console.log("mysql is disconnected.");
}



/*--------------------------------------------------------------*/
/*                     데이터 변환 함수                          */
/*--------------------------------------------------------------*/

function uuidgen() {
    function s4() { return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1); }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
function toMysqlFormat(dateString){
    var splitedDateString = dateString.split(/[ :]+/);
    var months = {Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,
        Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12};

    const date = new Date(splitedDateString[3]+"-"+
                            months[splitedDateString[1]]+"-"+
                            splitedDateString[2]+" "+
                            splitedDateString[4]+":"+
                            splitedDateString[5]+":"+
                            splitedDateString[6]+":"+
                            "UTC+0000"
                        );
    return date.getUTCFullYear() + '-' +
                ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
                ('00' + date.getUTCDate()).slice(-2) + ' ' + 
                ('00' + date.getUTCHours()).slice(-2) + ':' + 
                ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
                ('00' + date.getUTCSeconds()).slice(-2);
}