import React from "react"

import { FormattedMessage } from 'react-intl' /* react-intl imports */
/**
 * Custom headline component.
 */
export default class HeadLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        
    }
    render() {

        return (
            <div className="sub-header">
                <div className="headBar">
                    <ul className="clearfix">
                        <li className="sub-name">
                            <p>{this.props.headBarName}</p>
                        </li>
                        <li className="sub-list clearfix">
                            <div className="left-icon">
                                <img src={require("../../img/icon/header/icon_header_currentEvent@2x.png")} alt="" />
                            </div>
                            <div className="right-sub">
                                <p className="sub-title">
                                    <FormattedMessage id="subHeaderP1" />
                                </p>
                                {
                                    this.props.eventList.length>0 && 
                                    <p className="sub-sub">
                                        {this.props.eventList[this.props.currentEventIndex].name}
                                    </p>
                                }
                               
                            </div>
                        </li>
                        <li className="sub-list clearfix">
                            <div className="left-icon">
                                <img src={require("../../img/icon/header/icon_header_timeRemain@2x.png")} alt="" />
                            </div>
                            <div className="right-sub">
                                <p className="sub-title">
                                    <FormattedMessage id="subHeaderP2"/>
                                </p>
                                {
                                    this.props.eventList.length>0 && 
                                    <p className="sub-sub">
                                        {this.props.eventList[this.props.currentEventIndex].start}
                                    </p>
                                }
                            </div>
                        </li>
                        <li className="sub-list clearfix">
                            <div className="left-icon">
                                <img src={require("../../img/icon/header/icon_header_nextEvent@2x.png")} alt="" />
                            </div>
                            <div className="right-sub">
                                <p className="sub-title">
                                    <FormattedMessage id="subHeaderP3" />
                                </p>
                                {
                                    this.props.eventList.length>0 && 
                                    <p className="sub-sub">
                                        {this.props.eventList[this.props.currentEventIndex+1].name}
                                    </p>
                                }
                            </div>
                        </li>
                    </ul>

                </div>
            </div>
        )
    }
}