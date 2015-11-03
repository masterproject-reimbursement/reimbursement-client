app.controller('EditCostCategoryController', [ '$scope', '$uibModalInstance', 'globalMessagesService', 'costCategory', 'isCreate', '$translate', 'administrationRestService',

	function ($scope, $uibModalInstance, globalMessagesService, costCategory, isCreate, $translate, administrationRestService) {
		"use strict";

		$scope.isLoading = false;
		$scope.lang = $translate.use();

		$scope.costCategory = {};
		angular.copy(costCategory, $scope.costCategory);

		$scope.isCreate = isCreate;

		function validation(form) {
			if (!form.accountNumber.$valid || !form.name_de.$valid || !form.name_en.$valid || !form.description_de.$valid || !form.description_en.$valid || !form.accounting_policy_de.$valid || !form.accounting_policy_en.$valid) {
				globalMessagesService.showInfo("reimbursement.expense.warning.formNotComplete.title",
					"reimbursement.expense.warning.formNotComplete.message");

				return false;
			} else {
				return true;
			}
		}

		$scope.dismissWithConfirmation = function () {
			globalMessagesService.confirmWarning("reimbursement.expense-item.closeWarningEditTitle",
					"reimbursement.expense-item.closeWarningEditMessage").then(function () {

					$uibModalInstance.dismiss();
				});
		};

		$scope.save = function (form) {

			if (validation(form)) {
				$scope.isLoading = true;

				if ($scope.costCategory.uid !== undefined) {
					administrationRestService.putCostCategory($scope.costCategory, $scope.costCategory.uid).then(function () {
						$uibModalInstance.dismiss();
					});
				} else {
					administrationRestService.postCostCategory($scope.costCategory).then(function () {
						$uibModalInstance.dismiss();
					});
				}
			}
		};
	}]);
