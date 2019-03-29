function($scope, $http, $location, $window) {
	var c = this;
	//$scope.tables = data.tables;
	$scope.loading = false;
	$scope.search = "";
	$scope.hits = 0;
	$scope.table = "All Tables"
	$scope.table_name = ""
	$scope.setUrl = function (type) {
		console.log(type);
		var updateUrl = "";
		if (type === "sysid") {
			updateUrl = "/code" + "?s" + "=" + $scope.term;
		} else if (type === "code") {
			updateUrl = "/code" + "?q" + "=" + $scope.term;
		} else {
			updateUrl = "/code" + "?q" + "=" + $scope.term + "&t=" + type;
		}
		$window.history.pushState("", $scope.term, updateUrl);
	}
	$scope.setURLWithTable = function (table) {
		console.log('...');
		$scope.table_name = table;
		$scope.setUrl('code');
	}
	$scope.codeSearch = function () {
		$scope.search = "code";
		$scope.loading = true;
		if ($scope.term) {
			$scope.hits = 0;
			var searchGroup = "x_47329_code_searc.default";
			var endpoint = "/api/sn_codesearch/code_search/search?";
			endpoint += "search_group=" + searchGroup + "&";
			endpoint += "term=" + $scope.term + "&";
			endpoint += "search_all_scopes=true";
			if ($scope.table_name != "") {
				endpoint += "&table=" + $scope.table_name
			}
			$http.get(endpoint).success(function (response) {
				$scope.loading = false;
				$scope.results = response.result;
				console.log(response.result);
				if ($scope.table_name === "") {
					response.result.map(function (table) {
						table.hits.map(function (hit) {
							$scope.hits++;
						});
					})
				} else {
					if (response.result.hits) {
						response.result.table = {};
						response.result.table.recordType = $scope.table_name;
						response.result.table.tableLabel = $scope.table_name;
						response.result.table.hits = response.result.hits;
						response.result.hits.map(function (hit) {
							$scope.hits++;
						});
					}
				}
			});
		}
	}
	$scope.sysIdSearch = function () {
		$scope.search = "sysid";
		$scope.loading = true;
		if ($scope.term) {
			$scope.hits = 0;
			var searchGroup = "x_47329_code_searc.default";
			var endpoint = "/api/x_47329_code_searc/query?";
			endpoint += "sysid=" + $scope.term;
			$http.get(endpoint).success(function (response) {
				$scope.loading = false;
				$scope.results = response.result;
				//console.log($scope.results);
				$scope.results.map(function (hits) {
					$scope.hits++;
				})
			});
		}
	}
	$scope.setTable = function (table) {
		if (table.name == "") {
			$scope.table = "All Tables";
			$scope.table_name = ""
		} else {
			$scope.table = table.calculated;
			$scope.table_name = table.name;
		}
	};
	// Update to work with URL parameters
	if ($location.search().q) {
		$scope.term = $location.search().q;
		if ($scope.term.length > 0) {
			if ($location.search().t) {
				$scope.table_name = $location.search().t;
				$scope.table = $location.search().t
			}
			$scope.codeSearch();
		}
	}
	if ($location.search().s) {
		$scope.term = $location.search().s;
		if ($scope.term.length > 0) {
			$scope.sysIdSearch();
		}
	}
}