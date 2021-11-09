import countries from './countries.js'

export const randomFlags = () => {
	const flagList = Object.keys(countries)
	const newFlagList = {}
	const rightAnswer = Math.round(Math.random() * 3)

	for (let i = 0; i < 4; i++) {
		let unique = false
		while (!unique) {
			let number = Math.floor(Math.random() * (flagList.length - 1))
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

export const randomQuestions = (n) => {
	const questions = []
	const uniqueAnswers = []

	for (let i = 0; i < n; i++) {
		const question = randomFlags()
		if (!uniqueAnswers.includes(question.correct)) {
			questions.push(question)
			uniqueAnswers.push(question.correct)
		} else {
			i--
		}
	}

	return {
		...questions
	}
}

export const createGame = (n) => {
	const generatedQuestions = localStorage.getItem("randomisedOrder") ? randomQuestions(n) : hardCodedQuestions

	return {
		currentQuestion: 0,
		questions: generatedQuestions,
		score: { player1: 0, player2: 0 },
		status: 'starting',
	}
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
