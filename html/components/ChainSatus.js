import React from "react";
import GeneralStatics from "./GeneralStatics";
import RightPart from "./RightPart";
import LineMarkCollection from "./charts/LineMarkCollection";
import NodesGraph from "./NodesGraph";
import EventHappenSwiper from "./common/EventHappenSwiper"
import PropTypes from "prop-types";
/**
 * Component for simulaitons part in chain status page
 */
export default class ChainStatus extends React.Component {
  static propTypes = {
    /** Info about nodes number and current event */
    currentInfo: PropTypes.object
  }
  constructor(props) {
    super(props);
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
            <RightPart currentInfo = {this.props.currentInfo}/>
          </section>
        </div>
    );
  }
}