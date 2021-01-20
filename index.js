var workspace;
var groups = [];     //just an array of the sets we create.
// // //The routine to repaint the drawing area

workspace = Raphael('workspace', "100%", "80%");

//Add a rectangle
// var rect = workspace.circle(0,0, 150, 100, 3);
// rect.attr({
//     "stroke": "#00f",
//     "stroke-width": 2,
//     "fill" : "#fff"
// });

// var txt =  workspace.text(75, 50, "My_Example");
// txt.attr({
//     "width" : 150,
//     "fill": "#000",
//     "font-size": "12pt",
//     "font-weight": "bold"
// });

// // Create a set so we can move the
// // text and rectangle at the same time
// var g = workspace.set(rect, txt);
// rect.set = g, txt.set = g;
    
    
// var me = this,
// lx = 0,
// ly = 0,
// ox = 0,
// oy = 0,
// moveFnc = function(dx, dy) {
//     var a = this.set;
    
//     a.translate(dx-ox, dy-oy);
//     ox = dx;
//     oy = dy;  
// },
// startFnc = function() {},
// endFnc = function() {
//     ox = lx;
//     oy = ly;
// };

// rect.drag(moveFnc, startFnc, endFnc);


var circle = workspace.circle(0,0, 150, 100, 3).attr({fill: "orange"});
var txt =  workspace.text(75, 50, "My_Example");
txt.attr({
    "width" : 150,
    "fill": "#000",
    "font-size": "12pt",
    "font-weight": "bold"
});

var g = workspace.set(circle, txt);
circle.set = g, txt.set = g;

g.drag(onDragMove, onDragStart, onDragComplete);

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
    // if((this.attr('x') > 20 && (this.attr('x') < 70)) && (this.attr('y') < 50)) {
    //     this.attr('fill', 'white');
    //     // rect.attr('fill', 'black');
    // } else {
    //     this.attr('fill', 'black');
    //     // rect.attr('fill', 'red');
    // }
};