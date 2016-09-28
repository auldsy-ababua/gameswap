"use strict";

var $ = require('jquery');
var materialize = require('materialize-css');

import GameswapView from './view.js';


/*window.addEventListener('DOMContentLoaded', function(e) {
    mockData.game.forEach(function(value, index) {
        document.querySelectorAll('li:nth-child(1) select')[0].innerHTML += '<option value="' + value + '">' + value + '</option>';
        document.querySelectorAll('li:nth-child(2) select')[0].innerHTML += '<option value="' + value + '">' + value + '</option>';
    });
    mockData.city.forEach(function(value, index) {
        document.querySelectorAll('li:nth-child(3) select')[0].innerHTML += '<option value="' + value + '">' + value + '</option>';
    });
});*/




$(document).ready(function() {
    var gameswapApp = new GameswapView();

    $("#game-search").submit(function(event) {
        event.preventDefault();
        console.log("The data was submitted");
        gameswapApp.showSearchResults(".games-owned", ".games-wanted", ".city");
        return false;

    });

    $("#login").submit(function(event) {
        event.preventDefault();
        console.log("The login");
        gameswapApp.games("#username", "#password");
        return false;
    });

    $("#signinForm").submit(function(event) {
        event.preventDefault();
        console.log("The signin");
        gameswapApp.signin();
        return false;
    });

    $("#add-owned").submit(function(event) {
        event.preventDefault();
        console.log("add-owned");
        gameswapApp.searchGames("#gamesearch");
        return false;
    });



    //go to login page
    $("#loginMenu").click(e => {
        $("#loginform").show();
        $(".nav").show();
        $("#create-profile").hide();
        $("#home").hide();
        $("#search").hide();
    });

    //login and go home
    $("#loginform #login-button").click(e => {
        $("#home").show();
        $(".nav").show();
        $("#create-profile").hide();
        $("#loginform").hide();
        $("#search").hide();
    });

    //hit sign up at bottom of login to go to make profile page
    $("#makeProfile a").click(e => {
        $(".nav").show();
        $("#create-profile").show();
        $("#loginform").hide();
        $("#home").hide();
        $("#search").hide();
    });

    //hit home button on nav to go home
    $(".nav #homeMenu").click(e => {
        $(".nav").show();
        $("#home").show();
        $("#create-profile").hide();
        $("#loginform").hide();
        $("#search").hide();
        $("#profile").hide();
    });

    //hit search button on nav to go to search screen
    $(".nav #searchMenu").click(e => {
        $(".nav").show();
        $("#profile").hide();
        $("#search").show();
        $("#create-profile").hide();
        $("#loginform").hide();
        $("#home").hide();
        var showMatches = function () {
          $("#game-search").submit(function(event) {
              event.preventDefault();
              console.log("The data was submitted");
              gameswapApp.showSearchResults(".games-owned", ".games-wanted", ".city");
              return false;
          });
        };
        $("match-data").html(showMatches);
    });

    //hit profile button on nav to go to myprofile screen
    $(".nav #profileMenu").click(e => {
        $(".nav").show();
        $("#profile").show();
        $("#create-profile").hide();
        $("#loginform").hide();
        $("#home").hide();
        $("#search").hide();
    });
});
