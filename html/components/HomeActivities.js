import React from "react"
import { Link } from 'react-router-dom'
// import ES6Promise from 'es6-promise'
// ES6Promise.polyfill() //关键代码,让ie识别promise对象!
import {injectIntl, intlShape, FormattedMessage } from 'react-intl'; /* react-intl imports */
import $ from 'jquery'

/**
 * HomeActivities components which displays:
 */
export default class HomeActivities extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activities:[],
        }
    }


    componentDidMount() {
        this.getActivities();
        this.activitiesInterval = setInterval(this.getActivities.bind(this),10000);
    }

   

    /**
     * 
     * Get the data for Activities part
     *  
     */
    getActivities() {
        var self = this;
        let activities = []
        $.ajax({
            url:"/api/instant_message/",
            type:"GET",
            dataType:"json",
            success: function(data){
                if(data.status == "success") {
                    let time = data.result.node_time * 1000;
                    let overview = {
                        type: "overview",
                        time: self.timestampToTime(time),
                        normal: data.result.normal_nodes.length,
                        offline: data.result.fault_nodes.length
                    }
                    // console.log("kiki",new Date().getTime(),data.result.node_time * 1000,time)
                    activities.push(overview);

                    let details = data.result.event;
                    for (let i = 0; i < details.length; i++){
                        let detail_time = details[i].time * 1000;
                        let detail = {
                                type: "detail",
                                time: self.timestampToTime(detail_time),
                                info: details[i].event,
                                group: details[i].group,
                            
                        }
                        activities.push(detail);
                    }
                    activities = activities.concat(self.state.activities);
                    if (activities.length > 20) {
                        activities = activities.slice(0,20);
                    }
                    // let arr1 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
                    // console.log('kikikiki',activities);
                    self.setState({
                        activities: activities,
                    })
                }
            }
        })
    }

    timestampToTime(timestamp) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '.';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
        var D = date.getDate() ;
        var h = date.getHours() + ':';
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0' + date.getSeconds()  : date.getSeconds()) + ' - ';
        return h+m+s+Y+M+D;
    }
    /**
     * When the component will unmount.
     * Clear the intervals 
     */
    componentWillUnmount() {
        if(this.activitiesInterval) {
            clearInterval(this.activitiesInterval);
        }
        this.setState = (state,callback)=>{
            return;
        };  
    }
    /**
     * Before a mounted component receives new props, reset some state.
     * @param {Object} nextProps new props
     */
    componentWillReceiveProps(nextProps) {
    }

    render() {
        return (
            <div className="activities">
                    <p className="main-title"><FormattedMessage id="termActivities"/></p>
                    <div className="transparent-bg"></div>
                    <div className="node-list">
                        {
                            this.state.activities && this.state.activities.map(function(item, index){
                                return (
                                    <section className="item clearfix" key={"item"+index}>
                                        <div className="left">
                                            <img src={require("../img/icon/activities/icon_activities_normal@2x.png")} />
                                            <p></p>
                                        </div>
                                        {
                                            item.type == "overview" && 
                                            <div className="right">
                                                <p className="line1">{item.time}</p>
                                                <p className="line2">{item.normal} Nodes Normal</p>
                                                <p className="line2">{item.offline} Nodes Offline</p>
                                                {/* <p className="line3">Ethereum</p> */}
                                            </div> 
                                        }
                                        {
                                            item.type == "detail" && 
                                            <div className="right">
                                                <p className="line1">{item.time}</p>
                                                <p className="line2">{item.info}</p>
                                                <p className="line3">
                                                    {item.group == 1 ?  "Ethereum" : (item.group == 0 ? "Trias": "Hyperledger")     
                                                        // 0 trias   1 eth    2 hyperledger 
                                                    }
                                                </p>
                                            </div> 
                                        }
                                       
                                    </section>
                                )
                            })
                        }
                    </div>
                    <Link to="/activities" className="view-all"><FormattedMessage id="btnViewAll"/></Link>
                </div>
        )
    }
}
