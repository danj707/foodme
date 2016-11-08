'use strict';

/* global $ */

/*Demo Data, mimicking the Json object we should get back from Yummly, after being mapped into our result object.  Precursor to displaying the menu

Overall Menu Array
6 Day objects
Each Day has an object with arrays for each 'meal', breakfast, etc.
The day meal object contains all the relevant information for each 'Meal' card, such
as the name, content, recipe id number, url for image, etc
*/

//Define day vars
let monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    weekend;

//Demo data object
let demoData = {
    username: 'dan',
    password: 'test',
    email: 'dan@email.com',
    menu: [
        monday = {
            breakfast: [
                'cereal', 12345
            ],
            lunch: [
                'sandwich', 125412312
            ],
            dinner: ['spaghetti', 23423]
        },
        tuesday = {
            breakfast: 'cereal',
            lunch: 'sandwich',
            dinner: 'chicken'
        },
        wednesday = {
            breakfast: 'cereal',
            lunch: 'sandwich',
            dinner: 'chicken'
        },
        thursday = {
            breakfast: 'cereal',
            lunch: 'sandwich',
            dinner: 'chicken'
        },
        friday = {
            breakfast: 'cereal',
            lunch: 'sandwich',
            dinner: 'chicken'
        },
        weekend = {
            breakfast: 'cereal',
            lunch: 'sandwich',
            dinner: 'chicken'
        }
    ]
};

//console.log(demoData);
//console.log(monday.breakfast[0]);

//Functions

/*receives array of results from Yummly, loops through array and grabs required data, then
adds a portlet for each search result.
*/
function dispSearch (result, index, array) {

      let id = result.id;
      let recipe_name = result.recipeName = result.recipeName ? result.recipeName : 'Name';
      let rating = result.rating;
      let img = result.imageUrlsBySize[90];
   console.log(id, recipe_name, rating, img);

   $('div.column_results').append("<div class='portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all' id=" + id + "><div class='portlet-header ui-widget-header ui-corner-all'><span class='ui-icon ui-icon-minusthick portlet-toggle'></span>" + recipe_name + "</div><div class='portlet-content'>" + "<p>Content</p>" + "<img src=" + img + "><p>Rating:" + rating + "</p></div></div>");

}

//--loginUser API call to log user into site
function loginUser(username, password) {
    $('p.error').empty();
    let q_string = {
        'username': username,
        'password': password
    };
    $.ajax({type: "POST", url: "/login", data: q_string, dataType: 'json'}).done(function(result) { //this waits for the ajax to return with a succesful promise object
        //display main page here after logging in
        console.log("successful login");
        mainPage(result);
    }).fail(function(jqXHR, error) {
        //User login was unsuccessful, due to pw/username combination was wrong
        $('p.login_error').text("We're sorry, that un/pw combination was incorrect.");
    });
}

//--newUser API to create a new user from login/signup main page
function newUser(username, password) {
    $('p.error').empty();
    var q_string = {
        'username': username,
        'password': password
    };
    $.ajax({type: "POST", url: "/users/create", data: q_string, dataType: 'json'}).done(function(result) {
        if (result.username) {
            mainPage(result);
        } else {
            $('p.newuser_error').text("Sorry, that username exists already, try another username");
        }
    }).fail(function(jqXHR, error) { //this waits for the ajax to return with an error promise object
        $('p.newuser_error').text("We're sorry, there was a system error, try again.");
    });
}

//--newUser API to create a new user from login/signup main page
function searchAPI(recipe_search, food_search) {
    $('p.error').empty();
    /*PLACEHOLDER FOR NOW, API should be smart enough to know if we're doing a recipe search or
    a food search */
    let search_params = recipe_search;
    const app_key = '4cc7572d414ad3533abecb16976baa15';
    const app_id = 'ada49da9';
    console.log(search_params);
    $.ajax({
        type: "GET",
        url: "http://api.yummly.com/v1/api/recipes?_app_id=" + app_id + "&_app_key=" + app_key + "&q=" + search_params,
        dataType: 'jsonp'
    }).done(function(result) {
        console.log(result);
        result.matches.forEach(dispSearch);
    }).fail(function(jqXHR, error) { //this waits for the ajax to return with an error promise object
        $('p.newuser_error').text("We're sorry, there was a system error, try again.");
    });
}

//Displays the main layout page
function mainPage(result) {
    $('section.login_transparency').css('display', 'none');

    $('section.container').css('display', 'block');
    $('section.side_search').css('display', 'block');
    $('section.side_faves').css('display', 'block');
}

//Document Section
$(document).ready(function() {
    //display the login block
    $('section.login_transparency').css('display', 'block');

    //hide the search and display blocks until logged in
    $('section.container').css('display', 'none');
    $('section.side_search').css('display', 'none');
    $('section.side_faves').css('display', 'none');

    //Handle login event, call API to login user
    $('#login').submit(function(event) {
        event.preventDefault();
        var username = $('input#username').val();
        var password = $('input#password').val();
        loginUser(username, password);
    });

    //Handle new user registration event, call API to add user
    $('#new_user').submit(function(event) {
        event.preventDefault();
        var username = $('input#new_username').val();
        var password = $('input#new_password').val();
        if (!username && password) {
            $('p.error').text("Must enter a username/password for a new user signup.");
        } else {
            newUser(username, password);
        }
    });

    //Recipe/food search, search API from form
    $('#foodsearch').submit(function(event) {
        event.preventDefault();
        var recipe_search = $('select#recipe_search').val();
        var food_search = $('input#food_search').val();
        console.log(recipe_search, food_search);
        if(recipe_search && food_search) {
            console.log("selected two");
            $('p.search_error').text("Please only choose recipes OR food search");
        } else if (recipe_search || food_search) {
            //Search Yummly, can't have both defined, but API call will determine which one to use
            $('div.column_results').empty();
            searchAPI(recipe_search, food_search);
        } else {
           //didn't select anything!
            $('p.search_error').text("Please choose from one of the above.");
        }

    });

    $(".column").sortable({connectWith: ".column, .column_results",
    start: function (event, ui) {
      console.log("picked up");
            ui.item.toggleClass("highlight");
   },
   stop: function (event, ui) {
            ui.item.toggleClass("highlight");
   }, handle: ".portlet-header", cancel: ".portlet-toggle", placeholder: "portlet-placeholder ui-corner-all"});

    $(".column_results").sortable({connectWith: ".column, .column_results",
    start: function (event, ui) {
      console.log("picked up");
            ui.item.toggleClass("highlight");
   },
   stop: function (event, ui) {
            ui.item.toggleClass("highlight");
   }, handle: ".portlet-header", cancel: ".portlet-toggle", placeholder: "portlet-placeholder ui-corner-all"});

    $(".portlet").addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all").find(".portlet-header").addClass("ui-widget-header ui-corner-all").prepend("<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

    $(".portlet-toggle").on("click", function() {
        var icon = $(this);
        icon.toggleClass("ui-icon-minusthick ui-icon-plusthick");
        icon.closest(".portlet").find(".portlet-content").toggle();
    });

    $(".search-slide").click(function() {
        $("#panel").slideToggle("slow");
        $("i").toggleClass("fa-plus fa-minus");
    });
    $(".faves-slide").click(function() {
        $("#panel_faves").slideToggle("slow");
        $("i").toggleClass("fa-plus fa-minus");
    });

});
