"use strict"

var $ = require('jquery');
var materialize = require('materialize-css');

var mockData = {
    "profile": [{
        "name": "Mario",
        "city": "Los Angeles",
        "state": "California",
        "phone": "714-555-8288",
        "gameOwned": "Grand Theft Auto 5 (PS4)",
        "gameWanted": "Battlefield 4 (PS4)",
        "publishedAt": new Date()
    }, {
        "name": "Colin",
        "city": "Los Angeles",
        "state": "California",
        "phone": "714-555-8287",
        "gameOwned": "Battlefield 4 (PS4)",
        "gameWanted": "Grand Theft Auto 5 (PS4)",
        "publishedAt": new Date()
    }, {
        "name": "Bryan",
        "city": "Los Angeles",
        "state": "California",
        "phone": "714-555-8280",
        "gameOwned": "Grand Theft Auto 5 (PS4)",
        "gameWanted": "Battlefield 4 (PS4)",
        "publishedAt": new Date()
    }],
    "city": ["Los Angeles", "New York"],
    "game": ["Battlefield 4 (PS4)", "Grand Theft Auto 5 (PS4)"]
};

window.addEventListener('DOMContentLoaded', function(e) {
    mockData.game.forEach(function(value, index) {
        document.querySelectorAll('li:nth-child(1) select')[0].innerHTML += '<option value="' + value + '">' + value + '</option>';
        document.querySelectorAll('li:nth-child(2) select')[0].innerHTML += '<option value="' + value + '">' + value + '</option>';
    });
    mockData.city.forEach(function(value, index) {
        document.querySelectorAll('li:nth-child(3) select')[0].innerHTML += '<option value="' + value + '">' + value + '</option>';
    });
});


class GameswapServices {
    cities() {
        return mockData.city;
    }

    games(name,callback) {
      $.ajax({
          type: "GET",
          url: "http://thegamesdb.net/api/GetGamesList.php?name="+name,
          dataType: 'json',
          contentType: 'application/json',
          success: function(response) {
              callback(response);
          }
      });
    }

    profile() {
        return mockData.profile;
    }


    //bind for add games endpoint
    signin(first_name, last_name,email,password,city,state,callback) {
        let data = {
          "first_name": first_name,
          "last_name": last_name,
          "username": email,
          "password": password,
          "city": city,
          "state": state
        };

        $.ajax({
            type: "POST",
            url: "/users",
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                callback(response);
            }
        });
    }

      //bind for search games endpoint
      getgames(username, password,callback) {

          $.ajax({
              type: "GET",
              url: "/games",
              dataType: 'json',
              headers: {
                "Authorization": "Basic " + btoa(username + ":" + password)
              },
              async: false,
              success: function(response) {
                  console.log(response);
                  callback(response);
              }
          });
      }

      //bind for my games endpoint
      mygames(usernameVal, passwordVal,callback) {
          $.ajax({
              type: "GET",
              url: "/mygames",
              dataType: 'json',
              headers: {
                "Authorization": "Basic " + btoa(usernameVal + ":" + passwordVal)
              },
              async: false,
              success: function(response) {
                  console.log(response)
                  callback(response);

              }
          });
      }

      //bind for add games endpoint
      addgame(username, password) {
          let usernameVal = $(username).val();
          let passwordVal = $(password).val();

          $.ajax({
              type: "POST",
              url: "/mygames",
              dataType: 'json',
              async: false,
              success: function(response) {
                  console.log(response)
                  //response should be from game search?
                  $("#profile .gamesOwned span").html().append(response);
              }
          });
      }

      //bind for remove games endpoint
      deletegame(username, password,callback) {
          let usernameVal = $(username).val();
          let passwordVal = $(password).val();

          $.ajax({
              type: "DELETE",
              url: "/mygames/:id",
              dataType: 'json',
              async: false,
              success: function(response) {
                  callback(response);
                  console.log(response)

              }
          });
      }
}

class GameswapView {


    constructor() {
        this.services = new GameswapServices();
        console.log("ready!");
        $("#home").show();

        this.showForm();
        this.profArray = [];

    }

    showForm() {
        let cities = this.services.cities();
        for (let city in cities) {
            $('#myselect').append(`<option>${city}</option>option>`);
        }
        //populate game i have select
        //populate game i want select
        //populate city select
    }

    games(){
      let usernameVal = $("#username").val();
      let passwordVal = $("#password").val();

      let callback = function(response){
        if(response){
          localStorage.username = usernameVal;
          localStorage.password = passwordVal;
        }
      };
      this.services.mygames(usernameVal, passwordVal,callback);
    }


    signin(){
      let first_name = $("#first_name").val();
      let last_name = $("#last_name").val();
      let email = $("#email").val();
      let password = $("#password").val();
      let city = $("#city").val();
      let state = $("#state").val();

      let callback = function(response){
        $("#profile .gamesOwned span").html().append(response);
        if(response){
          localStorage.username = email;
          localStorage.password = password;
        }
      };
      this.services.signin(first_name, last_name,email,password,city,state,callback);
    }



    showSearchResults(owned, wanted, city) {
        let ownedval = $(owned).val();
        let wantedval = $(wanted).val();
        let cityval = $(city).val();
        let data = this.services.profile(); //in the future, will make the API call here
        let myClass = this;
        data.forEach(function(value, index) {
            console.log(ownedval, wantedval, cityval);
            console.log(value);
            if (ownedval == value.gameWanted && wantedval == value.gameOwned && cityval == value.city) {
                myClass.profArray.push(value);
            }
        });
        this.profArray.forEach(function(value, index) {
            var template = $("#template-parent .profile-template")
            template.find(".name span").html(value.name);
            template.find(".city span").html(value.city);
            template.find(".phone span").html(value.phone);
            template.clone().appendTo("#match-data");
        });
    }

}



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
