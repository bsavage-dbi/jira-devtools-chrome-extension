chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.type){
    case "redirect-to-jira-ticket":
      var titleEl = document.querySelectorAll('.js-issue-title')[0];
      sendResponse({
        githubPullRequest: {
          title: titleEl.textContent
        }
      });
      break;
    case 'fill-in-description':
      var editTriggerEl = document.querySelector('.js-comment-edit-button');
      var descriptionEl = document.querySelector('.js-comment-update .js-comment-field');
      editTriggerEl.click();
      descriptionEl.value = '## Status\n' +
                            '**READY**\n' +
                            '\n'+
                            '## Description\n' +
                            'A few sentences describing the overall goals of the pull request\'s commits.\n' +
                            '\n'+
                            '## Steps to Test or Reproduce\n' +
                            '1. Go to a route\n' +
                            '2. Click a thing\n' +
                            '3. Profit!!!\n' +
                            '\n'+
                            '## Impacted Areas in Application';
      break;
  };
});
