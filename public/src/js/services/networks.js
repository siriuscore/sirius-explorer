'use strict';

angular.module('insight.networks')
	.factory('Networks',
		function(Constants, SiriusCoreLib) {
			return {
				getCurrentNetwork: function () {
					return SiriusCoreLib.Networks.get(Constants.NETWORK);
				}
			}
		});