app.controller('AdminPoolSearchController', ['moment', '$scope', '$timeout', 'administrationRestService', '$filter',

function(moment, $scope, $timeout, administrationRestService, $filter) {
	'use strict';
	$scope.roles = [];
	$scope.expenseStates = [];
	$scope.form = {};
	$scope.searchConducted = false;
	$scope.form.startTime = moment().subtract(6, 'months').format('DD.MM.YYYY');
	$scope.form.endTime = moment().format('DD.MM.YYYY');

	$scope.itemsPerPage = 5;
	$scope.items = [];
	$scope.pagedItems = [];
	$scope.orderReverse = false;
	$scope.currentPage = 1;

	// orderColumn needs to match JSON object from back-end
	$scope.orderColumn = 'date';

	administrationRestService.getRoles().then(function(response) {
		$scope.roles = response.data;
	});

	administrationRestService.getExpenseStates().then(function(response) {
		$scope.expenseStates = response.data;
	});

	function createDatePickerStartTime() {
		jQuery('.datepicker-start-time').datetimepicker({
			format: 'DD.MM.YYYY',
			viewMode: 'months',
			allowInputToggle: true,
			maxDate: $filter('getISODate')($scope.form.endTime),
			calendarWeeks: true
		}).on('dp.hide', function() {
			$scope.form.startTime = jQuery('.datepicker-start-time').find('input').first().val();
		});
	}

	$timeout(function() {
		createDatePickerStartTime();
		jQuery('.datepicker-end-time').datetimepicker({
			format: 'DD.MM.YYYY',
			viewMode: 'months',
			allowInputToggle: true,
			maxDate: moment().valueOf(),
			calendarWeeks: true
		}).on('dp.hide', function() {
			$scope.form.endTime = jQuery('.datepicker-end-time').find('input').first().val();
			jQuery('.datepicker-start-time').datetimepicker('destroy');
			jQuery('.datepicker-start-time').datetimepicker("change", { maxDate: $filter('getISODate')($scope.form.endTime) });
		});
	});

	$scope.search = function() {
		var data = angular.copy($scope.form);
		data.startTime = $filter('getISODate')(data.startTime);
		data.endTime = $filter('getISODate')(data.endTime);

		administrationRestService.search(data).then(function(response) {
			$scope.searchConducted = true;

			$scope.items = response.data;
			sortItems();
			groupItemsToPages();
			setOrderIcon();
		});
	};

	$scope.sortBy = function(newOrderColumn) {
		if ($scope.orderColumn === newOrderColumn) {
			$scope.orderReverse = !$scope.orderReverse;
		}
		$scope.orderColumn = newOrderColumn;

		sortItems();
		groupItemsToPages();
		setOrderIcon();
	};

	function sortItems() {
		$scope.items = $filter('orderBy')($scope.items, $scope.orderColumn, $scope.orderReverse);
	}

	function groupItemsToPages() {
		$scope.pagedItems = [];

		for (var i=0; i<$scope.items.length; i++) {
			if (i % $scope.itemsPerPage === 0) {
				$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)+1] = [$scope.items[i]];
			} else {
				$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)+1].push($scope.items[i]);
			}
		}

		$scope.currentPage = 1;
	}

	function setOrderIcon() {
		$scope.orderIcon = {
			'user': 'fa-sort',
			'date': 'fa-sort',
			'totalCosts': 'fa-sort',
			'status': 'fa-sort'
		};
		$scope.orderIcon[$scope.orderColumn] = $scope.orderReverse ? 'fa-sort-asc' : 'fa-sort-desc';
	}

}]);
