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
import LineMark from "./charts/LineMark";
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
      Monitoring: {
        tps_monitoring: {
          trias:null,
          ethereum:null,
          hyperledger:null,
        },
        fault_accetpance_rate:{
          trias:null,
          ethereum:null,
          hyperledger:null,
        },
        faulty_nodes_list: {
          trias:null,
          ethereum:null,
          hyperledger:null,
        }
      },
      tps_dial: {
        trias:null,
        ethereum:null,
        hyperledger:null,
      },
      faulty_nodes_dial: {
        trias:null,
        ethereum:null,
        hyperledger:null,
      },
      fault_accetpance_rate_dial: {
        trias:null,
        ethereum:null,
        hyperledger:null,
      }
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
    this.getMonitoringInterval = setInterval(function() {
      self.getMonitoring();
      self.getTpsDial();
      self.getFaultyDial();
      self.getAccetpanceDial();
    }, 5000);
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

  

  getMonitoring() {
    var self = this;
    $.ajax({
      url: "/api/data_monitoring/",
      type: "get",
      dataType: "json",
      data: {},
      success: function(data) {
        self.setState({
          Monitoring: data.result
        });
      }
    });
  }
  getTpsDial() {
    var self = this;
    $.ajax({
      url: "/api/tps/",
      type: "get",
      dataType: "json",
      data: {},
      success: function(data) {
        self.setState({
          tps_dial: data.result
        });
      }
    });
  }
  getFaultyDial() {
    var self = this;
    $.ajax({
      url: "/api/faulty_nodes/",
      type: "get",
      dataType: "json",
      data: {},
      success: function(data) {
        self.setState({
          faulty_nodes_dial: data.result
        });
      }
    });
  }
  getAccetpanceDial() {
    var self = this;
    $.ajax({
      url: "/api/fault_accetpance_rate/",
      type: "get",
      dataType: "json",
      data: {},
      success: function(data) {
        self.setState({
          fault_accetpance_rate_dial: data.result
        });
      }
    });
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
            <LineMark
              name="TPS Monitoring"
              data={this.state.Monitoring.tps_monitoring || null}
              dial={this.state.tps_dial || null}
            />
            <LineMark
              name="Fault Accetpance Rate"
              data={this.state.Monitoring.fault_accetpance_rate || null}
              dial={this.state.fault_accetpance_rate_dial || null}
            />
            <LineMark
              name="Faulty Nodes"
              data={this.state.Monitoring.faulty_nodes_list || null}
              dial={this.state.faulty_nodes_dial || null}
            />
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
