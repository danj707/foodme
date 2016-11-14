/*
TODO

-Need a delete ability from the main menu, red "X" on left side of the minus bar or a trash can, calls the delete function

-Need some type of sorting or ordering ability
-Add Chomp to long portlet recipe names
-Add search for food by type
-When the menu opens, the stars get 'smooshed'
-Open recipe in new window when click on link in portlet
-Add faves

DEBUG
-Why does the updateObject method call the ajax repeatedly?

*/

'use strict';

/* global $ */

let user_data_obj = '';

//data object constructor ---------------------
function db_obj () {
  this.uid = '',
  this.foodID = '',
  this.fromElement = '',
  this.toElement = ''
  this.name = '',
  this.url = '',
  this.rating = ''
}


// db_obj.prototype = {
//   updateObject:function () {
//   }
// }

//construct a new obj
  var db_obj = new db_obj();

//---------------------------------------------

//FUNCTION DEFINITIONS

/*receives array of results from Yummly, loops through array and grabs required data, then
adds a portlet for each search result with respective data fields
*/

//--Rating star function, build up a star for each rating increment, return the appropriate html
function genRating (rating) {
   let html = `Rating: <b id='rating' value=${rating} <span>`;
   for(var i=1;i<=rating;i++) {
      html += '<i class="fa fa-star yellow" aria-hidden="true"></i>';
   }
   html += '</span></b>';
   return html;
}

//--Display the search results in left side pulldown
function dispSearch (result, index, array) {

   let foodID = result.id;
   let recipe_name = result.recipeName = result.recipeName ? result.recipeName : 'Name';
   let rating = result.rating;

   let img = result.imageUrlsBySize[90];

   $('div.column_results').append(
      "<div class='portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all' id=" +
         foodID +
         "><div class='portlet-header ui-widget-header ui-sortable-handle ui-corner-all'><span class='ui-icon ui-icon-minusthick portlet-toggle'></span>" +
         recipe_name +
         "</div><div class='portlet-content'>" +
         "<img src=" +
         img +
         "><p>" +
         genRating(rating) +
         "</p></div></div>");
}

//--LoginUser API call to log user into site
function loginUser(username, password) {
    $('p.error').empty();
    let q_string = {
        'username': username,
        'password': password
    };
    $.ajax({type: "POST", url: "/login", data: q_string, dataType: 'json'}).done(function(result) { //this waits for the ajax to return with a succesful promise object
        //set the global user data obj as the result object from logging in, contains all the info we need
        user_data_obj = result;
        mainPage(result);
    }).fail(function(jqXHR, error) {
        //User login was unsuccessful, due to pw/username combination was wrong
        $('p.login_error').text("We're sorry, that un/pw combination was incorrect.");
    });
}

//--newUser API to create a new user from login/signup main page
function newUser(new_username, new_password, new_email) {
  console.log(new_username, new_password, new_email);
    $('p.error').empty();
    var q_string = {
        'new_username': new_username,
        'new_password': new_password,
        'new_email': new_email
    };
    $.ajax({type: "POST", url: "/users/create", data: q_string, dataType: 'json'}).done(function(result) {
        if (result.username) {
            user_data_obj = result;
            mainPage(result);
        } else {
            $('p.newuser_error').text("Sorry, that username exists already, try another username");
        }
    }).fail(function(jqXHR, error) { //this waits for the ajax to return with an error promise object
        $('p.register_error').text("We're sorry, there was a system error, try again.");
    });
}

//-- searchAPI to search the Yummly API, return the recipe/food data jsonp object
function searchAPI(recipe_search, food_search) {
    $('p.error').empty();
    /*PLACEHOLDER FOR NOW, API should be smart enough to know if we're doing a recipe search or
    a food search */
    let search_params = recipe_search;
    const app_key = '4cc7572d414ad3533abecb16976baa15';
    const app_id = 'ada49da9';
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

//--Displays the main layout page, searches the DB by ID, loads menu data and displays page
function mainPage(result) {
console.log(result);
    $('p.intro').text(`Welcome ${result.username}!  Pulldown the search on the left to search Yummly's recipies, drag and drop them to your menu, or save to your Faves!`);

    //hide the login and new user pages
    $('section.login_transparency').css('display', 'none');
    $('section.newuser_transparency').css('display','none');

    //show the main page
    $('section.container').css('display', 'block');
    $('section.side_search').css('display', 'block');
    $('section.side_faves').css('display', 'block');

    /* For displaying the main menu page, use the result jsonp object obtained from logging in user (contains their saved menu data), then loop through it displaying the appropriate portlets in their respective locations
    */
    for (var key in result) {
        for(var i=0;i<result[key].length;i++) {

            $(`div.column#${key}`).append(
              "<div class='portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all' id=" +
                 result[key][i].foodID +
                 "><div class='portlet-header ui-widget-header ui-sortable-handle ui-corner-all'><span class='ui-icon ui-icon-minusthick portlet-toggle'></span>" +
                 result[key][i].name +
                 "</div><div class='portlet-content'>" +
                 "<img src=" +
                 result[key][i].url +
                 "><p>" +
                 genRating(result[key][i].rating) +
                 "</p></div><i class='fa fa-trash fa-lg' aria-hidden='true'></i></div>");

        }
    }

    //Also have to prefill the 'faves' menu in case the user has some saved.  No need to wait until expanded.
        for(var i=0;i<result.faves.length;i++) {
            $('div.column#faves').append(
              "<div class='portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all' id=" +
                 result.faves[i].foodID +
                 "><div class='portlet-header ui-widget-header ui-sortable-handle ui-corner-all'><span class='ui-icon ui-icon-minusthick portlet-toggle'></span>" +
                 result.faves[i].name +
                 "</div><div class='portlet-content'>" +
                 "<img src=" +
                 result.faves[i].url +
                 "><p>" +
                 genRating(result.faves[i].rating) +
                 "</p></div><i class='fa fa-trash fa-lg' aria-hidden='true'></i></div>");
       }
}

//Add a menu item to the DB
function updateMenu (db_obj) {
      console.log(db_obj);
      var q_string = db_obj;
      $.ajax({
         type: "POST",
         url: "/update",
         data: q_string,
         dataType: 'json'
      }).done(function(result) {
          console.log("Update Successful");
      }).fail(function(jqXHR, error) { //this waits for the ajax to return with an error promise object
          $('p.menu_error').text("We're sorry, there was an error updating your menu, try again later.");
      });
}

//Remove a menu item from the DB
function removeMenu (db_obj) {
      console.log(db_obj);
      var q_string = `uid=${db_obj.uid}&foodID=${db_obj.foodID}&fromElement=${db_obj.fromElement}`;
      console.log(q_string);
      $.ajax({
         type: "DELETE",
         url: `/remove`,
         data: q_string,
         dataType: 'json'
      }).done(function(result) {
          console.log("Remove Successful");
      }).fail(function(jqXHR, error) { //this waits for the ajax to return with an error promise object
          $('p.menu_error').text("We're sorry, there was an error updating your menu, try again later.");
      });
}

//Document Section
$(document).ready(function() {
    //display the login block
    $('section.login_transparency').css('display', 'block');

    //hide the search and display blocks until logged in
    $('section.newuser_transparency').css('display','none');
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
    $('#new_user').click(function(event) {
        event.preventDefault();
        $('section.newuser_transparency').css('display', 'block');

        //turn off the other pages
        $('section.login_transparency').css('display', 'none');
        $('section.container').css('display', 'none');
        $('section.side_search').css('display', 'none');
        $('section.side_faves').css('display', 'none');

    });

    //Handle new user registration event, call API to add user
    $('#register').submit(function(event) {
      //turn on the registration page
      $('section.newuser_transparency').css('display', 'block');

        event.preventDefault();
        let new_username = $('input#new_username').val();
        let new_email = $('input#new_email').val();
        let new_password = $('input#new_password').val();
        if (!new_username && new_password && new_email) {
            $('p.register_error').text("Must enter a username/password/email for a new user signup.");
        } else {
            newUser(new_username, new_password, new_email);
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

    //Main Menu Column Data
   $(".column").sortable({
      connectWith: ".column, .column_results",
      start: function (event, ui) {
            ui.item.toggleClass("highlight");

            //Grab the element the portlet is coming FROM
            db_obj.uid = user_data_obj._id;
            db_obj.fromElement = ui.item["0"].parentElement.id;
            db_obj.foodID = ui.item[0].id;

            removeMenu(db_obj);
      },
      stop: function (event, ui) {
            ui.item.toggleClass("highlight");

            //Grab the element the portlet is going TO
            var toElement = ui.item["0"].parentElement.id;
            db_obj.toElement = toElement;

            /* Get the recipe name, image url and rating from the jquery ui data obj
            wish there was a better way - Too tied into the structure of the html, change one
            thing and this will all break.  Boo.
            */

            db_obj.name = ui.item["0"].children["0"].innerText;
            db_obj.url = ui.item["0"].children[1].lastChild.previousSibling.currentSrc;
            db_obj.rating = ui.item["0"].children[1].children[1].children["0"].attributes[1].nodeValue;

            //Database DEL/UPDATE hook - call the generic API here, pass in update data obj
            updateMenu(db_obj);

      },
      handle: ".portlet-header",
      cancel: ".portlet-toggle",
      placeholder: "portlet-placeholder ui-corner-all",
      opacity: 0.7,
   })
      //remove the ability to copy/paste content from the portlets
      .disableSelection();

      //Search Result column data
    $(".column_results").sortable({
    connectWith: ".column, .column_results",
    start: function (event, ui) {
            ui.item.toggleClass("highlight");

            //Grab the element the portlet is coming FROM
            db_obj.uid = user_data_obj._id;
            db_obj.fromElement = ui.item["0"].parentElement.id;
            db_obj.foodID = ui.item[0].id;
            removeMenu(db_obj);
   },
    stop: function (event, ui) {
            console.log("dropped search result item");
            ui.item.toggleClass("highlight");

            //Grab the element the portlet is going TO
            var toElement = ui.item["0"].parentElement.id;
            db_obj.toElement = toElement;

            /* Get the recipe name, image url and rating from the jquery ui data obj
            wish there was a better way - Too tied into the structure of the html, change one
            thing and this will all break.  Boo.
            */

            db_obj.name = ui.item["0"].children["0"].innerText;
            db_obj.url = ui.item["0"].children[1].lastChild.previousSibling.currentSrc;
            db_obj.rating = ui.item["0"].children[1].children[1].children["0"].attributes[1].nodeValue;

            updateMenu(db_obj);

   },
    handle: ".portlet-header",
    cancel: ".portlet-toggle",
    placeholder: "portlet-placeholder ui-corner-all"
  })
        //remove the ability to copy/paste content from the portlets
        .disableSelection();

    $(".portlet").addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all").find(".portlet-header").addClass("ui-widget-header ui-corner-all").prepend("<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

    $(".search-slide").click(function() {
        $("#panel").slideToggle("slow");
        $("i").toggleClass("fa-plus fa-minus");
    });
    $(".faves-slide").click(function() {
        $("#panel_faves").slideToggle("slow");
        $("i").toggleClass("fa-plus fa-minus");
    });

});

$(document).on("click", '.portlet-toggle', function() {
    var icon = $(this);
    icon.toggleClass("ui-icon-minusthick ui-icon-plusthick");
    icon.closest(".portlet").find(".portlet-content").toggle();
});

$(document).on("click", '.fa-trash', function(event, ui) {
  console.log('delete');

  // //Grab the element the portlet is coming FROM
  db_obj.uid = user_data_obj._id;
  db_obj.fromElement = event.target.parentElement.parentElement.attributes[1].nodeValue;
  db_obj.foodID = event.target.parentElement.id;

  removeMenu(db_obj);

  //Clicking the delete also removes it from the DOM
  $(this).parent().remove();

});
