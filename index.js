import {createNode, makeNodeDraggable} from "./modules/createNode.js"
import {createGraphAreaContextMenu, createNodeContextMenu, showGraphAreaContextMenu, showNodeContextMenu, hideContextMenus} from "./modules/contextMenu.js"
import {createGraphAreaBackground} from './modules/createGraphAreaBackground.js'

jQuery(() => {
    var nodeList = [];
    //initialize context menus. They are hidden until called.
    var $graphArea = $("#graph-area");
    //an invisible background, right clicks on here enable the non-node context menu.
    //because I want separate context menus when clicking on a node vs non-node
    var $graphAreaBackground = createGraphAreaBackground();
    var $graphAreaContextMenu = createGraphAreaContextMenu();
    $graphAreaBackground.appendTo($graphArea);
    var $nodeContextMenu = createNodeContextMenu();

    //need to not show this if click on 
    $graphAreaBackground.on('mousedown', (e) => {
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
        let $node = createNode(e.pageX, e.pageY);
        $node.appendTo($graphArea);
        //if this is called before it is appended the positioning is off
        
        $node.draggable({
            cursor: "grab",
            // obstacle: ".node",
            // preventCollision: true,
            containment: $graphArea
        });

        //add context menu when right click on node
        $node.on('mouseup', (e) => {
            hideContextMenus();
            if (e.button == 2) {
                console.log("right clicked on node")
                showNodeContextMenu($nodeContextMenu, e.pageX, e.pageY);
            }
        })
        //add node to list
        nodeList.push($node);
        
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