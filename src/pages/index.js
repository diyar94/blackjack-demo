import DeskStats from "../components/DeskStats";
import GameDesk from "../components/GameDesk";
import {useRequest} from "ahooks";
import PlaceBet from "../components/PlaceBet";
import {useEffect, useState} from "react";
import {apiPost, endpoints} from "../../api";
import DeskActions from "../components/DeskActions";
import WelcomeBoard from "../components/WelcomeBoard";
import {availableBetOptions} from "../utils";

const page = () => {
	const [betValue, setBetValue] = useState(0);
	const [dealerCardsState, setDealerCardsState] = useState(null);
	const [playerCardsState, setPlayerCardsState] = useState(null);
	const [betPlaced, setBetPlaced] = useState(false);
	const [currentBalance, setCurrentBalance] = useState(localStorage.getItem('balance') || null);
	const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId') || null);
	const [availableOptions, setAvailableOptions] = useState(availableBetOptions || null);
	const [winAmount, setWinAmount] = useState(0);
	const [roundsPlayed, setRoundsPlayed] = useState(0);
	const [roundState, setRoundState] = useState(false);
	const [nextRound, setNextRound] = useState(false);
	const [actionType, setActionType] = useState('');
	const [totalyWinAmount, setTotalWinAmount] = useState(0);
	const [gameOver, setGameOver] = useState(false);

	useEffect(() => {
		const totalWinSum = totalyWinAmount + winAmount;
		console.log('totalWinSum', totalWinSum);
		setTotalWinAmount(totalWinSum)
	}, [winAmount])


	// this is the first tome when we sit on desk
	const {
		data: dealData, loading, error, run: runDeal
	} = useRequest((payload) => apiPost(endpoints.deal, {data: payload}), {manual: true});

	// we run this request when user clicks the hit or double buttons
	const {
		data: turnData,
		loading: turnLoading,
		run: runTurn
	} = useRequest((payload) => apiPost(endpoints.turn, {data: payload}), {manual: true})

	const {
		data: standData, loading: standLoading, run: runStand
	} = useRequest((payload) => apiPost(endpoints.stand, {data: payload}), {manual: true})


	// checking Response from request
	useEffect(() => {
		if (dealData && !loading) {
			console.log('response from dealer:', dealData);
			const {dealerCards, playerCards, roundEnded, winAmount, currentBalance} = dealData;
			setPlayerCardsState(playerCards);
			setDealerCardsState(dealerCards);
			setRoundState(roundEnded);
			setWinAmount(winAmount);
			setCurrentBalance(currentBalance);
			localStorage.setItem('balance', currentBalance);
		}
	}, [dealData]);

	useEffect(() => {
		if (turnData) {
			console.log('response from turn', turnData);
			const {currentBalance, roundEnded, winAmount, playerCard, dealerCards} = turnData;
			setRoundState(roundEnded);
			setWinAmount(winAmount);
			setCurrentBalance(currentBalance);
			setBetValue(0);
			if (actionType === 'stay') {
				localStorage.setItem('balance', currentBalance);
				setDealerCardsState(dealerCards);
				setNextRound(true)
			}
			if (actionType === 'hit') {
				setPlayerCardsState([...playerCardsState, playerCard]);
				setNextRound(true);
				if (roundEnded && currentBalance === 0) {
					alert('roundended on hit');
					setGameOver(true);

				}
			}
		}
	}, [turnData]);

	useEffect(() => {
		if (currentBalance <= 0) {
			setNextRound(false);
			localStorage.clear();
		}
	}, [currentBalance]);

	const onPlaceBetClick = async () => {
		if (Number(betValue) > Number(currentBalance)) {

		} else {
			setBetPlaced(true);
			const dealRequestBody = {
				bet: Number(betValue),
				sessionId
			}
			await runDeal(dealRequestBody)
		}
	}


	// selecting Bet values
	const onSelectChange = e => {
		const betVal = e.target.value;
		setBetValue(betVal);

	}

	//hit button click handler
	const onActionClick = async (e) => {
		// after getting value from clicked button run request to BE
		const action = e.target.value;
		setActionType(action);
		const turnRequestBody = {
			action,
			sessionId
		}
		await runTurn(turnRequestBody);
	}

	// side-effects, checking errors returned from BE
	useEffect(() => {
		if (error) {
			const {data} = error;
			location.reload();
			// alert(`${data.error}..... Logging out`);
			localStorage.clear();
		}
	}, [error]);

	// handler for "STAND ACTION"
	const onHandleStand = async () => {
		await runStand({sessionId});
		if (gameOver) {
			setGameOver(false)
		}
	}

	useEffect(() => {
		if (standData && !standLoading) {
			const {roundsPlayed, winAmount} = standData;
			setRoundsPlayed(roundsPlayed);
			setWinAmount(winAmount);
		}
	}, [standData])

	return <div className={'desk'}>
		{(sessionId && !roundsPlayed) ? <>
			<DeskStats balance={betValue ? currentBalance - betValue : currentBalance} sessionId={sessionId}/>

			<span className={'card-title'}>Dealer cards</span>
			<GameDesk cards={dealerCardsState ? dealerCardsState : [
				{
					"rank": 'rank',
					"suite": "Diamonds"
				}
			]} open={!!dealerCardsState}/>

			<span className={'card-title'}>Your cards</span>
			<GameDesk cards={playerCardsState ? playerCardsState : [
				{
					"rank": "rank",
					"suite": "Hearts"
				}
			]} open={!!playerCardsState}/>

			{roundState && <>
				<div>Win Amount: {winAmount}</div>
				<div>Current balance: {currentBalance}</div>
			</>}

			{!betPlaced && <div className={'desk-actions'}>
				<PlaceBet betAvailableOptions={availableOptions} onPlaceBetClick={onPlaceBetClick}
						  onSelectChange={onSelectChange}/>
			</div>
			}

			{(nextRound && roundState) && <div className={'desk-actions'}>
				<button className={'desk-button'} onClick={() => {
					setNextRound(false);
					setBetPlaced(false);
					setRoundState(!roundState)
				}}>Continue
				</button>
				<button onClick={onHandleStand} className={'desk-button'}>
					Stand
				</button>
			</div>}

			{betPlaced && !roundState && <DeskActions onButtonClick={onActionClick} loading={turnLoading}
													  actions={[{
														  key: 'hit', value: 'hit', roundEnded: false
													  }, {
														  key: 'stay', value: 'stay', roundEnded: false
													  }]}/>}
		</> : (!roundsPlayed ? <WelcomeBoard sessionId={sessionId} setSessionId={(e) => setSessionId(e)}
											 setBalance={e => setCurrentBalance(e)}
											 setAvailableOptions={(e) => setAvailableOptions(e)}/> :
			<div className={'desk-stats desk-action'}>
				Yoy left the game:
				<div>Rounds played: {roundsPlayed}</div>
				<div>Win amount: {totalyWinAmount}</div>
				<div>Total Balance: {currentBalance}</div>
				<button className={'desk-actions desk-button'} onClick={() => {
					localStorage.clear();
					location.reload();

				}}>New game
				</button>
			</div>)}
		{gameOver && <div>You are broke !!! Enter new balance and start new game <button onClick={onHandleStand}
																						 className={'desk-button'}>
			Stand
		</button></div>}
	</div>
}
export default page;
