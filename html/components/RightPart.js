import React from "react"
import { NavLink, Switch, Redirect, Route } from 'react-router-dom'
// import ES6Promise from 'es6-promise'
// ES6Promise.polyfill() //关键代码,让ie识别promise对象!
import {injectIntl, intlShape, FormattedMessage } from 'react-intl'; /* react-intl imports */
import $ from 'jquery'
/**
 * RightPart components which displays:
 */
class RightPart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentWillMount() {
    }

    /**
     * Before a mounted component receives new props, reset some state.
     * @param {Object} nextProps new props
     */
    componentWillReceiveProps(nextProps) {
    }

    render() {
        return (
            <div className="right-part">
                <div className="simulations">
                    <p className="main-title">Simulations</p>
                    <div className="sim-data">
                        <p className="clearfix">
                            <span className="attr">Simulation</span>
                            <span className="value">Haker Attack</span>
                        </p>
                        <p className="clearfix">
                            <span className="attr">Run Time</span>
                            <span className="value">00:48:04</span>
                        </p>
                        <p className="clearfix">
                            <span className="attr">Test Group(s)</span>
                            <span className="value">1</span>
                        </p>
                    </div>
                    <p className="index">639 (38%)</p>
                    <p className="note percent-note">Nodes Affected</p>
                    <p className="index">437</p>
                    <p className="note">Nodes Affected</p>
                </div>

                <div className="activities">
                    <p className="main-title">Activities</p>
                    <div className="node-list">
                        <section className="item clearfix">
                            <div className="left">
                                <img src={require("../img/icon/activities/icon_activities_offline@2x.png")} />
                                <p></p>
                            </div>
                            <div className="right">
                                <p className="line1">Less than a minute</p>
                                <p className="line2">3 Nodes Recovered</p>
                                <p className="line3">Ethereum</p>
                            </div>
                        </section>
                        <section className="item clearfix">
                            <div className="left">
                                <img src={require("../img/icon/activities/icon_activities_offline@2x.png")} />
                                <p></p>
                            </div>
                            <div className="right">
                                <p className="line1">Less than a minute</p>
                                <p className="line2">3 Nodes Recovered</p>
                                <p className="line3">Ethereum</p>
                            </div>
                        </section>
                        <section className="item clearfix">
                            <div className="left">
                                <img src={require("../img/icon/activities/icon_activities_offline@2x.png")} />
                                <p></p>
                            </div>
                            <div className="right">
                                <p className="line1">Less than a minute</p>
                                <p className="line2">3 Nodes Recovered</p>
                                <p className="line3">Ethereum</p>
                            </div>
                        </section>
                        <section className="item clearfix">
                            <div className="left">
                                <img src={require("../img/icon/activities/icon_activities_offline@2x.png")} />
                                <p></p>
                            </div>
                            <div className="right">
                                <p className="line1">Less than a minute</p>
                                <p className="line2">3 Nodes Recovered</p>
                                <p className="line3">Ethereum</p>
                            </div>
                        </section>
                        <section className="item clearfix">
                            <div className="left">
                                <img src={require("../img/icon/activities/icon_activities_offline@2x.png")} />
                                <p></p>
                            </div>
                            <div className="right">
                                <p className="line1">Less than a minute</p>
                                <p className="line2">3 Nodes Recovered</p>
                                <p className="line3">Ethereum</p>
                            </div>
                        </section>
                        <section className="item clearfix">
                            <div className="left">
                                <img src={require("../img/icon/activities/icon_activities_offline@2x.png")} />
                                <p></p>
                            </div>
                            <div className="right">
                                <p className="line1">Less than a minute</p>
                                <p className="line2">3 Nodes Recovered</p>
                                <p className="line3">Ethereum</p>
                            </div>
                        </section>
                        <section className="item clearfix">
                            <div className="left">
                                <img src={require("../img/icon/activities/icon_activities_offline@2x.png")} />
                                <p></p>
                            </div>
                            <div className="right">
                                <p className="line1">Less than a minute</p>
                                <p className="line2">3 Nodes Recovered</p>
                                <p className="line3">Ethereum</p>
                            </div>
                        </section>
                        <section className="item clearfix">
                            <div className="left">
                                <img src={require("../img/icon/activities/icon_activities_offline@2x.png")} />
                                <p></p>
                            </div>
                            <div className="right">
                                <p className="line1">Less than a minute</p>
                                <p className="line2">3 Nodes Recovered</p>
                                <p className="line3">Ethereum</p>
                            </div>
                        </section>
                        <section className="item clearfix">
                            <div className="left">
                                <img src={require("../img/icon/activities/icon_activities_offline@2x.png")} />
                                <p></p>
                            </div>
                            <div className="right">
                                <p className="line1">Less than a minute</p>
                                <p className="line2">3 Nodes Recovered</p>
                                <p className="line3">Ethereum</p>
                            </div>
                        </section>
                        <section className="item clearfix">
                            <div className="left">
                                <img src={require("../img/icon/activities/icon_activities_offline@2x.png")} />
                                <p></p>
                            </div>
                            <div className="right">
                                <p className="line1">Less than a minute</p>
                                <p className="line2">3 Nodes Recovered</p>
                                <p className="line3">Ethereum</p>
                            </div>
                        </section>
                        <section className="item clearfix">
                            <div className="left">
                                <img src={require("../img/icon/activities/icon_activities_offline@2x.png")} />
                                <p></p>
                            </div>
                            <div className="right">
                                <p className="line1">Less than a minute</p>
                                <p className="line2">3 Nodes Recovered</p>
                                <p className="line3">Ethereum</p>
                            </div>
                        </section> <section className="item clearfix">
                            <div className="left">
                                <img src={require("../img/icon/activities/icon_activities_offline@2x.png")} />
                                <p></p>
                            </div>
                            <div className="right">
                                <p className="line1">Less than a minute</p>
                                <p className="line2">3 Nodes Recovered</p>
                                <p className="line3">Ethereum</p>
                            </div>
                        </section>
                        <section className="item clearfix">
                            <div className="left">
                                <img src={require("../img/icon/activities/icon_activities_offline@2x.png")} />
                                <p></p>
                            </div>
                            <div className="right">
                                <p className="line1">Less than a minute</p>
                                <p className="line2">3 Nodes Recovered</p>
                                <p className="line3">Ethereum</p>
                            </div>
                        </section>
                    </div>
                    <a className="view-all">View All</a>
                </div>

                <div className="specifications">
                    <p className="main-title">Hardware Specifications</p>
                    <section>
                        <p className="name">CPU</p>
                        <p className="detail">Intel i7-8700K @ 3.70 GHz</p>
                    </section>
                    <section>
                        <p className="name">GPU</p>
                        <p className="detail">GeForce GTX 1080 Ti</p>
                    </section>
                    <section>
                        <p className="name">Motherboard</p>
                        <p className="detail">ASUS ROG STRIX Z370-I GAMING</p>
                    </section>
                    <section>
                        <p className="name">RAM</p>
                        <p className="detail">G.Skill Ripjaws V, 2x16GB</p>
                    </section>
                    <section>
                        <p className="name">SSD</p>
                        <p className="detail">Samsung 960 Pro 512 GB M.2 PCIe</p>
                    </section>
                </div>
            </div>
        )
    }
}

/* Inject intl to Activities props */
const propTypes = {
    intl: intlShape.isRequired,
};
RightPart.propTypes = propTypes
export default injectIntl(RightPart)