// Module system
const MODULES = {};
function createModule(name, scriptPaths) {
  MODULES[name] = {
    scriptPaths: scriptPaths,
    loaded: false
  };
}
function loadModule(name, callback) {
  if(!MODULES[name].loaded) {
    MODULES[name].loaded = true;
    MODULES[name].scriptPaths.forEach((path,i) => {
      let currentCallback = i===MODULES[name].scriptPaths.length-1?callback:() => {};
      $.ajax({
        url: path,
        dataType: "script",
        success: currentCallback,
        async: true
      });
    });
  } else {
    callback();
  }
}
function loadModules(names, callback) {
  names.forEach((name,i) => loadModule(name, i===names.length-1?callback:()=>{}));
  if(names.length===0) callback();
}

// Router
var ROUTES = [];
function initiateRouter(routes) {
  ROUTES = routes;
  routeTo(window.location.hash.substring(1,Infinity));
}
function routeTo(path) {
  let currentRoute = ROUTES.find(r => r.path===path);
  currentRoute = currentRoute?currentRoute:ROUTES.find(r => r.path==="404");
  $("body").empty();
  loadModules(currentRoute.modules, currentRoute.mainFunction);
  window.location.hash = "#"+path;
}

// Component class
class Component {
  constructor() {
    this.previousSibling = null;
    this.parent = null;
    this.element = null;
  }
  template() {
    return $("<div>Test</div>")[0];
  }
  create() {
    let t = this.template();
    this.element = t;
    return t;
  }
  insert(parentElement=null) {
    if(parentElement) {
      $(parentElement).append(this.create());
    } else if(this.previousSibling) {
      $(this.previousSibling).after(this.create());
    } else if(this.parent) {
      $(this.parent).prepend(this.create());
    } else {
      $("body").append(this.create());
    }
  }
  update() {
    this.previousSibling = this.element.previousElementSibling;
    this.parent = this.element.parentNode;
    this.element.remove();
    this.insert();
  }
}
