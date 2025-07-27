import { useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Validation checks
  const isValidLength = password.length >= 8 && password.length <= 25;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasNoSpaces = !/\s/.test(password);
  const matchesConfirm = password === confirm;

  const meetsAllCriteria =
    isValidLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasNoSpaces;

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetsAllCriteria || !matchesConfirm) return;

    console.log("Form submitted 🚀");

    // 🔐 NEW: Check if user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      console.error("No active session or failed to fetch user:", userError?.message);
      router.push("/login");
      return;
    }

    // ✅ Try updating password
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      console.error("Error updating password:", error.message);
    } else {
      console.log("✅ Password updated successfully!");
      setSuccessMsg("✅ Password updated! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  const CriteriaItem = ({
    label,
    passed,
  }: {
    label: string;
    passed: boolean;
  }) => (
    <div className="flex items-center gap-2 text-sm text-yellow-300">
      <span>{passed ? "✅" : "⚪"}</span>
      <span className={passed ? "text-yellow-100" : "text-yellow-500"}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111] px-4">
      <div className="bg-[#1a1a1a] text-yellow-100 max-w-md w-full p-8 rounded-xl shadow-lg border border-yellow-700">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
          Create a New Password
        </h1>

        {successMsg && (
          <div className="mb-4 text-green-400 text-center font-semibold animate-pulse">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-5">
          <input
            type="password"
            placeholder="New password"
            className="w-full px-4 py-3 rounded-md bg-black border border-yellow-600 text-yellow-100 placeholder-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm password"
            className="w-full px-4 py-3 rounded-md bg-black border border-yellow-600 text-yellow-100 placeholder-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <div className="mt-4 space-y-1 text-sm">
            <CriteriaItem label="8–25 characters" passed={isValidLength} />
            <CriteriaItem label="At least 1 uppercase letter" passed={hasUppercase} />
            <CriteriaItem label="At least 1 lowercase letter" passed={hasLowercase} />
            <CriteriaItem label="At least 1 number" passed={hasNumber} />
            <CriteriaItem label="No spaces" passed={hasNoSpaces} />
            <CriteriaItem label="Passwords match" passed={matchesConfirm} />
          </div>

          <button
            type="submit"
            disabled={!meetsAllCriteria || !matchesConfirm}
            className={`w-full py-3 font-bold rounded-md transition ${
              !meetsAllCriteria || !matchesConfirm
                ? "bg-gray-600 cursor-not-allowed text-yellow-300"
                : "bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow hover:shadow-yellow-400/30"
            }`}
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
