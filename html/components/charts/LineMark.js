import React, { PureComponent } from "react";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";

export default class Lunar extends PureComponent {
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
        data: [
          "00:00",
          "01:15",
          "02:30",
          "03:45",
          "05:00",
          "06:15",
          "07:30",
          "08:45",
          "10:00",
          "11:15",
          "12:30",
          "13:45",
          "15:00",
          "16:15",
          "17:30",
          "18:45",
          "20:00",
          "21:15",
          "22:30",
          "23:45"
        ]
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
        // axisPointer: {
        //   snap: true,
        //   lineStyle:{
        //       color:'#fff'
        //   }
        // }
      },

      series: [
        {
          name: "Trias",
          type: "line",
          symbol: "none",
          smooth: false,

          data: [
            500,
            580,
            550,
            660,
            570,
            600,
            750,
            900,
            600,
            590,
            680,
            590,
            600,
            500,
            600,
            750,
            800,
            700,
            600,
            500
          ],
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
                  xAxis: "00:00",
                  label: {
                    normal: {
                      color: "#fff",
                      show: true
                      //   position: [10, '50%']
                    }
                  }
                },
                {
                  xAxis: "02:30"
                }
              ],
              [
                {
                  name: "Power Outage",
                  xAxis: "06:15",
                  label: {
                    normal: {
                      color: "#fff",
                      show: true
                      //   position: [10, 0]
                    }
                  }
                },
                {
                  xAxis: "08:45"
                }
              ],
              [
                {
                  name: "Nodes Update",
                  xAxis: "17:30",
                  label: {
                    normal: {
                      color: "#fff",
                      show: true
                      //   position: [10, 0]
                    }
                  }
                },
                {
                  xAxis: "21:15"
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
          data: [
            300,
            305,
            452,
            400,
            370,
            300,
            500,
            500,
            400,
            390,
            380,
            390,
            400,
            500,
            400,
            550,
            600,
            500,
            600,
            400
          ],
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
          data: [
            300,
            30,
            150,
            260,
            100,
            110,
            240,
            123,
            100,
            190,
            180,
            290,
            100,
            200,
            300,
            150,
            300,
            200,
            300,
            200
          ],
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
          <div class="warpper">
            <div class="dial" />
            <div class="line" />
            <div class="layer">
              <div class="layer-item">Trias</div>
              <div class="num">3467</div>
            </div>
          </div>
          <div class="warpper">
            <div class="dial" />
            <div class="line" />
            <div class="layer">
              <div class="layer-item">Ethereum</div>
              <div class="num">667</div>
            </div>
          </div>
          <div class="warpper">
            <div class="dial" />
            <div class="line" />
            <div class="layer">
              <div class="layer-item">Hyperledger</div>
              <div class="num">1415</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
