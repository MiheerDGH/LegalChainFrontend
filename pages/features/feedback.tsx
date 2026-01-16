import { useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../../lib/supabaseClient';

export default function FeedbackPage() {
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackType, setFeedbackType] = useState<'general' | 'bug' | 'feature' | 'improvement'>('general');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!feedbackText.trim()) {
      setError('Please enter your feedback.');
      return;
    }

    setLoading(true);
    try {
      // Get current user session
      const { data } = await supabase.auth.getSession();
      const userId = data?.session?.user?.id;
      const userEmail = email || data?.session?.user?.email || 'anonymous';

      // Insert feedback into Supabase
      const { error: insertError } = await supabase
        .from('feedback')
        .insert([
          {
            user_id: userId,
            email: userEmail,
            feedback_type: feedbackType,
            feedback_text: feedbackText,
            created_at: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        setError(`Failed to submit feedback: ${insertError.message}`);
        return;
      }

      setMessage('Thank you! Your feedback has been submitted successfully.');
      setFeedbackText('');
      setEmail('');
      setFeedbackType('general');

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(`Error submitting feedback: ${err?.message || String(err)}`);
      console.error('Feedback submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        {/* Back Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-yellow-500 hover:text-yellow-600 font-semibold"
          >
            ← Back
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-gray-900">Send Us Your Feedback</h1>
        <p className="text-gray-600 mb-6">
          Help us improve Legal Chain by sharing your thoughts, bug reports, or feature suggestions.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Success Message */}
        {message && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {message}
          </div>
        )}

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Feedback Type */}
          <div>
            <label htmlFor="feedbackType" className="block text-sm font-medium mb-2">
              Feedback Type <span className="text-red-500">*</span>
            </label>
            <select
              id="feedbackType"
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="general">General Feedback</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="improvement">Improvement Suggestion</option>
            </select>
          </div>

          {/* Feedback Text */}
          <div>
            <label htmlFor="feedbackText" className="block text-sm font-medium mb-2">
              Your Feedback <span className="text-red-500">*</span>
            </label>
            <textarea
              id="feedbackText"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Please provide detailed feedback..."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Email (Optional) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email (Optional)
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to use your account email.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-400 text-white font-bold py-3 rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
