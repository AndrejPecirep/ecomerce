import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?query=${search}`);
  };

  return (
    <nav className="nav">
      <h1 className="nav-title" onClick={() => navigate("/")}>MyShop</h1>

      <form className="nav-search" onSubmit={handleSearch}>
        <input
          className="input"
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-search">Search</button>
      </form>
    </nav>
  );
}