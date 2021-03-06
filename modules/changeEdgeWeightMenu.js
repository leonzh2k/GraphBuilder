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

export function showChangeEdgeWeightMenu($changeEdgeWeightMenu, mouseX, mouseY) {
    $changeEdgeWeightMenu.css('top', mouseY - 25);
    $changeEdgeWeightMenu.css('left', mouseX - 35);
    $changeEdgeWeightMenu.show();
    // document.getElementById("node-name").focus(); //supposed to focus the input but not working
    return $changeEdgeWeightMenu;
}

export function hideChangeEdgeWeightMenu($changeEdgeWeightMenu) {
    $changeEdgeWeightMenu.hide();
}