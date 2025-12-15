import React, { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { lineChartNoGridNoLegend } from "@common/configurations";
import axios from "axios";
import { URL } from "@common/api";
import { config } from "@common/configurations";

const RevenueChart = ({ numberOfDates }) => {
  const [totalSales, setTotalSales] = useState("");
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [profits, setProfits] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const { data } = await axios.get(
        `${URL}/admin/revenue-report${
          numberOfDates ? `?numberOfDates=${numberOfDates}` : ``
        }`,
        config
      );

      if (data) {
        setTotalSales(data.salesSum.totalSales);
        const arr = data.eachDayData.map((item) => item.totalSum);
        const labelArray = data.eachDayData.map((item) => item._id);
        const profitsArray = data.eachDayData.map((item) => item.totalMarkup);
        setData(arr);
        setLabels(labelArray);
        setProfits(profitsArray);
      }
    };
    loadData();
  }, [numberOfDates]);

  // Merge a light theme over the base chart options (suitable for white background)
  const options = {
    ...lineChartNoGridNoLegend,
    plugins: {
      ...(lineChartNoGridNoLegend.plugins || {}),
      legend: { display: false },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#111827",
        bodyColor: "#111827",
        borderColor: "rgba(0,0,0,0.08)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ...(lineChartNoGridNoLegend.scales?.x || {}),
        ticks: { color: "#374151" },
        grid: { color: "rgba(0,0,0,0.04)" },
      },
      y: {
        ...(lineChartNoGridNoLegend.scales?.y || {}),
        ticks: { color: "#374151" },
        grid: { color: "rgba(0,0,0,0.04)" },
      },
    },
  };

  return (
    <div className="bg-white px-5 pt-5 pb-20 rounded-md w-full lg:w-2/3 h-80 text-gray-900">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Total Revenue</h1>
        <p className="mb-2 text-right text-xl font-semibold">₹{totalSales || 0}</p>
      </div>
      <Bar
        data={{
          labels: labels,
          datasets: [
            {
              label: "Revenue",
              data: data,
              backgroundColor: "#000000",
              borderColor: "#000000",
              borderWidth: 1,
              borderRadius: 3,
            },
            {
              label: "Profit",
              data: profits,
              backgroundColor: "#374151",
              borderColor: "#374151",
              borderWidth: 1,
              borderRadius: 3,
            },
          ],
        }}
        options={options}
      />
    </div>
  );
};

export default RevenueChart;
