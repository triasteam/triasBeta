import React from "react"
import { Pagination } from 'react-bootstrap';   // import Pagination component
import {injectIntl, intlShape, FormattedMessage } from 'react-intl'; /* react-intl imports */
import DropdownList from "./DropdownList";     // import custom drop-down list component
import PropTypes from 'prop-types';

/**
 * Custom pagination component.
 * Combined with pagenation component of React-Bootstrap.
 * 
 * ### Example:
 * ```js
 * <CustomPagination
 *  from={(this.currentPage-1)*this.state.rowsPerPage}
 *  to={this.currentPage*this.state.rowsPerPage}
 *  totalItemsCount={this.state.totalItemsCount}
 *  totalPagesCount={this.state.pageCount}
 *  currentPage={this.currentPage}
 *  onChangeRowsPerPage={(num)=>this.setRowsPerPage(num)}
 *  onSelectPage={(e)=>this.handleSelectPage(e)}
 *  onChangePageInput={(e)=>this.onChangeInputPage(e)}
 *  onPageInputKeyDown={(e)=>this.jumpPageKeyDown(e)}
 *  onClickJumpButton={()=>this.handleJumpPage()}
 *  pageNumInputId="logsPage"
 *  dropdownListId="rowsPerPageList"
 *  rowsPerPageRange={[{name: '50 项/页',value: 50},
 *      {name: '100 项/页',value: 100},
 *      {name: '150 项/页',value: 150},
 *      {name: '200 项/页',value: 200}]}
 * />
 * ```
 */
class CustomPagination extends React.Component {
    static propTypes = {
        /** Inject intl to CustomPagination props */
        intl: intlShape.isRequired,
        /** Index of first row in current page */
        from: PropTypes.number,
        /** Index of last row in current page. */
        to: PropTypes.number,
        /** Total number of items. */
        totalItemsCount: PropTypes.number,
        /** Total number of pages. */
        totalPagesCount: PropTypes.number,
        /** Current page number */
        currentPage: PropTypes.number,
        /** Handler for the change of maximum number of rows per page. */
        onChangeRowsPerPage: PropTypes.func,
        /** Handler for the change of current page number by clicking buttons in the pagination. */
        onSelectPage: PropTypes.func,
        /** Handler for the change of page number input  */
        onChangePageInput: PropTypes.func,
        /** Event handler for the change event of the page number input area. */
        onPageInputKeyDown: PropTypes.func,
        /** Event handler for the keydown event of the page number input area. */
        onClickJumpButton: PropTypes.func,
        /** (Optional) Id of the page number `<input>`, required when there are multiple CustomPaginations in a page. */
        pageNumInputId: PropTypes.string,
        /** (Optional) Id of the DropdownList, required when there are multiple CustomPaginations or DropdownLists in a page. */
        dropdownListId: PropTypes.string,
        /** (Optional) Options for the drop-down list of the maximum number of rows per page*/
        rowsPerPageRange: PropTypes.object
    }

    static defaultProps = {
        from: 0,
        to: 0,
        totalItemsCount: 0,
        totalPagesCount: 0,
        currentPage: 0,
        pageNumInputId: 'inputPageNum',
        dropdownListId:'rows-per-page-list'
    }
    constructor(props) {
        super(props);
        this.state={
            from:this.props.from || 0,  // index of first row in current page, 0 by default
            to:this.props.to || 0,      // index of last row in current page, 0 by default
            totalItemsCount: this.props.totalItemsCount || 0,   // total number of items, 0 by default
            totalPagesCount: this.props.totalPagesCount || 0,   // total number of pages, 0 by default
            currentPage: this.props.currentPage || 0,           // current page number, 0 by default
            pageNumInputId: this.props.pageNumInputId || "inputPageNum",        // id of the page number <input>, 'inputPageNum' by default
            dropdownListId: this.props.dropdownListId || "rows-per-page-list",  // id of the DropdownList, 'rows-per-page-list' by default
            // lang: this.props.intl.locale,    // current locale language
        }
    }

    /**
     * Before a mounted component receives new props, reset some state.
     * @param {Object} nextProps new props
     */
    componentWillReceiveProps (nextProps) {   
        this.setState({
            from: nextProps.from,
            to: nextProps.to,
            totalItemsCount: nextProps.totalItemsCount, 
            totalPagesCount: nextProps.totalPagesCount,
            currentPage: nextProps.currentPage,
        })
        // if locale language will be changed, reset lang state
        // if(this.state.lang != nextProps.intl.locale){
        //     this.setState({
        //         lang: nextProps.intl.locale
        //     })
        // }             
    }

    render(){
        return (
            <div className="pagination-all clearfix">
                {/* select the maximum number of rows per page*/}
                <div className="rowsPerPage">
                    <DropdownList
                        listID={this.state.dropdownListId}
                        itemsToSelect={this.props.rowsPerPageRange || [
                            {
                                name: this.props.intl.locale==='zh'?'10 项/页':'10 / page',
                                value: 10      
                            }, {
                                name: this.props.intl.locale==='zh'?'20 项/页':'20 / page',
                                value: 20
                            }, {
                                name: this.props.intl.locale==='zh'?'30 项/页':'30 / page',
                                value: 30
                            }, {
                                name: this.props.intl.locale==='zh'?'40 项/页':'40 / page',
                                value: 40
                            }, {
                                name: this.props.intl.locale==='zh'?'50 项/页':'50 / page',
                                value: 50
                            }, 
                        ]}
                        onSelect={(item) => this.props.onChangeRowsPerPage(item)} />
                    <p className='itemsCount'>
                        <FormattedMessage id='paginationItemsCountP' values={{from: this.state.from, to: this.state.to, count: this.state.totalItemsCount}} />
                    </p>
                </div>
                <div className="pagination-right clearfix">
                    <Pagination
                        prev={true}
                        next={true}
                        first={false}
                        last={false}
                        ellipsis={true}
                        boundaryLinks={true}
                        items={this.state.totalPagesCount}
                        maxButtons={7}
                        activePage={this.state.currentPage}
                        onSelect={this.props.onSelectPage.bind(this)} />
                    <div className="pageCount">
                        <FormattedMessage id='paginationPageInput'>
                            {(txt) => (
                                <input
                                className="pageNum"
                                id={this.state.pageNumInputId}
                                placeholder={txt}
                                type="text"
                                onChange={this.props.onChangePageInput.bind(this)}
                                onKeyDown={this.props.onPageInputKeyDown.bind(this)}
                            />
                            )}
                        </FormattedMessage>                        
                        <span className='totalPages'>/{this.state.totalPagesCount}</span>       
                        <FormattedMessage id='paginationJumpBtn' tagName="p">
                            {(txt) => (
                                <input type="button"
                                className="searchNum"
                                onClick={this.props.onClickJumpButton.bind(this)}
                                value={txt} />
                            )}
                        </FormattedMessage>
                    </div>
                </div>                            
            </div>
        )
    }
}

export default injectIntl(CustomPagination)