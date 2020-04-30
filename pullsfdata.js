var domain = window.location.href;
var email_address;
var login_accepted;
var customer_name;
var record_type;
var case_number;
var grabCase;
var full_description;
var account_name;
var case_description;
window.addEventListener ("load", myMain, false);

function myMain (evt) {
  var jsInitChecktimer = setInterval (checkForJS_Finish, 111);
  function checkForJS_Finish () {
    if (document.querySelector ('.mdp .uiOutputText')) {
      clearInterval (jsInitChecktimer);
      if (!domain.includes('lightning')) {
        // Not on a SF lightning domain
        throw new Error("Jobvite Employee: Please ignore.");
      } else if (domain.includes('force')) {
        // Check to see if we are good to run
        var run = localStorage.getItem("lightningRefresh");
        if (run === "false") {
          // We are done here
          localStorage.setItem("lightningRefresh", "false");
        } else {
          // Reset our run variable
          localStorage.setItem("lightningRefresh", "false");
          // Pull all our variables
          email_address = getData('.emailuiFormattedEmail');
          login_accepted = getData('.forcePageBlockSectionRow:nth-child(16) .forcePageBlockItemView+ .forcePageBlockItemView .slds-form-element__static span');
          customer_name = getData('.mdp .uiOutputText');
          record_type = getData('.slds-grow.slds-truncate span');
          case_number = getData('.is-read-only .uiOutputText');
          grabCase = getData('.uiOutputTextArea a');
          full_description = getData('.forcePageBlockSectionView+ .forcePageBlockSectionView .slds-form-element_edit .uiOutputTextArea');
          account_name = getData('.forcePageBlockSectionRow+ .forcePageBlockSectionRow .slds-form-element_edit .forceOutputLookupWithPreview');
          case_description = getData('lightning-formatted-text');
          // Remove all the HTML formatting
          account_name = account_name.replace(/<[^>]*>?/gm, '');

          if (login_accepted === "Accept" || record_type === "Account Management") {
            pullMethod();
          } else {
            var a = confirm("'Login As' permission has not been accepted, do you wish to proceed?");
            if (a == true) {
              pullMethod();
            } else {
              throw new Error("Jobvite Employee: No Acceptance cancelation.");
            }
          }
        }
      }
    }
  }
}

function copyToClipboard(text) {
  window.prompt("Copy to clipboard: Ctrl+C or Command+C, Enter", text);
}

function pullTime() {
  // For not resetting time, need to preserve current Data
  chrome.storage.sync.get('newStorage', function(items) {
    try {
      var time = items.newStorage.src_time;
      saveData(time);
    } catch(e) {
      var time = "undefined";
      console.log("Jobvite Employee: Time Failure: " + e);
      saveData(time);
    }
  });
}

function checkForError (console) {
  try {
    // Success
    if (console === "True") {
      email_address = $('iframe').contents().find('#cas10_ileinner').clone().text();
    } else email_address = $('[id="cas10_ileinner"]').clone().text();
    if (email_address) {
      // All good, data is available
    } else {
      // No Data in variables
      throw new Error("Jobvite Employee: No Email");
    }
  } catch (e) {
    // Failed
    alert("Email address not found! Please ensure you have a valid case type loaded! " +
    "If you receive this error with a valid case in Salesforce, please try " +
    "refreshing the page and then try 'SOURCE SFDC' once more.");
    throw new Error("Jobvite Employee: No Email.");
  }
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

function getData (selector) {
  try {
    var firstAnswer = document.querySelector(selector);
    var inner = firstAnswer.innerHTML;
    return inner;
  } catch (e) {
    console.log('Invalid selector: ' + selector);
  }
}

function pullMethod() {
  var storedLegal = chrome.storage.sync.get('method', function (items) {
    try {
      options = items.method;
      console.log("Options: " + options);
      // option 1 = Copy for Slack, option 2 = Copy for Jira,
      // option 3 = neither checked
      switch(options) {
        case 1:
          // Copy for Slack
          pullTime();
          // Copy to clipboard for adding to Slack
          var line = "\n";
          var template = "@here Assistance requested:" + line + "URL: " +
          grabCase + line + "Login As: " + email_address + line +
          "Description: " + full_description;
          copyToClipboard(template);
          makeFlash('Case: ' + case_number + ' recorded and copied to clipboard for Slack.');
        break;
        case 2:
          pullTime();
          // Copy to clipboard for adding to existing Jira
          var line = "\n\n";
          if (login_accepted === "Accept") {
            var isaccepted = "Y";
          } else {
            var isaccepted = "N";
          }
          var template = "Adding for tracking: " + line +
          "Account Name: " + account_name + line + "Reported by: " +
          customer_name + line + "Login As: " + email_address + line +
          "Customer approval to login as them has been granted Y/N: " + isaccepted + line +
          "Salesforce Case #: " + case_number + line + "Link to case: " + grabCase;
          copyToClipboard(template);
          makeFlash('Case: ' + case_number + ' recorded and copied to clipboard for Jira.');
        break;
        case 3:
          pullTime();
          makeFlash('Case: ' + case_number + ' recorded.');
        break;
      }
    } catch(e) {
      options = 3; // Default value
      console.log("No Options: " + e);
      pullTime();
      makeFlash('Case: ' + case_number + ' recorded.');
    }
  });
}

function saveData(time) {
  console.log("Jobvite Employee: SFDC Source Ran.");
  console.log("Domain: " + domain);
  console.log("Email: " + email_address);
  console.log("Case Number: " + case_number);
  console.log("Case Description: " + case_description);
  console.log("Customer Name: " + customer_name);
  console.log("Account Name: " + account_name);
  console.log("Full Description: " + full_description);
  console.log("Login Accepted/Denied: " + login_accepted);
  console.log("Record Type: " + record_type);
  console.log("Time: " + time);
  console.log("Link to case: " + grabCase);
  // Change the tab text to show data was copied
  document.title = "Copied: " + case_number;

  var storArray = {
      src_email: email_address,
      src_case: case_number,
      src_description: case_description,
      src_customer: customer_name,
      src_account: account_name,
      src_fulldescription: full_description,
      src_accept: login_accepted,
      first_run: true,
      src_record: record_type,
      src_time: time
  };

  chrome.storage.sync.set({
      'newStorage': storArray
  });
}
