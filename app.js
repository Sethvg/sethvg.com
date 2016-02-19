var app = angular.module('app',['ui.bootstrap']);

app.controller('main',['$scope','$modal','$location',function($scope,$modal,$location){
    $scope.navMenu = [
        {text:'Home',partial:'home.html', selected:true},
        {text:'Work',partial:'work.html', selected:false},
        {text:'Projects',partial:'projects.html' , selected:false},
        {text:'Education',partial:'education.html',selected:false}
    ];

    $scope.setSelected = function(index){
        for(var a = 0; a < $scope.navMenu.length; a++){
            $scope.navMenu[a].selected = false;
        }
        $scope.navMenu[index].selected = true;
        $scope.selected = $scope.navMenu[index];
        $location.search("page",$scope.selected.text);
        if($scope.selected.text != "Projects"){
            $location.search("project",null);
        }
        else if($location.search().project){

        }else{
            $location.search("project","KalE2E");
        }
    };

         var found = false;
        var initParams = $location.search();
        if(initParams && initParams.page){

            var text = initParams.page;
            for(var a =0; a < $scope.navMenu.length; a++) {
                if ($scope.navMenu[a].text == text) {
                    found = true;
                    $scope.setSelected(a);
                }
            }}

    if(!found){
        $scope.setSelected(0);

    }





    $scope.images = [];

    function addImage(name,src){
        $scope.images.push({name:name,src:'assets/' + src})
    }

    addImage('Angular JS','angularjs.png');
    addImage('NodeJs','nodejs.png');
    addImage('Bootstrap','bootstrap.jpg');
    addImage('Ruby (+Rails)' , 'ror.png');
    addImage('Git' , 'git_logo.png');
    addImage('C++','cpp.png');
    addImage("Java",'Java.png');
    addImage('Grunt' , 'grunt.png');
    addImage('Javascript' , 'javascript.png');

    $scope.about = [];

    function addAbout(key,value){
        $scope.about.push({key:key,value:value});
    }

    addAbout('Name','Seth Van Grinsven');
    var date = new Date();
    var diff = date.getFullYear() - 1990;
    if(date.getMonth() == 0 || (date.getMonth() == 1 && date.getDate() < 8)) diff -= 1;
    addAbout('Age',String(diff));
    addAbout('Location', 'Rancho Cordova');
    addAbout('Current Job', 'Developer Intern');
    addAbout('Graduation Date', 'Dec 2015');
    addAbout('Favorite Language',"Node/AngularJS");



    
    $scope.test ={};


    $scope.tools = [];
    $scope.langs = [];

    function addTool(str){
        $scope.tools.push(str);
    }

    function addLang(str){
        $scope.langs.push(str);
    }

    addLang("Node");
    addLang("AngularJs");
    addLang("Jquery");
    addLang("C++");
    addLang("Bootstrap");
    addLang("Java");
    addLang("C");
    addLang("Ruby");
    addLang("Rails (Ruby)");

    addTool("Git");
    addTool("Bower");
    addTool("Maven");
    addTool("IntelliJ");
    addTool("Drools");
    addTool("Eclipse");
    addTool("Jira");
    addTool("Jenkins");
    addTool("Sonar");
    addTool("Splunk");
    addTool("Wireshark");
    addTool("Vim");



    $scope.open = function()
    {
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'views/modal.html',
            size: 'modal-sm'


        });
    };


    $scope.proj = [];
    var addIndex = 0;
    function addProject(title,partialPath){
        var p = {title:title,path:"projectPartials/" + partialPath,isFirstOpen:addIndex == 0};
        $scope.proj.push(p);
        addIndex++;
    }

    addProject("KalE2E","kal.html");











}]);