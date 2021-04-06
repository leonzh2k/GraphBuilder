export function flashCurrentSrcNodeDisplay(flashColor) {
    let $currentSourceNodeDisplay = $("#current-source-node-display");
    //makes it so that it only flashes once 
    $currentSourceNodeDisplay.clearQueue();

    //little color flash to indicate source node changed
    $currentSourceNodeDisplay.animate({backgroundColor: flashColor}, 1);
    $currentSourceNodeDisplay.animate({backgroundColor: 'transparent'}, "slow");
}