import React from "react"
import $ from 'jquery'
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
            triasData:null,
        }
    }

    /**
     * When the component will be mounted.
     * Clear the intervals 
     */
    componentDidMount(){
        var self = this
        self.getNodesData()
        this.nodesInterval = setInterval(self.getNodesData.bind(self), 5000);
    }

    /**
     * Clear time interval when the component will be unmounted
     */
    componentWillUnmount(){
        let self= this
        this.nodesInterval = clearInterval(self.nodesInterval)
    }

    /**
     * Deep copy object
     * @param {*} source 
     */
    objDeepCopy(source) {
        var sourceCopy = source instanceof Array ? [] : {};
        for (var item in source) {
            sourceCopy[item] = typeof source[item] === 'object' ? this.objDeepCopy(source[item]) : source[item];
        }
        return sourceCopy;
    }

    /**
     * Get data of nodes from the server
     */
    getNodesData(){
        var self = this;
        $.ajax({
            type: "GET",
            url: "/api/visualization/",
            data: "data",
            dataType: "json",
            success: function (data) {
                if(data){
                    // if nodes data updated
                    if(JSON.stringify(data.result.trias) != JSON.stringify(self.state.triasData)){    
                        self.setState({
                            triasData:data.result.trias
                        })
                        self.updateGraph(self.objDeepCopy(data.result.trias))
                    } else {
                        console.log('nodes not udated!!')
                    }
                }else{
                    self.setState({
                        triasData:null
                    })  
                }
            },
            error(err){
                console.log(err)
                self.setState({
                    triasData:null
                })
            }
        });
    }

    updateGraph(data){
        var width = 738,
            height = 500,
            linkedByIndex = {},
            node = null,
            text = null,
            link = null,
            force = null;
        
        var linkSources = [];   // source positions of links
        var linkTargets = [];   // target positions of links
        for(let i=0;i<data.links.length;i++){
            linkSources.push([0,0])
            linkTargets.push([0,0])
        }
        
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
            .nodes(data.nodes)
            .links(data.links)
            .linkDistance(200)
            .charge(-1000)
            .size([width, height])
            .start();
        
        d3.select("div#nodesGraph svg").remove();   // clear svg
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
            .data(data.links)
            .enter().append("line")
            .attr({"stroke": "#474856"})
            .style("stroke-width", base_stroke);
                
        //add group of all nodes
        node = containerGrp
            .selectAll(".node")
            .data(data.nodes)
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
                    if(d.status === "0"){
                        return require("../img/img_node_norm@2x.png");
                    }else{
                        return require("../img/img_node_offline@2x.png");
                    }
                },
                "x" : -base_node_width/2,
                "y" : -base_node_height/2,
                "width" : base_node_width,
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
            .text(function (d) { return d.node_ip; });
        
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

        // update the attributes of svg elements on tick event of network node
        // also record the new source and target position of links as linkSources and linkTargets
        force.on("tick", function() {
            node.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

            link.attr("x1", function (d,i) { 
                    linkSources[i][0] = d.source.x
                    return d.source.x; 
                })
                .attr("y1", function (d,i) {
                    linkSources[i][1] = d.source.y
                    return d.source.y; 
                })
                .attr("x2", function (d,i) {
                    linkTargets[i][0] = d.target.x
                    return d.target.x; 
                })
                .attr("y2", function (d,i) {
                    linkTargets[i][1] = d.target.y
                    return d.target.y; 
                });

            node.attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; });
        });

        // on "start" event, transitions start, clear all the paths and moving circles along the links
        force.on("start", function(){
            containerGrp.selectAll("circle").remove()
            containerGrp.selectAll("path").remove()
        })

        // create image pattern to fill the circles
        containerGrp.append("pattern")
            .attr({
                "id": "pointImage",
                "x": 60,
                "y": 60,
                "height": 12,
                "width": 60
            })
            .append("image")
            .attr({
                "x": 60,
                "y": 54,
                "height": 12,
                "width": 60,
                "xlink:href": require("../img/img_chart_dots@2x.png")
            })

        /**
         * Get the angle at which the image should be rotated, the image will be moved from pointA to pointB repeatedly.
         * TIPS:
         * 1. The y-axis in svg is opposite to the normal Euclidean y-axis. 
         * 2. Math.atan2(y,x)/(Math.PI/180) calculates the angle, in the Euclidean planet, between the positive x-axis and the ray to the point (x,y)
         * In order to calculate the angle at which the image actually needs to be rotated, 
         * I convert the point coordinates (x, -y) in svg into point coordinates in Euclidean space 
         * and then convert them into coordinate points (-x, -(-y)) in the diagonal quadrant.
         * @param {*} pointA point coordinates [x1,y1], describe the source position of the link in svg space
         * @param {*} pointB point coordinates [x2,y2], describe the target position of the link in svg space
         */
        function getAngle(pointA,pointB){            
            var angle = - Math.round(Math.atan2(pointB[1] - pointA[1], -pointB[0] + pointA[0]) / (Math.PI / 180))
            return angle
        }
        
        // on "end" event, all transitions are finished
        force.on("end", function(){
            // add points to move along the link
            containerGrp.selectAll(".point")
                .data(linkSources)
                .enter().append('circle')
                .attr('id', function(d,i){ return "point"+i; })
                .attr('r',60)
                .attr('fill', "url(#pointImage)")   // fill the circles with the image pattern
                .attr("transform", function(d,i) {
                    return "translate(" + d + ") " + "rotate("+getAngle(linkSources[i], linkTargets[i])+") "; 
                });
            
                
            var lineFunc = d3.svg.line()
                .x(function(d) {
                    return d.x;
                })
                .y(function(d){
                    return d.y
                })

            for(let i=0;i<data.links.length;i++){
                let pathData = [{x:linkSources[i][0],y:linkSources[i][1]},{x:linkTargets[i][0],y:linkTargets[i][1]}]

                var path = containerGrp.append("path")
                    .attr("d", lineFunc(pathData))

                transition(i,path)
            }

            function transition(ponitIndex,path) {
                d3.select('#point'+ponitIndex)                
                    .transition()
                    .duration(1800)                    
                    .styleTween("opacity", function tween() {
                        return d3.interpolate(String(0), String(1));
                    })
                    .attrTween("transform", translateAlong(ponitIndex,path.node()))
                    .each("end", function(){transition(ponitIndex,path)}); // infinite loop
            }

            function translateAlong(index,path) {
                var l = path.getTotalLength();
                return function (i) {
                    return function (t) {
                        var p = path.getPointAtLength(t * l);
                        return "translate(" + p.x + "," + p.y + ") "+"rotate("+getAngle(linkSources[index], linkTargets[index])+")"; //Move points
                    }
                }
            }
        })

        var linkedByIndex = {};
        //map of all connected nodes index
        data.links.forEach(function (d) {
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
                        this.state.triasData && this.state.triasData.nodes && this.state.triasData.nodes.map(function(item,index){
                            return (
                                <li key={"host"+index}  className={item.level===0?"normal":(item.level===1?"premium":"problem")} >
                                    <span className="label">
                                        <FormattedMessage id="termRanking"/>
                                        <div className={item.trend===0?"trend":(item.trend===1?"trend up":"trend down")}></div>
                                    </span>
                                    <span className="label"><FormattedMessage id="termNode"/> IP</span>
                                    <span className="value">#{index+1}</span>
                                    <span className="value">{item.node_ip}<div className="circle"></div></span>
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