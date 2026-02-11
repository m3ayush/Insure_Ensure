import { getCategoryLabel } from "../../data/insuranceCategories";

function ScoreBadge({ score }) {
  const color =
    score >= 80
      ? "bg-green-100 text-green-700"
      : score >= 60
      ? "bg-yellow-100 text-yellow-700"
      : "bg-orange-100 text-orange-700";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${color}`}>
      {score}% Match
    </span>
  );
}

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i < full
              ? "text-yellow-400"
              : i === full && hasHalf
              ? "text-yellow-300"
              : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating}</span>
    </div>
  );
}

function PlanCard({ plan, rank }) {
  const isTop = rank === 1;
  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg ${
        isTop ? "ring-2 ring-indigo-500" : ""
      }`}
    >
      {isTop && (
        <div className="bg-indigo-600 text-white text-center py-1.5 text-xs font-bold tracking-wide uppercase">
          Best Match
        </div>
      )}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={plan.insurer_logo}
              alt={plan.insurer_name}
              className="w-10 h-10 rounded-lg object-contain bg-gray-50 p-1"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div>
              <h3 className="font-bold text-gray-800 text-lg leading-tight">{plan.plan_name}</h3>
              <p className="text-sm text-gray-500">{plan.insurer_name}</p>
            </div>
          </div>
          <ScoreBadge score={plan.score} />
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 py-3 border-y border-gray-100">
          <div>
            <p className="text-xs text-gray-500 uppercase">Premium</p>
            <p className="text-sm font-bold text-gray-800">
              {plan.premium_range.min.toLocaleString("en-IN")} - {plan.premium_range.max.toLocaleString("en-IN")}
              <span className="text-xs font-normal text-gray-500 block">{plan.premium_range.unit}</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Cover</p>
            <p className="text-sm font-bold text-gray-800">
              {(plan.sum_insured_range.max / 100000).toFixed(0)}L
              <span className="text-xs font-normal text-gray-500 block">Max Sum Insured</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Claims</p>
            <p className="text-sm font-bold text-gray-800">
              {plan.claim_settlement_ratio}%
              <span className="text-xs font-normal text-gray-500 block">Settlement</span>
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-4">
          <StarRating rating={plan.rating} />
        </div>

        {/* Match Reasons */}
        {plan.match_reasons && plan.match_reasons.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Why this matches you</p>
            <ul className="space-y-1">
              {plan.match_reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Features */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Key Features</p>
          <div className="flex flex-wrap gap-2">
            {plan.key_features.slice(0, 4).map((feature, i) => (
              <span
                key={i}
                className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-medium"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Exclusions */}
        {plan.exclusions && plan.exclusions.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Exclusions</p>
            <p className="text-xs text-gray-500">{plan.exclusions.join(" | ")}</p>
          </div>
        )}

        {/* CTA */}
        <a
          href={plan.plan_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition no-underline"
        >
          View Plan Details
        </a>
      </div>
    </div>
  );
}

export default function ResultsView({ results, selectedCategory, onStartOver }) {
  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Your Top Recommendations</h2>
        <p className="text-gray-500 text-sm">
          Based on your profile, here are the best {getCategoryLabel(selectedCategory)} plans for you.
        </p>
      </div>

      <div className="space-y-6">
        {results.map((plan, i) => (
          <PlanCard key={plan.plan_id} plan={plan} rank={i + 1} />
        ))}
      </div>

      <div className="text-center mt-10">
        <button
          onClick={onStartOver}
          className="px-8 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
        >
          Get Another Recommendation
        </button>
      </div>
    </div>
  );
}
