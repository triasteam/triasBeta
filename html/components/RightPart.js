import React from "react"
import { Link } from 'react-router-dom'
// import ES6Promise from 'es6-promise'
// ES6Promise.polyfill() //关键代码,让ie识别promise对象!
import {injectIntl, intlShape, FormattedMessage } from 'react-intl'; /* react-intl imports */
import $ from 'jquery'
import HomeActivities from './HomeActivities'
import Timer from './common/Timer'
import GenerateTransaction from './GenerateTransaction'

/**
 * RightPart components which displays:
 */
export default class RightPart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            CPU: "",
            GPU: "",
            Motherboard: "",
            RAM: "",
            SSD: "",
            time:"0",
            currentInfo: {
                selectedEvent: {  
                    name: "",
                    time: "",
                    group: 0,
                },
                all_nodes_num: 0,  
                fault_nodes_num: 0,  
                current_index: -1, 
            },
            date: ''
        }
    }

    componentDidMount() {
        this.getSpecifications();

        // console.log('rrrrrr',this.props.currentEventIndex)
        this.setState({
            currentInfo: this.props.currentInfo
        })
    }
 

    /**
     * 
     * Get the data for Hardware Specifications part
     *  
     */
    getSpecifications() {
        var self = this;
        $.ajax({
            url:"/api/hardware_specifications/",
            type:"GET",
            dataType:"json",
            success: function(data){
                if(data.status == "success") {
                    // console.log("kiki",data)
                    self.setState({
                        CPU: data.result.CPU,
                        GPU: data.result.GPU,
                        Motherboard: data.result.Motherboard,
                        RAM: data.result.RAM,
                        SSD: data.result.SSD,
                    })
                }
            }
        })
    }
    
    /**
     * Before a mounted component receives new props, reset some state.
     * @param {Object} nextProps new props
     */
    componentWillReceiveProps(nextProps) {
        // console.log('rrrrr',this.props.currentInfo,nextProps.currentInfo)
        if (JSON.stringify(nextProps.currentInfo) != JSON.stringify(this.props.currentInfo)) {
            this.setState({
                currentInfo: nextProps.currentInfo
            })
        }
    }

    render() {
        let text = ' ';
       
        return (
            <div className="right-part">
                <div className="simulations">
                    <p className="main-title"><FormattedMessage id="titleSimulations"/></p>
                    <div className="sim-data">
                        <p className="clearfix">
                            <span className="attr"><FormattedMessage id="simuLable1"/></span>
                            <span className="value">
                                {  this.state.currentInfo.selectedEvent.name }
                            </span>
                        </p>
                        {
                                this.state.currentEventIndex !== -1 &&
                                <p className="clearfix">
                                    <span className="attr"><FormattedMessage id="simuLable2"/></span>
                                    <span className="value time">
                                        {  this.state.currentInfo == -1 ? 0 : this.state.currentInfo.selectedEvent.time  ? <Timer interval={this.state.currentInfo.selectedEvent.time} TimeChange={'add'} /> : '00:00:00'}
                                    </span>
                                </p>
                        }
                        {
                                this.state.currentEventIndex == -1 &&
                                <p className="clearfix">
                                    <span className="attr"><FormattedMessage id="simuLable2"/></span>
                                    <span className="value time">
                                        00:00:00
                                    </span>
                                </p>
                        }
                        <p className="clearfix">
                            <span className="attr"><FormattedMessage id="simuLable3"/></span>
                            <span className="value">
                                { this.state.currentInfo.selectedEvent.group }
                            </span>
                        </p>
                    </div>
                    <p className="index">
                    { this.state.currentInfo.current_index == -1 ? 0 : 1}{text}
                     ({ this.state.currentInfo.all_nodes_num == 0 ? '0%' : (1/this.state.currentInfo.all_nodes_num).toFixed(2) * 100 + '%'})</p>
                    <p className="note percent-note"><FormattedMessage id="simuLable4"/></p>
                    <p className="index">{ this.state.currentInfo.current_index == -1 || !this.state.currentInfo.fault_nodes_num ? 0 : this.state.currentInfo.fault_nodes_num}{text}
                    ({ this.state.currentInfo.all_nodes_num == 0 || !this.state.currentInfo.fault_nodes_num  ? '0%' : (this.state.currentInfo.fault_nodes_num/this.state.currentInfo.all_nodes_num).toFixed(4) * 100 + '%'})</p>
                    <p className="note"><FormattedMessage id="simuLable5"/></p>
                </div>

                <HomeActivities />
                <div className="specifications">
                    <p className="main-title"><FormattedMessage id="titleHardwareSpecifications" /></p>
                    <section>
                        <p className="name">CPU</p>
                        <p className="detail">{ this.state.CPU }</p>
                    </section>
                    <section>
                        <p className="name">GPU</p>
                        <p className="detail">{ this.state.GPU }</p>
                    </section>
                    <section>
                        <p className="name">Motherboard</p>
                        <p className="detail">{ this.state.Motherboard }</p>
                    </section>
                    <section>
                        <p className="name">RAM</p>
                        <p className="detail">{ this.state.RAM }</p>
                    </section>
                    <section>
                        <p className="name">SSD</p>
                        <p className="detail">{ this.state.SSD }</p>
                    </section>
                </div>
            
                
                <GenerateTransaction />
            </div>
        )
    }
}
