
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
    if(tag=='yawnTime'){
        //db에 저장하는 코드
        let userId = parseInt(req.body.userId);
        let data = req.body.data+"";
        console.log("userId : "+userId+" || tag : "+tag+ " || data : "+data);
        var connection = await database.connect();
        await database.writeYawnTime(connection, data);
        await database.disconnect(connection);
        res.send('POST');
    }
    else if(tag=='afkTime'){
        let userId = parseInt(req.body.userId);
        let data = req.body.data+"";
        console.log("userId : "+userId+" || tag : "+tag+ " || data : "+data);
        var connection = await database.connect();
        await database.writeAfkTime(connection, data);
        await database.disconnect(connection);
        res.send('POST');
    }
    else if(tag=="YI"){
        let userId = parseInt(req.body.userId);
        var connection = await database.connect();
        let yawnTimes = await database.readYawnTime(connection, 4);
        await database.disconnect(connection);
        let yi = calculateYi(yawnTimes);
        res.send({tag:'YI_RESPONSE', yi : yi});
    }
    else if(tag=="AI"){
        let userId = parseInt(req.body.userId);
        var connection = await database.connect();
        let afkTime = await database.readAfkTime(connection, 1);
        await database.disconnect(connection);
        res.send({tag:'AI_RESPONSE', recentAfkTime : afkTime[0].time+""});
    }
    else if(tag == "ALL_YAWNTIME"){
        let userId = parseInt(req.body.userId);
        var connection = await database.connect();
        let allYawnTimes = await database.readYawnTime(connection, 0);
        await database.disconnect(connection);
        var yawnTimes = [];
        for(var i=0; i<allYawnTimes.length; i++){
            yawnTimes[i] = allYawnTimes[i].time+"";
        }
        res.send({tag:"ALL_YAWNTIME_RESPONSE", yawnTimes : yawnTimes});
    }
    else if(tag == "ALL_AFKTIME"){
        let userId = parseInt(req.body.userId);
        var connection = await database.connect();
        let allAfkTimes = await database.readAfkTime(connection, 0);
        await database.disconnect(connection);
        var afkTimes = [];
        for(var i=0; i<allAfkTimes.length; i++){
            afkTimes[i] = allAfkTimes[i].time+"";
        }
        res.send({tag:"ALL_AFKTIME_RESPONSE", afkTimes : afkTimes});
    }

})
app.listen(3001);

function calculateYi(yawnTimes){
    var timestamp = [];
    var interval = yawnTimes[0].time - yawnTimes[3].time;
    console.log(interval);
    const sec = interval/1000/4;
    console.log("yi : "+sec);
    return sec;
  
  
  
}
