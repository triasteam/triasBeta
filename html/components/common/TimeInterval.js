import React from "react"
/*

    
*/
export default class TimeInterval extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeCount: ''
        }
    }

    transformTime(times) {
        this.interval(times)
    }
    transformTimeAdd(times) {
        this.intervalAdd(times)
    }
    interval(times) {
        this.timerChange = setInterval(() => {
            times--;
            this.changeTime(times)
            if(times<=0){
                clearInterval(this.timerChange)
            }
        }, 1000)
    }
    changeTime(times) {
        var day = 0,
            hour = 0,
            minute = 0,
            second = 0;//时间默认值
        if (times > 0) {
            day = Math.floor(times / (60 * 60 * 24));
            hour = Math.floor(times / (60 * 60)) - (day * 24);
            minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        }
        if (day <= 9) day = '0' + day;
        if (hour <= 9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;

        this.setState({
            timeCount:hour + ":" + minute + ":" + second
        })
    }
    intervalAdd(times) {
        this.timerChange = setInterval(() => {
            times++;
            this.changeTime(times)
            
        }, 1000)
    }
    componentDidMount() {
        if(this.props.TimeChange == 'add'){
            this.transformTimeAdd(this.props.interval, this.props.HtmlIndex)
        }else{
            this.transformTime(this.props.interval, this.props.HtmlIndex)
        }
    }

    componentWillUnmount(){
        this.timerChange = clearInterval(this.timerChange)
    }
    
    render() {

        return (

            <p className="eventInterval">
                {
                    this.props.interval > 0 &&
                    <span >{this.state.timeCount}</span>
                }
                
            </p>



        )
    }
}