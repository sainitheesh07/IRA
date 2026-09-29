"use client";

import { useState } from "react";
import { Clock, Lightbulb, Search, Shield, Terminal } from "lucide-react";

interface TimelineEvent {
  interaction: number;
  label: string;
  description: string;
  memoryStrength: number;
  memoryUsed: boolean;
}

const LearningTimeline = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      interaction: 1,
      label: "Generic Diagnosis",
      description: "Initial incident analysis without historical context",
      memoryStrength: 0,
      memoryUsed: false,
    },
    {
      interaction: 5,
      label: "Recognizes Payment-Service Pattern",
      description: "Begins identifying service-specific patterns",
      memoryStrength: 20,
      memoryUsed: false,
    },
    {
      interaction: 10,
      label: "Remembers Preferred Rollback Workflow",
      description: "Learns team's preferred rollback approach",
      memoryStrength: 50,
      memoryUsed: true,
    },
    {
      interaction: 20,
      label: "Identifies Recurring Deployment Issue",
      description: "Recognizes common deployment-related incidents",
      memoryStrength: 70,
      memoryUsed: true,
    },
    {
      interaction: 30,
      label: "Suggests Previously Successful Resolution",
      description: "Proactively recommends proven solutions",
      memoryStrength: 90,
      memoryUsed: true,
    },
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Learning Timeline</h1>

      {/* Timeline Header */}
      <div className="bg-gray-800 rounded-lg p-6 shadow">
        <div className="flex items-center mb-4">
          <Clock className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-semibold ml-3">Agent Learning Progress</h2>
        </div>
        <p className="text-gray-400">
          This timeline shows how the agent's intelligence improves over time through repeated interactions.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-600" />

        {/* Timeline events */}
        {events.map((event, index) => (
          <div key={index} className="mb-8 ml-10">
            <div className="flex items-center mb-1">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${event.memoryUsed ? "bg-blue-500" : "bg-gray-600"}`}>
                {event.memoryUsed ? (
                  <Lightbulb className="h-5 w-5 text-white" />
                ) : (
                  <Terminal className="h-5 w-5 text-gray-300" />
                )}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">{event.label}</h3>
                <p className="text-sm text-gray-400">Interaction #{event.interaction}</p>
              </div>
            </div>
            <div className="ml-14 mt-2">
              <p className="text-gray-300">{event.description}</p>
              <div className="mt-3">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-sm text-gray-400">Memory Strength: {event.memoryStrength}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full ${event.memoryUsed ? "bg-blue-500" : "bg-gray-500"}`}
                    style={{ width: `${event.memoryStrength}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningTimeline;
