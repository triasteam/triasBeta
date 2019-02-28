import React from "react"
import $ from "jquery";
/**
 * Custom toggle list component.
 * Usage:
 * <ToggleList
 * listID="langlist"
 * itemsToSelect={[{
      ele: <span onClick={()=>this.changeLanguage('zh')}>中文</span>
    }, {
        ele: <span  onClick={()=>this.changeLanguage('en')}>English</span>
    }]}
 * name={<i className="fas fa-globe-americas"></i>} />
 * 
 * Attributes:
 * - listID: id of the outer container
 * - itemsToSelect: a list of elements( ele: element shows in the drop-down list )
 * - name: shows in the toggle button
 */
export default class HeadLine extends React.Component {
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
                                    Current Event
                                </p>
                                <p className="sub-sub">
                                    Hacker Attack
                                </p>
                            </div>
                        </li>
                        <li className="sub-list clearfix">
                            <div className="left-icon">
                                <img src={require("../../img/icon/header/icon_header_timeRemain@2x.png")} alt="" />
                            </div>
                            <div className="right-sub">
                                <p className="sub-title">
                                    Time Remain
                                </p>
                                <p className="sub-sub">
                                    00:18:46
                                </p>
                            </div>
                        </li>
                        <li className="sub-list clearfix">
                            <div className="left-icon">
                                <img src={require("../../img/icon/header/icon_header_nextEvent@2x.png")} alt="" />
                            </div>
                            <div className="right-sub">
                                <p className="sub-title">
                                    Next Event
                                </p>
                                <p className="sub-sub">
                                    Power Outage (20:30)
                                </p>
                            </div>
                        </li>
                    </ul>

                </div>
            </div>
        )
    }
}