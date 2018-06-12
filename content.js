function hijack(callback) {
  "use strict"
  var code = function() {
    var mapSpell = function(spell) {
      var ret = spell.definition;
      ret.isCantrip = spell.definition.level === 0;

      return ret;
    };

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
    console.log(entities);

    var data = {
      classFeatures: [],
      feats: [],
      spells: []
    };

    var ignoredFeatures = ["Ability Score Improvement", "Proficiencies", "Hit Points"]

    for ( var classKey in entities.classFeature ) {
      var feature = entities.classFeature[classKey];
      if(ignoredFeatures.indexOf(feature.definition.name) === -1) {
        data.classFeatures.push({
          'name': feature.definition.name,
          'description': feature.definition.description,
          'choices': feature.dynamicModifiers.map(function(modifier) {
            return modifiers[modifier].friendlySubtypeName
          }),
          'options': feature.options
        });
      }
    }

    for ( var featKey in entities.feat ) {
      var feat = entities.feat[featKey];
      data.feats.push({
        'name': feat.definition.name,
        'description': feat.definition.description,
        'choices': feat.dynamicModifiers.map(function(modifier) {
          return modifiers[modifier].friendlySubtypeName
        }),
        'options': feat.options
      });
    }

    var spellLists = document.getElementsByClassName('class-spell-list-manager');
    for ( var i in spellLists ) {
      var spellManager = FindReact(spellLists[i]);

      if (spellManager) {
        Array.prototype.push.apply(
          data.spells,
          spellManager.props.spells.map(function(spell) { return mapSpell(spell); })
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
