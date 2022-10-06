"strict mode";
import {createNode, makeNodeDraggable} from "./modules/createNode.js"
import {createGraphAreaContextMenu, createNodeContextMenu, showGraphAreaContextMenu, showNodeContextMenu, createEdgeContextMenu, showEdgeContextMenu, hideContextMenus} from "./modules/contextMenu.js"
import {createGraphAreaBackground} from './modules/createGraphAreaBackground.js'
import {createNameNodeMenu, showNameNodeMenu, hideNameNodeMenu} from './modules/nameNodeMenu.js'
import { createRenameNodeMenu, showRenameNodeMenu, hideRenameNodeMenu  } from "./modules/renameNodeMenu.js"
import { createChangeEdgeWeightMenu, showChangeEdgeWeightMenu, hideChangeEdgeWeightMenu} from "./modules/changeEdgeWeightMenu.js"
import { moveEdge } from "./modules/moveEdge.js";
import { moveEdgeWeight } from "./modules/moveEdgeWeight.js";
import { createEdgeWeight } from "./modules/createEdgeWeight.js";
import { createEdge } from "./modules/createEdge.js"
import { printAdjList } from "./modules/printAdjList.js"
import {BFS} from "./modules/algorithms/BFS.js"
import {DFS} from "./modules/algorithms/DFS.js"
import * as Dijkstra from "./modules/algorithms/Dijkstra.js"
import * as Prim from "./modules/algorithms/Prim.js"
import {flashCurrentSrcNodeDisplay} from "./modules/animations/flashCurrentSrcNodeDisplay.js"
import { sampleGraphData } from "./modules/sampleGraphData.js";
// import { join } from "path"

jQuery(() => {
    var nodeList = [];
    // var edgeList = []; //for easy checking of edges
    var lockedNodes = [];
    var $activeNode; //lets us tell what node we should be performing actions on (e.g. renaming, deleting)
    var $activeEdge; //lets us tell what edge we should be performing actions on (e.g. renaming, deleting)
    var modifyingGraphAllowed = true; // lets us disable renaming/deleting while algorithms are running
    var $sourceNode = null; // the source node used in every algorithm
    var runningAlgosAllowed = true;
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
    var $changeEdgeWeightMenu = createChangeEdgeWeightMenu();
    //need to not show this if click on 
    $graphAreaBackground.on('mousedown', (e) => {
        console.log(e.pageX, e.pageY);
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
            // console.log("hide all context mneus")
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
        if (!modifyingGraphAllowed) {
            console.log("modifying graph not allowed")
            return;
        }
        // console.log("node created")
        hideContextMenus();
        showNameNodeMenu($nameNodeMenu, e.pageX, e.pageY);
        
    })
    //This actually handles the node creation logic.
    $("#name-node-button").on('click', (e) => {
        if (!modifyingGraphAllowed) {
            console.log("modifying graph not allowed")
            return;
        }
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
            // // add node to list of available source nodes to choose from
            // const newChooseableSourceNode = $(
            //     `
            //         <option value=${$node.data("id")}></option>
            //     `
            // )
            // newChooseableSourceNode.appendTo("#chooseable-source-nodes")
            

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
                        moveEdgeWeight($node, neighbor.neighbor, neighbor.weightDOMElement);
                    })
                },
                stop: function() {
                    $node.data("neighbors").forEach((neighbor) => {
                        moveEdge($node, neighbor.neighbor, neighbor.edge);
                        moveEdgeWeight($node, neighbor.neighbor, neighbor.weightDOMElement);
                    })
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
                    // console.log("right clicked on node")
                    showNodeContextMenu($nodeContextMenu, e.pageX, e.pageY);
                }
            })
            // $node.on('moving', (e) => {
            //     console.log('moving');
            // })
            //double click to focus on node
            $node.click(function focusOnNode(e) {
                if (!modifyingGraphAllowed) {
                    console.log("modifying graph not allowed")
                    return
                }
                $node.addClass("focused-node")
                //check that you did not select the same node twice
                if (lockedNodes[0] == $node) {
                    console.log("clicked the same node")
                    lockedNodes[0].removeClass("focused-node")
                    lockedNodes = [];
                    return;
                }
                lockedNodes.push($node);
                // console.log("lockedNodes", lockedNodes) 
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
                        // console.log(i.neighbor);
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
                    //create weight
                    let $edgeWeight = createEdgeWeight($node1, $node2, $graphArea)
                    // let weight know about its edge
                    $edgeWeight.data("edge", $edge)
                    // let edge know about its weight
                    $edge.data("weight", $edgeWeight);
                    $edgeWeight.addClass("edge-weight")
                    //
                    $edgeWeight.click(function changeEdgeWeight(e) {
                        // sets active edge to edge of the weight
                        $activeEdge = $edgeWeight.data("edge")
                        if (!modifyingGraphAllowed) {
                            console.log("modifying graph not allowed")
                            return;
                        }
                        console.log("change edge weight")
                        hideContextMenus();
                        // console.log($active)
                        let activeEdgeWeightValue = Number($edgeWeight.html());
                        showChangeEdgeWeightMenu($changeEdgeWeightMenu, e.pageX, e.pageY, activeEdgeWeightValue);
                    })
                    //add event listenerse
                    $edge.on("mouseenter", (e) => {
                        if (!modifyingGraphAllowed) {
                            return;
                        }
                        $edge.addClass("hovered-edge")
                    }).on("mouseleave", (e) => {
                        if (!modifyingGraphAllowed) {
                            return;
                        }
                        $edge.removeClass("hovered-edge")
                    }).on("mousedown", (e) => {
                        if (e.button == 2) {
                            $activeEdge = $edge;
                            hideContextMenus(); //hides any context menus that might still be up
                            // //hides the node name input
                            $nameNodeMenu.hide();
                            $renameNodeMenu.hide();
                            //resets the value in the node name input.
                            $("#node-name").val(null);
                            $("#node-rename").val(null);
                            console.log("right clicked on edge")
                            showEdgeContextMenu($edgeContextMenu, e.pageX, e.pageY);
                        }
                    })
                    
                    $node1.data("neighbors").push({
                        neighbor: $node2,
                        edge: $edge,
                        // the weight as displayed on the screen
                        weightDOMElement: $edgeWeight,
                        weight: 1
                    })
                    $node2.data("neighbors").push({
                        neighbor: $node1,
                        edge: $edge,
                        // the weight as displayed on the screen
                        weightDOMElement: $edgeWeight,
                        weight: 1
                    })
                    // edgeList.push({
                        
                    // })
                    // printAdjList(nodeList);
                    $edge.appendTo($graphArea);
                    $node1.removeClass("focused-node")
                    $node2.removeClass("focused-node")
                    lockedNodes = [];
                    // console.log($node1.data("neighbors"));
                }
            })
            //if lenght of node list is 0 before adding, automatically set to source node
            if (nodeList.length == 0) {
                $sourceNode = $node;
                console.log(`source node's id: ${$node.data("id")}`);
                $("#current-source-node").html($node.data("id"));
                flashCurrentSrcNodeDisplay("green");
            }
            //add node to list
            nodeList.push($node);
            // printAdjList(nodeList);
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
            // printAdjList(nodeList);

        }
    })
    $("#delete-node-label").click(function deleteNode(e) {
        //do nothing if mod graph not allowed 
        if (!modifyingGraphAllowed) {
            return;
        }
        if ($sourceNode === $activeNode) {
            console.log("node to be deleted is source node")
            $sourceNode = null;
            $("#current-source-node").html("None")

            flashCurrentSrcNodeDisplay("yellow");
        }
        //need to remove all references to node (like in other node's adj lists)
        //also need to remove all edges connected to node
        for (let i = 0; i < nodeList.length; i++) {
            for (let j = 0; j < nodeList[i].data("neighbors").length; j++) {
                // let neighbor = nodeList[i].data("neighbors")[j];
                if (nodeList[i].data("neighbors")[j].neighbor == $activeNode) {

                    // console.log("node found");
                    // console.log("length of list before: ", nodeList[i].data("neighbors").length)
                    nodeList[i].data("neighbors")[j].weightDOMElement.remove(); //deletes visual weight
                    nodeList[i].data("neighbors")[j].edge.remove(); //deletes edge associated with neighbor
                    let filteredNodeList = nodeList[i].data("neighbors").filter((j) => j.neighbor != $activeNode); //removes neighbor/edge pair from adj list
                    nodeList[i].data("neighbors", filteredNodeList)
                    // console.log("length of list after: ", nodeList[i].data("neighbors").length)

                }
            }
        }
        //checks if node is focused, if so, need to remove it from lockedNodes
        if (lockedNodes.includes($activeNode)) {
            lockedNodes = lockedNodes.filter(node => node != $activeNode)
        }
        nodeList = nodeList.filter(node => node != $activeNode);
        $activeNode.remove();
        hideContextMenus();
        // printAdjList(nodeList);
    })

    $("#make-source-node-label").click(function changeSourceNode(e) {
        //do nothing if mod graph not allowed 
        if (!modifyingGraphAllowed) {
            return;
        }
        console.log("change sourc eode");
        $sourceNode = $activeNode;
        console.log(`source node's id: ${$activeNode.data("id")}`);
        $("#current-source-node").html($activeNode.data("id"));
        flashCurrentSrcNodeDisplay("green");
    })

    $("#delete-edge-label").click(function deleteEdge(e) {
        //do nothing if mod graph not allowed 
        if (!modifyingGraphAllowed) {
            return;
        }
        console.log("edge deleted")
        //find the nodes linked by the edge and remove the edge from both nodes
        for (let i = 0; i < nodeList.length; i++) {
            for (let j = 0; j < nodeList[i].data("neighbors").length; j++) {
                // let neighbor = nodeList[i].data("neighbors")[j];
                if (nodeList[i].data("neighbors")[j].edge == $activeEdge) {
                    //removes the "weight" element from the dom
                    nodeList[i].data("neighbors")[j].weightDOMElement.remove();
                    let filteredNodeList = nodeList[i].data("neighbors").filter((j) => j.edge != $activeEdge); //removes neighbor/edge pair from adj list
                    nodeList[i].data("neighbors", filteredNodeList);
                    // console.log("length of list after: ", nodeList[i].data("neighbors").length)
                } 
            }
        }
        $activeEdge.remove();
        hideContextMenus();
        // printAdjList(nodeList);
    })

    $("#change-edge-weight-label").click(function changeEdgeWeight(e) {

        if (!modifyingGraphAllowed) {
            console.log("modifying graph not allowed")
            return;
        }
        console.log("change edge weight")
        hideContextMenus();
        let activeEdgeWeightValue = Number($activeEdge.data("weight").html());
        showChangeEdgeWeightMenu($changeEdgeWeightMenu, e.pageX, e.pageY, activeEdgeWeightValue);
    })

    //handles actual edge weight changing logic
    $("#change-edge-weight-button").click(() => {
        console.log("weight changed")
        let newWeight = Number($("#change-edge-weight").val());
        console.log("new weight: ", newWeight)
        if (newWeight > 200) {
            alert("weights must be under 200")
            return;
        }
        console.log(newWeight)
        console.log($activeEdge)
        // find the edges of the linked nodes and change the weights
        $activeEdge.data("linkedNodes")[0].data("neighbors").forEach(neighbor => {
            if (neighbor.edge == $activeEdge) {
                neighbor.weightDOMElement.html(String(newWeight))
                neighbor.weight = newWeight
            }
        })
        $activeEdge.data("linkedNodes")[1].data("neighbors").forEach(neighbor => {
            if (neighbor.edge == $activeEdge) {
                neighbor.weightDOMElement.html(String(newWeight))
                neighbor.weight = newWeight
            }
        })
        hideChangeEdgeWeightMenu($changeEdgeWeightMenu);
    })

    $("#run-bfs-button").click(() => {
        //if no source node selected, draw attention to the problem
        if (!$sourceNode) {
            flashCurrentSrcNodeDisplay("red");
            console.log("no source node selected!")
            return;
        }
        if (nodeList.length == 0 || !runningAlgosAllowed) {
            console.log("node list is empty or algo already running")
            return;
        }
        modifyingGraphAllowed = false;
        runningAlgosAllowed = false;
        $("#stop-algorithm-button").show();
        console.log("modifying graph disabled")
        BFS(nodeList, $sourceNode)
        //need settimeout b/c of asynchronous code in BFS()
        setTimeout(() => {
            console.log("modifying graph allowed")
            modifyingGraphAllowed = true;
            runningAlgosAllowed = true;
            $("#stop-algorithm-button").hide();
        }, (nodeList.length + 2) * 2000)

    })

    $("#run-dfs-button").click(() => {
        //if no source node selected, draw attention to the problem
        if (!$sourceNode) {
            flashCurrentSrcNodeDisplay("red");
            console.log("no source node selected!")
            return;
        }
        if (nodeList.length == 0 || !runningAlgosAllowed) {
            console.log("node list is empty or algo already running")
            return;
        }
        modifyingGraphAllowed = false;
        runningAlgosAllowed = false;
        $("#stop-algorithm-button").show();
        console.log("modifying graph disabled")
        DFS(nodeList, $sourceNode)
        //need settimeout b/c of asynchronous code in DFS()
        setTimeout(() => {
            console.log("modifying graph allowed")
            modifyingGraphAllowed = true;
            runningAlgosAllowed = true;
            $("#stop-algorithm-button").hide();
        }, (nodeList.length + 2) * 2000)

    })

    $("#run-dijkstra-button").click(() => {
        //if no source node selected, draw attention to the problem
        if (!$sourceNode) {
            flashCurrentSrcNodeDisplay("red");
            console.log("no source node selected!")
            return;
        }
        if (nodeList.length == 0 || !runningAlgosAllowed) {
            console.log("node list is empty or algo already running")
            return;
        }
        //first check that there are no negative edges
        let negativeEdgeWeightExists = false;
        nodeList.forEach(node => {
            node.data("neighbors").forEach(neighbor => {
                if (neighbor.weight < 0) {
                    console.log("negative weight found")
                    negativeEdgeWeightExists = true;
                }
            })
        })
        if (negativeEdgeWeightExists) {
            console.log("can't run dijkstra with negative edges")
            return;
        }
        // console.log("dijkstra start")
        modifyingGraphAllowed = false;
        runningAlgosAllowed = false;
        $("#stop-algorithm-button").show();
        console.log("modifying graph disabled")
        //gets time dijsktra will run so can enable modifing right after it ends
        let delay = Dijkstra.getDijkstraTime(nodeList, $sourceNode)
        Dijkstra.Dijkstra(nodeList, $sourceNode)
        //need settimeout b/c of asynchronous code in DFS()
        setTimeout(() => {
            console.log("modifying graph allowed")
            modifyingGraphAllowed = true;
            runningAlgosAllowed = true;
            $("#stop-algorithm-button").hide();
        }, delay + 1000)

    })

    $("#run-prim-button").click(() => {
        //if no source node selected, draw attention to the problem
        if (!$sourceNode) {
            flashCurrentSrcNodeDisplay("red");
            console.log("no source node selected!")
            return;
        }
        if (nodeList.length == 0 || !runningAlgosAllowed) {
            console.log("node list is empty or algorithm is already running")
            return;
        }
        modifyingGraphAllowed = false;
        runningAlgosAllowed = false;
        $("#stop-algorithm-button").show();
        console.log("modifying graph disabled")
        //gets time Prim will run so can enable modifing right after it ends
        let delay = Prim.getPrimTime(nodeList, $sourceNode)
        Prim.Prim(nodeList, $sourceNode)
        //need settimeout b/c of asynchronous code in DFS()
        setTimeout(() => {
            console.log("modifying graph allowed")
            modifyingGraphAllowed = true;
            runningAlgosAllowed = true;
            $("#stop-algorithm-button").hide();
        }, delay + 1000)

    })
    $("#stop-algorithm-button").click(() => {
        //should clear all timeouts?
        // https://stackoverflow.com/questions/8860188/javascript-clear-all-timeouts
        var id = window.setTimeout(function() {}, 0);
        while (id--) {
            window.clearTimeout(id); // will do nothing if no timeout with id is present
        }
        //reset node and edge colors
        nodeList.forEach(node => {
            node.attr("class", "node")
            // node.css("border", "3.5px black solid")
            node.data("neighbors").forEach(neighbor => {
                neighbor.edge.attr("class", "edge")
            })
        })
        modifyingGraphAllowed = true;
        runningAlgosAllowed = true;
        $("#stop-algorithm-button").hide();
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

    $("#close-instructions-button").click(() => {
        $("#instructions").hide();
    })

    $("[list=chooseable-source-nodes]").change(() => {
        console.log("change");
    })

    // draws graph on startup so users can play around with visualization immediately
    function drawSampleGraph() {
        console.log(sampleGraphData.nodes)
        const nodeNameToDOMEleMap = {

        }
        for (let node of sampleGraphData.nodes) {
            let $node = createNode(node.name, node.pos.x, node.pos.y);
            nodeNameToDOMEleMap[node.name] = $node;
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
                        moveEdgeWeight($node, neighbor.neighbor, neighbor.weightDOMElement);
                    })
                },
                stop: function() {
                    $node.data("neighbors").forEach((neighbor) => {
                        moveEdge($node, neighbor.neighbor, neighbor.edge);
                        moveEdgeWeight($node, neighbor.neighbor, neighbor.weightDOMElement);
                    })
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
                    // console.log("right clicked on node")
                    showNodeContextMenu($nodeContextMenu, e.pageX, e.pageY);
                }
            })
            // $node.on('moving', (e) => {
            //     console.log('moving');
            // })
            //double click to focus on node
            $node.click(function focusOnNode(e) {
                console.log(e.pageX, e.pageY);
                if (!modifyingGraphAllowed) {
                    console.log("modifying graph not allowed")
                    return
                }
                $node.addClass("focused-node")
                //check that you did not select the same node twice
                if (lockedNodes[0] == $node) {
                    console.log("clicked the same node")
                    lockedNodes[0].removeClass("focused-node")
                    lockedNodes = [];
                    return;
                }
                lockedNodes.push($node);
                // console.log("lockedNodes", lockedNodes) 
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
                        // console.log(i.neighbor);
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
                    //create weight
                    let $edgeWeight = createEdgeWeight($node1, $node2, $graphArea)
                    // let weight know about its edge
                    $edgeWeight.data("edge", $edge)
                    // let edge know about its weight
                    $edge.data("weight", $edgeWeight);
                    $edgeWeight.addClass("edge-weight")
                    //
                    $edgeWeight.click(function changeEdgeWeight(e) {
                        // sets active edge to edge of the weight
                        $activeEdge = $edgeWeight.data("edge")
                        if (!modifyingGraphAllowed) {
                            console.log("modifying graph not allowed")
                            return;
                        }
                        console.log("change edge weight")
                        hideContextMenus();
                        // console.log($active)
                        let activeEdgeWeightValue = Number($edgeWeight.html());
                        showChangeEdgeWeightMenu($changeEdgeWeightMenu, e.pageX, e.pageY, activeEdgeWeightValue);
                    })
                    //add event listenerse
                    $edge.on("mouseenter", (e) => {
                        if (!modifyingGraphAllowed) {
                            return;
                        }
                        $edge.addClass("hovered-edge")
                    }).on("mouseleave", (e) => {
                        if (!modifyingGraphAllowed) {
                            return;
                        }
                        $edge.removeClass("hovered-edge")
                    }).on("mousedown", (e) => {
                        if (e.button == 2) {
                            $activeEdge = $edge;
                            hideContextMenus(); //hides any context menus that might still be up
                            // //hides the node name input
                            $nameNodeMenu.hide();
                            $renameNodeMenu.hide();
                            //resets the value in the node name input.
                            $("#node-name").val(null);
                            $("#node-rename").val(null);
                            console.log("right clicked on edge")
                            showEdgeContextMenu($edgeContextMenu, e.pageX, e.pageY);
                        }
                    })
                    
                    $node1.data("neighbors").push({
                        neighbor: $node2,
                        edge: $edge,
                        // the weight as displayed on the screen
                        weightDOMElement: $edgeWeight,
                        weight: 1
                    })
                    $node2.data("neighbors").push({
                        neighbor: $node1,
                        edge: $edge,
                        // the weight as displayed on the screen
                        weightDOMElement: $edgeWeight,
                        weight: 1
                    })
                    // edgeList.push({
                        
                    // })
                    // printAdjList(nodeList);
                    $edge.appendTo($graphArea);
                    $node1.removeClass("focused-node")
                    $node2.removeClass("focused-node")
                    lockedNodes = [];
                    // console.log($node1.data("neighbors"));
                }
            })
            //if lenght of node list is 0 before adding, automatically set to source node
            if (nodeList.length == 0) {
                $sourceNode = $node;
                console.log(`source node's id: ${$node.data("id")}`);
                $("#current-source-node").html($node.data("id"));
                flashCurrentSrcNodeDisplay("green");
            }
            //add node to list
            nodeList.push($node);
        }

        console.log(nodeNameToDOMEleMap);
        // create edges
        const keys = Object.keys(sampleGraphData.edges);
        for (let key of keys) {
            for (let edge of sampleGraphData.edges[key]) {
                let $node1 = nodeNameToDOMEleMap[key];
                let $node2 = nodeNameToDOMEleMap[edge.node];
                //create an edge
                let $edge = createEdge($node1, $node2);

                //create weight
                let $edgeWeight = createEdgeWeight($node1, $node2, $graphArea, edge.weight);
                // let weight know about its edge
                $edgeWeight.data("edge", $edge)
                // let edge know about its weight
                $edge.data("weight", $edgeWeight);
                $edgeWeight.addClass("edge-weight")
                //
                $edgeWeight.click(function changeEdgeWeight(e) {
                    // sets active edge to edge of the weight
                    $activeEdge = $edgeWeight.data("edge")
                    if (!modifyingGraphAllowed) {
                        console.log("modifying graph not allowed")
                        return;
                    }
                    console.log("change edge weight")
                    hideContextMenus();
                    // console.log($active)
                    let activeEdgeWeightValue = Number($edgeWeight.html());
                    showChangeEdgeWeightMenu($changeEdgeWeightMenu, e.pageX, e.pageY, activeEdgeWeightValue);
                })
                //add event listenerse
                $edge.on("mouseenter", (e) => {
                    if (!modifyingGraphAllowed) {
                        return;
                    }
                    $edge.addClass("hovered-edge")
                }).on("mouseleave", (e) => {
                    if (!modifyingGraphAllowed) {
                        return;
                    }
                    $edge.removeClass("hovered-edge")
                }).on("mousedown", (e) => {
                    if (e.button == 2) {
                        $activeEdge = $edge;
                        hideContextMenus(); //hides any context menus that might still be up
                        // //hides the node name input
                        $nameNodeMenu.hide();
                        $renameNodeMenu.hide();
                        //resets the value in the node name input.
                        $("#node-name").val(null);
                        $("#node-rename").val(null);
                        console.log("right clicked on edge")
                        showEdgeContextMenu($edgeContextMenu, e.pageX, e.pageY);
                    }
                })
                
                $node1.data("neighbors").push({
                    neighbor: $node2,
                    edge: $edge,
                    // the weight as displayed on the screen
                    weightDOMElement: $edgeWeight,
                    weight: edge.weight,
                })
                $node2.data("neighbors").push({
                    neighbor: $node1,
                    edge: $edge,
                    // the weight as displayed on the screen
                    weightDOMElement: $edgeWeight,
                    weight: edge.weight,
                })

                $edge.appendTo($graphArea);
            }
        }
    }

    drawSampleGraph();
})

