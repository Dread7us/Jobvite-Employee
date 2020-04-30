// This class is for P1 process automation
var jira;
var priority;
var verbiage;
var confirmation;
var template;
var saved_case;

chrome.storage.sync.get({
  p1_jira: '',
  p1_priority: '',
  p1_verbiage: '',
  defect_confirmation: false
  }, function(item) {
  jira = item.p1_jira;
  priority = item.p1_priority;
  verbiage = item.p1_verbiage;
  confirmation = item.defect_confirmation;
  var storedLegal = chrome.storage.sync.get('newStorage', function (items) {
    console.log(items);
    // Get the saved account to compare it to current
    saved_case = items.newStorage.src_case;
  });

  if (jira && priority && verbiage) {
    // All data present, continue
    var storedLegal = chrome.storage.sync.get('newStorage', function (items) {
      var line = "\n\n";
      var name = items.newStorage.src_customer;
      // Give me just the first name
      name = name.split(" ")[0];

      template = "Hello " + name + "," + line + verbiage;

      switch (priority) {
        case "P1":
          priority = "Severity 1";
        break;
        case "P2":
          priority = "Severity 2";
        break;
        case "P3":
          priority = "Severity 3";
        break;
      }

      if (!domain.includes('lightning') && !domain.includes('salesforce')) {
        alert("Not on SFDC, please try again!");
        throw new Error("Jobvite Employee: Not on SFDC.");
      } else if (domain.includes('lightning.force')) {
        var a = confirm("DEFECT doesn't currently work with Lightning. " +
        "Press OK if you want to switch to SF Classic. From there, you will need " +
        "to click ‘Back to Jobvite Service Console’, find your case then try DEFECT again.");
        if (a == true) {
          document.querySelector('#oneHeader .circular').click();
          setTimeout(function() {
            document.querySelector('[class="profile-link-label switch-to-aloha uiOutputURL"]').click();
          }, 500);
        } else {
          throw new Error("Jobvite Employee: Lightning DEFECT cancelled.");
        }
        // Two belore are alternate way to edit
        //document.querySelector('.sldsButtonHeightFix').click();
        //document.querySelector('[title="Edit"]').click();
        //alert("Not currently available for Lightning.");
        //document.querySelector('.forcePageBlockSectionRow:nth-child(2) .forcePageBlockItemView+ .full lightning-primitive-icon').click();
        //waitForElementToDisplay('[class=" input"]', jira);
        //waitForElementToDisplay('.slds-hide+ .uiInput--select .select', priority);
        //waitForElementToDisplay('.slds-combobox__input', "Pending Engineering Response");
      } else if (domain.includes('console') || domain.includes('servicedesk')) {
        var record_type = $('iframe').contents().find('#RecordType_ileinner').clone().text().trim().slice(0,-9);
        if (record_type === "Account Management") {
          var case_number = $('iframe').contents().find('#cas2_ileinner').clone().text();
        } else {
          var case_number = $('iframe').contents().find('#cas2_ileinner').clone().text().trim().slice(0,-17);
        }
        if (saved_case === case_number) {
          // Case number matches, proceed
          SFClassic();
        } else if (case_number.length > 8) {
          // Check to see if SF case number is too long aka multiple mashed together
          var r = confirm("Too many Active tabs, press Ok to refresh. Once the page has finished reloading, " +
          "please try 'DEFECT' again (assuming you have already used 'SOURCE SFDC' on this case).");
          if (r == true) {
            window.location.reload();
          } else {
            throw new Error("Jobvite Employee: Too many active tabs, need to refresh.");
          }
        } else {
          alert("The saved case number " + "(" + saved_case + ")" + " does not match the case you currently have active " +
          "(" + case_number + "). " + "Please ensure you are on just one active case then try 'SOURCE SFDC' > 'DEFECT' again.");
        }
      }
    });
  } else {
    // Data is not present, do not continue
    alert("Missing required data! Please go into options and fill out the P1 PROCESS (DEFECT) data fields (priority, verbiage and Jira).");
    throw new Error("Jobvite Employee: No P1 Process Data.");
  }
});

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

function SFClassic () {
  // In SF Classic console
  $('iframe').contents().find('[value=" Edit "]').click();
  setTimeout(function() {
    $('iframe').contents().find('#00N3A00000DChhH').val(priority);
    $('iframe').contents().find('#cas7').val("Pending Engineering Response");
    $('iframe').contents().find('#00N30000002fPvv').val(jira);
    setTimeout(function() {
      $('iframe').contents().find('[value=" Save "]').click();
      setTimeout(function() {
        $('iframe').contents().find('[value=" New "]').click();
        setTimeout(function() {
          $('iframe').contents().find('#CommentBody').val(template);
          $('iframe').contents().find('#IsPublished').prop("checked", true);
          $('iframe').contents().find('#IsNotificationSelected').removeAttr("disabled");
          $('iframe').contents().find('#IsNotificationSelected').prop("checked", true);
          if (confirmation) {
            $('iframe').contents().find('[value=" Save "]').click();
          }
          setTimeout(function() {
            makeFlash ("Process has completed.");
          }, 3000);
        }, 3000);
      }, 7000);
    }, 1000);
  }, 3000);
}

function waitForElementToDisplay(selector, variable) {
  if (document.querySelector(selector) != null) {
    //var elementID = document.querySelector(selector).id;
    //document.getElementById(elementID).value = variable;
    //document.getElementById(elementID).onchange();
    document.querySelector(selector).value = variable;
    document.querySelector(selector).dispatchEvent(new Event("change", { bubbles: true }));
    return;
  } else {
    setTimeout(function() {
        waitForElementToDisplay(selector, variable);
    }, 3000);
  }
}
