import React from "react"
/**
 * Timer components which displays:
 *
 * Params: 
 *      interval: the number to count down
 *      TimeChange: the type of the countdown
 * 
 *      eg: 
 *      <Timer interval={this.state.currentInfo.selectedEvent.time} TimeChange={'add'} /> 
 * 
 */
export default class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeCount: '',
        }
    }
   
    transformTimeAdd(times) {
        this.intervalAdd(times)
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

    /**
     * When the component will be mounted.
     * Set the intervals 
     */
    componentDidMount() {
        this.transformTimeAdd(this.props.interval)
    }

    componentWillReceiveProps(nextProps){
        if(this.props.interval!=nextProps.interval){
            this.timerChange = clearInterval(this.timerChange)
            this.transformTimeAdd(nextProps.interval)
        }
    }
    /**
     * Clear time interval when the component will be unmounted
     */
    
    componentWillUnmount = () => {
        this.setState = (state,callback)=>{
          return;
        };
        this.timerChange = clearInterval(this.timerChange)
    }
    render() {

        return (

            <span className="eventInterval">
                {
                    this.props.interval &&
                    <span >{this.state.timeCount}</span>
                }
                
            </span>



        )
    }
}