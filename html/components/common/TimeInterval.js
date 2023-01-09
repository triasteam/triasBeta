import React from "react"
import PropTypes from 'prop-types';

/** 
 * The Subcomponent of the time axis in chain status tab page.
 * 
 * Provide a timer or a countdown.
 * 
 * ### Example:
 * ```js
 * <TimeInterval
 *  interval="12:16:50"
 *  TimeChange="add"
 * />
 * ```
 */
export default class TimeInterval extends React.Component {
    static propTypes = {
        /** Start time (ex. 12:16:50)*/
        interval: PropTypes.string,
        /** Whether to increase or decrease time( "add" or "decrease") */
        TimeChange: PropTypes.string,
        /** Function to refresh event list */
        refreshEventList: PropTypes.func
    }
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
            
            if (times < 0) {
                // Refresh event list
                this.props.refreshEventList();
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
        this.dealTime()
    }
    /**
     * Gets the current time and calculates the time countdown
     */
    dealTime(){
        let hour = this.props.interval.split(':')
        let currentTime =Math.abs( (new Date().getHours() - Number(hour[0]))*3600 +
                          (new Date().getMinutes() - Number(hour[1])) * 60 + 
                          (new Date().getSeconds() - Number(hour[2])) )
        // Countdown update
        // Time to increase or decrease , execute different functions
        if (this.props.TimeChange == 'add') {
            this.transformTimeAdd(currentTime)
        } else {
            this.transformTime(currentTime)
        }
    }

    clearInterval(){
        // clear timer
        this.timerChange = clearInterval(this.timerChange)
    }

    componentWillUnmount = () => {
        this.setState = ()=>{
          return;
        };
        this.clearInterval()
    }
    
    render() {
        return (
            <p className="eventInterval">
                {
                    this.props.interval &&
                    <span >{this.state.timeCount}</span>
                }
            </p>
        )
    }
}