import React from "react"
import { BrowserRouter as Router, Route, Link, NavLink, Redirect, Switch } from 'react-router-dom'
// import StayTuned from "./common/StayTuned"
import ToggleList from './common/ToggleList'    //import drop-down list component
// import ES6Promise from 'es6-promise'
// ES6Promise.polyfill() //关键代码,让ie识别promise对象!
import { addLocaleData, IntlProvider, FormattedMessage } from 'react-intl'; /* react-intl imports */
/* React Intl relies on locale data to support its plural and relative-time formatting features. */
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import zh_CN from "../locale/zh_CN"     // import defined messages in Chinese
import en_US from "../locale/en_US"     // import defined messages in English
/* Import basic support for another locale if needed */
addLocaleData([...en, ...zh]);  // load React Intl's locale data for multiple languages
import $ from 'jquery'

import ChainSatus from "./ChainSatus";
import Activities from "./Activities";
import NodeList from "./NodeList";


import HeadLine from "./common/HeadLine";

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lang: 'en',
            pathName: '',
            eventList: [],
            currentEventIndex: -1,
            currentInfo: {
                selectedEvent: {  
                    name: "",
                    time: "",
                    group: 0,
                },
                all_nodes_num: 0,  
                fault_nodes_num: 0,  
                current_index: -1, 
            }
        }
        // options for internationalisation
        this.languageList = [{
            name: "中文",
            value: 'zh'
        }, {
            name: "English",
            value: 'en'
        }]
    }

    /**
     * Change language
     * @param {String} lang new language
     */
    changeLanguage(lang) {
        this.setState({
            lang: lang
        })
        // $.ajax({
        //     url:"/api/language/language",
        //     type: "POST",
        //     dataType: "json",
        //     data:{
        //         language: lang === 'en'?1:0
        //     },
        //     success: function(data){
        //         console.log(data)
        //     }
        // })
        let pathArr = window.location.href.split('/')
        switch(pathArr[pathArr.length-1]){
            case '':
            this.setState({
                pathName: lang==='en'?'Chain Status':'区块链状态'
            });
            break;
            case 'activities':
            this.setState({
                pathName: lang==='en'?'Activities':'活动通知'
            });
            break;
            case 'nodes':
            this.setState({
                pathName: lang==='en'?'Node List':'节点列表'
            });
            break;
        }
    }

    changeHeadline (name){
        this.setState({
            pathName: name
        });
    }
    onLoadHeadNameBar(){
        var self=this
        let pathArr = window.location.href.split('/')
        switch(pathArr[pathArr.length-1]){
            case '':
            this.setState({
                pathName: self.state.lang==='en'?'Chain Status':'区块链状态'
            });
            break;
            case 'activities':
            this.setState({
                pathName: self.state.lang==='en'?'Activities':'活动通知'
            });
            break;
            case 'nodes':
            this.setState({
                pathName: self.state.lang==='en'?'Node List':'节点列表'
            });
            break;
        }
    }
    getTimeEvent() {
        var self = this
        $.ajax({
            url: '/api/event_list/ ',
            type: 'get',
            dataType: 'json',               //GET方式时,表单数据被转换成请求格式作为URL地址的参数进行传递
            data: {
            },
            success: function (data) {
                // console.log('this is',data)
                if (data.status == 'success') {
                    self.setState({
                        currentEventIndex: data.result.current_index,
                        eventList: data.result.event_list
                    })
                    // Call the function that refreshes the next event
                    self.getRefreshEventTime()
                    if(data.result.current_index == -1){
                        self.setState({
                            currentInfo: {
                                selectedEvent: {  
                                    name: "",
                                    time: "",
                                    group: 0,
                                },
                                all_nodes_num: 0,  
                                fault_nodes_num: 0,  
                                current_index: -1, 
                            }
                
                        })
                    } else {
                        let k = data.result.current_index;
                        self.setState({
                            currentInfo: {
                                selectedEvent: {  
                                    name: data.result.event_list[k].name,
                                    time: data.result.event_list[k].start,
                                    group: 1,
                                },
                                all_nodes_num: data.result.all_nodes_num,  
                                fault_nodes_num: data.result.fault_nodes_num,  
                                current_index: data.result.current_index, 
                            }
                        })
                    }
                } else {
                    self.setState({
                        currentEventIndex: -1,
                        eventList: [],
                        currentInfo: {
                            selectedEvent: {  
                                name: "",
                                time: "",
                                group: 0,
                            },
                            all_nodes_num: 0,  
                            fault_nodes_num: 0,  
                            current_index: -1, 
                        }
                    })
                }
            },
            error: function () {
                self.setState({
                    currentEventIndex: -1,
                    eventList: []
                })
            }
        })
    }
    componentDidMount(){
        this.onLoadHeadNameBar();
        this.getTimeEvent();
    }
    /**
     * Deal with the next thing to a certain point in time
     */
    getRefreshEventTime(){
        // The list is not empty && What is happening is not the last event
        if(this.state.eventList.length >0 && this.state.currentEventIndex < this.state.eventList.length -1 ){
            // Gets the timestamp when the next event occurs
            let shouldUpdateTime = this.state.eventList[this.state.currentEventIndex+1].interval + 3
            // Called at the point in time that the next event occurs
            this.timeOut = setTimeout(()=>{
                // update headLine 
                this.getTimeEvent()
                clearTimeout(this.timeOut)
            },shouldUpdateTime * 1000)
        }
    }
    componentWillUnmount = () => {
        this.setState = (state,callback)=>{
          return;
        };
    }
    render() {
        let messages = {}
        messages['en'] = en_US;
        messages['zh'] = zh_CN;

        this.languageList = [{
            ele: <span onClick={()=>this.changeLanguage('zh')} className={this.state.lang==='zh'?'active':''}>
                <i className="fas fa-globe-americas"></i>
                中文
            </span>
        }, {
            ele: <span  onClick={()=>this.changeLanguage('en')} className={this.state.lang==='en'?'active':''}>
                <i className="fas fa-globe-americas"></i>
                English
            </span>
        }]

        return (
            <IntlProvider locale={this.state.lang} messages={messages[this.state.lang]}>
                <Router>
                    <div>
                        <header className="header clearfix">
                            <div className="clearfix">
                                <div className="logo">
                                    <Link to="/">
                                        <img src={require("../img/logo.png")} alt="" />
                                    </Link>
                                </div>
                                <ul className="nav">
                                    <li>
                                        <NavLink exact to="/" activeClassName="active" onClick={this.changeHeadline.bind(this,this.state.lang==='en'?'Chain Status':'区块链状态')}>
                                            <FormattedMessage id="headerNav1" />
                                        </NavLink>
                                    </li>
                                    <li>
                                        {/* No exact attribute. Be active when url is like '/activities...'.*/}
                                        <NavLink to="/activities" activeClassName="active" onClick={this.changeHeadline.bind(this,this.state.lang==='en'?'Activities':'活动通知')}>
                                            <FormattedMessage id="termActivities" />
                                        </NavLink>
                                    </li>
                                    <li>
                                        {/* No exact attribute. Be active when url is like '/nodes...'.*/}
                                        <NavLink to="/nodes" activeClassName="active" onClick={this.changeHeadline.bind(this,this.state.lang==='en'?'Node List':'节点列表')}>
                                            <FormattedMessage id="termNodeList" />
                                        </NavLink>
                                    </li>
                                </ul>
                                <ul className="nav pull-right">
                                    <li>
                                        <a href="https://www.trias.one/" target="blank">
                                            <FormattedMessage id="triasHomepage" />
                                        </a>
                                    </li>
                                    <li className='lang'>
                                        <ToggleList
                                            listID="langlist"
                                            itemsToSelect={this.languageList}
                                            name={<span><img src={require("../img/globe-americas-solid.svg")}></img><img className="angle-down" src={require("../img/angle-down-solid.svg")}></img></span>} />
                                    </li>
                                </ul>
                            </div>
                        </header>
                        <HeadLine 
                            headBarName = {this.state.pathName} 
                            eventList = {this.state.eventList}
                            currentEventIndex = {this.state.currentEventIndex}/>
                        <section className="main">
                            <Switch>
                                <Route exact path="/"  render={props => <ChainSatus currentInfo = {this.state.currentInfo} {...props} />}  />
                                <Route exact path="/activities" component={Activities} />
                                <Route exact path="/nodes" component={NodeList} />
                                <Redirect to="/" />{/* when no routes above matched, redirect to ChainStatus page */}
                                {/* <Route exact path="/stayTuned" component={StayTuned} /> */}
                            </Switch>
                        </section>
                        
                    </div>
                </Router>
            </IntlProvider>
        )
    }
}