# Solution

## The Process

### Selecting the tools
* Vue.js — my favorite js framework
* Vuex — for future features such as 'persisted state'.
* Less — for convenient style organizing. Not necessary on current stage but
would be useful when scaling
* ES Linter — to keep my code tidy and clean

### Responsive canvas
I made it quite easy by few css statements, but when it came to add pictures I've stuck a little, because the pics I added where blurry and with incorrect aspect ratio.
I've read some articles about this problem and found the solution:
```
setUpCanvas() {
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
    },
``` 
Calling this method when resizing the window helps me to prevent objects scaling on resize.

### Dragging the images
Drag and drop algorithm is quite trivial, but a little problem was that images are sorted in unconvenient order. So regarding this I treated the `objects` array almost like a stack (FILO).

### Limit dragging by canvas borders
Quite trivial task. But we could go further here: add possibility to move object along the border by one of X or Y axis.
Hadn't implemented it because of lack of time.

## Future features 

* persisting state on refresh — vuex and https://www.npmjs.com/package/vuex-persistedstate would help to add this functionality. Of course we should move `img` object outside of the store, because I guess it's not a good idea to store it in Local Storage in future :)
* ability to add/remove images from file input and/or src — all images are added by separate method. We can change it for working with different sources
* reordering the z positions of each layers — all images are pushed to the stack, we can manipulate with them like with ordinary array, so the z index will change according the order of elements in the array
* instead of drawing static images, drawing custom object (like our alerts) — we could modify an `addImage` method to add different shapes instead of image.
* resizing and cropping objects — also could be done with drag-n-drop algorithms
* undo/redo — we may store the actions history in the memory (or even in Local Storage) to have an ability to undo each step.
