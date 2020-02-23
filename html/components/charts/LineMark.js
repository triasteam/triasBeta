import React, { PureComponent } from "react";
// import the core library.
import ReactEcharts from "echarts-for-react/lib/core";
// then import echarts modules those you have used manually.
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import { injectIntl, intlShape } from "react-intl"; /* react-intl imports */
import PropTypes from 'prop-types'

/**
 * Component for group of linechart and gauge. 
 * 
 * ### Example:
 * ```js
 * <LineMark
 *  name="TPS Monitoring"
 *  data={"trias":{"time":[582457790],"value":[1]},"ethereum":{"time":[1582457610],"value":[0]},"hyperledger":{"time":[1582457610],"value":[0]},"event_list":[-1]}
 *  dial={"trias":{"rate":0.11,"value":1},"ethereum":{"rate":0,"value":0},"hyperledger":{"rate":0,"value":0}}
 *  unit="Unit"
 *  showAll={true}
 *  showThis={true}
 * />
 * ```
 */
class LineMark extends PureComponent {
  static propTypes = {
    /* Inject intl to LineMark props */
    intl: intlShape.isRequired,
    /** Title of the section */
    name: PropTypes.string,
    /** Data of line chart */
    data: PropTypes.object,
    /** Data of gauge charts */
    dial: PropTypes.object,
    /** Whether show all the charts */
    showAll: PropTypes.bool,
    /** Unit of data */
    unit: PropTypes.string,
    /** Whether show this part*/
    showThis: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = {
      lang: this.props.intl.locale, // current locale language
      trias: [], //The line chart trias data
      ethereum: [], //The line chart ethereum data
      hyperledger: [], //The line chart hyperledger data
      time: [], //The line chart timeline
      //Trias dial data
      trias_dial: {
        rate: "",
        value: ""
      },
      //Ethereum dial data
      ethereum_dial: {
        rate: "",
        value: ""
      },
      //Hyperledger dial data
      hyperledger_dial: {
        rate: "",
        value: ""
      },
      event_list: [], //Histogram event data
      showAll: true,
      showThis: true,
    };
    this.timeArr = [];
  }

  /**
   * A timestamp to standard time
   */
  formatDate(now) {
    var hour = now.getHours();
    var minute = now.getMinutes();
    return hour + ":" + minute;
  }

  /**
   * Before a mounted component receives new props, reset some state.
   * @param {Object} nextProps new props
   */
  componentWillReceiveProps(nextProps) {
    let self = this;
    if (self.state.lang != nextProps.intl.locale) {
      self.setState({
        lang: nextProps.intl.locale
      });
    }
    if (self.state.showAll != nextProps.showAll) {
      self.setState({
        showAll: nextProps.showAll
      });
    }

    if (self.state.showThis != nextProps.showThis) {
      self.setState({
        showThis: nextProps.showThis
      });
    }
    self.timeArr = [];

    // console.log("linelllll", nextProps.name, !nextProps.data.trias ||
    // !nextProps.data.ethereum ||
    // !nextProps.data.hyperledger )
    if (
      !nextProps.data.trias ||
      !nextProps.data.ethereum ||
      !nextProps.data.hyperledger
    ) {
      return false;
    }

    let getMonitoringTime = nextProps.data.trias.time || [];
    for (var i = 0; i < getMonitoringTime.length; i++) {
      self.timeArr.push(self.formatDate(new Date(getMonitoringTime[i] * 1000)));
    }
    setTimeout(() => {
      self.setState({
        time: self.timeArr || [],
        trias: nextProps.data.trias.value || [],
        ethereum: nextProps.data.ethereum.value || [],
        hyperledger: nextProps.data.hyperledger.value || [],
        trias_dial: nextProps.dial.trias || {
          rate: "",
          value: ""
        },
        ethereum_dial: nextProps.dial.ethereum || {
          rate: "",
          value: ""
        },
        hyperledger_dial: nextProps.dial.hyperledger || {
          rate: "",
          value: ""
        },
        event_list: nextProps.data.event_list || []
      });
      // console.log("vvvv", nextProps.name, self.state.showAll, self.state.showThis)
    }, 0);
  }
  /**
   * After the component is mounted.
   * - Request data line chart start timing for 5 seconds
   * - Get data for this page.
   */
  componentDidMount() {}

  /**
   * When the component will be unmounted.
   * Clear the intervals
   */
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }

  getOption = () => {
    const event_list = [];
    // -1: 没有事件  1: Power Outage  4: 攻击  5: 节点更新         只有这四种情况
    for (let i = 0; i < this.state.event_list.length - 1; i++) {
      let des = "";
      switch (this.state.event_list[i]) {
        case 1:
          des = this.state.lang == "zh" ? "停电" : "Power Outage";
          break;
        case 4:
          des = this.state.lang == "zh" ? "攻击" : "Attack";
          break;
        case 5:
          des = this.state.lang == "zh" ? "节点更新" : "Node Updates";
          break;
        case -1:
          des = "no";
          break;
      }
      if (des != "no") {
        event_list.push([
          {
            name: des,
            xAxis: this.timeArr[i] + "",
            label: {
              normal: {
                color: "#fff",
                show: true
              }
            }
          },
          {
            xAxis: this.timeArr[i + 1] + ""
          }
        ]);
      }
    }

    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross"
        }
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        axisLabel: {
          show: true,
          textStyle: {
            color: "#777C84"
          }
        },
        axisLine: {
          lineStyle: {
            color: "#777C84"
          }
        },
        axisTick: {
          show: false
        },
        data: this.state.time
      },
      yAxis: {
        type: "value",
        // minInterval : 1,
        // boundaryGap : [ 0, 0.1 ],
        axisLabel: {
          formatter: "{value} " + `${this.props.unit}`,
          show: true,
          textStyle: {
            color: "#777C84"
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#777C84"
          }
        }
      },

      series: [
        {
          name: "Trias",
          type: "line",
          symbol: "none",
          smooth: false,
          data: this.state.trias,
          itemStyle: {
            normal: {
              color: "#A1FC3A",
              lineStyle: {
                color: "#A1FC3A",
                width: 1
              }
            }
          },
          markArea: {
            itemStyle: {
              // global
              normal: {
                color: "#25262E",
                opacity: "0.9"
              }
            },
            data: event_list
          }
        },
        {
          type: "line",
          name: "Ethereum",
          smooth: false,
          symbol: "none",
          data: this.state.ethereum,
          itemStyle: {
            normal: {
              color: "#FF0075",
              lineStyle: {
                color: "#FF0075",
                width: 1
              }
            }
          }
        },
        {
          type: "line",
          name: "Hyperledger",
          smooth: false,
          symbol: "none",
          data: this.state.hyperledger,
          itemStyle: {
            normal: {
              color: "#00FFE8",
              lineStyle: {
                color: "#00FFE8",
                width: 1
              }
            }
          }
        }
      ]
    };
    return option;
  };

  render() {
    return (
      <div className="lineMark-card">
        <div className="lineMark-title">
          <div className="title-des">{this.props.name || ""}</div>
          <ul>
            <li className="active">10 Min</li>
          </ul>
        </div>
        { this.state.showAll && this.state.showThis &&
          <ReactEcharts
            echarts={echarts}
            option={this.getOption()}
            style={{ height: "360px", width: "105%" }}
            className="react_for_echarts"
          />
        }
        { !this.state.showAll || !this.state.showThis &&
            <div className="failure-modal">
                <div className="info">
                    <img src={require("../../img/icon_maintenance@2x.png")} />
                    <p>System is currently under maintenance, can not sync statistics.</p>
                </div>
            </div>
        }

        <div className="lineMark-pie">
          <div className="warpper">
            <div className="dial" />
            <div
              className="line"
              style={{
                transform: `rotate(${
                  this.state.trias_dial.rate
                    ? this.state.trias_dial.rate * 90
                    : "0"
                }deg)`
              }}
            />
            <div className="layer">
              <div className="layer-item">Trias</div>
              <div>
                <div className="num">
                  {this.state.trias_dial.value + ""
                    ? this.state.trias_dial.value
                    : "N/A"}
                </div>
                <div className="unit">{this.props.unit}</div>
              </div>
            </div>
          </div>
          <div className="warpper">
            <div className="dial" />
            <div
              className="line"
              style={{
                transform: `rotate(${
                  this.state.ethereum_dial.rate
                    ? this.state.ethereum_dial.rate * 90
                    : "0"
                }deg)`
              }}
            />
            <div className="layer">
              <div className="layer-item">Ethereum</div>
              <div>
                <div className="num">
                  {this.state.ethereum_dial.value + ""
                    ? this.state.ethereum_dial.value
                    : "N/A"}
                </div>
                <div className="unit">{this.props.unit}</div>
              </div>
            </div>
          </div>
          <div className="warpper">
            <div className="dial" />
            <div
              className="line"
              style={{
                transform: `rotate(${
                  this.state.hyperledger_dial.rate
                    ? this.state.hyperledger_dial.rate * 90
                    : "0"
                }deg)`
              }}
            />
            <div className="layer">
              {" "}
              <div className="layer-item">Hyperledger</div>
              <div>
                <div className="num">
                  {this.state.hyperledger_dial.value + ""
                    ? this.state.hyperledger_dial.value
                    : "N/A"}
                </div>
                <div className="unit">{this.props.unit}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(LineMark);
