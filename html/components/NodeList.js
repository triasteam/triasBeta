import React from "react"
import $ from "jquery"
import { Link } from 'react-router-dom'

import TableList from './common/tableList'

import {injectIntl, intlShape, FormattedMessage} from 'react-intl' /* react-intl imports */
/**
 * Component for node list part 
 */
class NodeList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
           
        }
    }

   
    render() {
        return (
            <div className="nodelist customTableWarp clearfix">
                
                
                <TableList searchListApi={'/api/node_list/'}/>
                
            </div>

        )
    }
}

/* Inject intl to NodeList props */
const propTypes = {
    intl: intlShape.isRequired,
};
NodeList.propTypes = propTypes
export default injectIntl(NodeList)