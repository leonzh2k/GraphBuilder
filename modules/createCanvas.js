
export function createCanvas() {
    // let c = document.getElementById("c");
    // let dpi = window.devicePixelRatio;
    // c.setAttribute("height", c.clientHeight * dpi);
    // c.setAttribute("width", c.clientWidth * dpi);
    // window.devicePixelRatio = 6.25
    console.log(window.devicePixelRatio)
    let canvas = new fabric.Canvas('c', {
        // width: c.clientHeight * dpi,
        // height: c.clientWidth * dpi,
        backgroundColor: 'hsl(208, 10%, 36%)',
        stopContextMenu: true, //disables context menu on right click (the inspect element menu)
        fireRightClick: true,  // <-- enable firing of right click events
        fireMiddleClick: true, // <-- enable firing of middle click events
        //enableRetinaScaling: true
    });
    canvas.selection = false;
    //alert('canvas created');

    //creating context menu
    canvas.on('mouse:down', function(options) {
        console.log(options.e.clientX, options.e.clientY);
        if (options.e.button === 2) {
            //console.log('an object was right clicked! ', options.target.type);
            var rect = new fabric.Rect({
                // left: options.e.clientX,
                // top: options.e.clientY,
                fill: 'black',
                width: 100,
                height: 50,
                originX: 'center',
                originY: 'center'
            });
            var text = new fabric.Text("remove node", {
                fill: 'white',
                fontSize: 12,
                originX: 'center',
                originY: 'center',
                hoverCursor: "pointer"
            });
            text.on('click', () => {
                console.log('die')
            })
            var contextMenu = new fabric.Group([ rect, text ], {
                left: options.e.clientX,
                top: options.e.clientY,
                lockMovementX: true,
                lockMovementY: true,
                hoverCursor: "pointer"
            });
            contextMenu.setControlsVisibility({
                mt: false, 
                mb: false, 
                ml: false, 
                mr: false, 
                bl: false,
                br: false, 
                tl: false, 
                tr: false,
                mtr: false, 
            });
        
        
            contextMenu.hasBorders = false;
            canvas.add(contextMenu);
            canvas.renderAll()
        }
    });
    // Get the device pixel ratio, falling back to 1.
    // var dpr = window.devicePixelRatio || 1;
    

    // // Get the size of the canvas in CSS pixels.
    // var rect = canvas.width * canvas.height;
    // console.log(rect)
    // // Give the canvas pixel dimensions of their CSS
    // // size * the device pixel ratio.
    // canvas.width = canvas.width * dpr;
    // canvas.height = canvas.height * dpr;
    // console.log(canvas.width)
    // console.log(canvas.height)
    // // Scale all drawing operations by the dpr, so you
    // // don't have to worry about the difference.
    //canvas.getBoundingClientRect().height;

    //canvas.scale(dpr, dpr);
    // canvas.setWidth(1250);
    // canvas.setHeight(750);
    // canvas.calcOffset();
    return canvas;
}

// export default createCanvas;
