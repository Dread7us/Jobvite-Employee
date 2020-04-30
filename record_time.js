var domain = window.location.href;
window.onload = function () {
  if (!domain.includes('salesforce')) {
    // Not on a SF domain
    throw new Error("Jobvite Employee: Please ignore.");
  } else if (domain.includes('console') || (domain.includes('servicedesk'))) {
    // Case inside of console
  } else {
    var storedLegal = chrome.storage.sync.get('timeStorage', function (items) {
      var mins = items.timeStorage.minutes;
      var run = items.timeStorage.run;
      if (run === "true") {
        document.getElementById('00N30000002p3Zx').value = mins;
        document.querySelector('[id="00N30000002p3Zx"]').dispatchEvent(new Event("input", { bubbles: true }));

        var storArray = {
            minutes: mins,
            run: "false"
        };
        chrome.storage.sync.set({
            'timeStorage': storArray
        });
      } else {
        var storArray = {
          minutes: mins,
          run: "false"
        };
        chrome.storage.sync.set({
          'timeStorage': storArray
        });
      }
    });
  }

}
