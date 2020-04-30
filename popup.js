// Code to check if there is an update
chrome.runtime.onUpdateAvailable.addListener(function(details) {
  console.log("Jobvite Employee: updating to version " + details.version);
  chrome.runtime.reload();
});

chrome.runtime.requestUpdateCheck(function(status) {
  if (status == "update_available") {
    console.log("update pending...");
  } else if (status == "no_update") {
    console.log("no update found");
  } else if (status == "throttled") {
    console.log("Oops, I'm asking too frequently - I need to back off.");
  }
});

function doContent(){
	if (document.getElementById("clip_board_slack").checked) {
		// Only copy to slack is checked
	 	var setMethod = 1;
	}

	if (document.getElementById("clip_board").checked) {
		// Only clipboard is checked
		var setMethod = 2;
	}

	if (!(document.getElementById("clip_board_slack").checked) &&
		!(document.getElementById("clip_board").checked)) {
		// Neither option is checked
		var setMethod = 3;
	}

	chrome.storage.sync.set({
	    'method': setMethod
	});
	window.close();
	chrome.tabs.executeScript(null, {file: "content_nomsg.js"});
};

function resetTimer(){
	window.close();
	chrome.tabs.executeScript(null, {file: "reset_timer.js"});
};

function doTargetLIA(){
	window.close();
	chrome.tabs.executeScript(null, {file: "content2.js"});
};

function doTargetJIRA(){
	window.close();
	chrome.tabs.executeScript(null, {file: "content3.js"});
};

function doTargetTASK(){
	window.close();
	chrome.tabs.executeScript(null, {file: "content4.js"});
};

function demoLogin(){
	window.close();
	chrome.tabs.executeScript(null, {file: "demologin.js"});
};

function doTargetTIME(){
	window.close();
	chrome.tabs.executeScript(null, {file: "content5.js"});
};

function noData(){
	window.close();
	alert("No Data! Please parse source data from SFDC to proceed.")
}

function p1Process(){
  window.close();
  chrome.tabs.executeScript(null, {file: "p1process.js"});
}

// Save changes to the check mark boxes
const checkbox1 = document.getElementById('clip_board');
checkbox1.addEventListener('change', (event) => {
	var clipCheck = document.getElementById("clip_board");
  var clipSlack = document.getElementById("clip_board_slack");
  if (clipSlack.checked) {
    clipSlack.checked = false;
  }
 	localStorage.setItem("clip_board", clipCheck.checked);
  localStorage.setItem("clip_board_slack", clipSlack.checked);
});

// Save changes to the check mark boxes
const checkbox2 = document.getElementById('clip_board_slack');
checkbox2.addEventListener('change', (event) => {
	var clipSlack = document.getElementById("clip_board_slack");
  var clipCheck = document.getElementById("clip_board");
  if (clipCheck.checked) {
    clipCheck.checked = false;
  }
 	localStorage.setItem("clip_board_slack", clipSlack.checked);
  localStorage.setItem("clip_board", clipCheck.checked);
});

function pullCheckmarks() {
	var clipCheck = document.getElementById("clip_board");
  var clipSlack = document.getElementById("clip_board_slack");
	clipCheck.checked = (localStorage.getItem("clip_board")=="true");
  clipSlack.checked = (localStorage.getItem("clip_board_slack")=="true");
}

function createSave() {
	var clipCheck = document.getElementById("clip_board");
  var clipSlack = document.getElementById("clip_board_slack");
	localStorage.setItem("clip_board", clipCheck.checked);
  localStorage.setItem("clip_board_slack", clipCheck.checked);
}

var link = document.getElementById("help");
link.addEventListener("click", function(){
  var newURL = "https://jobvite.atlassian.net/wiki/spaces/CSSUP/pages/610566197/Jobvite+Employee+Login+As+Jira+Extension";
  chrome.tabs.create({ url: newURL });
}, false);

var link1 = document.getElementById("settings");
link1.addEventListener("click", function(){
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
}, false);

chrome.storage.sync.get('newStorage', function(items) {
	var declared;
	try {
	  items.newStorage.first_run;
	  declared = true;
	} catch(e) {
	  declared = false;
	}

	if (declared) {
		document.getElementById("btnTargetLIA").onclick = doTargetLIA;
		document.getElementById("btnTargetJIRA").onclick = doTargetJIRA;
		document.getElementById("btnTargetTASK").onclick = doTargetTASK;
		document.getElementById("btnTargetTIME").onclick = doTargetTIME;
		document.getElementById("btnResetTIMER").onclick = resetTimer;
    document.getElementById("btnDemo").onclick = demoLogin;
    document.getElementById("btnP1").onclick = p1Process;
		var time = items.newStorage.src_time;
		var caseNumber = items.newStorage.src_case;
    if (time) {
      // Data is here, good to go
      var nowTime = new Date().getTime();
      var diff = (nowTime - time);
      var mins = Math.round(diff/1000/60);
			document.getElementById("showTime").innerHTML = mins + " MINS";
		} else {
			document.getElementById("showTime").innerHTML = "NOT SET";
		}
		if (caseNumber) {
			// Data is here, good to go
			document.getElementById("showCase").innerHTML = caseNumber;
		} else {
			document.getElementById("showCase").innerHTML = "NOT RECORDED";
		}
		pullCheckmarks();
	} else {
		document.getElementById("btnTargetLIA").onclick = noData;
		document.getElementById("btnTargetJIRA").onclick = noData;
		document.getElementById("btnTargetTASK").onclick = noData;
		document.getElementById("btnTargetTIME").onclick = noData;
		document.getElementById("btnResetTIMER").onclick = noData;
    document.getElementById("btnDemo").onclick = noData;
    document.getElementById("btnP1").onClick = noData;
		document.getElementById("showTime").innerHTML = "NOT SET";
		document.getElementById("showCase").innerHTML = "NOT RECORDED";
		createSave();
	}
});
document.getElementById("btnSource").onclick = doContent;
var version = chrome.app.getDetails().version;
document.getElementById("showVersion").innerHTML = version;
