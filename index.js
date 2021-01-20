import {createNode} from "./createNode.js"

jQuery(() => {
    var graphArea = Raphael('graph-area', "100%", "100%");
    $("#create-node-button").on('click', () => {
        createNode(graphArea);
    })
})