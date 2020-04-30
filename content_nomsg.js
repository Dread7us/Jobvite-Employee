// This class is to pull data out of SFDC
// Color and font information:
// Official Jobvite Orange: #ebb913
// Light Orange: #fdb914
// Darker Orange: #f8a526
// New Blue: #31469e
// Font: Tantramanav (for the icon creator app)
// Font: Founders Grotesk (for Jobvite)
// Old color info (both shades of blue):
// background-color: #0390fc (also used in Toast)
// Hover color: #03cafc
var domain = window.location.href;
var options;

if (!domain.includes('lightning') && !domain.includes('salesforce')) {
  alert("Not on SFDC, please try again!");
  throw new Error("Jobvite Employee: Not on SFDC.");
} else if (domain.includes('lightning.force')) {
  var which = document.querySelector('.slds-context-bar__app-name .slds-truncate').innerHTML;
  if (which === "Service Console") {
    if (document.querySelector ('.mdp .uiOutputText')) {
      // We can see a valid field, continue with the refreshing
      // Get saved variable to see if we are going to do a refresh or not
      // also check if we will do a confirmation for refresh
      chrome.storage.sync.get({
        lightning_refresh: false,
        lightning_confirmation: false
        }, function(item) {
        var refresh = item.lightning_refresh;
        var lConf = item.lightning_confirmation;
        if (!refresh) {
          // Refresh Lightning enabled
          if (lConf) {
            // No confirmation refresh
            localStorage.setItem("lightningRefresh", "true");
            window.location.reload();
          } else {
            // Confirmation first then refresh
            var r = confirm("Salesforce Lightning must be refreshed to pull your active case details. " +
            "Please ensure you are on the correct case tab then press OK to continue. The page will " +
            "refresh then automatically capture the case details.");
            if (r == true) {
              localStorage.setItem("lightningRefresh", "true");
              window.location.reload();
            } else {
              localStorage.setItem("lightningRefresh", "false");
              throw new Error("Jobvite Employee: Need to refresh.");
            }
          }
        } else {
          // No refresh
          email_address = getData('.emailuiFormattedEmail');
          customer_name = getData('.mdp .uiOutputText');
          record_type = getData('.slds-grow.slds-truncate span');
          case_number = getData('.is-read-only .uiOutputText');
          login_accepted = getData('.forcePageBlockSectionRow:nth-child(16) .forcePageBlockItemView+ .forcePageBlockItemView .slds-form-element__static span');
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
      });
    } else {
      // Valid field not found
      alert("Active case not found! Contact email was not detected, please ensure a " +
      "properly filled out case is open and then try again. If you are receiving this " +
      "message and a case is open, please ensure it contains all the proper data (Account Name, " +
      "Email Address, Description, etc.) and that you are in the 'Service Console'");
    }
  } else if (which === "Service") {
    // Regular service do this
    alert("Not currently compatible with Lightning Service!");
    /*email_address = getData('.emailuiFormattedEmail');
    login_accepted = getData('.hover .slds-grow span');
    customer_name = getData('.outputLookupLink-0033A00002VdOC7QAN-1489\:2204\;a');
    record_type = getData('.slds-grow.slds-truncate span');
    case_number = getData('.slds-form-element__static.slds-truncate .uiOutputText');
    grabCase = getData('.uiOutputTextArea a');
    full_description = getData('.forcePageBlockSectionView+ .forcePageBlockSectionView .slds-form-element_edit .uiOutputTextArea');
    account_name = getData('.outputLookupLink-0013A00001gDrbAQAS-1557\:2204\;a');
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
    }*/
  }
} else if (domain.includes('console') || domain.includes('servicedesk')) {
  // Salesforce Classic within a Console
  var email_address;
  checkForError("True");
  var grabCase = $('iframe').contents().find('#00N3000000C1igR_ileinner').clone().text();
  var record_type = $('iframe').contents().find('#RecordType_ileinner').clone().text().trim().slice(0,-9);
  var case_description = $('iframe').contents().find('#cas14_ileinner').clone().text();
  if (record_type === "Account Management") {
    var case_number = $('iframe').contents().find('#cas2_ileinner').clone().text();
  } else {
    var case_number = $('iframe').contents().find('#cas2_ileinner').clone().text().trim().slice(0,-17);
  }
  var customer_name = $('iframe').contents().find('#cas3_ileinner').clone().text();
  var account_name = $('iframe').contents().find('#cas4_ileinner').clone().text();
  var full_description = $('iframe').contents().find('#cas15_ileinner').clone().text();
  var login_accepted = $('iframe').contents().find('#00N3A00000D5IVP_ileinner').clone().text();
  // Check if case number has more than standard 8 chars (this tells us if there is one or more active tabs)
  if (case_number.length > 8) {
    var r = confirm("Too many Active tabs, press Ok to refresh. Once the page has finished reloading, " +
    "please try 'SOURCE SFDC' again.");
    if (r == true) {
      window.location.reload();
    } else {
      throw new Error("Jobvite Employee: Too many active tabs, need to refresh.");
    }
  } else {
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
} else {
  // Get the data into our variables
  // This is for case outside of the console
  var email_address;
  checkForError("False");
  var grabCase = $('[id="00N3000000C1igR_ileinner"]').clone().text();
  var record_type = $('[id="RecordType_ileinner"]').clone().text().trim().slice(0,-9);
  var case_description = $('[id="cas14_ileinner"]').clone().text();
  if (record_type === "Account Management") {
    var case_number = $('[id="cas2_ileinner"]').clone().text();
  } else {
    var case_number = $('[id="cas2_ileinner"]').clone().text().trim().slice(0,-17);
  }
  var customer_name = $('[id="cas3_ileinner"]').clone().text();
  var account_name = $('[id="cas4_ileinner"]').clone().text();
  var full_description = $('[id="cas15_ileinner"]').clone().text();
  var login_accepted = $('[id="00N3A00000D5IVP_ileinner"]').clone().text();
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

function getData (selector) {
  try {
    var firstAnswer = document.querySelector(selector);
    var inner = firstAnswer.innerHTML;
    return inner;
  } catch (e) {
    console.log('Invalid selector: ' + selector);
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

function copyToClipboard(text) {
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
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
