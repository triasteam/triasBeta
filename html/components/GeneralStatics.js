import React from "react"
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
            lang: this.props.intl.locale,    // current locale language
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

    /**
     * Before a mounted component receives new props, reset some state.
     * @param {Object} nextProps new props
     */
    componentWillReceiveProps(nextProps){
      // if locale language will be changed, reset lang state
      if(this.state.lang != nextProps.intl.locale){
          this.setState({
              lang: nextProps.intl.locale
          })
      }
    }

    componentWillMount() {
        this.getGeneralStatics();
    }

    /**
     * Get General Statics
     * 
     */
    getGeneralStatics() {
        var self = this;
        $.ajax({
            url:"/api/general_static/",
            type:"GET",
            dataType:"json",
            success: function(data){
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

    render() {
        return (
            <div className="general-statics">
                <p className="main-title"><FormattedMessage id="titleGeneralStatistics"/></p>
                <div className="card-group">
                    <StaticsCard cardInfo={this.state.nodes} src={require("../img/icon/general-statics/icon_gs_nodes@2x.png")} title={this.state.lang=="zh"?"节点":"Nodes"} />
                    <StaticsCard cardInfo={this.state.block_height} src={require("../img/icon/general-statics/icon_gs_blockHeight@2x.png")} title={this.state.lang=="zh"?"区块高度":"Block Height"} />
                    {/* <StaticsCard cardInfo={this.state.accounts} src={require("../img/icon/general-statics/icon_gs_account@2x.png")} title="Accounts" /> */}
                    <div className="card-container null-card">
                        <section className="card-header clearfix">
                            <img src={require("../img/icon/general-statics/icon_gs_account@2x.png")} />
                            <span>{this.state.lang=="zh"?"账户":"Accounts"}</span>
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
                            {this.state.lang=="zh"?"帐户统计数据将在下一版本中提供。":"Account statistics will be avaliable in the next version."}
                        </section>
                    </div>
                    <StaticsCard cardInfo={this.state.peak_tx} src={require("../img/icon/general-statics/icon_gs_peakTx@2x.png")} title={this.state.lang=="zh"?"峰值交易数":"Peak Tx"} />
                    <StaticsCard cardInfo={this.state.today_tx} src={require("../img/icon/general-statics/icon_gs_txToday@2x.png")} title={this.state.lang=="zh"?"今日交易总数":"Tx Today"} />
                    <StaticsCard cardInfo={this.state.tx_num} src={require("../img/icon/general-statics/icon_gs_irrTx@2x.png")} title={this.state.lang=="zh"?"不可逆的交易":"Irreversible Tx"} />
                </div>
            </div>
        )
    }
}

/* Inject intl to GeneralStatics props */
const propTypes = {
    intl: intlShape.isRequired,
};
GeneralStatics.propTypes = propTypes
export default injectIntl(GeneralStatics)