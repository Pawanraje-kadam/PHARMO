import React, { useState } from 'react';
import { PatientForm } from '../components/PatientForm';
import { RecommendationList } from '../components/RecommendationList';
import { RecommendationSkeleton } from '../components/RecommendationSkeleton';
import { analyzeSymptoms, PatientSubmission } from '../api/ai-assistant.api';

export const AIAssistantView: React.FC = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmission = async (payload: PatientSubmission) => {
    setLoading(true);
    setError(null);
    try {
      const response = await analyzeSymptoms(payload);
      if (response.success) {
        setRecommendations(response.data);
      } else {
        setError(response.error || 'The analytics pipeline rejected this payload.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to establish connection to the AI service core.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI Medicine Assistant</h1>
        <p className="text-sm text-slate-500 mt-1">
          Clinical symptom mapping and semantic stock lookup context tool. Assists medical evaluation; does not replace final prescription authority.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5">
          <PatientForm onSubmit={handleFormSubmission} isLoading={loading} />
        </div>

        <div className="lg:col-span-7 bg-slate-50 p-6 rounded-xl border border-slate-200 min-h-[550px] flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200/60 flex items-center justify-between">
            <span>Ranked Recommendations</span>
            {recommendations.length > 0 && !loading && (
              <span className="text-xs font-medium bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                {recommendations.length} Matches
              </span>
            )}
          </h2>

          {error && (
            <div className="p-4 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
              ❌ Pipeline Alert: {error}
            </div>
          )}

          {loading ? (
            <RecommendationSkeleton />
          ) : recommendations.length === 0 && !error ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-2xl mb-3 text-blue-600">🧠</div>
              <h3 className="font-bold text-slate-700 text-sm">Awaiting Intake Parameters</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Fill out the diagnostic information form on the left pane and execute analytics to query cached medicine configurations.
              </p>
            </div>
          ) : (
            <RecommendationList data={recommendations} />
          )}
        </div>
      </div>
    </div>
  );
};