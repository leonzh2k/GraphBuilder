import { createCanvas } from './modules/createCanvas.js'
import { createNode } from './modules/createNode.js'
jQuery(() => {
    var nodeNumber = 0;
    //stores nodes, will probably change it to adjacency list later
    var nodes = [];
    //add canvas
    var canvas = createCanvas();

    //logic to delete a node
    // canvas.on('mouse:down', function(options) {
    //     console.log(options.e.clientX, options.e.clientY);
    //     if (options.target && options.e.button === 2) {
    //         console.log('an object was right clicked! ', options.target.type);
    //         nodes.forEach((node) => {

    //         })
    //         //check all node coords to see which should be deleted
    //     }
        // if(options.e.button === 2) {
        //     console.log("right click on canvas");
        // }
        // if(options.e.button === 0) {
        //     console.log("left click on canvas");
        // }
    // });
    //add node
    $('#node-adder').on('click', () => {
        nodeNumber++;
        let newNode = createNode(nodeNumber);
        /*
            must add deleting logic here instead of in createNode() since 
            the nodes array is scoped to index.js, and is not known in createNode()
        */
        newNode.on('mousedown', (event) => {
            if(event.button === 3) {
                console.log("Node should be deleted.");
                // canvas.remove(newNode)
                // //use tree to store nodes?
                // //returns new list without the removed node
                // nodes = nodes.filter(node => node != newNode) //O(n)
                // console.log('node list size is now ', nodes.length);
            }
        });
        canvas.add(newNode);
        nodes.push(newNode);
        console.log('node list size is now ', nodes.length);
        
        

        
    })
})
// let canvas = new fabric.Canvas('c', {
//     width: 1250,
//     height: 750,
//     backgroundColor: 'hsl(208, 10%, 36%)',
//     stopContextMenu: true, //disables context menu on right click (the inspect element menu)
//     fireRightClick: true,  // <-- enable firing of right click events
//     fireMiddleClick: true // <-- enable firing of middle click events
// });





