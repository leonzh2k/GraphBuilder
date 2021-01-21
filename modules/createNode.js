// import {graphAreaContextMenu} from './contextMenu.js'

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
    // console.log("x: ", a.ox)
    // console.log("y: ", a.oy)
}

function onDragComplete(){
    var a = this.set
    console.log("complete")
    // console.log("x: ", a.ox)
    // console.log("y: ", a.oy)
}

export function createNode(graphArea, mouseX, mouseY) {
    var circle = graphArea.circle(mouseX, mouseY, 25).attr({fill: "yellow"});
    var txt =  graphArea.text(mouseX, mouseY, "A");
    txt.attr({
        "width" : 150,
        "fill": "#000",
        "font-size": "18pt",
        "font-weight": "bold"
    });

    var node = graphArea.set(circle, txt);
    circle.set = node, txt.set = node;

    //add draggable functionality to node
    node.drag(onDragMove, onDragStart, onDragComplete);
    
    return node
    
}