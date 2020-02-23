import React from "react"
import PropTypes from 'prop-types';

/**
 * UI Card component which displays 3 types of data.
 * 
 * 
 * ### Example:
 * ```js
 * <StaticsCard 
 *  cardInfo={ethereum: 0, hyperledger: 0, trias: 9}
 *  src={require("../img/icon/general-statics/icon_gs_nodes@2x.png")} 
 *  title={"Nodes"} />
 * ```
 */
export default class StaticsCard extends React.Component {
    static propTypes = {
        /** Data of 3 types: trias, hyperledger, ethereum.  */
        cardInfo: PropTypes.object,
        /** Icon source */
        src: PropTypes.object,
        /** Title */
        title: PropTypes.string
    }

    constructor(props) {
        super(props);
        this.state = {
            trias: this.props.cardInfo.trias,
            hyperledger: this.props.cardInfo.hyperledger,
            ethereum: this.props.cardInfo.ethereum,
            src: this.props.src,
            title: this.props.title
        }
    }

    /**
     * Before a mounted component receives new props, reset some state.
     * @param {Object} nextProps new props
     */
    componentWillReceiveProps(nextProps) {
        if(JSON.stringify(this.props.cardInfo) != JSON.stringify(nextProps.cardInfo)){
            this.setState({
                trias: nextProps.cardInfo.trias,
                hyperledger: nextProps.cardInfo.hyperledger,
                ethereum: nextProps.cardInfo.ethereum,
            }) 
        }
        if(this.state.title != nextProps.title){
            this.setState({
              title: nextProps.title
            })
        }
    }

    componentWillUnmount() {
        this.setState = ()=>{
          return;
        };
    }

    render() {
        return (
            <div className="card-container">
                <section className="card-header clearfix">
                    <img src={this.state.src} />
                    <span>{this.state.title}</span>
                </section>
                <section className="percent-bar">
                    <div></div>
                </section>
                <section className="percent-bar null-bar">
                    <div></div>
                </section>
                <section className="percent-bar null-bar">
                    <div></div>
                </section>
                <section className="parameters">
                    <div className="param-item clearfix">
                        <span className="point"></span>
                        <span className="param-name">Trias</span>
                        <span className="param-value">{this.state.trias}</span>
                    </div>
                    {/* <div className="param-item clearfix">
                        <span className="point"></span>
                        <span className="param-name">Hyperledger</span>
                        <span className="param-value">{this.state.hyperledger}</span>
                    </div>
                    <div className="param-item clearfix">
                        <span className="point"></span>
                        <span className="param-name">Ethereum</span>
                        <span className="param-value">{this.state.ethereum}</span>
                    </div> */}
                    <div className="param-item clearfix null-param">
                        <span className="point"></span>
                        <span className="param-name">N/A</span>
                        <span className="param-value">No Data</span>
                    </div>
                    <div className="param-item clearfix null-param">
                        <span className="point"></span>
                        <span className="param-name">N/A</span>
                        <span className="param-value">No Data</span>
                    </div>
                </section>
            </div>
        )
    }
}