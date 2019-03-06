import React from "react";
import GeneralStatics from "./GeneralStatics";
import RightPart from "./RightPart";
import LineMarkCollection from "./charts/LineMarkCollection";
import NodesGraph from "./NodesGraph";
import EventHappenSwiper from "./common/EventHappenSwiper"
/* Component for node status page */
export default class ChainStatus extends React.Component {
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
          <RightPart />
        </section>
      </div>
    );
  }
}