app.controller('DashboardController', ['$scope', '$filter', '$state', '$uibModal', 'USER', 'globalMessagesService', 'dashboardRestService',

	function ($scope, $filter, $state, $uibModal, USER, globalMessagesService, dashboardRestService) {
		'use strict';

		$scope.user = USER;
		$scope.myExpenses = [];
		$scope.myReviewExpenses = [];

		$scope.showReviewSection = false;
		if (USER.hasRole('FINANCE_ADMIN') || USER.hasRole('PROF')) {
			$scope.showReviewSection = true;
		}

		function updateMyExpenses() {
			dashboardRestService.getMyExpenses().then(function (response) {
				$scope.myExpenses = response.data;
			});
		}
		updateMyExpenses();

		function updateReviewExpenses() {
			dashboardRestService.getReviewExpenses().then(function (response) {
				$scope.myReviewExpenses = response.data;
			});
		}
		if($scope.showReviewSection) {
			updateReviewExpenses();
		}

		$scope.go = function (state, params) {
			$state.go(state, params);
		};

		$scope.addExpense = function () {
			var modalInstance = $uibModal.open({
				templateUrl: 'expense/create-expense-sap.tpl.html',
				controller: 'CreateExpenseSapController'
			});

			modalInstance.result.then(function(data) {
				$state.go('create-expense', { uid: data.uid });
			});
		};

		$scope.deleteExpense = function(uid) {
			globalMessagesService.confirmWarning('reimbursement.expense.confirmDeleteTitle',
			'reimbursement.expense.confirmDeleteMessage').then(function() {
				dashboardRestService.deleteExpense(uid).then(updateMyExpenses);
			});
		};

		// ordering of table

		function orderList(expense, states) {
			var stateNr = states.length - states.indexOf(expense.state);
			var shortDate = (expense.date+"").substring(0, (expense.date+"").length - 3);
			return parseInt("-" + stateNr + shortDate, 10);
		}

		$scope.assignToMe = function(uid) {
			globalMessagesService.confirmInfo('reimbursement.expense.confirmAssignTitle',
			'reimbursement.expense.confirmAssignMessage').then(function() {
				dashboardRestService.assignToMe(uid).then(updateReviewExpenses);
			});
		};

		$scope.stateOrdering = function(expense) {
			var states = [];
			states = [
				"DRAFT",
				"REJECTED",
				"TO_SIGN_BY_USER",
				"ASSIGNED_TO_MANAGER",
				"TO_BE_ASSIGNED",
				"ASSIGNED_TO_FINANCE_ADMIN",
				"TO_SIGN_BY_MANAGER",
				"TO_SIGN_BY_FINANCE_ADMIN",
				"PRINTED"
			];
			return orderList(expense, states);
		};

		$scope.stateOrderingProfAdmin = function(expense) {
			var states = [];
			if(USER.hasRole('PROF')) {
				states = [
					"ASSIGNED_TO_MANAGER",
					"TO_SIGN_BY_MANAGER",
					"TO_BE_ASSIGNED",
					"ASSIGNED_TO_FINANCE_ADMIN",
					"TO_SIGN_BY_USER",
					"TO_SIGN_BY_FINANCE_ADMIN",
					"REJECTED",
					"DRAFT",
					"PRINTED"
				];
			}
			if(USER.hasRole('FINANCE_ADMIN')) {
				states = [
					"TO_BE_ASSIGNED",
					"ASSIGNED_TO_FINANCE_ADMIN",
					"TO_SIGN_BY_FINANCE_ADMIN",
					"REJECTED",
					"ASSIGNED_TO_MANAGER",
					"TO_SIGN_BY_USER",
					"TO_SIGN_BY_MANAGER",
					"DRAFT",
					"PRINTED"
				];
			}
			return orderList(expense, states);
		};
	}
]);