export function createEdge($node1, $node2) {
    let $edge = $("<div></div>");
    $edge.addClass("edge");

    //edge geometry
    let x1 = parseInt($node1.css("left")) + 25;
    let y1 = parseInt($node1.css("top")) + 25;
    let x2 = parseInt($node2.css("left")) + 25;
    let y2 = parseInt($node2.css("top")) + 25;
    var length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
    //console.log("length is %d", length);
    var angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    //console.log("angle is %d", angle);
    var transform = 'rotate('+ angle +'deg)';

    $edge
        .css("transform", transform)
        .css("width", length.toString() + 'px')
        .css("left", x1.toString() + 'px')
        .css("top", y1.toString() + 'px');
    
    return $edge

}