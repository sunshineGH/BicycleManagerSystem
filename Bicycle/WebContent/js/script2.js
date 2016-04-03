var app = angular.module('myApp',['ngRoute','ngCookies','tm.pagination','ngDialog']);
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
		controller:'addOrderController',
		templateUrl:'pages/addOrder.html'
	})
	.when('/goodList',{
		controller:'goodController',
		templateUrl:'pages/goodList.html'
	})
	.when('/addGoods',{
		controller:'goodDetailController',
		templateUrl:'pages/goodDetail.html'
	})
	.when('/updateGood/:id',{
		controller:'goodDetailController',
		templateUrl:'pages/goodDetail.html'
	})
	.when('/productList',{
		controller:'productController',
		templateUrl:'pages/productList.html'
	})
	.when('/updateProduct/:id',{
		controller:'productDetailController',
		templateUrl:'pages/productDetail.html'
	})
	.when('/addProduct',{
		controller:'productDetailController',
		templateUrl:'pages/productDetail.html'
	})
	.when('/information',{
		controller:'informationController',
		templateUrl:'pages/information.html'
	});
});
app.controller ('mainController',function($scope){

});
app.controller('indexController',function($scope,$location,$cookieStore) {
	console.log($location.search().id);
	console.log($location.search().level);
	$scope.user = {
		level:$location.search().level,
	};
	$cookieStore.put('userid',$location.search().id);
	$cookieStore.put('userlevel',$location.search().level);
	$scope.isServicerShow = true;
	$scope.isShopkeeperShow = true;
	$scope.isManagerShow = true;
	$scope.isGoodShow = true;
	$scope.isProductShow = true;
	//各权限隐藏导航
	if($scope.user.level == '3') {
		$scope.isServicerShow = false;
		$scope.isShopkeeperShow = false;
		$scope.isManagerShow = false;
		$scope.isGoodShow = false;
		$scope.isProductShow = false;
	}else if($scope.user.level == '4') {
		$scope.isShopkeeperShow = false;
		$scope.isManagerShow = false;
		$scope.isGoodShow = false;
		$scope.isProductShow = false;
	}else if($scope.user.level == '2') {
		$scope.isManagerShow = false;
	}
});
app.controller('userController',function($scope,$http,$location,$cookieStore) {
	console.log($cookieStore.get('userid'));
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

	$scope.paginationConf = {
		currentPage:1,
		itemsPerPage:5
	};	
	
	var getUserList = function() {
		$http({
			url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{level:level,method:'getUserList',currentPage:$scope.paginationConf.currentPage}
		}).success(function(data){
			console.log("success!");
			$scope.workers = data.users;
			$scope.paginationConf.totalItems = data.count;
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
					if(data.result) {
						layer.alert("修改完成",{icon:6});
					}else {
						layer.alert("提交失败，请稍后重试",{icon:5});
					}
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
		$scope.validateID = function() {
			if(!$scope.userForm.userID.$error) {
				$http({
					url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
					dataType:"jsonp",
					method:'GET',
					contentType:'application/json;charset=utf-8',
					async:true,
					processData:false,
					cache:false,
					params:{id:$scope.worker.id,method:'isSaveUser',level:$scope.worker.level}
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

app.controller('orderController',['$scope','$http','ngDialog',function($scope,$http,$ngDialog){
	$scope.paginationConf = {
		currentPage:1,
		itemsPerPage:5
	};	
	//得到全部订单
	var getOrderList = function() {
		$http({
			url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'getSaleByName',currentPage:$scope.paginationConf.currentPage}
			}).success(function(data){
				console.log('success');
				$scope.orders = data.salelist;
				console.log($scope.orders);
				$scope.paginationConf.totalItems = data.count;
			}).error(function(){
				console.log('error!');
		});
	};
	$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage',getOrderList);
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
	$scope.getOrderDetail = function(order){
		console.log(order);
		$http({
			url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'getSaleDetail',id:order.id}
		}).success(function(data){
			console.log('success');
			$scope.order = data.result;
		}).error(function(){
			console.log('error!');
		});
		$ngDialog.open({template:'pages/orderDetail.html',
			className:'ngdialog-theme-plain',
			scope:$scope,
		});
	};
	//删除订单
	$scope.deleteOrder = function(order) {
		layer.confirm('确定删除该订单吗？',{
			btn:['确定','取消'] 
		},function(){
			$http({
				url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
				dataType:"jsonp",
				method:'GET',
				contentType:'application/json;charset=utf-8',
				async:true,
				processData:false,
				cache:false,
				params:{method:'deleteSale',id:order.id}
			}).success(function(data){
				layer.msg('已删除',{icon:1});
				console.log('success');
				$scope.orders = data.salelist;	
				getOrderList();
			}).error(function(){
				console.log('error!');
				layer.msg('删除遇到错误，请稍后重试',{icon:5});
			});	
		},function() {
			layer.msg('已取消',{
				time:2000
			});
		});
		
	};
}]);

app.controller('goodController',function($scope,$http){
	$scope.getGoodList = function(){
		$http({
			url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'getGoodsList'}
			}).success(function(data){
				console.log('success');
				$scope.goods = data.result;
			}).error(function(){
				console.log('error!');
		});
	};
	$scope.getGoodList();
	$scope.deleteGood = function(id) {
		$http({
			url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'deleteGoods',id:id}
			}).success(function(data){
				console.log('success');
				$scope.goods = data.result;
				$scope.getGoodList();
			}).error(function(){
				console.log('error!');
		});
	};
	
	
});
app.controller('goodDetailController',function($scope,$http,$location,$routeParams) {
	if($routeParams.id!=null){
		$scope.good = {
			id:$routeParams.id,
		};
		//getGoodDetail
		$scope.change = "修改";
		$scope.isHideId = false;
		$scope.isReadOnlyName = true;
		$http({
			url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'getGoodsById',id:$scope.good.id}
			}).success(function(data){
				console.log('success');
				$scope.good = data.result;
			}).error(function(){
				console.log('error!');				
		});
		$scope.saveGoods = function() {	
			if($scope.goodForm.$valid){
				$http({
					url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
					dataType:"jsonp",
					method:'GET',
					contentType:'application/json;charset=utf-8',
					async:true,
					processData:false,
					cache:false,
					params:{method:'updateGoods',id:$scope.good.id,name:$scope.good.name,
						introduction:$scope.good.introduction,money:$scope.good.money}
					}).success(function(data){
						console.log('success');
						if(!data.result) {
							layer.alert("提交失败，请稍后重试",{icon:5});
						}else {
							layer.alert("提交成功，信息已修改",{icon:6});
							$location.path('/goodList');
						}
					}).error(function(){
						console.log('error!');				
				});
			}else{
				layer.alert("请完善表单信息后重新提交",{icon:5});
			}
		};
	}else{
		$scope.change = "新建";
		$scope.isHideId = true;
		$scope.saveGoods = function() {	
			if($scope.goodForm.$valid){
				$http({
					url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
					dataType:"jsonp",
					method:'GET',
					contentType:'application/json;charset=utf-8',
					async:true,
					processData:false,
					cache:false,
					params:{method:'addGoods',name:$scope.good.name,
						introduction:$scope.good.introduction,money:$scope.good.money}
					}).success(function(data){
						console.log('success');
						if(!data.result) {
							layer.alert("提交失败，请稍后重试",{icon:5});
						}else {
							layer.alert("提交成功，服务已添加",{icon:6});
							$location.path('/goodList');
						}
					}).error(function(){
						console.log('error!');				
				});
			}else{
				layer.alert("请完善表单信息后重新提交",{icon:5});
			}
		};
	}

	$scope.resetGoods = function() {
		if($routeParams.id!=null) {
			$scope.good = {
				id:$scope.good.id,
				name:$scope.good.name,
				introduction:'',
				money:'',
			};
		}else {
			$scope.good = {};
		}
 	};
});
app.controller('productController',function($scope,$http,$routeParams){
	$scope.getProductList = function(){
		$http({
			url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'getProductList'}
			}).success(function(data){
				console.log('success');
				$scope.products = data.result;
			}).error(function(){
				console.log('error!');
		});
	};
	$scope.getProductList();
	$scope.deleteProduct = function(id) {
		$http({
			url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'deleteProduct',id:id},
			}).success(function(data){
				console.log('success');
				$scope.products = data.result;
				$scope.getProductList();
			}).error(function(){
				console.log('error!');
		});
	};
});

app.controller('productDetailController',function($scope,$http,$location,$routeParams){
	if($routeParams.id!=null) {
		$scope.product = {
			id: $routeParams.id,
		};
		$scope.change = "修改";
		$scope.isHideId = false;
		$scope.isReadOnlyName = true;
		//getProductDetailById
		$http({
			url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'getProductById',id:$scope.product.id}
			}).success(function(data){
				console.log('success');
				$scope.product = data.result;
			}).error(function(){
				console.log('error!');				
		});
		$scope.saveProduct = function() {
			if($scope.productForm.$valid){
				$http({
					url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
					dataType:"jsonp",
					method:'GET',
					contentType:'application/json;charset=utf-8',
					async:true,
					processData:false,
					cache:false,
					params:{method:'updateProduct',id:$scope.product.id,name:$scope.product.name,
						amount:$scope.product.amount,money:$scope.product.money}
					}).success(function(data){
						console.log('success');
						if(!data.result) {
							layer.alert("提交失败，请稍后重试",{icon:5});
						}else {
							layer.alert("提交成功,信息已修改",{icon:6});
							$location.path('/productList');
						}
					}).error(function(){
						console.log('error!');
				});
			}else{
				layer.alert("请完善表单信息后重新提交",{icon:6});
			}
		};
	}else {
		$scope.change = "新建";
		$scope.isHideId = true;
		$scope.saveProduct = function() {
			if($scope.productForm.$valid){
				$http({
					url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
					dataType:"jsonp",
					method:'GET',
					contentType:'application/json;charset=utf-8',
					async:true,
					processData:false,
					cache:false,
					params:{method:'addProduct',name:$scope.product.name,
						amount:$scope.product.amount,money:$scope.product.money}
					}).success(function(data){
						console.log('success');
						if(!data.result) {
							layer.alert("提交失败，请稍后重试",{icon:5});
						}else {
							layer.alert("提交成功，产品已添加",{icon:6});
							$location.path('/productList');
						}
					}).error(function(){
						console.log('error!');
				});
			}else{
				layer.alert("请完善表单信息后重新提交",{icon:6});
			}
		};
	}

	$scope.resetProduct = function() {
		if($routeParams.id!=null) {
			$scope.product = {
				money:'',
				amount:'',
				name:$scope.product.name,
				id:$scope.product.id,
			};
		}else{
			$scope.product = {
			};
		}
	};
});

app.controller('addOrderController',function($scope,$http){
	$scope.hasSubmitOrder = true;
	console.log($scope.hasSubmitOrder);
	//getAllOrderUsers
	$http({
		url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{method:'getAllUser'}
		}).success(function(data){
			console.log('success');
			$scope.orderUsers = data.result;
		}).error(function(){
			console.log('error!');				
	});
	//getAllServicers
	$http({
		url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{method:'getAllUser',level:'3'}
	}).success(function(data){
		console.log('success');
		$scope.servicers = data.result;
	}).error(function(){
		console.log('error!');				
	});
	//getAllGoods
	$http({
		url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{method:'getGoodsList'}
	}).success(function(data){
		console.log('success');
		$scope.goods = data.result;
	}).error(function(){
		console.log('error!');				
	});
	//getAllProducts
	$http({
		url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{method:'getProductList'}
	}).success(function(data){
		console.log('success');
		$scope.products = data.result;
	}).error(function(){
		console.log('error!');				
	});
	//计算服务的价格
	$scope.order = {
		money:0,
	};
	$scope.order.selectedGood = [];
	$scope.order.selectedGoodId = []; 
	$scope.order.selectedGoodName = [];
  	$scope.parseInt = parseInt;
    var updateSelectedGood = function(action,good){ 
		if(action == 'add' && $scope.order.selectedGood.indexOf(good) == -1){ 
			$scope.order.selectedGood.push(good);
		    $scope.order.selectedGoodId.push(good.id); 
		    $scope.order.selectedGoodName.push(good.name); 
		    $scope.order.money = parseInt($scope.order.money) + parseInt(good.money);
		} 
		if(action == 'remove' && $scope.order.selectedGood.indexOf(good)!=-1){ 
		    var idx = $scope.order.selectedGood.indexOf(good); 
		    $scope.order.selectedGood.splice(idx,1);
		    $scope.order.selectedGoodId.splice(idx,1); 
		    $scope.order.selectedGoodName.splice(idx,1);
		    $scope.order.money = parseInt($scope.order.money) - parseInt(good.money);
		} 
    } ;
    
    $scope.updateGoodSelection = function($event, good){ 
		var checkbox = $event.target; 
		console.log(good);
		var action = (checkbox.checked?'add':'remove'); 
		updateSelectedGood(action,good); 
    } ;
    
    $scope.isSelectedGood = function(good){ 
		return $scope.order.selectedGood.indexOf(good)>=0; 
    } 

    //计算产品的价格
	$scope.order.selectedProduct = [];
	$scope.order.selectedProductId = []; 
	$scope.order.selectedProductName = [];
  	$scope.parseInt = parseInt;
    var updateSelectedProduct = function(action,product){ 
		if(action == 'add' && $scope.order.selectedProduct.indexOf(product) == -1){ 
			$scope.order.selectedProduct.push(product);
		    $scope.order.selectedProductId.push(product.id);
		    $scope.order.selectedProductName.push(product.name); 
		    $scope.order.money = parseInt($scope.order.money) + parseInt(product.money);
		} 
		if(action == 'remove' && $scope.order.selectedProduct.indexOf(product)!=-1){ 
		    var idx = $scope.order.selectedProduct.indexOf(product); 
		    $scope.order.selectedProduct.splice(idx,1);
		    $scope.order.selectedProductId.splice(idx,1); 
		    $scope.order.selectedProductName.splice(idx,1); 
		    $scope.order.money = parseInt($scope.order.money) - parseInt(product.money);
		} 
    } ;
    
    $scope.updateProductSelection = function($event, product){ 
		var checkbox = $event.target; 
		console.log(product);
		var action = (checkbox.checked?'add':'remove'); 
		updateSelectedProduct(action,product); 
    } ;
    
    $scope.isSelectedProduct = function(product){ 
		return $scope.order.selectedProduct.indexOf(product)>=0; 
    } ;

    //订单提交
	$scope.addOrder = function(){
		$http({
			url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'addSale',customer:$scope.order.customer,
			orderid:$scope.order.bubbleOrderUser.id,serviceid:$scope.order.bubbleServicer.id,
			productid:$scope.order.selectedProductId,goodsid:$scope.order.selectedGoodId,
			money:$scope.order.money}
		}).success(function(data){
			console.log('success');
			if(data.result) {
				layer.msg('订单已生成',{time:1000});
				$scope.hasSubmitOrder = false;
				console.log($scope.hasSubmitOrder);
			}else{
				layer.msg('提交失败',{time:1000});
				$scope.hasSubmitOrder = true;
			}
		}).error(function(){
			console.log('error!');				
		});
	};

	$scope.resetOrder = function() {
		$scope.order = {};
		$scope.order.selectedGood = [];
		$scope.order.selectedProduct = [];
		
	};
});



