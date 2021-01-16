export function createNode(nodeNumber) {
    var circle = new fabric.Circle({
        radius: 30,
        fill: 'yellow',
        stroke: 'blue',
        strokeWidth: 4,
        originX: 'center',
        originY: 'center',
        
    });

    var text = new fabric.Text(String(nodeNumber), {
        fontSize: 30,
        originX: 'center',
        originY: 'center'
    });

    var node = new fabric.Group([ circle, text ], {
        left: 150,
        top: 100,
        moveCursor: "grabbing",
        hoverCursor: "pointer"
    });
    //disables rotating and resizing node
    // node.setControlsVisibility({
    //     mt: false, 
    //     mb: false, 
    //     ml: false, 
    //     mr: false, 
    //     bl: false,
    //     br: false, 
    //     tl: false, 
    //     tr: false,
    //     mtr: false, 
    // });


    node.hasBorders = false;

    node.on('mousedown', () => {
        //console.log('node clicked');
        node.item(0).set({
            stroke: 'green'
        });
    }).on('mouseup', () => {
        node.item(0).set({
            stroke: 'blue'
        });
    }).on('moving', () => {
        //console.log("node", node.aCoords.tr);
    });
    
    // .on('mousedown', (event) => {
    //     if(event.button === 1) {
    //         console.log("left click");
    //     }
    //     if(event.button === 2) {
    //         console.log("middle click");
    //     }
    //     if(event.button === 3) {
    //         //console.log("right click");
    //     }
    // });


    return node;
}
    