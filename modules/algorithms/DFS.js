export function DFS(nodeList, $root) {
    if (nodeList.length == 0) return
    let visitOrder = [];
    console.log("root: ", $root.data("id"))
    console.log("DFS start")
    let stack = [];
    nodeList.forEach(node => {
        console.log("id: ", node.data("id"))
        // node.css("border-color", "black")
        node.data("visited", false);
        // node.data("distance", 0)
    })//"Ø"
    stack.push($root)
    while (stack.length != 0) {
        let $currNode = stack.pop();
        visitOrder.push($currNode.data("id"))
        if ($currNode.data("visited") == false) {
            $currNode.data("visited", true)
            $currNode.data("neighbors").forEach(node => {
                let $currNeighbor = node.neighbor
                if ($currNeighbor.data("visited") == false) {
                    stack.push($currNeighbor)
                }

            })
        }
    }

    console.log(visitOrder)
}

// export function DFS(nodeList, $root) {
//     if (nodeList.length == 0) return
//     let visitOrder = [];
//     console.log("root: ", $root.data("id"))
//     console.log("DFS start")
//     nodeList.forEach(node => {
//         console.log("id: ", node.data("id"))
//         // node.css("border-color", "black")
//         node.data("visited", false);
//         // node.data("distance", 0)
//     })//"Ø"
//     DFS_Explore($root, visitOrder)
//     console.log(visitOrder)
// }

// function DFS_Explore($currNode, visitOrder) {
//     visitOrder.push($currNode.data("id"))
//     $currNode.data("visited", true)
//     $currNode.data("neighbors").forEach(node => {
//         let $currNeighbor = node.neighbor
//         if ($currNeighbor.data("visited") == false) {
//             DFS_Explore($currNeighbor, visitOrder)
//         }
//         // else {
//         //     console.log("cycle detected")
//         // }

//     })
// }

//DFS(V, E, Root):  
// V: vertices, E: edges, Root: start    
// For each vertex v in V:       
//  Processed[v] = false    
//  DFS_Explore(V, E, Root, Processed)
//  DFS_Explore(V, E, Curr_node, Processed):    
//  Process Curr_node    
//  Processed[Curr_node] = True    
//  For each neighbor n of Curr_node:        
//  If Processed[n] is False:            
//  DFS_Explore(V, E, n, Processed)

// Initialize an empty stack for storage of nodes, S.
// For each vertex u, define u.visited to be false.
// Push the root (first node to be visited) onto S.
// While S is not empty:
//     Pop the first element in S, u.
//     If u.visited = false, then:
//         U.visited = true
//         for each unvisited neighbor w of u:
//             Push w into S.
// End process when all nodes have been visited.

function createDFSTableViz(nodeList) {
    let $controlPanel = $("#graph-control-panel")
    let $BFSTable =  $( 
        `
            <table class="bfs-viz-feature">
                <thead>
                    <tr>
                        <th>Node</th>
                        <th>Discovered</th>
                        <th>Visited</th>
                        <th>Distance</th>
                    </tr>
                </thead>
                
            </table>
        `
    )
    let $BFSTableBody = $(
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
                    <td id=${node.data("id") + "-" + "discovered"}>False</td>
                    <td id=${node.data("id") + "-" + "visited"}>False</td>
                    <td id=${node.data("id") + "-" + "distance"}>∞</td>
                </tr>
            `
        )
        nodeTableInfo.appendTo($BFSTableBody)
    })
    $BFSTableBody.appendTo($BFSTable)
    $BFSTable.appendTo($controlPanel)

    return $BFSTable
}

// function markNodeAsDiscovered($node) {
//     $("#" + $node.data("id") + "-" + "discovered").html("true")
//     $node.data("discovered", true);
//     $node.addClass("discovered-node")
// }

// function createBFSQueueViz() {
//     let $controlPanel = $("#graph-control-panel")
//     let $BFSQueue =  $( 
//         `
//             <div class="bfs-viz-feature ">
//                 <header>Queue</header>
//                 <span>[</span>
//                 <span id="bfs-queue-viz">
                    
//                 </span>
//                 <span>]</span>
//             </div>
//         `
//     )
//     $BFSQueue.appendTo($controlPanel)
// }

// function createBFSVisitOrderViz() {
//     let $controlPanel = $("#graph-control-panel")
//     let $BFSQueue =  $( 
//         `
//             <div class="bfs-viz-feature ">
//                 <header>Visit Order</header>
//                 <span>[</span>
//                 <span id="bfs-visit-order-viz">
                    
//                 </span>
//                 <span>]</span>
//             </div>
//         `
//     )
//     $BFSQueue.appendTo($controlPanel)
// }


    // label root as discovered
    //   Q.enqueue(root)
    //   while Q is not empty do
    //       v := Q.dequeue()
    //       if v is the goal then
    //          return v
    //     for all edges from v to w in G.adjacentEdges(v) do
    //          if w is not labeled as discovered then
    //              label w as discovered
    //               Q.enqueue(w)