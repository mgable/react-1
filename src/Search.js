import $ from 'jquery';

	var exports = {}

	var domain = "https://dog.ceo/api/",
		$http =  $.get;


 	function getBreeds(){
 		return _http("breeds/list/all", {}).then(function(response){
 			return response.message;
 		});
 	}

 	function getRandomImage(){
 		return _http("breeds/image/random", {}).then(function(response){
 			return response.message;
 		});
 	}

 	function getBreedImages(breed){
 		return _http(`breed/${breed}/images`, {}).then(function(response){
 			return response.message;
 		});
 	}

 	function _http(endpoint, params){
 		return $http(domain + endpoint, {params:params}, function(response){
 			return response;
 		});
 	}

 	function getRandomImages(howMany){

 		return new Promise(function(resolve, reject){
 			_getImage(howMany, []);

	 		function _getImage(howMany, promises){
		 		if (howMany--){
					promises.push(getRandomImage());
					setTimeout(_getImage(howMany, promises), 250);
				} else {
					Promise.all(promises).then(function(response){
						resolve(response);
					});
				}
		 	}
		});
 	}

 	exports.getBreeds = getBreeds;
 	exports.getRandomImage = getRandomImage;
 	exports.getRandomImages = getRandomImages;
 	exports.getBreedImages = getBreedImages;

 	export default exports;

