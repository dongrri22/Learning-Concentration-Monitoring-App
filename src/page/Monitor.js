import React, {Component} from 'react';
import './Monitor.css';
import Axios from 'axios';
import Webcam from 'webcam-easy';
import * as faceapi from 'face-api.js';


/* -------------------------------------------------------*/
/*                        js code                         */
/*--------------------------------------------------------*/
const modelPath = 'models';
var webcam = {};
var displaySize = {
    height : {},
    width : {}
};
var faceDetection;
var canvas;

function checkYawnInterval(){
    Axios({
        method : 'post',
        url : '/',
        data : {
            tag : "YI",
            userId : 0
        }
    })
    .then(function(res){
        if(res.data.tag == "YI_RESPONSE"){
            console.log(res.data.yi);
            if(res.data.yi <= 120){
                //화면에 경고창 띄우기
                alert("you yawned too frequently!")
            }
        }
    })
    .catch(function(err){

    });
}
function checkAfkInterval(){
    Axios({
        method : 'post',
        url : '/',
        data : {
            tag : "AI",
            userId : 0
        }
    })
    .then(function(res){
        if(res.data.tag == "AI_RESPONSE"){
            //가장 가까운 afkTime 하나를 받아옴.
            console.log("..."+res.data.recentAfkTime);
            //최근 5분 내에 자리를 비운 적이 있을 경우 경고.
            var splitedDateString = res.data.recentAfkTime.split(/[ :]+/);
            var months = {Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,
                Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12};

            const date = new Date(splitedDateString[3]+"-"+
                                    months[splitedDateString[1]]+"-"+
                                    splitedDateString[2]+" "+
                                    splitedDateString[4]+":"+
                                    splitedDateString[5]+":"+
                                    splitedDateString[6]+":"+
                                    "UTC+0900"
                                )
                                
            var today = new Date();
            console.log(today-date);
            if((today-date)/1000/60 <= 5){
                //화면에 경고창 띄우기
                
                alert("you afked too frequently!")
            }
        }
    })
    .catch(function(err){

    });
}
function sendData(tag, data){
    Axios({
        method : 'post',
        url : '/',
        data : {
            tag : tag,
            data : data,
            userId : '0x0000'
        }
    })
    .then(function(res){
        console.log('sent data to DB successfully.')
    })
    .catch(function(err){
        console.error('sending data to DB failed.')
    });
}
//20회 중 연속된 10회의 감지 안에서 하품이 7회 이상일 경우 => 10개 구간의 평균이 0.7 이상일 경우, true를 리턴.
function isRealYawned(queue){
    var dend = 0;
    var dsor = 10;
    for(var i=0; i<queue.store.length-10; i++){
      dend=0;
      for(var j=10+i-1; j>=i; j--){
        if(queue.get(j).flag){
          dend += 1
        }
      }
      if(dend/dsor >= 0.7){
        return true;
      }
    }
    return false;
}

function isRealAfk(queue){
    var dend = 0;
    var dsor = 50;
    for(var i=0; i<50; i++){
        if(queue.get(i).flag){
            dend += 1;
        }
    }
    if(dend/dsor >= 0.9){
        return true;
    }
    return false;
        
}
function startDetection(){
    var yawnQueue = new Queue(20); //4초
    var yawnPeriodStarted = false;
    var afkQueue = new Queue(50);   //10초
    var afkPeriodStarted = false;
    faceDetection = setInterval(async () => {
        var isAfk = false;
        var webcamElement = document.getElementById('webcam');
        displaySize = {
            height : webcamElement.scrollHeight,
            width : webcamElement.scrollWidth
        }
        const detections = await faceapi.detectAllFaces(
            webcamElement, 
            new faceapi.SsdMobilenetv1Options({
                minConfidence : 0.5, maxResult: 1
            })
        ).withFaceLandmarks(false);
        
        /* landmark 위치가 어긋나는 문제 */
        /* 해결. displaySize를 video height, width와 맞춰주고
        canvas를 displaySize에 맞추고 landmark 그림 */
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        canvas.width = displaySize.width;
        canvas.height = displaySize.height;
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        try{
            var mouth_ratio = (resizedDetections[0].landmarks._positions[66].y-resizedDetections[0].landmarks._positions[62].y)/(resizedDetections[0].landmarks._positions[54].x-resizedDetections[0].landmarks._positions[48].x);
            var betweenLeftEndAndNose = (resizedDetections[0].landmarks._positions[30].x-resizedDetections[0].landmarks._positions[2].x);
            var betweenRightEndAndNose = (resizedDetections[0].landmarks._positions[14].x-resizedDetections[0].landmarks._positions[30].x);

            //주기가 시작된 상태면 (1)현재 시각을 큐에 집어넣고 (2)큐가 꽉 찼을 때 체크 후 (3) 큐를 비움.
            let isDetected = ((betweenLeftEndAndNose*2<betweenRightEndAndNose)&&(mouth_ratio > 0.4)) //왼쪽 yawned
            ||((betweenRightEndAndNose*2<betweenLeftEndAndNose)&&(mouth_ratio > 0.4)) //오른쪽 yawned
            ||((betweenLeftEndAndNose*2>=betweenRightEndAndNose)&&(betweenRightEndAndNose*2>=betweenLeftEndAndNose)&&(mouth_ratio > 0.6));
            //주기가 시작되지 않았을 때+감지됨 => 주기 시작하고 큐에 저장.
            if(!yawnPeriodStarted && isDetected){
                yawnQueue.enqueue(new DetectedData(true, new Date()));
                yawnPeriodStarted = true;
            }
            //주기가 시작됨+감지됨+큐가 꽉 차지 않음. => 큐에 저장.
            else if(yawnPeriodStarted && yawnQueue.store.length < yawnQueue.size){
                yawnQueue.enqueue(new DetectedData(isDetected, new Date()));
            }
            //큐가 꽉 참.
            else if(yawnQueue.store.length >= yawnQueue.size){
                if(isRealYawned(yawnQueue)){
                    //최초 시각 전송.
                    var yawnTime = yawnQueue.dequeue().time;
                    let tag = 'yawnTime';
                    sendData(tag, yawnTime+"");
                    checkYawnInterval();
                    ///////////////////////////////////////
                    // db 읽어와서 경고 전송할지 판단       //
                    // -> 최근 4회의 yawn 데이터를 읽어와 하품 간격으로 계산한 후 120초 이하일 경우 Rest Advising module 호출
                    // -> Rest Advising module은 화면에 휴식 권고 메시지 팝업
                    ////////////////////////////////////////
                }
                yawnQueue = new Queue(20);
                yawnPeriodStarted = false;
            }
        } catch(e){
            isAfk = true;
            
        }
        //주기가 시작되지 않았을 때+자리비움 => 주기 시작하고 큐에 저장.
        if(!afkPeriodStarted && isAfk){
            afkQueue.enqueue(new DetectedData(true, new Date()));
            afkPeriodStarted = true;
        }
        //주기가 시작됨+감지됨+큐가 꽉 차지 않음. => 큐에 저장.
        else if(afkPeriodStarted && afkQueue.store.length < afkQueue.size){
            afkQueue.enqueue(new DetectedData(isAfk, new Date()));
        }
        //큐가 꽉 참.
        else if(afkQueue.store.length >= afkQueue.size){
            if(isRealAfk(afkQueue)){
                //최초 시각 전송.
                var afkTime = afkQueue.dequeue().time;
                let tag = 'afkTime';
                sendData(tag, afkTime+"");
                console.log("afked!");
                
                checkAfkInterval();
            }
            afkQueue = new Queue(50);
            afkPeriodStarted = false;
        }
    }, 200);
}
function createCanvas(){
    const webcamElement = document.getElementById('webcam');
    canvas = faceapi.createCanvasFromMedia(webcamElement)
    document.getElementById('webcam-container').append(canvas);
    faceapi.matchDimensions(canvas, displaySize);
    
  }
function cameraStarted(){
    //detection-switch의 disabled를 false로
    //detection-switch를 감싼 label에서 disabled class를 제거
    document.getElementById('detection-switch').disabled = false;
    document.getElementById('detectingSwitchLabel').className = 'form-switch';
    
    //errorMsg에 d-none 클래스 붙이기
    //cameraFlip에서 d-none class를 제거
    document.getElementById('errorMsg').className="col-12 alert-danger d-none";
    if( webcam.webcamList.length > 1){
        document.getElementById('cameraFlip').className = 'btn';
    }
};
function cameraStopped(){
    //detection-switch의 disabled를 true로
    //detection-switch의 checked를 false로
    //detection-switch를 감싼 label에 disabled class를 추가.
    document.getElementById('detection-switch').disabled = true;
    document.getElementById('detection-switch').checked= false;
    document.getElementById('detectingSwitchLabel').className = "form-switch disabled";
    clearInterval(faceDetection);

    //errorMsg에 d-none 클래스 추가
    //cameraFlip에 d-none 클래스 추가
    document.getElementById("errorMsg").className = "col-12 alert-danger d-none";
    document.getElementById("cameraFlip").className = "btn d-none";
}

const displayError=(err = '')=>{
    if(err!==''){
        document.getElementById("errorMsg").html(err);
    }
    //errorMsg에서 d-none class를 제거.
    document.getElementById("errorMsg").className = "col-12 alert-danger";
};

/* -------------------------------------------------------*/
/*                 custom component                       */
/*--------------------------------------------------------*/
class WebcamSwitch extends Component{
    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    onClick(event){
        if(event.target.checked){
            console.log("camera on!");
            event.target.checked = true;
            var webcamElement = document.getElementById('webcam');
            
            webcam = new Webcam(webcamElement, 'user');

        
            console.log("webcam created.");
            webcam.start()
            .then(result =>{
                cameraStarted();
                webcamElement.style.transform = "";
            })
            .catch(err => {
                displayError();
            })    
        }
        else {
            console.log("camera off");
            event.target.checked = false;     
            cameraStopped();
            webcam.stop();
            console.log("webcam stopped");
        }
    }
    render(){
        return(
            <input type="checkbox" id="webcam-switch" onChange={this.onClick}/>
        )
    }
}
class DetectingSwitch extends Component{
    constructor(props){
        super(props);
        this.state={
            disabled : true
        }
        this.toggle = this.toggle.bind(this);
    }
    toggle(){
        this.setState({
            disabled : !this.state.disabled
        })
    }
    onClick(event){
        if(event.target.checked){
            //loadingDetection의 class에서 d-none을 제거
            document.getElementById('loadingDetection').className = "loading"
            Promise.all([
                faceapi.nets.ssdMobilenetv1.load(modelPath),
                faceapi.nets.faceLandmark68Net.load(modelPath)
            ]).then(function(){
                console.log('loaded model successfully.')
                document.getElementById('loadingDetection').className = "loading d-none";
                createCanvas();
                startDetection();
            })
        }
        else{
            //얼굴인식 정지
            clearInterval(faceDetection);
            if(typeof canvas !== "undefined"){
                setTimeout(function() {
                  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
                }, 1000);
              }
        }
    }
    render(){
        return(
            <input type="checkbox" disabled={this.state.disabled} onChange={this.onClick} id="detection-switch"/>
        )
    }
}


/* -------------------------------------------------------*/
/*                main export component                   */
/*--------------------------------------------------------*/
class Monitor extends Component{
    globals = {
        webcamElement : {},//document.getElementById('webcam'),
        webcam : {},//new Webcam(webcamElement, 'user'),
        currentStream : {},
        displaySize : {},
        convas : {},
        faceDetection : {}
    }
    render(){
        return (
            <div className="container mt-1">
                <div className="row">
                    <div className="col-12 col-md-10 col-xl-10 align-top">
                        <div className="row mb-3">
                            <div className="col-md-5 col-6 form-control">
                                <label className="form-switch">
                                    <WebcamSwitch/>
                                    <i></i>
                                    Start Camera
                                </label>  
                                <button id="cameraFlip" className="btn d-none"></button>
                            </div> 
                            <div className="col-md-5 col-6 form-control">
                                <label id='detectingSwitchLabel' className="form-switch disabled">
                                <DetectingSwitch/>
                                <i></i>
                                Start Monitoring
                                </label>      
                            </div>             
                        </div>
                    </div>
                    <div className="col-12 col-md-10 col-xl-10 align-top" id="webcam-container">
                        <div id="loadingDetection" className="loading d-none">
                            Loading Model
                            <div className="spinner-border" role="status">
                                <span className="sr-only"></span>
                            </div>
                        </div>
                        <div id="video-container">
                            <video id="webcam" autoPlay muted playsInline></video>
                        </div>  
                        <div id="errorMsg" className="col-12 alert-danger d-none">
                        Fail to start camera. Please allow permission to access camera.
                         </div>
                    </div>
                </div>
                <script src='face-detection.js'></script>
            </div>
            
        );
    }
}

/* -------------------------------------------------------*/
/*                        자료 구조                        */
/*--------------------------------------------------------*/
class Queue {
    constructor(size){
      this.store = [];
      this.size = size;
    }
    enqueue(item){
      this.store.push(item);
      if(this.store.length > this.size){
        return false;
      }
      console.log("현재 store : "+this.store.length+"/"+this.size);
      return true;
    }
    dequeue(){
      return this.store.shift();
    }
    get(i){
      return this.store[i];
    }
}
  class DetectedData{
    constructor(flag, time){
      this.flag = flag;
      this.time = time;
    }
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
export default Monitor;

  

  