import React, { useState } from 'react'
import * as R from 'ramda'
import { Link, Route, useLocation } from "wouter"
import { customAlphabet } from 'nanoid'
import LogRocket from 'logrocket'
import './App.css'
import * as utils from './utils'
import UpdateTable from './components/UpdateTable'
import countries from './countries'
import winning from '../assets/winning.png'
import dog from '../assets/dog.png'
import tie from '../assets/tie.png'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { ref, getDatabase, query, set, update, orderByChild } from "firebase/database"
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
const app = initializeApp(firebaseConfig)

const db = getDatabase(app)

function App() {
	const [snapshot, loading, error] = useObject(ref(db, `profiles`))
	const profile = localStorage.getItem('profile')

	if (loading) { return <p>Loading...</p> }
	if (error) { return <p>Something went wrong!</p> }

	return (
		<div className="app">
			<div className="header">THE FLAG GAME by PAS</div>
			<div className="middle">
				<Route path="/">
					<StartPage profiles={snapshot.val()} />
				</Route>
				<Route path="/game/:gameId/:playerId">
					{(params) => {
						return <GamePage gameId={params.gameId} profiles={snapshot.val()} playerId={params.playerId} />
					}}
				</Route>
				<Route path="/cookies">
					<CookieInfo />
				</Route>
				<Route path="/setup">
					<Setup />
				</Route>
				<Route path="/setup-advanced">
					<AdvancedSetup />
				</Route>
			</div>
			<div className="footer" style={{ backgroundColor: snapshot.val()[profile].background }}></div>
		</div>
	)
}

const CookieBanner = ({ setConsent, setLocation }) => {
	return (
		<div className="cookie-banner">
			<h3>This site uses cookies for improvement purposes</h3>
			<div className="banner-buttons">
				<button className="banner-button" onClick={setConsent}>OK</button>
				<button className="banner-button" onClick={() => setLocation('/cookies')}>Read more</button>
			</div>
		</div>
	)
}

const Setup = () => {
	const [profile, setProfile] = useState(localStorage.getItem('profile'))

	const updateProfile = (newProfile) => {

		if (newProfile !== 'none') {
			localStorage.setItem('profile', newProfile)
		} else {
			localStorage.removeItem('profile')
		}

		setProfile(newProfile)
	}

	const changeFlag = (flagString) => {
		let flag = !!JSON.parse(localStorage.getItem(flagString))
		localStorage.setItem(flagString, JSON.stringify(!flag))
		flag = !!JSON.parse(localStorage.getItem(flagString))
		document.querySelector("." + flagString + " span").innerText = JSON.stringify(flag)
	}
	return (
		<div className="setup">
			<button className="extraFlag" onClick={() => changeFlag("extraFlag")}>random flags: <span>false</span></button>
			<button className="tie" onClick={() => changeFlag("tie")}>tie: <span>false</span></button>
			<button className="improvedScoring" onClick={() => changeFlag("improvedScoring")}>improved scoring: <span>false</span></button>
			<button className="randomizedOrder" onClick={() => changeFlag("randomizedOrder")}>randomized order: <span>false</span></button>
			<label>Chosen profile:</label>
			<select value={profile || 'none'} onChange={(e) => updateProfile(e.target.value)} style={{ backgroundColor: '#676767' }}>
				<option value="none">Not set</option>
				<option value="alpha">Alpha</option>
				<option value="beta">Beta</option>
				<option value="pilots">Pilots</option>
				<option value="rest">Rest</option>
			</select>
			<Link to="/">Home</Link>
		</div>
	)
}

const AdvancedSetup = () => {
	const [location, setLocation] = useLocation()
	const [snapshot, loading, error] = useObject(ref(db, `profiles`))

	if (loading) { return <p>Loading...</p> }
	if (error) { return <p>Something went wrong...</p> }

	const updateProps = {
		updateGrid: async (profile) => {
			const updates = {}
			updates[`/profiles/${profile}/grid`] = !snapshot.val()[profile].grid
			await update(ref(db), updates)
		},
		updateLatestGames: async (profile) => {
			const updates = {}
			updates[`/profiles/${profile}/latestGames`] = !snapshot.val()[profile].latestGames
			await update(ref(db), updates)
		},
		updateCountdown: async (profile) => {
			const updates = {}
			updates[`/profiles/${profile}/countdown`] = !snapshot.val()[profile].countdown
			await update(ref(db), updates)
		},
		updateNumQuestions: async (profile) => {
			const updates = {}
			updates[`/profiles/${profile}/numQuestions`] = !snapshot.val()[profile].numQuestions
			await update(ref(db), updates)
		},
		updateBackground: async (profile, color) => {
			const updates = {}
			updates[`/profiles/${profile}/background`] = color
			await update(ref(db), updates)
		}
	}

	return (
		<div className="advanced-setup-wrapper">
			<UpdateTable snapshot={snapshot.val()} updateProps={updateProps} />
			<button className="back-button" type="button" onClick={() => setLocation('/')}>BACK</button>
		</div>
	)
}

const CookieInfo = ({ }) => {
	const [location, setLocation] = useLocation()

	return (
		<main className="cookie-info-wrapper">
			<div className="info-box">
				<h1>The cookies we use</h1>
				<p><strong>This site uses cookies to enhance user experience.</strong></p>
				<p>The cookies we use are:</p>
				<ul>
					<li>
						<h3><strong>Google Analytics</strong></h3>
						<p><em>This cookie tracks game interaction and sends the information to the developer. The data is used to see how users interact with the game and improve functionality.</em></p>
					</li>
					<li>
						<h3><strong>LogRocket</strong></h3>
						<p><em>This cookie records movement on the site and sends the information to the developer. The data is used to see how users interact with the game and improve functionality.</em></p>
					</li>
				</ul>
				<h2>List of subprocessors</h2>
				<ul>
					<li>
						<h3>Google</h3>
						<h4>Purpose</h4>
						<p>Send event data to Google Analytics</p>
						<h4>Country</h4>
						<p>United States</p>
					</li>
					<li>
						<h3>LogRocket</h3>
						<h4>Purpose</h4>
						<p>Graphic tracking of user interaction on site (screen recording)</p>
						<h4>Country</h4>
						<p>United States</p>
					</li>
				</ul>
				<button className="back-button green" onClick={() => setLocation('/')}>Ok, take me back</button>
			</div>
		</main>
	)
}

const LastGames = () => {
	const [snapshot, loading, error] = useObject(ref(db, 'games'))


	if (loading) return <div className="fw6 fs5">Loading...</div>
	const latestResults = snapshot.val()
	const keys = Object.keys(latestResults)

	const resultList = []

	keys.forEach(element => {
		if (latestResults[element].finishedTime) {
			resultList.push(latestResults[element])
		}
	})

	resultList.sort(function (a, b) {
		return b.finishedTime - a.finishedTime
	})

	return (
		<div className="result">
			<h5>Latest games</h5>
			{resultList.slice(0, 4).map(result => (
				<div key={Math.random()}>
					<p>Player 1  <span>{result.score.player1}</span></p>
					<p><span>{result.score.player2}</span>  Player 2</p>
				</div>
			))}
		</div>
	)
}

const StartPage = ({ profiles }) => {
	const [consent, setConsent] = useState(!!localStorage.getItem('cookieConsent'))
	const [count, setCount] = useState(5)
	const [snapshot, loading, error] = useObject(ref(db, 'nextGame'))
	const [location, setLocation] = useLocation()
	const profile = localStorage.getItem('profile')

	if (loading) return <div className="fw6 fs5">Loading...</div>
	const nextGame = snapshot.val()
	const extraFlag = !!JSON.parse(localStorage.getItem("extraFlag"))

	const changeValue = (add) => {
		if (count >= 10 && add) {
			setCount(0)
		} else if (count <= 0 && !add) {
			setCount(10)
		} else {
			add ? setCount(count + 1) : setCount(count - 1)
		}
	}

	const setConsentInStorage = () => {
		localStorage.setItem('cookieConsent', 'true')
		window['ga-disable-G-S56RDCKLLD'] = false
		LogRocket.init('iw1mxc/learn-quiz')
		setConsent(true)
	}

	const play = async (numOfQuest) => {
		if (R.isNil(nextGame)) {
			const updates = {}
			const gameId = nanoid()
			updates['/nextGame'] = gameId
			await update(ref(db), updates)
			setLocation(`/game/${gameId}/1`)
		}
		else {
			const game = numOfQuest ? utils.createGame(numOfQuest) : utils.createGame(5)
			gtag('event', 'start_game', { 'profile': profile })
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
			{
				extraFlag ? (
					<div className="st-flags">
						{utils.randomFlags(48).map(flag => (
							<div className="f32" key={flag + 2}><div className={`flag ${flag}`}></div></div>
						))}
					</div>
				) : (
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
				)
			}
			{
				profiles[profile].numQuestions ? (
					<div className="playContainer">
						<div className="button btn-square" onClick={() => play(count)}>Play</div>
						<div className="countContainer">
							<div className="btn-square" onClick={() => changeValue(true)}>+</div>
							<div className="btn-square" onClick={() => changeValue(false)}>-</div>
						</div>
						<p>number of questions: {count}</p>
					</div>
				) :
					(
						<div className="button btn-square" onClick={() => play(false)}>Play</div>
					)
			}
			{
				!consent && (
					<CookieBanner setLocation={setLocation} setConsent={setConsentInStorage} />
				)
			}
			{
				profiles[profile].latestGames && (
					<LastGames />
				)

			}
		</div>
	)
}

const GamePage = ({ gameId, playerId, profiles }) => {
	const [snapshot, loading, error] = useObject(ref(db, `games/${gameId}`))
	const [location, setLocation] = useLocation()
	const profile = localStorage.getItem('profile')

	if (loading) return <div className="fw6 fs5">Loading...</div>
	const game = snapshot.val()

	const cancel = async () => {
		const updates = {}
		gtag('event', 'cancel_game', { 'profile': profile })
		updates['/nextGame'] = null
		await update(ref(db), updates)
		setLocation(`/`)
	}

	if (game && game.status === 'playing') return <QuestionPage gameId={gameId} playerId={playerId} profiles={profiles} />
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

const CountDown = ({ gameId }) => {
	const [snapshot, loading, error] = useObject(ref(db, `games/${gameId}/countDown`))
	if (loading) return <div></div>
	const count = snapshot.val()
	if (count == 0) return <div></div>
	return (
		<div>
			<p>Next question in {count} seconds...</p>
		</div>
	)
}

const QuestionPage = ({ gameId, playerId, profiles }) => {
	const [snapshot, loading, error] = useObject(ref(db, `games/${gameId}`))
	const scoringFlag = !!JSON.parse(localStorage.getItem('improvedScoring'))
	const profile = localStorage.getItem('profile')
	let showQuestion, answerQuestion
	if (loading) return <div className="fw6 fs5">Loading...</div>
	const game = snapshot.val()

	const youKey = `player${playerId}`
	const opponentKey = `player${parseInt(playerId) === 1 ? 2 : 1}`

	const question = game.questions[`${game.currentQuestion}`]
	showQuestion = performance.now()

	const countDown = async () => {
		const updates2 = {}
		updates2[`/games/${gameId}/countDown`] = 3
		await update(ref(db), updates2)
		for (let i = 3; i >= 0; i--) {
			updates2[`/games/${gameId}/countDown`] = i
			await update(ref(db), updates2)
			await utils.sleep(1000)
		}
	}

	if (!question) return 'Loading...'

	const answer = async (countryCode) => {
		if (question.fastest) return
		answerQuestion = performance.now()
		const answeringTime = ((answerQuestion - showQuestion) / 1000).toFixed(2)

		countDown()

		if (profiles[profile].grid) {
			gtag('event', 'answer-time-grid', { time: `${answeringTime} seconds` })
		} else {
			gtag('event', 'answer-time-stacked', { time: `${answeringTime} seconds` })
		}

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

		if (game.currentQuestion < Object.values(game.questions).length - 1) {
			await utils.sleep(3000)
			const updates2 = {}
			updates2[`/games/${gameId}/currentQuestion`] = parseInt(game.currentQuestion) + 1
			await update(ref(db), updates2)
		}
		else {
			await utils.sleep(3000)
			const updates2 = {}
			updates2[`/games/${gameId}/status`] = 'finished'

			updates2[`/games/${gameId}/finishedTime`] = Date.now()

			await update(ref(db), updates2)
		}
	}

	return (
		<div className="page">
			<div className="f32"><div className={`flag ${question.correct}`}></div></div>
			<div className={profiles[profile].grid ? "alternatives-grid" : "alternatives"}>
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
						<div className={`${profiles[profile].grid ? 'alt-grid' : 'alt'} button ${correct && 'alt-green'} ${correct === false && 'alt-red'}`}
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


			{profiles[profile].countdown && <CountDown gameId={gameId} />}

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
	const tieFlag = !!JSON.parse(localStorage.getItem("tie"))

	if (loading) return <div className="fw6 fs5">Loading...</div>
	const game = snapshot.val()

	const youKey = `player${playerId}`
	const opponentKey = `player${parseInt(playerId) === 1 ? 2 : 1}`


	const youWon = (game.score[youKey] > game.score[opponentKey])
	const youLost = (game.score[youKey] < game.score[opponentKey])
	const youTie = (game.score[youKey] == game.score[opponentKey])


	return (
		<div className="page">
			{youTie && tieFlag && <Tie you={game.score[youKey]} opponent={game.score[opponentKey]} />}
			{(youWon || youTie && !tieFlag) && <Won you={game.score[youKey]} opponent={game.score[opponentKey]} />}
			{youLost && !youTie && <Lost you={game.score[youKey]} opponent={game.score[opponentKey]} />}
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

const Tie = ({ you, opponent }) => {
	return (
		<div className="results">
			<img src={tie} style={{ width: '60%' }} />
			<div className="re-text">It's a TIE...</div>
			<QuickResults you={you} opponent={opponent} />
		</div>
	)
}


export default App







