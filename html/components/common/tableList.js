import React from "react"
import $ from "jquery";
import CustomPagination from "./CustomPagination"
import { injectIntl, intlShape, FormattedMessage } from 'react-intl' /* react-intl imports */
import { DatePicker } from 'antd';
import moment from 'moment';
import "antd/dist/antd.css";

/**
 * The Subcomponent of the nodeList page and Activities page -----  List of components
 * 
 */
class TableList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            nodeSearchKey: '',// Node list search keywords
            totalItemsCount: 0, // Number of each page
            pageCount: 0,  // number of total pages
            hostlist: [], // List of Data
            rowsPerPage: 10, // Initialize to get the number of pages per page
            currentPage: 1, // current page number
            startValue: null, // start date 
            endValue: null, //end date
            endOpen: false, // end date select box
            testGroup: 'All Test Groups', // Initialize the test group
            toggleTestGroup: false, // Select test group
            testGroupId: 3, // Initialize the ID of test group 
        }
    }
    /**
     * Toggle test group drop-down box
     * @param {boolen} this.state.toggleTestGroup
     */
    handleToggleTestGroup() {
        this.setState({
            toggleTestGroup: !this.state.toggleTestGroup,
        })
    }
    /**
     * Select test group
     * @param {e} event
     */
    handleChangeTestGroup(e) {
        let groupId = $(e.target).index();
        this.setState({
            testGroupId: groupId,
            toggleTestGroup: false,
            testGroup: $(e.target).text()
        })
        this.getHostList(this.state.currentPage, this.state.rowsPerPage, this.state.nodeSearchKey, groupId)
    }
    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
        this.getHostList(this.state.currentPage, this.state.rowsPerPage, this.state.nodeSearchKey, this.state.testGroupId)
    }

    onStartChange = (value) => {
        this.onChange('startValue', value);
    }

    onEndChange = (value) => {
        this.onChange('endValue', value);

    }

    handleStartOpenChange = (open) => {
        // if (!open) {
        //     this.setState({ endOpen: true });
        // }
        this.getHostList(this.state.currentPage, this.state.rowsPerPage, this.state.nodeSearchKey, this.state.testGroupId)
    }

    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
        this.getHostList(this.state.currentPage, this.state.rowsPerPage, this.state.nodeSearchKey, this.state.testGroupId)
    }


    /**
     * Listen for changes in the search field
     * @param {e} event
     */
    onChangeSearchInput(e) {
        this.setState({
            nodeSearchKey: e.target.value
        })
        this.getHostList(this.state.currentPage, this.state.rowsPerPage, e.target.value, this.state.testGroupId)
    }

    /**
     * keyword search
     * @param {e} event
     */
    handleSearchNode(e) {
        e.preventDefault();
        this.getHostList(this.state.currentPage, this.state.rowsPerPage, this.state.nodeSearchKey, this.state.testGroupId)
    }

    /**
     * Get list data
     * @param {number} currentPage --- current page 
     * @param {number} rowsPerPage --- the number of pages per page
     * @param {string} searchKey   --- keyWord 
     * @param {number} testGroupId --- the ID of testGroup
     */
    getHostList(currentPage, rowsPerPage, searchKey, testGroupId) {
        this.setState({
            currentPage:currentPage
        })
        let self = this
        // Whether to pass in a time parameter
        let data = self.state.startValue && self.state.endValue ? {
            group: testGroupId,
            curr_page: currentPage,
            page_size: rowsPerPage,
            search: searchKey,
            start: new Date(self.state.startValue).getTime(),
            end: new Date(self.state.endValue).getTime()
        } : {
                group: testGroupId,
                curr_page: currentPage,
                page_size: rowsPerPage,
                search: searchKey,
            };

        $.ajax({
            url: self.props.searchListApi,
            type: 'get',
            dataType: 'json',
            data: data,
            success: function (data) {
                if (data.status == 'success') {
                    self.setState({
                        totalItemsCount: data.result.num,
                        pageCount: data.result.total_page,
                        hostlist: data.result.nodes_list || data.result.activities_list
                    })
                } else {
                    self.setState({
                        hostlist: data.result.nodes_list || data.result.activities_list
                    })
                }

            }
        })
    }

    /**
     * Sets the maximum number of rows per page to be displayed in the list
     * @param {int} num 
     */
    setRowsPerPage(num) {
        this.setState({
            rowsPerPage: num,
            currentPage:1,
        })
        this.strogePageNum(1)
        this.getHostList(1, num, this.state.nodeSearchKey, this.state.testGroupId)
    }

    /**
     * Click the page number, the previous page, the next page when the button operation
     * @param {int} pagenum 
     */
    handleSelectPage(pagenum) {
        this.setState({
            currentPage: pagenum
        })
        this.strogePageNum(pagenum)
        this.getHostList(pagenum, this.state.rowsPerPage, this.state.nodeSearchKey, this.state.testGroupId)
        //console.log(pagenum)
    }

    /**
     * Jump to the input box onChange listening
     */
    onChangeInputPage(e) {
        var re = /^[0-9]+$/
        var hostlistPage = e.target.value      //get input page number
        /*
        * If the entered page number is not empty, and if the entered page number does not conform to the specification 
        * (not a positive integer, or greater than the maximum page number)
        */
        if (hostlistPage != "" && (!re.test(hostlistPage) || hostlistPage == 0 || hostlistPage > this.state.pageCount)) {
            $('#inputPageNum').val('');   //clear input value                      
        }
    }
    /**
     * Jump to the input box of the key event monitoring
     * @return {[type]} [description]
     */
    jumpPageKeyDown(e) {
        if (e.keyCode === 13) {           //when enter key
            this.handleJumpPage()
        }
    }

    /**
     * Click the jump button to listen
     */
    handleJumpPage() {
        var pagenum = parseInt($('#inputPageNum').val())
        this.setState({
            currentPage: pagenum
        })
        this.strogePageNum(pagenum)
        this.getHostList(pagenum, this.state.rowsPerPage, this.state.nodeSearchKey, this.state.testGroupId)
    }
    /**
     * Timestamp format conversion
     * @param {timestamp} inputTime 
     */
    getTimeFormat(inputTime) {
        var date = new Date(inputTime*1000);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    }
    /**
     * Save the current page number to window.localStorage
     * @param {*} currentPage 
     */
    strogePageNum(currentPage){
        let storage = window.localStorage;
        storage.setItem(this.props.searchListApi,currentPage);
    }
    /**
     * remove the current page number to window.localStorage
     */
    removeStrogePageNum(){
        let storage = window.localStorage;
        storage.removeItem(this.props.searchListApi);
    }
    componentDidMount() {
        // get the current page number to window.localStorage
        let storage = window.localStorage;
        let currentPage = Number(storage.getItem(this.props.searchListApi)) || this.state.currentPage;
        this.getHostList(currentPage, this.state.rowsPerPage, this.state.nodeSearchKey, this.state.testGroupId)
    }

    componentWillUnmount = () => {
        // remove window.localStorage
        this.removeStrogePageNum()
        this.setState = (state,callback)=>{
          return;
        };
    }
    render() {
        return (
            <div className="table-list customTableWarp">
                <form onSubmit={this.handleSearchNode.bind(this)} className="clearfix">
                    <input
                        id="nodelist-searchkey"
                        type="text"
                        placeholder="搜索别名或 IP"
                        className="searchkey"
                        value={this.state.nodeSearchKey}
                        onChange={this.onChangeSearchInput.bind(this)}
                    />
                    <button className="nodelist-search" onClick={this.handleSearchNode.bind(this)} >
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                </form>

                {
                    this.props.searchListApi == '/api/activity_list/' &&
                    <div className="datePicker clearfix">
                        <div className="left-pick">
                            <div className="select-group">
                                <h5 onClick={this.handleToggleTestGroup.bind(this)}>{this.state.testGroup}</h5>
                                {
                                    this.state.toggleTestGroup &&
                                    <div className="selevt-list" onClick={this.handleChangeTestGroup.bind(this)}>
                                        <p>Group Trias</p>
                                        <p>Group Ethereum</p>
                                        <p>Group Hyperledger</p>
                                        <p>All Test Groups</p>
                                    </div>
                                }

                            </div>
                        </div>
                        <div className="right-pick">
                            <span>from</span>
                            <DatePicker
                                showTime
                                format="YYYY/MM/DD"
                                value={this.state.startValue}
                                placeholder="Start time"
                                onChange={this.onStartChange}
                                onOpenChange={this.handleStartOpenChange}
                            />
                            <span>to</span>
                            <DatePicker
                                showTime
                                format="YYYY/MM/DD"
                                value={this.state.endValue}
                                placeholder="End time"
                                onChange={this.onEndChange}
                                open={this.state.endOpen}
                                onOpenChange={this.handleEndOpenChange}
                            />
                        </div>

                    </div>
                }
                {/*主机列表的表格*/}
                <table className="customTable">
                    <thead>
                        {
                            this.props.searchListApi == '/api/node_list/' &&
                            <tr>
                                <th><FormattedMessage id="termNode" /> IP</th>
                                <FormattedMessage id="termStatus" tagName="th" />
                                <FormattedMessage id="thBlockHeight" tagName="th" />
                                <FormattedMessage id="thBlockHash" tagName="th" />
                                <FormattedMessage id="thBlockUpdateTime" tagName="th" />
                            </tr>
                        }
                        {
                            this.props.searchListApi == '/api/activity_list/' &&
                            <tr>
                                <FormattedMessage id="thTestGroup" tagName="th" />
                                <FormattedMessage id="thTime" tagName="th" />
                                <FormattedMessage id="thEvent" tagName="th" />
                            </tr>
                        }
                    </thead>

                    <tbody>
                        {this.props.searchListApi == '/api/node_list/' && this.state.hostlist && this.state.hostlist.map(function (i, index) {
                            return (

                                <tr className="" key={index}>
                                    <td className="hostIp">
                                        {i.node_ip}
                                    </td>
                                    {/* <td className="">{i.location}</td> */}
                                    <td className="hostStatus"><span className={i.status == 0 ? 'normal' : 'error'}></span>{i.status == 0 ? 'Normal' : 'abnormality'}</td>
                                    <td className="">{i.block_heigth}</td>
                                    <td className="">{i.latest_block_hash}</td>
                                    <td className="">{this.getTimeFormat(i.latest_block_time)}</td>

                                </tr>

                            )
                        }.bind(this))}

                        {this.props.searchListApi == '/api/activity_list/' && this.state.hostlist && this.state.hostlist.map(function (i, index) {
                            return (

                                <tr className="" key={index}>
                                {
                                    i.group == 0 &&
                                    <td className="activity-groupName">
                                        <img src={require("../../img/icon/inline/icon_inline_trias@2x.png")} alt=""/>
                                        Group Trias
                                    </td>
                                }
                                {
                                    i.group == 1 &&
                                    <td className="activity-groupName">
                                        <img src={require("../../img/icon/inline/icon_inline_eth@2x.png")} alt=""/>
                                        Group Ethereum
                                    </td>
                                }
                                {
                                    i.group == 2 &&
                                    <td className="activity-groupName">
                                        <img src={require("../../img/icon/inline/icon_inline_hyperledger@2x.png")} alt=""/>
                                        Group Hyperledger
                                    </td>
                                }
                                    <td className="">{this.getTimeFormat(i.time)}</td>
                                    <td className="">{i.event}</td>
                                </tr>

                            )
                        }.bind(this))}

                        {
                            (!this.state.hostlist || this.state.hostlist.length == 0) && <tr className="" style={{ width: '100%', height: '70px', lineHeight: '70px', background: 'transparent', border: 'none', }}><td style={{ paddingLeft: '40px', width: '100%' }}>当前没有匹配的数据。</td></tr>
                        }
                    </tbody>
                </table>





                <CustomPagination
                    from={(this.state.currentPage - 1) * this.state.rowsPerPage + 1} 
                    to={(this.state.currentPage - 1) * this.state.rowsPerPage + (this.state.hostlist ? this.state.hostlist.length : 0)}
                    totalItemsCount={this.state.totalItemsCount}
                    totalPagesCount={this.state.pageCount}
                    currentPage={this.state.currentPage}
                    onChangeRowsPerPage={(num) => this.setRowsPerPage(num)}
                    onSelectPage={(e) => this.handleSelectPage(e)}
                    onChangePageInput={(e) => this.onChangeInputPage(e)}
                    onPageInputKeyDown={(e) => this.jumpPageKeyDown(e)}
                    onClickJumpButton={() => this.handleJumpPage()}
                    rowsPerPageRange={[{ name: this.props.intl.locale == 'zh' ? '10 项/页' : '10 / page', value: 10 },
                    { name: this.props.intl.locale == 'zh' ? '20 项/页' : '20 / page', value: 20 },
                    { name: this.props.intl.locale == 'zh' ? '50 项/页' : '50 / page', value: 50 },
                    { name: this.props.intl.locale == 'zh' ? '100 项/页' : '100 / page', value: 100 },
                    { name: this.props.intl.locale == 'zh' ? '200 项/页' : '200 / page', value: 200 }]}
                />
            </div>
        )
    }
}

/* Inject intl to TableList props */
const propTypes = {
    intl: intlShape.isRequired,
};
TableList.propTypes = propTypes
export default injectIntl(TableList)