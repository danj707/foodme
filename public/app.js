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
let monday, tuesday, wednesday, thursday, friday, weekend;

//Demo data object
let demoData = {
  username: 'dan',
  password: 'test',
  email: 'dan@email.com',
  menu : [
    monday = {
      breakfast : ['cereal', 12345],
      lunch: ['sandwich', 125412312],
      dinner: ['spaghetti',23423]
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
    },
  ]
};

console.log(demoData);
console.log(monday.breakfast[0]);


$(document).ready(function(){
    $( ".column" ).sortable({
      connectWith: ".column",
      handle: ".portlet-header",
      cancel: ".portlet-toggle",
      placeholder: "portlet-placeholder ui-corner-all"
    });
    $( ".portlet" )
      .addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
      .find( ".portlet-header" )
        .addClass( "ui-widget-header ui-corner-all" )
        .prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

    $( ".portlet-toggle" ).on( "click", function() {
      var icon = $( this );
      icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
      icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();
    });

    $(".search-slide").click(function(){
      $("#panel").slideToggle("slow");
      $("i").toggleClass("fa-plus fa-minus");
    });
    $(".faves-slide").click(function(){
      $("#panel_faves").slideToggle("slow");
      $("i").toggleClass("fa-plus fa-minus");
    });

  });
