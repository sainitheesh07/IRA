"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle,
  Terminal,
} from "lucide-react";

interface IncidentForm {
  title: string;
  service: string;
  severity: string;
  environment: string;
  errorMessage: string;
  symptoms: string;
  recentDeployment: string;
  logs: string;
  additionalContext: string;
}

const IncidentConsole = () => {
  const [form, setForm] = useState<IncidentForm>({
    title: "",
    service: "",
    severity: "critical",
    environment: "production",
    errorMessage: "",
    symptoms: "",
    recentDeployment: "",
    logs: "",
    additionalContext: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // 1. Create the incident
    const response = await fetch(
      "http://localhost:8000/api/incidents",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          service: form.service,
          severity: form.severity,
          environment: form.environment,
          error_message: form.errorMessage,
          symptoms: form.symptoms,
          recent_deployment: form.recentDeployment,
          logs: form.logs,
          additional_context: form.additionalContext,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create incident");
    }

    const data = await response.json();
    const incidentId = data.incident_id;

    // 2. Store the incident ID
    localStorage.setItem("currentIncidentId", incidentId);

    // 3. Start investigation
    const investigationResponse = await fetch(
      `http://localhost:8000/api/incidents/${incidentId}/investigate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!investigationResponse.ok) {
      const errorText = await investigationResponse.text();
      throw new Error(
        `Investigation failed: ${errorText}`
      );
    }

    // 4. Store investigation result
    const investigationResult =
      await investigationResponse.json();

    localStorage.setItem(
      "investigationResult",
      JSON.stringify(investigationResult)
    );

    setSubmitted(true);
  } catch (error) {
    console.error("Error:", error);
    alert(
      error instanceof Error
        ? error.message
        : "Something went wrong"
    );
  } finally {
    setIsSubmitting(false);
  }
};

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (submitted) {
    const incidentId =
      typeof window !== "undefined"
        ? localStorage.getItem("currentIncidentId")
        : null;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 shadow text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />

          <h2 className="text-xl font-bold mb-2">
            Incident Submitted
          </h2>

          <p className="text-gray-400 mb-4">
            Your incident has been logged and is being investigated.
          </p>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setSubmitted(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
              Submit Another Incident
            </button>

            {/* Changed: now goes to Incident History */}
            <Link
              href="/history"
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
            >
              View Investigation
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Incident Console
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Basic Info */}
        <div className="bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center mb-4">
            <Terminal className="h-5 w-5 text-blue-400" />

            <h2 className="text-lg font-semibold ml-3">
              Basic Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Title
              </label>

              <input
                type="text"
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Service */}
            <div>
              <label
                htmlFor="service"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Service
              </label>

              <select
                id="service"
                name="service"
                value={form.service}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">
                  Select a service
                </option>
                <option value="payment-api">
                  Payment API
                </option>
                <option value="auth-service">
                  Auth Service
                </option>
                <option value="order-service">
                  Order Service
                </option>
                <option value="inventory-service">
                  Inventory Service
                </option>
                <option value="notification-service">
                  Notification Service
                </option>
                <option value="api-gateway">
                  API Gateway
                </option>
                <option value="user-service">
                  User Service
                </option>
                <option value="redis">
                  Redis
                </option>
                <option value="postgres">
                  PostgreSQL
                </option>
                <option value="kafka">
                  Kafka
                </option>
              </select>
            </div>

            {/* Severity */}
            <div>
              <label
                htmlFor="severity"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Severity
              </label>

              <select
                id="severity"
                name="severity"
                value={form.severity}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
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

            {/* Environment */}
            <div>
              <label
                htmlFor="environment"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Environment
              </label>

              <select
                id="environment"
                name="environment"
                value={form.environment}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="production">
                  Production
                </option>
                <option value="staging">
                  Staging
                </option>
                <option value="development">
                  Development
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Incident Details */}
        <div className="bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-5 w-5 text-red-400" />

            <h2 className="text-lg font-semibold ml-3">
              Incident Details
            </h2>
          </div>

          <div className="space-y-4">
            {/* Error Message */}
            <div>
              <label
                htmlFor="errorMessage"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Error Message
              </label>

              <input
                type="text"
                id="errorMessage"
                name="errorMessage"
                value={form.errorMessage}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., HTTP 503 Service Unavailable"
                required
              />
            </div>

            {/* Symptoms */}
            <div>
              <label
                htmlFor="symptoms"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Symptoms
              </label>

              <textarea
                id="symptoms"
                name="symptoms"
                value={form.symptoms}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe what users are experiencing"
                required
              />
            </div>

            {/* Recent Deployment */}
            <div>
              <label
                htmlFor="recentDeployment"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Recent Deployment
              </label>

              <input
                type="text"
                id="recentDeployment"
                name="recentDeployment"
                value={form.recentDeployment}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., payment-api v2.8.1"
              />
            </div>

            {/* Logs */}
            <div>
              <label
                htmlFor="logs"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Logs
              </label>

              <textarea
                id="logs"
                name="logs"
                value={form.logs}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Paste relevant log entries"
              />
            </div>

            {/* Additional Context */}
            <div>
              <label
                htmlFor="additionalContext"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Additional Context
              </label>

              <textarea
                id="additionalContext"
                name="additionalContext"
                value={form.additionalContext}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Any other relevant information"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />

                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>

                Submitting...
              </>
            ) : (
              <>Investigate Incident</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IncidentConsole;