// This class to add data to Jira Task
var domain = window.location.href;

if (!domain.includes('jobvite.atlassian.net')) {
  alert("Not on jobvite.atlassian.net, please try again!");
  throw new Error("Jobvite Employee: Not on Jira.");
}

if (domain.includes('wiki')) {
  alert("Need to be on a Jira page!");
  throw new Error("Jobvite Employee: Not on a KB page.");
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
        var template = "*Overview of Task Request:* " + fullDescription + spaces + "*Account Name:* " +
        account + spaces + "*Customer Name/Reported By:* " + name + spaces + "*SalesForce Case#:* " +
        case1 + spaces + "REQUIRED *”Is this a task” checked off in SFDC (SFDC: Task Requests)* = Y/N" +
        spaces + "REQUIRED *Checked what can & cannot get pulled list (Tasks: What Can & Cannot Get Pulled) "
        + "before filing this request* = Y/N" + spaces + "*Steps to get to area of request:*" + spaces +
        "Customer approval to login as them has been granted Y/N: " + Accepted + spaces +
        "Login As: " + email + "\n" + "Go to: " + spaces + "*Screenshots and/or Videos:* " + spaces +
        "*Files/attachments used:* " + spaces + "*Comments/Instructions for Task Team:* " + spaces +
        "*Additional Info/Comments:* ";

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
        if (type === "Task - CS") {
          // We have the right type, nothing to do
        } else {
          // Select the correct Project
          document.getElementById('issuetype-field').value = "Task - CS";
          document.querySelector('[id="issuetype-field"]').dispatchEvent(new Event("input", { bubbles: true }));
        }

        // Add the customer name to the Jira
        document.getElementById('customfield_11600').value = account;
        document.querySelector('[id="customfield_11600"]').dispatchEvent(new Event("input", { bubbles: true }));
    }, 3000);


  });
