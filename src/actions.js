import Search from './services.js';
import _ from 'underscore';
	
// breed browser
const HOWMANY = 12;

export const fetchData = () => {
	return new Promise((resolve, reject) => {
		Search.getBreeds().then((response) => {
			resolve (response)
		}, (error) => {
			reject(error)
		});	
	});
}

export const makeBreedBrowser = (breeds) => {
	var promises = [_makeBreedsList(breeds), _getBreedImages(null, null)];
	return Promise.all(promises).then((response) => {
		let results = _.extend({}, response[0], {images: response[1]});
		return results
	}, (error) => {
		throw new Error("There was an error making the breedbrowser: " + error);
	});
}

const _getBreedImages = (breed, sub) =>{
	if (breed === null){
		return _getRandomBreedImages(HOWMANY).then((response) => {
			return _.map(response, (image) => {
				return image.message;
			});
		}, (error) => {
			throw new Error ("There was an error getting the random breed images: " + error)
		});
	} else if (sub){
		return Search.getSubBreedImages(breed, sub).then((breedImages) => {
			breedImages.length = HOWMANY;
			return breedImages;
		});
	} else {
		return Search.getBreedImages(breed).then((breedImages) => {
			breedImages.length = HOWMANY;
			return breedImages;
		});
	}
}

const _makeBreedsList = (results) => {
	return {breeds: _groupByAlpha(results), rawBreedsObj: results}
}

const _groupByAlpha = (breeds) => {
	return _.groupBy(_.map(breeds, (val, key) => {
		return {name: key, subbreeds: val};
	}), (item) => {
		return item.name && item.name.charAt(0);
	});
}

const _getImage = (breed) => {
	return Search.getRandomBreedImage(breed).then((image) => {
		return image.message;
	});
}

const _getRandomBreedImages = (howMany) => {
	return Search.getRandomImages(howMany).then((response) => {
		return response
	}, (error) => {
		console.error(error);
	});
}

const _pickRandomBreed = (_rawBreedsList, howMany = 1, omit) => {
	var results = [],
		total = howMany,
		rawBreedsList;

	if (omit){
		rawBreedsList = _.without(_rawBreedsList, omit);
	} else {
		rawBreedsList = _rawBreedsList.slice(0)
	}

	while(total--){
		var index = Math.floor((Math.random() * rawBreedsList.length)),
		item = rawBreedsList.splice(index, 1);
		results.push(item[0]);
	}

	if (howMany === 1){
		return results[0];
	}

	return results;
}



// quiz
export const makeQuiz = (breeds) => {
	return new Promise((resolve, reject) => {
		var quiz = [], numOfQuestions = 4,
			rawBreedsList = Object.keys(breeds.message);

		while(numOfQuestions-- > 0){
			quiz.push(_makeQuestion(rawBreedsList));
		}

		Promise.all(quiz).then((response) => {
			resolve(response);
		}, (error) => {
			reject(error)
		})
		
	});
}

const _makeQuestion = (rawBreedsList) => {
	return new Promise((resolve, reject) => {
		let breed = _pickRandomBreed(rawBreedsList),
			otherBreeds = _pickRandomBreed(rawBreedsList, 3, breed),
			choiceList = _makeChoiceList(breed, otherBreeds), 
			question = {
				choiceList,
				answer: _makeAnswer(choiceList, breed),
				image: null,
				response: null
			}

		_getImage(breed).then((image) => {
			question.image = image
			resolve(question);
		}, (error) => {
			reject(error);
		});
	});
}

const _makeChoiceList = (breed, otherBreeds) => {
	let breeds = [breed, ...otherBreeds],
		results = _.map(breeds, (breed, idx) => {
			return {text: breed, id: idx};
		});

	return _.shuffle(results);
}

const _makeAnswer = (choiceList, breed) => {
	var answer;

	for (let i = 0; i < choiceList.length; i++){
		if (choiceList[i].text === breed){
			answer = i;
			break;
		}
	}
	return answer;
}

/*
 * action types
 */

export const SUBMIT_ANSWER = 'SUBMIT_ANSWER'
export const NEXT_QUESTION = 'NEXT_QUESTION'
export const MAKE_QUIZ = 'MAKE_QUIZ'
export const QUIZ_READY = 'QUIZ_READY'
export const MAKE_BREED_BROWSER = 'MAKE_BREED_BROWSER'
export const FILTER_BREEDS = 'FILTER_BREEDS'
export const SELECT_BREED = 'SELECT_BREED'
export const STATES = {START: "START", LOADED: "LOADED", FINISH: "FINISH"}

/*
 * action creators
 */

export function submitAnswer(answer) {
	return { type: SUBMIT_ANSWER, answer }
}

export function nextQuestion() {
	return { type: NEXT_QUESTION }
}

export function selectBreed(breed, sub, images) {
	return { type: SELECT_BREED, breed, sub, images }
}

export function filterBreeds(term){
	return {type: FILTER_BREEDS, term}
}

/*
 * exported methods
 */

export const GetBreedImages = _getBreedImages
export const GroupByAlpha = _groupByAlpha;
