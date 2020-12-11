import React, {Component} from 'react';
import './Monitor.css';
import Axios from 'axios';
import Webcam from 'webcam-easy';

const MODEL_URL = '/models'
// webcam.onloadedmetadata = () => {
//     this.displaySize = { width:this.scrollWidth, height: this.scrollHeight }
// };
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
// const cameraStarted = ()=>{
//     toggleContrl("detection-switch", true);
//     document.getElementById('errorMsg').addClass("d-none");
//     if( webcamGlobal.webcamList.length > 1){
//         document.getElementById('#cameraFlip').removeClass('d-none');
//     }
// };
// function cameraStopped(){
//     toggleContrl("detection-switch", false);
//     document.getElementById("#errorMsg").addClass("d-none");
//    document.getElementById("#cameraFlip").addClass('d-none');
// }
// function toggleContrl(id, show){
//     if(show){
//         document.getElementById(id).prop('disabled', false);
//         document.getElementById(id).parent().removeClass('disabled');
//     }else{
//         document.getElementById(id).prop('checked', false).change();
//         document.getElementById(id).prop('disabled', true);
//         document.getElementById(id).parent().addClass('disabled');
//     }
//   }
  
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

class WebcamSwitch extends Component{
    constructor(props){
        super(props);
    }
    state={
        webcam : {}
    }
    onClick(event){
        if(event.target.checked){
            console.log("check!");
            event.target.checked = true;
            var webcamElement = document.getElementById('webcam')
            this.webcam = new Webcam(webcamElement, 'user');
            this.webcam.onloadedmetadata = function(e){
                this.displaySize = { width:this.scrollWidth, height: this.scrollHeight }
            }
            console.log("webcam created.");
            this.webcam.start()
            .then(result =>{
                //cameraStarted();
                // webcamElement.style.transform = "";
                // console.log("webcam started");
            })
            .catch(err => {
                //displayError();
            })    
        }
        else {
            console.log("uncheck!");
            event.target.checked = false;     
            // cameraStopped();
            // webcam.stop();
            // console.log("webcam stopped");
        }
    }
    render(){
        return(
            <input type="checkbox" id="webcam-switch" onChange={this.onClick}/>
        )
    }
}
class Monitor extends Component{
    constructor(props){
        super(props);
        this.state = {
            webcamGlobal : {}
        }
    }
    getObject = (res) =>{
        this.setState({ webcamGlobal : res }, () => {});
    }
    render(){
        return (
            <div className="container mt-1">
                <div className="row">
                    <div className="col-12 col-md-10 col-xl-10 align-top">
                        <div className="row mb-3">
                            <div className="col-md-5 col-6 form-control">
                                <label className="form-switch">
                                    <WebcamSwitch webcam={this.webcamGlobal}/>
                                    <i></i>
                                    Start Camera
                                </label>  
                                <button id="cameraFlip" className="btn d-none"></button>
                            </div> 
                            <div className="col-md-5 col-6 form-control">
                                <label className="form-switch disabled">
                                    <input type="checkbox" disabled id="detection-switch"/>
                                    <i></i>
                                    Start Monitoring
                                </label>      
                            </div>             
                        </div>
                    </div>
                    <div className="col-12 col-md-10 col-xl-12 align-top" id="webcam-container">
                        <div className="loading d-none">
                            Loading Model
                            <div className="spinner-border" role="status">
                                <span className="sr-only"></span>
                            </div>
                        </div>
                        <div id="video-container">
                            <video id="webcam" autoPlay muted playsInline></video>
                            <canvas id="canvas" className="d-none" width='0' height='0'></canvas>
                        </div>  
                        
                    </div>
                </div>
            </div>
        );
    }
}


export default Monitor;

  

  