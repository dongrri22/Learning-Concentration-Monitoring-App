import React, {Component} from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import Axios from 'axios';

var yawnTimes = [];
var afkTimes = [];


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
        var myData = [{time: "abc"
        }, {time: "bce"}];
        return (
            <div className="row" style={style_tableContainer}>
                <div className="col-6" style={style_yawnTableContainer}>
                    <h1>Yawn Table</h1>
                    <BootstrapTable 
                        data={yawnTimes}
                        key={"yawn"+yawnId}
                        style={style_yawnTable}
                        maxHeight={"700px"}
                    >
                        <TableHeaderColumn isKey dataField='time'>
                            Time
                        </TableHeaderColumn>
                    </BootstrapTable> 
                </div>
                <div className="col-6" style={style_afkTableContainer}>
                    <h1>AFK Table</h1>
                    <BootstrapTable data={afkTimes} key={"afk"+afkId} maxHeight={"700px"}>
                        <TableHeaderColumn isKey dataField='time' >
                            Time
                        </TableHeaderColumn>
                    </BootstrapTable> 
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
const style_row = { 
    backgroundColor: '#c8e6c9', 
    height: '3px', 
    padding: '5px 0' 
};
const style_tableContainer={
    paddingLeft: 40,
    paddingTop: 20,
    paddingRight: 40,
};
const style_yawnTableContainer={
    paddingRight:20,
};
const style_afkTableContainer={
    paddingLeft:20,
};
const style_yawnTable={
    paddingLeft: 50,
    margin : 50
}