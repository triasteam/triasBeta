import React from "react"
import Modal from "react-bootstrap"
import { Link } from 'react-router-dom'
// import ES6Promise from 'es6-promise'
// ES6Promise.polyfill() //关键代码,让ie识别promise对象!
import {injectIntl, intlShape, FormattedMessage } from 'react-intl'; /* react-intl imports */
import $ from 'jquery'
import { func } from "prop-types";


/**
 * RightPart components which displays:
 */
export default class GenerateTranstaction extends React.Component {
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
            errorInfo:''
        }
    }
    componentWillMount() {
    }

    componentDidMount() {
        // console.log('rrrrrr',this.props.currentEventIndex)
        // this.setState({
        // })
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
                            errorTitle: 'Try Again Latter.',
                            errorInfo: 'The transaction is being generated in the background, please wait a few seconds.'
                        })
                    } else {
                        let info = data.result;
                        info = info.replace(info[0],info[0].toUpperCase());
                        self.setState({
                            showErrorModal: !self.state.showErrorModal,
                            errorTitle: 'Error Occurred!',
                            errorInfo: info
                        })
                        
                    }
                    
                }
            }
        })
    }
    /**
     * Before a mounted component receives new props, reset some state.
     * @param {Object} nextProps new props
     */
    componentWillReceiveProps(nextProps) {
        // console.log('rrrrr',this.props.currentInfo,nextProps.currentInfo)
        // if (JSON.stringify(nextProps.currentInfo) != JSON.stringify(this.props.currentInfo)) {
        //     this.setState({
        //         currentInfo: nextProps.currentInfo
        //     })
        // }
    }

    render() {
       let self = this;
        return (
            <div className="generate-transaction">
                <p className="main-title">Transaction Test</p>
                <p className="explaination">Generate new transtactions to start. When transactions is finished, you’ll be able to check the details.</p>
                <a className="generate-btn" onClick={self.showInput.bind(self)}>Generate New Transtaction</a>
                {/* <div className="tran-card">
                    <div className="text">
                        <p className="tran-name">Transaction #01</p>
                        <p className="tran-hint">Pending…</p>
                    </div>
                    <div className="check-btn">
                        <img src={require("../img/icon/inline/icon_check_disable@2x.png")} />
                        <Link to="/activities">Check Transtaction</Link>
                    </div>
                </div> */}
                {
                    self.state.tranCardGroup && self.state.tranCardGroup.map(function(item, index) {
                        return (
                            <div className="tran-card" key={"item"+index}>
                                <div className="text">
                                    <p className="tran-name">{'Transaction #0' + (index+1)}</p>
                                    <p className="tran-hint">Succeed!</p>
                                </div>
                                <div className="check-btn success">
                                    <img src={require("../img/icon/inline/icon_check_enable@2x.png")} />
                                    <a onClick={self.checkDetail.bind(self, item.id)}>Check Transtaction</a>
                                </div>
                            </div>
                        )
                    })
                }
                { self.state.showDetailModal &&
                    <section className="modal-layer">
                        <div className="modal detail-modal">
                            <div className="close-btn" onClick={()=>{self.setState({showDetailModal: !self.state.showDetailModal})}}>
                                <img src={require('../img/icon/button_icon/close.png')} alt="关闭弹窗" />
                            </div>
                            <h2>Transactions Detail</h2>
                            <p>Check complete, the transaction is complete</p>
                            <div className="detail-part1">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td width="33%">Transaction ID</td>
                                            <td width="66%">{self.state.successID}</td>
                                        </tr>
                                        <tr>
                                            <td width="33%">Transactions Hash</td>
                                            <td width="66%">{self.state.successHash}</td>
                                        </tr>
                                        <tr>
                                            <td width="33%">Block Height</td>
                                            <td width="66%">{self.state.successHeight}</td>
                                        </tr>
                                        
                                    </tbody>
                                </table>
                            </div>
                            <h5>Content Included</h5>
                            <div className="detail-part2">
                                {self.state.successContent}
                            </div>
                        </div>
                    </section>
                }

                { self.state.showInputModal &&
                    <section className="modal-layer">
                        <div className="modal input-modal">
                            <div className="close-btn" onClick={()=>{self.setState({showInputModal: !self.state.showInputModal})}}>
                                <img src={require('../img/icon/button_icon/close.png')} alt="关闭弹窗" />
                            </div>
                            <h2>Enter Your Content</h2>
                            <p>You can enter up to 255 characters.</p>
                            <h5>Content Included</h5>
                            <textarea id="user-input" placeholder="Please enter your content."
                             onChange={self.handleText.bind(self)}>
                            </textarea>                       
                            <button onClick={self.sendTransaction.bind(self)}>Send Transaction</button>
                        </div>
                    </section>
                }
                { self.state.showFailureModal &&
                    <section className="modal-layer">
                        <div className="modal fail-modal error-modal">
                            <div className="close-btn" onClick={()=>{self.setState({showFailureModal:!self.state.showFailureModal})}}>
                                <img src={require('../img/icon/button_icon/close.png')} alt="关闭弹窗" />
                            </div>
                            <img src={require('../img/icon/button_icon/icon_error_title@2x.png')} alt="查询错误" />
                            <h2>Transaction Failed.</h2>
                            <p>Please review the transaction log then try again.</p>
                            <h5>Content Included</h5>
                            <div className="detail-part2 top">
                                {self.state.failContent}
                            </div>
                            <h5>Transaction Log</h5>
                            <div className="detail-part2">
                                {self.state.failLog}
                            </div>
                        </div>
                    </section>
                }
                { self.state.showErrorModal &&
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
                }

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
