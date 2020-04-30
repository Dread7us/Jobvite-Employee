// Class to reset the timer
var time = new Date().getTime();
chrome.storage.sync.get({
  confirm_reset: false
}, function(items) {
  var confirmation = items.confirm_reset;
  if(confirmation) {
    // Confirm before resetting
    var r = confirm("Are you sure you want to reset the timer?");
    if (r == true) {
      resetTheTimer();
    } else {
      flash('Timer reset canceled.', {
        // background color
        'bgColor' : 'black',
        // bottom or 'top'
        'vPosition' : 'top',
        // text color
        'ftColor' : '#fdb914',
        // right or 'left'
        'hPosition' : 'right'
      });
      throw new Error("Jobvite Employee: No consent to reset timer.");
    }
  } else {
    resetTheTimer();
  }
});

function resetTheTimer() {
  // Data exists, need to preserve
  chrome.storage.sync.get('newStorage', function(items) {
    if (typeof items.newStorage === 'undefined') {
      // No data, not setup
      time = "undefined";
    } else {
      var email_address = items.newStorage.src_email;
      var case_number = items.newStorage.src_case;
      var case_description = items.newStorage.src_description;
      var customer_name = items.newStorage.src_customer;
      var account_name = items.newStorage.src_account;
      var full_description = items.newStorage.src_fulldescription;
      var login_accepted = items.newStorage.src_accept;
      var record_type = items.newStorage.src_record;

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

      flash('Timer has been reset.', {
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
  });
}
