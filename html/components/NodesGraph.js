import React from "react"
import $ from 'jquery'
import * as d3 from "d3";

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
        self.setState({
            nodes:[{
                id:1,
                ip:"123.123.23.123",
                status:0
            },{
                id:2,
                ip:"123.123.23.123",
                status:0 // normal
            },{
                id:3,
                ip:"123.123.23.123",
                status:1 // offline
            }],
            links:[{
                from:1,
                to:2
            },{
                from:3,
                to:1
            }]
        })
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
                    }
                ],
                "nodes": [
                    {
                        "status": "normal",
                        "id": "123.123.123.123",
                    },{
                        "status": "normal",
                        "id": "123.123.123.000",
                    },{
                        "status": "normal",
                        "id": "123.123.123.888",
                    },{
                        "status": "normal",
                        "id": "123.123.123.111",
                    },{
                        "status": "normal",
                        "id": "123.123.123.222",
                    },{
                        "status": "normal",
                        "id": "123.123.123.333",
                    },{
                        "status": "offline",
                        "id": "123.123.123.444",
                    },{
                        "status": "offline",
                        "id": "123.123.123.555",
                    },
                ]
            }
        };
    
        self.updateGraph(data)
    }

    updateGraph(data){
        var width = 738,
            height = 500,
            linkedByIndex = {},
            node = null,
            link = null,
            force = null;

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
            .attr("height", height);
        
        //add container
        var containerGrp = svg.append("g");
        
        //add group of all lines
        //Create all the line svgs but without locations yet
        link = containerGrp
            .selectAll("line")
            .data(data.content.links)
            .enter().append("line")
            .attr({
                "stroke": "#474856"
            });
    
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
                "x" : -52,
                "y" : -53,
                "height" : 106,
            });
        
        //add labeled text to each node
        node.append("text")
            .attr({
                "y" : 20,
                "text-anchor" : "middle",
                "fill": "#FFFFFF",
                "class": "ip"
            })
            .text(function (d) {
                return d.id;
            });
        
        //Now we are giving the SVGs co-ordinates - the force layout is generating the co-ordinates which this code is using to update the attributes of the SVG elements
        //tick event of network node
        force.on("tick", function() {
                node.attr({
                    "cx": function (d) {
                        return d.x = Math.max(15, Math.min(width - 15, d.x));
                    },
                    "cy": function (d) {
                        return d.y = Math.max(15, Math.min(height - 15, d.y));
                    },
                    "transform": function (d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    }
                });
            link.attr({
                    "x1": function (d) {
                        return d.source.x;
                    },
                    "y1": function (d) {
                        return d.source.y;
                    },
                    "x2": function (d) {
                        return d.target.x;
                    },
                    "y2": function (d) {
                        return d.target.y;
                    },
                });
            });
        
        //map of all connected nodes index
        data.content.links.forEach(function (d) {
            linkedByIndex[d.source.index + "," + d.target.index] = true;
        }); 
    }

    render() {
        return (
            <div id="nodesGraph"></div>
        )
    }
}