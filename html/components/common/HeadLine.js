import React from "react"
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
export default class HeadLine extends React.Component {
    constructor(props) {
        super(props);
        this.state={

        }
    }
    
    render(){
        
        return (
            <div className="sub-header"> 
                <div className="headBar">
                    {this.props.headBarName}
                </div>
            </div>
        )
    }
}