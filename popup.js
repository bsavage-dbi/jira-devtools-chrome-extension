angular.module('JiraTicketApp', [])
  .service('ChromeTabMessenger', function(){
    var requestTicketData = function(callback){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "ticket-data" }, callback)
      });
    };
    return {
      requestTicketData: requestTicketData
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
    $scope.controls = {
      availablePages: [
        '*://*.atlassian.net/browse/*',
      ]
    };
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      $scope.controls.activeTab = tabs[0];
    });

    $scope.loadTicket = function(){
      chromeMessenger.requestTicketData(function(response){
        $scope.$apply(function(){
          $scope.jiraTicket = response.jiraTicket;
          $scope.jiraTicket.title = response.jiraTicket.title.trim();
        });
      })
    };

    $scope.isJiraTicketPage = function(){
      return /[http|https]:\/\/.*\.atlassian\.net\/browse\/.*/.test($scope.activeTabUrl());
    };

    $scope.isAvailablePage = function(){
      return $scope.isJiraTicketPage()
    }

    $scope.availablePages = function(){
      return $scope.controls.availablePages;
    };

    $scope.activeTabUrl = function(){
      if($scope.controls.activeTab === undefined) return '';
      return $scope.controls.activeTab.url;
    };
  }]);
