//strat: keep context menus in dom but hidden, make them show up only when called
export function createGraphAreaContextMenu() {
    var $graphAreaContextMenu =  $( "<div id='graph-area-background-context-menu' class='graph-area-context-menu'></div>" )
    var $createNodeLabel =  $( 
        `
            <div id='create-node-label' style='color:white; font-size:24px; cursor:pointer;' >
                <img id='add-node-image' src='https://www.svgrepo.com/show/157858/plus.svg' height=40px width=40px title="create node" />
            </div>" 
        `
    )
    $createNodeLabel.appendTo($graphAreaContextMenu);
    $graphAreaContextMenu.appendTo( "#graph-area" );
    $graphAreaContextMenu.hide();
    // $contextMenu.css('top', mouseY);
    // $contextMenu.css('left', mouseX);
    return $graphAreaContextMenu;
    
}

export function createNodeContextMenu() {
    var $nodeContextMenu =  $( 
        `
            <div id='node-context-menu' class='graph-area-context-menu'>
                <img id='rename-node-label' height=25px width=25px src="https://www.svgrepo.com/show/24909/pencil.svg" style='color:white; font-size:18px; cursor:pointer;' title="rename node"/>
                <img id='delete-node-label' height=25px width=25px src="https://www.svgrepo.com/show/186288/trash-bin.svg" style='color:white; font-size:18px; cursor:pointer;' title="delete node"/>
                
            </div>
        ` 
    )
    // $deleteNodeLabel.appendTo($nodeContextMenu);
    // $renameNodeLabel.appendTo($nodeContextMenu);
    $nodeContextMenu.appendTo( "#graph-area" );
    $nodeContextMenu.hide();
    // $contextMenu.css('top', mouseY);
    // $contextMenu.css('left', mouseX);
    return $nodeContextMenu;
}

export function createEdgeContextMenu() {
    var $edgeContextMenu =  $( 
        `
            <div id='edge-context-menu' class='graph-area-context-menu'>
                <img id='change-edge-weight-label' height=25px width=25px src="https://www.svgrepo.com/show/24909/pencil.svg" style='color:white; font-size:18px; cursor:pointer;' title="rename edge"/>
                <img id='delete-edge-label' height=25px width=25px src="https://www.svgrepo.com/show/186288/trash-bin.svg" style='color:white; font-size:18px; cursor:pointer;' title="delete edge"/>
            </div>
        ` 
    )
    $edgeContextMenu.appendTo( "#graph-area" );
    $edgeContextMenu.hide();
    return $edgeContextMenu;
}

export function showEdgeContextMenu($edgeContextMenu, mouseX, mouseY) {
    $edgeContextMenu.css('top', mouseY);
    $edgeContextMenu.css('left', mouseX);
    $edgeContextMenu.show();
    return $edgeContextMenu;
}

export function showGraphAreaContextMenu($graphAreaContextMenu, mouseX, mouseY) {
    $graphAreaContextMenu.css('top', mouseY - 25);
    $graphAreaContextMenu.css('left', mouseX - 25);
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