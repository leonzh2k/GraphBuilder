export function BFS(nodeList, $root) {
    //remove any existing viz features
    $(".bfs-viz-feature").remove();
    let $BFSTable = createBFSTableViz(nodeList);
    let $BFSQueue = createBFSQueueViz();
    let visitOrder = [];
    console.log("root: ", $root.data("id"))
    console.log("BFS start")
    let queue = [];
    nodeList.forEach(node => {
        console.log("id: ", node.data("id"))
        // node.css("border-color", "black")
        node.data("discovered", false);
        node.data("distance", 0)
    })//"Ø"
    $root.data("discovered", true);
    $("#" + $root.data("id") + "-" + "distance").html(String($root.data("distance")))
    $("#" + $root.data("id") + "-" + "discovered").html("Ø")
    // $("#bfs-queue-viz").html($("#bfs-queue-viz").html() + $root.data("id"));
    // $("#" + $currNeighbor.data("id") + "-" + "discovered").html("true")
    // $("#" + $currNeighbor.data("id") + "-" + "discovered").html("true")
    $root.addClass("visited-node")
    queue.push($root)
    visitOrder.push($root.data("id"))
    let delay = 0;
    let iterations = 0;
    for (let i = 0; i < nodeList.length; i++) {
        console.log("uho hns")
        if (delay != nodeList.length * 2000) {
            setTimeout(() => {
                let $currNode = queue.shift();
                $("#" + $currNode.data("id") + "-" + "visited").html("true")
                $("#bfs-queue-viz").html($("#bfs-queue-viz").html() + $currNode.data("id"));
                $currNode.removeClass("discovered-node")
                $currNode.addClass("visited-node")
                console.log("current node: ", $currNode.data("id"))
                $currNode.data("neighbors").forEach((node) => {
                    let $currNeighbor = node.neighbor
                    if ($currNeighbor.data("discovered") == false) {
                        $currNeighbor.data("distance", $currNode.data("distance") + 1)
                        $("#" + $currNeighbor.data("id") + "-" + "distance").html(String($currNeighbor.data("distance")))
                        $("#" + $currNeighbor.data("id") + "-" + "discovered").html("true")
                        $currNeighbor.data("discovered", true);
                        $currNeighbor.addClass("discovered-node")
                        // node.edge.css("background", "orange")
                        queue.push($currNeighbor)
                        visitOrder.push($currNeighbor.data("id"))
                    }
                })
                // $currNode.css("border-color", "green")
            }, delay)
            delay += 2000;
        }
        
        // iterations++;

    }
    // console.log("number of iterations: ", iterations)
    // let i = 3;
    // while (delay != 5000) {
    //     setTimeout(() => {
    //         console.log("die")
    //     }, delay)
    //     delay += 1000;
    // }
    //resets all node's colors
    setTimeout(() => {
        nodeList.forEach(node => {
            node.removeClass("visited-node")
            node.removeClass("discovered-node")
            node.removeData("discovered");
            node.removeData("distance");
        })
        console.log("BFS end.")
        let visitOrderStr = "";
        visitOrder.forEach((node) => {
            visitOrderStr = visitOrderStr + node + " "
        })
        console.log("Visit Order: ", visitOrderStr)
        // $BFSTable.remove();
    }, ((nodeList.length + 1) * 2000))

}

function createBFSTableViz(nodeList) {
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

function createBFSQueueViz() {
    let $controlPanel = $("#graph-control-panel")
    let $BFSQueue =  $( 
        `
            <div class="bfs-viz-feature">
                <div id="bfs-queue-viz">
                    []
                </div>
            </div>
        `
    )
    $BFSQueue.appendTo($controlPanel)
}


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