import React from "react";
import $ from "jquery";
// import ES6Promise from 'es6-promise'
// ES6Promise.polyfill() //let IE6 support Promise object
import {
  injectIntl,
  intlShape,
  FormattedMessage
} from "react-intl"; /* react-intl imports */
import GeneralStatics from "./GeneralStatics";
import RightPart from "./RightPart";
import LineMarkCollection from "./charts/LineMarkCollection";
import NodesGraph from "./NodesGraph";
import EventHappenSwiper from "./common/EventHappenSwiper"
/* Component for node status page */
class ChainStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // lang: this.props.intl.locale,    // current locale language
    };
  }

  // /**
  //  * Before a mounted component receives new props, reset some state.
  //  * @param {Object} nextProps new props
  //  */
  // componentWillReceiveProps(nextProps){
  //     // if locale language will be changed, reset lang state
  //     if(this.state.lang != nextProps.intl.locale){
  //         this.setState({
  //             lang: nextProps.intl.locale
  //         })
  //     }
  // }

  /**
   * After the component is mounted.
   * - Start the countdown clock.
   * - Get data for this page.
   */
  componentDidMount() {
    
  }


  

 

  /**
   * When the component will be unmounted.
   * Clear the intervals
   */
  componentWillUnmount() {
  }

  render() {
    return (
      <div className="status-page">
        <EventHappenSwiper/>
        <NodesGraph />
        <section className="bottom-group clearfix">
          <div className="left-part">
            <GeneralStatics />
            <LineMarkCollection />
          </div>
          <RightPart />
        </section>
      </div>
    );
  }
}
/* Inject intl to ChainStatus props */
const propTypes = {
  intl: intlShape.isRequired
};
ChainStatus.propTypes = propTypes;
export default injectIntl(ChainStatus);
