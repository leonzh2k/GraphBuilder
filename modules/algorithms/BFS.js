export function BFS(nodeList, $root) {
    let visitOrder = [];
    console.log("root: ", $root.data("id"))
    console.log("BFS start")
    let queue = [];
    nodeList.forEach(node => {
        console.log("id: ", node.data("id"))
        node.css("border-color", "black")
        node.data("discovered", false);
    })
    $root.data("discovered", true);
    $root.css("border-color", "green")
    queue.push($root)
    visitOrder.push($root.data("id"))
    let delay = 0;
    let iterations = 0;
    for (let i = 0; i < nodeList.length; i++) {
        console.log("uho hns")
        if (delay != nodeList.length * 1000) {
            setTimeout(() => {
                let $currNode = queue.shift();
                $currNode.css("border-color", "blue")
                console.log("current node: ", $currNode.data("id"))
                $currNode.data("neighbors").forEach((node) => {
                    if (node.neighbor.data("discovered") == false) {
                        node.neighbor.data("discovered", true);
                        node.neighbor.css("border-color", "green")
                        // node.edge.css("background", "orange")
                        queue.push(node.neighbor)
                        visitOrder.push(node.neighbor.data("id"))
                    }
                        
                })
                // $currNode.css("border-color", "green")
            }, delay)
            delay += 1000;
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
            node.css("border-color", "black");
            node.removeData("discovered");

        })
        console.log("BFS end.")
        let visitOrderStr = "";
        visitOrder.forEach((node) => {
            visitOrderStr = visitOrderStr + node + " "
        })
        console.log("Visit Order: ", visitOrderStr)
    }, ((nodeList.length + 1) * 1000))

   

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