import GameswapServices from './model.js';

export default class GameswapView {

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

    searchGames(gameIput){
      let gamesearch = $(gameIput).val();

      $("#gamescontainer").empty();
      let callback = function(response){
        if(response){
          console.log(response);
        }
      };
      this.services.games(gamesearch,callback);
    }


    signin(){
      let first_name = $("#first_name").val();
      let last_name = $("#last_name").val();
      let email = $("#email").val();
      let password = $("#password").val();
      let city = $("#city").val();
      let state = $("#state").val();

      let callback = function(response){
        if(response){
          localStorage.username = email;
          localStorage.password = password;
        }
      };
      this.services.signin(first_name, last_name,email,password,city,state,callback);
    }



    showSearchResults(owned, wanted, city) {

      function callback(data){
        var container=$("#match-data");
        console.log(data);
        data.forEach(function(value, index) {
            $.ajax({
                type: "GET",
                url: "/users/" + value.user,
                dataType: 'json',
                async: false,
                success: function(response) {
                    var matchTemplate = $(".template-parent #profile-tamplate").clone();
                    $(matchTemplate).find(".email span").html(response.email);
                    $(matchTemplate).find(".city span").html(response.city);
                    $(matchTemplate).find(".game span").html(response.game);
                    container.append(matchTemplate);
                    console.log(response);
                }
            });


        });
      }


      this.services.getgames(localStorage.username, localStorage.password,callback);


      /*
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
            var template = $("#template-parent .profile-template");
            template.find(".name span").html(value.name);
            template.find(".city span").html(value.city);
            template.find(".phone span").html(value.phone);
            template.clone().appendTo("#match-data");
        });
        */
    }




    addClosure(game,type) {

      var appview = this;

      return function(){
        var container = "#gamesIOwn";
        var own = true;
        if(type=="want") {
          container = "#gamesIWant";
          own = false;
        }

        $.ajax({
            type: "POST",
            url: "/mygames",
            data:   {
                    "game": game,
                    "own": own
                  },
            headers: {
              "Authorization": "Basic " + btoa(localStorage.username + ":" + localStorage.password)
            },
            async: false,
            success: function(response) {
                var li = $("<li></li>");

                var removeGameButton = $("<button type='button' class='waves-effect waves-light btn'>Delete</button>");

                li.append(response.game);
                li.append(removeGameButton);

                removeGameButton.click( appview.deleteClosure(response._id,response.own, li) );
                $(container).append(li);
            }
        });
      };
    }


    deleteClosure(id,own,li){
      return function(){

        $.ajax({
            type: "DELETE",
            url: "/mygames/"+id,
            headers: {
              "Authorization": "Basic " + btoa(localStorage.username + ":" + localStorage.password)
            },
            async: false,
            success: function(response) {
                console.log(response);
                li.remove();
                //if(own) $("#gamesIOwn").remove(li);
                //else $("#gamesIWant").remove(li);
            }
        });
      };
    }

}
