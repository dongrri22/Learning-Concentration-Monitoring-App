/*var express = require('express');
var app = express();

var indexRouter = require('./routes/index');
app.use(indexRouter);

var usersRouter = require('./routes/users');
app.use('/users',usersRouter);

// portnumber를 3002로 지정
const port = 3002;

// 3002번 포트넘버를 가진 서버 생성
app.listen(port, () => console.log(`listening on port ${port}!`));
*/

const path = require('path');
const express = require('express');
const database = require(__dirname+'/db/database.js');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use('/db', express.static(path.join(__dirname, 'db')));
app.use('/', express.static(__dirname));

app.post('/', async (req, res)=>{
  let tag = req.body.tag;
  let userId = parseInt(req.body.userId, 16);
  let data = req.body.data+"";
  console.log("userId : "+userId+" || tag : "+tag+ " || data : "+data);

  if(tag=='yawnTime'){
    //db에 저장하는 코드
    var connection = await database.connect();
    await database.writeYawnTime(connection, data);
    await database.disconnect(connection);
  }
  else if(tag=='afkTime'){
    var connection = await database.connect();
    await database.writeAfkTime(connection, data);
    await database.disconnect(connection);
  }
  res.send('POST');
})
app.listen(3001);
