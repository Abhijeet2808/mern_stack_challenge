const axios = require("axios");
require("dotenv").config;
const Transaction = require("../Models/transactionModel");

const initializeDatabase = async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const transactions = response.data;
    console.log(transactions);

    await Transaction.deleteMany({});
    await Transaction.insertMany(transactions);

    res.status(200).send({ message: "Database initialized successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error initializing database", error });
  }
};

const listTransactions = async (req, res) => {
  const { month, search, page = 1, perPage = 10 } = req.query;
  const filter = {
    dateOfSale: {
      $gte: new Date(2021, month - 1, 1),
      $lt: new Date(2021, month, 1),
    },
  };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { price: { $regex: search, $options: "i" } },
    ];
  }

  try {
    const transactions = await Transaction.find(filter)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));
    res.status(200).send(transactions);
  } catch (error) {
    res.status(500).send({ message: "Error fetching transactions", error });
  }
};

const getStatistics = async (req, res) => {
  const { month } = req.query;
  const filter = {
    dateOfSale: {
      $gte: new Date(2021, month - 1, 1),
      $lt: new Date(2021, month, 1),
    },
  };

  try {
    const totalSales = await Transaction.aggregate([
      { $match: filter },
      { $group: { _id: null, totalAmount: { $sum: "$price" } } },
    ]);

    const soldItems = await Transaction.countDocuments({
      ...filter,
      sold: true,
    });
    const notSoldItems = await Transaction.countDocuments({
      ...filter,
      sold: false,
    });

    res.status(200).send({
      totalSaleAmount: totalSales[0]?.totalAmount || 0,
      totalSoldItems: soldItems,
      totalNotSoldItems: notSoldItems,
    });
  } catch (error) {
    res.status(500).send({ message: "Error fetching statistics", error });
  }
};

const getBarChartData = async (req, res) => {
  const { month } = req.query;
  const filter = {
    dateOfSale: {
      $gte: new Date(2021, month - 1, 1),
      $lt: new Date(2021, month, 1),
    },
  };

  const priceRanges = [
    { range: "0-100", min: 0, max: 100 },
    { range: "101-200", min: 101, max: 200 },
    { range: "201-300", min: 201, max: 300 },
    { range: "301-400", min: 301, max: 400 },
    { range: "401-500", min: 401, max: 500 },
    { range: "501-600", min: 501, max: 600 },
    { range: "601-700", min: 601, max: 700 },
    { range: "701-800", min: 701, max: 800 },
    { range: "801-900", min: 801, max: 900 },
    { range: "901-above", min: 901, max: Infinity },
  ];

  try {
    const barChartData = await Promise.all(
      priceRanges.map(async ({ range, min, max }) => {
        const count = await Transaction.countDocuments({
          ...filter,
          price: { $gte: min, $lt: max },
        });
        return { range, count };
      })
    );

    res.status(200).send(barChartData);
  } catch (error) {
    res.status(500).send({ message: "Error fetching bar chart data", error });
  }
};

const getPieChartData = async (req, res) => {
  const { month } = req.query;
  const filter = {
    dateOfSale: {
      $gte: new Date(2021, month - 1, 1),
      $lt: new Date(2021, month, 1),
    },
  };

  try {
    const pieChartData = await Transaction.aggregate([
      { $match: filter },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.status(200).send(pieChartData);
  } catch (error) {
    res.status(500).send({ message: "Error fetching pie chart data", error });
  }
};

const getCombinedData = async (req, res) => {
  const { month } = req.query;

  try {
    const [statistics, barChartData, pieChartData] = await Promise.all([
      getStatistics({ query: { month } }),
      getBarChartData({ query: { month } }),
      getPieChartData({ query: { month } }),
    ]);

    res.status(200).send({
      statistics: statistics.data,
      barChartData: barChartData.data,
      pieChartData: pieChartData.data,
    });
  } catch (error) {
    res.status(500).send({ message: "Error fetching combined data", error });
  }
};

module.exports = {
  initializeDatabase,
  listTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData,
  getCombinedData,
};
