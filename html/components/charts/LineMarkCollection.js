import React from "react";
import LineMark from "./LineMark";
import $ from "jquery";
/* 自定义静态折线图 */
export default class LineMarkCollection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Monitoring: {
        tps_monitoring: {
          trias: null,
          ethereum: null,
          hyperledger: null
        },
        fault_accetpance_rate: {
          trias: null,
          ethereum: null,
          hyperledger: null
        },
        faulty_nodes_list: {
          trias: null,
          ethereum: null,
          hyperledger: null
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

  //组件已经成功被渲染
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
  //当组件props将要发生变化时
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
