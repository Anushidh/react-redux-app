import './GlobalFilter.css'

export const GlobalFilter = ({ filter, setFilter }) => {
  return (
    <span>
      Search:{" "}
      <input value={filter || ""} onChange={(e) => setFilter(e.target.value)} className="search-input"
        placeholder="Search users..." />
    </span>
  );
};
