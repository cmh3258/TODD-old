
var error_console = true
var base_url = "http://tranquil-plateau-8131.herokuapp.com/api/v1"
base_url = "http://recommenu-test-api.herokuapp.com"
base_url = "http://recommenu-staging-api.herokuapp.com"

//live production api
//base_url = "http://recommenu-production-api.herokuapp.com"
angular.module("MenuApp")

//angular.module('MenuApp', ['angulartics', 'angulartics.google.analytics'])


/*
 *	User authentication factory
 */
.factory('Auth', function($http, $window){

	return{
		//log in to the dashboard
        logIn : function(username, password){   

			var call = $http({
                method: 'POST',
                url: base_url+'/user/login/',
                data:  JSON.stringify({username: username, password: password})
            })
            call.success(function (data, status, headers, config) {
            	if(error_console)
                	console.log("deny call: success");
            })
            call.error(function (data, status, headers, config){
            	if(error_console)
                	console.log('deny call: error');
            });
            return call;     
		},	

		//logout the user 
		logout: function(){
			return;
		},

	}

})

//authentication
.factory('AuthenticationService', function() {
    var auth = {
        isLogged: false,
        token: 0
    };

    return auth;
})

/*
.factory('SocialService', function() {

//SocialService.storeSocialInfo(site, me);

	var socialObject = {}
	var loggedIn = false
	var authorizationResult = false
	return{
		
		storeSocialInfo : function(site, object){
			console.log("SS " ,object)
			socialObject = object
			loggedIn = true
			authorizationResult = OAuth.create('twitter')
			return loggedIn
		},

		hasLoggedIn : function(){
			return loggedIn
		},

		getObject : function(){
			return socialObject
		},

		isReady : function(){
			return authorizationResult
		}

    }
})
*/

/*
 *	Main function API calls
 */
.factory('ApiCalls',function($http, AuthenticationService)
{

	var menuInfo = {};
	var likeButtons = [];

	menuInfo.clients;
	menuInfo.menuLoaded;
	
	return{

		requestAuth: function(){
			var call = $http({
				method: 'POST',
				url: base_url+'/api-token-auth/',
				data: JSON.stringify({username:"chume", password:"chume"})
			})

			call.success(function (data, status, headers, config) {
            	if(error_console){
	            	console.log("successfully called requestAuth call()");
	            	console.log(data.token);
	            	console.log(data)
	            	//$http.defaults.headers.common['authorization'] = data.token;	
	        	}

	        	AuthenticationService.token = data.token
	            AuthenticationService.isLogged = true
	        })

	        call.error(function (data, status, headers, config){
	        	if(error_console)
	            	console.log("ERROR WITH STATUS "+ JSON.stringify(data))
				
	        });

	        return call;
		},

		//main call to get the whole menu
		menuCall : function(){

			var call = $http({
	            method: 'GET',
	            url: base_url+'/menus/?company=1'
	        })

	        call.success(function (data, status, headers, config) {
	        	if(error_console){
	            	console.log("successfully called mainCtrl call()");
	            	//console.log(data.objects[0].sections);
	            	console.log(data.results[0].sections)
	        	}
	        })

	        call.error(function (data, status, headers, config){
	        	if(error_console)
	            	alert("ERROR WITH STATUS "+ status)
	        });

	        return call;

		},

		//call to get ratings/reviews for a menu item
		getRatings : function(entryid){
        	var call = $http({
	            method: 'GET',
	            url: base_url+'/recommendations/?entry='+entryid
	        })

	        call.success(function (data, status, headers, config) {
            	if(error_console){	        	
	            	console.log("successfully called getRatings call()");
	            	console.log(response);
	            	console.log(status);
	            	console.log(headers);
	        	}
	        })

	        call.error(function (data, status, headers, config){
            	if(error_console){	        	
	            	alert("ERROR WITH STATUS "+ status)
	        	}
	        });

	        return call;

		},

		//call to save a user review
		saveReview : function(object){},

		//call to save a like on an item
		saveLike : function(current_score, id, itemid){
        

        //{"entry":["This field is required."],"brand_responses":["This field is required."],
        //"sliders":["This field is required."],"user":["This field is required."]}
        
	        var call = $http({
	            method: 'PATCH',
	            url: base_url+'/recommendations/'+ id +'/',
	            data:  JSON.stringify({score: current_score})
	        })

	        call.success(function (data, status, headers, config) {
            	if(error_console){
	            	console.log("successfully called likeButtonCall(): ", data);
	        	}
	        })

	        call.error(function (data, status, headers, config){
        	    if(error_console){
	            	console.log("(likeButton) ERROR WITH STATUS "+ JSON.stringify(data))
	        	}
	        });

	        return call;

	    }, 

	    loadMoreReviews: function(url){
	    	var call = $http({
	            method: 'GET',
	            url: url	        
	        })

	        call.success(function (data, status, headers, config) {
            	if(error_console){
	            	console.log("successfully called loadMoreReviews(): ", data);
	        	}
	        })

	        call.error(function (data, status, headers, config){
        	    if(error_console){
	            	console.log("(loadMoreReviews) ERROR WITH STATUS "+ JSON.stringify(data))
	        	}
	        });

	        return call;
	    }

	    
	}


})

/*
 * Twitter
 */
.factory('socialMediaService', function($q) {

    var authorizationResult = false;
    var facebookResult = false
    var twitterResult = false
    var data = {}
    var email = ""

    return {
        initialize: function() {
            //initialize OAuth.io with public key of the application
            OAuth.initialize('lJB1vBVbmDXwonAO3QzTGg-0CDE', {cache:true});
            //try to create an authorization result when the page loads, this means a returning user won't have to click the twitter button again
            twitterResult = OAuth.create('twitter');
            facebookResult = OAuth.create('facebook')
        },
        isReady: function() {
        	if(twitterResult || facebookResult)
        		authorizationResult = true
            return authorizationResult
        },
        saveReady : function(auth){	
        	authorizationResult = auth;
        },
        connectSocial: function(site) {
            //var deferred = $q.defer();
            //var done = {}
 			//console.log('site:',site)
            var call = OAuth.popup(site, {cache:false})
            
            call.fail(function(error){
                alert("newfail: ", error);
            });
            //var call = OAuth.popup(site)
        	return call
        },
        clearCache: function() {
            OAuth.clearCache('twitter');
            OAuth.clearCache('facebook');
            authorizationResult = false;
        },
        /*
        getLatestTweets: function () {
            //create a deferred object using Angular's $q service
            var deferred = $q.defer();
            var promise = authorizationResult.get('/1.1/statuses/home_timeline.json').done(function(data) { //https://dev.twitter.com/docs/api/1.1/get/statuses/home_timeline
                //when the data is retrieved resolved the deferred object
                deferred.resolve(data)
            });
            //return the promise of the deferred object
            return deferred.promise;
        },  
        */
        getData: function(){
        	return data
        }, 
        saveData: function(newe){
        	data = newe
        },
        saveEmail: function(emaile){
        	email = emaile
        },
        getEmail: function(){
        	return email
        }

    }
    
})

/* 
 * sharing the item between different controllers/templates/etc.
 */
.factory('mySharedService', function($rootScope) {
    var sharedService = {};
    
    sharedService.readit;
    sharedService.writeit;
    sharedService.item;

    //ROW = read or write
    sharedService.prepForBroadcast = function(read, write, item) {
        this.readit = read;
        this.writeit = write;
        this.item = item;
        this.broadcastItem();
    };

    sharedService.broadcastItem = function() {
        $rootScope.$broadcast('handleBroadcast');
    };

    return sharedService;
})

//saving menu item
.factory('SectionSave', function(){

	var companymenu = {}
	var sectionmen = {}
	var menuReg = {}
	return{
	
		getSection : function(x){
	    	return companymenu
    	},

    	getSect : function(){
    		return sectionmen
    	},

    	setSection : function(menu, section){
        	companymenu = menu;
        	sectionmen = section
    	},

    	setSectionReg: function(menu){
    		menuReg = menu
    	},

    	getSectionReg: function(){
    		return menuReg
    	}
    }
})

/*
 *	This allows the form inputs from SLIDERS and STARS to easily 
 *	be put into one location with the use of multiple controllers
 */
.factory('RatingSave', function($http, AuthenticationService){

	var slider1 = -1;
	var slider2 = -1;
	var slider3 = -1;
	var star = -1;
	var payload = {}
	var slideCount = 0

	var slider1_slide;
	var slider2_slide;
	var slider3_slide;

	var no_sliders = false

	var info 

	return{

		savePayload: function(payloade){
			payload = payloade
		},

		getPayload: function(){
			return payload
		},

		noSliders: function(x){
			no_sliders = x
		},

		saveSlider : function(key, value, slider, count){
			slideCount = count
			if(error_console)
				console.log("Saving slider. ", key, " : ", value, " : ", slider);
			if(key == 0){slider1=value;slider1_slide=slider;}
			if(key == 1){slider2=value;slider2_slide=slider;}
			if(key == 2){slider3=value;slider3_slide=slider;}
		},

		saveArr: function(newin){
			console.log('saveArr: ', newin)
			info = newin
		},

		getArr: function(){
			return info
		},
		
		/*
		 *	NOTICE: Will need to check if can have more than 3 sliders or less than 2. 
		 *  		If can handle less then 2 or more than 3, will need to change this!
		 */
		getSliders: function(){

			if(no_sliders)
				return true

			if(slider1 == -1 || slider2 == -1)
				return false

			if(slider3 == -1 && slideCount == 2)
			{
				var slideFinal = [
					{"score":slider1, "category":slider1_slide.category, "slider_template":slider1_slide.url, "recommendation":""},
					{"score":slider2, "category":slider2_slide.category, "slider_template":slider2_slide.url, "recommendation":""},
				]

				if(slider1 == -1 || slider2 == -1)
					return false

				return slideFinal;
			}
			else
			{
				var slideFinal = [
					{"score":slider1, "category":slider1_slide.category, "slider_template":slider1_slide.url, "recommendation":""},
					{"score":slider2, "category":slider2_slide.category, "slider_template":slider2_slide.url, "recommendation":""},
					{"score":slider3, "category":slider3_slide.category, "slider_template":slider3_slide.url, "recommendation":""}
				]
				if(slider1 == -1 || slider2 == -1 || slider3 == -1)
					return false

				return slideFinal;
			}
		},
		saveStar : function(rating){
			if(error_console){
				console.log("saving star rating: ", rating);
			}
			star = rating;
		},
		getStar : function(){
			if(star == -1)
				return false
			return star;
		},

		clearRatings : function(){
			slider1 = -1;
			slider2 = -1;
			slider3 = -1;
			star = -1;
			payload = {}
		},

		pushReview : function(payload){
			if(error_console)
				console.log("payload: ", payload);
	
			var call = $http({
	            method: 'POST',
	            url: base_url+'/recommendations/',
	            data: payload
	        })

	        call.success(function (data, status, headers, config) {
	        	if(error_console){
	            	console.log("successfully called pushReview");
	        	}	
	        })

	        call.error(function (data, status, headers, config){
	            alert("ERROR WITH STATUS "+ status +", data " + data)
	        	if(error_console){
	            	console.log("error data: ", data);
	        	}
	        });

	        return call;
		}, 

		getUserByEmail: function(socialinfo, email){

			var call = $http({
	            method: 'GET',
	            url: base_url+'/users/?email='+email,
				//data: JSON.stringify({username:"burger_bob", password:"Burgers.12345"})
				//data: JSON.stringify({username:"burger_bob", password:"Burgers.12345"}),
				headers: {'content-type': 'application/json', 'Authorization': 'Token '+ AuthenticationService.token}
	        })

	        call.success(function (data, status, headers, config) {
	        	if(error_console){
	            	console.log("successfully called getUserByEmail");
	        	}	
	        })

	        call.error(function (data, status, headers, config){
	            alert("ERROR WITH STATUS "+ status +", data " + data)
	        	if(error_console){
	            	console.log("getUserByEmail error data: ", data);
	        	}

	        });

	        return call;
		},

		getUserByAlias: function(socialinfo, alias){

			//console.log('getUser email: ', email)
			//email = "burger_b@gmail.com"
				
			var call = $http({
	            method: 'GET',
	            url: base_url+'/users/?username='+alias,
				//data: JSON.stringify({username:"burger_bob", password:"Burgers.12345"})
				//data: JSON.stringify({username:"burger_bob", password:"Burgers.12345"}),
				headers: {'content-type': 'application/json', 'Authorization': 'Token '+ AuthenticationService.token}
	        })

	        call.success(function (data, status, headers, config) {
	        	if(error_console){
	            	console.log("successfully called getUserByAlias");
	        	}	
	        })

	        call.error(function (data, status, headers, config){
	            alert("ERROR WITH STATUS "+ status +", data " + data)
	        	if(error_console){
	            	console.log("getUserByAlias error data: ", data);
	        	}

	        });

	        return call;
		},

		getUserProfile: function(user){
				
			var call = $http({
	            method: 'GET',
	            url: base_url+'/user_profile/?user='+user.id,
				//data: JSON.stringify({username:"burger_bob", password:"Burgers.12345"})
				//data: JSON.stringify({username:"burger_bob", password:"Burgers.12345"}),
				headers: {'content-type': 'application/json', 'Authorization': 'Token '+ AuthenticationService.token}
	        })

	        call.success(function (data, status, headers, config) {
	        	if(error_console){
	            	console.log("successfully called getUserProfile");
	        	}	
	        })

	        call.error(function (data, status, headers, config){
	            alert("ERROR WITH STATUS "+ status +", data " + data)
	        	if(error_console){
	            	console.log("getUserProfile error data: ", data);
	        	}
	        });

	        return call;
		},

		pushUser: function(socialinfo, email){

			//username, email, firstname, lastname, group = [], pw
			if(error_console){
				console.log('socialinfo : ',socialinfo)
				console.log('email: ', email)
			}
			//var payload = {"username":, "email": , "first_name": , "last_name": , "groups":[], "password":"Burgers.12345"}

			//facebook
        	if(socialinfo.alias === "undefined" || socialinfo.alias == null){

        		//creating user name
        		var newFirstName = socialinfo.firstname
        		var newLastNew = socialinfo.lastname.substring(0,1)
        		var newUserName = newFirstName.concat(newLastNew)
				//console.log('newUserName: ', newUserName)
				//creating payload
				var payload = {"username":newUserName, "email": socialinfo.email, "first_name": socialinfo.firstname, "last_name": socialinfo.lastname, "groups":[], "password":"Burgers.12345"}
        	}
        	else{
        		//split up name to first and last
        		var name = socialinfo.name
        		var nameArray = name.split(" ")
				var payload = {"username":socialinfo.alias, "email": email, "first_name": nameArray[0], "last_name": nameArray[1], "groups":[], "password":"Burgers.12345"}
        	}

			var call = $http({
	            method: 'POST',
	            url: base_url+'/users/',
	            data: payload
	        })

	        call.success(function (data, status, headers, config) {
	        	if(error_console){
	            	console.log("successfully called pushUser");
	        	}	
	        })

	        call.error(function (data, status, headers, config){
	           	alert("ERROR WITH STATUS "+ status +", data " + data)
	        	if(error_console){
	            	console.log("error data: ", data);
	        	}
	        });

	        return call;
		},

		pushUserProfile: function(user, socialinfo, email){

			if(error_console)
				console.log('pushUserProfile: ', user)

            var facebook_id
            var twitter_id
            var fb_location
            var twit_location
            var profile_image_url
            var time_zone
            var screen_name
            var locale
            var gender

            if(socialinfo.alias === "undefined" || socialinfo.alias == null){
				//var payload = {"username":socialinfo.firstname, "email": email, "first_name": socialinfo.firstname, "last_name": socialinfo.lastname, "groups":[], "password":"Burgers.12345"}
				facebook_id = socialinfo.raw.id
				twitter_id = ""
				fb_location = ""
				twit_location = ""
				profile_image_url = socialinfo.avatar
				time_zone = socialinfo.raw.time_zone
				screen_name = socialinfo.raw.first_name
				locale = socialinfo.raw.locale
				gender = socialinfo.raw.gender
        	}
        	//twitter
        	else{
				//var payload = {"username":socialinfo.alias, "email": email, "first_name": socialinfo.name, "last_name": socialinfo.name, "groups":[], "password":"Burgers.12345"}
				facebook_id = ""
				twitter_id = socialinfo.raw.id
				fb_location = ""
				twit_location = socialinfo.raw.location
				profile_image_url = socialinfo.raw.profile_image_url
				time_zone = ""/*socialinfo.raw.time_zone*/
				screen_name = socialinfo.raw.screen_name
				locale = ""
				gender = ""
        	}

            var payload = {
            	"facebook_id": facebook_id, 
            	"twitter_id": twitter_id, 
            	"user": user.url, 
           	 	"is_manager": false, 
            	"company": "", 
            	"affiliate": false, 
            	"reputation": 0, 
            	"gender": gender, 
            	"locale": locale, 
            	"time_zone": time_zone, 
            	"fb_location": fb_location, 
            	"twit_location": twit_location, 
            	"screen_name": screen_name, 
            	"profile_image_url": profile_image_url
            }

            if(error_console)
            	console.log('pushUserProfile payload: ', payload)

            var call = $http({
	            method: 'POST',
	            url: base_url+'/user_profile/',
	            data: payload
	        })

	        call.success(function (data, status, headers, config) {
	        	if(error_console){
	            	console.log("successfully called pushUserProfile");
	        	}	
	        })

	        call.error(function (data, status, headers, config){
	            alert("ERROR WITH STATUS "+ status +", data " + data)
	        	if(error_console){
	            	console.log("error data: ", data);
	        	}
	        });

	        return call;
		},

		pushSliders: function(slider){

			//username, email, firstname, lastname, group = [], pw
			if(error_console)
				console.log('(service)pushSliders : ',slider)

			var call = $http({
	            method: 'POST',
	            url: base_url+'/sliders/',
	            data: slider
	        })

	        call.success(function (data, status, headers, config) {
	        	if(error_console){
	            	console.log("successfully called pushUser");
	        	}	
	        })

	        call.error(function (data, status, headers, config){
	            alert("ERROR WITH STATUS "+ status +", data " + data)
	        	if(error_console){
	            	console.log("error data: ", data);
	        	}
	        });

	        return call;
		},
	}

})
