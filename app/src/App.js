import React from 'react'
import * as R from 'ramda'
import { Link, Route, useLocation } from "wouter"
import { customAlphabet } from 'nanoid'
import './App.css'
import * as utils from './utils'
import countries from './countries'
import winning from '../assets/winning.png'
import dog from '../assets/dog.png'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { ref, getDatabase, set, update } from "firebase/database"
import { useObject } from 'react-firebase-hooks/database'

// Initialize Firebase

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvxyz', 5)

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyA23W8Xt_oYUOqEoF6emmz-gUNMKRL5iqs",
	authDomain: "learn-country-quiz.firebaseapp.com",
	databaseURL: "https://learn-country-quiz-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "learn-country-quiz",
	storageBucket: "learn-country-quiz.appspot.com",
	messagingSenderId: "99518626682",
	appId: "1:99518626682:web:37abd119124fdb6722b4c3"
}

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

const db = getDatabase(app)

//console.log("Ditt token är")
const token = 'some-token'



function App() {

	return (
		<div className="app">
			<div className="header">THE FLAG GAME by PAS</div>
			<div className="middle">
				<Route path="/">
					<StartPage />
				</Route>
				<Route path="/game/:gameId/:playerId">
					{(params) => {
						return <GamePage gameId={params.gameId} playerId={params.playerId} />
					}}
				</Route>
			</div>
			<div className="footer"></div>
		</div>
	)
}

const StartPage = () => {
	const [snapshot, loading, error] = useObject(ref(db, 'nextGame'))
	const [location, setLocation] = useLocation()

	if (loading) return <div className="fw6 fs5">Loading...</div>
	const nextGame = snapshot.val()


	const play = async () => {
		if (R.isNil(nextGame)) {
			const updates = {}
			const gameId = nanoid()
			updates['/nextGame'] = gameId
			await update(ref(db), updates)
			setLocation(`/game/${gameId}/1`)
		}
		else {
			const game = utils.createGame()
			const updates = {}
			updates['/nextGame'] = null
			updates[`/games/${nextGame}`] = game
			await update(ref(db), updates)
			setLocation(`/game/${nextGame}/2`)

			await utils.sleep(3000)
			const updates2 = {}
			updates2[`/games/${nextGame}/status`] = 'playing'
			await update(ref(db), updates2)
		}
	}
	return (
		<div className="page">
			<div className="st-flags">
				<div className="f32"><div className={`flag aze`}></div></div>
				<div className="f32"><div className={`flag bih`}></div></div>
				<div className="f32"><div className={`flag brb`}></div></div>
				<div className="f32"><div className={`flag swe`}></div></div>
				<div className="f32"><div className={`flag bgd`}></div></div>
				<div className="f32"><div className={`flag bel`}></div></div>
				<div className="f32"><div className={`flag bfa`}></div></div>
				<div className="f32"><div className={`flag bgr`}></div></div>
				<div className="f32"><div className={`flag bhr`}></div></div>
				<div className="f32"><div className={`flag bdi`}></div></div>
				<div className="f32"><div className={`flag ben`}></div></div>
				<div className="f32"><div className={`flag bmu`}></div></div>
				<div className="f32"><div className={`flag brn`}></div></div>
				<div className="f32"><div className={`flag bol`}></div></div>
				<div className="f32"><div className={`flag bra`}></div></div>
				<div className="f32"><div className={`flag bhs`}></div></div>
				<div className="f32"><div className={`flag btn`}></div></div>
				<div className="f32"><div className={`flag fra`}></div></div>
				<div className="f32"><div className={`flag bwa`}></div></div>
			</div>
			<div className="button btn-square" onClick={play}>Play</div>
		</div>
	)
}

const GamePage = ({ gameId, playerId }) => {
	const [snapshot, loading, error] = useObject(ref(db, `games/${gameId}`))
	const [location, setLocation] = useLocation()

	if (loading) return <div className="fw6 fs5">Loading...</div>
	const game = snapshot.val()

	const cancel = async () => {
		const updates = {}
		updates['/nextGame'] = null
		await update(ref(db), updates)
		setLocation(`/`)
	}

	if (game && game.status === 'playing') return <QuestionPage gameId={gameId} playerId={playerId} />
	if (game && game.status === 'finished') return <ResultsPage gameId={gameId} playerId={playerId} />

	return (
		<div className="page">
			<div className="fw6 fs9 tac">
				{!game && 'Waiting for opponent...'}
				{game && game.status === 'starting' && 'Starting game... Get READY!'}
			</div>
			{!game && <div className="link" style={{ marginTop: '10rem' }} onClick={cancel}>Cancel</div>}
		</div>
	)
}

const QuestionPage = ({ gameId, playerId }) => {
	const [snapshot, loading, error] = useObject(ref(db, `games/${gameId}`))
	const scoringFlag = !!JSON.parse(localStorage.getItem('improvedScoring'))

	if (loading) return <div className="fw6 fs5">Loading...</div>
	const game = snapshot.val()

	const youKey = `player${playerId}`
	const opponentKey = `player${parseInt(playerId) === 1 ? 2 : 1}`

	const question = game.questions[`${game.currentQuestion}`]

	if (!question) return 'Loading...'

	const answer = async (countryCode) => {
		if (question.fastest) return

		const updates = {}
		updates[`/games/${gameId}/questions/${game.currentQuestion}/fastest`] = { player: playerId, answer: countryCode }
		if (countryCode == question.correct) {
			updates[`/games/${gameId}/score/${youKey}`] = game.score[youKey] + 1
		} else {
			if (scoringFlag) {
				updates[`/games/${gameId}/score/${youKey}`] = game.score[youKey] - 1
			}
		}
		await update(ref(db), updates)

		if (game.currentQuestion < Object.values(game.questions).length) {
			await utils.sleep(3000)
			const updates2 = {}
			updates2[`/games/${gameId}/currentQuestion`] = parseInt(game.currentQuestion) + 1
			await update(ref(db), updates2)
		}
		else {
			await utils.sleep(3000)
			const updates2 = {}
			updates2[`/games/${gameId}/status`] = 'finished'
			await update(ref(db), updates2)
		}
	}

	return (
		<div className="page">
			<div className="f32"><div className={`flag ${question.correct}`}></div></div>
			<div className="alternatives">
				{Object.entries(question.alternatives).map(([k, countryCode]) => {
					let correct = null
					let youOrOpponent = false
					if (question.fastest && question.fastest.answer == countryCode) {
						correct = question.fastest.answer === question.correct
						if (question.fastest.player === playerId) {
							youOrOpponent = `YOU ${correct ? ' +1' : scoringFlag ? '-1' : ''}`
						}
						else {
							youOrOpponent = `OPPONENT ${correct ? ' +1' : scoringFlag ? '-1' : ''}`
						}
					}
					return (
						<div className={`button alt ${correct && 'alt-green'} ${correct === false && 'alt-red'}`}
							key={countryCode} title={countryCode} onClick={() => answer(countryCode)}>
							{countries[countryCode.toUpperCase()]}
							{ }
							{youOrOpponent && <div className="alt-label">{youOrOpponent}</div>}
						</div>)
				})}
			</div>
			{question.fastest && <div className="fs7 fw5 m9">Get ready for the next question...</div>}
			{question.fastest &&
				<QuickResults you={game.score[youKey]} opponent={game.score[opponentKey]} />
			}
		</div>
	)
}

const QuickResults = ({ you, opponent }) => {
	return (
		<div className="quick-results">
			YOU {you} - {opponent} OPPONENT
		</div>
	)
}

const ResultsPage = ({ gameId, playerId }) => {
	const [snapshot, loading, error] = useObject(ref(db, `games/${gameId}`))

	if (loading) return <div className="fw6 fs5">Loading...</div>
	const game = snapshot.val()

	const youKey = `player${playerId}`
	const opponentKey = `player${parseInt(playerId) === 1 ? 2 : 1}`

	const youWon = (game.score[youKey] >= game.score[opponentKey])

	return (
		<div className="page">
			{youWon && <Won you={game.score[youKey]} opponent={game.score[opponentKey]} />}
			{!youWon && <Lost you={game.score[youKey]} opponent={game.score[opponentKey]} />}
			<Link href="/" className="re-home link">Home</Link>
		</div>
	)
}

const Won = ({ you, opponent }) => {
	return (
		<div className="results">
			<img src={winning} style={{ width: '80%' }} />
			<div className="re-text">Congratulations!!</div>
			<QuickResults you={you} opponent={opponent} />
		</div>
	)
}

const Lost = ({ you, opponent }) => {
	return (
		<div className="results">
			<img src={dog} style={{ width: '80%' }} />
			<div className="re-text">Better luck next time...</div>
			<QuickResults you={you} opponent={opponent} />
		</div>
	)
}

export default App







