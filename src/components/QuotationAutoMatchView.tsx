import React, { useState } from 'react';
import { RFQ, VendorQuotation, Vendor } from '../types.ts';
import { evaluateAndAutoMatchQuotes } from '../utils/autoMatch.ts';
import { 
  Scale, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  TrendingDown, 
  FileText, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Check, 
  X, 
  DollarSign,
  Zap,
  Download,
  Building,
  Sparkles
} from 'lucide-react';

interface QuotationAutoMatchViewProps {
  rfqs: RFQ[];
  quotations: VendorQuotation[];
  vendors: Vendor[];
  selectedRfqId?: string;
  onSelectRfq: (rfqId: string) => void;
  onAddRfq: (rfq: Omit<RFQ, 'id'>) => void;
  onAddQuotation: (quote: Omit<VendorQuotation, 'id'>) => void;
  onApproveQuotation: (rfqId: string, quoteId: string) => void;
}

export const QuotationAutoMatchView: React.FC<QuotationAutoMatchViewProps> = ({
  rfqs,
  quotations,
  vendors,
  selectedRfqId,
  onSelectRfq,
  onAddRfq,
  onAddQuotation,
  onApproveQuotation
}) => {
  const currentRfqId = selectedRfqId || rfqs[0]?.id || '';
  const currentRfq = rfqs.find(r => r.id === currentRfqId) || rfqs[0];

  const currentQuotes = quotations.filter(q => q.rfqId === currentRfq?.id);

  // Run auto-match evaluation algorithm
  const { result: autoMatchResult, scores } = currentRfq 
    ? evaluateAndAutoMatchQuotes(currentRfq, quotations) 
    : { result: null, scores: {} };

  // Modals
  const [isNewRfqModalOpen, setIsNewRfqModalOpen] = useState(false);
  const [isNewQuoteModalOpen, setIsNewQuoteModalOpen] = useState(false);
  const [showPrintStatement, setShowPrintStatement] = useState(false);

  // New RFQ form
  const [rfqTitle, setRfqTitle] = useState('');
  const [rfqDept, setRfqDept] = useState('Central Chiller Plant Room B2');
  const [rfqBudget, setRfqBudget] = useState(50000);
  const [rfqDeadline, setRfqDeadline] = useState('2026-10-15');
  const [rfqScope, setRfqScope] = useState('');
  const [rfqDays, setRfqDays] = useState(10);

  // New Quote form
  const [quoteVendorId, setQuoteVendorId] = useState(vendors[0]?.id || '');
  const [quoteRef, setQuoteRef] = useState(`QT-DXB-${Math.floor(1000 + Math.random() * 9000)}`);
  const [quoteSubtotal, setQuoteSubtotal] = useState(48000);
  const [quoteLeadDays, setQuoteLeadDays] = useState(7);
  const [quoteWarrantyMonths, setQuoteWarrantyMonths] = useState(12);
  const [quotePaymentTerms, setQuotePaymentTerms] = useState('30 Days PDC upon Handover');
  const [quoteScore, setQuoteScore] = useState(90);
  const [quoteInclusions, setQuoteInclusions] = useState('Parts, labor, OEM consumables, DHA sign-off');
  const [quoteExclusions, setQuoteExclusions] = useState('Primary electrical switchgear replacement');
  const [quoteDhaIncluded, setQuoteDhaIncluded] = useState(true);

  const handleCreateRfq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfqTitle) return;

    onAddRfq({
      rfqNumber: `RFQ-FM-${Math.floor(100 + Math.random() * 900)}`,
      title: rfqTitle,
      domain: 'Hard FM',
      department: rfqDept,
      budgetAED: Number(rfqBudget),
      createdDate: new Date().toISOString().split('T')[0],
      deadlineDate: rfqDeadline,
      scopeOfWork: rfqScope || 'Comprehensive hospital facility upgrade / repair scope.',
      requiredCompletionDays: Number(rfqDays),
      mandatoryCompliance: ['DHA Healthcare Compliance', 'Dubai Municipality Certificate', 'OEM Original Spares'],
      status: 'Comparing Quotes'
    });

    setIsNewRfqModalOpen(false);
    setRfqTitle('');
    setRfqScope('');
  };

  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRfq) return;

    const vendor = vendors.find(v => v.id === quoteVendorId) || vendors[0];
    const subtotal = Number(quoteSubtotal);
    const vat = Math.round(subtotal * 0.05);
    const grandTotal = subtotal + vat;

    onAddQuotation({
      rfqId: currentRfq.id,
      vendorId: vendor.id,
      vendorName: vendor.name,
      quoteReference: quoteRef,
      dateSubmitted: new Date().toISOString().split('T')[0],
      validUntil: '2026-10-31',
      subtotalAED: subtotal,
      vat5PercentAED: vat,
      grandTotalAED: grandTotal,
      leadTimeDays: Number(quoteLeadDays),
      warrantyMonths: Number(quoteWarrantyMonths),
      paymentTerms: quotePaymentTerms,
      scopeInclusions: quoteInclusions.split(',').map(s => s.trim()),
      scopeExclusions: quoteExclusions.split(',').map(s => s.trim()),
      complianceScore: Number(quoteScore),
      dhaCertificationIncluded: quoteDhaIncluded,
      status: 'under_review',
      managerNotes: 'New vendor quotation received and queued for auto-matching comparison.'
    });

    setIsNewQuoteModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Quotation Management &amp; Auto-Match Comparison System
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Evaluate competing contractor bids in AED side-by-side with automated multi-criteria decision matching (L1 Price, Lead Time, Warranty &amp; DHA Compliance).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewRfqModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create RFQ / Tender
          </button>

          <button
            onClick={() => setIsNewQuoteModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Log Vendor Quotation
          </button>
        </div>
      </div>

      {/* RFQ Selector Chips Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
          Select Active Work Order / RFQ to Compare:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {rfqs.map(rfq => {
            const count = quotations.filter(q => q.rfqId === rfq.id).length;
            const isSelected = rfq.id === currentRfq?.id;
            return (
              <button
                key={rfq.id}
                onClick={() => onSelectRfq(rfq.id)}
                className={`text-xs px-3.5 py-2 rounded-xl font-medium text-left transition-all border flex items-center gap-2 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div>
                  <span className="font-semibold block">{rfq.title}</span>
                  <span className="text-[10px] opacity-80 block font-mono">
                    Budget: AED {rfq.budgetAED.toLocaleString()} • {count} Quotes
                  </span>
                </div>
                {rfq.status === 'Awarded' && (
                  <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                    AWARDED
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE RFQ DETAILS CARD */}
      {currentRfq && (
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs border border-emerald-500/30">
                  {currentRfq.rfqNumber}
                </span>
                <span className="text-xs text-slate-400">
                  Dept: <strong className="text-slate-200">{currentRfq.department}</strong>
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                {currentRfq.title}
              </h3>
            </div>

            <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Approved Budget</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  AED {currentRfq.budgetAED.toLocaleString()}
                </span>
              </div>
              <div className="border-l border-slate-700 pl-4">
                <span className="text-[10px] text-slate-400 uppercase block">Deadline</span>
                <span className="text-xs font-semibold text-slate-200">
                  {currentRfq.deadlineDate}
                </span>
              </div>
              <div className="border-l border-slate-700 pl-4">
                <span className="text-[10px] text-slate-400 uppercase block">Quotes Logged</span>
                <span className="text-base font-bold text-sky-400 font-mono">
                  {currentQuotes.length} Bids
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/50 p-2.5 rounded-lg border border-slate-800">
            <strong>Scope of Work:</strong> {currentRfq.scopeOfWork}
          </p>
        </div>
      )}

      {/* AUTO-MATCH ALGORITHM INTELLIGENCE BANNER */}
      {autoMatchResult && (
        <div className="bg-gradient-to-r from-emerald-900/90 via-teal-950 to-slate-900 border border-emerald-500/40 rounded-2xl p-5 text-white shadow-lg space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  Auto-Match Algorithm Recommendation
                </span>
                <h4 className="text-base font-bold text-white">
                  Best Value Match: {quotations.find(q => q.id === autoMatchResult.recommendedQuoteId)?.vendorName}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {autoMatchResult.potentialSavingsAED > 0 && (
                <div className="bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs">
                  <span className="text-emerald-300 font-semibold block">Maximum Savings:</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">
                    AED {autoMatchResult.potentialSavingsAED.toLocaleString()}
                  </span>
                </div>
              )}

              <button
                onClick={() => setShowPrintStatement(!showPrintStatement)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium border border-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                Comparative Statement Sheet
              </button>
            </div>
          </div>

          {/* Rationale */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-emerald-500/20 text-xs text-slate-200 leading-relaxed">
            <Sparkles className="w-4 h-4 text-amber-400 inline mr-1.5" />
            <strong>Algorithm Audit Rationale:</strong> {autoMatchResult.recommendationReason}
          </div>

          {/* Quick Winner Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">L1 Lowest Price:</span>
              <strong className="text-emerald-400 truncate block">
                {quotations.find(q => q.id === autoMatchResult.lowestPriceQuoteId)?.vendorName}
              </strong>
              <span className="text-[11px] font-mono text-slate-300">
                AED {quotations.find(q => q.id === autoMatchResult.lowestPriceQuoteId)?.grandTotalAED.toLocaleString()}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Fastest Turnaround:</span>
              <strong className="text-sky-400 truncate block">
                {quotations.find(q => q.id === autoMatchResult.fastestLeadTimeQuoteId)?.vendorName}
              </strong>
              <span className="text-[11px] font-mono text-slate-300">
                {quotations.find(q => q.id === autoMatchResult.fastestLeadTimeQuoteId)?.leadTimeDays} Days Execution
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Longest Warranty:</span>
              <strong className="text-purple-400 truncate block">
                {quotations.find(q => q.id === autoMatchResult.highestWarrantyQuoteId)?.vendorName}
              </strong>
              <span className="text-[11px] font-mono text-slate-300">
                {quotations.find(q => q.id === autoMatchResult.highestWarrantyQuoteId)?.warrantyMonths} Months Warranty
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Technical Compliance:</span>
              <strong className="text-amber-400 truncate block">
                {quotations.find(q => q.id === autoMatchResult.highestTechnicalQuoteId)?.vendorName}
              </strong>
              <span className="text-[11px] font-mono text-slate-300">
                {quotations.find(q => q.id === autoMatchResult.highestTechnicalQuoteId)?.complianceScore}% DHA Score
              </span>
            </div>
          </div>
        </div>
      )}

      {/* COMPARATIVE STATEMENT MODAL / PRINTABLE SUMMARY VIEW */}
      {showPrintStatement && autoMatchResult && (
        <div className="bg-white border-2 border-emerald-600 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase">Hospital Technical &amp; Financial Evaluation</span>
              <h3 className="text-lg font-bold text-slate-900">
                Comparative Bid Evaluation Statement — {currentRfq?.title}
              </h3>
            </div>
            <button
              onClick={() => setShowPrintStatement(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Close Statement
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Evaluation Parameter</th>
                  {currentQuotes.map(q => (
                    <th key={q.id} className="p-2.5 border-l border-slate-200">
                      {q.vendorName}
                      {q.id === autoMatchResult.recommendedQuoteId && (
                        <span className="block text-[10px] text-emerald-600 font-bold">★ RECOMMENDED</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                <tr>
                  <td className="p-2.5 font-semibold bg-slate-50">Grand Total (AED incl. 5% VAT)</td>
                  {currentQuotes.map(q => (
                    <td key={q.id} className={`p-2.5 border-l font-mono font-bold ${q.id === autoMatchResult.lowestPriceQuoteId ? 'text-emerald-700 bg-emerald-50/50' : ''}`}>
                      AED {q.grandTotalAED.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold bg-slate-50">Variance vs Hospital Budget</td>
                  {currentQuotes.map(q => {
                    const diff = currentRfq ? q.grandTotalAED - currentRfq.budgetAED : 0;
                    return (
                      <td key={q.id} className={`p-2.5 border-l font-mono ${diff <= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {diff <= 0 ? `- AED ${Math.abs(diff).toLocaleString()} (Under)` : `+ AED ${diff.toLocaleString()} (Over)`}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold bg-slate-50">Turnaround / Execution Days</td>
                  {currentQuotes.map(q => (
                    <td key={q.id} className="p-2.5 border-l font-mono">
                      {q.leadTimeDays} Days
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold bg-slate-50">Warranty Period</td>
                  {currentQuotes.map(q => (
                    <td key={q.id} className="p-2.5 border-l font-mono">
                      {q.warrantyMonths} Months
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold bg-slate-50">DHA Cleanroom Certification</td>
                  {currentQuotes.map(q => (
                    <td key={q.id} className="p-2.5 border-l">
                      {q.dhaCertificationIncluded ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Included
                        </span>
                      ) : (
                        <span className="text-rose-600 font-bold flex items-center gap-1">
                          <X className="w-3.5 h-3.5" /> Excluded
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold bg-slate-50">Technical Compliance Score</td>
                  {currentQuotes.map(q => (
                    <td key={q.id} className="p-2.5 border-l font-bold text-slate-800">
                      {q.complianceScore} / 100
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold bg-slate-50">Payment Terms</td>
                  {currentQuotes.map(q => (
                    <td key={q.id} className="p-2.5 border-l text-[11px] text-slate-600">
                      {q.paymentTerms}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SIDE-BY-SIDE QUOTATIONS CARDS MATRIX */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-600" />
            Competitive Quotations Matrix ({currentQuotes.length} Vendor Proposals)
          </h3>
          <span className="text-xs text-slate-400">
            Automated scoring updates with each proposal
          </span>
        </div>

        {currentQuotes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
            <Scale className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-medium text-slate-600">No vendor quotations logged for this RFQ yet.</p>
            <button
              onClick={() => setIsNewQuoteModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold text-xs shadow-sm hover:bg-emerald-700"
            >
              Add First Quotation
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentQuotes.map((quote) => {
              const score = scores[quote.id];
              const isRecommended = autoMatchResult?.recommendedQuoteId === quote.id;
              const isApproved = quote.status === 'approved' || currentRfq?.awardedQuoteId === quote.id;

              return (
                <div 
                  key={quote.id}
                  className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative ${
                    isApproved
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                      : isRecommended
                      ? 'border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/10'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Top badges */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        Ref: {quote.quoteReference}
                      </span>

                      {isApproved ? (
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <CheckCircle2 className="w-3 h-3" />
                          AWARDED (PO ISSUED)
                        </span>
                      ) : isRecommended ? (
                        <span className="bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm animate-pulse">
                          <Award className="w-3 h-3" />
                          AUTO-MATCH WINNER
                        </span>
                      ) : quote.status === 'rejected' ? (
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          NON-COMPLIANT
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                          Under Review
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-base">
                        {quote.vendorName}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Submitted: {quote.dateSubmitted}
                      </p>
                    </div>

                    {/* Price in AED */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-500 font-medium">Grand Total (AED):</span>
                        <span className="text-xl font-bold font-mono text-slate-900">
                          AED {quote.grandTotalAED.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Subtotal: AED {quote.subtotalAED.toLocaleString()}</span>
                        <span>VAT (5%): AED {quote.vat5PercentAED.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Multi-Criteria Score Badges */}
                    {score && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">Composite Match</span>
                          <strong className="text-sm text-teal-700 font-bold font-mono">
                            {score.compositeScore} / 100
                          </strong>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">Technical Score</span>
                          <strong className="text-sm text-slate-800 font-bold font-mono">
                            {quote.complianceScore}%
                          </strong>
                        </div>
                      </div>
                    )}

                    {/* Turnaround & Warranty */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Lead Time:</span>
                        <strong className="text-slate-800 font-mono">{quote.leadTimeDays} Days</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Warranty:</span>
                        <strong className="text-slate-800 font-mono">{quote.warrantyMonths} Months</strong>
                      </div>
                    </div>

                    {/* Inclusions */}
                    <div className="space-y-1 text-xs">
                      <span className="font-semibold text-slate-700 block text-[11px]">Included Scope:</span>
                      <ul className="space-y-0.5 text-slate-600 text-[11px]">
                        {quote.scopeInclusions.slice(0, 3).map((inc, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Exclusions */}
                    {quote.scopeExclusions.length > 0 && (
                      <div className="space-y-1 text-xs">
                        <span className="font-semibold text-rose-700 block text-[11px]">Exclusions Flagged:</span>
                        <ul className="space-y-0.5 text-slate-500 text-[11px]">
                          {quote.scopeExclusions.slice(0, 2).map((exc, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <X className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{exc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Payment Terms */}
                    <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                      <strong>Payment Terms:</strong> {quote.paymentTerms}
                    </p>
                  </div>

                  {/* Approve / PO CTA */}
                  <div className="pt-3 border-t border-slate-100">
                    {!isApproved ? (
                      <button
                        onClick={() => onApproveQuotation(quote.rfqId, quote.id)}
                        className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                          isRecommended
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve &amp; Generate PO Requisition
                      </button>
                    ) : (
                      <div className="w-full py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs text-center border border-emerald-200">
                        ✓ Awarded by Facility Director
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE NEW RFQ MODAL */}
      {isNewRfqModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                Initiate New Hospital RFQ / Tender
              </h3>
              <button onClick={() => setIsNewRfqModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRfq} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Order / Project Title *</label>
                <input
                  type="text"
                  required
                  value={rfqTitle}
                  onChange={(e) => setRfqTitle(e.target.value)}
                  placeholder="e.g. Annual Fire Alarm Hassantuk Integration & Damper Test"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hospital Department / Plant Room</label>
                  <input
                    type="text"
                    value={rfqDept}
                    onChange={(e) => setRfqDept(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Approved Budget (AED)</label>
                  <input
                    type="number"
                    value={rfqBudget}
                    onChange={(e) => setRfqBudget(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bid Submission Deadline</label>
                  <input
                    type="date"
                    value={rfqDeadline}
                    onChange={(e) => setRfqDeadline(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Turnaround (Days)</label>
                  <input
                    type="number"
                    value={rfqDays}
                    onChange={(e) => setRfqDays(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Technical Scope of Work (SOW)</label>
                <textarea
                  rows={3}
                  value={rfqScope}
                  onChange={(e) => setRfqScope(e.target.value)}
                  placeholder="Detailed specifications, DHA/DM standards, safety requirements..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewRfqModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
                >
                  Publish RFQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOG VENDOR QUOTATION MODAL */}
      {isNewQuoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                Log Received Contractor Quotation
              </h3>
              <button onClick={() => setIsNewQuoteModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuotation} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vendor / Contractor</label>
                  <select
                    value={quoteVendorId}
                    onChange={(e) => setQuoteVendorId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    {vendors.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quote Reference No</label>
                  <input
                    type="text"
                    value={quoteRef}
                    onChange={(e) => setQuoteRef(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subtotal Bid (AED before VAT)</label>
                  <input
                    type="number"
                    value={quoteSubtotal}
                    onChange={(e) => setQuoteSubtotal(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Grand Total (with 5% VAT): AED {(quoteSubtotal * 1.05).toLocaleString()}
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Execution Lead Time (Days)</label>
                  <input
                    type="number"
                    value={quoteLeadDays}
                    onChange={(e) => setQuoteLeadDays(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Warranty (Months)</label>
                  <input
                    type="number"
                    value={quoteWarrantyMonths}
                    onChange={(e) => setQuoteWarrantyMonths(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Technical Compliance Score (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={quoteScore}
                    onChange={(e) => setQuoteScore(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Terms</label>
                <input
                  type="text"
                  value={quotePaymentTerms}
                  onChange={(e) => setQuotePaymentTerms(e.target.value)}
                  placeholder="e.g. 30 Days PDC upon handover"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Scope Inclusions (comma-separated)</label>
                <input
                  type="text"
                  value={quoteInclusions}
                  onChange={(e) => setQuoteInclusions(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Exclusions / Limitations Flagged</label>
                <input
                  type="text"
                  value={quoteExclusions}
                  onChange={(e) => setQuoteExclusions(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="dhaCertCheck"
                  checked={quoteDhaIncluded}
                  onChange={(e) => setQuoteDhaIncluded(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="dhaCertCheck" className="text-slate-700 font-medium cursor-pointer">
                  Includes DHA / Dubai Municipality official sign-off certificate
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewQuoteModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
                >
                  Add to Auto-Match Matrix
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
