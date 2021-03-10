export function Dijkstra(nodeList, $start) {
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
        console.log("lowest distance vertex: ", lowestDistanceVertex.data("id"))
        lowestDistanceVertex.data("finalized", true);
        $("#" + lowestDistanceVertex.data("id") + "-" + "finalized").html("true")
        numberOfFinalizedVertices++;

        lowestDistanceVertex.data("neighbors").forEach(neighbor => {
            console.log(lowestDistanceVertex.data("distance"))
            console.log(neighbor.neighbor.data("distance"))
            if (lowestDistanceVertex.data("distance") + neighbor.weight < neighbor.neighbor.data("distance")) {
                console.log("dies")
                neighbor.neighbor.data("distance", lowestDistanceVertex.data("distance") + neighbor.weight)
                console.log("new neighbor distance: ", neighbor.neighbor.data("distance"))
                neighbor.neighbor.data("parent", lowestDistanceVertex)
                console.log("new parent: ", neighbor.neighbor.data("parent").data("id"))
                $("#" + neighbor.neighbor.data("id") + "-" + "distance").html(String(neighbor.neighbor.data("distance")))
                $("#" + neighbor.neighbor.data("id") + "-" + "parent").html(lowestDistanceVertex.data("id"))
            }
        })
    }
    
    console.log(numberOfFinalizedVertices, nodeList.length)
    console.log("DISTANCES");
    console.log("=======================");
    nodeList.forEach(node => {
        console.log("------------------")
        console.log("node id: ", node.data("id"));
        console.log("node distance: ", node.data("distance"));
        console.log("------------------")
    })
    console.log("=======================");
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