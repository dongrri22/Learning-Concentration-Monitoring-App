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

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const express = require('express');
const database = require(__dirname+'/db/database.js');
var querystring = require('querystring');
var app = express();
var bodyParser = require('body-parser');
var axios = require('axios');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use('/db', express.static(path.join(__dirname, 'db')));
app.use('/style', express.static(path.join(__dirname, 'style')));
app.use('/', express.static(__dirname));
app.get('/', (req, res) => {
  
  //res.end(fs.readFileSync(path.join(__dirname, '/face-detection.html')));
  res.sendFile(path.join(__dirname, '../public/index.html'));
  
  // req.on('end', function(){
  //   var parsedQuery = querystring.parse(postdata);
  //   res.writeHead(200, {'Content-Type':'text/html'});
  //   //res.end('result : '+result);
  //   console.log(parsedQuery);
  //   res.end();
  // })
});

app.post('/', (req, res)=>{
  let tag = req.body.tag;
  let userId = parseInt(req.body.userId, 16);
  let data = req.body.data;
  console.log("server : "+tag+" | "+userId+ " | "+data);
  console.log(req.body);

  if(tag=='yawnTime'){
    //db에 저장하는 코드
    console.log("db에 저장.");
  }
  res.send('POST');
})

app.listen(3001, ()=>{
 
});
var connection = database.connect();

// http.createServer((request, response) => {
//   const path = url.parse(request.url, true).pathname; // url에서 path 추출
//   if (request.method === 'GET') { // GET 요청이면
//     if (path === '/about') { // 주소가 /about이면
//       response.writeHead(200,{'Content-Type':'text/html'}); // header 설정
//       fs.readFile(__dirname + '/about.html', (err, data) => { // 파일 읽는 메소드
//         if (err) {
//           return console.error(err); // 에러 발생시 에러 기록하고 종료
//         }
//         response.end(data, 'utf-8'); // 브라우저로 전송
//       });
//     } else if (path === '/') { // 주소가 /이면
//       response.writeHead(200,{'Content-Type':'text/html'});
//       fs.readFile(__dirname + '/index.html', (err, data) => {
//         if (err) {
//           return console.error(err);
//         }
//         response.end(data, 'utf-8');
//       });
//     } else { // 매칭되는 주소가 없으면
//       response.statusCode = 404; // 404 상태 코드
//       response.end('주소가 없습니다');
//     }
//   }
// }).listen(3000);