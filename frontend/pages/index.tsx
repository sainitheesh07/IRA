"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, AlertCircle, Clock, FileText, Server, Shield } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: "up" | "down";
  trendValue: string;
}

const StatCard = ({ title, value, icon, trend, trendValue }: StatCardProps) => (
  <div className="bg-gray-800 rounded-lg p-4 shadow">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="p-2 rounded-full bg-blue-500 bg-opacity-20 text-blue-400">
          {icon}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
      <div className={`flex items-center text-sm ${trend === "up" ? "text-green-400" : "text-red-400"}`}>
        {trend === "up" ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        )}
        <span className="ml-1">{trendValue}</span>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState([
    { name: "Sep 20", incidents: 12 },
    { name: "Sep 21", incidents: 8 },
    { name: "Sep 22", incidents: 15 },
    { name: "Sep 23", incidents: 10 },
    { name: "Sep 24", incidents: 18 },
    { name: "Sep 25", incidents: 14 },
    { name: "Sep 26", incidents: 22 },
  ]);

  useEffect(() => {
    // Simulate data refresh
    const timer = setInterval(() => {
      setData(prev => [
        ...prev.slice(1),
        { name: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), incidents: Math.floor(Math.random() * 20) + 5 }
      ]);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">DevOps Incident Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Open Incidents"
          value="18"
          icon={<AlertCircle className="h-5 w-5" />}
          trend="down"
          trendValue="2 from last hour"
        />
        <StatCard
          title="Resolved Today"
          value="42"
          icon={<Activity className="h-5 w-5" />}
          trend="up"
          trendValue="12%"
        />
        <StatCard
          title="Critical Incidents"
          value="3"
          icon={<Shield className="h-5 w-5" />}
          trend="up"
          trendValue="1 new"
        />
        <StatCard
          title="Mean Resolution Time"
          value="12m"
          icon={<Clock className="h-5 w-5" />}
          trend="down"
          trendValue="5m"
        />
      </div>

      {/* Memory Advantage Hero */}
      <div className="bg-gray-800 rounded-lg p-6 shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Memory-Assisted Resolutions</h2>
            <p className="text-gray-400 mt-1">85% of incidents resolved using Hindsight memory</p>
          </div>
          <div className="text-4xl font-bold text-blue-400">85%</div>
        </div>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none" }} />
              <Bar dataKey="incidents" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="bg-gray-800 rounded-lg p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Incidents</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${i === 1 ? "bg-red-500" : i === 2 ? "bg-yellow-500" : "bg-green-500"}`}>
                  <Server className="h-4 w-4 text-white" />
                </div>
                <div className="ml-3">
                  <p className="font-medium">Payment API 503</p>
                  <p className="text-sm text-gray-400">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className={`px-2 py-1 text-xs rounded-full ${i === 1 ? "bg-red-500 bg-opacity-20 text-red-400" : i === 2 ? "bg-yellow-500 bg-opacity-20 text-yellow-400" : "bg-green-500 bg-opacity-20 text-green-400"}`}>
                  {i === 1 ? "Critical" : i === 2 ? "High" : "Medium"}
                </span>
                <FileText className="h-4 w-4 ml-3 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
