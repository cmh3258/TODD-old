
angular.module("MenuApp")

//http main call
.controller('moderatorCtrl', ['$scope', '$http', 'AuthenticationService', 'ApiCalls', function($scope, $http, AuthenticationService, ApiCalls){

    /*
    $scope.test = "test";

    $scope.clients = [];
    $scope.myClient = $scope.clients[0];
    $scope.reviews = []
    $scope.numReviews = 0


    var call = $http({
        method: 'GET',
        url: 'http://tranquil-plateau-8131.herokuapp.com/api/v1/companies/'
    })
    call.success(function (data, status, headers, config) {
        $scope.clients = data.objects;
    })
    call.error(function (data, status, headers, config){
        alert("ERROR WITH STATUS "+ status)
    });

    $scope.selectClient = function(client){
        $scope.loading = "Loading...";
        console.log("In select");

        if (typeof client != 'undefined'){
            var getReviewsCall = $http({
                method: 'GET',
                url: 'http://tranquil-plateau-8131.herokuapp.com/api/v1/recommendations/?entry__section__menu__company=' + client.id + '&checked=0'
            })
            getReviewsCall.success(function (response, status, headers, config) {
                console.log("in success");
                $scope.loading = "Successfully loaded."
                $scope.reviews = response.objects;
                console.log(response.objects);
                $scope.numReviews = response.meta.total_count
            })
            getReviewsCall.error(function (data, status, headers, config){
                alert("ERROR in getting reviews with status: "+ status);
            });
        }
        */
    $scope.setUpModerator = function(){
        $scope.test = "test";

        $scope.clients = [];
        $scope.myClient = $scope.clients[0]
        $scope.reviews = []
        $scope.numReviews = 0
        $scope.needsLoadMore = false
        $scope.nextReviewsURL = ""

        console.log('auth: ', AuthenticationService.token)

        var call = $http({
            method: 'GET',
            url: 'http://recommenu-test-api.herokuapp.com/companies/',
            headers: {'content-type': 'application/json', 'Authorization': 'Token '+ AuthenticationService.token}    
        })
        call.success(function (data, status, headers, config) {
            $scope.clients = data.results;
        })
        call.error(function (data, status, headers, config){
            alert("ERROR WITH STATUS "+ status)
        });
    }

    /*
     *  Getting authorization
     */
    $scope.getAuth2 = function(){
        alert('hi')
        ApiCalls.requestAuth()
            .success(function (c) {
                //alert('c: ', c)
                //$scope.clients = c.results[0].sections;
                //$scope.mainLoadComplete = true;       
                console.log("success (2)getAuth: ",c);
                //$scope.loadMenu();
                //$http.defaults.headers.common['auth-token'] = c.token;
                $scope.setUpModerator();

            })
            .error(function(error){
                console.log('error: ', error.message)
            });
    }   

    $scope.selectClient = function(client){
        $scope.loading = "Loading...";

        if (typeof client != 'undefined'){
            var getReviewsCall = $http({
                method: 'GET',
                url: 'http://recommenu-test-api.herokuapp.com/recommendations/?entry__section__menu__company=' + client.id + '&checked=False',
                headers: {'content-type': 'application/json', 'Authorization': 'Token '+ AuthenticationService.token}    
            })
            getReviewsCall.success(function (response, status, headers, config) {
                    console.log(response)
                    $scope.loading = "Successfully loaded."
                    $scope.reviews = response.results
                    $scope.numReviews = response.count
                    if (response.count > 15) {
                        $scope.needsLoadMore = true
                        $scope.nextReviewsURL = response.next
                    }
            })
            getReviewsCall.error(function (data, status, headers, config){
                alert("ERROR in getting reviews with status: "+ status);
            });
        }
    }
    /*
    $scope.approve = function(review){
        var approveCall = $http({
            method: 'PATCH',
            url: 'http://tranquil-plateau-8131.herokuapp.com/api/v1/recommendations/' + review.id + '/' ,
            data: JSON.stringify({approved: 1, checked: 1})
        })
        approveCall.success(function (data, status, headers, config) {
            removeReview(review);
            $scope.numReviews--;
        })
        approveCall.error(function (data, status, headers, config){
            alert("ERROR REMOVING REVIEW WITH STATUS: "+ status)
        });
    }

    $scope.deny = function(review){   
        var denyCall = $http({
            method: 'PATCH',
            url: 'http://tranquil-plateau-8131.herokuapp.com/api/v1/recommendations/' + review.id + '/',
            data: JSON.stringify({approved: 0, checked: 1})
        })
        denyCall.success(function (data, status, headers, config) {
            removeReview(review);
            $scope.numReviews--;
        })
        denyCall.error(function (data, status, headers, config){
            alert("ERROR REMOVING REVIEW WITH STATUS: "+ status)
        });     
    }

    var removeReview = function(review) {
        for (var index in $scope.reviews) {
            if ($scope.reviews[index].id === review.id) {
                $scope.reviews.splice(index,1);
                return true;
            }
        }
        alert("ERROR review ID could not be found");
        return false;
    }
    */

    $scope.loadMore = function(review) {
        var loadMoreCall = $http({
            method: 'GET',
            url: $scope.nextReviewsURL,
            headers: {'content-type': 'application/json', 'Authorization': 'Token '+ AuthenticationService.token}    
        })
        loadMoreCall.success(function (response, status, headers, config) {
            $scope.reviews = $scope.reviews.concat(response.results)
            if ($scope.numReviews - $scope.reviews.length > 0) {
                $scope.needsLoadMore = true
                $scope.nextReviewsURL = response.next
            }
            else {
                $scope.needsLoadMore = false
            }
        })
        loadMoreCall.error(function (response, status, headers, config){
            alert("ERROR GETTING MORE REVIEWS WITH STATUS: "+ status)
        })
    }

    $scope.approve = function(review){
        var approveCall = $http({
            method: 'PATCH',
            url: 'http://recommenu-test-api.herokuapp.com/recommendations/' + review.id + '/' ,
            data: JSON.stringify({approved: 1, checked: 1}),
            headers: {'content-type': 'application/json', 'Authorization': 'Token '+ AuthenticationService.token}    
        })
        approveCall.success(function (data, status, headers, config) {
            removeReview(review);
            $scope.numReviews--;
        })
        approveCall.error(function (data, status, headers, config){
            alert("ERROR REMOVING REVIEW WITH STATUS: "+ status)
        });
    }

    $scope.deny = function(review){   
        var denyCall = $http({
            method: 'PATCH',
            url: 'http://recommenu-test-api.herokuapp.com/recommendations/' + review.id + '/',
            data: JSON.stringify({approved: 0, checked: 1}),
            headers: {'content-type': 'application/json', 'Authorization': 'Token '+ AuthenticationService.token}    
        })
        denyCall.success(function (data, status, headers, config) {

            removeReview(review);
            $scope.numReviews--;
        })
        denyCall.error(function (data, status, headers, config){
            alert("ERROR REMOVING REVIEW WITH STATUS: "+ status)
        });     
    }

    var removeReview = function(review) {
        for (var index in $scope.reviews) {
            if ($scope.reviews[index].id === review.id) {
                $scope.reviews.splice(index,1);
                return true;
            }
        }
        alert("ERROR review ID could not be found");
        return false;
    }
}]);