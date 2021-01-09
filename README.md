# GraphBuilder
UHP Year 3 Project

## Brainstorming

### Technologies being considered

#### JQuery 
* Originally game-changing, made working with JS much easier
* Modern JS makes it not as essential anymore
* Still makes some things easier like CSS animations

#### Fabric.js 
* Makes HTML Canvas easier to work with 
* Objects on Canvas are actual objects that can be manipulated easily
* Shapes come with built-in draggable, resizable, rotatable functionality
* Full potential of this library may not be used


#### React 
* Good for UI
* Popular
* May be difficult to integrate with other libraries
* If do not use other libraries, will have to implement node interactivity from scratch
* Will be harder to implement, but good learning experience if used 

#### Bugs
* When using Fabric, image quality of objects, text, etc. drawn on canvas seem to be dependent on the zoom level at the time the page was loaded. The more zoomed in you are, the better quality; the more zoomed out, the worse quality. Image quality is fixed, i.e. zooming after page load does not change the quality of the image. You can improve the quality of the image by resizing it with Fabric, but the image will no longer be the intended size. This may not be a library issue, maybe a problem with canvas itself.
