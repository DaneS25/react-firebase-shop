import React from 'react';

const FilterMenu = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === 'checkbox' ? checked : value, // For checkboxes, use checked; otherwise, use value
    }));
  };

  return (
    <div className="filter-menu">
      <h2>Filters</h2>
      <h3>Price</h3>
      <select name="price" onChange={handleChange} value={filters.price}>
        <option value="">Select</option>
        <option value="lowToHigh">Lowest to Highest</option>
        <option value="highToLow">Highest to Lowest</option>
      </select>

      <h3>Gender</h3>
      <label>
        <input
          type="checkbox"
          name="mens"
          checked={filters.mens}
          onChange={handleChange}
        />
        Men
      </label>
      <label>
        <input
          type="checkbox"
          name="womens"
          checked={filters.womens}
          onChange={handleChange}
        />
        Women
      </label>

      <h3>Type</h3>
      <label>
        <input
          type="checkbox"
          name="roadRunning"
          checked={filters.roadRunning}
          onChange={handleChange}
        />
        Road Running
      </label>
      <label>
        <input
          type="checkbox"
          name="trailRunning"
          checked={filters.trailRunning}
          onChange={handleChange}
        />
        Trail Running
      </label>
      <label>
        <input
          type="checkbox"
          name="waterproof"
          checked={filters.waterproof}
          onChange={handleChange}
        />
        Waterproof
      </label>
    </div>
  );
};

export default FilterMenu;
