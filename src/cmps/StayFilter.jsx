import { useState, useEffect } from "react";
import { DynamicModalCmp } from "./FilterCmps/DynamicModalCmp";
import SearchIcon from "@mui/icons-material/Search";
import { useWindowSize } from "../customHooks/useWindowSize";
import { getDefaultFilter } from "../services/stay";
import { useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { SearchDestination } from "./FilterCmps/SearchDestination";
// import { ChooseDates } from "./FilterCmps/ChooseDates";
import { MobileDates } from "./FilterCmps/MobileDates";
import { GuestsPicker } from "./FilterCmps/GuestsPicker";
import { useNavigate } from "react-router";

export function StayFilter({ isOnViewPort, isStayDetails }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileFilterSelection, setMobileFilterSelection] = useState({
    destination: true,
    checkIn: false,
    guest: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModalContent, SetCurrentModalContent] = useState(null);
  const [filter, setFilter] = useState(getDefaultFilter);
  const [searchParams, setSearchParams] = useSearchParams({ ...filter });
  const location = useLocation();
  const { width } = useWindowSize();
  const navigate = useNavigate();

  const filterConfigs = [
    {
      name: "destination",
      Label: "Where",
      Placeholder: filter.city || "I'm flexible",
      Component: SearchDestination,
      propHandler: handleCityChange,
      selectionState: mobileFilterSelection.destination,
    },
    {
      name: "checkIn",
      Label: "When",
      Placeholder:
        (filter.dates.checkIn && filter.dates.checkIn + " - " + filter.dates.checkOut) ||
        "Add dates",
      Component: MobileDates,
      propHandler: handleDateChange,
      selectionState: mobileFilterSelection.checkIn,
    },
    {
      name: "guest",
      Label: "Who",
      Placeholder: handleGuests(),
      Component: GuestsPicker,
      propHandler: handleGuestsChange,
      selectionState: mobileFilterSelection.guest,
    },
  ];

  useEffect(() => {
    setIsFilterOpen(false);
    setIsModalOpen(false);
    SetCurrentModalContent(null);
  }, [location.pathname]);

  useEffect(() => {
    setSearchParams({ ...refactorFilter(filter) });
  }, [filter]);

  useEffect(() => {
    if (width > 745) {
      if (isStayDetails) {
        setIsFilterOpen(false)
      } else if (isOnViewPort) {
        setIsFilterOpen(false)
      } else {
        setIsFilterOpen(true)
      }
    } else {
      setIsFilterOpen(false);
    }
  }, [isOnViewPort, width, isStayDetails]);

  useEffect(() => {
    if (width > 745) {
      setMobileFilterOpen(false);
    } else {
      setIsFilterOpen(false);
      setMobileFilterOpen(true);
    }
  }, [width]);

  function refactorFilter(filterObj) {
    let flatObj = {};
    for (const key in filterObj) {
      if (typeof filterObj[key] === "object" && filterObj[key] !== null) {
        for (const nestedKey in filterObj[key]) {
          flatObj = { ...flatObj, [nestedKey]: filterObj[key][nestedKey] };
        }
      } else {
        flatObj = { ...flatObj, [key]: filterObj[key] };
      }
    }
    return flatObj;
  }

  const buttonDetails = [
    {
      name: "checkIn",
      span: "Check in",
      placeholder: filter.dates.checkIn || "Add dates",
    },
    {
      name: "checkOut",
      span: "Check out",
      placeholder: filter.dates.checkOut || "Add dates",
    },
  ];

  function onHandleOpenFilter(ev) {
    setIsFilterOpen(true);
    onHandleClick(ev);
  }

  function onHandleClick({ currentTarget }) {
    const filterContainer = document.querySelector(".stay-filter");
    filterContainer.classList.add("active");
    const allButtons = document.querySelectorAll(".filter-btn");
    allButtons.forEach((btn) => {
      btn.classList.remove("active");
    });
    currentTarget.classList.add("active");

    const { name } = currentTarget;
    SetCurrentModalContent(name);
    setIsModalOpen(true);
  }

  function onCloseModal() {
    SetCurrentModalContent(null);
    setIsModalOpen(false);
  }

  function onSearchClick(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    SetCurrentModalContent(null);
    setIsModalOpen(false);
    setMobileFilterOpen(false);

    // Apply the filter (if setFilterBy is provided as prop)
    if (setFilter) {
      setFilter(filter);
    }

    // Refactor filter to flat object
    const refactoredFilter = refactorFilter(filter);

    // Update URL search params (this will trigger filtering in parent component)
    setSearchParams({ ...refactoredFilter });

    // Remove active class from filter container
    const filterContainer = document.querySelector(".stay-filter");
    if (filterContainer) {
      filterContainer.classList.remove("active");
    }

    // Create query string from refactored filter
    const queryString = new URLSearchParams(refactoredFilter).toString();
    navigate(`/search?${queryString}`);
  }

  function classModalOpen() {
    if (isModalOpen) return "open";
    else return "";
  }

  function handleCityChange(city) {
    if (width < 745) setMobileFilterSelection(prev => ({ ...prev, destination: false }));
    setFilter((prev) => ({ ...prev, city }));
  }

  function handleGuestsChange(guests) {
    setFilter((prev) => ({ ...prev, guests }));
  }

  function handleDateChange(field, date) {
    setFilter((prev) => ({
      ...prev,
      dates: { ...prev.dates, [field]: date },
    }));
  }

  function handleGuests() {
    if (!filter.guests) return "Add guests";

    const guestsEntries = Object.entries(filter.guests)
      .filter(([_, value]) => value > 0)
      .map(([key, value]) => `${key}: ${value}`);

    return guestsEntries.length > 0 ? guestsEntries.join(", ") : "Add guests";
  }

  function onResetFilter() {
    setFilter(getDefaultFilter());
  }

  function handleMobileFilterClick({ target }) {
    const { name } = target;
    setMobileFilterSelection({
      destination: false,
      checkIn: false,
      guests: false,
      [name]: true
    });
  }

  if (mobileFilterOpen) {
    return (
      <ul className="mobile-filter">
        <button
          className="x-btn shadow"
          onClick={() => setMobileFilterOpen(false)}
        >
          x
        </button>
        {filterConfigs.map((config) => (
          <li key={config.name}>
            {config.selectionState ? (
              <div className="shadow mobile-modal">
                <span>{config.Label}?</span>
                <config.Component
                  handleChange={config.propHandler}
                  isOpen={currentModalContent === config.name}
                  onCloseModal={onCloseModal}
                />
              </div>
            ) : (
              <button
                className="filter-btn flex shadow"
                name={config.name}
                onClick={handleMobileFilterClick}
              >
                <span>{config.Label}</span>
                <span>{config.Placeholder}</span>
              </button>
            )}
          </li>
        ))}
        <li>
          <a onClick={onResetFilter}>Clear all</a>
          <button onClick={onSearchClick}>Search</button>
        </li>
      </ul>
    );
  } else if (isFilterOpen) {
    return (
      <div className="open-filter-div">
        <section className="stay-filter shadow open">
          <button
            className="filter-btn open flex column"
            name="destination"
            onClick={onHandleClick}
          >
            <span className="btn-header">Where</span>
            <input
              type="text"
              placeholder="Search destinations"
              value={filter.city}
              onChange={handleCityChange}
            />
          </button>
          {buttonDetails.map((btn) => {
            return (
              <button
                key={btn.name}
                className="filter-btn open flex column"
                name={btn.name}
                onClick={onHandleClick}
              >
                <span className="btn-header">{btn.span}</span>
                <span className="light-color">{btn.placeholder}</span>
              </button>
            );
          })}
          <button
            className="filter-btn open flex row"
            name="guest"
            onClick={onHandleClick}
          >
            <div className="flex column">
              <span className="btn-header">Who</span>
              <span className="light-color">{handleGuests()}</span>
            </div>
            <div
              className={`search-btn search-sml ${classModalOpen()}`}
              onClick={(e) => {
                e.stopPropagation();
                onSearchClick(e);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
            >
              <SearchIcon sx={{ fontSize: "1.7rem" }} />
              <span className="search-text" style={{ pointerEvents: "none" }}>Search</span>
            </div>
          </button>


          {isModalOpen && (
            <DynamicModalCmp
              currentModalContent={currentModalContent}
              handleCityChange={handleCityChange}
              handleGuestsChange={handleGuestsChange}
              handleDateChange={handleDateChange}
              onCloseModal={onCloseModal}
            />
          )}
        </section>
      </div>
    );
  } else {
    return (
      <section className="stay-filter close shadow wide">
        <input
          type="text"
          className="mobile-only-item search-mobile"
          placeholder="Start your search"
          onClick={() => {
            setMobileFilterOpen(true);
          }}
        />
        <div className="not-mobile-item">
          <button
            className="filter-btn close flex column des"
            onClick={onHandleOpenFilter}
            name="destination"
            id="destination"
          >
            <img src="/img/house.png" alt="house" className="house-icon" />
            Anywhere
          </button>
          <button
            className="filter-btn close flex column border-right"
            onClick={onHandleOpenFilter}
            name="time"
            id="time"
          >
            Anytime
          </button>
          <button
            className="filter-btn close flex column"
            onClick={onHandleOpenFilter}
            name="guest"
            id="guest"
          >
            Add guests
          </button>
          <button
            className="search-btn small-search"
            onClick={() => {
              setIsFilterOpen(true);
            }}
          >
            <SearchIcon />
          </button>
        </div>
      </section>
    );
  }
}
