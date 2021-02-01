export function printAdjList(nodeList) {
    console.log("ADJACENCY LIST");
    console.log("=======================");
    nodeList.forEach(node => {
        console.log("node id: ", node.data("id"));
        console.log("------------------")
        node.data("neighbors").forEach(neighbor => {
            console.log(neighbor.neighbor.data("id"))
        })
        console.log("------------------")
    })
    console.log("=======================");
}