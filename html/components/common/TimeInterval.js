import React from "react"
/*
** The Subcomponent of the time axis ----- count down

** Provide time countdown function

** Parent param

* - Timestamp: {this.props.interval}
* - Time to increase or decrease : {this.state.TimeChange}
*/
export default class TimeInterval extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeCount: '',// Time format after timestamp processing --- xx : xx :xx
        }
    }
    /**
     * Handle timestamps , Countdown reduction
     * @param {timestamps} times 
     */
    transformTime(times) {
        this.interval(times)
    }
    /**
     * Handle timestamps , Countdown increased
     * @param {timestamps} times 
     */
    transformTimeAdd(times) {
        this.intervalAdd(times)
    }
    /**
     * setInterval function of time decrease
     * @param {timestamps} times 
     */
    interval(times) {
        this.timerChange = setInterval(() => {
            times--;
            this.changeTime(times)
            if (times <= 0) {
                clearInterval(this.timerChange)
            }
        }, 1000)
    }
    /** 
     * Timestamp format conversion
     * @param {timestamps} times
     */
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
            timeCount: hour + ":" + minute + ":" + second
        })
    }
    /**
     * setInterval function of time increased
     * @param {timestamps} times 
     */
    intervalAdd(times) {
        this.timerChange = setInterval(() => {
            times++;
            this.changeTime(times)

        }, 1000)
    }
    componentDidMount() {
        // Time to increase or decrease , execute different functions
        if (this.props.TimeChange == 'add') {
            this.transformTimeAdd(this.props.interval)
        } else {
            this.transformTime(this.props.interval)
        }
    }

    componentWillUnmount() {
        // clear timer
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