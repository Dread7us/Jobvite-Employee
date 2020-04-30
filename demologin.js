// This class is to add data to LIA for demo account
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

chrome.storage.sync.get({
  demo_email: '',
  demo_case: '',
  demo_reason: ''
}, function(items) {
  console.log(items);
  // They accepted so do your thing
  // Set IDs
  $('input[placeholder="Enter email *"]').attr('id', 'email')
  $('textarea[placeholder="Reason *"]').attr('id', 'reason')
  $('input[placeholder="Ticket ID *"]').attr('id', 'case')
  $('select[ng-model="ticketingSystem"]').attr('id', 'ticket')
  $('button[ng-click="post()"]').attr('id', 'submit')

  //Set values and set inputs
  //Email address
  document.getElementById('email').value = items.demo_email;
  document.querySelector('[id="email"]').dispatchEvent(new Event("input", { bubbles: true }));
  //Case number
  document.getElementById('case').value = items.demo_case;
  document.querySelector('[id="case"]').dispatchEvent(new Event("input", { bubbles: true }));
  // Reason for LIA
  document.getElementById('reason').value = items.demo_reason;
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
    if(login) {
      // Auto login enabled
      document.getElementById('submit').click();
    }
  });
});
