'use strict';

/* global $ */

$(document).ready(function(){
    $( ".column" ).sortable({
      connectWith: ".column",
      connectWith: ".search_col",
      handle: ".portlet-header",
      cancel: ".portlet-toggle",
      placeholder: "portlet-placeholder ui-corner-all"
    });
    $( ".search_col" ).sortable({
      connectWith: ".search_col",
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

    $(".btn-slide").click(function(){
      $("#panel").slideToggle("slow");
      //$(this).toggleClass("active");
      $("i").toggleClass("fa-minus fa-plus");
      //return false;
    });

  });
