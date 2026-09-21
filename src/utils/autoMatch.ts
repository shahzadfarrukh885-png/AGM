import { RFQ, VendorQuotation, AutoMatchComparisonResult } from '../types.ts';

export interface EvaluatedQuoteScore {
  quoteId: string;
  vendorName: string;
  priceScore: number; // 0-100 (normalized against min/max)
  technicalScore: number; // 0-100
  warrantyScore: number; // 0-100
  deliveryScore: number; // 0-100
  compositeScore: number; // Weighted composite out of 100
  isLowestPrice: boolean;
  isFastestDelivery: boolean;
  isHighestWarranty: boolean;
  isHighestTechnical: boolean;
  isWithinBudget: boolean;
  budgetVarianceAED: number; // Negative means savings below budget
}

export function evaluateAndAutoMatchQuotes(
  rfq: RFQ,
  quotes: VendorQuotation[]
): {
  result: AutoMatchComparisonResult | null;
  scores: Record<string, EvaluatedQuoteScore>;
} {
  const rfqQuotes = quotes.filter(q => q.rfqId === rfq.id);
  if (rfqQuotes.length === 0) {
    return { result: null, scores: {} };
  }

  // Find min/max values for normalization
  const prices = rfqQuotes.map(q => q.grandTotalAED);
  const leadTimes = rfqQuotes.map(q => q.leadTimeDays);
  const warranties = rfqQuotes.map(q => q.warrantyMonths);
  const technicals = rfqQuotes.map(q => q.complianceScore);

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minLead = Math.min(...leadTimes);
  const maxLead = Math.max(...leadTimes);
  const maxWarranty = Math.max(...warranties);
  const maxTech = Math.max(...technicals);

  const lowestPriceQuote = rfqQuotes.find(q => q.grandTotalAED === minPrice)!;
  const fastestDeliveryQuote = rfqQuotes.find(q => q.leadTimeDays === minLead)!;
  const highestWarrantyQuote = rfqQuotes.find(q => q.warrantyMonths === maxWarranty)!;
  const highestTechQuote = rfqQuotes.find(q => q.complianceScore === maxTech)!;

  const scores: Record<string, EvaluatedQuoteScore> = {};

  let highestComposite = -1;
  let recommendedQuoteId = lowestPriceQuote.id;

  rfqQuotes.forEach(q => {
    // Price Score: Min price gets 100, max price gets lower score
    const priceRange = maxPrice - minPrice;
    const priceScore = priceRange === 0 ? 100 : Math.round(100 - ((q.grandTotalAED - minPrice) / priceRange) * 100);

    // Delivery Score: Min days gets 100
    const leadRange = maxLead - minLead;
    const deliveryScore = leadRange === 0 ? 100 : Math.round(100 - ((q.leadTimeDays - minLead) / leadRange) * 100);

    // Warranty Score
    const warrantyScore = maxWarranty === 0 ? 100 : Math.round((q.warrantyMonths / Math.max(maxWarranty, 12)) * 100);

    // Technical Score
    const technicalScore = q.complianceScore;

    // Certification bonus
    const certBonus = q.dhaCertificationIncluded ? 5 : 0;

    // Weights:
    // Price: 40%, Technical: 30%, Warranty: 15%, Delivery: 10%, Cert: 5%
    const composite = Math.min(100, Math.round(
      priceScore * 0.40 +
      technicalScore * 0.30 +
      warrantyScore * 0.15 +
      deliveryScore * 0.10 +
      certBonus
    ));

    const isLowestPrice = q.id === lowestPriceQuote.id;
    const isFastestDelivery = q.id === fastestDeliveryQuote.id;
    const isHighestWarranty = q.id === highestWarrantyQuote.id;
    const isHighestTechnical = q.id === highestTechQuote.id;
    const isWithinBudget = q.grandTotalAED <= rfq.budgetAED;
    const budgetVarianceAED = q.grandTotalAED - rfq.budgetAED;

    scores[q.id] = {
      quoteId: q.id,
      vendorName: q.vendorName,
      priceScore,
      technicalScore,
      warrantyScore,
      deliveryScore,
      compositeScore: composite,
      isLowestPrice,
      isFastestDelivery,
      isHighestWarranty,
      isHighestTechnical,
      isWithinBudget,
      budgetVarianceAED
    };

    // Candidate for recommendation must not have severe technical rejection
    if (composite > highestComposite && q.status !== 'rejected') {
      highestComposite = composite;
      recommendedQuoteId = q.id;
    }
  });

  const recommendedQuote = rfqQuotes.find(q => q.id === recommendedQuoteId) || rfqQuotes[0];
  const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const potentialSavings = Math.max(0, maxPrice - recommendedQuote.grandTotalAED);

  // Generate recommendation rationale
  let recommendationReason = '';
  if (recommendedQuote.grandTotalAED <= rfq.budgetAED) {
    const budgetSavings = rfq.budgetAED - recommendedQuote.grandTotalAED;
    recommendationReason = `Recommended as Best Value with composite score ${scores[recommendedQuote.id]?.compositeScore}/100. Sits AED ${budgetSavings.toLocaleString()} below hospital budget, delivers ${recommendedQuote.leadTimeDays}-day turnaround, and maintains ${recommendedQuote.complianceScore}% technical compliance with DHA/DM requirements.`;
  } else {
    recommendationReason = `Selected as optimal balance between high technical reliability (${recommendedQuote.complianceScore}%) and warranty assurance (${recommendedQuote.warrantyMonths} months).`;
  }

  const result: AutoMatchComparisonResult = {
    rfqId: rfq.id,
    lowestPriceQuoteId: lowestPriceQuote.id,
    fastestLeadTimeQuoteId: fastestDeliveryQuote.id,
    highestWarrantyQuoteId: highestWarrantyQuote.id,
    highestTechnicalQuoteId: highestTechQuote.id,
    recommendedQuoteId,
    recommendationReason,
    averageQuoteAED: avgPrice,
    potentialSavingsAED: potentialSavings,
    quotesCount: rfqQuotes.length
  };

  return { result, scores };
}
