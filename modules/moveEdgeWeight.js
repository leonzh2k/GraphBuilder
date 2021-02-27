export function moveEdgeWeight($draggedNode, $neighborNode, $weightDOMElement) {
    let x1 = parseInt($draggedNode.css("left")) + 25;
    let y1 = parseInt($draggedNode.css("top")) + 25;
    let x2 = parseInt($neighborNode.css("left")) + 25;
    let y2 = parseInt($neighborNode.css("top")) + 25;

    let midpointX = (x1 + x2) / 2
    let midpointY = (y1 + y2) / 2

    $weightDOMElement
        .css("left", midpointX.toString() + 'px')
        .css("top", midpointY.toString() + 'px')
    
}