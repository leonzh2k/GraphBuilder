function onDragStart() {
    console.log("start")
    var a = this.set;
    a.ox = a.attr('x');
    a.oy = a.attr('y');    
}

function onDragMove(dx,dy){
    var a = this.set //this means we perform actions on the entire set 
    console.log("moving")
    a.translate(dx-a.ox, dy-a.oy);
    a.ox = dx;
    a.oy = dy;  
    console.log("x: ", a.ox)
    console.log("y: ", a.oy)
}

function onDragComplete(){
    var a = this.set
    console.log("complete")
    console.log("x: ", a.ox)
    console.log("y: ", a.oy)
}

export function createNode(graphArea) {
    var circle = graphArea.circle(0,0, 150, 100, 3).attr({fill: "orange"});
    var txt =  graphArea.text(75, 50, "My_Example");
    txt.attr({
        "width" : 150,
        "fill": "#000",
        "font-size": "12pt",
        "font-weight": "bold"
    });

    var node = graphArea.set(circle, txt);
    circle.set = node, txt.set = node;

    node.drag(onDragMove, onDragStart, onDragComplete);
    return node
    
}