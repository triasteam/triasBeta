import React from "react"

import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.min.css'

import $ from "jquery";
/**
 * Custom toggle list component.
 * Usage:
 * <ToggleList
 * listID="langlist"
 * itemsToSelect={[{
      ele: <span onClick={()=>this.changeLanguage('zh')}>中文</span>
    }, {
        ele: <span  onClick={()=>this.changeLanguage('en')}>English</span>
    }]}
 * name={<i className="fas fa-globe-americas"></i>} />
 * 
 * Attributes:
 * - listID: id of the outer container
 * - itemsToSelect: a list of elements( ele: element shows in the drop-down list )
 * - name: shows in the toggle button
 */
export default class EventHappenSwiper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventList: [],
            currentEventIndex: 0,
            currentTime: 0,
        }
    }
    createSwiper() {
        var mySwiper = new Swiper('.swiper-container', {
            // direction: 'vertical', // 垂直切换选项
            loop: false, // 循环模式选项
            slidesPerView: 5, // display time block
            spaceBetween: 0,
            initialSlide: this.state.currentEventIndex - 2,
            // 如果需要前进后退按钮
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },

            // 如果需要滚动条
            scrollbar: {
                el: '.swiper-scrollbar',
                hide: true,
            },
        })
    }
    getTimeEvent() {
        var self = this
        $.ajax({
            url: '/api/event_list/ ',
            type: 'get',
            dataType: 'json',               //GET方式时,表单数据被转换成请求格式作为URL地址的参数进行传递
            data: {
            },
            success: function (data) {
                console.log(data)
                if (data.status == 'success') {
                    self.setState({
                        currentEventIndex: data.result.current_index,
                        eventList: data.result.event_list
                    })
                    self.createSwiper()
                } else {
                    self.setState({
                        currentEventIndex: -1,
                        eventList: []
                    })
                }
            },
            error: function () {

            }
        })
    }

    componentDidMount() {
        this.getTimeEvent();
    }

    render() {
        var transformTime = (times, index) => {
            interval(times, index)
        }
        var transformTimeAdd = (times, index) => {
            intervalAdd(times, index)
        }
        var interval = (times, index) => {
            this.timerChange = setInterval(() => {
                clearTimeout(this.timerChange)
                times--;
                changeTime(times, index)
            }, 1000)
        }
        var changeTime = (times, index) => {
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
            $('.swiper-slide').eq(index).find('p.eventInterval').html(hour + ":" + minute + ":" + second)
        }
        var intervalAdd = (times, index) => {
            this.timerChange = setInterval(() => {
                clearTimeout(this.timerChange)
                times++;
                changeTime(times, index)
            }, 1000)
        }
        return (
            <div className="eventSwiper">
                <div className="swiper-container">
                    <div className="swiper-wrapper">

                        {
                            this.state.eventList.length > 0 && this.state.eventList.map((event, index) => {

                                return (
                                    <div className="swiper-slide " key={index}>
                                        {
                                            this.state.currentEventIndex == index &&
                                            <div className="eventCurrent">
                                                <p className="startTime">{event.start}</p>
                                                <p className="eventName">{event.name}</p>
                                                <p className="eventInterval">{transformTimeAdd(event.interval, index)}</p>

                                            </div>
                                        }
                                        {
                                            this.state.currentEventIndex != index &&
                                            <div className={this.state.currentEventIndex > index ? "eventHappend" : "eventComming"}>
                                                <p className="startTime">{event.start}</p>
                                                <p className="eventName">{event.name}</p>
                                                {
                                                    this.state.currentEventIndex > index &&
                                                    <p className="eventInterval">{transformTimeAdd(event.interval, index)}</p>
                                                }
                                                {
                                                    this.state.currentEventIndex < index &&
                                                    <p className="eventInterval">{transformTime(event.interval, index)}</p>
                                                }
                                            </div>
                                        }
                                    </div>
                                )
                            })
                        }


                    </div>

                    {/* <!-- 如果需要导航按钮 --> */}
                    <div className="bg-cover-left">
                        <div className="swiper-button-prev"></div>
                    </div>
                    <div className="bg-cover-right">
                        <div className="swiper-button-next"></div>
                    </div>


                    {/* <!-- 如果需要滚动条 --> */}
                    <div className="swiper-scrollbar"></div>
                </div>


            </div>
        )
    }
}