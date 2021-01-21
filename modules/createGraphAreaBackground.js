export function createGraphAreaBackground(graphArea) {
    var graphAreaBackground = graphArea.rect(0, 0, 1250, 750).attr({fill: "rgb(128, 128, 128)"});

    //add draggable functionality to node

    return graphAreaBackground;
    
}