<template>
  <div class="editor">
    <canvas ref="canvas" class="editor__canvas" />
  </div>
</template>

<script>
const isPointInsideObject = (pointX, pointY, object) => pointX >= object.x
  && pointX < object.x + object.img.width
  && pointY >= object.y
  && pointY < object.y + object.img.height;

export default {
  name: 'Editor',
  created() {
    this.editor = { // TODO: move to vuex store (https://www.npmjs.com/package/vuex-persistedstate)
      objects: [],
    };
    this.draggedObject = null;
    this.mouseStartX = null;
    this.mouseStartY = null;
  },
  mounted() {
    this.canvas = this.$refs.canvas;
    this.context = this.canvas.getContext('2d');
    this.setUpCanvas();
    this.addImage('./lemon.png');
    this.addImage('./banana.png');

    this.addListeners();
  },
  destroyed() {
    this.removeListeners();
  },
  methods: {
    /*
    * Adds browser event listeners
    * */
    addListeners() {
      window.addEventListener('resize', this.redrawObjects);
      this.canvas.addEventListener('mousedown', this.mouseDown);
      this.canvas.addEventListener('mousemove', this.mouseMove);
      this.canvas.addEventListener('mouseup', this.mouseUp);
    },
    /*
    * Removes browser event listeners
    * */
    removeListeners() {
      window.removeEventListener('resize', this.redrawObjects);
      this.canvas.removeEventListener('mousedown', this.mouseDown);
      this.canvas.removeEventListener('mousemove', this.mouseMove);
      this.canvas.removeEventListener('mouseup', this.mouseUp);
    },
    /*
    * Adds image to canvas
    *
    * @param {string} url — image url to load
    * @param {number} x — image x coordinate
    * @param {number} y — image y coordinate
    * */
    addImage(url, x = 0, y = 0) {
      const img = new Image();
      img.onload = () => {
        this.context.drawImage(img, x, y);
        this.editor.objects.push({
          img,
          x,
          y,
          isDragging: false,
        });
      };
      img.src = url;
    },
    /*
    * Redraws all the objects on some events
    * */
    redrawObjects() {
      // preventing added image resize on canvas resizing
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.setUpCanvas();
      this.editor.objects.forEach(({ img, x, y }) => {
        this.context.drawImage(img, x, y);
      });
      this.addObjectHighlight();
    },
    /*
    * Feeds the size back to the canvas
    * */
    setUpCanvas() {
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
    },
    /*
    * Mouse down event handler
    *
    * @param {Event} e — mouse event
    * */
    mouseDown(e) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // searching objects in reverse order: the item on the top should be draggable
      let i = this.editor.objects.length - 1;
      while (i >= 0) {
        const object = this.editor.objects[i];
        if (isPointInsideObject(mouseX, mouseY, object) && !this.draggedObject) {
          object.isDragging = true;
          this.draggedObject = object;
          this.mouseStartX = mouseX;
          this.mouseStartY = mouseY;
        } else {
          object.isDragging = false;
        }
        i -= 1;
      }
    },
    /*
    * Mouse move event handler
    *
    * @param {Event} e — mouse event
    * */
    mouseMove(e) {
      if (!this.draggedObject) {
        return;
      }
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const dX = mouseX - this.mouseStartX;
      const dY = mouseY - this.mouseStartY;

      this.draggedObject.x += dX;
      this.draggedObject.y += dY;

      if (this.isDraggedObjectFullyOnCanvas()) {
        this.redrawObjects();
      }

      this.mouseStartX = mouseX;
      this.mouseStartY = mouseY;
    },
    /*
    * Mouse up event handler
    * */
    mouseUp() {
      this.draggedObject.isDragging = false;
      this.draggedObject = null;
      this.mouseStartX = null;
      this.mouseStartY = null;
    },
    /*
    * Checks if object is fully on canvas
    *
    * @returns {boolean}
    * */
    isDraggedObjectFullyOnCanvas() {
      return this.draggedObject.x >= 0
        && this.draggedObject.x + this.draggedObject.img.width < this.canvas.width
        && this.draggedObject.y >= 0
        && this.draggedObject.y + this.draggedObject.img.height < this.canvas.height;
    },
    /*
    * Adds green border to object when dragging
    * */
    addObjectHighlight() {
      if (!this.draggedObject) {
        return;
      }
      this.context.strokeStyle = 'green';
      this.context.lineWidth = 2;
      this.context.strokeRect(
        this.draggedObject.x,
        this.draggedObject.y,
        this.draggedObject.img.width,
        this.draggedObject.img.height,
      );
    },
  },
};
</script>

<style lang="less">
:root {
  --ratio: calc(16 / 9);
}
.editor {
  position: relative;
  width: 100%;
  padding-bottom: calc(
    100% / var(--ratio)
  );
  &__canvas {
    position: absolute;
    top: 0;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background: #cacaca;
  }
}
</style>
