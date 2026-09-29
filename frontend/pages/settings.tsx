"use client";

import { useState } from "react";
import { Settings, Shield, Terminal, Clock, BookOpen, AlertCircle } from "lucide-react";

interface TeamPreference {
  key: string;
  value: string;
  description: string;
}

const SettingsPage = () => {
  const [preferences, setPreferences] = useState<TeamPreference[]>([
    {
      key: "preferred_rollback_policy",
      value: "rollback_before_restart",
      description: "Team prefers to rollback deployments before restarting services",
    },
    {
      key: "preferred_restart_policy",
      value: "restart_after_rollback_validation",
      description: "Team prefers to restart services only after rollback validation",
    },
    {
      key: "escalation_on_severity",
      value: "critical",
      description: "Team escalates incidents only when severity is critical",
    },
    {
      key: "environment_specific_conventions",
      value: "production:rollback_first; staging:diagnose_first",
      description: "Environment-specific conventions for incident handling",
    },
  ]);

  const [apiKey, setApiKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* API Key Section */}
      <div className="bg-gray-800 rounded-lg p-6 shadow">
        <div className="flex items-center mb-4">
          <Terminal className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-semibold ml-3">API Keys</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-1">Hindsight API Key</label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your Hindsight API key"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>Save Settings</>
            )}
          </button>
        </div>
      </div>

      {/* Team Preferences Section */}
      <div className="bg-gray-800 rounded-lg p-6 shadow">
        <div className="flex items-center mb-4">
          <Settings className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-semibold ml-3">Team Preferences</h2>
        </div>
        <div className="space-y-4">
          {preferences.map((pref, index) => (
            <div key={index} className="border-b border-gray-700 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-300">{pref.key}</h3>
                  <p className="text-sm text-gray-400 mt-1">{pref.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-200">{pref.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-gray-800 rounded-lg p-6 shadow">
        <div className="flex items-center mb-4">
          <Shield className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-semibold ml-3">Security</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
            <p className="text-sm text-gray-400">Hindsight API key is required for full memory functionality. Use demo mode for offline testing.</p>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-blue-400 mr-3" />
            <p className="text-sm text-gray-400">Agent learning improves over time as more incidents are resolved and stored in memory.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
