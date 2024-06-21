import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TransactionStatistics.css";

const TransactionsStatistics = ({ month }) => {
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });

  useEffect(() => {
    fetchStatistics();
  }, [month]);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/statistics`, {
        params: { month },
      });
      setStatistics(response.data);
    } catch (error) {
      console.logr("Error fetching statistics:", error);
    }
  };

  return (
    <div className="statistics-container">
      <h2>Transactions Statistics</h2>
      <div>
        Total Sale Amount: <span>{statistics.totalSaleAmount}</span>
      </div>
      <div>
        Total Sold Items: <span>{statistics.totalSoldItems}</span>
      </div>
      <div>
        Total Not Sold Items: <span>{statistics.totalNotSoldItems}</span>
      </div>
    </div>
  );
};

export default TransactionsStatistics;
