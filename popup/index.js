angular.module('JiraTicketApp', [])
  .service('ChromeTabMessenger', function(){
    var requestTicketData = function(callback){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "ticket-data" }, callback)
      });
    };
    var sendRedirectToJiraTicket = function(callback){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "redirect-to-jira-ticket" }, callback)
      });
    };
    return {
      requestTicketData: requestTicketData,
      sendRedirectToJiraTicket: sendRedirectToJiraTicket
    };
  })
  .directive('ngCopy', function(){
    return {
      restrict: 'A',
      link: function($scope, el, attrs){
        $('#' + attrs.ngCopy).click(function(e){
          el.select();
          document.execCommand('copy');
        });
      }
    };
  })
  .filter('brancherize', function(){
    return function(input){
      if(input === undefined) return '';
      var str = input.replace(/\s/g, '-');
      if(str.slice(-1) === '.')
        str = str.slice(0, -1)
      return str
    };
  })
  .controller('JiraTicketController', ['$scope', 'ChromeTabMessenger', function($scope, chromeMessenger) {
    $scope.jiraTicket = {};
    $scope.loadTicket = function(){
      chromeMessenger.requestTicketData(function(response){
        $scope.$apply($scope.newJiraTicket(response.jiraTicket));
      })
    };

    $scope.newJiraTicket = function(jiraTicket){
      $scope.jiraTicket = jiraTicket;
      $scope.jiraTicket.title = jiraTicket.title.trim();
    };
  }])
  .controller('GithubPullRequestController', ['$scope', 'ChromeTabMessenger', function($scope, chromeMessenger) {
    $scope.goToJira= function(){
      chromeMessenger.sendRedirectToJiraTicket(function(response){
        $scope.redirectToJira(response.githubPullRequest)
      });
    };

    $scope.redirectToJira = function(githubPullRequest){
      var jiraTicketId = githubPullRequest.title.match(/OA-\d+/)[0];
      var jiraTicketUrl = "http://onelogin2.atlassian.net/browse/" + jiraTicketId;
      chrome.tabs.create({ url: jiraTicketUrl });
    };
  }])
  .controller('JiraDevToolsController', ['$scope', function($scope) {
    $scope.availablePages = [
      '*://*.atlassian.net/browse/*',
      "*://github.com/*/pull/*"
    ];

    $scope.activeTab = {};

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      $scope.$apply(function(){
        $scope.activeTab = tabs[0];
      });
    });

    $scope.isJiraTicketPage = function(){
      return /[http|https]:\/\/.*\.atlassian\.net\/browse\/.*/.test($scope.activeTab.url);
    };

    $scope.isGithubPullRequestPage = function(){
      return /[http|https]:\/\/github\.com\/.*\/pull\/.*/.test($scope.activeTab.url);
    };

    $scope.isAvailablePage = function(){
      return $scope.isJiraTicketPage() || $scope.isGithubPullRequestPage();
    }
  }]);
