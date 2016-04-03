//服务中不可以有$scope存在
angular.module('bikeApp.services',[]).
	factory('loggerInforService',function($cookieStore,$location,$http,$rootScope) {
	return {
		getLoggerInfo:function() {
			if($cookieStore.get('id')!=null) {
				$http({
					url:'http://10.103.241.137:8080/Bicycle/InfoCl',
					dataType:"jsonp",
					method:'GET',
					contentType:'application/json;charset=utf-8',
					async:true,
					processData:false,
					cache:false,
					params:{method:'getUserById',id:$cookieStore.get('id')}
					}).success(function(data){
						$cookieStore.put('logger',data.result);
						console.log($cookieStore.get('logger'));
					}).error(function(){
						
					});
			}
		}
	}
}).factory('UserLogoutService',function($cookieStore,$location) {
	return {
		logout:function() {
			if($cookieStore.get('id')!=null) {
				$cookieStore.remove('id');
				$location.path('/login');
			}else{
				layer.alert("请先登录");
			}
		}
	}
});

var app = angular.module('bikeApp',['ngRoute','tm.pagination','ngCookies','bikeApp.services']);
app.config(function($routeProvider) {
	$routeProvider
	.when('/',{
		controller:'mainController',
		templateUrl:'main.html'
	})
	.when('/login',{
		controller:'loginController',
		templateUrl:'manager/login.html'
	})
	.when('/borrowBike/:id',{
		controller:'borrowBikeController',
		templateUrl:'borrowBike.html'
	})
	.when('/userLog', {
		controller:'userLogController',
		templateUrl:'userLog.html',
	})
	.when('/information',{
		controller:'infoController',
		templateUrl:'information.html',
	})
	.when('/prepaid',{
		controller:'prepaidController',
		templateUrl:'prepaid.html'
	})
	.when('/changePsw',{
		controller:'changePswController',
		templateUrl:'changePsw.html'
	})
});
app.controller('mainController',function($scope,$http,$cookieStore,$location,loggerInforService,UserLogoutService){
	if($cookieStore.get('id')!=null) {
		$scope.isLogin = true;
		$scope.logger = {
			id : $cookieStore.get('id')
		};
	}else {
		$scope.isLogin = false;
	}
	$scope.paginationConf = {
		currentPage:1,
		itemsPerPage:10
	};	
	var getPlaceList = function() {
		$http({
			url:'http://10.103.241.137:8080/Bicycle/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'getPlaceList',currentpage:$scope.paginationConf.currentPage}
			}).success(function(data){
				console.log(data.result);
				$scope.placesInSelect = data.result.place;
				$scope.places = data.result.place;
				$scope.paginationConf.totalItems = data.result.count;
			}).error(function(){
				
			});
	};
	$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage',getPlaceList);
	
	$scope.selectPlace = function() {
		if($scope.order.bubblePlace!=null) {
			$http({
				url:'http://10.103.241.137:8080/Bicycle/InfoCl',
				dataType:"jsonp",
				method:'GET',
				contentType:'application/json;charset=utf-8',
				async:true,
				processData:false,
				cache:false,
				params:{method:'getPlaceByName',name:$scope.order.bubblePlace.name}
				}).success(function(data){
					console.log(data.result);
					$scope.places = data.result;
					$scope.paginationConf.totalItems = 1;
				}).error(function(){
					
				});
		}else {
			getPlaceList();
		}
	};
	var getLoggerReturned = function() {
		$http({
			url:'http://10.103.241.137:8080/Bicycle/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'isReturn',id:$cookieStore.get('id')}
			}).success(function(data){
				console.log(data.result);
				$cookieStore.put('isReturned',data.result);
			}).error(function(){
				
			});
	};
	$scope.borrowBike = function(place) {
		getLoggerReturned();
		if($cookieStore.get('id')!=null) {
			if(!$cookieStore.get('isReturned')) {
				$location.path('/borrowBike/'+place.id);
			}else {
				layer.alert("您已借车，暂时不能借车",{icon:5});
			}
		}else{
			$location.path('/login');
		}
	};
	$scope.returnBike = function(place) {
		loggerInforService.getLoggerInfo();
		$http({
			url:'http://10.103.241.137:8080/Bicycle/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'getSale',id:$cookieStore.get('id')}
			}).success(function(data){
				$scope.money = data.result.money;
				$scope.returntime = data.result.returntime;
				if($scope.money >= $cookieStore.get('logger').money) {
					layer.msg('还车成功，欢迎下次使用',{icon:6});
				}else {
					layer.msg('余额不足，请充值',{icon:5});
				}
			}).error(function(){
				
			});
	};
	
	$scope.Logout = function() {
		UserLogoutService.logout();
	};
});
app.controller('loginController',function($scope,$http,$cookieStore,$location,UserLogoutService,loggerInforService) {
	$scope.isCustomer = true;
	$scope.login = function(user) {
		$http({
			url:'http://10.103.241.137:8080/Bicycle/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'login',isadmin:0,id:user.id,password:user.password}
		}).success(function(data){
			console.log("success!");
			if(data.result=='1') {
				$cookieStore.put('id',user.id);
				$cookieStore.put('password',user.password);
				loggerInforService.getLoggerInfo();
				$location.path('/');
			}else if(data.result=='0') {
				layer.alert('对不起，您输入的账号不存在',{icon:5});
			}else {
				layer.alert("对不起，您输入的密码错误",{icon:5});
			}
		}).error(function(){
			console.log("error!");
		});
	};
	$scope.Logout = function() {
		UserLogoutService.logout();
	};
});

app.controller('borrowBikeController',function($scope,$http,$cookieStore,$routeParams,UserLogoutService) {
	$scope.place = {
		id : $routeParams.id
	};
	if($cookieStore.get('id')!=null) {
		$scope.isLogin = true;
		$scope.logger = {
			id : $cookieStore.get('id')
		};
	}else {
		$scope.isLogin = false;
	}
	$http({
		url:'http://10.103.241.137:8080/Bicycle/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{method:'getPlaceById',id:$scope.place.id}
		}).success(function(data){
			console.log(data.result);
			$scope.place = data.result;
		}).error(function(){
			
		});
	
	$scope.submitBorrowBike = function() {
		$http({
			url:'http://10.103.241.137:8080/Bicycle/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'hireBicycle',userid:$scope.logger.id,placeid:$scope.place.id}
			}).success(function(data){
				console.log(data.result);
				if(data.result) {
					layer.msg('借车成功，请取车',{icon:6});
				}else {
					layer.msg('借车失败',{icon:5});
				}
			}).error(function(){
				
			});
	};	
	$scope.Logout = function() {
		UserLogoutService.logout();
	};
});

app.controller('userLogController',function($scope,$http,$cookieStore,UserLogoutService){
	if($cookieStore.get('id')!=null) {
		$scope.isLogin = true;
		$scope.logger = {
			id : $cookieStore.get('id')
		};
	}else {
		$scope.isLogin = false;
	}
	$scope.paginationConf = {
		currentPage:1,
		itemsPerPage:10
	};	
	var getRetuenList = function() {
		$http({
			url:'http://10.103.241.137:8080/Bicycle/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'getReturnList',userid:$cookieStore.get('id'),currentpage:$scope.paginationConf.currentpage}
			}).success(function(data){
				console.log(data.result);
				$scope.logs = data.result.returninfo;
				$scope.paginationConf.totalItems = data.result.count;
				
			}).error(function(){
				
			});
	};
	$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage',getRetuenList);
	
	$scope.Logout = function() {
		UserLogoutService.logout();
	};
});

app.controller('infoController',function($scope,$http,$cookieStore,UserLogoutService,loggerInforService) {
	loggerInforService.getLoggerInfo();
	if($cookieStore.get('id')!=null) {
		$scope.isLogin = true;
		$scope.logger = {
			id : $cookieStore.get('id')
		};
	}else {
		$scope.isLogin = false;
	}
	$scope.user = $cookieStore.get('logger');
	$scope.isChangeTelClicked = true;
	$scope.changeTel = function() {
		$scope.isChangeTelClicked = false;
	};
	$scope.changeIsChangeTelClicked = function() {
		$scope.isChangeTelClicked = true;
	};
	$scope.isChangeEmailClicked = true;
	$scope.changeEmail = function() {
		$scope.isChangeEmailClicked = false;
	};
	$scope.changeIsChangeEmailClicked = function() {
		$scope.isChangeEmailClicked = true;
	};
	$scope.updateChange = function() {
		$http({
			url:'http://10.103.241.137:8080/Bicycle/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'updateUser',id:$cookieStore.get('id'),phone:$scope.user.phone,email:$scope.user.email,isadmin:0}
			}).success(function(data){
				if(data.result) {
					layer.msg('更改成功',{icon:6});
				}else {
					layer.msg('更改失败',{icon:5});
				}			
			}).error(function(){
				
			});
	};
	$scope.Logout = function() {
		UserLogoutService.logout();
	};
});

app.controller('prepaidController',function($scope,$http,$cookieStore,UserLogoutService) {
	if($cookieStore.get('id')!=null) {
		$scope.isLogin = true;
		$scope.logger = {
			id : $cookieStore.get('id')
		};
	}else {
		$scope.isLogin = false;
	}
	$scope.user = $cookieStore.get('logger');
	
	$scope.Logout = function() {
		UserLogoutService.logout();
	};
});

app.controller('changePswController',function($scope,$http,$cookieStore,$location,UserLogoutService) {
	if($cookieStore.get('id')!=null) {
		$scope.isLogin = true;
		$scope.logger = {
			id : $cookieStore.get('id')
		};
	}else {
		$scope.isLogin = false;
	}
	$scope.user = $cookieStore.get('logger');
	
	$scope.checkPsw = function() {
		if($scope.user.oldPsw!=$scope.user.password) {
			layer.alert("您输入的密码不正确",{icon:5});
		}
	};
	$scope.checkNewPsw = function() {
		if($scope.user.newPsw != $scope.user.checkPsw) {
			layer.alert("两次输入的新密码不一样",{icon:5});
		}
	};
	
	$scope.changePsw = function() {
		$http({
			url:'http://10.103.241.137:8080/Bicycle/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'updateUser',id:$cookieStore.get('id'),password:$scope.user.newPsw,isadmin:0}
			}).success(function(data){
				if(data.result) {
					layer.msg('密码已更新成功，请重新登录',{icon:6});
					$location.path('/login');
				}else {
					layer.msg('更新失败',{icon:5});
				}			
			}).error(function(){
				
			});
	};
	$scope.Logout = function() {
		UserLogoutService.logout();
	};
});