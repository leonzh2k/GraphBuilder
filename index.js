import {createNode} from "./modules/createNode.js"
import {createGraphAreaContextMenu, createNodeContextMenu, showGraphAreaContextMenu, showNodeContextMenu, hideContextMenus} from "./modules/contextMenu.js"
import {createGraphAreaBackground} from './modules/createGraphAreaBackground.js'

jQuery(() => {
    // var contextMenuActive = false;                           
    //create graphArea to draw nodes in
    var graphArea = Raphael('graph-area', "100%", "100%");
    //initialize context menus. They are hidden until called.
    var graphAreaContextMenu = createGraphAreaContextMenu();
    var nodeContextMenu = createNodeContextMenu();
    //creates a background (because context menu on background is different than node's context menu)
    let graphAreaBackground = createGraphAreaBackground(graphArea);
    graphAreaBackground.mouseup((e) => {
        if (e.button == 2) {
            hideContextMenus(); //hides any context menus that might still be up
            console.log("right clicked on background")
            showGraphAreaContextMenu(graphAreaContextMenu, e.pageX, e.pageY);
        }
        else {
            hideContextMenus(); //hides all context menus
        }
    })
    //when click on context menu create node option, create node at cursor
    $("#create-node-label").on('click', (e) => {
        console.log("node created")
        hideContextMenus();
        let node = createNode(graphArea, e.pageX, e.pageY);
        //add context menu when right click on node
        node.mouseup((e) => {
            hideContextMenus();
            if (e.button == 2) {
                console.log("right clicked on node")
                showNodeContextMenu(nodeContextMenu, e.pageX, e.pageY);
            }
            
        })
    })

    // $("#delete-node-label").on('click', (e) => {
    //     console.log("node deleted")
    //     hideContextMenus();
    //     let node = createNode(graphArea, e.pageX, e.pageY);
    //     //add context menu when right click on node
    //     node.mouseup((e) => {
    //         hideContextMenus();
    //         if (e.button == 2) {
    //             console.log("right clicked on node")
    //             showNodeContextMenu(nodeContextMenu, e.pageX, e.pageY);
    //         }
            
    //     })
    // })
})