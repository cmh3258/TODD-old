
//prints to the console if true. Used for checking if implemented correctly.
var error_console = false;
var analyticsCategory = "Sebastians"
analyticsCategory = "Demo-Testing"

angular.module('MenuApp')


/*
 *	User Login 
 */
.controller('loginCtrl', function($state, $scope, $window, $location, AuthenticationService, Auth){

    $scope.signIn = function(username, password) {
        // Check for missing credentials
        if(error_console)
            console.log('Signing in as: ', username, password);
        var userInfo;

        //username !== undefined && password !== undefined
        if (username !== undefined && password !== undefined) {
            $scope.loging = "Connecting...";
            Auth.logIn(username, password).then(
                function(data){
                    if(error_console)
                        console.log("successful login");
                    
                    AuthenticationService.isLogged = true;
                    
                    $state.go('dashboard');
                    
                },
                function(res){
                    if(error_console)
                        console.log("failed login", res.status);
                    $scope.loging = "Denied";
                }
            );
            
        }
        else{
            $scope.loging = "Please Enter a User Name and Password";
        }
    };

    $scope.signOut = function() {
        if(error_console)
            console.log("signout now");

        $state.go('home');
        
        if (AuthenticationService.isLogged) {
            AuthenticationService.isLogged = false;
            delete $window.sessionStorage.token;
            $location.path("/"); // default location after signout
        }
        
    };

})


/*
 *  Main controller
 */ 
.controller('MainCtrl', function($scope, ApiCalls, mySharedService, SectionSave, $analytics){

    $scope.signedInTwitter = true
    $scope.signedInTwitterB = false

    $analytics.eventTrack(analyticsCategory, {category: 'Main Load', label: 'Loading dishes' });

    //setting entry custom fields : needed to display items correctly
    var setClient = function(client, color, regularratings, noratings, secondaryratings, mainHeader, 
        secondaryHeader, items, sectionType, sectionTitleA, sectionTitleB)
        {
            //console.log('setClient')
            client.color = color
            client.regularratings = regularratings
            client.noratings = noratings
            client.secondaryratings = secondaryratings

            client.mainHeader = mainHeader
            client.secondaryHeader = secondaryratings
            client.items = items

            client.sectionType = sectionType
            client.sectionTitleA = sectionTitleA
            client.sectionTitleB = sectionTitleB
            return client
        }

    //load the main menu
	$scope.loadMenu = function(){
        if(error_console)
            console.log("making calls");
	 	

        ApiCalls.menuCall()
            .success(function (c) {
                //console.log('c: ', c)
                var clientNew = c.results[0].sections

                for(var i = 0; i < clientNew.length; i++) {
                    //console.log('client loop: ', clientNew[i])
                    if(clientNew[i].name == "MORE"){

                        clientNew[i] = setClient(
                            clientNew[i],
                            "green",
                            false, true, false,
                            "white", "white", "white",
                            "simple",
                            "",
                            "MORE"
                            )
                    } 

                    else if(clientNew[i].name == "CREATE YOUR OWN SANDWICH"){
                        clientNew[i].color = "purple"
                        clientNew[i].regularratings = false
                        clientNew[i].noratings = false
                        clientNew[i].secondaryratings = true

                        clientNew[i].mainHeader = "orange"
                        clientNew[i].secondaryHeader = "white"
                        clientNew[i].items = "white"
                        clientNew[i].sectionDescH = "white"

                        clientNew[i].sectionType = "create"
                        clientNew[i].sectionTitleA = "CREATE YOUR OWN"
                        clientNew[i].sectionTitleB = "SANDWICH"
                    } 

                    else if(clientNew[i].name == "SIGNATURE SANDWICHES"){
                       
                         clientNew[i] = setClient(
                            clientNew[i],
                            "white",
                            true, false, false,
                            "orange", "mix", "purple",
                            "regular",
                            "SIGNATURE",
                            "SANDWICHES"
                            )
                    } 

                    else if(clientNew[i].name == "CREATE YOUR SALAD"){
                        clientNew[i].color = "white"
                        clientNew[i].regularratings = false
                        clientNew[i].noratings = false
                        clientNew[i].secondaryratings = true

                        clientNew[i].mainHeader = "orange"
                        clientNew[i].secondaryHeader = "purple"
                        clientNew[i].items = "black"
                        clientNew[i].sectionDescH = "green"

                        clientNew[i].sectionType = "create"
                        clientNew[i].sectionTitleA = "CREATE YOUR"
                        clientNew[i].sectionTitleB = "SALAD"
                    } 

                    else if(clientNew[i].name == "CREATE YOUR OWN NOODLE/RICE OR PASTA BOWL"){
                        clientNew[i].color = "white"
                        clientNew[i].regularratings = false
                        clientNew[i].noratings = false
                        clientNew[i].secondaryratings = true

                        clientNew[i].mainHeader = "orange"
                        clientNew[i].secondaryHeader = "mix"
                        clientNew[i].items = "black"

                        clientNew[i].sectionType = "mix"
                        clientNew[i].sectionTitleA = "CREATE YOUR OWN"
                        clientNew[i].breakHeader = true
                        clientNew[i].sectionTitleB = "NOODLE/RICE OR PASTA BOWL"
                    } 

                    else if(clientNew[i].name == "SIGNATURE CREPES"){
                        clientNew[i].color = "purple"
                        clientNew[i].regularratings = false
                        clientNew[i].noratings = false
                        clientNew[i].secondaryratings = false
                        clientNew[i].custom = true

                        clientNew[i].mainHeader = "orange"
                        clientNew[i].secondaryHeader = "white"
                        clientNew[i].items = "white"

                        clientNew[i].sectionType = "crepes"
                        clientNew[i].sectionTitleA = "SIGNATURE"
                        clientNew[i].sectionTitleB = "CREPES"

                    } 

                    else if(clientNew[i].name == "WICKED FRESH BREAKFAST"){

                        clientNew[i] = setClient(
                            clientNew[i],
                            "white",
                            true, false, false,
                            "orange", "green", "purple",
                            "wicked",
                            "WiCKED FRESH",
                            "BREAKFAST"
                            )
                    } 

                    else if(clientNew[i].name == "GRAB & GO"){

                        clientNew[i] = setClient(
                            clientNew[i],
                            "green",
                            false, true, false,
                            "white", "white", "white",
                            "simple",
                            "",
                            "GRAB & GO"
                            )
                    } 

                }
                $scope.clients = clientNew.reverse()
                $scope.mainLoadComplete = true;
                
                if(error_console)        
                    console.log($scope.clients);

            })
            .error(function(error){
                $scope.errory='Bad loadMenu '+error.message;
            });

	};


    /*
     *  Getting authorization
     */
    $scope.getAuth = function(){
        ApiCalls.requestAuth()
            .success(function (c) {
                //alert('c: ', c)
                //console.log("success getAuth: ",c);
                $scope.loadMenu();
                //$http.defaults.headers.common['auth-token'] = c.token;

            })
            .error(function(error){
                //console.log('error ', error)
                alert('getAuth Error: ', error.message)
            });
    }   

    $scope.getAuth();

    $scope.setMenuSection = function(order, section){
        console.log('order2: ', section)
        SectionSave.setSection(order, section);
    }

    $scope.$on('handleBroadcast', function() {
        
        var writeit = mySharedService.writeit;
        var readit = mySharedService.readit;
        var item = mySharedService.item;
        if(error_console){       
            console.log("handling broadcast");
            console.log(writeit, " ", readit,  " ", item);
        }

        var docHeight = $(document).height(); //grab the height of the page
        var scrollTop = $(window).scrollTop();
            
        $('.overlay-bg2').show().css({'height' : docHeight}); //display your popup and set height to the page height
        $('.overlay-content2').css({'top': scrollTop+10+'px'}); //set the content 20px from the window top

        if(writeit == true){
            if(error_console)
                console.log("Write a review")
            $scope.writeit = true;
        }

        if(readit == true){
            if(error_console)
                console.log("Read a review")
            $scope.readit = true;
        }

        if(writeit == false && readit == false){
            $scope.writeit = false;
            $scope.readit = false;
        }



    })

})


.controller('menuItemTemplateNew', function($scope, mySharedService, SectionSave){

    //console.log('loadmenu2!: ' , $scope.obje)
    
    var section = $scope.obje
    var sectionType = section.sectionType
    var sectionEntries = section.entries
    $scope.section = section

    if(sectionType == "regular")
    {
        //console.log('reg-temp')
        $scope.regular = true
    }

     else if(sectionType == "mix")
     {
            //console.log('mix-temp: ', section)
            var arrayFinal = []
            var arrayTemp = []
            var dictTemp = {}
            var dictTemp2 = {}
            
            for(var i = 0; i < sectionEntries.length; i++)
            {   
                dictTemp = {}
                arrayTemp = []
                var entry = sectionEntries[i]
                dictTemp["mainTitle"] = entry.name
                
                for(var j = 0; j < entry.sub_section.length; j++)
                {
                    
                    dictTemp2 = {}
                    var sub = entry.sub_section[j]
                    //console.log('new sub 54: ', sub)
                    var option = entry.options.substring(1,entry.options.length-2)
                    //console.log('new option: ', option)
                    var newNewOptions = option.split("], ")
                    var newJ = newNewOptions[j]
                    //console.log('newnewnew: ', newNewOptions)
                    

                    //setting title
                    var n = sub.indexOf("<");
                    var res = sub.substring(n+1, sub.length-1);

                    //console.log('123res: ', res)
                    
                    var isNew = false
                    if(n != 0){
                        var newName = sub.substring(0, n)
                        isNew = true
                    }

                    //console.log('123newN: ', newName , '. res: ', res)
                    
                    $scope.newName  = newName
                    

                    dictTemp2["titleMain"] = newName
                    dictTemp2["titleSub"] = res
                    
                    //dictTemp2["title"] = sub
                    dictTemp2["option"] = newJ.substring(1, newJ.length)
                    arrayTemp.push(dictTemp2)
                    
                }
                dictTemp["section"] = arrayTemp
                arrayFinal.push(dictTemp)
    
            }
            if(section.entries[0].top_comment.length == 0)
                $scope.hideTopReview = true

            if(section.entries[1].top_comment.length == 0)
                $scope.hideTopReview2 = true

            $scope.topReviewsLoop = section.entries[0].top_comment
            $scope.topReviewsLoop2 = section.entries[0].top_comment


            //console.log('final options 10: ', arrayFinal)
            $scope.arrayFinal = arrayFinal
            $scope.mix = true

        }

        else if(sectionType == "crepes"){
            //console.log('crepes-temp')
            //console.log('section: ', section)
            $scope.crepes = true

            var allday = []
            var breakfast = []
            var lunch = []
            for(var i = 0; i < section.entries.length; i++)
            {
                //console.log('sub: ', section.entries[i])
                if(section.entries[i].sub_section == "<lunch>")
                    lunch.push(section.entries[i])
                if(section.entries[i].name == "<breakfast>")
                    breakfast.push(section.entries[i])
                if(section.entries[i].sub_section == "<all day>")
                    allday.push(section.entries[i])
            }
            $scope.itemList = {"breakfast":breakfast, "lunch":lunch, "allday":allday}
        }
        
        else if(section.sectionType == "simple"){
            //console.log('simple-temp')
            //console.log('simple=section: ', section)
            var sampleDic = {}
            var array = []
            for(var i = 0; i < section.entries.length; i++)
            {
                sampleDic = {}
                //console.log('new-simple-desc')
                var newDes = section.entries[i].description.split(", ")
                //console.log('new-simple-desc : ', newDes)
                //newDict = {section.entries[i].name : newDes}

                sampleDic["name"] = section.entries[i].name.substring(1, section.entries[i].name.length-1)
                sampleDic["descriptions"] = section.entries[i].description
                array.push(sampleDic)
            }
            //console.log('arayfdjsal: ', array)

            $scope.newArray = array
            $scope.descriptions = newDes
            $scope.simple = true
        }
        
        else if(section.sectionType == "create"){
            //console.log('create-temp')
            //console.log('section124: ', section)

          
            var optionts = section.entries[0].options
            $scope.optionts = optionts

            //console.log('optionts: ', $scope.optionts.substring(11, optionts.length))
            var newOptions =  $scope.optionts.substring(1, optionts.length)
            var newNewOptions = newOptions.split("], ")
            //console.log('newne: ', newNewOptions)

            var newSubSection = []
            var newSubSectionTemp = {}
            //console.log('subsec: ' ,section.entries[0].sub_section.length)
            for(var i = 0; i < section.entries[0].sub_section.length; i++)
            {
                newSubSectionTemp = {}
                var sub = section.entries[0].sub_section[i]
                var n = sub.indexOf("<");
                var res = sub.substring(n+1, sub.length-1);

                //console.log('123res: ', res)
                
                var isNew = false
                if(n != 0){
                    var newName = sub.substring(0, n)
                    isNew = true
                }

                //console.log('123newN: ', newName , '. res: ', res)
                
                $scope.newName  = newName
                
                newSubSectionTemp["titleMain"] = newName
                newSubSectionTemp["titleSub"] = res

                //checking to see if extra [ ]
                if(newNewOptions[i].indexOf("]") > -1){
                    //console.log('1found ] : ', newNewOptions[i])
                    var optionN = newNewOptions[i].substring(0,newNewOptions[i].indexOf("]"))
                    //console.log('newWord: ', optionN)
                }
                else{
                    var optionN = newNewOptions[i].substring(1, newNewOptions[i].length)
                    //console.log('2NN: ', optionN)
                }

                if(optionN.indexOf("[") > -1){
                    //console.log('3found ] : ', newNewOptions[i])
                    var optionNN = optionN.substring(optionN.indexOf("[")+1)
                    //console.log('newWord: ', optionN)
                }
                else{
                    var optionNN = optionN.substring(0, optionN.length)
                    //console.log('4NN: ', optionN)
                }


                //var newOptionIT = optionNN.split(",")
                //console.log('optionsN: ', optionNN)
                newSubSectionTemp["options"] = optionNN
                newSubSection.push(newSubSectionTemp)

            }
            //console.log('newSubSection: ', newSubSection)

            console.log()
            if(section.entries[0].top_comment.length == 0)
                $scope.hideTopReview = true

            $scope.topReviewsLoop = section.entries[0].top_comment

            $scope.newSubSection = newSubSection

            $scope.createRT = true
        }
        
        else if(section.sectionType == "wicked"){
            //console.log('wicked-temp')
            //console.log('section: ', section)

            var sandwich = []
            var other = []
            for(var i = 0; i < section.entries.length; i++)
            {
                //console.log('sub: ', section.entries[i].sub_section)
                section.entries[i].showComment = true
                var hideTopComment = false
                if(section.entries[i].sub_section == "sandwiches"){
                    if(section.entries[i].review_count == 0)
                        section.entries[i].showComment = false

                    section.entries[i].new = hideTopComment
                    section.entries[i].name = section.entries[i].name.substring(1, section.entries[i].name.length-1)
                    sandwich.push(section.entries[i])
                }
                else
                    other.push(section.entries[i])
            }

            $scope.sandwiches = sandwich
            //console.log('other67: ', other)
            var newSubSection = []
            var newSubSectionTemp = {}

            var newOptions =  other[0].options.substring(1, other[0].options.length-2)
            //console.log('wicked newO: ', newOptions)
            
            var newNewOptions = newOptions.split("], ")
            //console.log('sub87: ', other[0])

            var listOfSec = []
            for(var i = 0; i < other[0].sub_section.length; i++)
            {   
                newSubSectionTemp = {}
                newSubSectionTemp["title"] = other[0].sub_section[i]

                var optionN = newNewOptions[i].substring(1, newNewOptions[i].length)
                newSubSectionTemp["options"] = optionN
                //console.log('newSS1: ', newSubSectionTemp)
                listOfSec.push(newSubSectionTemp)

            }   

            //console.log('newSS: ', newSubSectionTemp)
                
            $scope.listOfItem = listOfSec

            if(section.entries[0].top_comment.length == 0)
                $scope.hideTopReview = true
            
            $scope.topReviewsLoop = section.entries[0].top_comment

            $scope.other = other
            $scope.wicked = true
        }


    $scope.handleClick = function(read, write, menu) {
        mySharedService.prepForBroadcast(read, write, menu);
        if(error_console)
            console.log('----broadcasting');
    };

    $scope.setMenuSectionRegular = function(order){
        //console.log('order2: ', order)
        SectionSave.setSectionReg(order);
    }

})

/*
 *  A menu item template
 */ 
.controller('menuItemTemplate', function($scope, SectionSave, mySharedService){

    $scope.handleClick = function(read, write, menu) {
        mySharedService.prepForBroadcast(read, write, menu);
        if(error_console)
            console.log('----broadcasting');
    };



    /*
     * saving menu items locally 
     */
    $scope.loadMenuItems = function(){

        //console.log('loading items now')
        //getting section
        var menu = SectionSave.getSectionReg()

        //console.log('menu: ', menu)
        //console.log('menu sub: ', menu.sub_section)
        //console.log('options: ', menu.options)
        //console.log('seciotn: ', SectionSave.getSect())
        $scope.largeportion = false
        $scope.spicy = false

        //create the item with two types of style french <bread>
        var n = menu.name.indexOf("<");
        var res = menu.name.substring(n+1, menu.name.length-1);

        newName = menu.name
        var isNew = false
        if(n != 0){
            var newName = menu.name.substring(0, n)
            isNew = true
        }

        //console.log('newN: ', newName , '. res: ', res)
        $scope.newName  = newName
        if(isNew)
            $scope.res = res
        else
            $scope.res = ""

        //console.log('find error')
        //console.log('s: ', menu.slider_templates)
        var slider = menu.slider_templates
        var score = 0
        for(var i = 0; i < slider.length; i++) {
            score = slider[i].average_score * 20
            //console.log('b: ', score)

            if(slider[i].category == "Portion Size"){
                if(score > 66){
                    //console.log('shoudl show largep')
                    $scope.largeportion = true
                }
            }
            if(slider[i].category == "Spiciness"){
                if(score > 66){
                    $scope.spicy = true
                }
            }
        }

        if(menu.review_count == 0)
            $scope.hideTopComment = true

        $scope.menu = menu

    }

    $scope.setPercentage = function(percent){
        console.log('here3')

        if(percent > 10)
            $scope.percent = 100;
        else
            $scope.percent = percent*10;
    }

    /*
     *  Get badge for each menu item
     *
    $scope.getBadge = function(score, category){
        console.log('here4')

        //console.log('cat: ', category, ' ', score)
        if(category == 'Spiciness'){
            if(score < 3.33){
                $scope.badgeLabel = "Mild Spice"
                $scope.badgeColor = "RGB(255, 33, 67)"
            }
            else if(score < 6.66){
                $scope.badgeLabel = "Medium Spice"
                $scope.badgeColor = "RGB(255, 33, 67)"
            }
            else{
                $scope.badgeLabel = "Spicy"
                $scope.badgeColor = "RGB(255, 33, 67)"
            }
        }

        /*
        else if(category == 'Portion Size'){
            console.log('..portion')  
            if(score < 3.33){
                $scope.badgeLabel = "Small Portions"
                $scope.badgeColor = "RGB(29, 143, 209)"
            }
            else if(score < 6.66){
                $scope.badgeLabel = "Medium Portions"
                $scope.badgeColor = "RGB(29, 143, 209)"
            }
            else{
                $scope.badgeLabel = "Large Portions"
                $scope.badgeColor = "RGB(29, 143, 209)"
            }
        }
        *//*

        else{
            $scope.badgeLabel = ""
            $scope.badgeColor = ""
        }
    }

    */

})

/*
 *  Popup for reading reviews
 */ 
.controller('readReview', function($scope, mySharedService, ApiCalls,  $analytics){

    var readit, writeit, item;
    var scoreArr = {};

    //toggle active on sort button
    $scope.toggleActive = function (activate, deactivate) {
        //console.log('toggleA: ', id)
        $(activate).addClass( "activeSort" )
        $(deactivate).removeClass( "activeSort" )

    }

	$scope.$on('handleBroadcast', function() {
        //console.log('here5')

        writeit = mySharedService.writeit;
        readit = mySharedService.readit;
        item = mySharedService.item;
        $scope.item = item;

        if(error_console)
            console.log("h: " , writeit, " ", readit,  " ", item);

        $scope.reviewLoaded = false;

        if(readit){
            $scope.reviewLoaded = false;
            //console.log('readit: ', item)
            loadReviews(item.id, false);
            $('body').toggleClass('.newClass');
            $analytics.eventTrack(analyticsCategory, {  category: 'Read Review', label: 'user reading reviews' });

        }

    })

    /*
     * disabling the 'like' button if user already clicked it
     * NOTICE: this will not work if user refreshes the page
     */
    $scope.getScore = function(id){
        //console.log(scoreArr)
        //console.log(id)
        //console.log("score: ", scoreArr[id])
        if(scoreArr[id]["userliked"] == true){
            //need to disable this button
            //console.log("should disable");
            document.getElementById(id).disabled = true;
        }
        return parseInt(scoreArr[id]["score"])
    }

    var loadReviews =function(itemit, title)
    {
        if(error_console){
            console.log("loadReviews ", title);
            console.log("id ", item, " it: ", itemit)
        }

        $scope.moreReviews = false

        ApiCalls.getRatings(itemit)
            .success(function (data) {
                if(error_console){       
                    console.log("read data: ",data);
                    console.log("read dataobjects: ",data.objects);
                }
                
                if(data.next != null){
                    //console.log("PAGING ", data.next)
                    $scope.moreReviews = true
                }
                else{
                    $scope.moreReviews = false
                }

                //call outside function - necessary for pagination
                reviewDisplay(data, title, null)
                
            })
            .error(function(error){
                $scope.errory='Bad call '+error.message;
            });
    }

    /*
     *  Displaying reviews on HTML
     */
    var reviewDisplay = function(data, title, recentReviews){
        var json = data.results;
        var newjson = [];

        //if loading more reviews, want to concat to previous reviews
        if(recentReviews != null){
            if(error_console){
                console.log('concating reviews')
                console.log('data: ', data.results)
                console.log('receRev: ', recentReviews)
            }
            var new_J = recentReviews.concat(json)
            json = new_J
        }

        //checking to see if the review has been checked and approved
        for(var i = 0; i < json.length; i++) {
            var obj = json[i];
            if(error_console)       
                console.log("loop: ",obj);

            if(obj.approved && obj.checked){
                newjson.push(obj);
                //review_count++;
            }
        }

        if(data.next != null){
            //console.log("More PAGING ", data.next)
            $scope.moreReviews = true
        }
        else{
            $scope.moreReviews = false
        }

        //set main reviews object
        $scope.object = newjson
        $scope.object.more = data.next
        /*
         * make a score array - keeping track if user clicks the button.
         * this is the set up function - make sure not to overwrite (thats why there
         * is if statments)
         */
        for (i = 0; i < newjson.length; i++){
            if(!scoreArr[newjson[i].title])
                scoreArr[newjson[i].title] = {}
            
            scoreArr[newjson[i].title]["score"] = newjson[i].score
            if(scoreArr[newjson[i].title]["userliked"] == true){
                //console.log("should disable");
            }
            else if(scoreArr[newjson[i].title]["userliked"] == false)
                scoreArr[newjson[i].title]["userliked"] = false
        }

        $scope.reviewLoaded = true;
        //console.log("2laodReviews ", title);
        if(title){
            document.getElementById(title).disabled = true;
            //console.log("should be disabled")
        }
    }

    /*
     *  pagination
     */
    $scope.loadMore = function(url, recentReviews){
        //console.log("loadMore(url): ", url)

        ApiCalls.loadMoreReviews(url)
            .success(function (data) {
                reviewDisplay(data, "", recentReviews)
                //console.log('loadMore success: ', data)
                $analytics.eventTrack(analyticsCategory, { category: 'Read Review', label: 'loaded more reviews(paging)' });
            })
            .error(function(error){
               //console.log('loadMore error: ', error)
               alert('loadMore Error: ', error)
            });
    }

    //console.log(writeit, " ", readit,  " ", item);

    $scope.handleClick = function(msg) {
        $('body').toggleClass('.newClass');
        mySharedService.prepForBroadcast(false, false, $scope.item);
        //console.log('----broadcasting');
    };

    /*
     *  When user clicks to 'like' a review
     */
    $scope.clickedLikeButton = function(current_score, id, itemid, title){

        //if(SocialService.hasLoggedIn()){

            $scope.closeAlert();

            var score = parseInt(current_score, 10);
            $scope.number = score + 1;
            score += 1;
            if(error_console){
                console.log("s ",score, " for ", id);
                console.log('pressed: ', title);
            }

            //document.getElementById(title).disabled = true;

            //will need to save click into dictionary
            scoreArr[title]["userliked"] = true;

            //incremennt count - do this so we dont have to reload ratings
            //console.log("new: ", scoreArr, " : ", scoreArr[title]["userliked"])

            ApiCalls.saveLike(score, id, itemid, title)
                .success(function (data) {
                    loadReviews(itemid, title);

                    if(error_console)
                        console.log("Like was received");
                    /*
                    $scope.likereceived = true;
                    $scope.likemessage = "Like was received for \""+title+"\"";
                    */
                    $analytics.eventTrack(analyticsCategory, { category: 'Read Review', label: 'clicked like button' });

                })
                .error(function(error){
                    $scope.errory='Bad call '+error.message;
                    $scope.likereceived = true;
                    $scope.likemessage = "Error when liking the review "+title;
                });
                
        /*}
        else{
            $scope.showLogIn()
        }*/

    }


    $scope.closeAlert = function(){
        $scope.likereceived = false
    }

    /*
    $scope.arrangeReviews = function(x){
        //most recent
        if(x == 0){
            console.log("x == 1");
        }
        //top rated
        if(x == 1){
            console.log("x == 1");
        }   
    }
    */

    $scope.setPercentage = function(percent){
        if(percent > 20)
            $scope.percent = 100;
        else
            $scope.percent = percent*20;
    }


})


/*
 * 
 */ 
.controller('writeReview', function($scope, mySharedService, RatingSave, $location, $anchorScroll, ApiCalls, socialMediaService, $analytics){

    var item;


	$scope.$on('handleBroadcast', function() {
        //console.log("in new writeReview ctrl");

        $scope.writeit = mySharedService.writeit;
        $scope.readit = mySharedService.readit;

        //create new item.name

        $scope.item = mySharedService.item;

        //console.log('itemBB : ', $scope.item)

        //console.log('name; ', $scope.item.name)
        if($scope.item.name.length == 0)
            $scope.item.name = "Custom Section"

        item = $scope.item;

        $('body').toggleClass('newClass');

        var slidenew = item.slider_templates;
        //console.log('slidenew: ', slidenew)
        if(slidenew.length == 0){
            RatingSave.noSliders(true)
            $scope.noSlider = true
        }
        else
        {
            $scope.noSlider = false
        }
        if(error_console)
            console.log("slinew ",slidenew);

        var slideFinal = {};
        var slideCount = 0
        var n = ""
        if(slidenew != null){
            var i
            for (var i = 0; i < slidenew.length; i++) {
                slideCount++
                slideFinal[i] = {
                    key:i,
                    value:slidenew[i],
                    badge:n
                    }
            }
            if(error_console)
                console.log(slideFinal);
            $scope.sliderObject = slideFinal;
            $scope.slideCount = slideCount
            $analytics.eventTrack(analyticsCategory, { category: 'Writing Review', label: 'user opened to write a review' });
        }

        $('.main-review-content').show()

        var myElements = document.querySelectorAll(".bar-color");
        for (var i = 0; i < myElements.length; i++) {
            //console.log('set to 0')
            myElements[i].style.width = 0;
        }

        var myElements = document.querySelectorAll(".inB");
        for (var i = 0; i < myElements.length; i++) {
            //console.log('set to 0')
            myElements[i].value = 0;
        }

        /*
        if(!SocialService.isReady())
        {
            console.log("hasn't logged in")
            $scope.infoBoxShow = true
            $scope.userLoggedIn = false
            $scope.name = "Please log in"
        }
        else{
            alert("hi");        
            $scope.userLoggedIn = true
            $scope.infoBoxShow = false
            $scope.name = SocialService.getObject();
        }
        */
        //console.log('endWrite2')


    })

    $scope.handleClick = function() {
        $('body').toggleClass('.newClass');
        mySharedService.prepForBroadcast(false, false, $scope.item);
        //console.log('----broadcasting');
        RatingSave.clearRatings();  //clears all ratings
        $scope.setgold(0)
        $scope.showSocialMedia = false //made false when user hits exit before signing to social media
        $scope.review = null

        $('.overlay-rating-submitted').hide();
    };

    /*
     *  When user clicks button to submit the review
     */
    $scope.submitReview = function(itemid, review, item, review){

        $analytics.eventTrack(analyticsCategory, {  category: 'Writing Review', label: 'pressed submit review' });

        if(error_console){
            console.log('item: ', item)
            console.log('review: ', review)     
            console.log("Saving Review")
            console.log("itemid: ", itemid)
        }
        var sliders = RatingSave.getSliders();
        var stars = RatingSave.getStar();
        var email = socialMediaService.getEmail();
        var socialInfo = socialMediaService.getData();
        
        if(error_console){       
            console.log("slider reviews: ", sliders)
            console.log("star rate: ", stars)
            console.log("email: ", email, " or ", socialInfo.email)
            console.log("socialInfo: ", socialInfo)
        }   

        var d = new Date();
        var n = d.toISOString();

        //console.log("isoJ: ",n);
        var nickname = ""

        //console.log('(2)item: ', item)
        /* Old API
        var entry = "/api/v1/entries/"+ itemid +"/"
        var user = "/api/v1/user/1/"
        "entry": "http://recommenu-test-api.herokuapp.com/entries/1/"
        */
        var entry = "http://recommenu-test-api.herokuapp.com/entries/"+ itemid +"/"
        //var entry = {"id":itemid, "name":item.name, "description":item.description}
        var user = "http://recommenu-test-api.herokuapp.com/user_profile/1/"
        var recommendation_id = "http://recommenu-test-api.herokuapp.com/recommendations/"+1+"/"
        var payload = {"approved":0, "checked":0, "comment":review.comment, "date_posted":n, "entry":entry, "nickname":nickname,
                        "sliders":[], "title":review.title, "user":user, "stars":stars,"brand_responses":[], 
                        "score":0.0, "recommendation":recommendation_id, "entry_name":item.name, "entry_description:":item.description}
        $scope.payload = payload;

        if(error_console){
            console.log("comment: ", review.comment);
            console.log("comment: ", review.title);
            console.log("sliders: ", sliders);
            console.log("stars: ", stars);
            console.log("(2)payload: ", payload)
        }

        //clear the forms
        $scope.review = null

        /*
        if(!socialMediaService.isReady()){
            console.log("twitter is not ready");
            $scope.showUserLogin(true)
            RatingSave.savePayload(payload);
        }
        else{
            $scope.showUserLogin(false)
            $scope.pushIt(payload);
        }
        */


        
        if(socialMediaService.isReady() != true){
            //console.log("social is not ready: ", socialMediaService.getData(), " ", socialMediaService.isReady() );
            $scope.showUserLogin(true)
            RatingSave.savePayload(payload);
        }

        //social already loaded
        else{
            //console.log("social should be ready: ", socialMediaService.getData(), " ", socialMediaService.isReady() );
            RatingSave.savePayload(payload);
            $scope.showUserLogin(false)
            $scope.pushIt(payload);
        }
        

        //send payload
        /*
        RatingSave.pushReview(payload)
            .success(function (c) {
                if(error_console)
                    console.log("success! (rs)");
                $scope.outcomed=c;
                $scope.outcomed="Success. Thank you";
            })
            .error(function(error){
                $scope.errore='Bad call '+error.message;
                $scope.errore="Not Successful. Sorry";
            });
        */

    }

    $scope.pushIt = function(payload){

        /*
            push the user - will need to see if the user exists already or not!
    
            Now when getUser: we need to check to see if the user exists according
            to FB or TWITTER. If(site == twitter) getUser by twitter id?. else get by email
        */

        //get the social media info
        var info = socialMediaService.getData();
        //console.log('pushIt info: ', info)

        //twitter info : gets info.id
        //fb info: get info.id

        //present facebook name
        if(info.alias === "undefined" || info.alias == null){
            $scope.alias = info.firstname;

            RatingSave.getUserByEmail(info, info.email)
                .success(function (user) {
                    if(error_console){
                        console.log("success! (rs)");
                        console.log('getUser: ', user)
                    }

                    count = user.count
                    user = user.results[0]
                    //console.log('user[0] :', user)
                    //doit(user, socialInfo, email);

                    //if user already exists, check if have profile, then either create or push review!!!!!!!!
                    //create
                    if(count == 0){
                        //console.log('make new user(fb) email: ', info.email)
                        pushUserMain(info, info.email, payload)
                    }
                    //if already has user_profile
                    else{
                        //get user profile
                        getUserProfile(user, info, user.email, payload, 'facebook')
                    }

                })
                .error(function(error){
                    //console.log('getUser(error): ', error)
                    alert('getUser Error: ', error)
                });
        }

        //present twitter username
        else{
            //alert("should be alias: ", info.alias)
            $scope.alias = "@"+info.alias
            var alias = info.alias

            RatingSave.getUserByAlias(info, alias)
                .success(function (user) {
                    if(error_console){
                        console.log("success! (rs)");
                        console.log('getUser: ', user)
                    }
                    //console.log('user[0] :', user)

                    count = user.count
                    //user = user.results[0]
                    //doit(user, socialInfo, email);

                    //if no user then need to create one
                    if(count == 0){
                        //pushUserMain(socialInfo, email, payload)
                        $scope.show = true

                        //save the payload and user
                        RatingSave.saveArr(info);

                    }

                    //check to see if already has user_profile
                    else{
                        //get user profile
                        getUserProfile(user.results[0], info, user.results[0].email, payload, 'twitter')
                    }

                })
                .error(function(error){
                    //console.log('getUser(error): ', error)
                    alert('getUser Error: ', error)
                });
        }

        /*
        //if user doesn't exists then push it
        RatingSave.pushUser(socialInfo, email)
            .success(function (user) {
                if(error_console)
                    console.log("success! (rs)");
                console.log('pushUser: ', user)

                //will then push the user_profile
                pushUserProf(user, socialInfo, email);
                $analytics.eventTrack('New user', {  category: 'user', label: email });

            })
            .error(function(error){
                console.log('pushUser(error): ', error)

            });
            */

        //push user_profile

        /*

        //push review to database
        RatingSave.pushReview(payload)
            .success(function (c) {
                if(error_console)
                    console.log("success! (rs)");
                //$scope.outcomed=c;
                //$scope.outcomed="Success. Thank you";
                $scope.showRatingOverlay = true;

                //must use hide() and show() because of redirects
                $('.overlay-social-content').hide();
                $('.overlay-rating-submitted').show();
                $analytics.eventTrack('Submitted a review', {  category: 'submitted review', label: submitted });

            })
            .error(function(error){
                //$scope.errore='Bad call '+error.message;
                //$scope.errore="Not Successful. Sorry";
                alert(error.message)
            });
        */

        /*
         *
         *  will need to save the user info too!
         *  if already saved the user, we shouldn't do it again
         *  
         *  how to keep track of that? 
         *  will need to check db and see if user exists already
         *      - if it does, just load user(might not need to load, since have social media info)
         *      - else save user 
         *
         */
    }

    /*
        11/14/14

        BUG: if search for user through twitter, could find a profile linked with 
             twitter and not be the right user. 
    */

    var getUserProfile = function(user, socialInfo, email, payload, site){
        RatingSave.getUserProfile(user)
            .success(function (data) {
                if(error_console){
                    console.log("success! (rs)");
                    console.log('getUserProfile(a): ', data)
                }

                $analytics.eventTrack(analyticsCategory, {  category: 'Writing Review', label: 'getting user profile for: '+email });

                //if no user_profile, then create one
                if(data.count == 0){
                    //console.log('creating user_profile (getUserProfile): ', user)
                    pushUserProf(user, socialInfo, email, payload)
                }
                else{
                    //check to see if id is same for twitter
                    if(site == 'twitter'){
                        if(data.results)
                            userprofile = data.results[0]

                        //console.log('SIid: ', socialInfo.id , ' . tI: ', userprofile.twitter_id)
                        if(socialInfo.id == userprofile.twitter_id){
                            //console.log('matched id!')

                            //push review
                            pushReviewFinal(payload, data, user)
                        }
                        else{
                            //console.log('wrong id')
                            alert('Wrong profile find. Please contact administrator.')
                        }
                    }
                    else{
                        pushReviewFinal(payload, data, user)
                    }

                   
                }

            })
            .error(function(error){
                //console.log('pushUserMain(error): ', error)
                alert('pushUserProfile Error: ', error)
            });
    }

    var pushUserMain = function(socialInfo, email, payload){
        RatingSave.pushUser(socialInfo, email)
            .success(function (user) {
                if(error_console){
                    console.log("success! (rs)");
                    console.log('pushUserMain: ', user)
                }

                //will then push the user_profile
                pushUserProf(user, socialInfo, email, payload);
                $analytics.eventTrack(analyticsCategory, {  category: 'Writing Review', label: 'pushing user profile for: '+email });

            })
            .error(function(error){
                //console.log('sI: ', socialInfo, '. email: ', email, '. pay: ', payload)
                console.log('pushUserMain(error): ', error)
                alert('pushUserMain Error: ', error)
            });
    }

    var pushUserProf = function(user, socialInfo, email, payload){
        //push the user
        RatingSave.pushUserProfile(user, socialInfo, email)
            .success(function (userprof) {
                if(error_console){
                    console.log("success! (rs)");
                    console.log('pushUserProfile: ', userprof)
                }

                //after this, should push the review 
                pushReviewFinal(payload, userprof, user)

            })
            .error(function(error){
                //console.log('pushUserProfile(error): ', user)
                alert('pushUserProf Error: ', error)
            });
    }

    var pushReviewFinal = function(payload, userprofile, user){

        //will need to add user info to the payload
        //console.log('up: ', userprofile)
        //console.log('down: ', payload)
        if(userprofile.results)
            userprofile = userprofile.results[0]
        var new_payload = payload
        //new_payload.user = userprofile.user
        //new_payload.nickname = userprofile.screen_name
        /*
        var user_sub = {"url":user.url, "username":user.username, "email":user.email, "first_name":user.first_name, 
                        "last_name":user.last_name}
        
        var user_new = {"url":userprofile.url, "id":user.id, "user":userprofile.user, "screen_name":userprofile.screen_name,
                        "profile_image_url":userprofile.profile_image_url, "facebook_id":userprofile.facebook_id, 
                        "twitter_id":userprofile.twitter_id, "is_manager":false}

        */
        new_payload.user = userprofile.url
        new_payload.nickname = userprofile.screen_name
        new_payload.user_name = userprofile.screen_name 
        new_payload.user_email = user.email
        //new_payload.locale = userprofile.locale
        new_payload.locale = null

        //console.log('newpayload!: ', new_payload)
        /*
        "user": {
            "url": "http://recommenu-test-api.herokuapp.com/user_profile/1/", 
            "id": 1, 
            "user": {
                "url": "http://recommenu-test-api.herokuapp.com/users/1/", 
                "username": "burger_bob", 
                "email": "burger_bob@gmail.com", 
                "first_name": "Bob", 
                "last_name": "Burgers"
            }, 
            "screen_name": null, 
            "profile_image_url": null, 
            "facebook_id": null, 
            "twitter_id": null, 
            "is_manager": false
        }, 
        */

        //console.log('pushReviewFinal(1) ', new_payload)

        RatingSave.pushReview(new_payload)
            .success(function (c) {
                if(error_console)
                    console.log("success! (rs)");

                //console.log('final: ', c)
                $scope.alias = c.user_name

                socialMediaService.saveReady(true)
                socialMediaService.saveData(user)

                //$scope.outcomed=c;
                //$scope.outcomed="Success. Thank you";
                /*
                $scope.showRatingOverlay = true;

                //must use hide() and show() because of redirects
                $('.overlay-social-content').hide();
                $('.overlay-rating-submitted').show();

                //will need to push sliders now:
                //        var sliders = RatingSave.getSliders();
                //"recommendation" : c.url
                */
                //console.log('sliders: ', RatingSave.getSliders())

                pushsliders(RatingSave.getSliders(), c.url)


            })
            .error(function(error){
                //$scope.errore='Bad call '+error.message;
                //$scope.errore="Not Successful. Sorry";
                alert('pushReviewFinal: ', error)
                //console.log('pushReviewFinal(error): ', error)
            });

    }

    var pushsliders = function(sliders, recommendation_url){

        for(i = 0; i <= sliders.length; i++){

            if(sliders[i] === undefined)
                break
            
            //console.log('slider: ', sliders[i])
            //console.log('url: ', recommendation_url)
            sliders[i].recommendation = recommendation_url

            RatingSave.pushSliders(sliders[i])
            .success(function (c) {

                //console.log('(last)final: ', c)

                //must use hide() and show() because of redirects
                $('.overlay-social-content').hide()
                $('.overlay-rating-submitted').show()
                $scope.showRatingOverlay = true
                //$analytics.eventTrack(analyticsCategory, { category: 'submitted review', label: 'submitted' });
                //console.log('should finish whole review process')
                $('.overlay-rating-submitted').show()
                
            })
            .error(function(error){
                //$scope.errore='Bad call '+error.message;
                //$scope.errore="Not Successful. Sorry";
                alert('pushSliders Error: ',error.message)
                //console.log('pushReviewFinal(error): ', error)
            });
        }

        //console.log('no sliders')
        $('.overlay-social-content').hide()
        $('.overlay-rating-submitted').show()
        $scope.showRatingOverlay = true
        //$analytics.eventTrack(analyticsCategory, {  category: 'submitted review', label: 'submitted' });
        $analytics.eventTrack(analyticsCategory, {  category: 'Writing Review', label: 'review submitted(complete!)' });

        //console.log('should finish whole review process')
        $('.overlay-rating-submitted').show()

        
    }


    /*    
    $scope.gotoBottom = function(){
    
        var old = $location.hash();
        $location.hash('termsA');
        // call $anchorScroll()
        $anchorScroll();
        //$location.hash(old);
    }

    $scope.resetAnchor = function(){
        $location.hash('writeRev');
        $anchorScroll();

    }
    */

    /*
     *  Review submit button should be disabled if form hasn't been filled out
     */
    $scope.shouldBeDisabled = function(){

        //$scope.master = angular.copy(review);
        //var formInput = $scope.master;
        var review = $scope.review;


        if(review == null){
            $('.submit-ratings-btn').addClass('newE')
            return true
        }


        else if(review.title.length != 0 && 
            review.comment.length != 0){

            //console.log('title: ', review.title , ". comment: ", review.comment)


            var sliders = RatingSave.getSliders();
            var stars = RatingSave.getStar();
            //console.log('stars ', stars)


            if(sliders && stars){
                //console.log("has title: ", review.title)
                $('.submit-ratings-btn').removeClass('newE')
                return false
            }
            else{
                $('.submit-ratings-btn').addClass('newE')
                return true
            }
        }

        else{
            if(error_console){
                //console.log("no title: ", review.title)
                //console.log("no comment: ", review.comment)
            }

            $('.submit-ratings-btn').addClass('newE')
            return true
        }

    }

    $scope.showUserLogin = function(bool){
        //console.log('showUserLogin')
        if(bool){
            $scope.showSocialMedia = true
            $('.overlay-social-content').show();
            $('.main-review-content').hide();
        }   
        else{
            $scope.showSocialMedia = false
        }
    }

    /*
    $scope.socialMediaExit = function(){
        console.log('socialMediaExit')
        $('.overlay-social-content').hide();
        $('.main-review-content').show()
    }
    */

    /*
        Make a service that saves user info. 

        Will then be able to check if the user has logged in,
        then can write a review.

        If user clicks a 'yes' or 'write review' - will check for
        user info.  
            has logged in: user can like it, will show user name/names that have liked it 
            hasn't logged in: will slide down and show a login form, with twitter or fb or email
    */

    /*
    $scope.$watch('infoBoxShow', function() {
       console.log('switch');
       
        if(SocialService.hasLoggedIn()){
            $scope.userLoggedIn = true
            $scope.infoBoxShow = false
        }

    });
    */


    socialMediaService.initialize();

    if(socialMediaService.isReady()) {
       //console.log("twitter is already ready: ", socialMediaService.getData());
    }

    /*
    $scope.shouldshow = function(){
        if(socialMediaService.isReady()){

        }
    }
    */

    /*
     *  Signing in with social media (twitter or facebook)
     */
    $scope.socialSignIn = function(site, email){

        
        if (socialMediaService.isReady()) {
                //if the authorization is successful, hide the connect button and display the tweets
                //console.log("got the login from twitter: ", socialMediaService.getData());
        }

        else{
        
        socialMediaService.connectSocial(site)
            .done(function (result) {

             result.me()
                .done(function(me) {
                    //$scope.me = me
                    //$scope.provider = provider
                    if(error_console){
                        console.log("Social Results(main): ",me)
                        console.log("Social Resutls(name): ",me.name)
                    }
                    done = me
                    //socialMediaService.saveReady(true)
                    socialMediaService.saveData(me)

                    //socialMediaService.saveEmail(email)

                    $scope.pushIt(RatingSave.getPayload());
                    
                    if(error_console)
                        console.log("payload; ", RatingSave.getPayload());

                })
                .fail(function(error){
                    alert("socialMedia Error: ", error);
                })
            })

            .fail(function(result){
                alert("socialMedia(b) Error: ", result);
                $scope.errorHe = "You recieved an error: " + result
            })
        }
    }

    /*
     *  Get email when user hasn't made a profile yet
     */
    $scope.submitEmail = function(email){
        
        //console.log("got email ", email)

        //email error checking

        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if(email == null){
            //console.log("error: null")
            $scope.isInvalid = "Please enter an email"
        }

        else if (!filter.test(email)) {
            //alert('Please provide a valid email address');
            $scope.isInvalid = "Please enter a valid email"
        }

        else if(email != null){
            $scope.isInvalid = ""
            //console.log('next step on email')
            var info = RatingSave.getArr()
            var payload = RatingSave.getPayload()

            //RatingSave.saveArr([info, user, payload]);
        

            //console.log(info, ' : ', user, ' : ', payload)

            //push the user
            pushUserMain(info, email, payload)

        }

    }

    $scope.popTermBoxA = function(){
        $('.popTermBox').show()
        $('.main-review-content').hide()
        $scope.termsPop = true
    }

    $scope.popTermBoxB = function(){
        $('.popTermBox').hide()
        $('.main-review-content').show()
        $scope.termsPop = false
    }

    $scope.socialSignOut = function(){
        OAuth.clearCache('twitter')
        OAuth.clearCache('facebook')
    }

    /*
    $scope.showLogIn = function(){
        $scope.infoBoxShow = true
    }
    */

    $scope.showWrite = function(){
        $scope.userLoggedIn = true
        $scope.infoBoxShow = false
        //console.log('should show write');
    }


    /* stars - don't use controller because we need to clear the stars */
    $scope.goldStar = 0;
    $scope.nullStar = 5 - Math.round($scope.goldStar);
    $scope.range = function(min, max, step){
        step = (step === undefined) ? 1 : step;
        var input = [];
        for (var i = min; i <= max; i += step) input.push(i);
            return input;
    };

    $scope.setgold = function(x){
        //console.log('seeting gold')
        if(x % 1 != 0){
            $scope.halfStar = 1;
            $scope.goldStar = Math.floor(x);
            $scope.nullStar = 5 - ($scope.goldStar + $scope.halfStar);
        }
        else{
            $scope.goldStar = Math.round(x);
            $scope.halfStar = 0;
            $scope.nullStar = 5 - $scope.goldStar;
        }
    }

    $scope.goldSelect = function(x){
        $scope.goldStar = x;
        $scope.nullStar = 5 - Math.ceil($scope.goldStar);
        starS = $scope.goldStar;
        RatingSave.saveStar(x);
    }
    $scope.graySelect = function(x){
        $scope.goldStar = x;
        $scope.nullStar = 5 - Math.floor($scope.goldStar);
        starS = $scope.goldStar;
        RatingSave.saveStar(x);
    }

})

.controller('slideAct', function($scope, RatingSave){
    //console.log('enter slideAct')
    $scope.selectRane = 0;
    $scope.perc = 0;
    //console.log('perc: ', $scope.perc)

    // var input = document.getElementById("slider1");
    // input.value = 0;

    //<div class="bar-color" ng-style="{ width: perc + '%' || '0%' }">

    $scope.setSlideRating = function(key, x, slider, count){
        //console.log("got into slideact here: ", x);
        $scope.perc = x;
        RatingSave.saveSlider(key, x/20, slider, count);

        //console.log('cat: ', slider.category, '. x: ', x)
        if(slider.category == "Portion Size"){
            if(x < 33)
                $scope.slider.badge = "small"
            else if(x < 66)
                $scope.slider.badge = "average"
            else
                $scope.slider.badge = "large"
        }
        else if(slider.category == "Spiciness"){
            if(x < 33)
                $scope.slider.badge = "mild"
            else if(x < 66)
                $scope.slider.badge = "medium"
            else
                $scope.slider.badge = "hot"
        }
    }

    $scope.getPerc = function(){

    }
})

/*
 *  Set rating for star-rating
 */
.controller('stars-on-stars', function($scope, RatingSave){
    $scope.goldStar = 0;
    $scope.nullStar = 5 - Math.round($scope.goldStar);
    $scope.range = function(min, max, step){
        step = (step === undefined) ? 1 : step;
        var input = [];
        for (var i = min; i <= max; i += step) input.push(i);
        return input;
    };

    $scope.setgold = function(x){
        //$scope.setgold = function(x){
            if(x % 1 != 0){
                $scope.halfStar = 1;
                $scope.goldStar = Math.floor(x);
                $scope.nullStar = 5 - ($scope.goldStar + $scope.halfStar);
            }
            else{
                $scope.goldStar = Math.round(x);
                $scope.halfStar = 0;
                $scope.nullStar = 5 - $scope.goldStar;
            }
        //}
    }

    $scope.goldSelect = function(x){
        //console.log('goldSelect ',x)
        $scope.goldStar = x;
        $scope.nullStar = 5 - Math.ceil($scope.goldStar);
        //starS = $scope.goldStar;
        //RatingSave.saveStar(x);
    }
    $scope.graySelect = function(x){
        $scope.goldStar = x;
        $scope.nullStar = 5 - Math.floor($scope.goldStar);
        //starS = $scope.goldStar;
        //RatingSave.saveStar(x);
        //console.log('greyselect')
    }

})


