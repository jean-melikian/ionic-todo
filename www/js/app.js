// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('todo', ['ionic', 'LocalStorageModule']);
var projectData = 'projects';

app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('todo');
})

.factory('Projects', function(localStorageService) {
  /**
   * The Projects factory handles saving and loading Projects
   * from local storage, and also lets us save and load
   * the last active project index
   */
  return {
    all: function() {
      var projectString = localStorageService.get(projectData);
      if(projectString) {
        return angular.fromJson(projectString);
      }
      return [];
    },

    save: function(projects) {
      localStorageService.set(projectData, angular.toJson(projects));
    },

    newProject: function(projectTitle) {
      return {
        title: projectTitle,
        tasks: []
      };
    },

    getLastActiveIndex: function() {
      return parseInt(localStorageService.get('lastActiveProject')) || 0;
    },

    setLastActiveIndex: function(index) {
      localStorageService.set('lastActiveProject', index);
    }
  }
})


.controller('TodoCtrl', function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate, localStorageService) { //store the entities name in a variable
  $scope.projects = Projects.all();
  console.log($scope.projects[0].title)
  console.log($scope.projects[0].status)

  // A utility function for creating a new project
  // with the given projectTitle
  var createProject = function(projectTitle) {
    var newProject = Projects.newProject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length-1);
  }

  // Load or initialize projects


  // Grab the last active, or the first project
  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

  // Called to create a new project
  $scope.newProject = function() {
    var projectTitle = prompt(($scope.activeProject) ? 'Project name':'You need at least one project');
    if(projectTitle) {
      createProject(projectTitle);
    } else if (!$scope.activeProject){
      $scope.newProject();
    }
  }

  // Called to select the given project
  $scope.selectProject = function(project, index) {
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  }

  // Create and Load the Modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope
    //animation: 'slide-in-up'
  });

  // Called when the form is submitted
  $scope.createTask = function(task) {
    if(!task) {
      return;
    }
    if(!$scope.activeProject) {
      $scope.newProject();
    }
    console.log(task.status)
    $scope.activeProject.tasks.push({
      title: task.title,
      status: task.status
    });
    $scope.taskModal.hide();

    // Inefficient, but save all the projects
    Projects.save($scope.projects);

    task.title = "";
    task.status = false
  };

  // updates a task's status 
  $scope.setStatus = function(index) {
    if (index !== -1) {
      $scope.activeProject.tasks[index].status = true;
    }
    // Inefficient, but save all the projects
    Projects.save($scope.projects)
  }

  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  }

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  }
  
})


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


