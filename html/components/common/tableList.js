import React from "react"
import $ from "jquery";
import CustomPagination from "./CustomPagination"
import { injectIntl, intlShape, FormattedMessage } from 'react-intl' /* react-intl imports */

class TableList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            nodeSearchKey: '',//节点列表搜索关键字
            totalItemsCount: 0,
            pageCount: 0,　　　　　　　　　　　　　　　 //总页数
            hostlist: [],
            rowsPerPage: 10,
            currentPage: 1
        }
    }

    componentDidMount() {
        this.getHostList(this.state.currentPage, this.state.rowsPerPage, this.state.nodeSearchKey)
    }

    /**
      * 搜索输入框内容变化时的监听
      */
    onChangeSearchInput(e) {
        this.setState({
            nodeSearchKey: e.target.value
        })
        this.getHostList(this.state.currentPage, this.state.rowsPerPage, e.target.value)
    }


    handleSearchNode(e) {
        e.preventDefault();
        this.getHostList(this.state.currentPage, this.state.rowsPerPage, this.state.nodeSearchKey)
    }

    /**
     * 获取列表数据
     * @param {int} currentPage 
     * @param {int} rowsPerPage 
     */
    getHostList(currentPage, rowsPerPage, searchKey) {
        var self = this
        $.ajax({
            url: self.props.searchListApi,
            type: 'get',
            dataType: 'json',               //GET方式时,表单数据被转换成请求格式作为URL地址的参数进行传递
            data: {
                curr_page: currentPage,
                page_size: rowsPerPage,
                search: searchKey,
            },
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
     * 设置列表每页最多显示行数
     * @param {int} num 
     */
    setRowsPerPage(num) {
        this.setState({
            rowsPerPage: num
        })
        this.getHostList(this.state.currentPage, num, this.state.nodeSearchKey)
        //console.log(num)
    }

    /**
     * 点击页码、前一页、后一页按钮时的操作
     * @param {int} pagenum 
     */
    handleSelectPage(pagenum) {
        this.setState({
            currentPage: pagenum
        })
        this.getHostList(pagenum, this.state.rowsPerPage, this.state.nodeSearchKey)
        //console.log(pagenum)
    }

    /**
     * 跳转输入框的onChange监听
     */
    onChangeInputPage(e) {
        var re = /^[0-9]+$/
        var hostlistPage = e.target.value      //获取输入的页码
        //如果输入的页码不为空,并且如果输入的页码不符合规范(不是正整数，或者大于最大页码)
        if (hostlistPage != "" && (!re.test(hostlistPage) || hostlistPage == 0 || hostlistPage > this.state.pageCount)) {
            $('#inputPageNum').val('');   //清空输入框的内容                       
        }
    }
    /**
     * 跳转输入框的按键事件监听
     * @return {[type]} [description]
     */
    jumpPageKeyDown(e) {
        if (e.keyCode === 13) {           //当按下的键是回车键
            this.handleJumpPage()
        }
    }

    /**
     * 点击跳转按钮的监听
     */
    handleJumpPage() {
        var pagenum = parseInt($('#inputPageNum').val())
        this.setState({
            currentPage: pagenum
        })
        this.getHostList(pagenum, this.state.rowsPerPage, this.state.nodeSearchKey)
        //console.log('jump')
    }

    getTimeFormat(inputTime){
        var date = new Date(inputTime);  
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
        return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;    
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
                {/*主机列表的表格*/}
                <table className="customTable">
                    <thead>
                        {
                            this.props.searchListApi == 'api/node_list/' &&
                            <tr>
                                <FormattedMessage id="thNodeLabel" tagName="th" />
                                {/* <FormattedMessage id="thLocation" tagName="th" /> */}
                                <FormattedMessage id="thStatus" tagName="th" />
                                <FormattedMessage id="thBlockHeight" tagName="th" />
                                <FormattedMessage id="thBlockHash" tagName="th" />
                                <FormattedMessage id="thBlockUpdateTime" tagName="th" />
                            </tr>
                        }
                        {
                            this.props.searchListApi == 'api/activity_list/' &&
                            <tr>
                                <FormattedMessage id="thTestGruop" tagName="th" />
                                <FormattedMessage id="thTime" tagName="th" />
                                <FormattedMessage id="thEvent" tagName="th" />
                            </tr>
                        }
                    </thead>

                    <tbody>
                        {this.props.searchListApi == 'api/node_list/' && this.state.hostlist && this.state.hostlist.map(function (i, index) {
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

                        {this.props.searchListApi == 'api/activity_list/' && this.state.hostlist && this.state.hostlist.map(function (i, index) {
                            return (

                                <tr className="" key={index}>
                                    <td className="">{i.group}</td>
                                    <td className="">{this.getTimeFormat(i.time)}</td>
                                    <td className="">{i.event}</td>
                                </tr>

                            )
                        }.bind(this))}

                        {
                            (!this.state.hostlist.length || this.state.hostlist.length==0) && <tr className="" style={{ width: '100%', height: '70px', lineHeight: '70px', background: 'transparent', border: 'none', }}><td style={{ paddingLeft: '40px', width: '100%' }}>当前没有匹配的数据。</td></tr>
                        }
                    </tbody>
                </table>





                <CustomPagination
                    from={(this.state.currentPage - 1) * this.state.rowsPerPage}
                    to={(this.state.currentPage - 1) * this.state.rowsPerPage + (this.state.hostlist ? this.state.hostlist.length : 0)}
                    totalItemsCount={this.state.totalItemsCount}
                    totalPagesCount={this.state.pageCount}
                    currentPage={this.state.currentPage}
                    onChangeRowsPerPage={(num) => this.setRowsPerPage(num)}
                    onSelectPage={(e) => this.handleSelectPage(e)}
                    onChangePageInput={(e) => this.onChangeInputPage(e)}
                    onPageInputKeyDown={(e) => this.jumpPageKeyDown(e)}
                    onClickJumpButton={() => this.handleJumpPage()}
                    rowsPerPageRange={[{ name: this.props.intl.locale == 'zh' ? '10 项/页' : '20 / page', value: 20 },
                    { name: this.props.intl.locale == 'zh' ? '100 项/页' : '100 / page', value: 100 },
                    { name: this.props.intl.locale == 'zh' ? '150 项/页' : '150 / page', value: 150 },
                    { name: this.props.intl.locale == 'zh' ? '200 项/页' : '200 / page', value: 200 },
                    { name: this.props.intl.locale == 'zh' ? '250 项/页' : '250 / page', value: 250 }]}
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