chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.type){
    case "ticket-data":
      var idEl = document.getElementById('key-val');
      var titleEl = document.getElementById('summary-val');
      sendResponse({
        jiraTicket: {
          id: idEl.dataset.issueKey,
          title: titleEl.textContent
        }
      })
      break;
  };
});
