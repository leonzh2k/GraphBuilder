import {createNode, makeNodeDraggable} from "./modules/createNode.js"
import {createGraphAreaContextMenu, createNodeContextMenu, showGraphAreaContextMenu, showNodeContextMenu, hideContextMenus} from "./modules/contextMenu.js"
import {createGraphAreaBackground} from './modules/createGraphAreaBackground.js'
import {createNameNodeMenu, showNameNodeMenu, hideNameNodeMenu} from './modules/nameNodeMenu.js'
import { createRenameNodeMenu, showRenameNodeMenu, hideRenameNodeMenu  } from "./modules/renameNodeMenu.js"

jQuery(() => {
    var nodeList = [];
    var lockedNodes = [];
    var $activeNode; //lets us tell what node we should be performing actions on (e.g. renaming, deleting)
    //initialize context menus. They are hidden until called.
    var $graphArea = $("#graph-area");
    //an invisible background, right clicks on here enable the non-node context menu.
    //because I want separate context menus when clicking on a node vs non-node
    var $graphAreaBackground = createGraphAreaBackground();
    var $graphAreaContextMenu = createGraphAreaContextMenu();
    var $nameNodeMenu = createNameNodeMenu();
    var $renameNodeMenu = createRenameNodeMenu();
    $graphAreaBackground.appendTo($graphArea);
    var $nodeContextMenu = createNodeContextMenu();

    //need to not show this if click on 
    $graphAreaBackground.on('mousedown', (e) => {
        if (e.button == 2) {
            hideContextMenus(); //hides any context menus that might still be up
            //hides the node name input
            $nameNodeMenu.hide();
            $renameNodeMenu.hide();
            //resets the value in the node name input.
            $("#node-name").val(null);
            $("#node-rename").val(null);
            console.log("right clicked on background")
            showGraphAreaContextMenu($graphAreaContextMenu, e.pageX, e.pageY);
        }
        else {
            hideContextMenus(); //hides all context menus
            $nameNodeMenu.hide();
            $renameNodeMenu.hide();
            //resets the value in the node name input.
            $("#node-name").val(null);
            $("#node-rename").val(null);
        }
    })
    //when click on context menu show create node option.
    $("#create-node-label").on('mousedown', (e) => {
        console.log("node created")
        showNameNodeMenu($nameNodeMenu, e.pageX, e.pageY);
        hideContextMenus();
    })
    //This actually handles the node creation logic.
    $("#name-node-button").on('click', (e) => {
        let nodeName = String($("#node-name").val());
        if (nodeName.length <= 0 || nodeName.length > 3) {
            alert("node name must be between 1 and 3 chars long")
        }
        else {
            //check if all other nodes have different names
            for (let i = 0; i < nodeList.length; i++) {
                if (nodeList[i].html() == nodeName) {
                    alert('cannot have two nodes with the same name.')
                    return;
                }
            }
            $("#node-name").val(null);
            hideNameNodeMenu($nameNodeMenu);
            let $node = createNode(nodeName, e.pageX, e.pageY);
            $node.appendTo($graphArea);
            //if this is called before it is appended the positioning is off
            $node.draggable({
                cursor: "grab",
                // obstacle: ".node",
                // preventCollision: true,
                containment: $graphArea
            });

            //add context menu when right click on node
            $node.on('mousedown', (e) => {
                $activeNode = $node;
                hideContextMenus();
                $nameNodeMenu.hide();
                $renameNodeMenu.hide();
                //resets the value in the node name input.
                $("#node-name").val(null);
                $("#node-rename").val(null);
                if (e.button == 2) {
                    console.log("right clicked on node")
                    showNodeContextMenu($nodeContextMenu, e.pageX, e.pageY);
                }
            })
            $node.on('dblclick', (e) => {
                console.log("node dbl click");
                $node.css("border", "3px red solid");
                lockedNodes.push($node);
            })
            //add node to list
            nodeList.push($node);
        }
    })
    //shows rename node input
    $("#rename-node-label").on('click', (e) => {
        console.log("rename node")
        showRenameNodeMenu($renameNodeMenu, e.pageX, e.pageY);
        hideContextMenus();
    })

    //handles actual node rename logic
    $("#rename-node-button").on('click', (e) => {
        let newName = String($("#node-rename").val());
        //check length
        if (newName.length <= 0 || newName.length > 3) {
            alert("node name must be between 1 and 3 chars long")
        }
        else {
            //check if all other nodes have different names
            for (let i = 0; i < nodeList.length; i++) {
                //it's ok for the new name to be same as the name of the node you are trying to change
                if (nodeList[i] == $activeNode) {
                    continue;
                }
                if (nodeList[i].html() == newName) {
                    alert('cannot have two nodes with the same name.')
                    return;
                }
            }
            //now rename node
            $("#node-rename").val(null);
            hideRenameNodeMenu($renameNodeMenu);
            $activeNode.html(newName);
            $activeNode.data("id", newName);

        }
    })
    $("#delete-node-label").on('click', (e) => {
        nodeList = nodeList.filter(node => node != $activeNode);
        $activeNode.remove();
        hideContextMenus();
        console.log(nodeList);
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