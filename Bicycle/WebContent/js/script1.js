var app = angular.module('myApp',['ngRoute','tm.pagination']);
app.config(function($routeProvider) {
	$routeProvider
	.when('/',{
		controller:'mainController',
		templateUrl:'pages/home.html'
	})
	.when('/shopKeeperList',{
		controller:'userController',
		templateUrl:'pages/userList.html'
	})
	.when('/servicerList',{
		controller:'userController',
		templateUrl:'pages/userList.html'
	})
	.when('/managerList',{
		controller:'userController',
		templateUrl:'pages/userList.html'
	})
	.when('/beauticianList',{
		controller:'userController',
		templateUrl:'pages/userList.html'
	})
	.when('/view/:id',{
		controller:'detailController',
		templateUrl:'pages/userDetail.html'
	})
	.when('/addUser',{
		controller:'detailController',
		templateUrl:'pages/userDetail.html'
	})
	.when('/orderList',{
		controller:'orderController',
		templateUrl:'pages/orderList.html'
	})
	.when('/addOrder',{
		controller:'orderController',
		templateUrl:'pages/addOrder.html'
	});
});
app.controller ('mainController',function($scope){

});
app.controller('userController',function($scope,$http,$location) {
	if($location.path()=='/beauticianList'){
		level = 3;
		money = 2000;
	}else if($location.path()=='/managerList') {
		level = 1;
		money = 10000;	
	}else if($location.path()=='/shopKeeperList') {
		level = 2;
		money = 5000;	
	}else if($location.path()=='/servicerList') {
		level = 4;
		money = 2000;
	}	
	$http({
		url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{level:level,method:'getUserList',currentPage:1}
	}).success(function(data){
		console.log("success!");
		$scope.workers = data.users;
		$scope.totalItems = data.count;
		console.log($scope.totalItems);
		//console.log(data.users);
		//console.log($scope.workers);
		$scope.paginationConf = {
        currentPage: 1,
        totalItems: $scope.totalItems,
        itemsPerPage: 15,
        pagesLength: 15,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function(){
        }
    };
	}).error(function(){
		console.log("error!");
	});

	$scope.searchName = function() {
		$http({
		url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{level:level,method:'getUserList',name:$scope.searchedName,currentPage:'1'}
	}).success(function(data){
		console.log("success!");
		$scope.workers = data.users;
		$scope.totalItems = data.count;
		//console.log(data);
		//console.log($scope.workers);
	}).error(function(){
		console.log("error!");
	});
	};
	
});	

/*app.controller('shopKeeperController',function($scope,$http){
	$http({
		url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{level:'2',method:'getUserList',currentPage:'1'}
	}).success(function(data){
		console.log("success!");
		$scope.workers = data;
		console.log(data);
		console.log($scope.workers);
	}).error(function(){
		console.log("error!");
	});
	$scope.searchName = function() {
		$http({
		url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{level:'2',method:'getUserList',name:$scope.searchedName,currentPage:'1'}
	}).success(function(data){
		console.log("success!");
		$scope.workers = data;
		console.log(data);
		console.log($scope.workers);
	}).error(function(){
		console.log("error!");
	});
	}
});
app.controller('servicerController',function($scope,$http){
	$http({
		url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{level:'4',method:'getUserList',currentPage:'1'}
	}).success(function(data){
		console.log("success!");
		$scope.workers = data;
		console.log(data);
		console.log($scope.workers);
	}).error(function(){
		console.log("error!");
	});
	$scope.searchName = function() {
		$http({
		url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{level:'4',method:'getUserList',name:$scope.searchedName,currentPage:'1'}
	}).success(function(data){
		console.log("success!");
		$scope.workers = data;
		console.log(data);
		console.log($scope.workers);
	}).error(function(){
		console.log("error!");
	});
	}
});
app.controller('managerController',function($scope,$http){
	$http({
		url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{level:'1',method:'getUserList',currentPage:'1'}
	}).success(function(data){
		console.log("success!");
		$scope.workers = data;
		console.log(data);
		console.log($scope.workers);
	}).error(function(){
		console.log("error!");
	});
	$scope.searchName = function() {
		$http({
		url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{level:'1',method:'getUserList',name:$scope.searchedName,currentPage:'1'}
	}).success(function(data){
		console.log("success!");
		$scope.workers = data;
		console.log(data);
		console.log($scope.workers);
	}).error(function(){
		console.log("error!");
	});
	}
});*/
app.controller('detailController',function($scope,$routeParams,$http,$location) {
	if($location.path()=='/beauticianList'){
		level = 3;
		money = 2000;
	}else if($location.path()=='/managerList') {
		level = 1;
		money = 10000;
	}else if($location.path()=='/shopKeeperList') {
		level = 2;
		money = 5000;
	}else if($location.path()=='/servicerList') {
		level = 4;
		money = 2000;
	}
	$scope.worker = {
		id:$routeParams.id,
	};
	if($routeParams.id!=null){
		//$scope.title.change = "修改";
		$scope.isReadOnly = true;
		$http({
			url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{id:$scope.worker.id,level:$scope.worker.level,method:'getUser'}
		}).success(function(data){
			//console.log("success!");
			$scope.worker = data;
			//console.log(data);
			//console.log($scope.worker);
		}).error(function(){
			console.log("error!");
		});
		//更改用户
		$scope.addUser = function() {
			$http({
				url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
				dataType:"jsonp",
				method:'GET',
				contentType:'application/json;charset=utf-8',
				async:true,
				processData:false,
				cache:false,
				params:{id:$scope.worker.id,password:$scope.worker.password,
					level:$scope.worker.level,sex:$scope.worker.sex,method:'updateUser'}
				}).success(function(data){
					console.log(data.result);
					MessageBox("这是一个简单的消息提示框");
				}).error(function(){
					
			});
		};
	}else {
		$scope.isReadOnly = false;
		$scope.moneyIsReadOnly = true;
		//$scope.title.change = "增加";
		$scope.worker = {
			level:level,
			money:money
		};
		//添加新用户
		$scope.addUser = function() {
			$http({
				url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
				dataType:"jsonp",
				method:'GET',
				contentType:'application/json;charset=utf-8',
				async:true,
				processData:false,
				cache:false,
				params:{id:$scope.worker.id,name:$scope.worker.name,password:$scope.worker.password
					,sex:$scope.worker.sex,level:$scope.worker.level,method:'addUser'}
				}).success(function(data){
					console.log(data.result);
					//MessageBox("这是一个简单的消息提示框");
				}).error(function(){
					
			});
		};
	}

	$scope.deleteUser = function() {
		console.log($scope.worker);
		$http({
			url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{id:$scope.worker.id,
				level:$scope.worker.level,method:'deleteUser'}
			}).success(function(data){
				console.log(data.result);

			}).error(function(){
				
		});
	};


});

app.controller('orderController',function($scope,$http){
	//得到全部订单
	$http({
		url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{method:'getSaleByName',currentPage:'1'}
		}).success(function(data){
			console.log('success');
			$scope.orders = data.salelist;
		}).error(function(){
			console.log('error!');
	});
	$scope.orderSearch = function() {
		$http({
		url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{method:'getSaleByName',currentPage:'1',
		odername:$scope.order.ordername,servicename:$scope.order.servicename}
		}).success(function(data){
			console.log('success');
			$scope.orders = data.salelist;
		}).error(function(){
			console.log('error!');
		});
	};
});



