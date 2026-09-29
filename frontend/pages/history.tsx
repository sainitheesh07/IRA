"use client";

import { useState, useEffect } from "react";
import { Search, Shield } from "lucide-react";

interface IncidentRecord {
  id: string;
  title: string;
  service: string;
  severity: string;
  rootCause: string;
  resolution: string;
  duration: number;
  status: string;
  timestamp: string;
  memoryUsed: boolean;
  tags: string[];
}

interface BackendIncident {
  id?: number | string;
  incident_id?: string;
  title?: string;
  service?: string;
  severity?: string;
  root_cause?: string;
  rootCause?: string;
  resolution?: string;
  duration_minutes?: number;
  duration?: number;
  status?: string;
  timestamp?: string;
  created_at?: string;
  memory_used?: boolean;
  memoryUsed?: boolean;
  tags?: string[];
}

const IncidentHistory = () => {
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "http://localhost:8000/api/incidents"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: BackendIncident[] = await response.json();

        // Convert backend snake_case fields to frontend camelCase fields
        const formattedIncidents: IncidentRecord[] = data.map(
          (incident) => ({
            id: String(
              incident.incident_id ??
                incident.id ??
                "Unknown"
            ),

            title: String(
              incident.title ?? "Untitled Incident"
            ),

            service: String(
              incident.service ?? "Unknown Service"
            ),

            severity: String(
              incident.severity ?? "unknown"
            ).toLowerCase(),

            rootCause: String(
              incident.root_cause ??
                incident.rootCause ??
                "Not available"
            ),

            resolution: String(
              incident.resolution ?? "Not resolved"
            ),

            duration: Number(
              incident.duration_minutes ??
                incident.duration ??
                0
            ),

            status: String(
              incident.status ?? "open"
            ).toLowerCase(),

            timestamp: String(
              incident.timestamp ??
                incident.created_at ??
                ""
            ),

            memoryUsed: Boolean(
              incident.memory_used ??
                incident.memoryUsed ??
                false
            ),

            tags: Array.isArray(incident.tags)
              ? incident.tags
              : [],
          })
        );

        setIncidents(formattedIncidents);
        setError(null);
      } catch (error) {
        console.error(
          "Error fetching incidents:",
          error
        );

        setError(
          "Failed to load incidents. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  // Search and severity filtering
  const filteredIncidents = incidents.filter(
    (incident) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        String(incident.id)
          .toLowerCase()
          .includes(search) ||
        String(incident.title)
          .toLowerCase()
          .includes(search) ||
        String(incident.service)
          .toLowerCase()
          .includes(search) ||
        String(incident.rootCause)
          .toLowerCase()
          .includes(search);

      const matchesSeverity =
        filterSeverity === "all" ||
        incident.severity === filterSeverity;

      return matchesSearch && matchesSeverity;
    }
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">
          Error!
        </strong>

        <span className="block sm:inline">
          {" "}
          {error}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Incident History
      </h1>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-lg p-6 shadow">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search incidents..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>

          {/* Severity Filter */}
          <select
            value={filterSeverity}
            onChange={(e) =>
              setFilterSeverity(e.target.value)
            }
            className="bg-gray-700 border border-gray-600 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">
              All Severities
            </option>

            <option value="critical">
              Critical
            </option>

            <option value="high">
              High
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="low">
              Low
            </option>
          </select>
        </div>
      </div>

      {/* No incidents */}
      {filteredIncidents.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-6 shadow text-center">
          <p className="text-gray-400">
            {incidents.length === 0
              ? "No incidents found. Create an incident to see it here."
              : "No incidents match your search or filter."}
          </p>
        </div>
      ) : (
        /* Incident Table */
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg shadow">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Incident ID
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Title
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Service
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Severity
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Root Cause
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Resolution
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Duration
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Status
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Memory Used
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredIncidents.map(
                (incident) => (
                  <tr
                    key={incident.id}
                    className="border-b border-gray-700"
                  >
                    {/* Incident ID */}
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {incident.id}
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3 text-sm font-medium">
                      {incident.title}
                    </td>

                    {/* Service */}
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {incident.service}
                    </td>

                    {/* Severity */}
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          incident.severity ===
                          "critical"
                            ? "bg-red-500 bg-opacity-20 text-red-400"
                            : incident.severity ===
                              "high"
                            ? "bg-yellow-500 bg-opacity-20 text-yellow-400"
                            : incident.severity ===
                              "medium"
                            ? "bg-orange-500 bg-opacity-20 text-orange-400"
                            : "bg-green-500 bg-opacity-20 text-green-400"
                        }`}
                      >
                        {incident.severity}
                      </span>
                    </td>

                    {/* Root Cause */}
                    <td className="px-4 py-3 text-sm text-gray-400 truncate max-w-xs">
                      {incident.rootCause}
                    </td>

                    {/* Resolution */}
                    <td className="px-4 py-3 text-sm text-gray-400 truncate max-w-xs">
                      {incident.resolution}
                    </td>

                    {/* Duration */}
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {incident.duration} min
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-sm text-gray-400">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          incident.status ===
                          "resolved"
                            ? "bg-green-500 bg-opacity-20 text-green-400"
                            : "bg-gray-500 bg-opacity-20 text-gray-400"
                        }`}
                      >
                        {incident.status}
                      </span>
                    </td>

                    {/* Memory Used */}
                    <td className="px-4 py-3 text-sm">
                      <div
                        className={`flex items-center ${
                          incident.memoryUsed
                            ? "text-green-400"
                            : "text-gray-400"
                        }`}
                      >
                        <Shield className="h-4 w-4 mr-1" />

                        {incident.memoryUsed
                          ? "Yes"
                          : "No"}
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IncidentHistory;