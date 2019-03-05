import React, { PureComponent } from "react";
import ReactEcharts from "echarts-for-react";

export default class Lunar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      trias: [],
      ethereum: [],
      hyperledger: [],
      time: [],
      trias_dial: "",
      ethereum_dial: "",
      hyperledger_dial: ""
    };
    this.timeArr=[];
  }

   formatDate(now) { 
    var hour=now.getHours(); 
    var minute=now.getMinutes(); 
    return  hour+":"+minute
    }; 


  componentWillReceiveProps(nextProps) {
    let self = this;
    self.timeArr=[];
    if(!nextProps.data.trias||!nextProps.data.ethereum||!nextProps.data.hyperledger){
      return false
    }
    let  getMonitoringTime=nextProps.data.trias.time
    for(var i=0;i<getMonitoringTime.length;i++){
      self.timeArr.push(self.formatDate(new Date(getMonitoringTime[i]*1000))) 
    }
    setTimeout(function() {
      self.setState({
        time:  self.timeArr||[],
        trias: nextProps.data.trias.value||[],
        ethereum: nextProps.data.ethereum.value||[],
        hyperledger: nextProps.data.hyperledger.value||[],
        trias_dial: nextProps.dial.trias||null,
        ethereum_dial: nextProps.dial.ethereum||null,
        hyperledger_dial: nextProps.dial.hyperledger||null,
      });
    }, 0);
  }

  componentDidMount() {}
  getOption = () => {
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
              //全局的
              normal: {
                color: "#25262E",
                opacity: "0.9"
              }
            },

            data: [
              [
                {
                  name: "Hacker Attack",
                  xAxis: this.timeArr[0] + "",
                  label: {
                    normal: {
                      color: "#fff",
                      show: true
                      //   position: [10, '50%']
                    }
                  }
                },
                {
                  xAxis: this.timeArr[1] + ""
                }
              ],
              [
                {
                  name: "Power Outage",
                  xAxis: this.timeArr[2] + "",
                  label: {
                    normal: {
                      color: "#fff",
                      show: true
                      //   position: [10, 0]
                    }
                  }
                },
                {
                  xAxis: this.timeArr[3] + ""
                }
              ],
              [
                {
                  name: "Nodes Update",
                  xAxis: this.timeArr[4] + "",
                  label: {
                    normal: {
                      color: "#fff",
                      show: true
                      //   position: [10, 0]
                    }
                  }
                },
                {
                  xAxis: this.timeArr[6] + ""
                }
              ]
            ]
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
          <div className="title-des">{this.props.name}</div>
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
            <div className="line" />
            <div className="layer">
              <div className="layer-item">Trias</div>
              <div className="num">{this.state.trias_dial.value}</div>
            </div>
          </div>
          <div className="warpper">
            <div className="dial" />
            <div className="line" />
            <div className="layer">
              <div className="layer-item">Ethereum</div>
              <div className="num">{this.state.ethereum_dial.value}</div>
            </div>
          </div>
          <div className="warpper">
            <div className="dial" />
            <div className="line" />
            <div className="layer">
              <div className="layer-item">Hyperledger</div>
              <div className="num">{this.state.hyperledger_dial.value}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
