export function createEdgeWeight($node1, $node2, $graphArea, edgeWeight) {
    let x1 = parseInt($node1.css("left")) + 25;
    let y1 = parseInt($node1.css("top")) + 25;
    let x2 = parseInt($node2.css("left")) + 25;
    let y2 = parseInt($node2.css("top")) + 25;

    let $edgeWeight = $(`<span style="fontSize: 12;">${edgeWeight ? String(edgeWeight) : "1"}</span>`)
    let midpointX = (x1 + x2) / 2
    let midpointY = (y1 + y2) / 2
    // console.log("midpoint coords: ", midpointX, midpointY)

    $edgeWeight
        .css("color", "white")
        .css("fontSize", "34px")
        .css("position", "absolute")
        .css("zIndex", "2")
        .css("left", midpointX.toString() + 'px')
        .css("top", midpointY.toString() + 'px')
        // .css("paddingLeft", midpointX)
    $edgeWeight.appendTo($graphArea)
    return $edgeWeight
}