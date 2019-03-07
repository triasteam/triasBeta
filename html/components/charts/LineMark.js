import React, { PureComponent } from "react";
import ReactEcharts from "echarts-for-react";

export default class LineMark extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      trias: [], //The line chart trias data
      ethereum: [], //The line chart ethereum data
      hyperledger: [], //The line chart hyperledger data
      time: [], //The line chart timeline
      trias_dial: "", //Trias dial data
      ethereum_dial: "", //Ethereum dial data
      hyperledger_dial: "", //Hyperledger dial data
      event_list: [] //Histogram event data
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
    self.timeArr = [];
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
        trias_dial: nextProps.dial.trias || null,
        ethereum_dial: nextProps.dial.ethereum || null,
        hyperledger_dial: nextProps.dial.hyperledger || null,
        event_list: nextProps.data.event_list || []
      });
    }, 0);
  }
  /**
   * After the component is mounted.
   * - Request data line chart start timing for 5 seconds
   * - Get data for this page.
   */
  componentDidMount() {}

  getOption = () => {
    const event_list = [];
    // -1: 没有事件  1: Power Outage  4: 攻击  5: 节点更新         只有这四种情况
    for (let i = 0; i < this.state.event_list.length - 1; i++) {
      let des = "";
      switch (this.state.event_list[i]) {
        case 1:
          des = "Power Outage";
          break;
        case 4:
          des = "攻击";
          break;
        case 5:
          des = "节点更新";
          break;
        case -1:
          des = "没有事件";
          break;
      }
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
        axisLabel: {
          formatter: "{value} K",
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
          <div className="title-des">{this.props.name||''}</div>
          <ul>
            <li className="active">10 Min</li>
          </ul>
        </div>
        <ReactEcharts
          option={this.getOption()}
          style={{ height: "360px", width: "105%" }}
          className="react_for_echarts"
        />

        <div className="lineMark-pie">
          <div className="warpper">
            <div className="dial" />
            <div
              className="line"
              style={{
                transform: `rotate(${
                  this.state.trias_dial ? this.state.trias_dial.rate * 90 : "0"
                }deg)`
              }}
            />
            <div className="layer">
              <div className="layer-item">Trias</div>
              <div className="num">
                {this.state.trias_dial.value + ""
                  ? this.state.trias_dial.value
                  : "N/A"}
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
              <div className="num">
                {this.state.ethereum_dial.value + ""
                  ? this.state.ethereum_dial.value
                  : "N/A"}
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
              <div className="layer-item">Hyperledger</div>
              <div className="num">
                {this.state.hyperledger_dial.value + ""
                  ? this.state.hyperledger_dial.value
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
