// Saves options to chrome.storage
function save_options() {
  var D_email = document.getElementById('email').value;
  var D_case = document.getElementById('case').value;
  var D_reason = document.getElementById('reason').value;
  var D_login = document.getElementById('auto_login').checked;
  var confirmReset = document.getElementById('reset_timer_confirmation').checked;
  var lRefresh = document.getElementById('lightning_refresh').checked;
  var lConfirmation = document.getElementById('lightning_confirmation').checked;
  var defect_Confirmation = document.getElementById('auto_defect').checked;
  var P_jira = document.getElementById('jira').value;
  var P_priority = document.getElementById('priority').value;
  var P_verbiage = document.getElementById('verbiage').value;
  var T_consult = document.getElementById('consult').checked;
  var T_consult_only = document.getElementById('consult_only').checked;
  chrome.storage.sync.set({
    demo_email: D_email,
    demo_case: D_case,
    demo_reason: D_reason,
    auto_login: D_login,
    confirm_reset: confirmReset,
    lightning_refresh: lRefresh,
    lightning_confirmation: lConfirmation,
    p1_jira: P_jira,
    p1_priority: P_priority,
    p1_verbiage: P_verbiage,
    defect_confirmation: defect_Confirmation,
    consult: T_consult,
    consult_only: T_consult_only
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
      window.close();
    }, 950);
  });
}

const checkbox1 = document.getElementById('consult');
checkbox1.addEventListener('change', (event) => {
	var consult = document.getElementById("consult");
  var consult_only = document.getElementById("consult_only");
  if (consult.checked) {
    consult_only.checked = false;
  }
});

const checkbox2 = document.getElementById('consult_only');
checkbox2.addEventListener('change', (event) => {
	var consult = document.getElementById("consult");
  var consult_only = document.getElementById("consult_only");
  if (consult_only.checked) {
    consult.checked = false;
  }
});

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    demo_email: '',
    demo_case: '',
    demo_reason: '',
    auto_login: false,
    confirm_reset: false,
    lightning_refresh: false,
    lightning_confirmation: false,
    p1_jira: '',
    p1_priority: 'P1',
    p1_verbiage: '',
    defect_confirmation: false,
    consult: false,
    consult_only: false
  }, function(items) {
    document.getElementById('email').value = items.demo_email;
    document.getElementById('case').value = items.demo_case;
    document.getElementById('reason').value = items.demo_reason;
    document.getElementById('auto_login').checked = items.auto_login;
    document.getElementById('reset_timer_confirmation').checked = items.confirm_reset;
    document.getElementById('lightning_refresh').checked = items.lightning_refresh;
    document.getElementById('lightning_confirmation').checked = items.lightning_confirmation;
    document.getElementById('auto_defect').checked = items.defect_confirmation;
    document.getElementById('jira').value = items.p1_jira;
    document.getElementById('priority').value = items.p1_priority;
    document.getElementById('verbiage').value = items.p1_verbiage;
    document.getElementById('consult').checked = items.consult;
    document.getElementById('consult_only').checked = items.consult_only;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
