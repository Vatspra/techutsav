var app = angular.module('myApp',["ngRoute","ngStorage"]).run(function($rootScope,$localStorage,$location) {
  $rootScope.authenticated = false;

  $rootScope.logout = function(){
    alert('successfull loged out');
    $localStorage.userDetail = {};
    $rootScope.authenticated =false;
    $location.path('/');
  }
  console.log($localStorage.userDetail)
  if($localStorage.userDetail.success!==undefined){
    if($localStorage.userDetail.success){
      $rootScope.authenticated =true;
    }

  //console.log("hi i run")
    }

  });

  app.config(function($routeProvider){
    $routeProvider
    .when("/",{
        resolve:{
          "check":function($rootScope,$location){
            if($rootScope.authenticated){
              $location.path('/profile');
            }
          }
        },
        templateUrl : "home.html",
        //controller : "mainController"
     })
     .when("/profile",{
         resolve:{
           "check":function($rootScope,$location){
             if($rootScope.authenticated==false){
               $location.path('/login');
             }
           }
         },
         templateUrl : "profile.html",
         controller : "profileController"
      })
     .when("/login",{
         resolve:{
           "check":function($rootScope,$location){
             if($rootScope.authenticated){
               $location.path('/');
             }
             else{
               if($rootScope.msg=='new user created please login'){
                 $rootScope.msg="";

               }
             }
           }
         },
         templateUrl : "login.html",
         controller : "loginController"

      })
      .when("/register",{
          resolve:{
            "check":function($location,$rootScope){
              if($rootScope.authenticated){
                $location.path('/');
              }

            }
          },
          templateUrl : "signup.html",
          controller : "signupController"
       })
   })


app.controller('loginController',function($scope,$http,$location,$rootScope,$localStorage){

  $scope.user ={email:"",password:""};
  $scope.login =function(){
  $http.post('/users/authenticate',$scope.user).then(function(response){
    console.log(response.data);
    $localStorage.userDetail =response.data;
    $rootScope.authenticated =true;
    $location.path('/profile');

   })
 }
})


app.controller('signupController',function($scope,$http,$location,$rootScope,$localStorage){

  $scope.user ={name:"",username:"",email:"",password:"",mobile:"",uniqueCode:""};
  $scope.signup =function(){
  $http.post('/users/register',$scope.user).then(function(response){
  $scope.msg =response.data.msg;
   })
 }
})

app.controller('profileController',function($scope,$http,$location,$localStorage,$rootScope){

  $scope.name = $localStorage.userDetail.user.name;
  console.log($localStorage.userDetail.token)
   $scope.IsVisible = false;
   $scope.msg ="Show My toll History"
   $http({
       method: 'GET',
       url: "/users/profile",
       headers: {
           'Authorization':$localStorage.userDetail.token,
           'Accept': 'application/json'
       }
   }).then(function(response){
     console.log('hi '+response.data.toll);
      $scope.Customers = response.data.user.toll;
      $scope.totalDue = response.data.user.totalDue;
   })

  $scope.GenerateTable = function(){
    //console.log($scope.Customers)
    if(!$scope.IsVisible){
   $scope.IsVisible = true;
   $scope.msg ="Hide My toll History"
 }
   else{
     $scope.IsVisible =false;
     $scope.msg ="Show My toll History"
   }
  }
});
