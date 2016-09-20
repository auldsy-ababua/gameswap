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
}

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

    games() {
        return mockData.game;
    }

    profile() {
        return mockData.profile;
    }
}

class GameswapView {


    constructor() {
        this.services = new GameswapServices();
        console.log("ready!");
        $("#home").show();

        this.showForm()
        this.profArray = [];

    }

    showForm() {
        let cities = this.services.cities();
        for (let city in cities) {
            $('#myselect').append(`<option>${city}</option>option>`)
        }
        //populate game i have select
        //populate game i want select
        //populate city select
    }


    showSearchResults(owned, wanted, city) {
        let ownedval = $(owned).val();
        let wantedval = $(wanted).val();
        let cityval = $(city).val();
        let data = this.services.profile(); //in the future, will make the API call here
        let myClass = this;
        data.forEach(function (value, index) {
          console.log(ownedval, wantedval, cityval);
          console.log(value);
          if (ownedval == value.gameWanted && wantedval == value.gameOwned && cityval == value.city) {
            myClass.profArray.push(value);
          }
        })
        this.profArray.forEach(function (value, index) {
          var template = $("#template-parent .profile-template")
          template.find(".name span").html(value.name);
          template.find(".city span").html(value.city);
          template.find(".phone span").html(value.phone);
          template.clone().appendTo("#match-data");
        })
    }


};

$(document).ready(function() {
    var gameswapApp = new GameswapView();

    $("#game-search").submit(function(event) {
        event.preventDefault()
        console.log("The data was submitted");
        gameswapApp.showSearchResults(".games-owned", ".games-wanted", ".city");
        return false;

    });

});
