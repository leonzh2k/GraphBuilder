export function createChangeEdgeWeightMenu() {
    var $changeEdgeWeightMenu =  $( 
        `
            <div id='change-edge-weight-menu' class='graph-area-context-menu'>
                <input id="change-edge-weight" type="number" min="-80" max="80"size="3"/>
                <button id="change-edge-weight-button">Change Weight</button>
            </div>" 
        `
    )
    $changeEdgeWeightMenu.appendTo( "#graph-area" );
    $changeEdgeWeightMenu.hide();
    return $changeEdgeWeightMenu;
}

export function showChangeEdgeWeightMenu($changeEdgeWeightMenu, mouseX, mouseY, currentEdgeWeightValue) {
    //update value of input field to current edge's weight
    console.log(currentEdgeWeightValue)
    $("#change-edge-weight").val(currentEdgeWeightValue);
    $changeEdgeWeightMenu.css('top', mouseY - 25);
    $changeEdgeWeightMenu.css('left', mouseX - 35);
    $changeEdgeWeightMenu.show();
    // need a delay before the focus for some reason
    setTimeout(() => {
        $("#change-edge-weight").focus(); 
        // console.log("die")
    }, 1)
    // document.getElementById("node-name").focus(); //supposed to focus the input but not working
    return $changeEdgeWeightMenu;
}

export function hideChangeEdgeWeightMenu($changeEdgeWeightMenu) {
    $changeEdgeWeightMenu.hide();
}