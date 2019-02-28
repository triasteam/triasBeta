import React from "react"
import $ from 'jquery'
// import ES6Promise from 'es6-promise'
// ES6Promise.polyfill() //let IE6 support Promise object
import {injectIntl, intlShape, FormattedMessage } from 'react-intl'; /* react-intl imports */
import GeneralStatics from "./GeneralStatics";
import RightPart from "./RightPart";
import LineMark from './charts/LineMark'

/* Component for node status page */
class ChainStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dotsNum: 100, // number of dots in timer graph
            timeLeft: 691200, // date and time for countdown to
            rowsPerPage: 50,        // maximum number of rows per page in the table
            totalItemsCount: 0, // total number of rows in the table
            totalPagesCount: 1,   // total number of pages
            currentPage: 1,         // current page number
            dangerIp: localStorage.getItem('dangerIp') || '',
            // lang: this.props.intl.locale,    // current locale language
        }
    }

    // /**
    //  * Before a mounted component receives new props, reset some state.
    //  * @param {Object} nextProps new props
    //  */
    // componentWillReceiveProps(nextProps){
    //     // if locale language will be changed, reset lang state
    //     if(this.state.lang != nextProps.intl.locale){
    //         this.setState({
    //             lang: nextProps.intl.locale
    //         })
    //     }
    // }

    /**
     * After the component is mounted.
     * - Start the countdown clock.
     * - Get data for this page.
     */
    componentDidMount(){
        var self = this
        this.setTimer()
        this.getLadderList(this.state.currentPage, this.state.rowsPerPage)
        this.ladderListInterval = setInterval(function(){
            self.getLadderList(self.state.currentPage, self.state.rowsPerPage)
        },5000) 
        // this.getDangerIp()
        // this.dangerIpInterval = setInterval(function(){
        //     self.getDangerIp()
        // },4000)
    }

    /**
     * Get data for ladder tournament table.
     * @param {int} currentPage current page number
     * @param {int} rowsPerPage maximum number of rows per page
     */
    getLadderList(currentPage, rowsPerPage){
        var self = this
        $.ajax({
            url: '/api/block_index/trust_rank/',
            type: 'get',
            dataType: 'json',
            data: {
                curr_page: currentPage,
                page_size: rowsPerPage,
            },
            success: function (data) {                
                if(data && data.code == 200){
                    if(self.ladderListInterval && data.danger_ips.length && self.state.dangerIp != data.danger_ips[0]){
                        self.ladderListInterval = clearInterval(self.ladderListInterval)
                        setTimeout(function(){
                            self.getLadderList(self.state.currentPage, self.state.rowsPerPage)
                            self.ladderListInterval = setInterval(function(){
                                self.getLadderList(self.state.currentPage, self.state.rowsPerPage)
                            },5000)
                        }, 60000)
                        localStorage.setItem('dangerIp',data.danger_ips[0])
                        self.setState({
                            dangerIp: data.danger_ips[0]
                        })
                    }else{
                        self.setState({
                            ladderList: data.data,
                            totalItemsCount: data.total_item,
                            totalPagesCount: data.total_page,
                        })
                    }                    
                }else{
                    localStorage.setItem('dangerIp','')
                    self.setState({
                        dangerIp: '',
                    }) 
                }
            }
            
        })
    }

    getDangerIp(){
        var self = this
        $.ajax({
            url: '/api/block_index/danger_ips/',
            type: 'get',
            dataType: 'json',
            success: function (data) {
            // var data = {
            //     "code": 200,
            //     "danger_ips": [
            //         "35.189.62.83"
            //     ],
            //     "count": 1
            // }
                if(data.code==200 && data.count>0){
                    if(self.ladderListInterval && self.state.dangerIp != data.danger_ips[0]){
                        self.ladderListInterval = clearInterval(self.ladderListInterval)
                        setTimeout(function(){
                            self.getLadderList(self.state.currentPage, self.state.rowsPerPage)
                            self.ladderListInterval = setInterval(function(){
                                self.getLadderList(self.state.currentPage, self.state.rowsPerPage)
                            },3000)
                        }, 60000)
                    }                    
                    self.setState({
                        dangerIp: data.danger_ips[0],
                    })
                }else{
                    self.setState({
                        dangerIp: '',
                    }) 
                }                
            }
        })
    }


    /**
     * Set countdown digital clock
     */
    setTimer(){
        var self=this
        // start the clock.
        $.ajax({
            url: '/api/block_index/count_down/',
            type: 'get',
            dataType: 'json',
            data: {
            },
            success: function (data) {
                self.setState({
                    dotsNum: Math.floor(data.data.value * 100),
                    timeLeft: data.data.time
                })
                $('.clock').timeTo({
                    seconds: data.data.time,
                    displayDays: 2,
                    displayCaptions: true,
                    fontSize: 36,
                    captionSize: 14,
                });
            }
        })
        
    }

    /**
     * Update maximum number of rows per page
     * @param {int} num new value
     */
    setRowsPerPage(num){
        this.setState({
            rowsPerPage: num
        })
        // get new data and update state.
        this.getLadderList(this.state.currentPage, num)
    }

    /**
     * On select page number by clicking buttons in the pagination
     * @param {int} pagenum new page number
     */
    onSelectPage(pagenum){
        this.setState({
            currentPage: pagenum
        })
        this.getLadderList(pagenum, this.state.rowsPerPage)
        //console.log(pagenum)
    }

    /**
     * Event handler for the change event of the page number input area.
     * Control the input of page number:
     * - not empty
     * - positive integer
     * - no more than the maximum number of pages
     * @param {Object} e change evnet
     */
    onChangePageInput(e){
        var re = /^[0-9]+$/
        var pagenum = e.target.value      // get the page number input
        if (pagenum != "" && (!re.test(pagenum) || pagenum == 0 || pagenum > this.state.totalPagesCount)) {
            $('#inputPageNum').val('');   // clear the contents of the input box
        }
    }

    /**
     * Event handler for the keydown event of the page number input area.
     * Listening to the Enter button event.
     * @param {Object} e keydown event
     */
    onPageInputKeyDown(e){
        if (e.keyCode === 13) { // if Enter button is pressed
            this.handleJumpPage()
        }
    }

    /**
     * When jump to another page 
     */
    handleJumpPage(){
        var pagenum = parseInt($('#inputPageNum').val())
        this.setState({
            currentPage: pagenum
        })
        this.getLadderList(pagenum, this.state.rowsPerPage)
        //console.log('jump')
    }
    /**
     * When the component will be unmounted.
     * Clear the intervals 
     */
    componentWillUnmount(){
        var self = this
        this.ladderListInterval = clearInterval(self.ladderListInterval)
        // this.dangerIpInterval = clearInterval(self.dangerIpInterval)
    }


    render() {
        var self=this
        var tempList = new Array(100)
        for ( var i=0; i<100; i++){
            tempList[i]=i
        }
        return (
            <div className="status-page">
                 <section className="bottom-group clearfix">
                    <div className="left-part">
                        <GeneralStatics/>
                        <LineMark  name="TPS Monitoring"/>
                        <LineMark name="TPS Monitoring"/>
                        <LineMark name="TPS Monitoring"/>
                    </div>
                    <RightPart />
                </section>
            </div>
        )
    }
}
/* Inject intl to ChainStatus props */
const propTypes = {
    intl: intlShape.isRequired,
};
ChainStatus.propTypes = propTypes
export default injectIntl(ChainStatus)