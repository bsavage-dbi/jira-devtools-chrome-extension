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
      descriptionEl.value = request.content;
      break;
  };
});
