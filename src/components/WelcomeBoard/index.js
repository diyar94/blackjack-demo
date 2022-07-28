import {useEffect, useRef} from "react";
import {useRequest} from "ahooks";
import {apiPost, endpoints} from "../../../api";

const WelcomeBoard = ({setSessionId, setAvailableOptions, setBalance}) => {
	const refName = useRef();
	const refBalance = useRef();

	const {data, run: startGame} = useRequest((payload) => apiPost(endpoints.sit, {data: payload}), {manual: true});

	const handleStart = async () => {
		const {value: nameValue} = refName.current;
		const {value: balanceValue} = refBalance.current

		if (balanceValue < 10 || balanceValue > 1000) {
			alert('value must be between 10 and 1000');

		} else {
			let body = {
				"balance": balanceValue
			}
			setBalance(balanceValue);
			await startGame(body);
			localStorage.setItem('balance', balanceValue);
			localStorage.setItem('user', nameValue);
		}
	}


	useEffect(() => {
		if (data) {
			const {availableBetOptions, sessionId} = data;
			localStorage.setItem('sessionId', data.sessionId);
			setSessionId(sessionId);
			setAvailableOptions(availableBetOptions);
		}
	}, [data]);

// @TODO Diyar Osmanov, onKeydown event must be optimised, for now it send 2 API req to BE
	return <div className={'start-game-board'}>
		Name: <input className={'input'} name={'userName'} id={'userName'} ref={refName}/>

		Balance:
		<input className={'input'} type={'number'} name={'userBalance'} ref={refBalance}/>
		<div className={'desk-actions'}>
			<button onClick={handleStart} className={'desk-button'} onKeyDown={(e) => {
				if (e.key === 'Enter') {
					handleStart();
				}
			}}>Start Game
			</button>
		</div>

	</div>
}

export default WelcomeBoard;
