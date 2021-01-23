export function createNameNodeMenu() {
    var $nameNodeMenu =  $( 
        `
            <div id='name-node-menu'>
                <input id="node-name" type="text" size="3"/>
                <button id="name-node-button">Name Node</button>
            </div>" 
        `
    )
    $nameNodeMenu.appendTo( "#graph-area" );
    $nameNodeMenu.hide();
    return $nameNodeMenu;
}

export function showNameNodeMenu($nameNodeMenu, mouseX, mouseY) {
    $nameNodeMenu.css('top', mouseY - 25);
    $nameNodeMenu.css('left', mouseX - 35);
    $nameNodeMenu.show();
    document.getElementById("node-name").focus(); //supposed to focus the input but not working
    return $nameNodeMenu;
}

export function hideNameNodeMenu($nameNodeMenu) {
    $nameNodeMenu.hide();
}



