"use client";

import { useState } from "react";
import { BookOpen, Calendar, Clock, Search, Server, Tag } from "lucide-react";

interface MemoryRecord {
  id: string;
  type: string;
  service: string;
  rootCause: string;
  resolution: string;
  outcome: string;
  timestamp: string;
  duration: number;
  tags: string[];
}

const MemoryExplorer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const memories: MemoryRecord[] = [
    {
      id: "INC-1024",
      type: "experience",
      service: "payment-api",
      rootCause: "Invalid gateway configuration timeout",
      resolution: "Rolled back payment-api v2.8.1 to v2.8.0",
      outcome: "Resolved in 8 minutes",
      timestamp: "2026-09-21 14:02",
      duration: 8,
      tags: ["deployment", "gateway", "rollback"],
    },
    {
      id: "INC-0978",
      type: "experience",
      service: "payment-api",
      rootCause: "Gateway connection pool exhaustion",
      resolution: "Restarted connection pool and increased max connections",
      outcome: "Resolved in 14 minutes",
      timestamp: "2026-09-14 09:15",
      duration: 14,
      tags: ["connection", "pool", "restart"],
    },
    {
      id: "INC-0942",
      type: "experience",
      service: "payment-api",
      rootCause: "Deployment configuration mismatch",
      resolution: "Rolled back deployment and updated secret mapping",
      outcome: "Resolved in 6 minutes",
      timestamp: "2026-09-02 18:30",
      duration: 6,
      tags: ["deployment", "config", "rollback"],
    },
    {
      id: "RUN-0042",
      type: "runbook",
      service: "payment-api",
      rootCause: "",
      resolution: "Standard recovery steps",
      outcome: "",
      timestamp: "2026-08-15 10:00",
      duration: 0,
      tags: ["recovery", "standard"],
    },
    {
      id: "TEAM-001",
      type: "preference",
      service: "all",
      rootCause: "",
      resolution: "Team prefers rollback before restart",
      outcome: "",
      timestamp: "2026-07-01 08:00",
      duration: 0,
      tags: ["preference", "rollback"],
    },
  ];

  const filteredMemories = memories.filter((memory) => {
    const matchesSearch = (
      memory.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.rootCause.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.resolution.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesType = selectedType === "all" || memory.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Memory Explorer</h1>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-lg p-6 shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search memories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="experience">Experience</option>
            <option value="runbook">Runbook</option>
            <option value="preference">Preference</option>
          </select>
        </div>
      </div>

      {/* Memory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMemories.map((memory) => (
          <div key={memory.id} className="bg-gray-800 rounded-lg p-4 shadow hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`px-2 py-1 text-xs rounded-full ${memory.type === "experience" ? "bg-blue-500 bg-opacity-20 text-blue-400" : memory.type === "runbook" ? "bg-green-500 bg-opacity-20 text-green-400" : "bg-purple-500 bg-opacity-20 text-purple-400"}`}>
                {memory.type}
              </div>
              <span className="text-sm font-medium text-gray-400">{memory.id}</span>
            </div>
            <h3 className="font-semibold mb-2">{memory.service}</h3>
            <div className="space-y-2">
              {memory.rootCause && (
                <div>
                  <p className="text-sm font-medium">Root Cause</p>
                  <p className="text-sm text-gray-400">{memory.rootCause}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium">Resolution</p>
                <p className="text-sm text-gray-400">{memory.resolution}</p>
              </div>
              {memory.outcome && (
                <div>
                  <p className="text-sm font-medium">Outcome</p>
                  <p className="text-sm text-gray-400">{memory.outcome}</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center text-sm text-gray-400">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{memory.timestamp}</span>
              </div>
              {memory.duration > 0 && (
                <div className="flex items-center text-sm text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{memory.duration} min</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {memory.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 text-xs bg-gray-700 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryExplorer;
