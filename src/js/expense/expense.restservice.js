app.factory("expenseRestService", ['$http', 'HOST',

function($http, HOST) {
	"use strict";

	function postCreateExpense(accounting) {
		return $http({
			method: 'POST',
			url: HOST + '/api/expenses',
			params: {
				accounting: accounting
			}
		});
	}

	function getExpense(uid) {
		return $http({
			method: 'GET',
			url: HOST + '/api/expenses/'+uid
		});
	}

	function putExpense(uid, accounting) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/expenses/'+uid,
			params: {
				accounting: accounting
			}
		});
	}

	function accept(uid) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/expenses/'+uid+'/accept',
		});
	}

	function assignToManager(uid) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/expenses/'+uid+'/assign-to-manager',
		});
	}

	function reject(uid, reason) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/expenses/'+uid+'/reject',
			params: {
				comment: reason
			}
		});
	}

	function getAccessRights(uid) {
		return $http({
			method: 'GET',
			url: HOST + '/api/expenses/'+uid+'/access-rights'
		});
	}

	function getExpensePdf(uid) {
		return $http({
<<<<<<< Upstream, based on origin/master
			method: 'GET',
			url: HOST + '/api/expense/' + uid + '/export-pdf',
=======
			method: 'POST',
			url: HOST + '/api/expenses/' + uid + '/export-pdf',
			data: data
>>>>>>> dd0a7ed fix show pdf in iframe
		});
	}

	function getExpenseToken(uid) {
		return $http({
			method: 'POST',
			url: HOST + '/api/public/expenses/' + uid + '/token'
		});
	}

	function showPdf(uid) {
		return $http({
			method: 'POST',
			url: HOST + '/api/public/' + uid + '/download-pdf'
		});

	}

	return {
		postCreateExpense: postCreateExpense,
		getExpense: getExpense,
		putExpense: putExpense,
		assignToManager: assignToManager,
		getAccessRights: getAccessRights,
		accept: accept,
		reject: reject,
		getExpensePdf: getExpensePdf,
		getExpenseToken: getExpenseToken,
		showPdf: showPdf
	};

}]);
