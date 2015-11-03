app.controller('PrintExpenseController', ['$scope', '$stateParams', '$window', 'THIS_HOST', 'spinnerService', 'expenseRestService', 'base64BinaryConverterService',

function($scope, $stateParams, $window, THIS_HOST, spinnerService, expenseRestService, base64BinaryConverterService) {
	"use strict";

	$scope.expense = $stateParams.expense;
	$scope.expenseItems = [];

	$scope.showPdf = function() {
		spinnerService.show('spinnerPrintExpense');

		if ($scope.expense.hasDigitalSignature === true || $scope.expense.state === 'PRINTED') {
			getExpensePdf();
		} else {
			var url = THIS_HOST + "/expense/guest/";
			expenseRestService.generatePdf($scope.expense.uid, url).then(getExpensePdf);
		}
	};

	function getExpensePdf() {
		expenseRestService.getExpensePdf($scope.expense.uid).then(function(response) {

		base64BinaryConverterService.toBase64FromJson(response.data, function(base64String) {
		$window.open(base64String, '_blank');
		});

		})['finally'](function() {
			spinnerService.hide('spinnerPrintExpense');
		});
	}

}]);
