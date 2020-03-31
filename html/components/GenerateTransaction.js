import React from "react"
// import Modal from "react-bootstrap"
// import { Link } from 'react-router-dom'
// import ES6Promise from 'es6-promise'
// ES6Promise.polyfill() //关键代码,让ie识别promise对象!
import {injectIntl, intlShape, FormattedMessage } from 'react-intl'; /* react-intl imports */
import $ from 'jquery'
import { CSSTransition } from 'react-transition-group';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// import { cold } from "react-hot-loader";

/**
 * Component for generating transaction
 */
class GenerateTransaction extends React.Component {
    static propTypes = {
        /** Inject intl to CustomPagination props */
        intl: intlShape.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            showInputModal: false,
            showErrorModal: false,
            showNullModal: false,
            showDetailModal: false,
            showFailureModal: false,
            tranContent: '',
            tranCardGroup:[],
            successID:'',
            successHash:'',
            successHeight:'',
            successContent:'',
            failContent:'',
            failLog:'',
            errorTitle:'',
            errorInfo:'',
            lang: this.props.intl.locale, // current locale language,
            copied: false,
            value:'',
            searchKey: '',
            errorType: 1,
            queryHint:'',
            sendController: true,
            sendHint: false,
        }
    }

    /**
     * Before a mounted component receives new props, reset some state.
     * @param {Object} nextProps new props
     */
    componentWillReceiveProps (nextProps) {
        // if locale language will be changed, reset lang state
        if(this.state.lang != nextProps.intl.locale){
            this.setState({
                lang: nextProps.intl.locale
            })
        }
    }
    sendTransaction() {
        let self = this;
        let group = [];
        // let itemName = 'item' + this.state.tranCardGroup.length;
        let info = self.state.tranContent;
        let item = {};
        if (!info) {
            self.setState({
                sendHint: true,
            })
            setTimeout( () => {
                self.setState({
                    sendHint: false
                })
            }, 3000)
        } {
            $.ajax({
                url: "/api/send_transaction/",
                type: "POST",
                dataType:"json",
                data: {
                    content: info
                },
                success: function(data){
                    // console.log(data)
                    if( data.status == "success" ) {
                        // let tranCardGroup = {...this.state.tranCardGroup}
                        // let statusCopy = Object.assign({}, this.state);
                        // statusCopy.tranCardGroup[itemName].id = data.result.id;
                        // this.setState(statusCopy);

                        // tranCardGroup[itemName].id = data.result.id;
                        // this.setState({tranCardGroup});
                        // const { stateOpt } = { ...this.state };
                        // const currentState = stateOpt;
                        // const { name, value } = e.target;
                        // currentState.tranCardGroup[itemName].id = data.result.id;

                        // this.setState({ stateOpt: currentState });
                        // console.log( stateOpt )
                        let time = new Date().getTime();
                        item = {
                            status: 1,
                            id: data.result.id,
                            time: self.timestampToTime(time),
                        }
                        group.push(item);
                        group = group.concat(self.state.tranCardGroup);
                        if (group.length > 3) {
                            group = group.slice(0,3);
                        }
                        self.setState({
                            tranCardGroup: group,
                            showInputModal: !self.state.showInputModal,
                            sendController: false,
                        })

                        // this.setstate({
                        //     ...this.state.tranCardGroup[0],
                        //     id: data.result.id
                        // })

                    }
                }
            })
        }


    }

    timestampToTime(timestamp) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '.';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
        var D = date.getDate() ;
        var h = date.getHours() + ':';
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0' + date.getSeconds()  : date.getSeconds()) + ' - ';
        return h+m+s+Y+M+D;
    }

    showInput() {
        this.setState({
            showInputModal: !this.state.showInputModal,
            sendController: true,
            tranContent:'',
        })
        $("#user-input").val("");
    }

    handleText(e) {
        let content = e.target.value;
        this.setState({
            tranContent: content,
        })
    }

    checkDetail(id){
        let self = this;
        $.ajax({
            url: "/api/query_transactions_status/",
            type: "GET",
            dataType:"json",
            data: {
                id: id
            },
            success: function(data){
                if( data.status == "tx_success" ) {
                    console.log(data)
                    self.setState({
                        showDetailModal: !self.state.showDetailModal,
                        successID: data.result.id,
                        successHash: data.result.hash,
                        successHeight: data.result.block_height,
                        successContent: data.result.content,
                    })

                } else if ( data.status == "tx_failure" ) {
                    self.setState({
                        showFailureModal: !self.state.showFailureModal,
                        failContent: data.result.content,
                        failLog: data.result.log,
                    })
                } else if ( data.status == "failure" ) {
                    if ( data.result == "trade not exists" ) {
                        self.setState({
                            showErrorModal: !self.state.showErrorModal,
                            errorTitle: self.state.lang=='zh'?'请稍候再试。':'Try Again Later.',
                            errorInfo: self.state.lang=='zh'?'此交易正在后台生成，请稍后再试。':'The transaction is being generated in the background, please wait a few seconds.',
                            // errorType: 2,
                            errorType:1
                        })
                    } else {
                        let info = data.result;
                        info = info.replace(info[0],info[0].toUpperCase());
                        self.setState({
                            showErrorModal: !self.state.showErrorModal,
                            // errorTitle: self.state.lang=='zh'?'发生错误！':'Error Occurred!',
                            errorTitle: self.state.lang=='zh'?'请稍候再试。':'Try Again Later.',
                            errorInfo: info,
                            // errorType: 2,
                            errorType:1
                        })
                    }
                }
            }
        })
    }
    onCopy(){
        let self = this;
        self.setState({
            copied: true
        })
        setTimeout( () => {
            self.setState({
                copied: false
            })
        }, 1000)
    }
    searchTransaction(e){
        e.preventDefault();
        let self = this;
        let str = self.state.searchKey
        let re = /^[a-zA-Z0-9]{40,64}$/;
        if (re.test(str)) {
            $.ajax({
                url: "/api/query_transactions/",
                dataType:"json",
                data: {
                    hash: str,
                },
                success: function(data){
                    if( data.status == "success" ) {
                        console.log(data)
                        self.setState({
                            showDetailModal: !self.state.showDetailModal,
                            successID: data.result.id,
                            successHash: data.result.hash,
                            successHeight: data.result.block_height,
                            successContent: data.result.content,
                        })

                    } else if ( data.status == "tx_failure" ) {
                        self.setState({
                            showFailureModal: !self.state.showFailureModal,
                            failContent: data.result.content,
                            failLog: data.result.log,
                        })
                    } else if ( data.status == "failure" ) {
                        if ( data.result == "trade not exists" ) {
                            self.setState({
                                showErrorModal: !self.state.showErrorModal,
                                errorTitle: self.state.lang=='zh'?'未找到交易。':'Transaction Not Found.',
                                errorInfo: self.state.lang=='zh'?'此交易不存在，请重新查询。':'The transaction you’re checking may not exist, try checking another one.',
                                errorType: 1,
                            })
                        } else {
                            let info = data.result;
                            info = info.replace(info[0],info[0].toUpperCase());
                            self.setState({
                                showErrorModal: !self.state.showErrorModal,
                                // errorTitle: self.state.lang=='zh'?'参数错误！':'Parameter error!',
                                errorTitle: self.state.lang=='zh'?'请稍候再试。':'Try Again Later.',
                                errorInfo: info,
                                errorType: 1,
                            })

                        }
                    }
                }
            })
        } else {
            self.setState({
                queryHint: 'Please input a valid Tx hash.'
            })
            setTimeout( () => {
                self.setState({
                    queryHint: ''
                })
            }, 3000)
        }

    }
      /**
     * Listen for changes in the search field
     * @param {e} event
     */
    onChangeSearchInput(e) {
        this.setState({
            searchKey: e.target.value
        })
    }
    hideModal(type){
        let self = this;
        if (type == 1) {
            self.setState ({
                showInputModal: !self.state.showInputModal,
            })
        } else if (type == 2) {
            self.setState ({
                showFailureModal: !self.state.showFailureModal,
            })
        } else if (type == 3) {
            self.setState ({
                showErrorModal: !self.state.showErrorModal,
            })
        } else if (type == 0) {
            self.setState ({
                showDetailModal: !self.state.showDetailModal,
            })
        }
    }
    componentWillUnmount() {
        this.setState = ()=>{
          return;
        };
    }
    render() {
       let self = this;
        return (
            <div className="generate-transaction">
                <p className="main-title" ><FormattedMessage id="titleTransactionTest"/></p>

                <p className="explaination"><FormattedMessage id="pTransactionTest"/></p>
                <a className="generate-btn" onClick={self.showInput.bind(self)}><FormattedMessage id="buttonTransactionTest"/></a>
                {/* <div className="tran-card">
                    <div className="text">
                        <p className="tran-name">Transaction #01</p>
                        <p className="tran-hint">Pending…</p>
                    </div>
                    <div className="check-btn">
                        <img src={require("../img/icon/inline/icon_check_disable@2x.png")} />
                        <Link to="/activities">Check Transaction</Link>
                    </div>
                </div> */}
                {
                    self.state.tranCardGroup && self.state.tranCardGroup.map(function(item, index) {
                        return (
                            <div className="tran-card" key={"item"+index}>
                                <div className="text">
                                    <p className="tran-name"> <img src={require('../img/icon/activities/icon_txTime@2x.png')}/>{item.time}</p>
                                    <p className="tran-hint"><FormattedMessage id="termSucceed"/></p>
                                </div>
                                <div className="check-btn success">
                                    <img src={require("../img/icon/inline/icon_check_enable@2x.png")} />
                                    <a onClick={self.checkDetail.bind(self, item.id)}><FormattedMessage id="btnCheckTransaction"/></a>
                                </div>
                            </div>
                        )
                    })
                }

                <div className="search-group">
                    <form onSubmit={self.searchTransaction.bind(self)} className="clearfix">
                        <input
                            id="nodelist-searchkey"
                            type="text"
                            placeholder="Search for Tx hash"
                            className="searchkey"
                            value={self.state.searchKey}
                            onChange={self.onChangeSearchInput.bind(this)}
                        />
                        <button className="nodelist-search" onClick={self.searchTransaction.bind(self)} >
                            <i className="fa fa-search" aria-hidden="true"></i>
                        </button>
                    </form>
                    { self.state.queryHint  && <p className="query-info">{self.state.queryHint}</p> }
                </div>
                 <CSSTransition
                        in={self.state.showDetailModal}
                        timeout={200}
                        classNames="modal-layer"
                        unmountOnExit
                        >
                        <section className="modal-layer">
                            <div className="mask" onClick={self.hideModal.bind(self,0)}></div>
                            <div className="modal detail-modal">
                                <div className="close-btn" onClick={()=>{self.setState({showDetailModal: !self.state.showDetailModal})}}>
                                    <img src={require('../img/icon/button_icon/close.png')} alt="关闭弹窗" />
                                </div>
                                <h2><FormattedMessage id="modalDetailTitle"/></h2>
                                <p><FormattedMessage id="modalDetailSubtitle"/></p>
                                <div className="detail-part1">
                                    <table>
                                        <tbody>
                                            <tr>
                                            <td width="40%">
                                                    <FormattedMessage id="termTransactionHash"/>
                                                    <CopyToClipboard text={self.state.successHash}
                                                        onCopy={ self.onCopy.bind(self) }>
                                                        { self.state.copied ?
                                                            <p className="copy-btn">
                                                                <img src={require('../img/icon/button_icon/icon_copied@2x.png')} alt="关闭弹窗" />
                                                                <span>Copied</span>
                                                            </p>    :
                                                            <p className="copy-btn">
                                                                <img src={require('../img/icon/button_icon/icon_copyTx@2x.png')} alt="关闭弹窗" />
                                                                <span>Copy</span>
                                                            </p>
                                                        }

                                                    </CopyToClipboard>
                                                </td>
                                                <td width="59%">
                                                    {self.state.successHash}
                                                    <p className="id-hint">
                                                        <img src={require('../img/icon/button_icon/icon_tips@2x.png')} alt="关闭弹窗" />
                                                        <span>Please backup the transaction hash if you intend to check the transaction later.</span>
                                                    </p>
                                                </td>
                                            </tr>
                                            {   self.state.successID &&
                                                <tr>
                                                    <td width="40%">ID</td>
                                                    <td width="59%">{self.state.successID}</td>
                                                </tr>
                                            }

                                            <tr>
                                                <td width="40%"><FormattedMessage id="termBlockHeight"/></td>
                                                <td width="59%">{self.state.successHeight}</td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </div>
                                <h5><FormattedMessage id="modalTransactionLabel" /></h5>
                                <div className="detail-part2">
                                    {self.state.successContent}
                                </div>
                            </div>
                        </section>
                </CSSTransition>
                <CSSTransition
                        in={self.state.showInputModal}
                        timeout={300}
                        classNames="modal-layer"
                        unmountOnExit
                        >
                    <section className="modal-layer">
                        <div className="mask" onClick={self.hideModal.bind(self,1)}></div>
                        <div className="modal input-modal">
                            <div className="close-btn" onClick={()=>{self.setState({showInputModal: !self.state.showInputModal})}}>
                                <img src={require('../img/icon/button_icon/close.png')} alt="关闭弹窗" />
                            </div>
                            <h2><FormattedMessage id="modalTransactionTitle"/></h2>
                            <p><FormattedMessage id="modalTransactionSubtitle"/></p>
                            <h5><FormattedMessage id="modalTransactionLabel"/></h5>
                            <textarea id="user-input" maxLength="255" placeholder={this.state.lang=="zh"?"请输入交易内容。":"Please enter your content."}
                            onChange={self.handleText.bind(self)}>
                            </textarea>
                            {
                                self.state.sendHint &&
                                <p className="send-hint">Please input content to contiune.</p>
                            }
                            {
                                self.state.sendController ?
                                <button style={{marginTop:self.state.sendHint ? '18px':'48px'}} onClick={self.sendTransaction.bind(self)}><FormattedMessage id="modalTransactionButton"/></button> :
                                <button style={{marginTop:self.state.sendHint ? '18px':'48px'}}><FormattedMessage id="modalTransactionButton"/></button>
                            }

                        </div>
                    </section>
                </CSSTransition>
                <CSSTransition
                        in={self.state.showFailureModal}
                        timeout={300}
                        classNames="modal-layer"
                        unmountOnExit
                        >
                    <section className="modal-layer">
                        <div className="mask" onClick={self.hideModal.bind(self,2)}></div>
                        <div className="modal fail-modal error-modal">
                            <div className="close-btn" onClick={()=>{self.setState({showFailureModal:!self.state.showFailureModal})}}>
                                <img src={require('../img/icon/button_icon/close.png')} alt="关闭弹窗" />
                            </div>
                            <img src={require('../img/icon/button_icon/icon_error_title@2x.png')} alt="查询错误" />
                            <h2><FormattedMessage id="modalFailedTitle"/></h2>
                            <p><FormattedMessage id="modalFailedSubtitle"/></p>
                            <h5><FormattedMessage id="modalTransactionLabel"/></h5>
                            <div className="detail-part2 top">
                                {self.state.failContent}
                            </div>
                            <h5><FormattedMessage id="modalFailedLog"/></h5>
                            <div className="detail-part2">
                                {self.state.failLog}
                            </div>
                        </div>
                    </section>
                </CSSTransition>
                <CSSTransition
                        in={self.state.showErrorModal}
                        timeout={300}
                        classNames="modal-layer"
                        unmountOnExit
                        >
                    <section className="modal-layer">
                        <div className="mask" onClick={self.hideModal.bind(self,3)}></div>
                        <div className="modal error-modal">
                            <div className="close-btn" onClick={()=>{self.setState({showErrorModal:!self.state.showErrorModal})}}>
                                <img src={require('../img/icon/button_icon/close.png')} alt="关闭弹窗" />
                            </div>
                            {self.state.errorType == 1 && <img src={require('../img/icon/button_icon/icon_warning_title@2x.png')} /> }
                            {/* {self.state.errorType == 2 && <img src={require('../img/icon/button_icon/icon_error_title@2x.png')} alt="查询错误" /> } */}
                            <h2 style={{color:(self.state.errorType == 1 ) ? '#A1FC3A':'#FF0075'}}>{self.state.errorTitle}</h2>
                            {/* <h2 style={self.state.errorType == 1 ? {color:'#A1FC3A'}: {color:'#FF0075'}}>{self.state.errorTitle}</h2> */}
                            <p>{self.state.errorInfo}</p>
                        </div>
                    </section>
                </CSSTransition>

                {/* <section className="modal-layer">
                    <div className="modal error-modal">
                        <div className="close-btn"><img src={require('../img/icon/button_icon/close.png')} alt="关闭弹窗" /></div>
                        <img src={require('../img/icon/button_icon/icon_error_title@2x.png')} alt="查询错误" />
                        <h2>Error Occurred!</h2>
                        <p>Check your internet connection, try reloading the webpage then check transactions again.</p>
                    </div>
                </section> */}
            </div>
        )
    }
}
export default injectIntl(GenerateTransaction)