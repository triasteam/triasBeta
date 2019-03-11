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

  componentDidMount(){

  }
  componentWillReceiveProps(nextProps) {
    // console.log('rrrrrr111',this.props.currentInfo, nextProps.currentInfo)
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