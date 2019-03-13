import React from "react"
import Modal from "react-bootstrap"
import { Link } from 'react-router-dom'
// import ES6Promise from 'es6-promise'
// ES6Promise.polyfill() //关键代码,让ie识别promise对象!
import {injectIntl, intlShape, FormattedMessage } from 'react-intl'; /* react-intl imports */
import $ from 'jquery'


/**
 * RightPart components which displays:
 */
class GenerateTranstaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }
    componentWillMount() {
    }

    componentDidMount() {
        // console.log('rrrrrr',this.props.currentEventIndex)
        this.setState({
        })
    }
 

    /**
     * 
     * Get the data for Hardware Specifications part
     *  
     */
    getSpecifications() {
        var self = this;
        $.ajax({
            url:"/api/hardware_specifications/",
            type:"GET",
            dataType:"json",
            success: function(data){
                if(data.status == "success") {
                    // console.log("kiki",data)
                    self.setState({
                        CPU: data.result.CPU,
                        GPU: data.result.GPU,
                        Motherboard: data.result.Motherboard,
                        RAM: data.result.RAM,
                        SSD: data.result.SSD,
                    })
                }
            }
        })
    }
    
    /**
     * When the component will unmount.
     * Clear the intervals 
     */
    componentWillUnmount() {
    }

    /**
     * Before a mounted component receives new props, reset some state.
     * @param {Object} nextProps new props
     */
    componentWillReceiveProps(nextProps) {
        // console.log('rrrrr',this.props.currentInfo,nextProps.currentInfo)
        if (JSON.stringify(nextProps.currentInfo) != JSON.stringify(this.props.currentInfo)) {
            this.setState({
                currentInfo: nextProps.currentInfo
            })
        }
    }

    render() {
       
        return (
            <div className="generate-transaction">
                <p className="main-title">Transaction Test</p>
                <p className="explaination">Generate new transtactions to start. When transactions is finished, you’ll be able to check the details.</p>
                <a className="generate-btn">Generate New Transtaction</a>
                <div className="tran-card">
                    <div className="text">
                        <p className="tran-name">Transaction #01</p>
                        <p className="tran-hint">Pending…</p>
                    </div>
                    <div className="check-btn">
                        <img src={require("../img/icon/inline/icon_check_disable@2x.png")} />
                        <span>Check Transtaction</span>
                        {/* <Link to="/activities">Check Transtaction</Link> */}
                    </div>
                </div>
                <div className="tran-card">
                    <div className="text">
                        <p className="tran-name">Transaction #01</p>
                        <p className="tran-hint">Succeed!</p>
                    </div>
                    <div className="check-btn success">
                        <img src={require("../img/icon/inline/icon_check_enable@2x.png")} />
                        <span>Check Transtaction</span>
                        {/* <Link to="/activities">Check Transtaction</Link> */}
                    </div>
                </div>
                <Modal/>
            </div>
        )
    }
}

/* Inject intl to RightPart props */
const propTypes = {
    intl: intlShape.isRequired,
};
GenerateTranstaction.propTypes = propTypes
export default injectIntl(GenerateTranstaction)