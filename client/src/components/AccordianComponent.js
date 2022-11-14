const AccordianComponent = ({ title, players }) => {
  return (
    <div className='accordian-helper'>
      <div className='accordian-helper-title'>{title}:</div>
      <div className='accordian-helper-players'>
        {players.map((player) => {
          return (
            <div className='accordian-helper-player'>
              {player.name}{' '}
              <span style={{ color: 'red' }}>
                {player.stats.batting
                  ? player.stats.batting[player.stats.batting.length - 2].value
                  : player.stats.bowling[player.stats.bowling.length - 2].value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccordianComponent;
