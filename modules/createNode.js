export function createNode(mouseX, mouseY) {
    var $node = $("<span style='backgroundColor: yellow; border:2px blue solid; border-radius:10px;'>NOde</span>");
    //disables drag if you try to drag node with right click. drag is reenabled when you mouse up.
    $node.on('mousedown',(e) => {
        if (e.button == 2) {
            console.log('should disable drag')
            // $node.undrag()
        }
    });
    return $node
    
}

export function makeNodeDraggable($node) {
    $node.draggable();
}