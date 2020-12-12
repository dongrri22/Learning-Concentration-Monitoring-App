import React, {Component, Fragment} from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Axios from 'axios';

var yawnTimes = [];
var afkTimes = [];

var chartYawnTime = [];

const getYawnPer30min = function (){
    //30분당 yawn횟수가 담긴 배열.
    //1. 전체 yawn을 읽어옴. -> 이미 전역변수 yawnTimes에 읽어온 상태!
    //2. 연,월,일을 today와 비교. 동일한 것만 뽑아서
    //3. 0시부터 24시까지 30분 간격으로 횟수를 뽑아 배열에 다시 저장.
    var intervalYawn = [];
    var today = new Date();
    for(var i=0; i<48; i++){
        intervalYawn[i] = 0;
    }
    for(var i=0; i<yawnTimes.length; i++){
        var splitedDateString = yawnTimes[i].time.split(/[-: ]/);
        if(today.getFullYear() == parseInt(splitedDateString[0])
            && (today.getMonth()+1) == parseInt(splitedDateString[1])
            && today.getDate() == parseInt(splitedDateString[2])){
                console.log(splitedDateString[3]+":"+splitedDateString[4]);
                //분으로 연산.
                var min = parseInt(splitedDateString[3])*60+parseInt(splitedDateString[4]);
                ++intervalYawn[Math.floor(min/30)];
        }
        console.log(intervalYawn);
    }
    //분으로 계산-> 시*60+분이 0~30분일때 0, 31~60분일 때 1, ...
    // /30 연산에서 몫이 0이면 0, 1이면 1

    
    return intervalYawn;
}
const getAfkPer30min = function (){
    //30분당 afk횟수가 담긴 배열.
    //1. 전체 afk을 읽어옴. -> 이미 전역변수 afkTimes에 읽어온 상태!
    //2. 연,월,일을 today와 비교. 동일한 것만 뽑아서
    //3. 0시부터 24시까지 30분 간격으로 횟수를 뽑아 배열에 다시 저장.
    var intervalAfk = [];
    var today = new Date();
    for(var i=0; i<48; i++){
        intervalAfk[i] = 0;
    }
    for(var i=0; i<afkTimes.length; i++){
        var splitedDateString = afkTimes[i].time.split(/[-: ]/);
        if(today.getFullYear() == parseInt(splitedDateString[0])
            && (today.getMonth()+1) == parseInt(splitedDateString[1])
            && today.getDate() == parseInt(splitedDateString[2])){
                console.log(splitedDateString[3]+":"+splitedDateString[4]);
                //분으로 연산.
                var min = parseInt(splitedDateString[3])*60+parseInt(splitedDateString[4]);
                ++intervalAfk[Math.floor(min/30)];
        }
        console.log(intervalAfk);
    }
    //분으로 계산-> 시*60+분이 0~30분일때 0, 31~60분일 때 1, ...
    // /30 연산에서 몫이 0이면 0, 1이면 1

    
    return intervalAfk;
}
class YawnHigh extends Component {
    render() {
        const series2 = this.props.data;    //App.js에서 데이터를 보내줄 예정
        const options = {
            chart: {
                type: 'line'		// bar차트. 아무 설정이 없으면 line chart가 된다.
            },
            title: {
                text: 'Yawn Monitoring result(Today)'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                type: 'category',
                tickInterval: 1,
                labels: {
                    enabled: true,
                    formatter: function() { 
                        if(this.value%2 == 0){
                            return Math.floor(this.value/2)+":00";
                        }
                        else{
                            return Math.floor(this.value/2)+":30";
                        }
                    }
                }
            },
            yAxis:{
                title: {
                    text : "Frequency"
                }
            },
            legend: {
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        format: "<b>{point.y}</b>"
                    }
                }
            },
            series: [{ name: "yawn per 30 minutes", data: series2 }]

        }
        return (
            <Fragment>
                <HighchartsReact containerProps={{ style: { height: "100%" } }} highcharts={Highcharts} options={options} />
            </Fragment>
        );
    }
}

class AfkHigh extends Component {
    render() {
        const series2 = this.props.data;    //App.js에서 데이터를 보내줄 예정
        const options = {
            chart: {
                type: 'line'		// bar차트. 아무 설정이 없으면 line chart가 된다.
            },
            title: {
                text: 'AFK Monitoring result(Today)'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                type: 'category',
                tickInterval: 1,
                labels: {
                    enabled: true,
                    formatter: function() { 
                        if(this.value%2 == 0){
                            return Math.floor(this.value/2)+":00";
                        }
                        else{
                            return Math.floor(this.value/2)+":30";
                        }
                    }
                }
            },
            yAxis:{
                title: {
                    text : "Frequency"
                }
            },
            legend: {
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        format: "<b>{point.y}</b>"
                    }
                }
            },
            series: [{ name: "AFK per 30 minutes", data: series2 }]

        }
        return (
            <Fragment>
                <HighchartsReact containerProps={{ style: { height: "100%" } }} highcharts={Highcharts} options={options} />
            </Fragment>
        );
    }
}
class Check extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            isYawnLoading:true, isAfkLoading:true, yawnId:[0], afkId:[0]
        };
        this.componentDidMount = this.componentDidMount(this);
    }
    componentDidMount(){
        Axios({
            method : 'post',
            url : '/',
            data : {
                tag : "ALL_YAWNTIME",
                userId : 0
            }
        })
        .then(res=>{
            if(res.data.tag == "ALL_YAWNTIME_RESPONSE"){
                /* for(var i=0; i<res.data.yawnTimes.length; i++){
                    console.log(res.data.yawnTimes[i]);
                    data = res.data.yawnTimes[i];
                } */
                var index = [];
                for(var i=0; i<res.data.yawnTimes.length; i++){
                    index[i] = i;
                    yawnTimes.push({time : toMysqlFormat(res.data.yawnTimes[i])})
                    // this.state.times.push({
                    //     time : res.data.yawnTimes[i]
                    // }) 
                }
                //console.log(newTimes);
                this.setState({isYawnLoading : false, yawnId : index});
                //console.log(this.state.times);
            }
        });
        Axios({
            method : 'post',
            url : '/',
            data : {
                tag : "ALL_AFKTIME",
                userId : 0
            }
        })
        .then(res=>{
            if(res.data.tag == "ALL_AFKTIME_RESPONSE"){
                var index = [];
                for(var i=0; i<res.data.afkTimes.length; i++){
                    index[i] = i;
                    afkTimes.push({time : toMysqlFormat(res.data.afkTimes[i])});
                }
                this.setState({isAfkLoading : false, afkId : index});
            }
        });


    }
    
    render(){
        const {isYawnLoading, isAfkLoading, yawnId, afkId} = this.state;
        
        if(isYawnLoading || isAfkLoading){
            return <div className="Check">Loading...</div>;
        }
        const yawnPer30min = getYawnPer30min();
        const afkPer30min = getAfkPer30min();
        return (
            <div className="row" style={style_tableContainer}>
                <div className="col-6" style={style_yawnTableContainer}>
                    <h2>Yawn Table</h2>
                    <BootstrapTable 
                        data={yawnTimes}
                        key={"yawn"+yawnId}
                        maxHeight={"700px"}
                    >
                        <TableHeaderColumn isKey dataField='time'>
                            Time
                        </TableHeaderColumn>
                    </BootstrapTable> 
                </div>
                <div className="col-6" style={style_afkTableContainer}>
                    <h2>AFK Table</h2>
                    <BootstrapTable data={afkTimes} key={"afk"+afkId} maxHeight={"700px"}>
                        <TableHeaderColumn isKey dataField='time' >
                            Time
                        </TableHeaderColumn>
                    </BootstrapTable> 
                </div>
                <div className="col-6" style={style_yawnChart}>
                    <YawnHigh style={style_yawnChart} data={yawnPer30min}></YawnHigh>
                </div>
                <div className="col-6" style={style_yawnChart}>
                    <AfkHigh style={style_afkChart} data={afkPer30min}></AfkHigh>
                </div>

                
            </div>
        )
    }
    
  }
  
export default Check;
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
function jsDateStringToInt(jsDateString){
    jsDateString = jsDateString+"";
    console.log(jsDateString)
    var splitedDateString = jsDateString.split(/[ :]+/);
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
    console.log(date);
    return {year: date.getUTCFullYear(), month: date.getUTCMonth()+1, day : date.getUTCDate(), hour : date.getUTCHours(), minute : date.getUTCMinutes(), second : date.getUTCSeconds()};
}

const style_yawnChart = {
    paddingTop: 50,
    height : 500
}
const style_afkChart = {
    paddingTop : 50,
    height : 500
}
const style_tableContainer={
    paddingLeft: 40,
    paddingTop: 20,
    paddingRight: 40
};
const style_yawnTableContainer={
    paddingRight:20,
    paddingBottom:50
};
const style_afkTableContainer={
    paddingLeft:20,
    paddingBottom:50
};