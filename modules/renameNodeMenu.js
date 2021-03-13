export function createRenameNodeMenu() {
    var $renameNodeMenu =  $( 
        `
            <div id='rename-node-menu'>
                <input id="node-rename" type="text" size="3"/>
                <button id="rename-node-button">Rename Node</button>
            </div>" 
        `
    )
    $renameNodeMenu.appendTo( "#graph-area" );
    $renameNodeMenu.hide();
    return $renameNodeMenu;
}

export function showRenameNodeMenu($renameNodeMenu, mouseX, mouseY) {
    $renameNodeMenu.css('top', mouseY - 25);
    $renameNodeMenu.css('left', mouseX - 35);
    $renameNodeMenu.show();
    // need a delay before the focus for some reason
    setTimeout(() => {
        $("#node-rename").focus(); 
        console.log("die")
    }, 1)
    return $renameNodeMenu;
}

export function hideRenameNodeMenu($renameNodeMenu) {
    $renameNodeMenu.hide();
}