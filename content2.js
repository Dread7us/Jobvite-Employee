// This class is to add data to LIA
var domain = window.location.href;
if ((domain === "https://app.jobvite.com/admin/tracking/loginas.html?login=1") ||
  (domain === "https://app.jobvite.com/admin/tracking/loginas.html") ||
  (domain === "https://app.jvistg2.com/admin/tracking/loginas.html?login=1")
  || (domain === "https://app.jvistg2.com/admin/tracking/loginas.html")) {
  // We are good, nothing to do.
} else {
  alert("Not logged in on 'Login As User' page, please try again!");
  throw new Error("Jobvite Employee: Not on LIA page.");
}

var storedLegal = chrome.storage.sync.get('newStorage', function (items) {
    console.log(items);
    // Make sure they Accepted before you can Login As
    var Accept = items.newStorage.src_accept;
    var Case_Type = items.newStorage.src_record;
    if (Accept === "Accept" || Case_Type === "Account Management") {
      // They accepted so do your thing
      // Set IDs
      $('input[placeholder="Enter email *"]').attr('id', 'email')
      $('textarea[placeholder="Reason *"]').attr('id', 'reason')
      $('input[placeholder="Ticket ID *"]').attr('id', 'case')
      $('select[ng-model="ticketingSystem"]').attr('id', 'ticket')
      $('button[ng-click="post()"]').attr('id', 'submit')

      //Set values and set inputs
      //Email address
      document.getElementById('email').value = items.newStorage.src_email;
      document.querySelector('[id="email"]').dispatchEvent(new Event("input", { bubbles: true }));
      //Case number
      document.getElementById('case').value = items.newStorage.src_case;
      document.querySelector('[id="case"]').dispatchEvent(new Event("input", { bubbles: true }));
      // Reason for LIA
      document.getElementById('reason').value = items.newStorage.src_description;
      document.querySelector('[id="reason"]').dispatchEvent(new Event("input", { bubbles: true }));
      // Ticket (Salesforce, Jira or Other)
      document.getElementById('ticket').value = "Salesforce";
      document.querySelector('[id="ticket"]').dispatchEvent(new Event("change", { bubbles: true }));

      flash('Process has completed.', {
        // background color
        'bgColor' : 'black',
        // bottom or 'top'
        'vPosition' : 'top',
        // text color
        'ftColor' : '#fdb914',
        // right or 'left'
        'hPosition' : 'right'
      });

      chrome.storage.sync.get({
        auto_login: false
        }, function(item) {
        var login = item.auto_login;
        if (login) {
          // Auto login enabled
          document.getElementById('submit').click();
        }
      });
  } else {
    alert("User has not Accepted! Please gain acceptance to Login As then try again.");
  }
  });
