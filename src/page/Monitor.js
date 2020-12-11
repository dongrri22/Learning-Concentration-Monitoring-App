import React, {Component, useEffect} from 'react';
import './Monitor.css';
import Axios from 'axios';
import Webcam from 'webcam-easy';
import $ from 'jquery';
import * as faceapi from 'face-api.js';
// const displayError=(err = '')=>{
//     if(err!=''){
//         document.getElementById("#errorMsg").html(err);
//     }
//     document.getElementById("#errorMsg").removeClass("d-none");
// };
// const toggleContrl = (id, show)=>{
//     if(show){
//       document.getElementById(id).prop('disabled', false);
//       document.getElementById(id).parent().removeClass('disabled');
//     }else{
//       document.getElementById(id).prop('checked', false).change();
//       document.getElementById(id).prop('disabled', true);
//       document.getElementById(id).parent().addClass('disabled');
//     }
// }



  
//   class ErrorMsg extends Component {
//       state = {
//         className : "col-12 alert-danger d-none"
//       }
//       addActiveClass(e){
          
//       }
//       render(){
//           return(
//                 <div id="errorMsg" className={this.state.className}>
//                     Fail to start camera. Please allow permission to access camera.
//                 </div>
//           )
//       }
//   }
// function displayError(err = ''){
//     if(err!=''){
//         document.getElementById("errorMsg").html(err);
//     }
//     document.getElementById("errorMsg").removeClass("d-none");
// }
/**/
//
const modelPath = 'models';
var webcam = {};
var displaySize;

function createCanvas(){
    const webcamElement = document.getElementById('webcam');
    if( document.getElementsByTagName("canvas").length == 0 )
    {
      var canvas = faceapi.createCanvasFromMedia(webcamElement)
      document.getElementById('webcam-container').append(canvas)
      faceapi.matchDimensions(canvas, displaySize)
    }
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

    //errorMsg에 d-none 클래스 추가
    //cameraFlip에 d-none 클래스 추가
    document.getElementById("errorMsg").className = "col-12 alert-danger d-none";
    document.getElementById("cameraFlip").className = "btn d-none";
}
class WebcamSwitch extends Component{
    constructor(props){
        super(props);
        this.state={
            //webcam:{}
        };
        this.onClick = this.onClick.bind(this);
    }
    onClick(event){
        if(event.target.checked){
            console.log("check!");
            event.target.checked = true;
            var webcamElement = document.getElementById('webcam');
            console.log(webcamElement);
            webcam = new Webcam(webcamElement, 'user');
            webcam.onloadedmetadata = function(e){
                displaySize = { width:this.scrollWidth, height: this.scrollHeight }
            }
            // this.setState({
            //     webcam : new Webcam(webcamElement, 'user')
            // });
            
            console.log("webcam created.");
            webcam.start()
            .then(result =>{
                cameraStarted();
                webcamElement.style.transform = "";
                // console.log("webcam started");
            })
            .catch(err => {
                //displayError();
            })    
        }
        else {
            console.log("uncheck!");
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
                faceapi.nets.ssdMobilenetv1.load(modelPath)
            ]).then(function(){
                createCanvas();
                console.log("done!");
                //startDetection();
            })
        }
    }
    render(){
        return(
            <input type="checkbox" disabled={this.state.disabled} onChange={this.onClick} id="detection-switch"/>
        )
    }
}



  
class Monitor extends Component{
    globals = {
        webcamElement : {},//document.getElementById('webcam'),
        webcam : {},//new Webcam(webcamElement, 'user'),
        currentStream : {},
        displaySize : {},
        convas : {},
        faceDetection : {}
    }
    
    // getObject = (wE, w) =>{
    //     this.setWebcamElement({ webcamElement : wE, webcam : new Webcam(webcamElement, 'user') }, () => {});

    // }
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
                            <canvas id="canvas" className="d-none" width='0' height='0'></canvas>
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


export default Monitor;

  

  