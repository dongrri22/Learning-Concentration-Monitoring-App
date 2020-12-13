import React, { Component} from 'react';
import './Main.css'

class Main extends Component {
    render(){
        return (
            <div className="content">
                <div className="title">이제는 스스로 점검하고 관리하자
                    <h3>당신의 학습 집중도를 모니터링 해보세요!</h3>
                </div>
                <div className="content">
                    <h4><b>학습 집중도, 어떤 방법으로 모니터링 되나요?</b></h4>
                    <p>모니터링을 시작하면 학습 집중도와 관련이 있는 눈 깜빡임, 하품, 자리비움 빈도수와 시간에 대한
                        정보를 실시간으로 분석합니다. 측정이 완료되면 결과값을 그래프로 보여줍니다.</p>
                </div>
                <div className="content">
                    <h2>Monitor</h2>
                    <p>실시간으로 전송되는 영상을 바탕으로 당신의 학습 집중도를 분석합니다. 만약 모니터링 중에 학습 집중도가 낮다고 판단되는
                         특정 행위의 빈도 수나 시간이 증가하면 당신에게 주의를 권고 하거나 휴식을 권고해 줍니다.</p>
                </div>
                <div className="content">
                    <h2>Check</h2>
                    <p>측정이 완료된 모니터링 결과 데이터들을 확인할 수 있습니다. 결과를 확인하고 비교해 보세요. 
                        스스로 자신의 학습 집중도를 점검해 볼 수 있습니다.</p>
                </div>
            </div>
        );
    }
}
  
  export default Main;