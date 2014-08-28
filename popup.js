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
    $scope.loadTicket = function(){
      chromeMessenger.requestTicketData(function(response){
        $scope.$apply(function(){
          $scope.jiraTicket = response.jiraTicket;
          $scope.jiraTicket.title = response.jiraTicket.title.trim();
        });
      })
    };
  }]);
