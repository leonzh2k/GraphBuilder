export function Dijkstra(nodeList, $start) {
    let commandOrder = []; //command queue
    // reset colors of all nodes and edges
    nodeList.forEach(node => {
        node.attr("class", "node")
        // node.css("border", "3.5px black solid")
        node.data("neighbors").forEach(neighbor => {
            neighbor.edge.attr("class", "edge")
        })
    })
    $(".control-panel-viz-feature").remove();
    createDijkstraTableViz(nodeList)
    nodeList.forEach(node => {
        node.data("finalized", false)
        node.data("distance", Infinity)
        node.data("parent", null)
    })
    $start.data("distance", 0)
    // commandOrder.push({
    //     command: "firstNode", //means highlight this node to show
    //     node: $start
    // })
    $("#" + $start.data("id") + "-" + "finalized").html("true")
    $("#" + $start.data("id") + "-" + "distance").html(String($start.data("distance")))

    let numberOfFinalizedVertices = 0;
    while (numberOfFinalizedVertices < nodeList.length) {
        console.log(nodeList)
        let nodeListCpy = nodeList.filter(node => node.data("distance") != Infinity)
        console.log(nodeListCpy)
        let lowestDistanceVertex;
        //find lowest distance node
        nodeListCpy.sort((node1, node2) => node1.data("distance") - node2.data("distance"));

        for (let i = 0; i < nodeListCpy.length; i++) {
            if (!nodeListCpy[i].data("finalized")) {
                lowestDistanceVertex = nodeListCpy[i];
                console.log("lowest distance: ", lowestDistanceVertex.data("id"))
                break;
            }
        }
        commandOrder.push({
            command: "finalize", //means highlight this node to show
            node: lowestDistanceVertex
        })
        console.log("lowest distance vertex: ", lowestDistanceVertex.data("id"))
        lowestDistanceVertex.data("finalized", true);
        $("#" + lowestDistanceVertex.data("id") + "-" + "finalized").html("true")
        numberOfFinalizedVertices++;

        lowestDistanceVertex.data("neighbors").forEach(neighbor => {
            console.log(lowestDistanceVertex.data("distance"))
            console.log(neighbor.neighbor.data("distance"))
            commandOrder.push({
                command: "checkEdge", 
                edge: neighbor.edge
            })
            //update distance
            if (lowestDistanceVertex.data("distance") + neighbor.weight < neighbor.neighbor.data("distance")) {
                //check whether first update or not
                let firstUpdate = false;
                if (neighbor.neighbor.data("distance") == Infinity) {
                    firstUpdate = true;
                }
                //oldPath and newPath
                let oldPath = [];
                let newPath = [];
                //if path to node is first time updated, there is no old shortest path
                if (firstUpdate) {
                    neighbor.neighbor.data("distance", lowestDistanceVertex.data("distance") + neighbor.weight)
                    // console.log("new neighbor distance: ", neighbor.neighbor.data("distance"))
                    neighbor.neighbor.data("parent", lowestDistanceVertex)
                    neighbor.neighbor.data("parentEdge", neighbor.edge)
                    //calculate nodes and edges in newPath
                    newPath.push({
                        node: neighbor.neighbor,
                        edge: neighbor.edge
                    })
                    let parent = neighbor.neighbor.data("parent");
                    while (parent != $start && parent != null) {
                        newPath.push({
                            node: parent,
                            edge: parent.data("parentEdge")
                        })
                        parent = parent.data("parent")
                    }
                    commandOrder.push({
                        command: "updatePath", 
                        node: neighbor.neighbor,
                        parent: lowestDistanceVertex,
                        distance: neighbor.neighbor.data("distance"),
                        firstUpdate: true, // 
                        newPath: newPath
                    })
                }
                else {
                    oldPath.push({
                        node: neighbor.neighbor,
                        edge: neighbor.neighbor.data("parentEdge")
                    })
                    let parent = neighbor.neighbor.data("parent");
                    while (parent != $start && parent != null) {
                        oldPath.push({
                            node: parent,
                            edge: parent.data("parentEdge")
                        })
                        parent = parent.data("parent")
                    }
                    neighbor.neighbor.data("distance", lowestDistanceVertex.data("distance") + neighbor.weight)
                    // console.log("new neighbor distance: ", neighbor.neighbor.data("distance"))
                    neighbor.neighbor.data("parent", lowestDistanceVertex)
                    neighbor.neighbor.data("parentEdge", neighbor.edge)

                    //calculate newPath
                    newPath.push({
                        node: neighbor.neighbor,
                        edge: neighbor.edge
                    })
                    parent = neighbor.neighbor.data("parent");
                    while (parent != $start && parent != null) {
                        newPath.push({
                            node: parent,
                            edge: parent.data("parentEdge")
                        })
                        parent = parent.data("parent")
                    }


                    commandOrder.push({
                        node: neighbor.neighbor,
                        parent: lowestDistanceVertex,
                        distance: neighbor.neighbor.data("distance"),
                        command: "updatePath", 
                        firstUpdate: false, // 
                        oldPath: oldPath,
                        newPath: newPath
                    })
                }
                

                
                
            }
        })
    }
    console.log(commandOrder)
    let delay = 1000;
    let speedScale = 500; //delay between steps
    commandOrder.forEach(command => {
        if (command.command == "finalize") {
            setTimeout(() => {
                console.log("de")
                command.node.addClass("dijkstra-visited-node")
                $("#" + command.node.data("id") + "-" + "finalized").html("true")

            }, delay)

        }
        else if (command.command == "checkEdge") {
            setTimeout(() => {
                command.edge.addClass("dijkstra-checked-edge")
            }, delay)
            setTimeout(() => {
                command.edge.removeClass("dijkstra-checked-edge")
            }, delay + speedScale)
        }
        else if (command.command == "updatePath") {
            if (command.firstUpdate) {
                setTimeout(() => {
                    command.newPath.forEach(pair => {
                        pair.edge.addClass("dijkstra-first-new-path-edge")
                    })
                    $("#" + command.node.data("id") + "-" + "distance").html(String(command.distance))
                    $("#" + command.node.data("id") + "-" + "parent").html(command.parent.data("id"))
                }, delay)
                setTimeout(() => {
                    command.newPath.forEach(pair => {
                        pair.edge.removeClass("dijkstra-first-new-path-edge")
                    })
                }, delay + speedScale)
            }
            else {
                setTimeout(() => {
                    command.oldPath.forEach(pair => {
                        pair.edge.addClass("dijkstra-old-path-edge")
                    })
                }, delay)
                setTimeout(() => {
                    command.oldPath.forEach(pair => {
                        pair.edge.removeClass("dijkstra-old-path-edge")
                    })
                }, delay + speedScale)

                setTimeout(() => {
                    command.newPath.forEach(pair => {
                        pair.edge.addClass("dijkstra-new-path-edge")
                    })
                    $("#" + command.node.data("id") + "-" + "distance").html(String(command.distance))
                    $("#" + command.node.data("id") + "-" + "parent").html(command.parent.data("id"))
                }, delay + speedScale)
                setTimeout(() => {
                    command.newPath.forEach(pair => {
                        pair.edge.removeClass("dijkstra-new-path-edge")
                    })
                }, delay + speedScale * 2)
                delay += speedScale;
            }
            
        }


        delay += speedScale;
    })
    console.log("delay: ", delay)
    // console.log(numberOfFinalizedVertices, nodeList.length)
    // console.log("DISTANCES");
    // console.log("=======================");
    // nodeList.forEach(node => {
    //     console.log("------------------")
    //     console.log("node id: ", node.data("id"));
    //     console.log("node distance: ", node.data("distance"));
    //     console.log("------------------")
    // })
    // console.log("=======================");
}

//gets amount of time required for dijkstra to run and returns it.
export function getDijkstraTime(nodeList, $start) {
    let commandOrder = []; //command queue
    // reset colors of all nodes and edges
    nodeList.forEach(node => {
        node.attr("class", "node")
        // node.css("border", "3.5px black solid")
        node.data("neighbors").forEach(neighbor => {
            neighbor.edge.attr("class", "edge")
        })
    })
    $(".control-panel-viz-feature").remove();
    createDijkstraTableViz(nodeList)
    nodeList.forEach(node => {
        node.data("finalized", false)
        node.data("distance", Infinity)
        node.data("parent", null)
    })
    $start.data("distance", 0)
    // commandOrder.push({
    //     command: "firstNode", //means highlight this node to show
    //     node: $start
    // })
    // $("#" + $start.data("id") + "-" + "finalized").html("true")
    // $("#" + $start.data("id") + "-" + "distance").html(String($start.data("distance")))

    let numberOfFinalizedVertices = 0;
    while (numberOfFinalizedVertices < nodeList.length) {
        console.log(nodeList)
        let nodeListCpy = nodeList.filter(node => node.data("distance") != Infinity)
        console.log(nodeListCpy)
        let lowestDistanceVertex;
        //find lowest distance node
        nodeListCpy.sort((node1, node2) => node1.data("distance") - node2.data("distance"));

        for (let i = 0; i < nodeListCpy.length; i++) {
            if (!nodeListCpy[i].data("finalized")) {
                lowestDistanceVertex = nodeListCpy[i];
                console.log("lowest distance: ", lowestDistanceVertex.data("id"))
                break;
            }
        }
        commandOrder.push({
            command: "finalize", //means highlight this node to show
            node: lowestDistanceVertex
        })
        console.log("lowest distance vertex: ", lowestDistanceVertex.data("id"))
        lowestDistanceVertex.data("finalized", true);
        $("#" + lowestDistanceVertex.data("id") + "-" + "finalized").html("true")
        numberOfFinalizedVertices++;

        lowestDistanceVertex.data("neighbors").forEach(neighbor => {
            console.log(lowestDistanceVertex.data("distance"))
            console.log(neighbor.neighbor.data("distance"))
            commandOrder.push({
                command: "checkEdge", 
                edge: neighbor.edge
            })
            //update distance
            if (lowestDistanceVertex.data("distance") + neighbor.weight < neighbor.neighbor.data("distance")) {
                //check whether first update or not
                let firstUpdate = false;
                if (neighbor.neighbor.data("distance") == Infinity) {
                    firstUpdate = true;
                }
                //oldPath and newPath
                let oldPath = [];
                let newPath = [];
                //if path to node is first time updated, there is no old shortest path
                if (firstUpdate) {
                    neighbor.neighbor.data("distance", lowestDistanceVertex.data("distance") + neighbor.weight)
                    // console.log("new neighbor distance: ", neighbor.neighbor.data("distance"))
                    neighbor.neighbor.data("parent", lowestDistanceVertex)
                    neighbor.neighbor.data("parentEdge", neighbor.edge)
                    //calculate nodes and edges in newPath
                    newPath.push({
                        node: neighbor.neighbor,
                        edge: neighbor.edge
                    })
                    let parent = neighbor.neighbor.data("parent");
                    while (parent != $start && parent != null) {
                        newPath.push({
                            node: parent,
                            edge: parent.data("parentEdge")
                        })
                        parent = parent.data("parent")
                    }
                    commandOrder.push({
                        command: "updatePath", 
                        node: neighbor.neighbor,
                        parent: lowestDistanceVertex,
                        distance: neighbor.neighbor.data("distance"),
                        firstUpdate: true, // 
                        newPath: newPath
                    })
                }
                else {
                    oldPath.push({
                        node: neighbor.neighbor,
                        edge: neighbor.neighbor.data("parentEdge")
                    })
                    let parent = neighbor.neighbor.data("parent");
                    while (parent != $start && parent != null) {
                        oldPath.push({
                            node: parent,
                            edge: parent.data("parentEdge")
                        })
                        parent = parent.data("parent")
                    }
                    neighbor.neighbor.data("distance", lowestDistanceVertex.data("distance") + neighbor.weight)
                    // console.log("new neighbor distance: ", neighbor.neighbor.data("distance"))
                    neighbor.neighbor.data("parent", lowestDistanceVertex)
                    neighbor.neighbor.data("parentEdge", neighbor.edge)

                    //calculate newPath
                    newPath.push({
                        node: neighbor.neighbor,
                        edge: neighbor.edge
                    })
                    parent = neighbor.neighbor.data("parent");
                    while (parent != $start && parent != null) {
                        newPath.push({
                            node: parent,
                            edge: parent.data("parentEdge")
                        })
                        parent = parent.data("parent")
                    }


                    commandOrder.push({
                        node: neighbor.neighbor,
                        parent: lowestDistanceVertex,
                        distance: neighbor.neighbor.data("distance"),
                        command: "updatePath", 
                        firstUpdate: false, // 
                        oldPath: oldPath,
                        newPath: newPath
                    })
                }
                

                
                
            }
        })
    }
    console.log(commandOrder)
    let delay = 1000;
    let speedScale = 500; //delay between steps
    commandOrder.forEach(command => {
        if (command.command == "finalize") {
            // setTimeout(() => {
            //     console.log("de")
            //     command.node.addClass("dijkstra-visited-node")
            //     $("#" + command.node.data("id") + "-" + "finalized").html("true")

            // }, delay)

        }
        else if (command.command == "checkEdge") {
            // setTimeout(() => {
            //     command.edge.addClass("dijkstra-checked-edge")
            // }, delay)
            // setTimeout(() => {
            //     command.edge.removeClass("dijkstra-checked-edge")
            // }, delay + speedScale)
        }
        else if (command.command == "updatePath") {
            if (command.firstUpdate) {
                // setTimeout(() => {
                //     command.newPath.forEach(pair => {
                //         pair.edge.addClass("dijkstra-first-new-path-edge")
                //     })
                //     $("#" + command.node.data("id") + "-" + "distance").html(String(command.distance))
                //     $("#" + command.node.data("id") + "-" + "parent").html(command.parent.data("id"))
                // }, delay)
                // setTimeout(() => {
                //     command.newPath.forEach(pair => {
                //         pair.edge.removeClass("dijkstra-first-new-path-edge")
                //     })
                // }, delay + speedScale)
            }
            else {
                // setTimeout(() => {
                //     command.oldPath.forEach(pair => {
                //         pair.edge.addClass("dijkstra-old-path-edge")
                //     })
                // }, delay)
                // setTimeout(() => {
                //     command.oldPath.forEach(pair => {
                //         pair.edge.removeClass("dijkstra-old-path-edge")
                //     })
                // }, delay + speedScale)

                // setTimeout(() => {
                //     command.newPath.forEach(pair => {
                //         pair.edge.addClass("dijkstra-new-path-edge")
                //     })
                //     $("#" + command.node.data("id") + "-" + "distance").html(String(command.distance))
                //     $("#" + command.node.data("id") + "-" + "parent").html(command.parent.data("id"))
                // }, delay + speedScale)
                // setTimeout(() => {
                //     command.newPath.forEach(pair => {
                //         pair.edge.removeClass("dijkstra-new-path-edge")
                //     })
                // }, delay + speedScale * 2)
                delay += speedScale;
            }
            
        }


        delay += speedScale;
    })
    console.log("delay from getDijkstraTie: ", delay)
    return delay
}

function createDijkstraTableViz(nodeList) {
    let $controlPanel = $("#graph-control-panel")
    let $DijkstraTable =  $( 
        `
            <table class="dijkstra-viz-feature control-panel-viz-feature">
                <thead>
                    <tr>
                        <th>Node</th>
                        <th>Finalized</th>
                        <th>Distance</th>
                        <th>Parent</th>
                    </tr>
                </thead>
                
            </table>
        `
    )
    let $DijkstraTableBody = $(
        `
            <tbody>

            </tbody>
        `
    )
    //appends one row for each node in adj list
    nodeList.forEach(node => {
        let nodeTableInfo = $(
            `
                <tr> 
                    <td>${node.data("id")}</td>
                    <td id=${node.data("id") + "-" + "finalized"}>False</td>
                    <td id=${node.data("id") + "-" + "distance"}>∞</td>
                    <td id=${node.data("id") + "-" + "parent"}>N/A</td>
                </tr>
            `
        )
        nodeTableInfo.appendTo($DijkstraTableBody)
    })
    $DijkstraTableBody.appendTo($DijkstraTable)
    $DijkstraTable.appendTo($controlPanel)

    return $DijkstraTable
}


// init arrays Finalized[v] = false, Distance[v] = Infinity, Parent[v] = None for each v
// Distance[s] = 0  // or else wouldn't know where to start
// While not finalized all vertices:    
    // Choose non-finalized vertex v with lowest Distance[v]    
    // Finalized[v] = true    
    //  For each neighbor n of v:        // Don't check Finalized[n] because once finalized, will never find lower distance.        
    //  If Distance[v] + cost(v,n) < Distance[n]:            
    //      Distance[n] = Distance[v] + cost(v,n)            
    //      Parent[n] = v