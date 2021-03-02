export function Prim(nodeList, $start) {
    $(".control-panel-viz-feature").remove();
    let MSTVertices = []; // nodes in the tree that will be grown
    let MSTEdges = [];
    MSTVertices.push($start);
    while (MSTVertices.length != nodeList.length) { //ends when all vertices are put in the MST
        let neighborsOfMST = []; //get list of nodes not in MST but are connected to MST
        MSTVertices.forEach(vertex => {
            vertex.data("neighbors").forEach(neighbor => {
                if (MSTVertices.includes(neighbor.neighbor)) {
                    return;
                }
                neighbor.mstVertex = vertex;
                neighborsOfMST.push(neighbor)
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
        neighborsOfMST[0].edge.css("backgroundColor", "yellow")
        MSTEdges.push(MSTEdge)
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
    } 
    console.log("MST: ")
    MSTEdges.forEach(edge => {
        console.log(`${edge.vertex1.data("id")} - ${edge.vertex2.data("id")}`);
    })

}