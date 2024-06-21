import "./App.css";
import React, { useState } from "react";
import TransactionsTable from "./Components/TransactionsTable";
import TransactionsStatistics from "./Components/TransactionsStatistics";
import TransactionsBarChart from "./Components/TransactionsBarChart";

const App = () => {
  const [month, setMonth] = useState(3); // Default to March
  const [searchQuery, setSearchQuery] = useState("");

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  return (
    <div>
      <h1>Transactions Dashboard</h1>
      <select value={month} onChange={handleMonthChange}>
        <option value={1}>January</option>
        <option value={2}>February</option>
        <option value={3}>March</option>
        <option value={4}>April</option>
        <option value={5}>May</option>
        <option value={6}>June</option>
        <option value={7}>July</option>
        <option value={8}>August</option>
        <option value={9}>September</option>
        <option value={10}>October</option>
        <option value={11}>November</option>
        <option value={12}>December</option>
      </select>
      <TransactionsStatistics month={month} />
      <TransactionsBarChart month={month} />
      <TransactionsTable
        month={month}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
};

export default App;
