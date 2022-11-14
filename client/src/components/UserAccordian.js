import AccordianComponent from './AccordianComponent';
import { useState } from 'react';
const UserAccordian = ({
  user,
  batsmen,
  wicketKeepers,
  allRounders,
  bowlers,
  unknown,
}) => {
  const [show, setShow] = useState(false);
  let totRating = 0;
  batsmen.map((bat) => {
    totRating += bat.stats.batting[bat.stats.batting.length - 2].value;
  });
  wicketKeepers.map((wi) => {
    if (wi.stats.batting)
      totRating += wi.stats.batting[wi.stats.batting.length - 2].value;
    else totRating += wi.stats.bowling[wi.stats.bowling.length - 2].value;
  });
  allRounders.map((all) => {
    if (all.stats.batting)
      totRating += all.stats.batting[all.stats.batting.length - 2].value;
    else totRating += all.stats.bowling[all.stats.bowling.length - 2].value;
  });
  bowlers.map((bowl) => {
    totRating += bowl.stats.bowling[bowl.stats.bowling.length - 2].value;
  });
  return (
    <div
      className={`user-accordian ${show ? 'user-accordian-increase-2' : ''}`}
    >
      <div className='user-accordian-name'>
        {user} / Total: <span style={{ color: 'red' }}>{totRating}</span>
        <img
          src='/Images/arrow.svg'
          alt='an-arrow'
          className={`arrow ${show ? 'rotate' : ''}`}
          onClick={() => setShow((prev) => !prev)}
        ></img>
      </div>
      <div
        className={`user-accordian-players ${
          show ? 'user-accordian-increase' : ''
        }`}
      >
        {batsmen.length > 0 ? (
          <AccordianComponent title='Batsmen' players={batsmen} />
        ) : (
          ''
        )}
        {wicketKeepers.length > 0 ? (
          <AccordianComponent title='Wicket Keepers' players={wicketKeepers} />
        ) : (
          ''
        )}
        {allRounders.length > 0 ? (
          <AccordianComponent title='All Rounders' players={allRounders} />
        ) : (
          ''
        )}
        {bowlers.length > 0 ? (
          <AccordianComponent title='Bowlers' players={bowlers} />
        ) : (
          ''
        )}
        {unknown.length > 0 ? (
          <AccordianComponent title='Unknown' players={unknown} />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default UserAccordian;
