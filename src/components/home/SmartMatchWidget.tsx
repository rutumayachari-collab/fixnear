import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchProblemDescription } from '../../utils/smartMatch';
import { SmartMatchResult } from '../../types';
import { formatINR } from '../../utils/formatters';
import { CategoryIcon } from '../common/CategoryIcon';
import { Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';

interface SmartMatchWidgetProps {
  onSelectCategory?: (categoryId: string) => void;
  compact?: boolean;
}

export const SmartMatchWidget: React.FC<SmartMatchWidgetProps> = ({ 
  onSelectCategory, 
  compact = false 
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [matchResult, setMatchResult] = useState<SmartMatchResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = (queryToTest?: string) => {
    const text = queryToTest !== undefined ? queryToTest : inputQuery;
    if (!text.trim()) return;

    const result = matchProblemDescription(text);
    setMatchResult(result);
    setHasSearched(true);
  };

  const handleExampleClick = (example: string) => {
    setInputQuery(example);
    handleAnalyze(example);
  };

  const handleProceed = () => {
    if (matchResult) {
      if (onSelectCategory) {
        onSelectCategory(matchResult.category.id);
      } else {
        navigate(`/services?category=${matchResult.category.id}`);
      }
    }
  };

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden ${compact ? 'p-4' : 'p-6 sm:p-8'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#3B82F6] flex items-center justify-center font-bold">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0B1F3A]">Smart Repair Match</h3>
            <p className="text-xs text-[#667085]">
              Describe your repair issue in natural words — we'll detect the right category
            </p>
          </div>
        </div>
        <span className="text-[11px] bg-gray-100 text-[#667085] px-2.5 py-1 rounded-full border border-gray-200 self-start sm:self-auto">
          Rule-Based Keyword Match
        </span>
      </div>

      {/* Input box */}
      <div className="mt-4">
        <div className="relative">
          <textarea
            rows={compact ? 2 : 3}
            placeholder="e.g. My kitchen tap is leaking and water is dripping on the floor, or my electrical switch is sparking..."
            value={inputQuery}
            onChange={(e) => {
              setInputQuery(e.target.value);
              if (hasSearched) setHasSearched(false);
            }}
            className="w-full text-xs sm:text-sm rounded-xl border border-gray-300 p-3.5 bg-[#FBFBFA] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#3B82F6] transition-all resize-none"
          />
        </div>

        {/* Action button */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          {/* Preset sample queries */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[#667085] font-medium text-[11px]">Try examples:</span>
            {[
              'Tap is leaking',
              'Switch is sparking',
              'AC is not cooling',
              'Washing machine not spinning',
              'Cupboard hinge broken'
            ].map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => handleExampleClick(ex)}
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-[11px] transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleAnalyze()}
            disabled={!inputQuery.trim()}
            className="px-5 py-2 bg-[#0B1F3A] hover:bg-[#142d52] disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Sparkles size={14} className="text-[#3B82F6]" />
            <span>Match Service</span>
          </button>
        </div>
      </div>

      {/* Match Results Box */}
      {hasSearched && (
        <div className="mt-5 animate-in fade-in slide-in-from-top-2 duration-200">
          {matchResult ? (
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 space-y-3">
              {/* Category card header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-blue-200 flex items-center justify-center text-[#0B1F3A] shadow-xs">
                    <CategoryIcon categoryId={matchResult.category.id} size={22} className="text-[#3B82F6]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                        Suggested Category
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.2 rounded-full">
                        {matchResult.confidence} confidence
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[#0B1F3A]">
                      {matchResult.category.name}
                    </h4>
                    <p className="text-xs text-[#667085]">
                      Estimated starting visit charge: <strong className="text-[#15803D]">{formatINR(matchResult.category.startingPrice)}</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleProceed}
                  className="px-4 py-2.5 bg-[#0B1F3A] hover:bg-[#142d52] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors self-start sm:self-center"
                >
                  <span>View Matching Technicians</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Matched keywords pill */}
              <div className="text-xs text-[#667085] flex items-center gap-2 flex-wrap pt-1">
                <span className="font-medium text-[11px]">Matched Keywords:</span>
                {matchResult.matchedKeywords.map(kw => (
                  <span key={kw} className="bg-white border border-blue-200 px-2 py-0.5 rounded text-[11px] font-mono text-blue-800">
                    "{kw}"
                  </span>
                ))}
              </div>

              {/* Safety warning for electrical */}
              {matchResult.safetyWarning && (
                <div className={`p-3 rounded-lg text-xs flex items-start gap-2.5 ${
                  matchResult.isDangerous 
                    ? 'bg-rose-100 text-rose-900 border border-rose-300 font-medium' 
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  <ShieldAlert size={18} className={`shrink-0 mt-0.5 ${matchResult.isDangerous ? 'text-rose-700' : 'text-amber-700'}`} />
                  <div>
                    <p className="leading-relaxed">{matchResult.safetyWarning}</p>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <p className="text-[11px] text-[#667085] italic">
                Note: This rule-based matcher identifies the relevant service trade; it does not diagnose the actual electrical or mechanical fault.
              </p>
            </div>
          ) : (
            /* No match fallback */
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center space-y-2">
              <p className="text-xs text-[#667085]">
                We couldn't automatically match this description to a specific service trade.
              </p>
              <p className="text-xs font-semibold text-[#172033]">
                Please select your service manually from our catalogue:
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-2">
                {['plumbing', 'electrical', 'ac-repair', 'appliance-repair', 'carpentry', 'home-cleaning'].map((catId) => (
                  <button
                    key={catId}
                    type="button"
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory(catId);
                      else navigate(`/services?category=${catId}`);
                    }}
                    className="px-3 py-1.5 bg-white border border-gray-300 hover:border-gray-400 rounded-lg text-xs capitalize font-medium text-gray-700 hover:text-black transition-colors"
                  >
                    {catId.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
