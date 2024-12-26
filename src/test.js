// funtion to get current window
function getCurrentWindow() {
  chrome.windows.getCurrent(function(window) {
    currentWindow = window;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      currentTab = tabs[0];
    });
  });
}

