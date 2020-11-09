const resetBrowserEvents = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

export const isPointInsideObject = (pointX, pointY, object) => pointX >= object.x
    && pointX < object.x + object.img.width
    && pointY >= object.y
    && pointY < object.y + object.img.height;

export default {
  resetBrowserEvents,
  isPointInsideObject,
};
