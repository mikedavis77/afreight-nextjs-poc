import React, { useState, useEffect } from 'react';
import { useRange } from 'react-instantsearch-hooks';

const PriceRangePicker = ({ attribute, title }) => {
  const rangeProps = useRange({
    attribute: attribute,
  });

  const { range, refine } = rangeProps;
  const [fromPrice, setFromPrice] = useState(range.min);
  const [toPrice, setToPrice] = useState(range.max);

  const handleFromValueChange = (event) => {
    setFromPrice(event.target.value);
  };

  const handleToValueChange = (event) => {
    setToPrice(event.target.value);
  };

  function handleSetButtonPress() {
    refine([fromPrice, toPrice]);
  }

  useEffect(() => {
    setFromPrice(range.min);
    setToPrice(range.max);
  }, [range.min, range.max]);

  return (
    <div className="PriceRangePicker" attribute={attribute}>
      <div className="PriceRangePicker-title">{title}</div>
      <div className="PriceRangePicker-rangeContainer">
        <input
          type="number"
          className="PriceRangePicker-rangeInput"
          placeholder="From"
          value={fromPrice}
          onChange={handleFromValueChange}
        />
        <div className="PriceRangePicker-toInputWrapper">
          <input
            type="number"
            className="PriceRangePicker-rangeInput"
            placeholder="To"
            value={toPrice}
            onChange={handleToValueChange}
          />
          <button
            className="PriceRangePicker-setButton"
            onClick={handleSetButtonPress}
          >
            Set
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceRangePicker;
