chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  })
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message == "data_fetched" ) {
      chrome.tabs.create({"url": chrome.runtime.getURL("export.html")}, function (tab) {
        setTimeout(function() {
          chrome.tabs.sendMessage(tab.id, {"message": "load_data", data: JSON.stringify(request.data)});
        }, 1000);
      });
    }
  }
);

