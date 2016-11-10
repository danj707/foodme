'use strict';

/* global $ */

/*Demo Data, mimicking the Json object we should get back from Yummly, after being mapped into our result object.  Precursor to displaying the menu

Overall Menu Array
6 Day objects
Each Day has an object with arrays for each 'meal', breakfast, etc.
The day meal object contains all the relevant information for each 'Meal' card, such
as the name, content, recipe id number, url for image, etc
*/

//DEMO DATA OBJECT FOR TESTING

//Define day vars
let monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday;

let demoData = {
    username: 'dan',
    password: 'test',
    email: 'dan@email.com',
    //each menu array
    menu : {
      monday : [  {id: 'Chicken-Fontaine-12342342',
                  name: "Chicken Fontaine",
                  url: "https://lh3.googleusercontent.com/6QJSiZWvnrnF4KJpgBeFd0U3aeZ1Zxrl7DQaaaT0kaOFPT724msNVWZbr6MWzb6lDxnb6q719RhXMNzAV9zLCjk=s90-c",
                  rating: 4},
                  {id: 'Veggie-Lasagna-7234234',
                  name: "Veggie Lasagna",
                  url: 'https://lh3.googleusercontent.com/6QJSiZWvnrnF4KJpgBeFd0U3aeZ1Zxrl7DQaaaT0kaOFPT724msNVWZbr6MWzb6lDxnb6q719RhXMNzAV9zLCjk=s90-c',
                  rating: 3}
      ],
      tuesday : [ {id: 'Chicken-Marsala-135235',
                  name: "Chicken Marsala",
                  url: 'https://lh3.googleusercontent.com/6QJSiZWvnrnF4KJpgBeFd0U3aeZ1Zxrl7DQaaaT0kaOFPT724msNVWZbr6MWzb6lDxnb6q719RhXMNzAV9zLCjk=s90-c',
                  rating: 4},
                  {id: 'Corn-Beef-Hash-34234',
                  name: "Corned Beef Hash",
                  url: 'https://lh3.googleusercontent.com/6QJSiZWvnrnF4KJpgBeFd0U3aeZ1Zxrl7DQaaaT0kaOFPT724msNVWZbr6MWzb6lDxnb6q719RhXMNzAV9zLCjk=s90-c',
                  rating: 2},
                  {id: 'Crepes-2342342',
                  name: "Crepes",
                  url: 'https://lh3.googleusercontent.com/6QJSiZWvnrnF4KJpgBeFd0U3aeZ1Zxrl7DQaaaT0kaOFPT724msNVWZbr6MWzb6lDxnb6q719RhXMNzAV9zLCjk=s90-c',
                  rating:4}
      ],
      wednesday : [ {id: 'Linguine-531532',
                  name: "Sausage Linguine",
                  url: 'https://lh3.googleusercontent.com/6QJSiZWvnrnF4KJpgBeFd0U3aeZ1Zxrl7DQaaaT0kaOFPT724msNVWZbr6MWzb6lDxnb6q719RhXMNzAV9zLCjk=s90-c',
                  rating: 4}
      ],
      thursday : [ {id: 'Beef-Marsala-135235',
                  name: "Beef Marsala",
                  url: 'https://lh3.googleusercontent.com/6QJSiZWvnrnF4KJpgBeFd0U3aeZ1Zxrl7DQaaaT0kaOFPT724msNVWZbr6MWzb6lDxnb6q719RhXMNzAV9zLCjk=s90-c',
                  rating: 4},
                  {id: 'Corn-Beef-Hash-34234',
                  name: "Corned Beef Hash",
                  url: 'https://lh3.googleusercontent.com/6QJSiZWvnrnF4KJpgBeFd0U3aeZ1Zxrl7DQaaaT0kaOFPT724msNVWZbr6MWzb6lDxnb6q719RhXMNzAV9zLCjk=s90-c',
                  rating: 2},
                  {id: 'Crepes-2342342',
                  name: "Crepes",
                  url: 'https://lh3.googleusercontent.com/6QJSiZWvnrnF4KJpgBeFd0U3aeZ1Zxrl7DQaaaT0kaOFPT724msNVWZbr6MWzb6lDxnb6q719RhXMNzAV9zLCjk=s90-c',
                  rating:4}
      ],
      friday : [ {id: 'Chicken-Marsala-135235',
                  name: "Chicken Marsala",
                  url: 'https://lh3.googleusercontent.com/6QJSiZWvnrnF4KJpgBeFd0U3aeZ1Zxrl7DQaaaT0kaOFPT724msNVWZbr6MWzb6lDxnb6q719RhXMNzAV9zLCjk=s90-c',
                  rating: 4},
                  {id: 'Corn-Beef-Hash-34234',
                  name: "Corned Beef Hash",
                  url: 'https://lh3.googleusercontent.com/6QJSiZWvnrnF4KJpgBeFd0U3aeZ1Zxrl7DQaaaT0kaOFPT724msNVWZbr6MWzb6lDxnb6q719RhXMNzAV9zLCjk=s90-c',
                  rating: 2},
                  {id: 'Cereal-23423',
                  name: "Cereal",
                  url: 'https://lh3.googleusercontent.com/6QJSiZWvnrnF4KJpgBeFd0U3aeZ1Zxrl7DQaaaT0kaOFPT724msNVWZbr6MWzb6lDxnb6q719RhXMNzAV9zLCjk=s90-c',
                  rating:4},
                  {id: 'Crepes-2342342',
                  name: "Crepes",
                  url: 'https://lh3.googleusercontent.com/6QJSiZWvnrnF4KJpgBeFd0U3aeZ1Zxrl7DQaaaT0kaOFPT724msNVWZbr6MWzb6lDxnb6q719RhXMNzAV9zLCjk=s90-c',
                  rating:3}
      ],
      saturday : [ {id: 'Chicken-Marsala-135235',
                  name: "Chicken Marsala",
                  url: 'https://lh3.googleusercontent.com/6QJSiZWvnrnF4KJpgBeFd0U3aeZ1Zxrl7DQaaaT0kaOFPT724msNVWZbr6MWzb6lDxnb6q719RhXMNzAV9zLCjk=s90-c',
                  rating: 4},
                  {id: 'Corn-Beef-Hash-34234',
                  name: "Corned Beef Hash",
                  url: 'https://lh3.googleusercontent.com/6QJSiZWvnrnF4KJpgBeFd0U3aeZ1Zxrl7DQaaaT0kaOFPT724msNVWZbr6MWzb6lDxnb6q719RhXMNzAV9zLCjk=s90-c',
                  rating: 2}
      ],
      sunday : [ {id: 'Mac-And-Cheese-61313',
                  name: "Mac N Cheese",
                  url: 'https://lh3.googleusercontent.com/6QJSiZWvnrnF4KJpgBeFd0U3aeZ1Zxrl7DQaaaT0kaOFPT724msNVWZbr6MWzb6lDxnb6q719RhXMNzAV9zLCjk=s90-c',
                  rating: 1}
      ],
    }
};

//console.log(demoData.menu);

//Function Definitions

/*receives array of results from Yummly, loops through array and grabs required data, then
adds a portlet for each search result with respective data fields
*/

//Rating star function, build up a star for each rating increment, return the appropriate html
function genRating (rating) {
   let html = '<span>';
   for(var i=1;i<=rating;i++) {
      html += '<i class="fa fa-star yellow" aria-hidden="true"></i>';
   }
   html += '</span>';
   return html;
}

function dispSearch (result, index, array) {

   let id = result.id;
   let recipe_name = result.recipeName = result.recipeName ? result.recipeName : 'Name';
   let rating = result.rating;

   let img = result.imageUrlsBySize[90];

   $('div.column_results').append(
      "<div class='portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all' id=" +
         id +
         "><div class='portlet-header ui-widget-header ui-sortable-handle ui-corner-all'><span class='ui-icon ui-icon-minusthick portlet-toggle'></span>" +
         recipe_name +
         "</div><div class='portlet-content'>" +
         "<img src=" +
         img +
         "><p><b>Rating:" +
         genRating(rating) +
         "</b></p></div></div>");
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
    //console.log(search_params);
    $.ajax({
        type: "GET",
        url: `http://api.yummly.com/v1/api/recipes?_app_id=${app_id}&_app_key=${app_key}&q= ${search_params}`,
        dataType: 'jsonp'
    }).done(function(result) {
        console.log(result);
        result.matches.forEach(dispSearch);
    }).fail(function(jqXHR, error) { //this waits for the ajax to return with an error promise object
        $('p.newuser_error').text("We're sorry, there was a system error, try again.");
    });
}

//Displays the main layout page, searches the DB by ID, loads menu data and displays page
function mainPage(result) {
    $('section.login_transparency').css('display', 'none');

    $('section.container').css('display', 'block');
    $('section.side_search').css('display', 'block');
    $('section.side_faves').css('display', 'block');

    /*For each day of the week in the data obj, target the respective column, generate the data portlets for each day, sorted properly, output portlets
    */

    for (var key in demoData.menu) {
        for(var i=0;i<demoData.menu[key].length;i++) {
         $(`div.column#${key}`).append(
           "<div class='portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all' id=" +
              demoData.menu[key][i].id +
              "><div class='portlet-header ui-widget-header ui-sortable-handle ui-corner-all'><span class='ui-icon ui-icon-minusthick portlet-toggle'></span>" +
              demoData.menu[key][i].name +
              "</div><div class='portlet-content'>" +
              "<p>Content</p>" +
              "<img src=" +
              demoData.menu[key][i].url +
              "><p>Rating:" +
              genRating(demoData.menu[key][i].rating) +
              "</p></div></div>");
        }
    }
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
        //console.log(recipe_search, food_search);
        if(recipe_search && food_search) {
            //console.log("selected two");
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

    //create an object to store the ID, where to move the portlet FROM and TO
    let db_obj = {
      ID: '',
      fromElement : '',
      toElement : ''
   }

   $(".column").sortable({
      connectWith: ".column, .column_results",
      start: function (event, ui) {
            ui.item.toggleClass("highlight");

            //reset the object each time you pick up a new portlet
            db_obj.ID = '';
            db_obj.fromElement = '';
            db_obj.toElement = '';

            //get the parent element taking FROM and the ID, write to db update object
            var fromElement = ui.item["0"].parentElement.id;
            db_obj.fromElement = fromElement;
            db_obj.ID = ui.item[0].id;

            //make an array from the list of items in the sort column
            var start_order = $(this).sortable("toArray");

            //Log where we're taking it FROM
            //console.log(db_obj);
      },
      stop: function (event, ui) {
            ui.item.toggleClass("highlight");

            var toElement = ui.item["0"].parentElement.id;
            db_obj.toElement = toElement;

            console.log("REMOVE " + db_obj.ID + " FROM: " + db_obj.fromElement + " AND ADD TO: " + db_obj.toElement);
            var selector = ui.item[0].parentElement;
            var end_order = $(selector).sortable("toArray");
            console.log(db_obj.toElement + " is now: " + end_order);
      },
      handle: ".portlet-header",
      cancel: ".portlet-toggle",
      placeholder: "portlet-placeholder ui-corner-all",
      opacity: 0.7,
   })
      //remove the ability to copy/paste content from the portlets
      .disableSelection();

    $(".column_results").sortable({connectWith: ".column, .column_results",
    start: function (event, ui) {
            console.log("picked up search result item");
            var order = $(".column_results").sortable("serialize", {key:'id'});
            console.log(order);
            ui.item.toggleClass("highlight");
   },
    stop: function (event, ui) {
            console.log("dropped search result item");
            ui.item.toggleClass("highlight");
   }, handle: ".portlet-header", cancel: ".portlet-toggle", placeholder: "portlet-placeholder ui-corner-all"});

    $(".portlet").addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all").find(".portlet-header").addClass("ui-widget-header ui-corner-all").prepend("<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

    $(".portlet-toggle").on("click", function() {
      console.log('clicked toggler');
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
