import React from "react"
// import $ from 'jquery'
import * as d3 from "d3";
import {event as d3Event} from 'd3';
import {
    FormattedMessage
  } from "react-intl"; /* react-intl imports */

/* Component for node status page */
export default class NodesGraph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {            
            nodes:[],
            links:[],
        }
    }

    /**
     * When the component will be mounted.
     * Clear the intervals 
     */
    componentDidMount(){
        var self = this
        self.getNodesRelation()
    }

    getNodesRelation(){
        var self = this;        
        var data = {
            "status": 200,
            "content": {
                "links": [
                    {
                        "source": 1,
                        "target": 2
                    },
                    {
                        "source": 2,
                        "target": 5
                    },
                    {
                        "source": 3,
                        "target": 4
                    },
                    {
                        "source": 3,
                        "target": 6
                    },
                    {
                        "source": 4,
                        "target": 5
                    },
                    {
                        "source": 5,
                        "target": 3
                    }
                ],
                "nodes": [
                    {
                        "status": "normal",
                        "ip": "123.123.123.123",
                    },{
                        "status": "normal",
                        "ip": "123.123.123.000",
                    },{
                        "status": "normal",
                        "ip": "123.123.123.888",
                    },{
                        "status": "normal",
                        "ip": "123.123.123.111",
                    },{
                        "status": "normal",
                        "ip": "123.123.123.222",
                    },{
                        "status": "normal",
                        "ip": "123.123.123.333",
                    },{
                        "status": "offline",
                        "ip": "123.123.123.444",
                    },{
                        "status": "offline",
                        "ip": "123.123.123.555",
                    },{
                        "status": "normal",
                        "ip": "123.123.123.123",
                    },{
                        "status": "normal",
                        "ip": "123.123.123.000",
                    }
                ]
            }
        };
        self.setState({
            nodes:data.content.nodes
        })
    
        self.updateGraph(data)
    }

    updateGraph(data){
        var width = 738,
            height = 500,
            linkedByIndex = {},
            node = null,
            text = null,
            link = null,
            force = null;
        
        var focus_node = null;
        var highlight_trans = 0.1;
        
        // define zoom range
        var min_zoom = 0.5;
        var max_zoom = 2;
        var base_node_width = 104;
        var base_node_height = 106;  
        var base_text_size = 10;
        var base_stroke = 1;

        //Set up the force layout
        //Creates the graph data structure out of the json data
        force = d3.layout.force()
            .nodes(data.content.nodes)
            .links(data.content.links)
            .linkDistance(200)
            .charge(-1000)
            .size([width, height])
            .start();

        //create svg element using d3
        var svg = d3.select("div#nodesGraph").append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("cursor","move");

        //add container
        var containerGrp = svg.append("g");
        
        //add group of all lines
        //Create all the line svgs but without locations yet
        link = containerGrp
            .selectAll("line")
            .data(data.content.links)
            .enter().append("line")
            .attr({"stroke": "#474856"})
            .style("stroke-width", base_stroke);
    
        //add group of all nodes
        node = containerGrp
            .selectAll(".node")
            .data(data.content.nodes)
            .enter().append("g")
            .attr({
                "class" : "nodes",
                "cx" : function (d) {
                    return d.x;
                },
                "cy" : function (d) {
                    return d.y;
                },
            })
            .call(force.drag);
        
        //add image to node dynamically
        node.append("image")
            .attr({
                "xlink:href" : function (d) {
                    if(d.status === "normal"){
                        return require("../img/img_node_norm@2x.png");
                    }else{
                        return require("../img/img_node_offline@2x.png");
                    }
                },
                "x" : -base_node_width/2,
                "y" : -base_node_height/2,
                "height" : base_node_height,
            });
        
        //add labeled text to each node
        text = node.append("text")
            .attr({
                "y" : 20,
                "text-anchor" : "middle",
                "fill": "#FFFFFF",
                "class": "ip"
            })
            .style("font-size", base_text_size + "px")
            .text(function (d) { return d.ip; });
        
        // add double click zomm event to the nodes 
        node.on("dblclick.zoom", function (d) {
            d3Event.stopPropagation();
            var dcx = (width / 2 - d.x * zoom.scale());
            var dcy = (height / 2 - d.y * zoom.scale());
            zoom.translate([dcx, dcy]);
            containerGrp.attr("transform", "translate(" + dcx + "," + dcy + ")scale(" + zoom.scale() + ")");
        });

        // add mousedown event to the nodes
        // focus on related nodes/links/text
        node.on("mousedown", function (d) {
            d3Event.stopPropagation();
            focus_node = d;
            set_focus(d)
        })

        // add mouseup event
        // clear focus, reset the opacity
        d3.select(window).on("mouseup",
            function () {
                if (focus_node !== null) {
                    focus_node = null;
                    if (highlight_trans < 1) {
                        node.style("opacity", 1);
                        text.style("opacity", 1);
                        link.style("opacity", 1);
                    }
                }
            }
        );

        //add zoom behavior to nodes
        var zoom = d3.behavior.zoom().scaleExtent([min_zoom,max_zoom])
            .on("zoom", function () {
                containerGrp.attr("transform", "translate(" + d3Event.translate + ")scale(" + d3Event.scale + ")");
            });
        svg.call(zoom);

        //Now we are giving the SVGs co-ordinates - the force layout is generating the co-ordinates which this code is using to update the attributes of the SVG elements
        //tick event of network node
        force.on("tick", function() {
            node.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

            link.attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            node.attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; });
        });
        
        var linkedByIndex = {};
        //map of all connected nodes index
        data.content.links.forEach(function (d) {
            linkedByIndex[d.source.index + "," + d.target.index] = true;
        });

        function isConnected(a, b) {
            return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
        }

        function set_focus(d) {
            if (highlight_trans < 1) {
                node.style("opacity", function (o) {
                    return isConnected(d, o) ? 1 : highlight_trans;
                });

                text.style("opacity", function (o) {
                    return isConnected(d, o) ? 1 : highlight_trans;
                });

                link.style("opacity", function (o) {
                    return o.source.index == d.index || o.target.index == d.index ? 1 : highlight_trans;
                });
            }
        }
    }

    render() {
        return (
            <div className="visualisation-part">
                <div className="title">
                    <h1><FormattedMessage id="termVisualization"/></h1>
                    <ul>
                        <li className="active">Trias</li>
                    </ul>
                </div>
                <div id="nodesGraph"></div>
                <div className="hostlist-contaniner">                
                    <ul className="host-list">
                    {
                        this.state.nodes.map(function(item,index){
                            return (
                                <li key={"host"+index}>
                                    <span className="label"><FormattedMessage id="termNode"/> IP</span>
                                    <span className="label"><FormattedMessage id="termStatus"/></span>
                                    <span className="label"><FormattedMessage id="termLevel"/></span>
                                    <span className="value">{item.ip}</span>
                                    <span className="value"><div className={item.status==="normal"?"circle green":"circle red"}></div></span>
                                    <span className="value">{item.level || 'High'}</span>
                                </li>
                            )
                        })
                    }
                    </ul>
                </div>
            </div>
        )
    }
}