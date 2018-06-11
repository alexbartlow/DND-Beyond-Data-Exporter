function hijack(callback) {
  "use strict"
  var code = function() {
    var FindReact = function(dom) {
        for (var key in dom) {
            if (key.startsWith("__reactInternalInstance$")) {
                var compInternals = dom[key]._currentElement;
                var compWrapper = compInternals._owner;
                var comp = compWrapper._instance;
                return comp;
            }
        }
        return null;
    };

    var element = FindReact(document.getElementsByClassName('character-sheet')[0]);
    var entities = element._reactInternalInstance._context.store.getState().character.entities;
    var modifiers = entities.modifier;

    var data = {
      classFeatures: [],
      feats: [],
      spells: []
    };

    for ( var classKey in entities.classFeature ) {
      var feature = entities.classFeature[classKey];
      data.classFeatures.push({
        'name': feature.definition.name,
        'description': feature.definition.description,
        'choices': feature.dynamicModifiers.map(function(modifier) {
          return modifiers[modifier].friendlySubtypeName
        })
      });
    }

    for ( var featKey in entities.feat ) {
      var feat = entities.feat[featKey];
      data.feats.push({
        'name': feat.definition,
        'description': feat.definition.description,
        'choices': feat.dynamicModifiers.map(function(modifier) {
          return modifiers[modifier].friendlySubtypeName
        })
      });
    }

    var spellLists = document.getElementsByClassName('class-spell-list-manager');
    for ( var i in spellLists ) {
      var spellManager = FindReact(spellLists[i]);

      if (spellManager) {
        Array.prototype.push.apply(
          data.spells,
          spellManager.props.spells.map(function(spell) { return spell.definition; })
        );
      }
    }

    localStorage.setItem("__reactExport", JSON.stringify(data));
  };

  var script = document.createElement('script');
  script.textContent = '(' + code + ')()';
  (document.head||document.documentElement).appendChild(script);
  script.parentNode.removeChild(script);
  callback();
}

var messageCallback = function(request, sender, sendResponse) {
    if (request.message == "clicked_browser_action") {
      var dataCallback = function()  {
        chrome.runtime.sendMessage({"message": "data_fetched", "data": JSON.parse(localStorage.getItem("__reactExport"))});
      };
      hijack(dataCallback);
  };
};

chrome.runtime.onMessage.addListener(messageCallback);
