import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { RangeCalendar, Provider, defaultTheme } from "@adobe/react-spectrum";
import { I18nProvider } from "react-aria";
import {getLocalTimeZone, today} from '@internationalized/date';


export function RangeCalendarPicker({ handleChange, onCloseModal }) {
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

  function onChangeDate(ev) {
    const {start,end} = ev;
    const checkIn = start.day+"-"+start.month+"-"+start.year;
    const checkOut = end.day+"-"+end.month+"-"+end.year;
    handleChange("checkIn",checkIn);
    handleChange("checkOut",checkOut);
  }

  const handleClearDates = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("checkIn");
    newParams.delete("checkOut");
    setSearchParams(newParams);
  };


  return (
    <Provider theme={defaultTheme} colorScheme="light" className="black-range-calendar-theme">
      <div className="modal-calendar-container border-radius" ref={wrapperRef}>
        <div className="flex justify-center border-radius">
          <I18nProvider locale="en-US" dir="rtl" >
            <RangeCalendar
              aria-label="Trip dates"
              visibleMonths={2}
              minValue={today(getLocalTimeZone())}
              onChange={onChangeDate}
            />
          </I18nProvider>
        </div>
        <div className="choose-dates-btns">
          <p onClick={handleClearDates}>Clear dates</p>
          <button onClick={onCloseModal}>Close</button>
        </div>
      </div>
    </Provider>
  );
}

RangeCalendarPicker.propTypes = {
  handleChange: PropTypes.func.isRequired,
};
