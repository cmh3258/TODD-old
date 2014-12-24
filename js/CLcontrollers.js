
angular.module('CoupleList')

//grid controller
.controller('appCtrl',['$scope','fgDelegate',function($scope,fgDelegate){


    $scope.items = [
        {
            img:'http://placehold.it/300x600/E97452/fff',
            name:'Lorem ipsum dolor sit amet',
        },
        {
            img:'http://placehold.it/300x300/4C6EB4/fff',
            name:'Lorem ipsum dolor sit amet',
        },
        {
            img:'http://placehold.it/300x250/449F93/fff',
            name:'Lorem ipsum dolor sit amet',
        },
        {
            img:'http://placehold.it/200x320/936FBC/fff',
            name:'Lorem ipsum dolor sit amet',
        },
        {
            img:'http://placehold.it/400x500/D25064/fff',
            name:'Lorem ipsum dolor sit amet',
        },
        {
            img:'http://placehold.it/300x200/CF364A/fff',
            name:'Lorem ipsum dolor sit amet',
        },
        {
            img:'http://placehold.it/300x400/E59649/fff',
            name:'Lorem ipsum dolor sit amet',
        },
        {
            img:'http://placehold.it/350x500/75A0CC/fff',
            name:'Lorem ipsum dolor sit amet',
        },
        {
            img:'http://placehold.it/300x200/4296AD/fff',
            name:'Lorem ipsum dolor sit amet',
        },
        {
            img:'http://placehold.it/300x400/9FDBC7/fff',
            name:'Lorem ipsum dolor sit amet',
        },
        {
            img:'http://placehold.it/300x300/4E8EF7/fff',
            name:'Lorem ipsum dolor sit amet',
        },
        
    ]

    $scope.addItem = function(){
        var randomIndex = Math.floor(Math.random(0,1)* $scope.items.length)
        var newItem = {
            name:$scope.items[randomIndex].name,
            img:$scope.items[randomIndex].img
        }
        // add a new item;
        $scope.items.splice(0,0,newItem);

        // make sure ngRepeat is finished rendering
        $scope.$watch('$last',function(){
            fgDelegate.getFlow('demoGird2').itemsChanged();
        });
    }

    $scope.changeWidth = function(width){
        console.log('calling')
        var flow = fgDelegate.getFlow('demoGird')

        flow.minItemWidth += width;
        fgDelegate.getFlow('demoGird').refill(true);
    }

    // then you can:
    // homePageGrid.minItemWidth = 150;
    // homePageGrid.refill();

}])

.controller('appCtrl2',['$scope','fgDelegate', 'foursquare',function($scope, fgDelegate, foursquare)
{
    $scope.hellobob = "Hello bob"
    $scope.showthemore = false
    $scope.isCollapsed8 = true
    $scope.selections = [
        "",
        "food",
        "drinks",
        "coffee",
        "shops",
        "arts",
        "outdoors",
        "sights",
        "trending",
        "specials",
        "nextVenues",
        "topPicks"
    ]


    $scope.searchSections = function(section, index)
    {
        console.log('section: ', section)
        console.log('index: ', index)
        $scope.selectedone = index; 

        $scope.exploreFoodData = null
        foursquare.exploreSection(section)
            .success(function (data) 
            {                 
                var items = data.response.groups[0].items
                $scope.exploreFoodData = itemEditing(items)

                var finalarry = []
                for(var j = 0; j < items.length; j++)
                {    
                    finalarry.push(items[j].venue)
                }
                $scope.finalarry = finalarry

                $scope.$watch('$last',function(){
                    fgDelegate.getFlow('homePageGird').itemsChanged();
                });

            })
            .error(function(error){
                console.log('exploreFood: ', error.message)
            });
    }

    $scope.itemsNew = [
        {
            imag:'http://placehold.it/300x600/E97452/fff',
            name:'Lorem ipsum dolor sit amet',
            id:'blahdasl'
        },
        {
            imag:'http://placehold.it/300x300/4C6EB4/fff',
            name:'Lorem ipsum dolor sit amet',
        },
        {
            imag:'http://placehold.it/300x250/449F93/fff',
            name:'Lorem ipsum dolor sit amet',
        }]

        $scope.updateGrid = function(){
            var homePageGrid = fgDelegate.getFlow('homePageGird');

            // then you can:
            homePageGrid.minItemWidth += 20;
            homePageGrid.refill(true);
        }

        $scope.reload = function()
        {
            $scope.$watch('$last',function(){
                fgDelegate.getFlow('homePageGird').itemsChanged();
            });
        }

    foursquare.exploreTopVenues()
        .success(function (data) 
        {
           $scope.newData = data.response.venues
           var items = data.response.groups[0].items
            items = itemEditing(items)
           //$scope.exploreFoodData = items
           console.log('bob ' ,$scope.exploreFoodData)
           var finalarry = []
           for(var j = 0; j < items.length; j++)
           {    
            finalarry.push(items[j].venue)
           }
           $scope.finalarry = finalarry
           //getPhotos($scope.exploreFoodData)
            //fgDelegate.getFlow('demoGird2').refill(true);
            //fgDelegate.getFlow('demoGird2').itemsChanged();
$scope.itemsNew1 = [
        {
            imag:'http://placehold.it/300x600/E97452/fff',
            name:'Lorem ipsum dolor sit amet',
        },
        {
            imag:'http://placehold.it/300x300/4C6EB4/fff',
            name:'Lorem ipsum dolor sit amet',
        },
        {
            imag:'http://placehold.it/300x250/449F93/fff',
            name:'Lorem ipsum dolor sit amet',
        }]
        $scope.$watch('$last',function(){
                fgDelegate.getFlow('homePageGird').itemsChanged();
            });
        })
        .error(function(error){
            alert('exploreTopVenues: ', error.message)
        });


    var itemEditing = function(items)
    {
        var i
        for(i = 0; i < items.length; i++)
        {
            //console.log(items[i])
            var photolink = items[i].venue.photos.groups[0].items[0]
            var thephoto = photolink.prefix + "300x200" + photolink.suffix
            //console.log(thephoto)
            items[i].venue["newphoto"] = thephoto

            var status = items[i].venue.hours.isOpen
            var closed = items[i].venue.hours.status
            if(status == false)
            {
                if(closed == null)
                    items[i].venue.hours.status = "Closed"
            }
        }
        return items
    }

    $scope.hoverIn = function(){
        this.shouldshow = true;
    };

    $scope.hoverOut = function(){
        this.shouldshow = false;
    };

    $scope.addevent = function(event)
    {
        console.log('addevent ', event)
    }

    $scope.moreinfo = function($event, place)
    {
        console.log('moreinfo ', place)
        var parent = angular.element($event.currentTarget).parent().parent().parent().parent()
        console.log('event ', parent)
        console.log('event ', parent[0].id)
        var divid = parent[0].id
        console.log('divid ', divid)

        //getElementById(divid).setAttribute("style","height:1000px");
        document.getElementById(divid).style.height += '500px';
    }

    $scope.moreinfo2 = function(place){
        $scope.moreInfoLink = "http://foursquare.com/v/" + place.id
    }

}])

.controller('mainCtrl', function($state, $scope, $window, $location, foursquare){
	$scope.newone = "hello"
    $scope.lat = "LAT"
    $scope.longi = "LONGI"

    $scope.isCollapsed = true;
    $scope.isCollapsed2 = true
    //$scope.shouldshow = false
    
    //fgDelegate.getFlow('demoGird2').refill(true);

    $scope.hoverIn = function(){
        this.shouldshow = true;
    };

    $scope.hoverOut = function(){
        this.shouldshow = false;
    };

    $scope.items = [
        'The first choice!',
        'And another choice for you.',
        'but wait! A third!'
    ];

    $scope.status = {
        isopen: false
    };

    $scope.toggled = function(open) {
        console.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };

    $scope.putclass = function()
    {
        console.log('here in putclass')
        /*
        $('.exploresection').toggleClass('explore-relative-top')
        $('.explore-fix').toggleClass('explore-fixed-top')
        $('.allevents').toggleClass('top150')
        */
    }

	var somePlaces = ["Chuys","McDonalds","Taco Bell","Four Seasons","Ice Skating",
						"Reds Porch","4 Diner","Dinneys","IHOP","Chinese Buffett"]

    $scope.selections = [
        "",
        "food",
        "drinks",
        "coffee",
        "shops",
        "arts",
        "outdoors",
        "sights",
        "trending",
        "specials",
        "nextVenues",
        "topPicks"
    ]

	var listOfPlaces = []
	for(var i = 0; i < 10; i++)
	{
		var newPlace = {}
		newPlace["restaurant"] = somePlaces[i] 
		newPlace["type"] = i
		newPlace["location"] = "austin, tx"
		newPlace["link"] = "www.somelink.com"
		listOfPlaces.push(newPlace)
	}

    console.log('Places: ', listOfPlaces)
    $scope.places = listOfPlaces

    /*
    foursquare.exploreTopVenues()
    	.success(function (data) 
    	{
           $scope.newData = data.response.venues
           var items = data.response.groups[0].items
           $scope.exploreFoodData = itemEditing(items)
           console.log($scope.exploreFoodData)
           //getPhotos($scope.exploreFoodData)
        })
        .error(function(error){
            alert('exploreTopVenues: ', error.message)
        });
*/

    var itemEditing = function(items)
    {
        var i
        for(i = 0; i < items.length; i++)
        {
            //console.log(items[i])
            var photolink = items[i].venue.photos.groups[0].items[0]
            var thephoto = photolink.prefix + "300x200" + photolink.suffix
            //console.log(thephoto)
            items[i].venue["newphoto"] = thephoto

            var status = items[i].venue.hours.isOpen
            var closed = items[i].venue.hours.status
            if(status == false)
            {
                if(closed == null)
                    items[i].venue.hours.status = "Closed"
            }
        }
        return items
    }

    $scope.addevent = function(event)
    {
        console.log('addevent ', event)
    }


    $scope.searchSections = function(section, index)
    {
        console.log('section: ', section)
        console.log('index: ', index)
        $scope.selectedone = index; 

        $scope.exploreFoodData = null
        foursquare.exploreSection(section)
            .success(function (data) 
            {                 
                var items = data.response.groups[0].items
                $scope.exploreFoodData = itemEditing(items)
            })
            .error(function(error){
                console.log('exploreFood: ', error.message)
            });
    }

    $scope.submitPlace = function(place)
    {
    	console.log('Place inserted: ', place)
    }

    $scope.getLocation = function() 
    {
        if (navigator.geolocation) 
        {
            navigator.geolocation.getCurrentPosition(showPosition);
        } 
        else 
        { 
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    var showPosition = function(position) 
    {
        $scope.lat = position.coords.latitude
        $scope.longi = position.coords.longitude
        console.log('here: ' , position.coords.latitude)
    }

    $scope.moreInfo = function(place)
    {
        console.log('moreInfo: ', place)
        //$('.col-md-12').addClass('col-md-8')
        //$('.col-sm-3').addClass('col-sm-4')
        //$('.col-sm-4').removeClass('col-sm-3')
        $scope.moreInfoLink = "http://foursquare.com/v/" + place.venue.id

        var photolink = place.venue.photos.groups[0].items[0]
        $scope.thephoto = photolink.prefix + "300x200" + photolink.suffix
        console.log($scope.thephoto)

        $scope.showMoreInfo = true
        $scope.place = place
    }

})

//https://api.foursquare.com/v2/venues/4a5a7dabf964a5206eba1fe3/photos&client_id=NIVPQHGRVGDXDF01DNIG1VBEV0QFFMCN5HH3XIBBX3RIHZYH&client_secret=1LRSXS4DWKMI5VVK5MKUGJ03YBROKGSL55TVJM3W2QUIXGRK&v=20141129
//prefix: "https://irs3.4sqi.net/img/general/"
//suffix: "https://irs3.4sqi.net/img/general/1275756_tGksTXAQp-Nm-mXjMVhGj3iIruQShmUaCa0J2DSu3ZI.jpg"


.factory('foursquare', function($http, $window){

	return{
		//log in to the dashboard
        exploreTopVenues : function(){   
            client_id = "NIVPQHGRVGDXDF01DNIG1VBEV0QFFMCN5HH3XIBBX3RIHZYH"
            client_secret = "1LRSXS4DWKMI5VVK5MKUGJ03YBROKGSL55TVJM3W2QUIXGRK"

			var call = $http({
                method: 'GET',
                //url: 'https://api.foursquare.com/v2/venues/search?ll=40.7,-74&client_id=NIVPQHGRVGDXDF01DNIG1VBEV0QFFMCN5HH3XIBBX3RIHZYH&client_secret=1LRSXS4DWKMI5VVK5MKUGJ03YBROKGSL55TVJM3W2QUIXGRK&v=20141129'
                url: 'https://api.foursquare.com/v2/venues/explore?near=AUSTIN,TX&venuePhotos=1&client_id=NIVPQHGRVGDXDF01DNIG1VBEV0QFFMCN5HH3XIBBX3RIHZYH&client_secret=1LRSXS4DWKMI5VVK5MKUGJ03YBROKGSL55TVJM3W2QUIXGRK&v=20141129'

                //data:  JSON.stringify({username: username, password: password})
            })
            call.success(function (data, status, headers, config) {
            	if(true)
                	console.log("deny call: success: ", data);
            })
            call.error(function (data, status, headers, config){
            	if(true)
                	console.log('deny call: error: ', data);
            });
            return call;     
		},	

		//logout the user 
		logout: function(){
			return;
		},

        exploreSection : function(section){   

            var call = $http({
                method: 'GET',
                //url: 'https://api.foursquare.com/v2/venues/search?ll=40.7,-74&client_id=NIVPQHGRVGDXDF01DNIG1VBEV0QFFMCN5HH3XIBBX3RIHZYH&client_secret=1LRSXS4DWKMI5VVK5MKUGJ03YBROKGSL55TVJM3W2QUIXGRK&v=20141129'
                url: 'https://api.foursquare.com/v2/venues/explore?near=AUSTIN,TX&venuePhotos=1&section='+section+'&client_id=NIVPQHGRVGDXDF01DNIG1VBEV0QFFMCN5HH3XIBBX3RIHZYH&client_secret=1LRSXS4DWKMI5VVK5MKUGJ03YBROKGSL55TVJM3W2QUIXGRK&v=20141129'

                //data:  JSON.stringify({username: username, password: password})
            })
            call.success(function (data, status, headers, config) {
                if(true)
                    console.log("exploreSection call: success: ", data);
            })
            call.error(function (data, status, headers, config){
                if(true)
                    console.log('exploreSection call: error: ', data);
            });
            return call;     
        },  

	}

})