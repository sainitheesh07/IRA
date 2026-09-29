"use client";

import { useState } from "react";
import { FileText, Search, Server, Shield, Terminal, Clock } from "lucide-react";

interface Runbook {
  id: string;
  name: string;
  service: string;
  conditions: string;
  steps: string[];
  successCount: number;
  failureCount: number;
  lastUsed: string;
}

const Runbooks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState("all");

  const runbooks: Runbook[] = [
    {
      id: "RUN-001",
      name: "Payment API 503 Recovery",
      service: "payment-api",
      conditions: "HTTP 503 errors after deployment",
      steps: [
        "Check application logs for GatewayTimeoutException",
        "Verify database connection and gateway configuration",
        "Roll back to previous stable version if configuration mismatch detected",
        "Restart service dependencies if no configuration issue found",
      ],
      successCount: 12,
      failureCount: 2,
      lastUsed: "2026-09-21 14:02",
    },
    {
      id: "RUN-002",
      name: "Database Connection Recovery",
      service: "postgres",
      conditions: "Connection pool exhaustion",
      steps: [
        "Check active connections with pg_stat_activity",
        "Identify long-running transactions",
        "Terminate problematic connections if necessary",
        "Increase max_connections in postgresql.conf",
      ],
      successCount: 8,
      failureCount: 1,
      lastUsed: "2026-09-18 11:20",
    },
    {
      id: "RUN-003",
      name: "Kubernetes CrashLoopBackOff",
      service: "kubernetes",
      conditions: "Pods stuck in CrashLoopBackOff",
      steps: [
        "Check pod logs with kubectl logs",
        "Describe pod with kubectl describe",
        "Check resource limits and requests",
        "Restart the deployment if configuration is correct",
      ],
      successCount: 15,
      failureCount: 3,
      lastUsed: "2026-09-15 09:45",
    },
    {
      id: "RUN-004",
      name: "Redis Connection Failure",
      service: "redis",
      conditions: "Connection refused errors",
      steps: [
        "Check Redis service status",
        "Verify memory usage with redis-cli info",
        "Restart Redis server if memory is exhausted",
        "Check network connectivity between clients and server",
      ],
      successCount: 10,
      failureCount: 0,
      lastUsed: "2026-09-12 16:30",
    },
    {
      id: "RUN-005",
      name: "API Gateway Timeout",
      service: "api-gateway",
      conditions: "Upstream request timeout",
      steps: [
        "Check gateway logs for timeout errors",
        "Verify backend service health",
        "Adjust timeout settings in gateway configuration",
        "Implement circuit breaker pattern if needed",
      ],
      successCount: 7,
      failureCount: 1,
      lastUsed: "2026-09-10 13:15",
    },
    {
      id: "RUN-006",
      name: "Deployment Rollback",
      service: "all",
      conditions: "New deployment causing issues",
      steps: [
        "Identify the problematic deployment",
        "Roll back to previous stable version",
        "Investigate root cause of the failure",
        "Implement fixes and redeploy",
      ],
      successCount: 20,
      failureCount: 1,
      lastUsed: "2026-09-05 10:00",
    },
    {
      id: "RUN-007",
      name: "Authentication Service Failure",
      service: "auth-service",
      conditions: "Login failures or token validation issues",
      steps: [
        "Check authentication service logs",
        "Verify database connectivity",
        "Restart authentication service",
        "Check JWT signing key rotation if applicable",
      ],
      successCount: 9,
      failureCount: 0,
      lastUsed: "2026-09-02 18:30",
    },
  ];

  const filteredRunbooks = runbooks.filter((runbook) => {
    const matchesSearch = (
      runbook.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      runbook.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      runbook.conditions.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesService = selectedService === "all" || runbook.service === selectedService;
    return matchesSearch && matchesService;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Runbooks</h1>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-lg p-6 shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search runbooks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Services</option>
            <option value="payment-api">Payment API</option>
            <option value="postgres">PostgreSQL</option>
            <option value="kubernetes">Kubernetes</option>
            <option value="redis">Redis</option>
            <option value="api-gateway">API Gateway</option>
            <option value="auth-service">Auth Service</option>
          </select>
        </div>
      </div>

      {/* Runbook Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRunbooks.map((runbook) => (
          <div key={runbook.id} className="bg-gray-800 rounded-lg p-4 shadow hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-400 mr-2" />
                <h3 className="font-semibold">{runbook.name}</h3>
              </div>
              <span className="text-sm font-medium text-gray-400">{runbook.id}</span>
            </div>

            <div className="mb-3">
              <div className="flex items-center mb-1">
                <Server className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-400">Service: {runbook.service}</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-400">Conditions: {runbook.conditions}</span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">Steps:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
                {runbook.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Terminal className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-sm text-green-400">Success: {runbook.successCount}</span>
              </div>
              <div className="flex items-center">
                <Terminal className="h-4 w-4 text-red-400 mr-1" />
                <span className="text-sm text-red-400">Failure: {runbook.failureCount}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="flex items-center text-sm text-gray-400">
                <Clock className="h-4 w-4 mr-2" />
                <span>Last used: {runbook.lastUsed}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Runbooks;
