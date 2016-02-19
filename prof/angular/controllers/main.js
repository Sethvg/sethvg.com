var app = angular.module("app",['ngRoute']);


////////////////////////////////////////////////////////
//         App Controller (Highest Parent)            //
////////////////////////////////////////////////////////

app.controller('appController',function($scope){
	
	$scope.active = 0;
	
	$scope.options = [
	  {href:"#home",val:"Home"},
	  {href:"#mvc",val:"MVC"},
	  {href:"#examples",val:"Examples"},
	  {href:"#promises",val:"Promises"},
	  {href:"#directives",val:"Directives"}
	];
	
	$scope.setActive = function(i){
		$scope.active = i;
	}
	
	$scope.isActive = function(i)
	{
		return $scope.active == i;
	}
	
	
}); // end of controller

////////////////////////////////////////////////////////
//                 HOME CONTROLLER                    //
////////////////////////////////////////////////////////

app.controller('homeController',function($scope, $http){
	
	var base = window.location.href;
	base = base.split("prof")[0] + "prof/";
	
	$scope.docs = [
	    {name:"Index",path:"index.html"},
	    {name:"Controllers",path:"angular/controllers/main.js"},
	    {name:"Routing",path:"angular/routing/router.js"},
	    {name:"_navbar",path:"partials/navbar.html"},
	    {name:"_home",path:"partials/home.html"},
	    {name:"_mvc",path:"partials/mvc.html"},
	    {name:"_examples",path:"partials/examples.html"},
	    {name:"_promises",path:"partials/promises.html"},
	    {name:"_directives",path:"partials/directives.html"}
	];
	

	$scope.activeFile = "LOADING";
	
	
	$scope.isActiveDoc = function(i)
	{
		return i == $scope.activeDoc;
	}
	
	$scope.setActiveDoc = function(i)
	{
		$scope.activeDoc = i;
		$scope.activePath = $scope.docs[i].path;
		
		//HTTP CALL
		$http.get($scope.activePath).
		  success(function(data, status, headers, config) {
			  $scope.activeFile = data;
		  }).
		  error(function(data, status, headers, config) {
		   //pray doesnt happen during demo
		  });
	}
	
	$scope.setActiveDoc(0);
	
	
	
	
}); // End of Controller





////////////////////////////////////////////////////////
//               MVC Controller                       //
////////////////////////////////////////////////////////



app.controller('mvcController',function($scope){
	
	
	
	
}); // End of Controller





////////////////////////////////////////////////////////
//             Examples Controller                    //
////////////////////////////////////////////////////////



app.controller('examplesController',function($scope){
	
	
	$scope.option = 0;
	$scope.dec = function()
	{
		if($scope.option != 0) $scope.option--;
	}
	
	$scope.inc = function()
	{
		if($scope.option != 3) $scope.option++;
	}
	
	$scope.makeOption = function(i)
	{
		$scope.option = i;
	}
	
	
	
	
	$scope.example2Array = [];
	$scope.keyPressed = function(event)
	{
		if(event.keyCode == 13)
		{
			$scope.example2Array.push($scope.exampleInput2);
			$scope.exampleInput2 = "";
		}
	}
	
	
	$scope.style = {};
	
	$scope.reset = function()
	{
		$scope.style.color = "";
		$scope.style["background-color"]="";
		$scope.style.border = "";
	}

	$scope.boo = true;
	$scope.styleBorder = true;
	$scope.styleBackground = false;
	$scope.styleFont = false;
	
	$scope.radio = function(i)
	{
		switch(i)
		{
		case 0: $scope.styleBackground = false; $scope.styleFont = false;
		break;
		case 1: $scope.styleBorder = false; $scope.styleFont = false;
		break;
		case 2: $scope.styleBorder = false; $scope.styleBackground = false;
		break;
		}
	}
	
	$scope.applyStyle = function(event)
	{
		if(event.keyCode == 13)
		{
			if($scope.styleBorder == true)
			{
				$scope.style.border = "1px solid " + $scope.styleIn;
			}else if($scope.styleFont == true)
			{
				$scope.style.color = $scope.styleIn;
			}else if($scope.styleBackground == true)
			{
				$scope.style["background-color"] = $scope.styleIn;
			}
		}
	}
	
	$scope.getStyle = function()
	{
		return $scope.style; 
	}
	
	
	
	
});




////////////////////////////////////////////////////////
//            Directives Controller                   //
////////////////////////////////////////////////////////

app.controller('directivesController',function($scope){
	
	
	
	
});

////////////////////////////////////////////////////////
//              Promises Controller                   //
////////////////////////////////////////////////////////

app.controller('promisesController',function($scope, $interval){
	
	$scope.BOOM = function()
	{
		$scope.boom = "BOOOOOOM 10 SECOND TIMER IS AN EXAMPLE OF A PROMISE";
	}
	
	$scope.iter = 0;
	function c(){
		console.log($scope.iter)
		$scope.iter++;
	}
	
	
	$interval(c(), 5000, 2).then(function(){
		$scope.BOOM();
	});
	$scope.boom = "";
	
	
});