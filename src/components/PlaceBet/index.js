const PlaceBet = ({betAvailableOptions, onPlaceBetClick, onSelectChange}) => {

	return <div className={' desk-actions'}>
		<select onChange={onSelectChange} key={'option-select'} defaultValue={1}>
			{betAvailableOptions.map((betAvailableOption, key) => <option key={key}
																		  value={betAvailableOption}>{betAvailableOption}</option>)}
		</select>
		<button className={'desk-button'} onClick={onPlaceBetClick}>Place bet</button>
	</div>
}
export default PlaceBet;
