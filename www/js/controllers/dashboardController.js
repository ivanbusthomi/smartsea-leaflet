angular.module('starter').controller('DashboardController', ['$scope',
  '$http',
  '$filter',
  '$cordovaDeviceOrientation',
  '$cordovaNetwork',
  function($scope,
    $http,
    $filter,
    $cordovaDeviceOrientation,
    $cordovaNetwork
  ) {


    document.addEventListener("deviceready", function () {
      var options = {
        frequency: 500
      }
      var watch = $cordovaDeviceOrientation.watchHeading(options).then(
        null,
        function(error){
          console.log(error)
        },
        function(result){
          $scope.mag = result.magneticHeading;
          console.log($scope.mag);
        }
      )
    });


    // Preconfigured value for compass heading
    $scope.$on('sensorvalue', function(event, value) {
      console.log('sensorvalue', value);
      $scope.deg = value;
    });

    //watch broadcasted event from rootScope

    // Am I online? (note: need to run in a device to test)
    $scope.$on('onlinewith', function(event, networkState) {
      $scope.onlineState = networkState;
      if ($scope.onlineState == "none") {
        $scope.isOnline = false
      } else {
        $scope.isOnline = true
      };
      console.log("Am I online?", $scope.onlineState);
    });

    // Handling event with GPS reading
    $scope.$on('someEvent', function(event, data) {
      $scope.position = data;

      // Redefine heading
      //$scope.deg = 360-$scope.position.heading;

      //define lat and long for weather API
      $scope.lat = $filter('number')($scope.position.latitude,2);
      $scope.long = $filter('number')($scope.position.longitude,2);
      console.log("current pos:"+ $scope.lat + '  - '+ $scope.long);
      //get the data
      var url = 'http://api.openweathermap.org/data/2.5/weather?lat='+ $scope.lat+'&lon='+ $scope.long+'&appid=09284f9e9d4902bc5e84294ad386b900&units=metric';
      console.log(url);
      $http({
        method: 'GET',
        url: url
      }).then(function successCallback(response) {
          //set some variables

          $scope.weatherData = response.data;

          console.log($scope.weatherData.main)


          $scope.weatherData2 = $scope.weatherData.weather[0];
          $scope.weatherIcon = 'http://openweathermap.org/img/w/'+ $scope.weatherData2.icon +'.png'

          console.log($scope.weatherIcon)
        }, function errorCallback(response) {
          console.log(response)
        });




    }); //end of broadcasted event: position




  }
]);


/*
  Todo next:
    - employ geolocation service into map controller >> done
    - change tombatossals' angular leaflet with ui-leaflet -- skip
    - add ui bootstrap >> done
    - add components to dashboard (coordinates (utm and geo), heading, speed, compass)
    - detect GPS and implement cordova diagnostic plugins >> done
    - detect network (cordova network information plugin) >> done
    - add login and implement pouchdb for user auth
    - add download wizard state

*/
