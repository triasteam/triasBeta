import React from "react"
import { NavLink, Switch, Redirect, Route } from 'react-router-dom'
// import ES6Promise from 'es6-promise'
// ES6Promise.polyfill() //关键代码,让ie识别promise对象!
import {injectIntl, intlShape, FormattedMessage } from 'react-intl'; /* react-intl imports */
import $ from 'jquery'
import StaticsCard from "./common/StaticsCard";

/**
 * GeneralStatics components which displays:
 */
class GeneralStatics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: {
                trias: 0,
                hyperledger: 0,
                ethereum: 0,
            },
            block_height: {
                trias: 0,
                hyperledger: 0,
                ethereum: 0,
            },
            accounts: {
                trias: 0,
                hyperledger: 0,
                ethereum: 0,
            },
            peak_tx: {
                trias: 0,
                hyperledger: 0,
                ethereum: 0,
            },
            today_tx: {
                trias: 0,
                hyperledger: 0,
                ethereum: 0,
            },
            tx_num: {
                trias: 0,
                hyperledger: 0,
                ethereum: 0,
            },

        }
    }
    componentWillMount() {
        this.getGeneralStatics();
    }

    getGeneralStatics() {
        var self = this;
        $.ajax({
            url:"/api/general_static/",
            type:"GET",
            dataType:"json",
            success: function(data){
                console.log(data)
                if(data.status == "success") {
                    self.setState({
                        nodes: {
                            trias: data.result.trias.nodes,
                            hyperledger: data.result.hyperledger.nodes,
                            ethereum: data.result.ethereum.nodes,
                        },
                        block_height: {
                            trias: data.result.trias.block_height,
                            hyperledger: data.result.hyperledger.block_height,
                            ethereum: data.result.ethereum.block_height,
                        },
                        accounts: {
                            trias: data.result.trias.accounts,
                            hyperledger: data.result.hyperledger.accounts,
                            ethereum: data.result.ethereum.accounts,
                        },
                        peak_tx: {
                            trias: data.result.trias.peak_tx,
                            hyperledger: data.result.hyperledger.peak_tx,
                            ethereum: data.result.ethereum.peak_tx,
                        },
                        today_tx: {
                            trias: data.result.trias.today_tx,
                            hyperledger: data.result.hyperledger.today_tx,
                            ethereum: data.result.ethereum.today_tx,
                        },
                        tx_num: {
                            trias: data.result.trias.tx_num,
                            hyperledger: data.result.hyperledger.tx_num,
                            ethereum: data.result.ethereum.tx_num,
                        },
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
    }

    render() {
        return (
            <div className="general-statics">
                <p className="main-title">General Statics</p>
                <div className="card-group">
                    <StaticsCard cardInfo={this.state.nodes} src={require("../img/icon/general-statics/icon_gs_nodes@2x.png")} title="Nodes" />
                    <StaticsCard cardInfo={this.state.block_height} src={require("../img/icon/general-statics/icon_gs_blockHeight@2x.png")} title="Block Height" />
                    {/* <StaticsCard cardInfo={this.state.accounts} src={require("../img/icon/general-statics/icon_gs_account@2x.png")} title="Accounts" /> */}
                    <div className="card-container">
                        <section className="card-header clearfix">
                            <img src={this.state.src} />
                            <span>{this.state.title}</span>
                        </section>
                        <section className="percent-bar">
                            <div></div>
                        </section>
                        <section className="percent-bar">
                            <div></div>
                        </section>
                        <section className="percent-bar">
                            <div></div>
                        </section>
                        <section className="parameters">
                            <div className="param-item clearfix">
                                <span className="point"></span>
                                <span className="param-name">Trias</span>
                                <span className="param-value">{this.state.trias}</span>
                            </div>
                            <div className="param-item clearfix">
                                <span className="point"></span>
                                <span className="param-name">Hyperledger</span>
                                <span className="param-value">{this.state.hyperledger}</span>
                            </div>
                            <div className="param-item clearfix">
                                <span className="point"></span>
                                <span className="param-name">Ethereum</span>
                                <span className="param-value">{this.state.ethereum}</span>
                            </div>
                        </section>
                    </div>
                    <StaticsCard cardInfo={this.state.peak_tx} src={require("../img/icon/general-statics/icon_gs_peakTx@2x.png")} title="Peak Tx" />
                    <StaticsCard cardInfo={this.state.today_tx} src={require("../img/icon/general-statics/icon_gs_txToday@2x.png")} title="Tx Today" />
                    <StaticsCard cardInfo={this.state.tx_num} src={require("../img/icon/general-statics/icon_gs_irrTx@2x.png")} title="Irreversible Tx" />
                </div>
            </div>
        )
    }
}

/* Inject intl to Activities props */
const propTypes = {
    intl: intlShape.isRequired,
};
GeneralStatics.propTypes = propTypes
export default injectIntl(GeneralStatics)