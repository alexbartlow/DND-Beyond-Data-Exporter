
var InitCharacter = (data) => {
  window.lastCharacterRendered = data;
  document.getElementById('app').innerHTML = Handlebars.templates["template.hbs"](data);
};

chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
  console.log(request);

  InitCharacter(JSON.parse(request.data));
});

Handlebars.registerHelper('equals', function(val, val2, options) {
  if(val == val2){
    return options.fn(this);
  }
});

Handlebars.registerHelper("present", function(val, options) {
  if(val.length > 0) {
    return options.fn(this);
  }
});
