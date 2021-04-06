export function Prim(nodeList, $start) {
    $(".control-panel-viz-feature").remove();
    createPrimTableViz(nodeList);
    // reset colors of all nodes and edges
    nodeList.forEach(node => {
        node.attr("class", "node")
        // node.css("border", "3.5px black solid")
        node.data("neighbors").forEach(neighbor => {
            neighbor.edge.attr("class", "edge")
        })
    })
    let MSTVertices = []; // nodes in the tree that will be grown
    let MSTEdges = [];
    let commandOrder = []; //command queue
    MSTVertices.push($start);
    commandOrder.push({
        command: "firstNode", //means highlight this node to show
        node: $start
    })
    while (MSTVertices.length != nodeList.length) { //ends when all vertices are put in the MST
        let neighborsOfMST = []; //get list of nodes not in MST but are connected to MST
        MSTVertices.forEach(vertex => {
            // commandOrder.push({
            //     command: "visitNode", //means highlight this node to show
            //     node: vertex
            // })
            vertex.data("neighbors").forEach(neighbor => {
                if (MSTVertices.includes(neighbor.neighbor)) {
                    // commandOrder.push({
                    //     command: "checkEdge", //means we are highlighting this edge so show we are checking it
                    //     params: "createsCycle", // if mst includes neighbor, than it creates a cycle
                    //     edge: neighbor.edge
                    // })
                    return;
                }
                neighbor.mstVertex = vertex;
                neighborsOfMST.push(neighbor)
                commandOrder.push({
                    command: "checkEdge", //means we are highlighting this edge so show we are checking it
                    params: null,
                    edge: neighbor.edge
                })
            })
        })
        console.log("neihbors of MST: ")
        neighborsOfMST.forEach(neighbor => {
            console.log(neighbor.neighbor.data("id"))
        })
        neighborsOfMST.sort((neighbor1, neighbor2) => neighbor1.weight - neighbor2.weight)
        console.log("neihbors of MST (osrted by weight): ")
        neighborsOfMST.forEach(neighbor => {
            console.log(neighbor.neighbor.data("id"))
        })
        ///newest edge of MST
        let MSTEdge = {
            vertex1: neighborsOfMST[0].mstVertex,
            vertex2: neighborsOfMST[0].neighbor
        }
        MSTVertices.push(neighborsOfMST[0].neighbor)
        // neighborsOfMST[0].edge.css("backgroundColor", "yellow")
        MSTEdges.push(MSTEdge)

        //command to add edge to MST
        commandOrder.push({
            command: "addToMST", //means we are highlighting this edge so show it is added to MST
            nodeToAdd: neighborsOfMST[0].neighbor,
            nodeToAddsNeighbor: neighborsOfMST[0].mstVertex,
            edge: neighborsOfMST[0].edge
        })
        console.log("MST: ")
        MSTEdges.forEach(edge => {
            console.log(`${edge.vertex1.data("id")} - ${edge.vertex2.data("id")}`);
        })
        
    } 
    nodeList.forEach(node => {
        node.data("inMST", false)
    })
    let delay = 1000;
    let speedScale = 1000; //delay between steps
    commandOrder.forEach(command => {
        if (command.command == "firstNode") {
            setTimeout(() => {
                command.node.addClass("mst-tree-node")
                command.node.data("inMST", true)
                $("#" + command.node.data("id") + "-" + "inMST").html("true")
                // nodeList.forEach(node => {
                //     if (node == command.node) {
                //         console.log("die")
                //     }
                //     if (node.data("inMST") == true) {
                //         console.log("die2")
                //     }
                // })
            }, delay)
        }
        // else if (command.command == "visitNode") {
        //     setTimeout(() => {
        //         command.node.css("border", "3.5px blue solid")
        //     }, delay)
        //     nodeList.forEach(node => {
        //         if (node == command.node) {
        //             console.log("die")
        //         }
        //         if (node.data("inMST") == true) {
        //             console.log("die2")
        //         }
        //     })
        //     if (command.node.data("inMST") == true) {
        //         console.log("in mst")
        //         setTimeout(() => {
        //             command.node.css("border", "3.5px green solid")
        //         }, delay + (speedScale * (command.node.data("neighbors").length + 1)))
        //     }
        //     else {
        //         setTimeout(() => {
        //             command.node.css("border", "3.5px black solid")
        //         }, delay + (speedScale * (command.node.data("neighbors").length + 1)))
        //     }
            
        // }
        else if (command.command == "checkEdge") {
            setTimeout(() => {
                if (command.params == "createsCycle") {
                    command.edge.css("backgroundColor", "red")
                }
                else {
                    command.edge.addClass("mst-checked-edge")
                }
            }, delay)
            setTimeout(() => {
                command.edge.removeClass("mst-checked-edge")
            }, delay + speedScale)
        }
        else if (command.command == "addToMST") {
            setTimeout(() => {
                command.nodeToAdd.addClass("mst-tree-node")
                command.edge.addClass("mst-tree-edge")
                $("#" + command.nodeToAdd.data("id") + "-" + "inMST").html("true")
                $("#" + command.nodeToAdd.data("id") + "-" + "mstNeighbor").html(command.nodeToAddsNeighbor.data("id"))
                // command.edge.data("")
            }, delay)
            // setTimeout(() => {
            //     command.nodeToAdd.css("border", "3.5px black solid")
            //     command.edge.css("backgroundColor", "yellow")
            // }, delay + 2000)
        }
        delay += speedScale;
    })
    

}
//gets amount of time required for Prim to run and returns it.
export function getPrimTime(nodeList, $start) {
    $(".control-panel-viz-feature").remove();
    createPrimTableViz(nodeList);
    // reset colors of all nodes and edges
    nodeList.forEach(node => {
        node.attr("class", "node")
        // node.css("border", "3.5px black solid")
        node.data("neighbors").forEach(neighbor => {
            neighbor.edge.attr("class", "edge")
        })
    })
    let MSTVertices = []; // nodes in the tree that will be grown
    let MSTEdges = [];
    let commandOrder = []; //command queue
    MSTVertices.push($start);
    commandOrder.push({
        command: "firstNode", //means highlight this node to show
        node: $start
    })
    while (MSTVertices.length != nodeList.length) { //ends when all vertices are put in the MST
        let neighborsOfMST = []; //get list of nodes not in MST but are connected to MST
        MSTVertices.forEach(vertex => {
            // commandOrder.push({
            //     command: "visitNode", //means highlight this node to show
            //     node: vertex
            // })
            vertex.data("neighbors").forEach(neighbor => {
                if (MSTVertices.includes(neighbor.neighbor)) {
                    // commandOrder.push({
                    //     command: "checkEdge", //means we are highlighting this edge so show we are checking it
                    //     params: "createsCycle", // if mst includes neighbor, than it creates a cycle
                    //     edge: neighbor.edge
                    // })
                    return;
                }
                neighbor.mstVertex = vertex;
                neighborsOfMST.push(neighbor)
                commandOrder.push({
                    command: "checkEdge", //means we are highlighting this edge so show we are checking it
                    params: null,
                    edge: neighbor.edge
                })
            })
        })
        console.log("neihbors of MST: ")
        neighborsOfMST.forEach(neighbor => {
            console.log(neighbor.neighbor.data("id"))
        })
        neighborsOfMST.sort((neighbor1, neighbor2) => neighbor1.weight - neighbor2.weight)
        console.log("neihbors of MST (osrted by weight): ")
        neighborsOfMST.forEach(neighbor => {
            console.log(neighbor.neighbor.data("id"))
        })
        ///newest edge of MST
        let MSTEdge = {
            vertex1: neighborsOfMST[0].mstVertex,
            vertex2: neighborsOfMST[0].neighbor
        }
        MSTVertices.push(neighborsOfMST[0].neighbor)
        // neighborsOfMST[0].edge.css("backgroundColor", "yellow")
        MSTEdges.push(MSTEdge)

        //command to add edge to MST
        commandOrder.push({
            command: "addToMST", //means we are highlighting this edge so show it is added to MST
            nodeToAdd: neighborsOfMST[0].neighbor,
            nodeToAddsNeighbor: neighborsOfMST[0].mstVertex,
            edge: neighborsOfMST[0].edge
        })
        console.log("MST: ")
        MSTEdges.forEach(edge => {
            console.log(`${edge.vertex1.data("id")} - ${edge.vertex2.data("id")}`);
        })
        
    } 
    nodeList.forEach(node => {
        node.data("inMST", false)
    })
    let delay = 1000;
    let speedScale = 1000; //delay between steps
    commandOrder.forEach(command => {
        if (command.command == "firstNode") {
            // setTimeout(() => {
            //     command.node.addClass("mst-tree-node")
            //     command.node.data("inMST", true)
            //     $("#" + command.node.data("id") + "-" + "inMST").html("true")
            //     // nodeList.forEach(node => {
            //     //     if (node == command.node) {
            //     //         console.log("die")
            //     //     }
            //     //     if (node.data("inMST") == true) {
            //     //         console.log("die2")
            //     //     }
            //     // })
            // }, delay)
        }
        // else if (command.command == "visitNode") {
        //     setTimeout(() => {
        //         command.node.css("border", "3.5px blue solid")
        //     }, delay)
        //     nodeList.forEach(node => {
        //         if (node == command.node) {
        //             console.log("die")
        //         }
        //         if (node.data("inMST") == true) {
        //             console.log("die2")
        //         }
        //     })
        //     if (command.node.data("inMST") == true) {
        //         console.log("in mst")
        //         setTimeout(() => {
        //             command.node.css("border", "3.5px green solid")
        //         }, delay + (speedScale * (command.node.data("neighbors").length + 1)))
        //     }
        //     else {
        //         setTimeout(() => {
        //             command.node.css("border", "3.5px black solid")
        //         }, delay + (speedScale * (command.node.data("neighbors").length + 1)))
        //     }
            
        // }
        else if (command.command == "checkEdge") {
            // setTimeout(() => {
            //     if (command.params == "createsCycle") {
            //         command.edge.css("backgroundColor", "red")
            //     }
            //     else {
            //         command.edge.addClass("mst-checked-edge")
            //     }
            // }, delay)
            // setTimeout(() => {
            //     command.edge.removeClass("mst-checked-edge")
            // }, delay + speedScale)
        }
        else if (command.command == "addToMST") {
            // setTimeout(() => {
            //     command.nodeToAdd.addClass("mst-tree-node")
            //     command.edge.addClass("mst-tree-edge")
            //     $("#" + command.nodeToAdd.data("id") + "-" + "inMST").html("true")
            //     $("#" + command.nodeToAdd.data("id") + "-" + "mstNeighbor").html(command.nodeToAddsNeighbor.data("id"))
            //     // command.edge.data("")
            // }, delay)
            // setTimeout(() => {
            //     command.nodeToAdd.css("border", "3.5px black solid")
            //     command.edge.css("backgroundColor", "yellow")
            // }, delay + 2000)
        }
        delay += speedScale;
    })
    
    return delay;
}
function createPrimTableViz(nodeList) {
    let $controlPanel = $("#graph-control-panel")
    let $PrimTable =  $( 
        `
            <table class="prim-viz-feature control-panel-viz-feature">
                <thead>
                    <tr>
                        <th>Node</th>
                        <th>In MST</th>
                        <th>MST Neighbor</th>
                    </tr>
                </thead>
                
            </table>
        `
    )
    let $PrimTableBody = $(
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
                    <td id=${node.data("id") + "-" + "inMST"}>False</td>
                    <td id=${node.data("id") + "-" + "mstNeighbor"}>N/A</td>
                </tr>
            `
        )
        nodeTableInfo.appendTo($PrimTableBody)
    })
    $PrimTableBody.appendTo($PrimTable)
    $PrimTable.appendTo($controlPanel)

    return $PrimTable
}

// nodeListCpy = nodeList.filter(node => !MSTVertices.includes(node))
        // nodeListCpy.sort((node1, node2) => node1.data("distance") - node2.data("distance"));
        
        
        
        
        
        // for (let i = 0; i < MSTVertices.length; i++) { // check every neighbor of every node in the tree.
        //     let vertex = MSTVertices[i];
        //     for (let j = 0; j < vertex.data("neighbors").length; j++) { 
        //         let neighbor = vertex.data("neighbors")[j];
        //         if (MSTVertices.includes(neighbor)) { //checks if created cycle
        //             continue;
        //         }
        //     }
        // }