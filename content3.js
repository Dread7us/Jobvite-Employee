// This class to add data to Jira Bug
var domain = window.location.href;

if (!domain.includes('jobvite.atlassian.net')) {
  alert("Not on jobvite.atlassian.net, please try again!");
  throw new Error("Jobvite Employee: Not on Jira.");
}

if (domain.includes('wiki')) {
  alert("Need to be on a Jira page!");
  throw new Error("Jobvite Employee: On a KB page");
}

var storedLegal = chrome.storage.sync.get('newStorage', function (items) {
    console.log(items);
    // Declare variables
    const email = items.newStorage.src_email;
    const description = items.newStorage.src_description;
    const account = items.newStorage.src_account;
    const name = items.newStorage.src_customer;
    const case1 = items.newStorage.src_case;
    const fullDescription = items.newStorage.src_fulldescription;
    const accept = items.newStorage.src_accept;
    const spaces = "\n\n";
    // Click the button to input the ticket
    document.getElementById('createGlobalItem').click();

    setTimeout(function() {
        // Add the summary to the page, wait 3 seconds first to ensure it has loaded
        document.getElementById('summary').value = description;
        var Accepted = "";
        if (accept === "Accept") {
          Accepted = "Y";
        } else Accepted = "N";
        document.querySelector('[id="summary"]').dispatchEvent(new Event("input", { bubbles: true }));
        // Add the description to the Jira
        var template = "*Problem:* " + fullDescription + spaces + "*Expected Outcome:* " + spaces +
          "*Actual Outcome:* " + spaces + "*Additional Info/Comments:* " + spaces +
          "*Priority justification/explanation:* " + spaces + "*Account Name:* " + account + spaces +
          "*Customer Name/Reported By:* " + name + spaces + "*SalesForce Case#:* " + case1 + spaces +
          "*What Browser(s) have you tested this in:* " + spaces +
          "*Which environment is it raised (Staging, Production, QA)?* " + spaces + "*Reproduced In (Yes/No):* " +
          spaces + "*Staging = Y/N* " + spaces + "*Production = Y/N* " + spaces +
          "*Include Developer tool errors (Production) > Console view:* " + spaces +
          "*Include Developer tool errors (Staging) >Console view:* " + spaces +
          "*How many customers is it affecting:* " + spaces +
          "*CUSTOMER APPROVAL: Is it okay for Engineers to create a test Requisition in Production?" +
          'Please specify rules if necessary (i.e. "Yes, ensure title states "Jobvite Test")* ' +
          spaces + "*CUSTOMER APPROVAL: Is it okay for Engineers to create a test Candidate in Production? " +
          'Please specify rules if necessary (i.e. "Yes, ensure name states "Jobvite Test")* ' +
          spaces + "*Reproduction Steps:*" + spaces + "Customer approval to login as them has been granted Y/N: " +
          Accepted + spaces + "1. Login As: " + email + "\n" +
          "2. Go to: " + spaces + "*Including screencast screenshots or videos, Login as info* " +
          "(Always include the URL/Address Bar. Engineers use this information to identify " +
          "the Encrypted ID, which is included in the URL/Address Bar)." + spaces +
          "*Files/attachments used:* ";

        document.getElementById('description').value = template;
        document.querySelector('[id="description"]').dispatchEvent(new Event("input", { bubbles: true }));

        // Select the Project type
        var project = document.getElementById('project-field').value;
        if (project === "Support (SUPPORT)") {
          // We have the right project, nothing to do
        } else {
          // Select the correct Project
          document.getElementById('project-field').value = "Support (SUPPORT)";
          document.querySelector('[id="project-field"]').dispatchEvent(new Event("input", { bubbles: true }));
        }

        var type = document.getElementById('issuetype-field').value;
        if (type === "Defect - CS") {
          // We have the right type, nothing to do
        } else {
          // Select the correct Project
          document.getElementById('issuetype-field').value = "Defect - CS";
          document.querySelector('[id="issuetype-field"]').dispatchEvent(new Event("input", { bubbles: true }));
        }

        // Add the customer name to the Jira
        document.getElementById('customfield_11600').value = account;
        document.querySelector('[id="customfield_11600"]').dispatchEvent(new Event("input", { bubbles: true }));
    }, 3000);


  });
