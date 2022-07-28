const DeskActions = ({actions, onButtonClick}) => {

	return <div className={'desk-actions'}>
		{actions && actions.map(({value, key}) => <button className={'desk-button'} key={key}
														  onClick={onButtonClick}
														  value={value.toLowerCase()}>{value}</button>)}
	</div>
}
export default DeskActions;
