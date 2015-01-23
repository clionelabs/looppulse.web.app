Template.registerHelper('obtain',
  function(obj, prop) {
    if (obj) {
      return obj[prop]
    } else {
      return null
    }
  }
)

Template.registerHelper('size', function(arr){
  return arr.length;
})

Template.registerHelper('getSession', function(key){
  return Session.get(key);
})

Template.registerHelper('keys', function(o){
  return Object.keys(o);
})

Template.registerHelper('indexOf', function(o, matcher, pos){
  return o.indexOf(matcher) === pos;
})

Template.registerHelper('log', function(o){
  return console.log("[UI]", o);
})