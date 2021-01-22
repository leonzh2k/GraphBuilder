import {createNode, makeNodeDraggable} from "./modules/createNode.js"
import {createGraphAreaContextMenu, createNodeContextMenu, showGraphAreaContextMenu, showNodeContextMenu, hideContextMenus} from "./modules/contextMenu.js"
// import {createGraphAreaBackground} from './modules/createGraphAreaBackground.js'

jQuery(() => {
    var nodeList = [];
    //initialize context menus. They are hidden until called.
    var $graphAreaContextMenu = createGraphAreaContextMenu();
    var $nodeContextMenu = createNodeContextMenu();
    var $graphArea = $("#graph-area");
    //shows context menu
    $graphArea.on('mousedown', (e) => {
        if (e.button == 2) {
            hideContextMenus(); //hides any context menus that might still be up
            console.log("right clicked on background")
            showGraphAreaContextMenu($graphAreaContextMenu, e.pageX, e.pageY);
        }
        else {
            hideContextMenus(); //hides all context menus
        }
    })
    //when click on context menu create node option, create node at cursor
    $("#create-node-label").on('mousedown', (e) => {
        console.log("node created")
        hideContextMenus();
        let node = createNode(e.pageX, e.pageY);
        node.appendTo($graphArea);
        //add context menu when right click on node
        node.mouseup((e) => {
            hideContextMenus();
            if (e.button == 2) {
                console.log("right clicked on node")
                showNodeContextMenu($nodeContextMenu, e.pageX, e.pageY);
            }
        })
        //add node to list
        nodeList.push(node);
        
    })
    //
    //enables draggability for all nodes when you mouse up. This is for when 
    //draggability was removed from node when you right clicked, but you need to add
    //draggability again after you stop right clicking.
    $("html").on('mouseup', () => {
        nodeList.forEach((node) => {
            makeNodeDraggable(node);
            // console.log('nodes draggable again')
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