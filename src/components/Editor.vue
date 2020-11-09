<template>
  <div class="editor" :style="cssVars">
    <canvas ref="canvas" class="editor__canvas" />
  </div>
</template>

<script>
const isPointInsideObject = (pointX, pointY, object) => pointX >= object.x
  && pointX < object.x + object.img.width
  && pointY >= object.y
  && pointY < object.y + object.img.height;

const RATIO = 16 / 9; // The canvas should be 100% width with a 16:9 aspect ratio.

export default {
  name: 'Editor',
  computed: {
    cssVars() {
      return {
        '--ratio': RATIO, // sharing ratio between js and css
      };
    },
  },
  created() {
    this.editor = { // TODO: move to store
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
    addListeners() {
      window.addEventListener('resize', this.redrawObjects);
      this.canvas.addEventListener('mousedown', this.mouseDown);
      this.canvas.addEventListener('mousemove', this.mouseMove);
      this.canvas.addEventListener('mouseup', this.mouseUp);
    },
    removeListeners() {
      window.removeEventListener('resize', this.redrawObjects);
      this.canvas.removeEventListener('mousedown', this.mouseDown);
      this.canvas.removeEventListener('mousemove', this.mouseMove);
      this.canvas.removeEventListener('mouseup', this.mouseUp);
    },
    addImage(url, x = 0, y = 0) {
      const img = new Image();
      img.onload = () => {
        this.context.drawImage(img, x, y);
        this.editor.objects.push({
          id: (new Date()).valueOf(),
          url,
          img,
          x,
          y,
          isDragging: false,
        });
      };
      img.src = url;
    },
    redrawObjects() {
      // preventing added image resize on canvas resizing
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.setUpCanvas();
      this.editor.objects.forEach(({ img, x, y }) => {
        this.context.drawImage(img, x, y);
      });
    },
    setUpCanvas() {
      // Feed the size back to the canvas
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
    },
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
      this.redrawObjects();

      this.mouseStartX = mouseX;
      this.mouseStartY = mouseY;
    },
    mouseUp() {
      this.draggedObject.isDragging = false;
      this.draggedObject = null;
      this.mouseStartX = null;
      this.mouseStartY = null;
    },
  },
};
</script>

<style lang="less">
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
