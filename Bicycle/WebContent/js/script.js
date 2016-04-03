//注册退出服务
angular.module('myApp.services',[]).
	factory('UserLogoutService',function($cookieStore,$location) {
	return {
		logout:function() {
			if($cookieStore.get('id')!=null) {
				$cookieStore.remove('id');
				$location.path('/');
			}else{
				layer.alert("请先登录");
			}
		}
	}
});

var app = angular.module('myApp',['ngRoute','tm.pagination','ngCookies','myApp.services']);
app.config(function($routeProvider) {
	$routeProvider
	.when('/',{
		controller:'loginController',
		templateUrl:'login.html'
	})
	.when('/index',{
		controller:'mainController',
		templateUrl:'pages/home.html'
	})
	.when('/userList',{
		controller:'userController',
		templateUrl:'pages/userList.html'
	})
	.when('/adminList',{
		controller:'userController',
		templateUrl:'pages/userList.html'
	})
	.when('/adminEdit/:id',{
		controller:'userDetailController',
		templateUrl:'pages/userDetail.html'
	})
	.when('/userEdit/:id',{
		controller:'userDetailController',
		templateUrl:'pages/userDetail.html'
	})
	.when('/addUser',{
		controller:'userDetailController',
		templateUrl:'pages/userDetail.html'
	})
	.when('/addAdmin',{
		controller:'userDetailController',
		templateUrl:'pages/userDetail.html'
	})
	.when('/placeList',{
		controller:'placeListController',
		templateUrl:'pages/placeList.html'
	})
	.when('/placeDetail/:id',{
		controller:'placeDetailController',
		templateUrl:'pages/placeDetail.html'
	})
	.when('/addPlace',{
		controller:'placeDetailController',
		templateUrl:'pages/placeDetail.html'
	})
	.when('/information',{
		controller:'informationController',
		templateUrl:'pages/userDetail.html'
	})
});
app.controller('loginController',function($scope,$http,$cookieStore,$location) {
	$scope.isCustomer = false;
	$scope.login = function(user) {
		$http({
			url:'http://10.103.241.137:8080/Bicycle/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'login',isadmin:1,id:user.id,password:user.password}
		}).success(function(data){
			console.log("success!");
			if(data.result=='1') {
				$cookieStore.put('id',user.id);
				$cookieStore.put('password',user.password);
				$location.path('/index');
			}else if(data.result=='0') {
				layer.alert('对不起，您输入的账号不存在',{icon:5});
			}else {
				layer.alert("对不起，您输入的密码错误",{icon:5});
			}
		}).error(function(){
			console.log("error!");
		});
	}
});
app.controller ('mainController',function($scope,$cookieStore,UserLogoutService,$http){
	$scope.logger = {
		id : $cookieStore.get('id') 	
	};
	$scope.logout = function() {
		UserLogoutService.logout();
	};
	$http({
		url:'http://10.103.241.137:8080/Bicycle/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{method:'getTotal'}
	}).success(function(data){
		$scope.total = data.result;	
	}).error(function(){
		console.log("error!");
	});
	
});
app.controller('userController',function($scope,$http,$location,$cookieStore,UserLogoutService) {
	//存储到cookie当中
	/*if($location.search().id!=null && $location.search().level!=null) {
		$cookieStore.put('userid',$location.search().id);
	}
	id = $cookieStore.get('userid');
	console.log(id);*/
	$scope.logger = {
		id : $cookieStore.get('id') 	
	};
	$scope.user = {
		isadmin : 1,
	};
	$scope.addAction = 'addAdmin';
	$scope.userType = 'adminEdit';
	$scope.method = 'getAdminList';
	if($location.path()=='/userList') {
		$scope.user.isadmin = 0;
		$scope.addAction = 'addUser';
		$scope.userType = 'userEdit';
		$scope.method = 'getUserList';
	}
	$scope.paginationConf = {
		currentPage:1,
		itemsPerPage:10
	};	
	
	var getUserList = function() {
		$http({
			url:'http://10.103.241.137:8080/Bicycle/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:$scope.method,currentpage:$scope.paginationConf.currentPage}
		}).success(function(data){
			console.log("success!");
			$scope.workers = data.result.users;
			console.log($scope.workers);
			$scope.paginationConf.totalItems = data.result.count;
			//console.log(data.users);
			//console.log($scope.workers);
		}).error(function(){
			console.log("error!");
		});
	};
    //getUserList();
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage',getUserList);
	$scope.searchName = function() {
		$http({
			url:'http://10.103.241.137:8080/Bicycle/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:$scope.method,name:$scope.searchedName,
				currentpage:$scope.paginationConf.currentPage,isadmin:$scope.user.isadmin}
		}).success(function(data){
			console.log("success!");
			$scope.workers = data.result.users;
			$scope.totalItems = data.result.count;
			//console.log(data);
			//console.log($scope.workers);
		}).error(function(){
			console.log("error!");
		});
	};

	$scope.deleteUser = function(worker) {
		console.log($scope.worker);
		layer.confirm('确定删除该记录吗？',{
			btn:['确定','取消']
		},function(){
			$http({
				url:'http://10.103.241.137:8080/Bicycle/InfoCl',
				dataType:"jsonp",
				method:'GET',
				contentType:'application/json;charset=utf-8',
				async:true,
				processData:false,
				cache:false,
				params:{id:worker.id,method:'deleteUser',isadmin:$scope.user.isadmin}
			}).success(function(data){
				if(data.result){
					layer.alert('已删除',{icon:'6'});		
				}
				getUserList();
			}).error(function(){
				
			});
		},function(){
			layer.msg('已取消',{time:2000});
		});	
	};
	
	$scope.logout = function() {
		UserLogoutService.logout();
	};
	
});	

app.controller('userDetailController',function($scope,$routeParams,$http,$location,UserLogoutService,$cookieStore) {
	$scope.logger = {
		id : $cookieStore.get('id') 	
	};
	$scope.logout = function() {
		UserLogoutService.logout();
	};
	$scope.user = {
		isadmin : 1,
		title:"新增",
		isShowPsw:false,
		isReadOnlyID : false,
		module:"用户",
	};

	if($location.path()=='/addUser') {
		$scope.user.isadmin = 0;
		$scope.user.isShowPsw = true;
		$scope.user.isShowInput = true;
	}

	$scope.worker = {
		id:$routeParams.id,
	};
	if($routeParams.id!=null){
		$scope.user.title = "修改";
		$scope.user.isReadOnlyID = true;
		if($location.path()==('/userEdit/'+$scope.worker.id)) {
			$scope.user.isadmin = 0;
			$scope.user.isShowPsw = true;
		}else {
			$scope.user.isadmin = 1;
		}
		$http({
			url:'http://10.103.241.137:8080/Bicycle/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{id:$scope.worker.id,method:'getUserById',isadmin:$scope.user.isadmin}
		}).success(function(data){
			$scope.worker = data.result;
			/*if($scope.worker.isadmin=='0') {
				$scope.user.isShowPsw = true;
				$scope.user.isShowInput = true;
			}*/
 		}).error(function(){
			console.log("error!");
		});
	//更改用户
	$scope.addUser = function() {
		$http({
			url:'http://10.103.241.137:8080/Bicycle/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{id:$scope.worker.id,name:$scope.worker.name,
				password:$scope.worker.password,
				sex:$scope.worker.sex,isadmin:$scope.user.isadmin,
				phone:$scope.worker.phone,email:$scope.worker.email,
				method:'updateUser',}
			}).success(function(data){
				console.log(data.result);
				if(data.result) {
					layer.alert("修改完成",{icon:6});
				}else {
					layer.alert("提交失败，请稍后重试",{icon:5});
				}
			}).error(function(){
				
			});
		};
	}else {
		$scope.user.isShowPsw = true;
		$scope.user.isReadOnlyID = false;
		$scope.user.title = "增加";
		if($location.path()=='/addUser') {
			$scope.user.isadmin = 0;
		}else {
			$scope.user.isadmin = 1;
		}
		//添加新用户
		$scope.validateID = function() {
			if(!$scope.userForm.userID.$error) {
				$http({
					url:'http://10.103.241.137:8080/Bicycle/InfoCl',
					dataType:"jsonp",
					method:'GET',
					contentType:'application/json;charset=utf-8',
					async:true,
					processData:false,
					cache:false,
					params:{id:$scope.worker.id,method:'isSaveUser',isadmin:$scope.user.isadmin}
					}).success(function(data){
						console.log(data.result);
						if(!data.result) {
							$scope.messageID = "工号已被占用，请重新输入";
						}else {
							$scope.messageID = "验证通过";
						}
						//MessageBox("这是一个简单的消息提示框");
					}).error(function(){
						
				});
			}
		};
		$scope.addUser = function() {
			if($scope.userForm.$valid) {
				$http({
					url:'http://10.103.241.137:8080/Bicycle/InfoCl',
					dataType:"jsonp",
					method:'GET',
					contentType:'application/json;charset=utf-8',
					async:true,
					processData:false,
					cache:false,
					params:{id:$scope.worker.id,name:$scope.worker.name,
						password:$scope.worker.password,email:$scope.worker.email,
						sex:$scope.worker.sex,phone:$scope.worker.phone,
						isadmin:$scope.user.isadmin,method:'addUser'}
					}).success(function(data){
						console.log(data.result);
						//MessageBox("这是一个简单的消息提示框");
						if(!data.result) {
							layer.alert("提交失败，请稍后重试",{icon:5});
						}else {
							layer.alert("提交成功",{icon:6});
						}
					}).error(function(){
						
				});
			}else {
				layer.alert("表单信息填写不正确",{icon:6});
			}
		};
	};
});
app.filter('errorPlacesFilter',function() {
	return function(inputArray,attr1,attr2) {
		var array = [];
		console.log(inputArray.length);
		for(i=0;i<inputArray.length;i++) {
			if((inputArray[i].bike) + 5 > inputArray[i].parkingspace) {
				array.push(inputArray[i]);
			}
		}
		return array;
	}
});
app.controller('placeListController',function($scope,$http,$location,$routeParams,$filter,$cookieStore,UserLogoutService) {
		$scope.logger = {
			id : $cookieStore.get('id') 	
		};
		$scope.logout = function() {
			UserLogoutService.logout();
		};
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
				$scope.places = data.result.place;
				$scope.paginationConf.totalItems = data.result.count;
			}).error(function(){
				
			});
		};
		$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage',getPlaceList);
		$scope.deletePlace = function(place) {
			layer.confirm('确定删除该地点吗？',{
				btn:['确定','取消']
			},function(){
				$http({
					url:'http://10.103.241.137:8080/Bicycle/InfoCl',
					dataType:"jsonp",
					method:'GET',
					contentType:'application/json;charset=utf-8',
					async:true,
					processData:false,
					cache:false,
					params:{id:place.id,method:'deletePlaceById',}
				}).success(function(data){
					if(data.result){
						layer.alert('已删除',{icon:'6'});		
					}
					getPlaceList();
				}).error(function(){
					
				});
			},function(){
				layer.msg('已取消',{time:2000});
			});	
		};
		
		$scope.searchName = function() {
			$http({
				url:'http://10.103.241.137:8080/Bicycle/InfoCl',
				dataType:"jsonp",
				method:'GET',
				contentType:'application/json;charset=utf-8',
				async:true,
				processData:false,
				cache:false,
				params:{name:$scope.searchedName,method:'getPlaceList'}
			}).success(function(data){
				$scope.places = data.result.place;
				$scope.paginationConf.totalItems = data.result.count;
			}).error(function(){
				
			});
		};
		$scope.findErrorPlaces = function() {
			$scope.places = $filter('errorPlacesFilter')($scope.places);
			$scope.paginationConf.totalItems = $scope.places.length;
		};
});

app.controller('placeDetailController',function($scope,$http,$routeParams,UserLogoutService,$cookieStore) {
	$scope.logger = {
		id : $cookieStore.get('id') 	
	};
	$scope.logout = function() {
		UserLogoutService.logout();
	};
	$scope.isShowInput = false;
	$scope.place = {
		title:"新增"
	};
	if($routeParams.id != null) {
		$scope.isShowInput = true;
		$scope.isReadOnlyInput = true;
		$scope.place.title = "更新";
		$scope.place = {
			id:$routeParams.id,
		};
		$http({
			url:'http://10.103.241.137:8080/Bicycle/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{id:$scope.place.id,method:'getPlaceById'}
		}).success(function(data){
			$scope.place = data.result;
		}).error(function(){
			
		});
		//更新地点
		$scope.addPlace = function(place) {
			if($scope.place.addbike+$scope.place.bike + 5 < $scope.place.parkingspace+$scope.place.addparkingspace) {
				$http({
					url:'http://10.103.241.137:8080/Bicycle/InfoCl',
					dataType:"jsonp",
					method:'GET',
					contentType:'application/json;charset=utf-8',
					async:true,
					processData:false,
					cache:false,
					params:{id:$scope.place.id,method:'addPlace',bicycle:$scope.place.addbike,pakingspace:$scope.place.addparkingspace}
				}).success(function(data){
					if(data.result) {
						layer.msg("更新成功",{icon:6});
					}else {
						layer.msg("更新失败",{icon:5});
					}
				}).error(function(){
					
				});
			}else {
				layer.alert("您填写的自行车数量与停车位数量不符合规定，请重新填写");
			}
		};
	}else {	
		//添加地点
		$scope.addPlace = function(place){
			if($scope.place.bike < $scope.place.parkingspace - 5) {
				$http({
					url:'http://10.103.241.137:8080/Bicycle/InfoCl',
					dataType:"jsonp",
					method:'GET',
					contentType:'application/json;charset=utf-8',
					async:true,
					processData:false,
					cache:false,
					params:{name:$scope.place.name,method:'addPlace',bicycle:$scope.place.bike,pakingspace:$scope.place.parkingspace}
				}).success(function(data){
					if(data.result) {
						layer.msg("添加成功",{icon:6});
					}else {
						layer.msg("地点已存在，添加失败",{icon:5});
					}
				}).error(function(){
					
				});
			}else {
				layer.alert("您填写的自行车数量与停车位数量不符合规定，请重新填写");
			}
		};
		
	}
});

app.controller('informationController',function($http,$cookieStore,$scope,UserLogoutService) {
	$scope.logger = {
		id : $cookieStore.get('id') 	
	};
	$scope.logout = function() {
		UserLogoutService.logout();
	};
	id = $cookieStore.get('id');
	$scope.user = {
		title:"修改",
		isShowPsw:true,
		isReadOnlyID : true,
		module:"个人",
	};
	$http({
		url:'http://10.103.241.137:8080/Bicycle/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{id:id,method:'getUserById',isadmin:1}
	}).success(function(data){
		$scope.worker = data.result;
	}).error(function(){
		
	});
});





