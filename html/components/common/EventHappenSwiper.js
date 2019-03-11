import React from "react"

import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.min.css'
import TimeInterval from './TimeInterval'
import $ from "jquery";
/**

 */
export default class EventHappenSwiper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventList: [],
            currentEventIndex: 0,
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
            dataType: 'json',
            data: {
            },
            success: function (data) {
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
                self.setState({
                    currentEventIndex: -1,
                    eventList: []
                })
            }
        })
    }

    componentDidMount() {
        this.getTimeEvent();
    }

    render() {

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
                                                <TimeInterval interval={event.interval} TimeChange={'add'} />
                                            </div>
                                        }
                                        {
                                            this.state.currentEventIndex != index &&
                                            <div className={this.state.currentEventIndex > index ? "eventHappend" : "eventComming"}>
                                                <p className="startTime">{event.start}</p>
                                                <p className="eventName">{event.name}</p>
                                                {
                                                    this.state.currentEventIndex > index &&
                                                    <TimeInterval interval={event.interval} TimeChange={'add'} />
                                                }
                                                {
                                                    this.state.currentEventIndex < index &&
                                                    <TimeInterval interval={event.interval} TimeChange={'decrease'} />
                                                }
                                            </div>
                                        }
                                    </div>
                                )
                            })
                        }

                        {
                            (!this.state.eventList || this.state.eventList.length == 0) && <p style={{ paddingLeft: '40px', width: '100%' }}>当前没有匹配的数据。</p>
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