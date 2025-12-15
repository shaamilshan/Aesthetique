import React, { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { URL } from "@common/api";
import { config } from "@common/configurations";

const MostSoldChart = ({ numberOfDates }) => {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const { data } = await axios.get(
        `${URL}/admin/most-sold-product${
          numberOfDates ? `?numberOfDates=${numberOfDates}` : ``
        }`,
        config
      );

      if (data) {
        const arr = data.mostSoldProducts.map((item) => item.totalQuantitySold);
        const labelArray = data.mostSoldProducts.map((item) => item.name);
        setData(arr);
        setLabels(labelArray);
      }
    };
    loadData();
  }, [numberOfDates]);

  return (
    <div className="h-60">
      <Bar
        data={{
          labels: labels,
          datasets: [
            {
              label: "Most Sold Items",
              data: data,
              // Different color per bar: map a palette to the labels length
              backgroundColor: labels.map((_, i) => {
                const palette = ["#000000", "#111827", "#374151", "#4B5563", "#6B7280", "#9CA3AF"];
                return palette[i % palette.length];
              }),
              borderColor: labels.map((_, i) => {
                const borderPalette = ["#374151", "#1F2937", "#4B5563", "#6B7280", "#9CA3AF", "#D1D5DB"];
                return borderPalette[i % borderPalette.length];
              }),
              borderWidth: 1,
              borderRadius: 10,
              barThickness: 15,
            },
          ],
        }}
        options={{
          indexAxis: "y",
          maintainAspectRatio: false,
          plugins: {
            legend: false,
          },

          scales: {
            x: {
              display: false,
            },
            y: {
              grid: {
                display: false,
              },
              ticks: {
                beginAtZero: true,
                maxRotation: 0, // Disable rotation for horizontal bar charts
                callback: function (value, index, values) {
                  const maxLength = 15;
                  const label = labels[index];
                  if (label.length > maxLength) {
                    return label.substring(0, maxLength - 3) + "...";
                  } else {
                    return label;
                  }
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default MostSoldChart;
