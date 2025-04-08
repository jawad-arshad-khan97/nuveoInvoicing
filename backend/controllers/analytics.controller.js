import express from "express";
import Invoice from "../mongodb/models/invoice.js";

const getMonthlyIncomeDetails = async (req, res) => {
  try {
    const invoices = await Invoice.find({}).limit(5); // Debugging: Check stored data

    const incomeData = await Invoice.aggregate([
      {
        $match: {
          invoiceDate: { $exists: true, $ne: null }, // Ensure invoiceDate is valid
        },
      },
      {
        $project: {
          month: { $month: "$invoiceDate" }, // Extract month directly
          total: 1,
        },
      },
      {
        $group: {
          _id: "$month", // Group by month
          totalIncome: { $sum: "$total" }, // Sum total amount
        },
      },
      { $sort: { _id: 1 } }, // Sort by month
    ]);


    // Format data for frontend
    const formattedData = incomeData.map((item) => ({
      month: new Date(2024, item._id - 1, 1).toLocaleString("default", {
        month: "long",
      }),
      income: item.totalIncome,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching income details:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export { getMonthlyIncomeDetails };
