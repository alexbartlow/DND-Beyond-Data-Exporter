var InitCharacter = (data) => {
  document.getElementById('data').innerHTML = JSON.stringify(data, null, 2);
};

window.onload = () => {
  chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    console.log(request);

    InitCharacter(request.data);
  });
};
