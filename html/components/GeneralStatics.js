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
            <div className="general-statics">
                <p className="main-title">General Statics</p>
                <div className="card-group">
                    <StaticsCard />
                    <StaticsCard />
                    <StaticsCard />
                    <StaticsCard />
                    <StaticsCard />
                    <StaticsCard />
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