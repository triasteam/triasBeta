import React from "react"
import TableList from './common/TableList'
import {injectIntl} from 'react-intl' /* react-intl imports */
/**
 * Component for node list tab page. 
 */
class NodeList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="nodelist customTableWarp clearfix">
                <TableList searchListApi={'/api/node_list/'}/>    
            </div>
        )
    }
}
export default injectIntl(NodeList)