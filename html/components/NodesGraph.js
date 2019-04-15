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
            nodeShow: true,
        }
        this.pointIntervals = new Array();  // the interval onject of the point
        this.pointTimeouts = new Array();  // the interval onject of the point
    }

    /**
     * When the component will be mounted.
     * Clear the intervals 
     */
    componentDidMount(){
        var self = this
        self.getNodesData()
        this.nodesInterval = setInterval(self.getNodesData.bind(self), 20000);
    }

    /**
     * Clear time interval when the component will be unmounted
     */
    componentWillUnmount(){
        let self= this
        this.nodesInterval = clearInterval(self.nodesInterval)
        
        this.setState = (state,callback)=>{
            return;
        };
        this.clearPointesInterval(self.pointIntervals)
        this.clearPointesTimeout(self.pointTimeouts)
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
        // $.ajax({
        //     type: "GET",
        //     url: "/api/visualization/",
        //     data: "data",
        //     dataType: "json",
        //     success: function (data) {
            var data = {"status": "success", "result": {"trias": {"links": [{"source": 7, "target": 3}, {"source": 6, "target": 1}, {"source": 1, "target": 6}, {"source": 7, "target": 0}, {"source": 8, "target": 1}, {"source": 8, "target": 4}, {"source": 2, "target": 0}, {"source": 3, "target": 4}, {"source": 0, "target": 2}, {"source": 8, "target": 5}, {"source": 0, "target": 7}, {"source": 4, "target": 8}, {"source": 5, "target": 6}, {"source": 7, "target": 6}, {"source": 0, "target": 6}, {"source": 1, "target": 0}, {"source": 3, "target": 1}, {"source": 2, "target": 6}, {"source": 4, "target": 0}, {"source": 2, "target": 1}], "nodes": [{"status": 0, "level": 0, "node_ip": "3.0.49.166", "trend": 0}, {"status": 0, "level": 0, "node_ip": "3.0.206.44", "trend": 0}, {"status": 0, "level": 0, "node_ip": "13.251.63.11", "trend": 0}, {"status": 1, "level": 0, "node_ip": "3.1.196.255", "trend": 0}, {"status": 0, "level": 0, "node_ip": "3.1.103.240", "trend": 0}, {"status": 0, "level": 1, "node_ip": "18.138.11.165", "trend": 0}, {"status": 0, "level": 1, "node_ip": "3.1.24.97", "trend": 0}, {"status": 0, "level": 1, "node_ip": "13.229.126.39", "trend": 0}, {"status": 0, "level": 1, "node_ip": "13.229.105.23", "trend": 0}]}, "hyperledger": {"links": [], "nodes": []}, "ethereum": {"links": [], "nodes": []}}};
                // console.log('tututtuu',data)
                if(data.status == "success"){
                    self.setState ({
                        nodeShow: true,
                    })
                    // if nodes data updated
                    if(JSON.stringify(data.result.trias) != JSON.stringify(self.state.triasData)){  
                        self.setState({
                            triasData:data.result.trias
                        })
                        self.updateGraph(self.objDeepCopy(data.result.trias))
                    } else {
                        console.log('nodes not udated!!')
                    }
                } else if (data.status == "failure") {
                    self.setState ({
                        nodeShow: false,
                    })
                } else{
                    self.setState({
                        triasData:null
                    })  
                }
        //     },
        //     error(err){
        //         console.log(err)
        //         self.setState({
        //             triasData:null
        //         })
        //     }
        // });
    }

    clearPointesInterval(intervals){
        for(let i=0;i<intervals.length;i++){
            if(intervals[i]) intervals[i] = clearInterval(intervals[i])
        }
    }
    clearPointesTimeout(timeouts){
        for(let i=0;i<timeouts.length;i++){
            if(timeouts[i]) timeouts[i] = clearTimeout(timeouts[i])
        }
    }

    updateGraph(data){
        var self = this
        var width = 738,
            height = 500,
            linkedByIndex = {},
            node = null,
            text = null,
            link = null,
            point = null,
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

        for(let i=0;i<data.links.length;i++){
            this.pointIntervals.push(null)
            this.pointTimeouts.push(null)
        }
        
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
                    if(d.status === 0){
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
                        point.style("visibility", "visible");
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
            self.clearPointesInterval(self.pointIntervals)
            self.clearPointesTimeout(self.pointTimeouts)
        })

        // create image pattern to fill the circles
        containerGrp.append("pattern")
            .attr({
                "id": "pointImage",
                "x": 15,
                "y": 15,
                "height": 3,
                "width": 15
            })
            .append("image")
            .attr({
                "x": 15,
                "y": 13.5,
                "height": 3,
                "width": 30,
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
            point = containerGrp.selectAll(".point")
                .data(linkSources)
                .enter().append('circle')
                .attr('id', function(d,i){ return "point"+i; })
                .attr('r',15)
                .attr('fill', "url(#pointImage)")   // fill the circles with the image pattern
                .attr('opacity', 0)
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

            

            /**
             * Begin animation, moves the point along the path
             * @param {*} pointIndex index of point
             * @param {*} path which the point moves along
             */
            function transition(pointIndex,path) {
                var frame = 1;
                var duration = 3000;
                var fps = 15;
                var maxFrame = fps*duration/1000;
                var transitionInterval = 2000;  // interval between every entire transition of point

                self.pointIntervals[pointIndex] = setInterval(function(){
                    // to finish transition, clear interval and reset point style
                    if(frame>=maxFrame){
                        self.pointIntervals[pointIndex] = clearInterval(self.pointIntervals[pointIndex]);
                        self.pointTimeouts[pointIndex] = clearTimeout(self.pointTimeouts[pointIndex])
                        // return to initial position and hide
                        $('#point'+pointIndex)
                            .css("opacity",0)
                            .attr('transform', translateAlong(pointIndex, path.node(), 0))
                        // set timeout to trigger transition again
                        self.pointTimeouts[pointIndex] = setTimeout(transition, transitionInterval, pointIndex, path);
                        return;
                    }
                    // update point style
                    $('#point'+pointIndex)                
                        .css('opacity', 1 * frame/maxFrame)
                        .attr('transform', translateAlong(pointIndex, path.node(), 1 * frame/maxFrame))
                    frame++;
                }, 1000/fps)
            }

            for(let i=0;i<data.links.length;i++){
                let pathData = [{x:linkSources[i][0],y:linkSources[i][1]},{x:linkTargets[i][0],y:linkTargets[i][1]}]

                var path = containerGrp.append("path")
                    .attr("d", lineFunc(pathData))
                
                // move point i along path
                transition(i,path)
            }
            
            /**
             * Get position of the point when it moves along the path
             * @param {*} index index of point
             * @param {*} path which the point moves along
             * @param {*} percentage percentage of path length, represent the position of the point
             */
            function translateAlong(index,path, percentage) {
                var l = path.getTotalLength();
                var p = path.getPointAtLength(percentage * l);
                // new position
                return "translate(" + p.x + "," + p.y + ") "+"rotate("+getAngle(linkSources[index], linkTargets[index])+")"; 
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

                if(point) point.style("visibility", "hidden");

                link.style("opacity", function (o) {
                    // only related points are visible
                    if(point) point.each(function (p, i) {
                        if((o.source.index == d.index && o.source.x == p[0] && o.source.y == p[1]) || (o.target.index == d.index && o.target.x == linkTargets[i][0] && o.target.y == linkTargets[i][1])) {
                            $("#point"+i).css("visibility","visible")
                        }
                    });
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
                { this.state.nodeShow && <div id="nodesGraph"></div> }
                { this.state.nodeShow && 
                    <div className="hostlist-contaniner">                
                        <ul className="host-list">
                        {
                            this.state.triasData && this.state.triasData.nodes && this.state.triasData.nodes.map(function(item,index){
                                return (
                                    <li key={"host"+index}  className={item.level===1?"normal":(item.level===0?"premium":"problem")} >
                                        <span className="label">
                                            <FormattedMessage id="termRanking"/>
                                            <div className={item.trend===0?"trend":(item.trend===1?"trend up":"trend down")}></div>
                                        </span>
                                        <span className="label"><FormattedMessage id="termNode"/> IP</span>
                                        <span className="value">#{index+1}</span>
                                        <span className="value">{item.node_ip}<div className={item.status===0?"circle":"circle red"}></div></span>
                                    </li>
                                )
                            })
                        }
                        </ul>
                    </div>
                }
                { !this.state.nodeShow && 
                    <div className="failure-modal">
                        <div className="info">
                            <img src={require("../img/icon_maintenance@2x.png")} />
                            <p>System is currently under maintenance, can not sync statistics.</p>
                        </div>
                    </div>
                }
            </div>
        )
    }
}