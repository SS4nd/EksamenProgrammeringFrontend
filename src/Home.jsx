import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxios from "axios-hooks";
import { API_URL } from "./settings";
import SortButtons from "./components/SortButtons";
import DeltagerTable from "./components/DeltagerTable";

const Home = () => {
  const { id } = useParams();
  const [{ data, loading, error }, execute] = useAxios({
    url: `${API_URL}/api/deltager`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const [sortedData, setSortedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    execute();
  }, [execute]);

  useEffect(() => {
    if (data) {
      setSortedData(data);
    }
  }, [data]);

  const handleSort = (key) => {
    const sorted = [...sortedData].sort((a, b) => {
      const sortKey = key.startsWith("-") ? key.substring(1) : key;
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return key.startsWith("-") ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
      } else {
        return key.startsWith("-") ? bValue - aValue : aValue - bValue;
      }
    });
    setSortedData(sorted);
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  };

  let filteredData = sortedData;
  if (searchQuery.trim() !== "") {
    filteredData = sortedData.filter((item) => {
      const name = item.navn ? item.navn.toLowerCase() : ""; // Corrected to 'navn'
      return name.includes(searchQuery);
    });
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Search by name"
        value={searchQuery}
        onChange={handleSearch}
      />
      <SortButtons onSort={handleSort} />
      <DeltagerTable data={filteredData} />
    </div>
  );
};

export default Home;
