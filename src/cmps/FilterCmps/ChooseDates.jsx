import PropTypes from "prop-types";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

export function ChooseDates({ handleChange, onCloseModal }) {
  const wrapperRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Close on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) onCloseModal?.();
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [onCloseModal]);

  function onChangeDate(ev, field) {
    const { $D, $M, $y } = ev;

    // Format as YYYY-MM-DD (e.g., "2025-10-22")
    const year = $y;
    const month = String($M + 1).padStart(2, "0"); // $M is 0-indexed
    const day = String($D).padStart(2, "0");

    const pickedDateFormatted = `${year}-${month}-${day}`;
    handleChange(field, pickedDateFormatted);
  }

  const handleClearDates = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("checkIn");
    newParams.delete("checkOut");
    setSearchParams(newParams);
  };

  function getNextMonthAndDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11

    // Calculate next month
    if (month !== 11) {
      // Not December, just add 1 to month
      return `${year}-${String(month + 2).padStart(2, '0')}-01`;
    }
    // December, roll over to next year
    return `${year + 1}-01-01`;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="modal-calendar-container " ref={wrapperRef}>
        <div className="flex justify-center align-center">
          <div className="calendar-container">
            {/* <span>Check in</span> */}
            <DateCalendar onChange={(ev) => onChangeDate(ev, "checkIn")} />
          </div>
          <div className="calendar-container ">
            {/* <span>Check out</span> */}
            <DateCalendar
              defaultValue={dayjs(getNextMonthAndDate())}
              onChange={(ev) => onChangeDate(ev, "checkOut")}
            />
          </div>
        </div>
        <div className="choose-dates-btns">
          <p onClick={handleClearDates}>Clear dates</p>
          <button onClick={onCloseModal}>Close</button>
        </div>
      </div>
    </LocalizationProvider>
  );
}

ChooseDates.propTypes = {
  handleChange: PropTypes.func.isRequired,
};
