import React from "react"
// import ES6Promise from 'es6-promise'
// ES6Promise.polyfill() //关键代码,让ie识别promise对象!

import TableList from './common/TableList'
import {injectIntl } from 'react-intl'; /* react-intl imports */
/**
 * Activities components which displays:
 */
class Activities extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="activites-page">
                <TableList searchListApi={'/api/activity_list/'}/>
            </div>
        )
    }
}

export default injectIntl(Activities)