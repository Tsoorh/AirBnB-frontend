import { StayPreview } from "./StayPreview";
import PropTypes from "prop-types";

export function StayList({ stays, maxStays, inSearchPage = false }) {
  // Limit the number of stays displayed if maxStays is provided
  const displayStays = maxStays ? stays.slice(0, maxStays) : stays;

  return (
    <div className="stays-horizontal-scroll">
      {displayStays.map((stay) => (
        <div key={stay._id} className="stay-card">
          <StayPreview stay={stay} inSearchPage={inSearchPage} />
        </div>
      ))}
    </div>
  );
}

StayList.propTypes = {
  stays: PropTypes.arrayOf(PropTypes.object).isRequired,
  maxStays: PropTypes.number,
  inSearchPage: PropTypes.bool,
};
