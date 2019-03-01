import React from "react"
import { NavLink, Switch, Redirect, Route } from 'react-router-dom'
// import ES6Promise from 'es6-promise'
// ES6Promise.polyfill() //关键代码,让ie识别promise对象!
import {injectIntl, intlShape, FormattedMessage } from 'react-intl'; /* react-intl imports */
import $ from 'jquery'
/**
 * StaticsCard components which displays:
 */
class StaticsCard extends React.Component {
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
    componentWillMount() {
    }

    /**
     * Before a mounted component receives new props, reset some state.
     * @param {Object} nextProps new props
     */
    componentWillReceiveProps(nextProps) {
        if(JSON.stringify(this.props.cardInfo) != JSON.stringify(nextProps.cardInfo) ){
            this.setState({
                trias: nextProps.cardInfo.trias,
                hyperledger: nextProps.cardInfo.hyperledger,
                ethereum: nextProps.cardInfo.ethereum,
            }) 
        }
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
        )
    }
}

/* Inject intl to Activities props */
const propTypes = {
    intl: intlShape.isRequired,
};
StaticsCard.propTypes = propTypes
export default injectIntl(StaticsCard)