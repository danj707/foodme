/*
TODO - Improvements and Fixes

Next Version:
-Dragging from the Faves menu shouldn't remove it, only the trashcan should
-Sort the days either by sort in place (how they were drag and dropped, or alpha)
-Email address verification (at least that it's at least a correctly formatted email address)
-Text wrapping of headers; currently running into the fa-minus

All:
-API documentation
-Description/instruction text
-Mobile responsiveness Checks

Deployment:
-Push to Heroku and test

-README
-Screenshots

*/

'use strict';
/* global $ */

// Define some globals
let user_data_obj = '';
const app_key = '4cc7572d414ad3533abecb16976baa15';
const app_id = 'ada49da9';

// Data object constructor, holds items passed to DB on portlet pick up/drop
function db_obj () {
  this.uid = '',
  this.foodID = '',
  this.fromElement = '',
  this.toElement = ''
  this.name = '',
  this.url = '',
  this.rating = '',
  this.link = ''
}

// construct a new obj
  var db_obj = new db_obj();

//---------------------------------------------

//FUNCTION DEFINITIONS

// --Rating star function, build up a star for each rating increment, return the appropriate html
function genRating (rating) {
   let html = `Rating: <b id='rating' value=${rating} <span>`;
   for(var i=1;i<=rating;i++) {
      html += '<i class="fa fa-star yellow" aria-hidden="true"></i>';
   }
   html += '</span></b>';
   return html;
}

/*
Receives array of results from Yummly, loops through array and grabs required data, then
adds a portlet for each search result with respective data fields
*/

function dispSearch (result, index, array) {
   let foodID = result.id;
   let recipe_name = result.recipeName = result.recipeName ? result.recipeName : 'Name';
   let rating = result.rating;

   let link = `https://www.yummly.com/recipes?q=`;
   let encoded_name = encodeURIComponent(recipe_name);
   link += encoded_name;
   let img = result.imageUrlsBySize[90];

   $('div.column_results').append(
      "<div class='portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all' id=" +
         foodID +
         "><div class='portlet-header ui-widget-header ui-sortable-handle ui-corner-all'><span class='ui-icon ui-icon-minusthick portlet-toggle'><i class='fa fa-hand-o-right' aria-hidden='true'></i> Grab Me </span>" +
         recipe_name +
         "</div><div class='portlet-content'>" +
         "<img src=" +
         img +
         "><p>" +
         genRating(rating) +
         `</p></div><div><a href="${link}" target='_blank' class="external_link"><i class="fa fa-external-link" aria-hidden="true"></i> View Recipe </a><i class='fa fa-trash fa-lg' aria-hidden='true' id="search"></i></div>`);
}

// --LoginUser API call to log user into site
function loginUser(username, password) {
    $('p.error').empty();
    let q_string = {
        'username': username,
        'password': password
    };
    $.ajax({type: "POST", url: "/login", data: q_string, dataType: 'json'})
    .done(function(result) {
        user_data_obj = result;
        mainPage(result);
    }).fail(function(jqXHR, error) {

        //User login was unsuccessful, due to pw/username combination was wrong
        $('p.login_error').text("We're sorry, that un/pw combination was incorrect.");
    });
}

// --newUser API to create a new user from login/signup main page
function newUser(new_username, new_password, new_email) {
    $('p.error').empty();
    var q_string = {
        'new_username': new_username,
        'new_password': new_password,
        'new_email': new_email
    };
    $.ajax({
      type: "POST",
      url: "/users/create",
      data: q_string,
      dataType: 'json'
    }).done(function(result) {
        if (result.username) {
            user_data_obj = result;
            mainPage(result);
        } else {
            $('p.newuser_error').text("Sorry, that username exists already, try another username");
        }
    }).fail(function(jqXHR, error) {
        $('p.register_error').text("We're sorry, there was a system error, try again.");
    });
}

// --searchAPI to search the Yummly API, return the recipe/food data jsonp object
function searchAPI(recipe_search, food_search) {
    $('p.search_error').empty();
    let search_params = 'default';

    if(recipe_search) {
      //use the recipe search
      search_params = recipe_search;
    } else if(food_search) {
      //Or, use the food search
      search_params = food_search;
    }

    $.ajax({
        type: "GET",
        url: `https://api.yummly.com/v1/api/recipes?_app_id=${app_id}&_app_key=${app_key}&q= ${search_params}`,
        dataType: 'jsonp'
    }).done(function(result) {
      let results_length = result.matches.length;
      $('div.column_results').append(`Search Results (${results_length})`);
        result.matches.forEach(dispSearch);
    }).fail(function(jqXHR, error) {
        $('p.newuser_error').text("We're sorry, there was a system error, try again.");
    });
}

// --Displays the main layout page, searches the DB by ID, loads menu data and displays page
function mainPage(result) {
    $('p.intro').text(`Welcome ${result.username}!  Pulldown the search on the left to search Yummly's recipes, drag and drop them to your menu, or save to your Faves!`);

    // hide the login and new user pages
    $('section.login_transparency').css('display', 'none');
    $('section.newuser_transparency').css('display','none');

    // show the main page
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
                 `</div><div class='portlet-content' id=${key}>` +
                 "<img src=" +
                 result[key][i].url +
                 "><p>" +
                 genRating(result[key][i].rating) +
                 `</p></div><div><a href=${result[key][i].link} target='_blank' class="external_link"><i class="fa fa-external-link" aria-hidden="true"></i> View Recipe </a><i class='fa fa-trash fa-lg' aria-hidden='true' id=${key}></i></div>`);
        }
    }

    // Also have to prefill the 'faves' menu in case the user has some saved.  No need to wait until expanded.

        for(var i=0;i<result.faves.length;i++) {
            $('div.column_faves').append(
              "<div class='portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all' id=" +
                 result.faves[i].foodID +
                 "><div class='portlet-header ui-widget-header ui-sortable-handle ui-corner-all'><span class='ui-icon ui-icon-minusthick portlet-toggle'></span>" +
                 result.faves[i].name +
                 "</div><div class='portlet-content'>" +
                 "<img src=" +
                 result.faves[i].url +
                 "><p>" +
                 genRating(result.faves[i].rating) +
                 `</p></div><div><a href=${result.faves[i].link} target='_blank' class="external_link"><i class="fa fa-external-link" aria-hidden="true"></i> View Recipe </a><i class='fa fa-trash fa-lg' aria-hidden='true' id="faves"></i></div>`);
       }
}

// Add a menu item to the DB
function updateMenu (db_obj) {
      var q_string = db_obj;
      $.ajax({
         type: "POST",
         url: "/update",
         data: q_string,
         dataType: 'json'
      }).done(function(result) {
          //console.log("Update Successful");
          $('p.menu_success').text("Menu item added!");
      }).fail(function(jqXHR, error) { //this waits for the ajax to return with an error promise object
          $('p.menu_error').text("We're sorry, there was an error updating your menu, try again later.");
      });
}

// Remove a menu item from the DB
function removeMenu (db_obj) {
//      var q_string = `uid=${db_obj.uid}&foodID=${db_obj.foodID}&fromElement=${db_obj.fromElement}`;
      var q_string = db_obj;

      $.ajax({
         type: "DELETE",
         url: `/remove`,
         data: q_string,
         dataType: 'json'
      }).done(function(result) {
          $('p.menu_success').text("Menu item removed!");
      }).fail(function(jqXHR, error) {
          $('p.menu_error').text("We're sorry, there was an error updating your menu, try again later.");
      });
}

function trashCan (db_obj) {
  // Update the <i> attr to the day to remove from if delete clicked
    $(`div.column#${db_obj.toElement}`).find( "i.fa-trash" ).attr({"id":`${db_obj.toElement}`});
}

// --Document Section--
$(document).ready(function() {

    // display the login block
    $('section.login_transparency').css('display', 'block');

    // hide the search and display blocks until logged in
    $('section.newuser_transparency').css('display','none');
    $('section.container').css('display', 'none');
    $('section.side_search').css('display', 'none');
    $('section.side_faves').css('display', 'none');

    // Handle login event, call API to login user
    $('#login').submit(function(event) {
        event.preventDefault();
        var username = $('input#username').val();
        var password = $('input#password').val();
        loginUser(username, password);
    });

    // Handle new user registration event, call API to add user
    $('#new_user').click(function(event) {
        event.preventDefault();
        $('section.newuser_transparency').css('display', 'block');

        // turn off the other pages
        $('section.login_transparency').css('display', 'none');
        $('section.container').css('display', 'none');
        $('section.side_search').css('display', 'none');
        $('section.side_faves').css('display', 'none');

    });

    // Handle new user registration event, call API to add user
    $('#register').submit(function(event) {
      // turn on the registration page
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

    // Recipe/food search, search API from form
    $('#foodsearch').submit(function(event) {
        event.preventDefault();
        var recipe_search = $('select#recipe_search').val();
        var food_search = $('input#food_search').val();
        if(recipe_search && food_search) {
            $('p.search_error').text("Please only choose recipes OR food search. Click the clear button to start over.");
        } else if (recipe_search || food_search) {
            //Search Yummly, can't have both defined, but API call will determine which one to use
            $('div.column_results').empty();
            searchAPI(recipe_search, food_search);
        } else {
            $('p.search_error').text("Please choose from either recipes OR food type.");
        }
    });

    // Main Menu Column Data
   $(".column").sortable({
      connectWith: ".column, .column_results, .column_faves",
      start: function (event, ui) {
            ui.item.toggleClass("highlight");

            // Grab the element the portlet is coming FROM
            db_obj.uid = user_data_obj._id;
            db_obj.fromElement = ui.item["0"].parentElement.id;
            db_obj.foodID = ui.item[0].id;

            removeMenu(db_obj);
      },
      stop: function (event, ui) {
            ui.item.toggleClass("highlight");

            // Grab the element the portlet is going TO
            var toElement = ui.item["0"].parentElement.id;
            db_obj.toElement = toElement;

            /*
            Get the recipe name, image url and rating from the jquery ui data obj
            wish there was a better way - Too tied into the structure of the html, change one
            thing and this will all break.  Boo.
            */

            // update the trashcan link
            trashCan(db_obj);

            db_obj.name = ui.item["0"].children["0"].innerText;
            db_obj.url = ui.item["0"].children[1].lastChild.previousSibling.currentSrc;
            db_obj.rating = ui.item["0"].children[1].children[1].children["0"].attributes[1].nodeValue;
            db_obj.link = ui.item["0"].children[2].children["0"].href;

            // update the DB
            updateMenu(db_obj);
      },
      handle: ".portlet-header",
      cancel: ".portlet-toggle",
      placeholder: "portlet-placeholder ui-corner-all",
      opacity: 0.7,
   })
      // Disable the ability to copy/paste content from the portlets
      .disableSelection();

      // Search Result column data
    $(".column_results").sortable({
    connectWith: ".column, .column_results, .column_faves",
    start: function (event, ui) {
            ui.item.toggleClass("highlight");

            // Grab the element the portlet is coming FROM
            db_obj.uid = user_data_obj._id;
            db_obj.fromElement = 'search';
            db_obj.foodID = ui.item[0].id;
            removeMenu(db_obj);
   },
    stop: function (event, ui) {
            ui.item.toggleClass("highlight");

            /*
            Have to handle the case where a recipe is picked up from the search results, and dropped back in the search results.  In this case, the parentElement id is not undefined or null, it's an empty string in the ui.item object.  So, set the toElement = to search so the trashcan will work.
            */

            if(ui.item[0].parentElement.id === '') {
              // Picked up and dropped back in search
              db_obj.toElement = 'search';
              // Picked up from search, dropped in the menu
            } else {
              db_obj.toElement = ui.item[0].parentElement.id;
            }

            /*
            Get the recipe name, image url and rating from the jquery ui data obj
            wish there was a better way - Too tied into the structure of the html, change one
            thing and this will all break.  Boo.
            */

            db_obj.name = ui.item["0"].children["0"].innerText;
            db_obj.url = ui.item["0"].children[1].lastChild.previousSibling.currentSrc;
            db_obj.rating = ui.item["0"].children[1].children[1].children["0"].attributes[1].nodeValue;
            db_obj.link = ui.item["0"].children[2].children["0"].href;

            // update the trashcan link
            trashCan(db_obj);

            // update the DB
            if(db_obj.toElement === 'search') {
              // skip doing anything, just drag/drop on the search results bar, no DB update needed
            } else {
              updateMenu(db_obj);
            }

   },
    handle: ".portlet-header",
    cancel: ".portlet-toggle",
    placeholder: "portlet-placeholder ui-corner-all"
  })
        // remove the ability to copy/paste content from the portlets
        .disableSelection();

    $(".column_faves").sortable({
        connectWith: ".column, .column_results, .column_faves",
        start: function (event, ui) {
              ui.item.toggleClass("highlight");

              // Grab the element the portlet is coming FROM
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

              /*
              Get the recipe name, image url and rating from the jquery ui data obj
              wish there was a better way - Too tied into the structure of the html, change one
              thing and this will all break.  Boo.
              */

              db_obj.name = ui.item["0"].children["0"].innerText;
              db_obj.url = ui.item["0"].children[1].lastChild.previousSibling.currentSrc;
              db_obj.rating = ui.item["0"].children[1].children[1].children["0"].attributes[1].nodeValue;
              db_obj.link = ui.item["0"].children[2].children["0"].href;

              // Database DEL/UPDATE hook - call the generic API here, pass in update data obj
              updateMenu(db_obj);

        },
        handle: ".portlet-header",
        cancel: ".portlet-toggle",
        placeholder: "portlet-placeholder ui-corner-all",
        opacity: 0.7,
        })
        // remove the ability to copy/paste content from the portlets
        .disableSelection();

    $(".portlet").addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all").find(".portlet-header").addClass("ui-widget-header ui-corner-all").prepend("<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

    $(".search-slide").click(function() {
        $("#panel").slideToggle("slow");
        $("i#search").toggleClass("fa-plus fa-minus");
    });
    $(".faves-slide").click(function() {
        $("#panel_faves").slideToggle("slow");
        $("i#faves").toggleClass("fa-plus fa-minus");
    });
});

$(document).on("click", '.portlet-toggle', function() {
    var icon = $(this);
    icon.toggleClass("ui-icon-minusthick ui-icon-plusthick");
    icon.closest(".portlet").find(".portlet-content").toggle();
});

$(document).on("click", '.fa-trash', function(evt) {
  // Grab the element the portlet is coming FROM
  db_obj.uid = user_data_obj._id;

    /*
    Handle where the original target of the delete (trash can icon) is coming from:
    -If it's from the search results, just remove the item from the document
    -If it's in the menu or the faves, we need to actually remove it from the DOM AND the Database
    */

    db_obj.uid = user_data_obj._id;

    /*
    Checking to see if the search results has a certain element in the event (evt)
    object
    */

    if (evt.originalEvent.target.id){
      if(evt.originalEvent.target.id === 'search') {
          $(this).parent().parent().remove();
      }

      db_obj.foodID = evt.originalEvent.target.parentElement.parentElement.id;
      db_obj.fromElement = evt.originalEvent.target.id;

      removeMenu(db_obj);
      $(this).parent().parent().remove();
    }



});
