import React from "react";
import LineMark from "./LineMark";
import $ from "jquery";
import { injectIntl, intlShape } from "react-intl"; /* react-intl imports */

/**
 * Component for the line chart collection
 */
class LineMarkCollection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: this.props.intl.locale, // current locale language
      Monitoring: {
        tps_monitoring: {
          trias: null,
          ethereum: null,
          hyperledger: null,
          event_list: []
        },
        fault_accetpance_rate: {
          trias: null,
          ethereum: null,
          hyperledger: null,
          event_list: []
        },
        faulty_nodes_list: {
          trias: null,
          ethereum: null,
          hyperledger: null,
          event_list: []
        }
      },
      tps_dial: {
        trias: null,
        ethereum: null,
        hyperledger: null
      },
      faulty_nodes_dial: {
        trias: null,
        ethereum: null,
        hyperledger: null
      },
      fault_accetpance_rate_dial: {
        trias: null,
        ethereum: null,
        hyperledger: null
      },
      showAll: true,
      showTPS: true,
      showRate: true,
      showNodes: true,
    };
  }

  /**
   * Before a mounted component receives new props, reset some state.
   * @param {Object} nextProps new props
   */
  componentWillReceiveProps(nextProps) {
    // if locale language will be changed, reset lang state
    if (this.state.lang != nextProps.intl.locale) {
      this.setState({
        lang: nextProps.intl.locale
      });
    }
  }

  /**
   * - Get data for three line chart.
   */
  getMonitoring() {
    var self = this;
    $.ajax({
      url: "/api/data_monitoring/",
      type: "get",
      dataType: "json",
      success: function(data) {
        if ( data.status == "success" ) {
          self.setState({
            showAll: true,
            Monitoring: data.result
          });
          if ( JSON.stringify(data.result.tps_monitoring.trias) == "{}" ) {
            self.setState({
              showTPS: false
            })
          } else if ( JSON.stringify(data.result.fault_accetpance_rate.trias) == "{}" ) {
            self.setState({
              showRate: false
            })
          } else if ( JSON.stringify(data.result.faulty_nodes_list.trias) == "{}" ) {
            self.setState({
              showNodes: false
            })
          }
        } else {
          self.setState({
            showAll: false,
          })
        }
        
      },
      error(err) {
        console.log(err);
      }
    });
  }

  /**
   * - Get data for TPS Monitoring pie chart.
   */
  getTpsDial() {
    var self = this;
    $.ajax({
      url: "/api/tps/",
      type: "get",
      dataType: "json",
      success: function(data) {
        self.setState({
          tps_dial: data.result
        });
      },
      error(err) {
        console.log(err);
      }
    });
  }

  /**
   * - Get data for Faulty Nodes pie chart.
   */
  getFaultyDial() {
    var self = this;
    $.ajax({
      url: "/api/faulty_nodes/",
      type: "get",
      dataType: "json",
      success: function(data) {
        self.setState({
          faulty_nodes_dial: data.result
        });
      },
      error(err) {
        console.log(err);
      }
    });
  }

  /**
   * - Get data for Fault Accetpance Rate pie chart.
   */
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
      },
      error(err) {
        console.log(err);
      }
    });
  }

  /**
   * After the component is mounted.
   * - Request data line chart start timing for 5 seconds
   * - Get data for this page.
   */
  componentDidMount() {
    var self = this;
    self.getMonitoring();
    self.getTpsDial();
    self.getFaultyDial();
    self.getAccetpanceDial();
    self.getMonitoringInterval = setInterval(function() {
      self.getMonitoring();
      self.getTpsDial();
      self.getFaultyDial();
      self.getAccetpanceDial();
    }, 5000);
  }

  /**
   * When the component will be unmounted.
   * Clear the intervals
   */
  componentWillUnmount() {
    if (this.getMonitoringInterval) {
      clearInterval(this.getMonitoringInterval);
    }
    this.setState = (state,callback)=>{
      return;
    };
    
  }

  render() {
    return (
      <div>
        <LineMark
          name={this.state.lang == "zh" ? "TPS 监控" : "TPS Monitoring"}
          data={this.state.Monitoring.tps_monitoring}
          dial={this.state.tps_dial}
          unit={"Unit"}
          showAll={this.state.showAll}
          showThis={this.state.showTPS}
        />
        <LineMark
          name={this.state.lang == "zh" ? "容错率" : "Fault Acceptance Rate"}
          data={this.state.Monitoring.fault_accetpance_rate}
          dial={this.state.fault_accetpance_rate_dial}
          unit={"%"}
          showAll={this.state.showAll}
          showThis={this.state.showRate}
        />
        <LineMark
          name={this.state.lang == "zh" ? "错误节点" : "Faulty Nodes"}
          data={this.state.Monitoring.faulty_nodes_list}
          dial={this.state.faulty_nodes_dial}
          unit={"Unit"}
          showAll={this.state.showAll}
          showThis={this.state.showNodes}
        />
      </div>
    );
  }
}

/* Inject intl to LineMarkCollection props */
const propTypes = {
  intl: intlShape.isRequired
};
LineMarkCollection.propTypes = propTypes;
export default injectIntl(LineMarkCollection);
