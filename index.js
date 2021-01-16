//some global variable to keep track of node numbers
//don't change node numbers when deleting node
window.onload = function(e) {
  window.lockedNodes = [];
  window.existingEdges = [];
  window.nodeNumber = 0;
  // window.graphArea = document.getElementById("graph-area");
  // graphArea.ondblclick = function(e) {
  //   addNodeUsingMouseCoords(e.clientX, e.clientY)
  // }
}
// function addLabel() {
//     let newNode = document.createElement("p");
//     //create node's text 
//     // let newNodeText = document.createElement("p");
//     // newNodeText.textContent = String(nodeNumber);
//     // newNode.appendChild(newNodeText);
//     newNode.textContent = String(nodeNumber);
//     //add node's id, class
//     newNode.classList.add("node");
//     newNode.id = String(nodeNumber);
//     newNode.setAttribute("oncontextmenu", "return false;");
//     //custom property to track edges
//     newNode.edges = [];
//     newNode.numEdges = 0;
//     //custom property to check draggability, double clicked
//     newNode.doubleClickToggled = false;
//     newNode.locked = false;
//     //add node to graph area
//     let graphArea = document.getElementById("graph-area");
//     graphArea.appendChild(newNode);
//     dragElement(newNode.id);
//     nodeNumber++;
// }
function addNode() {
    //create new node
    let newNode = document.createElement("div");
    //create node's text 
    // let newNodeText = document.createElement("p");
    // newNodeText.textContent = String(nodeNumber);
    // newNode.appendChild(newNodeText);
    newNode.textContent = String(nodeNumber);
    //add node's id, class
    newNode.classList.add("node");
    newNode.id = String(nodeNumber);
    newNode.setAttribute("oncontextmenu", "return false;");
    //custom property to track edges
    newNode.edges = [];
    newNode.numEdges = 0;
    //custom property to check draggability, double clicked
    newNode.doubleClickToggled = false;
    newNode.locked = false;
    //add node to graph area
    let graphArea = document.getElementById("graph-area");
    graphArea.appendChild(newNode);
    dragElement(newNode.id);
    nodeNumber++;
}

function dragElement(elmnt) {
  //keeps track of elmnt's position
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  // var doubleClickToggled = false;
  //var draggableAllowed = true;
  let elmntDOMNode = document.getElementById(elmnt);
  if (elmntDOMNode) {
    //should prevent context menu from popping up when you right click on a node
    // elmntDOMNode.oncontextmenu = function(e){
    //   e.preventDefault();
    // };
    elmntDOMNode.ondblclick = function() {
      if (!this.doubleClickToggled) {
        //console.log("doubleclicked once")
        this.style.border = "3px red solid";
        this.doubleClickToggled = true;
        this.locked = true;
        lockedNodes.push(this);
        //console.log(lockedNodes);
        //then check if lockedNodes == 2, then create edge between them
        if (lockedNodes.length == 2) {
          let edgeExists = false;
          //check if edge already exists
          if (lockedNodes[0].numEdges === 0) {
            edgeExists = false;
          }
          else {
            for (i = 0; i < lockedNodes[0].edges.length; i++) {
              if (lockedNodes[0].edges[i] === 0) {
                continue;
              }
              console.log(lockedNodes[0].edges[i].nodes[0].id);
              console.log(lockedNodes[0].edges[i].nodes[1].id);
              console.log(lockedNodes[0].id)
              console.log(lockedNodes[1].id)
              console.log(lockedNodes[0].edges[i].nodes);
              console.log("%s == %s?", lockedNodes[0].edges[i].nodes[0].id, lockedNodes[0].id)
              console.log("%s == %s?", lockedNodes[0].edges[i].nodes[1].id, lockedNodes[1].id)
              if ((lockedNodes[0].edges[i].nodes[0].id === lockedNodes[0].id && lockedNodes[0].edges[i].nodes[1].id === lockedNodes[1].id)) {
                edgeExists = true;
              }
              if ((lockedNodes[0].edges[i].nodes[0].id === lockedNodes[1].id && lockedNodes[0].edges[i].nodes[1].id === lockedNodes[0].id)) {
                edgeExists = true;
              }
            }
          } 
          
          if (!edgeExists) {
            console.log("two locked nodes, create edge between them.");
            createEdge(lockedNodes[0], lockedNodes[1]);
          }
          else {
            console.log("edge already exists!");
            lockedNodes[0].doubleClickToggled = false;
            lockedNodes[1].doubleClickToggled = false;
            lockedNodes[0].locked = false;
            lockedNodes[1].locked = false;
            lockedNodes[0].style.border = "3px green solid";
            lockedNodes[1].style.border = "3px green solid";
            lockedNodes.pop();
            lockedNodes.pop();
          }
        }
      }
      else {
        //console.log("doubleclicked once")
        this.style.border = "3px green solid";
        this.doubleClickToggled = false;
        this.locked = false;
        //is this wrong?? cause pop only pops last element and node isn't guaranteed to be last element? need to check.
        //think it's fine since only two nodes can be in lockedNodes and once size grows to two, it automatically empties.
        lockedNodes.pop(elmntDOMNode);
        console.log(lockedNodes);
      }
    }
    elmntDOMNode.onmousedown = function(e) {
      
      //e.preventDefault();
      //right click = delete node.
      if (e.button === 2) {
        if (elmntDOMNode.locked) {
          console.log("not deletable")
          return;
        }
        let reorderNodes = false;
        //let deletedNodeId = elmntDOMNode.id;
        console.log("right click");
        let graphArea = document.getElementById("graph-area");
        //if node number is equal to
        if (String(elmntDOMNode.id) < nodeNumber - 1) {
          reorderNodes = true;
        }
        //now must delete all edges associated with node
        //don
        let edgeToDelete;
        console.log(elmntDOMNode.edges);
        //iterates over node's edges.
        for (i = 0; i < elmntDOMNode.edges.length; i++) {
          if (elmntDOMNode.edges[i] === 0) {
            continue;
          }
          edgeToDelete = elmntDOMNode.edges[i];
          //iterates over edge's nodes.
          //console.log(elmntDOMNode.edges[i].nodes);
          for (j = 0; j < elmntDOMNode.edges[i].nodes.length; j++) {
            //don't need to zero out deleted element's edges.
            if (elmntDOMNode.edges[i].nodes[j] === elmntDOMNode) {
              continue;
            }
            //console.log("j = %d", j);
            console.log("processing node %s", elmntDOMNode.edges[i].nodes[j].id);
            console.log(elmntDOMNode.edges[i].nodes);
            //console.log(elmntDOMNode.edges[i].nodes[j].edges);
            //iterates over edge's node's edges.
            for (k = 0; k < elmntDOMNode.edges[i].nodes[j].edges.length; k++) {
              //console.log("k = %d", k);
              //console.log(elmntDOMNode.edges[i].nodes[j].edges[k])
              if (elmntDOMNode.edges[i].nodes[j].edges[k] === 0) {
                console.log("edge = 0");
                continue;
              }
              if (elmntDOMNode.edges[i].nodes[j].edges[k] === edgeToDelete) {
                //console.log("k = %d", k);
                console.log("edge to be deleted found");
                console.log(elmntDOMNode.edges[i].nodes);
                //this breaks the edges array for some reason
                //why???????
                //console.log(elmntDOMNode.edges[i].nodes[j].edges[k]);
                elmntDOMNode.edges[i].nodes[j].edges[k] = 0;
                elmntDOMNode.edges[i].nodes[j].numEdges--;
                //reason is because if nodes[j] === elmntDOMNode, 
                //then you zero out elmntDOMNode.edges[i], then it makes nodes array undefined.
                //console.log(elmntDOMNode.edges[i]);
                //nodes array became undefined right after zeroing out
                // console.log(elmntDOMNode.edges[i].nodes);
                // console.log(elmntDOMNode.edges[i].nodes[j].edges);
                // console.log("k = %d", k)
                // console.log("j = %d", j)
                // console.log("i = %d", i)
                //console.log(elmntDOMNode.edges);
                // console.log(elmntDOMNode.edges[i]);
                // console.log(elmntDOMNode.edges[i].nodes);
                
                // console.log(elmntDOMNode.edges[i].nodes[j].edges);

                // console.log(elmntDOMNode.edges[i].nodes[j].edges[k]);
                //console.log(elmntDOMNode.edges[i].nodes[j].edges);
                //k++;
                //console.log(elmntDOMNode.edges[i].nodes[j].edges[0]);
                //zero out the edge
                //elmntDOMNode.edges[i].nodes[j].edges[k] = document.createElement("div");
                //this causes an error?????
                //console.log(elmntDOMNode.edges[i].nodes[j].edges[k]);
              }
              //dconsole.log("new loop");
            }
          }
          graphArea.removeChild(edgeToDelete);
        }
        //console.log(elmntDOMNode.edges.nodes);
        // for (i = 0; i < elmntDOMNode.edges.length; i++) {
        //   if (elmntDOMNode.numEdges === 0) {
        //     continue;
        //   }
        //   if (edgeExists) {
        //     graphArea.removeChild(elmntDOMNode.edges[i]);
        //   }
          
        // }
        //graphArea.removeChild(elmntDOMNode.edges[i]);
        console.log("deleting node")
        graphArea.removeChild(elmntDOMNode);
        nodeNumber--;
        if (reorderNodes) {
          let node;
          //will decrease number of all nodes with higher id's than deleted node.
          for (i = Number(elmntDOMNode.id) + 1; i < nodeNumber + 1; i++) {
            console.log("i = %d\n", i);
            node = document.getElementById(String(i));
            if (!document.getElementById(String(i))) {
              continue;
            }
            node.id = String(i - 1);
            console.log("change i's text to i - 1");
            node.textContent = String(i - 1);
          }
        }
      }
      //alert("mouse down");
      let dragMouseDown = function(e) {
        console.log("mouse down");
        // console.log("node's id: " + elmnt);
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        //stop movement when mouse up
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = function() {
          if (elmntDOMNode.locked) {
            console.log("not draggable")
            return;
          }
          console.log("mouse drag");
          // console.log("node's id: " + elmnt);
          //elmntDOMNode.style.backgroundColor = "red";
          let elementDrag = function (e) {
            console.log("element moving");
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the node's new position:
            elmntDOMNode.style.top = (elmntDOMNode.offsetTop - pos2) + "px";
            elmntDOMNode.style.left = (elmntDOMNode.offsetLeft - pos1) + "px";
            //move all edges of the node with the node.
            for (i = 0; i < elmntDOMNode.edges.length; i++) {
              //edge = document.getElementById(i);
              //for each edge of the node, check which node is being dragged
              //console.log("checking 1")
              if (elmntDOMNode.edges[i] === 0) {
                continue;
              }
              if (elmntDOMNode.edges[i].nodes[0].id === elmntDOMNode.id) {
                ///console.log("checking 2")
                moveEdge(elmntDOMNode.edges[i].nodes[1], elmntDOMNode.edges[i].nodes[0], elmntDOMNode.edges[i])
              }
              else {
                //console.log("checking 2")
                moveEdge(elmntDOMNode.edges[i].nodes[0], elmntDOMNode.edges[i].nodes[1], elmntDOMNode.edges[i])
              }
            }
          };
          elementDrag();
        };
      }
      dragMouseDown();
    };
  }    
}
// function dragMouseDown(e) {
//   //alert("move");
//   e = e || window.event;
//   e.preventDefault();
//   // get the mouse cursor position at startup:
//   pos3 = e.clientX;
//   pos4 = e.clientY;
//   document.onmouseup = closeDragElement;
//   // call a function whenever the cursor moves:
//   document.onmousemove = elementDrag;
// }

// function elementDrag(e) {
//   e = e || window.event;
//   e.preventDefault();
//   // calculate the new cursor position:
//   pos1 = pos3 - e.clientX;
//   pos2 = pos4 - e.clientY;
//   pos3 = e.clientX;
//   pos4 = e.clientY;
//   // set the element's new position:
//   elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
//   elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
// }

function closeDragElement() {
  /* stop moving when mouse button is released:*/
  console.log("mouseup")
  document.onmouseup = null;
  document.onmousemove = null;
}

function createEdge(node1, node2) {
  //plus 25 because we want edge to start from center of node
  let x1 = parseInt(node1.style.left) + 25;
  let y1 = parseInt(node1.style.top) + 25;
  let x2 = parseInt(node2.style.left) + 25;
  let y2 = parseInt(node2.style.top) + 25;
  //console.log("x1: %d", x1);
  var length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
  //console.log("length is %d", length);
  var angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  //console.log("angle is %d", angle);
  var transform = 'rotate('+ angle +'deg)';
  let edge = document.createElement("div");
  graphArea = document.getElementById("graph-area");
  graphArea.appendChild(edge);
  edge.classList.add("edge");
  //edge.id = node1.id + "-" 
  edge.style.transform = transform;
  edge.style.width = length.toString() + 'px';
  edge.style.left = x1.toString() + 'px';
  edge.style.top = y1.toString() + 'px';
  //keep track of nodes that the edge links
  edge.nodes = [node1, node2];
  //attach event handlers
  edge.onmousedown = function(e) {
    //removes edge from graph
    if (e.button === 2) {
      //remove edge from linked vertices' edges
      //remove edge from node1
      //search linked vertices' list of edges for the edge, then delete it.
      for (i = 0; i < this.nodes[0].edges.length; i++) {
        if (this.nodes[0].edges[i] === edge) {
          //just zero out the edge, who cares about size anyway?
          this.nodes[0].edges[i] = 0;
        }
      }
      //remove node from node2
      for (i = 0; i < this.nodes[1].edges.length; i++) {
        if (this.nodes[1].edges[i] === edge) {
          //just zero out the edge, who cares about size anyway?
          this.nodes[1].edges[i] = 0;
        }
      }
      this.nodes[0].numEdges--;
      this.nodes[1].numEdges--;
      //console.log("node %s now has %d edges", node1.id, node1.numEdges)
      //console.log("node %s now has %d edges", node2.id, node2.numEdges)
      //edge.nodes[1].edges
      //remove edge from document
      console.log(this.nodes[1].edges);
      console.log(this.nodes[0].edges);
      console.log(this.nodes);
      graphArea = document.getElementById("graph-area");
      graphArea.removeChild(this);
    }
  }
  edge.onmouseover = function(e) {
    //console.log("moused over edge");
    this.style.background = "orange";
  }
  edge.onmouseout = function(e) {
    //console.log("moused over edge");
    this.style.background = "black";
  }
  //console.log("line drawn from %d, %d to %d, %d", x1, y1, x2, y2);
  lockedNodes.pop(node1); lockedNodes.pop(node2);
  //add edge to each node's list of edges
  node1.edges.push(edge); node2.edges.push(edge);
  node1.numEdges++; node2.numEdges++;
  //unlock both nodes
  node1.locked = false;
  node2.locked = false;
  node1.doubleClickToggled = false;
  node2.doubleClickToggled = false;
  node1.style.border = "3px green solid";
  node2.style.border = "3px green solid";
  //debug
  console.log("node %s now has %d edges", node1.id, node1.numEdges);
  console.log("node %s now has %d edges", node2.id, node2.numEdges);
  return;
  //when you delete a node, all edges of that node should be deleted;
  //also, each node connected to that node should delete the edge from their list of edges.
}
//endNode is the one that is being dragged currently.
function moveEdge(startNode, endNode, edge) {
  let x1 = parseInt(startNode.style.left) + 25;
  let y1 = parseInt(startNode.style.top) + 25;
  let x2 = parseInt(endNode.style.left) + 25;
  let y2 = parseInt(endNode.style.top) + 25;
  var length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
  //console.log("length is %d", length);
  var angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  //console.log("angle is %d", angle);
  var transform = 'rotate('+ angle +'deg)';
  //edge.id = ""
  edge.style.transform = transform;
  edge.style.width = length.toString() + 'px';
  edge.style.left = x1.toString() + 'px';
  edge.style.top = y1.toString() + 'px';
}


//http://www.monkeyandcrow.com/blog/drawing_lines_with_css3/
//https://www.w3schools.com/jsref/obj_mouseevent.asp




// DFS(V, E, Root):  // V: vertices, E: edges, Root: start    
//   For each vertex v in V: //Runs V times       
//     Visited[v] = false
//   Determine indegree of each vertex v //Runs V times
//   For each vertex v with indegree 0 and visited[v] == false: //Runs at most V times, but very unlikely
//     DFS_Explore(V, E, v, Visited)

//   DFS_Explore(V, E, Curr_node, Visited): //will run V times
//     Visit Curr_node    
//     Visited[Curr_node] = True    
//     For each neighbor n of Curr_node: //Runs a TOTAL of E times
//       indegree[n] = indegree[n] - 1   
//     For each neighbor n of Curr_node: //Runs a TOTAL of E times
//       If Visited[n] is False and indegree[n] == 0:            
//         DFS_Explore(V, E, n, Visited)