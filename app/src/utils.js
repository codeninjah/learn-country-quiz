import countries from './countries'

//const flags = []
const flags = Object.keys(countries)
console.log(flags)

let rnd1 = Math.floor(Math.random() * (flags.length -1))
let rnd2 = Math.floor(Math.random() * (flags.length -1))
let rnd3 = Math.floor(Math.random() * (flags.length -1))
let rnd4 = Math.floor(Math.random() * (flags.length -1))

const randomFlags = () => {
	const flagList = Object.keys(countries)
	const newFlagList = {}
	const rightAnswer = Math.round(Math.random() * 3)
	for (let i = 0; i < 4; i++) {
		let unique = false
		while (!unique) {
			let number = Math.floor(Math.random() * (flagList.length -1))
			if (!Object.values(newFlagList).includes(flagList[number].toLowerCase())) {
				newFlagList[i] = flagList[number].toLowerCase()
				unique = !unique
			}
		}
	}
	return {
		alternatives: newFlagList,
		correct: newFlagList[rightAnswer]
	}
}

const randomFlagList = randomFlags()
console.log(randomFlagList)

const hardCodedQuestions = {
	1: {
		alternatives: {
			1: 'blz',
			2: 'fra',
			3: 'cub',
			4: 'swe',
		},
		correct: 'swe',
	},
	2: {
		alternatives: {
			1: 'blz',
			2: 'fra',
			3: 'cub',
			4: 'cog',
		},
		correct: 'fra',
	}
}

const randomQuestions = {
	1: randomFlags(),
	2: randomFlags(),
	3: randomFlags(),
	4: randomFlags(),
	5: randomFlags(),
}

export const createGame = () => {
	//const generatedQuestions = hardCodedQuestions
	if(localStorage.getItem("randomisedOrder")){
		const generatedQuestions = randomQuestions
		return {
			currentQuestion: 1,
			questions: generatedQuestions,
			score: {player1: 0, player2: 0},
			status: 'starting',
		}
	}
	else{
		const generatedQuestions = hardCodedQuestions
		return {
			currentQuestion: 1,
			questions: generatedQuestions,
			score: {player1: 0, player2: 0},
			status: 'starting',
		}
	}
	
	
}


export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
