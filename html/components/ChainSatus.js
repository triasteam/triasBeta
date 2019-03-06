import React from "react";
import $ from "jquery";
// import ES6Promise from 'es6-promise'
// ES6Promise.polyfill() //let IE6 support Promise object
import {
  injectIntl,
  intlShape,
  FormattedMessage
} from "react-intl"; /* react-intl imports */
import GeneralStatics from "./GeneralStatics";
import RightPart from "./RightPart";
import LineMarkCollection from "./charts/LineMarkCollection";
import NodesGraph from "./NodesGraph";
import EventHappenSwiper from "./common/EventHappenSwiper"
/* Component for node status page */
class ChainStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dotsNum: 100, // number of dots in timer graph
      timeLeft: 691200, // date and time for countdown to
      rowsPerPage: 50, // maximum number of rows per page in the table
      totalItemsCount: 0, // total number of rows in the table
      totalPagesCount: 1, // total number of pages
      currentPage: 1, // current page number
      dangerIp: localStorage.getItem("dangerIp") || "",
      // lang: this.props.intl.locale,    // current locale language
    };
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
  componentDidMount() {
    var self = this;
    // this.getMonitoringInterval = setInterval(function() {
    //   self.getMonitoring();
    //   self.getTpsDial();
    //   self.getFaultyDial();
    //   self.getAccetpanceDial();
    // }, 5000);
    setTimeout(() => {
      self.getMonitoring();
      self.getTpsDial();
      self.getFaultyDial();
      self.getAccetpanceDial();
    }, 0);
  }

  /**
   * Update maximum number of rows per page
   * @param {int} num new value
   */
  setRowsPerPage(num) {
    this.setState({
      rowsPerPage: num
    });
    // get new data and update state.
    this.getLadderList(this.state.currentPage, num);
  }

  /**
   * On select page number by clicking buttons in the pagination
   * @param {int} pagenum new page number
   */
  onSelectPage(pagenum) {
    this.setState({
      currentPage: pagenum
    });
    this.getLadderList(pagenum, this.state.rowsPerPage);
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
  onChangePageInput(e) {
    var re = /^[0-9]+$/;
    var pagenum = e.target.value; // get the page number input
    if (
      pagenum != "" &&
      (!re.test(pagenum) ||
        pagenum == 0 ||
        pagenum > this.state.totalPagesCount)
    ) {
      $("#inputPageNum").val(""); // clear the contents of the input box
    }
  }

  /**
   * Event handler for the keydown event of the page number input area.
   * Listening to the Enter button event.
   * @param {Object} e keydown event
   */
  onPageInputKeyDown(e) {
    if (e.keyCode === 13) {
      // if Enter button is pressed
      this.handleJumpPage();
    }
  }

  /**
   * When jump to another page
   */
  handleJumpPage() {
    var pagenum = parseInt($("#inputPageNum").val());
    this.setState({
      currentPage: pagenum
    });
    this.getLadderList(pagenum, this.state.rowsPerPage);
    //console.log('jump')
  }

  

 

  /**
   * When the component will be unmounted.
   * Clear the intervals
   */
  componentWillUnmount() {
    var self = this;
    this.ladderListInterval = clearInterval(self.ladderListInterval);
    // this.dangerIpInterval = clearInterval(self.dangerIpInterval)
  }

  render() {
    var self = this;
    var tempList = new Array(100);
    for (var i = 0; i < 100; i++) {
      tempList[i] = i;
    }
    return (
      <div className="status-page">
        <EventHappenSwiper/>
        <NodesGraph />
        <section className="bottom-group clearfix">
          <div className="left-part">
            <GeneralStatics />
            <LineMarkCollection />
          </div>
          <RightPart />
        </section>
      </div>
    );
  }
}
/* Inject intl to ChainStatus props */
const propTypes = {
  intl: intlShape.isRequired
};
ChainStatus.propTypes = propTypes;
export default injectIntl(ChainStatus);
