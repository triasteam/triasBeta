import React from "react"
import ES6Promise from 'es6-promise'
import echarts from 'echarts'
import PropTypes from 'prop-types'
ES6Promise.polyfill() //关键代码,让ie识别promise对象!

/**
 * Static line chart component:
 * 
 * ### Example：
 * ```js
 * <ChartLine
 *  chartIndex="myChart1"
 *  chartStyle={{width: "76px", height: "170px"}}
 *  chartSeries={[22, 182, 15, 145, 220, 10, 40, 22, 182, 15, 145, 220, 10, 40]}
 *  xAxis={['1', '2', '3', '4', '5', '6', '7','8','9','10','11','12','13','14']} 
 *  grid={{
 *      left: '-35%',
 *      right: '0%',
 *      bottom: '-10%',
 *      top: '90%',
 *      containLabel: true
 *      }}
 * />
 * ```
 * 
 * - chartIndex: 用于此图表元素的id中，不可重复
 * - chartStyle：自定义样式（可选）
 * - chartSeries: 自定义数据（可选）
 * - xAxis: 自定义x轴（可选）当chartSeries 数据个数不是 14 时，需提供对应个数的 xAxis。
 * - grid: 详见 echarts的grid 配置项：http://echarts.baidu.com/option.html#grid （可选）
 */
export default class ChartLine extends React.Component {
    static propTypes = {
        /** 用于此图表元素的id中，不可重复 */
        chartIndex: PropTypes.string,
        /** （可选）自定义样式 */
        chartStyle: PropTypes.object,
        /** （可选）自定义数据 */
        chartSeries: PropTypes.array,
        /** （可选）自定义x轴。当chartSeries 数据个数不是 14 时，需提供对应个数的 xAxis。 */
        xAxis: PropTypes.array,
        /** （可选）详见 echarts的grid 配置项：http://echarts.baidu.com/option.html#grid （可选）  */
        grid: PropTypes.object,
    }
    constructor(props) {
        super(props);
        this.state = {
            chartIndex: this.props.chartIndex,  //用于此图表元素的id中，不可重复
            grid: this.props.grid,
            xAxis: this.props.xAxis ,    //自定义x轴数据
            chartSeries: this.props.chartSeries ,   //自定义折线数据
            chartStyle: this.props.chartStyle  //图表样式
        }
        var self= this
        var initDataSeries = new Array(self.state.xAxis.length)
        for( var i=0;i<self.state.xAxis.length;i++){
            initDataSeries[i]=0
        }
        this.optionLine = {
            grid: this.state.grid,
            xAxis: {
                type: 'category',
                data: this.state.xAxis,
                axisLine: {
                    show: false,
                },
                axisLabel: {
                    show: false,
                },
                axisTick: {
                    show: false,
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false,
                },
                axisLabel: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                splitLine: {
                    show: false      //是否显示分隔线。默认数值轴显示，类目轴不显示。
                }
            },

            series: [{
                type: 'line',
                smooth: true,
                symbol: 'circle',
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 1
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(161,252,58,0.5)'
                        },{
                            offset: 1,
                            color: 'rgba(161,252,58, 0.1)'
                        }], false),
                        opacity:0.8,
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'rgb(161,252,58)',
                    }
                },
                data: this.state.xAxis?initDataSeries:[0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            }]
        };
    }


    initChart(){
        this.optionLine.series[0].data = this.state.chartSeries
        var chartLine1 = echarts.init(document.getElementById('node-Line'+this.state.chartIndex));
        chartLine1.setOption(this.optionLine, true);
    }
    //组件已经成功被渲染
    componentDidMount() {
        this.initChart();
    }
    //当组件props将要发生变化时
    componentWillReceiveProps(nextProps){
        this.setState({
            chartIndex: nextProps.chartIndex,
            grid: nextProps.grid,
            xAxis: nextProps.xAxis ,
            chartSeries: nextProps.chartSeries,
            chartStyle: nextProps.chartStyle
        },()=>{
            this.initChart()
        })
    }
    render() {
        return (
            <div 
                id={"node-Line"+this.state.chartIndex} 
                style={this.state.chartStyle} 
                className="summarise-chart">
            </div>
        )
    }
}