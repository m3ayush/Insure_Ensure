import { useMemo } from "react";

const RADIUS = 80;
const STROKE_WIDTH = 14;
const CX = 100;
const CY = 100;
const ARC_LENGTH = Math.PI * RADIUS; // ~251.3

function getColor(score) {
  if (score <= 40) return { stroke: "#ef4444", text: "text-red-500", bg: "bg-red-50", label: "High Risk of Rejection", labelColor: "text-red-700" };
  if (score <= 75) return { stroke: "#eab308", text: "text-yellow-500", bg: "bg-yellow-50", label: "Action Required", labelColor: "text-yellow-700" };
  return { stroke: "#22c55e", text: "text-green-500", bg: "bg-green-50", label: "Ready to Submit", labelColor: "text-green-700" };
}

export default function ProbabilityGauge({ score, breakdown }) {
  const color = useMemo(() => getColor(score), [score]);
  const dashOffset = ARC_LENGTH * (1 - score / 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Claim Probability Score
      </h3>

      {/* Semi-circle gauge */}
      <div className="flex justify-center mb-2">
        <svg viewBox="0 0 200 120" className="w-56 h-auto">
          {/* Background arc */}
          <path
            d={`M ${CX - RADIUS} ${CY} A ${RADIUS} ${RADIUS} 0 0 1 ${CX + RADIUS} ${CY}`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
          />
          {/* Filled arc */}
          <path
            d={`M ${CX - RADIUS} ${CY} A ${RADIUS} ${RADIUS} 0 0 1 ${CX + RADIUS} ${CY}`}
            fill="none"
            stroke={color.stroke}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={ARC_LENGTH}
            strokeDashoffset={dashOffset}
            className="transition-all duration-700 ease-in-out"
          />
          {/* Score text */}
          <text x={CX} y={CY - 15} textAnchor="middle" className="text-3xl font-bold" fill="#111827" fontSize="36">
            {score}
          </text>
          <text x={CX} y={CY + 5} textAnchor="middle" fill="#6b7280" fontSize="12">
            out of 100
          </text>
        </svg>
      </div>

      {/* Status label */}
      <div className="flex justify-center mb-5">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${color.bg} ${color.labelColor}`}>
          {color.label}
        </span>
      </div>

      {/* Breakdown bars */}
      {breakdown && (
        <div className="space-y-2.5">
          <BreakdownBar label="Mandatory Docs" value={breakdown.mandatory_score || 0} max={50} />
          <BreakdownBar label="Financial Docs" value={breakdown.financial_score || 0} max={30} />
          <BreakdownBar label="Supporting Docs" value={breakdown.supporting_score || 0} max={20} />

          {breakdown.seal_penalty < 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-red-600">Missing Hospital Seal</span>
              <span className="font-medium text-red-600">{breakdown.seal_penalty}%</span>
            </div>
          )}
          {breakdown.signature_penalty < 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-red-600">Missing Doctor Signature</span>
              <span className="font-medium text-red-600">{breakdown.signature_penalty}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BreakdownBar({ label, value, max }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const barColor = pct >= 80 ? "bg-green-500" : pct >= 40 ? "bg-yellow-500" : "bg-red-400";

  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-800">{value}/{max}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-700 ease-in-out ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
