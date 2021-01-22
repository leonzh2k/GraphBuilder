export function createNode(mouseX, mouseY) {
    var $node = $("<div>A</div>");
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