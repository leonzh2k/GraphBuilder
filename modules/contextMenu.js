//strat: keep context menus in dom but hidden, make them show up only when called
export function createGraphAreaContextMenu() {
    var $graphAreaContextMenu =  $( "<div id='graph-area-background-context-menu' class='graph-area-context-menu'></div>" )
    var $createNodeLabel =  $( "<span id='create-node-label' style='color:white; font-size:24px; border:2px red solid; cursor:pointer;' onclick='die()'>Create Node</span>" )
    $createNodeLabel.appendTo($graphAreaContextMenu);
    $graphAreaContextMenu.appendTo( "#graph-area" );
    $graphAreaContextMenu.hide();
    // $contextMenu.css('top', mouseY);
    // $contextMenu.css('left', mouseX);
    return $graphAreaContextMenu;
    
}

export function createNodeContextMenu() {
    var $nodeContextMenu =  $( "<div id='node-context-menu' class='graph-area-context-menu'></div>" )
    var $deleteNodeLabel =  $( "<span id='deleteNodeLabel' style='color:white; font-size:18px; cursor:pointer;'>Delete Node</span>" )
    var $renameNodeLabel =  $( "<span id='renameNodeLabel' style='color:white; font-size:18px; cursor:pointer;'>Rename Node</span>" )
    $deleteNodeLabel.appendTo($nodeContextMenu);
    $renameNodeLabel.appendTo($nodeContextMenu);
    $nodeContextMenu.appendTo( "#graph-area" );
    $nodeContextMenu.hide();
    // $contextMenu.css('top', mouseY);
    // $contextMenu.css('left', mouseX);
    return $nodeContextMenu;
}

export function showGraphAreaContextMenu($graphAreaContextMenu, mouseX, mouseY) {
    $graphAreaContextMenu.css('top', mouseY);
    $graphAreaContextMenu.css('left', mouseX);
    $graphAreaContextMenu.show();
    return $graphAreaContextMenu;
}

export function showNodeContextMenu($nodeContextMenu, mouseX, mouseY) {
    $nodeContextMenu.css('top', mouseY);
    $nodeContextMenu.css('left', mouseX);
    $nodeContextMenu.show();
    return $nodeContextMenu;
}

export function hideContextMenus() {
    $(".graph-area-context-menu").hide();
}