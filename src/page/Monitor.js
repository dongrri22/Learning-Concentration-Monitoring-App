import React from 'react';
import './Monitor.css';

  
const Monitor = () => {
    return (
        <div class="container mt-1">
            <div class="row">
                <div class="col-12 col-md-5 col-xl-5 align-top">
                    <div class="row mb-3">
                        <div class="col-md-5 col-6 form-control">
                            <label class="form-switch">
                                <input type="checkbox" id="webcam-switch"/>
                                <i></i>
                                Start Camera
                            </label>  
                            <button id="cameraFlip" class="btn d-none"></button>
                        </div> 
                        <div class="col-md-5 col-6 form-control">
                            <label class="form-switch disabled">
                                <input type="checkbox" disabled id="detection-switch"/>
                                <i></i>
                                Start Monitoring
                            </label>      
                        </div>             
                    </div>
                </div>
                <div class="col-12 col-md-10 col-xl-12 align-top" id="webcam-container">
                    <div class="loading d-none">
                        Loading Model
                        <div class="spinner-border" role="status">
                            <span class="sr-only"></span>
                        </div>
                    </div>
                    <div id="video-container">
                        <video id="webcam" autoplay muted playsinline></video>
                    </div>  
                    <div id="errorMsg" class="col-12 alert-danger d-none">
                        Fail to start camera. Please allow permission to access camera.
                    </div>
                </div>
            </div>
        </div>
    );
}

  export default Monitor;