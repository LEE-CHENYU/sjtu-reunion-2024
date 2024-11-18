import { useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { fadeIn, staggerChildren } from "@/lib/animations";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
  },
};

interface SummaryData {
  totalResponses: number;
  averageBudget: number;
  couchSurfingRequests: number;
  popularEventTypes: { type: string; count: number }[];
}

interface ChartData {
  type?: string;
  range?: string;
  count: number;
}

export default function Dashboard() {
  const { data: summaryData, error: summaryError } = useSWR<SummaryData>(
    "/api/analytics/summary"
  );
  const { data: eventTypeData, error: eventTypeError } = useSWR<ChartData[]>(
    "/api/analytics/event-types"
  );
  const { data: currentStatusData, error: currentStatusError } = useSWR<ChartData[]>(
    "/api/analytics/current-status"
  );
  const { data: budgetData, error: budgetError } = useSWR<ChartData[]>(
    "/api/analytics/budget"
  );
  const { data: locationData, error: locationError } = useSWR<ChartData[]>(
    "/api/analytics/location"
  );
  const { data: alcoholData, error: alcoholError } = useSWR<ChartData[]>(
    "/api/analytics/alcohol"
  );

  const isLoading =
    !summaryData && !summaryError ||
    !eventTypeData && !eventTypeError ||
    !currentStatusData && !currentStatusError ||
    !budgetData && !budgetError ||
    !locationData && !locationError ||
    !alcoholData && !alcoholError;

  const hasError = summaryError || eventTypeError || currentStatusError || budgetError || locationError || alcoholError;

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 pt-20 bg-gradient-to-br from-blue-400 to-blue-600">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Loading...</h1>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen p-8 pt-20 bg-gradient-to-br from-blue-400 to-blue-600">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">Error</h1>
          <p className="text-white">Failed to load analytics data.</p>
        </div>
      </div>
    );
  }

  const pieChartData = (data: ChartData[]) => ({
    labels: data.map((item) => item.type),
    datasets: [
      {
        data: data.map((item) => item.count),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(99, 102, 241, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(217, 70, 239, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ],
        borderColor: "rgba(255, 255, 255, 0.8)",
        borderWidth: 1,
      },
    ],
  });

  const barChartData = (data: ChartData[], labelKey: "range") => ({
    labels: data.map((item) => item[labelKey]),
    datasets: [
      {
        label: "Count",
        data: data.map((item) => item.count),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  });

  return (
    <div className="min-h-screen p-8 pt-20 bg-gradient-to-br from-blue-400 to-blue-600">
      <motion.div
        variants={staggerChildren}
        initial="initial"
        animate="animate"
        className="max-w-7xl mx-auto space-y-8"
      >
        <h1 className="text-4xl font-bold text-white mb-8">SJTU Reunion Analytics 📊</h1>

        <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{summaryData?.totalResponses}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Average Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">${summaryData?.averageBudget}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Couch Surfing Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{summaryData?.couchSurfingRequests}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Event Types</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {summaryData?.popularEventTypes.map((type) => (
                  <li key={type.type} className="flex justify-between">
                    <span>{type.type}</span>
                    <span className="font-bold">{type.count}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Location Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <Pie
                data={pieChartData(locationData || [])}
                options={chartOptions}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <Pie
                data={pieChartData(currentStatusData || [])}
                options={chartOptions}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget Distribution ($30-$200)</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar
                data={barChartData(budgetData || [], "range")}
                options={chartOptions}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alcohol Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <Pie
                data={pieChartData(alcoholData || [])}
                options={chartOptions}
              />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
