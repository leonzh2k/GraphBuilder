import {createNode, makeNodeDraggable} from "./modules/createNode.js"
import {createGraphAreaContextMenu, createNodeContextMenu, showGraphAreaContextMenu, showNodeContextMenu, createEdgeContextMenu, showEdgeContextMenu, hideContextMenus} from "./modules/contextMenu.js"
import {createGraphAreaBackground} from './modules/createGraphAreaBackground.js'
import {createNameNodeMenu, showNameNodeMenu, hideNameNodeMenu} from './modules/nameNodeMenu.js'
import { createRenameNodeMenu, showRenameNodeMenu, hideRenameNodeMenu  } from "./modules/renameNodeMenu.js"
import { moveEdge } from "./modules/moveEdge.js";
import { createEdge } from "./modules/createEdge.js"
import { printAdjList } from "./modules/printAdjList.js"
import {BFS} from "./modules/algorithms/BFS.js"
import {DFS} from "./modules/algorithms/DFS.js"
// import { join } from "path"

jQuery(() => {
    var nodeList = [];
    var lockedNodes = [];
    var $activeNode; //lets us tell what node we should be performing actions on (e.g. renaming, deleting)
    var $activeEdge; //lets us tell what edge we should be performing actions on (e.g. renaming, deleting)
    var modifyingGraphAllowed = true; // lets us disable renaming/deleting while algorithms are running
    //initialize context menus. They are hidden until called.
    var $graphArea = $("#graph-area");
    //an invisible background, right clicks on here enable the non-node context menu.
    //because I want separate context menus when clicking on a node vs non-node
    var $graphAreaBackground = createGraphAreaBackground();
    $graphAreaBackground.appendTo($graphArea);
    var $graphAreaContextMenu = createGraphAreaContextMenu();
    var $nameNodeMenu = createNameNodeMenu();
    var $renameNodeMenu = createRenameNodeMenu();
    var $nodeContextMenu = createNodeContextMenu();
    var $edgeContextMenu = createEdgeContextMenu();
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
            // console.log("right clicked on background")
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
        // console.log("node created")
        showNameNodeMenu($nameNodeMenu, e.pageX, e.pageY);
        hideContextMenus();
    })
    //This actually handles the node creation logic.
    $("#name-node-button").on('click', (e) => {
        let nodeName = String($("#node-name").val());
        if (nodeName.length <= 0 || nodeName.length > 3) {
            alert("node name must be between 1 and 3 chars long")
            return;
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
                containment: $graphArea,
                //start and stop just applies border color to signify moving node
                start: function() {
                    $node.addClass("moving-node");
                },
                //move all neighbor edges here
                drag: function() {
                    // console.log("dragging")
                    //moves all edges connected to node.
                    $node.data("neighbors").forEach((neighbor) => {
                        moveEdge($node, neighbor.neighbor, neighbor.edge);
                    })
                },
                stop: function() {
                    $node.removeClass("moving-node");
                },
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
            // $node.on('moving', (e) => {
            //     console.log('moving');
            // })
            //double click to focus on node
            $node.click(function focusOnNode(e) {
                console.log("node dbl click");
                $node.addClass("focused-node")
                //check that you did not select the same node twice
                if (lockedNodes[0] == $node) {
                    console.log("clicked the same node")
                    lockedNodes[0].removeClass("focused-node")
                    lockedNodes = [];
                    return;
                }
                lockedNodes.push($node);
                console.log("lockedNodes", lockedNodes) 
                //two focused nodes create an edge.
                if (lockedNodes.length == 2) {
                    let $node1 = lockedNodes[0]
                    let $node2 = lockedNodes[1]
                    //check if nodes are already connected
                    for (let i = 0; i < $node1.data("neighbors").length; i++) {
                        // console.log("hello", i.neighbor);
                        if ($node1.data("neighbors")[i].neighbor == $node2) {
                            console.log("edge already exists!")
                            $node1.removeClass("focused-node")
                            $node2.removeClass("focused-node")
                            lockedNodes = [];
                            return;
                        }
                    }
                    for (let i = 0; i < $node2.data("neighbors").length; i++) {
                        console.log(i.neighbor);
                        if ($node2.data("neighbors")[i].neighbor == $node1) {
                            console.log("edge already exists!")
                            $node1.removeClass("focused-node")
                            $node2.removeClass("focused-node")
                            lockedNodes = [];
                            return;
                        }
                    }
                    //this will automatically update neighbors in adj list since these are references
                    //create an edge
                    let $edge = createEdge($node1, $node2);
                    
                    //add event listenerse
                    $edge.on("mouseenter", (e) => {
                        $edge.css("background", "orange")
                    }).on("mouseleave", (e) => {
                        $edge.css("background", "black")
                    }).on("mousedown", (e) => {
                        if (e.button == 2) {
                            $activeEdge = $edge;
                            hideContextMenus(); //hides any context menus that might still be up
                            // //hides the node name input
                            // $nameNodeMenu.hide();
                            // $renameNodeMenu.hide();
                            // //resets the value in the node name input.
                            // $("#node-name").val(null);
                            // $("#node-rename").val(null);
                            console.log("right clicked on edge")
                            showEdgeContextMenu($edgeContextMenu, e.pageX, e.pageY);
                        }
                    })

                    $node1.data("neighbors").push({
                        neighbor: $node2,
                        edge: $edge
                    })
                    $node2.data("neighbors").push({
                        neighbor: $node1,
                        edge: $edge
                    })
                    printAdjList(nodeList);
                    $edge.appendTo($graphArea);
                    $node1.removeClass("focused-node")
                    $node2.removeClass("focused-node")
                    lockedNodes = [];
                    // console.log($node1.data("neighbors"));
                }
            })
            //add node to list
            nodeList.push($node);
            printAdjList(nodeList);
        }
    })
    //shows rename node input
    $("#rename-node-label").on('click', (e) => {
        //do nothing if mod graph not allowed 
        if (!modifyingGraphAllowed) {
            return;
        }
        console.log("rename node")
        showRenameNodeMenu($renameNodeMenu, e.pageX, e.pageY);
        hideContextMenus();
    })

    //handles actual node rename logic
    $("#rename-node-button").click(function renameNode(e) {
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
            //ALSO NEED TO RENAME OTHER INSTANCES OF NODE Like in other lists?
            //probably not since it is a reference
            printAdjList(nodeList);

        }
    })
    $("#delete-node-label").click(function deleteNode(e) {
        //do nothing if mod graph not allowed 
        if (!modifyingGraphAllowed) {
            return;
        }
        //need to remove all references to node (like in other node's adj lists)
        //also need to remove all edges connected to node
        for (let i = 0; i < nodeList.length; i++) {
            for (let j = 0; j < nodeList[i].data("neighbors").length; j++) {
                // let neighbor = nodeList[i].data("neighbors")[j];
                if (nodeList[i].data("neighbors")[j].neighbor == $activeNode) {

                    // console.log("node found");
                    // console.log("length of list before: ", nodeList[i].data("neighbors").length)

                    nodeList[i].data("neighbors")[j].edge.remove(); //deletes edge associated with neighbor
                    let filteredNodeList = nodeList[i].data("neighbors").filter((j) => j.neighbor != $activeNode); //removes neighbor/edge pair from adj list
                    nodeList[i].data("neighbors", filteredNodeList)
                    // console.log("length of list after: ", nodeList[i].data("neighbors").length)

                }
            }
        }
        nodeList = nodeList.filter(node => node != $activeNode);
        $activeNode.remove();
        hideContextMenus();
        printAdjList(nodeList);
    })
    $("#delete-edge-label").click(function deleteEdge(e) {
        //do nothing if mod graph not allowed 
        if (!modifyingGraphAllowed) {
            return;
        }
        console.log("edge deleted")
        for (let i = 0; i < nodeList.length; i++) {
            for (let j = 0; j < nodeList[i].data("neighbors").length; j++) {
                // let neighbor = nodeList[i].data("neighbors")[j];
                if (nodeList[i].data("neighbors")[j].edge == $activeEdge) {
                    // console.log("edge found");
                    // console.log("length of list before: ", nodeList[i].data("neighbors").length)
                    let filteredNodeList = nodeList[i].data("neighbors").filter((j) => j.edge != $activeEdge); //removes neighbor/edge pair from adj list
                    nodeList[i].data("neighbors", filteredNodeList);
                    // console.log("length of list after: ", nodeList[i].data("neighbors").length)
                } 
            }
        }
        $activeEdge.remove();
        hideContextMenus();
        printAdjList(nodeList);
    })

    $("#run-bfs-button").click(() => {
        if (nodeList.length == 0) {
            console.log("node list is empty")
            return;
        }
        modifyingGraphAllowed = false;
        console.log("modifying graph disabled")
        BFS(nodeList, nodeList[0])
        //need settimeout b/c of asynchronous code in BFS()
        setTimeout(() => {
            console.log("modifying graph allowed")
            modifyingGraphAllowed = true;
        }, (nodeList.length + 2) * 2000)

    })

    $("#run-dfs-button").click(() => {
        if (nodeList.length == 0) {
            console.log("node list is empty")
            return;
        }
        modifyingGraphAllowed = false;
        console.log("modifying graph disabled")
        DFS(nodeList, nodeList[0])
        //need settimeout b/c of asynchronous code in DFS()
        setTimeout(() => {
            console.log("modifying graph allowed")
            modifyingGraphAllowed = true;
        }, (nodeList.length + 2) * 2000)

    })
    //
    //enables draggability for all nodes when you mouse up. This is for when 
    //draggability was removed from node when you right clicked, but you need to add
    //draggability again after you stop right clicking.
    // $("html").on('mouseup', () => {
    //     nodeList.forEach((node) => {
    //         makeNodeDraggable(node);
    //         // console.log('nodes draggable again')
    //     })
    // })

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

