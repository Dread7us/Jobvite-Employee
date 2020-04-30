// This is to calculate time and add to case
var domain = window.location.href;
if (!domain.includes('lightning') && !domain.includes('salesforce')) {
  // Not on a SF domain
  alert("Not on SFDC, please try again!");
  throw new Error("Jobvite Employee: Not on SFDC.");
} else if (domain.includes('console')) {
  // Case inside of console
  var storedLegal = chrome.storage.sync.get('newStorage', function (items) {
    var time = items.newStorage.src_time;
    if (time) {
      // Data is here, good to go
      var nowTime = new Date().getTime();
      var diff = (nowTime - time);
      var mins = Math.round(diff/1000/60);
      var storArray = {
          minutes: mins,
          run: "false"
      };
      chrome.storage.sync.set({
          'timeStorage': storArray
      });
      try {
        var record_type = $('iframe').contents().find('#RecordType_ileinner').clone().text().trim().slice(0,-9);
        if (record_type === "Account Management") {
          var case_number = $('iframe').contents().find('#cas2_ileinner').clone().text();
        } else {
          var case_number = $('iframe').contents().find('#cas2_ileinner').clone().text().trim().slice(0,-17);
        }
      } catch(e) {
        var r = confirm("Too many Active tabs, press Ok to refresh. Once the page has finished reloading, " +
        "please try 'RECORD TIME' again.");
        if (r == true) {
          window.location.reload();
        } else {
          throw new Error("Jobvite Employee: Too many active tabs, need to refresh.");
        }
      }
      if (case_number.length > 8) {
        var r = confirm("Too many Active tabs, press Ok to refresh. Once the page has finished reloading, " +
        "please try 'RECORD TIME' again.");
        if (r == true) {
          window.location.reload();
        } else {
          throw new Error("Jobvite Employee: Too many active tabs, need to refresh.");
        }
      }
      // Click the my time button
    	try {
    	  $('iframe').contents().find("input[type='button'][name='my_new_time']").click();
    	} catch(e) {
        var r = confirm("Too many Active tabs, press Ok to refresh. Once the page has finished reloading, " +
        "please try 'RECORD TIME' again.");
        if (r == true) {
          window.location.reload();
        } else {
          throw new Error("Jobvite Employee: Too many active tabs, need to refresh.");
        }
    	}
      setTimeout(function() {
        chrome.storage.sync.get({
          consult: false,
          consult_only: false
          }, function(item) {
          var consult = item.consult;
          var consult_only = item.consult_only;
          if (consult) {
            // Add time + consult
            $('iframe').contents().find('#00N3A00000CjKM4').val('Consult');
            $('iframe').contents().find('#00N30000002p3Zx').val(mins);
          } else if (consult_only) {
            // Only add consult
            $('iframe').contents().find('#00N3A00000CjKM4').val('Consult');
          } else {
            // Neither is selected, just record time
            $('iframe').contents().find('#00N30000002p3Zx').val(mins);
          }
          makeFlash("Process has completed: " + mins + " minutes.");
        });
      }, 3000);
    } else {
      alert("Time has not been recorded! Please go back to the case and " +
      "click 'SOURCE SFDC'.");
    }
  });
} else if (domain.includes('lightning.force')) {
  // Case is open in SF Lightning
  var storedLegal = chrome.storage.sync.get('newStorage', function (items) {
    var time = items.newStorage.src_time;
    var record_type = document.querySelector('.slds-grow.slds-truncate span').innerHTML;
    if ((record_type === "Account Management") || (record_type === "Internal Training")) {
      document.querySelector('.rlql-relatedListQuickLink:nth-child(1) .rlql-label').click();
      setTimeout(function() {
        document.querySelector('.forceActionLink .slds-truncate').click();
      }, 2000);
    } else {
      document.querySelector('.uiTabItem:nth-child(3) .title').click();
    }
    setTimeout(function() {
      if (time) {
        // Data is here, good to go
        var nowTime = new Date().getTime();
        var diff = (nowTime - time);
        var mins = Math.round(diff/1000/60);
        var storArray = {
            minutes: mins,
            run: "false"
        };
        chrome.storage.sync.set({
            'timeStorage': storArray
        });
      alert("You have been on this case for " + mins + " minutes.");
      //var accnme = component.find("input");
      //accnme.set("v.inputValue", mins);
      //{!v.inputValue}
      //var e = document.querySelector('.uiInputSmartNumber');
      //e.value = mins;
      //var $e = angular.element(e);
      //$e.triggerHandler('input');

      //$('[.uiInputSmartNumber]').val(mins).focus();
      //$('.uiInputSmartNumber').val(mins).trigger('change');
      //document.querySelector('.uiInputSmartNumber').value = mins;
      //document.querySelector('.uiInputSmartNumber').dispatchEvent(new Event("change", { bubbles: true }));
      }
    }, 500);
  });
} else {
  // Case open outside of console
  var storedLegal = chrome.storage.sync.get('newStorage', function (items) {
    var name = items.newStorage.yourName;
    var time = items.newStorage.src_time;
    var case_number = items.newStorage.src_case;
    if (time) {
      // Data is here, good to go
      var nowTime = new Date().getTime();
      var diff = (nowTime - time);
      var mins = Math.round(diff/1000/60);

      var storArray = {
          minutes: mins,
          run: "true"
      };
      chrome.storage.sync.set({
          'timeStorage': storArray
      });

      // Click the my time button
      try {
    	  $("input[type='button'][name='my_new_time']").click();
    	} catch(e) {
        var r = confirm("Too many Active tabs, press Ok to refresh. Once the page has finished reloading, " +
        "please try 'RECORD TIME' again.");
        if (r == true) {
          window.location.reload();
        } else {
          throw new Error("Jobvite Employee: Too many active tabs, need to refresh.");
        }
    	}
    } else {
      alert("Time has not been recorded! Please go back to the case and " +
      "click 'SOURCE SFDC'.")
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

function makeFlash (message) {
  flash(message, {
    // background color
    'bgColor' : 'black',
    // bottom or 'top'
    'vPosition' : 'top',
    // text color
    'ftColor' : '#fdb914',
    // right or 'left'
    'hPosition' : 'right'
  });
}
