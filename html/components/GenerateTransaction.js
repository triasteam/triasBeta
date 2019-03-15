import React from "react"
import Modal from "react-bootstrap"
import { Link } from 'react-router-dom'
// import ES6Promise from 'es6-promise'
// ES6Promise.polyfill() //关键代码,让ie识别promise对象!
import {injectIntl, intlShape, FormattedMessage } from 'react-intl'; /* react-intl imports */
import $ from 'jquery'
import { func } from "prop-types";
import { CSSTransition } from 'react-transition-group';
/**
 * RightPart components which displays:
 */
class GenerateTransaction extends React.Component {
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
            lang: this.props.intl.locale, // current locale language
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
                    item = { 
                        status: 1,
                        id: data.result.id
                    }
                    group.push(item);
                    group = group.concat(self.state.tranCardGroup);
                    if (group.length > 3) {
                        group = group.slice(0,3);
                    }
                    self.setState({
                        tranCardGroup: group,
                        showInputModal: !self.state.showInputModal,
                    })
                    
                    // this.setstate({
                    //     ...this.state.tranCardGroup[0],
                    //     id: data.result.id
                    // })

                }
            }
        })
    }
    showInput() {
        this.setState({showInputModal: !this.state.showInputModal})
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
            url: "/api/query_transactions/",
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
                            errorTitle: self.state.lang=='zh'?'请稍候再试。':'Try Again Latter.',
                            errorInfo: self.state.lang=='zh'?'此交易正在后台生成，请稍后再试。':'The transaction is being generated in the background, please wait a few seconds.'
                        })
                    } else {
                        let info = data.result;
                        info = info.replace(info[0],info[0].toUpperCase());
                        self.setState({
                            showErrorModal: !self.state.showErrorModal,
                            errorTitle: self.state.lang=='zh'?'发生错误！':'Error Occurred!',
                            errorInfo: info
                        })
                        
                    }
                    
                }
            }
        })
    }

    componentWillUnmount() {
        this.setState = (state,callback)=>{
          return;
        };
    }
    render() {
       let self = this;
        return (
            <div className="generate-transaction">
                <p className="main-title"><FormattedMessage id="titleTransactionTest"/></p>
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
                                    <p className="tran-name">{'Transaction #0' + (index+1)}</p>
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
                 <CSSTransition
                        in={self.state.showDetailModal}
                        timeout={300}
                        classNames="modal-layer"
                        unmountOnExit
                        >
                        <section className="modal-layer">
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
                                                <td width="33%"><FormattedMessage id="termTransaction"/> ID</td>
                                                <td width="66%">{self.state.successID}</td>
                                            </tr>
                                            <tr>
                                                <td width="33%"><FormattedMessage id="termTransactionHash"/></td>
                                                <td width="66%">{self.state.successHash}</td>
                                            </tr>
                                            <tr>
                                                <td width="33%"><FormattedMessage id="termBlockHeight"/></td>
                                                <td width="66%">{self.state.successHeight}</td>
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
                            <button onClick={self.sendTransaction.bind(self)}><FormattedMessage id="modalTransactionButton"/></button>
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
                        <div className="modal error-modal">
                            <div className="close-btn" onClick={()=>{self.setState({showErrorModal:!self.state.showErrorModal})}}>
                                <img src={require('../img/icon/button_icon/close.png')} alt="关闭弹窗" />
                            </div>
                            <img src={require('../img/icon/button_icon/icon_error_title@2x.png')} alt="查询错误" />
                            <h2>{self.state.errorTitle}</h2>
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

/* Inject intl to GenerateTransaction props */
const propTypes = {
    intl: intlShape.isRequired,
};
GenerateTransaction.propTypes = propTypes
export default injectIntl(GenerateTransaction)