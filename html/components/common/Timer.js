import React from "react"
import PropTypes from 'prop-types';

/**
 * Timer component:
 *
 * ### Example:
 * ```js
 * <Timer
 *  start="12:16:50"
 * />
 * ```
 */
export default class Timer extends React.Component {
    static propTypes = {
        /** Start time (ex. 12:16:50)*/
        start: PropTypes.string
    }

    constructor(props) {
        super(props);
        this.state = {
            timeNow: ''
        }
    }

    /**
     * When the component was mounted.
     * Start the timer. 
     */
    componentDidMount() {
        this.startTimer()
    }

    componentWillReceiveProps(nextProps){
        if(this.props.start!== nextProps.start){
            if(this.timeInterval) this.timeInterval = clearInterval(this.timeInterval)
            this.startTimer();
        }
    }

    /**
     * Clear time interval when the component will be unmounted
     */
    componentWillUnmount = () => {
        this.setState = ()=>{
          return;
        };
        // clear Countdown timer
        this.timeInterval = clearInterval(this.timeInterval)
    }

    /**
     * Gets the current time and calculates the time countdown
     */
    startTimer(){
        let hour = this.props.start.split(':')
        this.currentTime = (new Date().getHours() - Number(hour[0]))*3600 +
                          (new Date().getMinutes() - Number(hour[1])) * 60 + 
                          (new Date().getSeconds() - Number(hour[2])) 
        // Countdown update
        this.timeInterval = setInterval(() => {
            this.currentTime++;
            this.updateTime(this.currentTime)
        }, 1000)
    }
    
    /**
     * Update time according to number of seconds
     * @param {int} seconds 
     */
    updateTime(seconds) {
        var day = 0,
            hour = 0,
            minute = 0,
            second = 0;//时间默认值
        if (seconds > 0) {
            day = Math.floor(seconds / (60 * 60 * 24));
            hour = Math.floor(seconds / (60 * 60)) - (day * 24);
            minute = Math.floor(seconds / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(seconds) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        }
        if (hour <= 9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;

        this.setState({
            timeNow:hour + ":" + minute + ":" + second
        })
    }

    render() {
        return (
            <span className="eventInterval">
                {
                    this.props.start &&
                    <span >{this.state.timeNow}</span>
                }
            </span>
        )
    }
}