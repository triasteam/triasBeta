import React from "react";
import LineMark from "./LineMark";
import $ from "jquery";

/**
 * Component for the line chart collection
 */
export default class LineMarkCollection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      }
    };
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
      data: {},
      success: function(data) {
        self.setState({
          Monitoring: data.result
        });
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
      data: {},
      success: function(data) {
        self.setState({
          tps_dial: data.result
        });
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
      data: {},
      success: function(data) {
        self.setState({
          faulty_nodes_dial: data.result
        });
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
    self.getMonitoringInterval = setInterval(function() {
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
   * When the component will be unmounted.
   * Clear the intervals
   */
  componentWillUnmount() {
    clearInterval(this.getMonitoringInterval);
  }

  /**
   * Before a mounted component receives new props, reset some state.
   * @param {Object} nextProps new props
   */
  componentWillReceiveProps(nextProps) {}

  render() {
    return (
      <div>
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
    );
  }
}
