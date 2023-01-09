import React from "react"
import Timer from './Timer'
import { FormattedMessage } from 'react-intl' /* react-intl imports */
import PropTypes from 'prop-types';

/**
 * Custom component which displays page title and current event details.
 */
export default class HeadLine extends React.Component {
    static propTypes = {
        /** Name */
        headBarName: PropTypes.string,
        /** List of events */
        eventList: PropTypes.array,
        /** Current event index */
        currentEventIndex: PropTypes.number
    }

    constructor(props) {
        super(props);
        this.state = {
        }
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
                                    this.props.eventList.length >0 && this.props.currentEventIndex > -1 &&
                                    <p className="sub-sub">
                                        {this.props.eventList[this.props.currentEventIndex].name}
                                    </p>
                                }
                               {
                                    this.props.eventList.length <= 0 || this.props.currentEventIndex == -1 &&
                                    <p className="sub-sub">
                                        Null
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
                                    this.props.eventList.length > 0 && this.props.currentEventIndex > -1 &&
                                    <p className="sub-sub">
                                        <Timer start={this.props.eventList[this.props.currentEventIndex].start} />
                                    </p>
                                }
                                {
                                    this.props.eventList.length <= 0 || this.props.currentEventIndex == -1 &&
                                    <p className="sub-sub">
                                        Null
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
                                    this.props.eventList.length > 0 && this.props.currentEventIndex!=this.props.eventList.length-1 &&
                                    <p className="sub-sub">
                                        {this.props.eventList[this.props.currentEventIndex+1].name}
                                    </p>
                                }
                                {
                                    (this.props.eventList.length <= 0 || this.props.currentEventIndex==this.props.eventList.length-1 )&&
                                    <p className="sub-sub">
                                        Null
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