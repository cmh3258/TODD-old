
//angular.module('MenuApp', ['angulartics', 'angulartics.google.analytics'])

angular.module('CoupleList', ['ui.router', 'ui.bootstrap', 'angulartics.google.analytics', 'ngFlowGrid'])

/*
 * Configure application
 * 
.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        
        .state('home', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'loginCtrl'
        })
        
        .state('dashboard', {
            url: '/menu',
            templateUrl: 'templates/dashboard.html',
            controller: 'MainCtrl',
            resolve:{
                 auth: ["$q", "AuthenticationService", function($q, AuthenticationService){
                    //console.log("in auth");
                    var us = AuthenticationService.isLogged;
                    //console.log("isLogged:",us);
                    if(us){
                        console.log("Should pass to dashboard");
                    }
                    else{
                        console.log("Should Reject");
                        //$state.go('home');
                    }
                 }]

            }
            /*
            resolve: {
                auth: ["$q", "AuthenticationService", function($q, AuthenticationService){
                    var userInfo = AuthenticationService.getAuth();
                    /*
                    if(!userInfo){
                        $state.go('home');
                    }
            
                    if (userInfo) {
                        return $q.when(userInfo);
                    } 
                    else {
                        return $q.reject({ authenticated: false });
                    }
                }]
            }*/
            /*

        });

    $urlRouterProvider.otherwise('/menu');
        
})


/*
 *  Directive for each MENU ITEM
 *
.directive('menuItem', function(){
    return {
        restrict: 'AE',
        require: 'ngModel',
        scope: {
            ngModel: '@'
        },
        templateUrl: 'templates/menuitem.html',
        controller: 'menuItemTemplate',
    };

})

/*
 *  Directive for each MENU ITEM
 *
.directive('menuItemnew', function(){
    return {
        restrict: 'AE',
        require: 'ngModel',
        scope:  { obje: '='}
        ,
        templateUrl: 'templates/menuitemnew.html',
        controller: 'menuItemTemplateNew',
    };

})

/*
 *  Directive for the pop up to READ a review
 *
.directive('readPopup', function(){
    return {
        restrict: 'AE',
        require: 'ngModel',
        scope: {
            ngModel: '@'
        },
        templateUrl: 'templates/readreview.html',
        controller: 'readReview',
    };

})

/*
 *  Directive for the pop up to WRITE a review
 *
.directive('writePopup', function(){
    return {
        restrict: 'AE',
        require: 'ngModel',
        scope: {
            ngModel: '@'
        },
        templateUrl: 'templates/writereview2.html',
        controller: 'writeReview',
    };

})
*/  

