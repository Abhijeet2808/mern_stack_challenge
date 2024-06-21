import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TransactionTable.css";

const TransactionsTable = ({ month, searchQuery, setSearchQuery }) => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, [month, searchQuery, page]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/transactions`,
        {
          params: { month, search: searchQuery, page, perPage: 10 },
        }
      );
      setTransactions(response.data);
      setTotalPages(Math.ceil(response.data.length / 10)); // Update based on your API's response structure
    } catch (error) {
      console.log("Error fetching transactions:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="transactions-container">
      <h2>Transactions Table</h2>
      <input
        type="text"
        placeholder="Search transactions..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
            <th>Category</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              <td>{transaction.category}</td>
              <td>{transaction.sold ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-controls">
        <button onClick={handlePrevious} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={handleNext} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionsTable;
