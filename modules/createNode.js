export function createNode(nodeName, mouseX, mouseY) {
    var $node = $("<div></div>");
    $node.html(nodeName);
    $node.data("id", nodeName); //give the node an id for graph algos
    $node.data("neighbors", []); //since I am dealing with undirected graphs for now, don't need to worry about indegree, outdegre,, etc.
    console.log("this node's id: ", $node.data("id"));
    $node.addClass('node');
    //disables drag if you try to drag node with right click. drag is reenabled when you mouse up.
    // $node.on('mousedown',(e) => {
    //     if (e.button == 2) {
    //         console.log('should disable drag')
    //         // $node.undrag()
    //     }                                                     
    // });
    $node.css('left', mouseX - 25); //offst by 25 to have mouse be centered on node when it shows up
    $node.css('top',  mouseY - 25);
    // $node.css('cursor', 'pointer');
    //making the node draggable here messes up the positioning when it renders to the screen
    // $node.draggable();
    return $node
    
}

export function makeNodeDraggable($node) {
    $node.draggable();
}