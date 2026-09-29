"use client";

import { useState } from "react";
import { Code, FileText, Lightbulb, Search, Shield, Terminal } from "lucide-react";

interface ComparisonProps {
  title: string;
  description: string;
  items: string[];
  color: string;
}

const ComparisonCard = ({ title, description, items, color }: ComparisonProps) => (
  <div className={`bg-gray-800 rounded-lg p-6 shadow ${color}`}>
    <div className="flex items-center mb-4">
      <div className={`p-2 rounded-full bg-opacity-20 ${color.replace("border", "bg")}`}>
        {title === "Without Memory" ? <Search className="h-5 w-5" /> : <Lightbulb className="h-5 w-5" />}
      </div>
      <h3 className="text-lg font-semibold ml-3">{title}</h3>
    </div>
    <p className="text-gray-400 mb-4">{description}</p>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <div className={`mt-1 mr-2 h-2 w-2 rounded-full ${color.replace("border", "bg")}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const MemoryAdvantageDemo = () => {
  const [incident, setIncident] = useState("Payment API returning 503 Service Unavailable after deployment v2.8.1");
  const [mode, setMode] = useState<"without" | "with">("without");

  const withoutMemoryItems = [
    "Check application logs",
    "Verify database connection",
    "Check service health endpoints",
    "Review recent deployments",
    "Inspect gateway configuration",
  ];

  const withMemoryItems = [
    "Found 3 similar incidents in Hindsight memory",
    "Most recent incident (INC-1024) had identical symptoms",
    "Previous resolution: Rollback to v2.8.0",
    "Recommended: Roll back immediately",
    "Historical success rate: 85%",
    "Related runbook: Payment API 503 Recovery",
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Memory Advantage Demo</h1>

      {/* Incident Input */}
      <div className="bg-gray-800 rounded-lg p-6 shadow">
        <div className="flex items-center mb-4">
          <Terminal className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-semibold ml-3">Incident Console</h2>
        </div>
        <div className="relative">
          <input
            type="text"
            value={incident}
            onChange={(e) => setIncident(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the incident..."
          />
          <Terminal className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex space-x-2">
        <button
          onClick={() => setMode("without")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${mode === "without" ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-400"}`}
        >
          Without Memory
        </button>
        <button
          onClick={() => setMode("with")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${mode === "with" ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-400"}`}
        >
          With Hindsight Memory
        </button>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ComparisonCard
          title="Without Memory"
          description="Generic advice from LLM without historical context"
          items={withoutMemoryItems}
          color="border-red-500"
        />
        <ComparisonCard
          title="With Hindsight Memory"
          description="Context-aware recommendations from historical incidents"
          items={withMemoryItems}
          color="border-green-500"
        />
      </div>

      {/* Agent Trace */}
      {mode === "with" && (
        <div className="bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center mb-4">
            <Code className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold ml-3">Agent Execution Trace</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-blue-400 mt-1" />
              <div className="ml-3">
                <p className="font-medium">Hindsight Recall</p>
                <p className="text-sm text-gray-400">Querying memory bank for similar incidents</p>
              </div>
            </div>
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-blue-400 mt-1" />
              <div className="ml-3">
                <p className="font-medium">Historical Matches</p>
                <p className="text-sm text-gray-400">Found 3 matching incidents (INC-1024, INC-0978, INC-0942)</p>
              </div>
            </div>
            <div className="flex items-start">
              <Lightbulb className="h-5 w-5 text-blue-400 mt-1" />
              <div className="ml-3">
                <p className="font-medium">Recommendation Generated</p>
                <p className="text-sm text-gray-400">Based on historical patterns and diagnostic results</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryAdvantageDemo;
