export function DFS(nodeList, $root) {
    // reset colors of all nodes and edges
    nodeList.forEach(node => {
        node.attr("class", "node")
        // node.css("border", "3.5px black solid")
        node.data("neighbors").forEach(neighbor => {
            neighbor.edge.attr("class", "edge")
        })
    })
    $(".control-panel-viz-feature").remove();
    createDFSTableViz(nodeList);
    createBFSStackViz();
    createDFSVisitOrderViz();
    //queue to add elements.
    let $dfsStackViz = $("#dfs-stack-viz") 
    let $dfsVisitOrder = $("#dfs-visit-order-viz") 
    let visitOrder = [];
    let commandOrder = [];
    console.log("root: ", $root.data("id"))
    console.log("DFS start")
    let stack = [];
    nodeList.forEach(node => {
        console.log("id: ", node.data("id"))
        node.data("visited", false);
    })//"Ø"
    stack.push($root)
    commandOrder.push({
        node: $root,
        command: "visit",
        isFirstStep: true,
        nodesToMarkAsDiscovered: []
    })
    while (stack.length != 0) {
        let $currNode = stack.pop();
        visitOrder.push($currNode.data("id"))
        let nodesToDiscover = [];
        if ($currNode.data("visited") == false) {

            $currNode.data("neighbors").forEach(node => {
                let $currNeighbor = node.neighbor
                if ($currNeighbor.data("visited") == false) {
                    nodesToDiscover.push($currNeighbor)
                }
            })

            commandOrder.push({
                node: $currNode,
                command: "visit",
                isFirstStep: false,
                nodesToMarkAsDiscovered: nodesToDiscover
            })
        }

        if ($currNode.data("visited") == false) {
            $currNode.data("visited", true)
            $currNode.data("neighbors").forEach(node => {
                let $currNeighbor = node.neighbor
                if ($currNeighbor.data("visited") == false) {
                    stack.push($currNeighbor)
                    // commandOrder.push({
                    //     node: $currNeighbor,
                    //     command: "discover"
                    // })
                }

            })
        }
    }
    let delay = 1000;
    commandOrder.forEach(command => {
        setTimeout(() =>{
            let $currNode = command.node
            if (command.isFirstStep) {
                markNodeAsDiscovered($currNode)
                markNodeAsVisited($currNode)
                let $nextStackItem = $(`<span>${$currNode.data("id") + " "}</span>`)
                $nextStackItem.appendTo($dfsStackViz);
                
            }
            else {
                if (command.command == "visit") {
                    let $stackTop = $dfsStackViz.children()[$dfsStackViz.children().length - 1]
                    $stackTop.remove();
                    //update node on table as visited
                    markNodeAsVisited($currNode)
                    command.nodesToMarkAsDiscovered.forEach($node => {
                        let $nextStackItem = $(`<span>${$node.data("id") + " "}</span>`)
                        $nextStackItem.appendTo($dfsStackViz);
                        markNodeAsDiscovered($node)
                    })
                    
                    //update visit order
                    let $nextVisitedNode = $(`<span>${$currNode.data("id") + " "}</span>`)
                    $nextVisitedNode.appendTo($dfsVisitOrder)
                }
                else {
                    $currNode.addClass("discovered-node")
                    $("#dfs-" + $currNode.data("id") + "-" + "discovered").html("true")
                }
            }

            
            // console.log("stuf")
        }, delay)
        delay += 2000;
    })
    delay += 2000;
    let innerDelay = 0;
    setTimeout(() => {
        for (let i = $dfsStackViz.children().length - 1; i > -1; i-- ) {
            setTimeout(() => {
                let $stackTop = $dfsStackViz.children()[i]
                $stackTop.remove();
            }, innerDelay)
            innerDelay += 2000;
        }
    }, delay)
    
    delay += 3000; //delay before highlights on nodes disseappear
    setTimeout(() => {
        nodeList.forEach(node => {
            node.removeClass("visited-node")
            node.removeClass("discovered-node")
            // node.removeClass("discovered-node")
            node.removeData("visited");
            // node.removeData("distance");
        })
        console.log("DFS end.")
        // console.log("visit order:", visitOrder)
        let visitOrderStr = "";
        visitOrder.forEach((node) => {
            visitOrderStr = visitOrderStr + node + " "
        })
        console.log("Visit Order: ", visitOrderStr)
        // $BFSTable.remove();
    }, delay)

    // console.log("visit order:", visitOrder)
    // console.log("command order", commandOrder)
}

function markNodeAsDiscovered($node) {
    console.log($node)
    $("#dfs-" + $node.data("id") + "-" + "discovered").html("true")
    $node.addClass("discovered-node")
}

function markNodeAsVisited($node) {
    console.log($node)
    $("#dfs-" + $node.data("id") + "-" + "visited").html("true")
    $node.removeClass("discovered-node")
    $node.addClass("visited-node")
}

function createDFSTableViz(nodeList) {
    let $controlPanel = $("#graph-control-panel")
    let $DFSTable =  $( 
        `
            <table class="dfs-viz-feature control-panel-viz-feature">
                <thead>
                    <tr>
                        <th>Node</th>
                        <th>Discovered</th>
                        <th>Visited</th>
                    </tr>
                </thead>
                
            </table>
        `
    )
    let $DFSTableBody = $(
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
                    <td id=${"dfs" + "-" + node.data("id") + "-" + "discovered"}>False</td>
                    <td id=${"dfs" + "-" + node.data("id") + "-" + "visited"}>False</td>
                </tr>
            `
        )
        nodeTableInfo.appendTo($DFSTableBody)
    })
    $DFSTableBody.appendTo($DFSTable)
    $DFSTable.appendTo($controlPanel)

    return $DFSTable
}

function createBFSStackViz() {
    let $controlPanel = $("#graph-control-panel")
    let $DFSStack =  $( 
        `
            <div class="dfs-viz-feature control-panel-viz-feature ">
                <header>Stack (grows sideways)</header>
                <span>[</span>
                <span id="dfs-stack-viz">
                    
                </span>
                <span>]</span>
            </div>
        `
    )
    $DFSStack.appendTo($controlPanel)
}

function createDFSVisitOrderViz() {
    let $controlPanel = $("#graph-control-panel")
    let $dfsVisitOrder =  $( 
        `
            <div class="dfs-viz-feature control-panel-viz-feature">
                <header>Visit Order</header>
                <span>[</span>
                <span id="dfs-visit-order-viz">
                    
                </span>
                <span>]</span>
            </div>
        `
    )
    $dfsVisitOrder.appendTo($controlPanel)
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