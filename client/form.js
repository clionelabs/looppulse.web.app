Form = {};

Form.findKeys = function findKeys(elem, arr) {
  if (!arr) { arr = []; }
  if (elem.parentNode) {
    var key = $(elem).data("id");
    if (key) {
      return findKeys(elem.parentNode, [{"key":key, "element" : elem}].concat(arr));
    } else {
      return findKeys(elem.parentNode, arr);
    }
  } else {
    return arr;
  }
};