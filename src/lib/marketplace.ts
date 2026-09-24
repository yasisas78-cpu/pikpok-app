export type PakistanDeliveryZone = 'same-city' | 'major-intercity' | 'remote';

export interface DeliveryQuoteInput {
  zone: PakistanDeliveryZone;
  weightKg: number;
}

export interface DeliveryQuote {
  zone: PakistanDeliveryZone;
  weightKg: number;
  baseRate: number;
  additionalWeightSurcharge: number;
  remoteSurcharge: number;
  total: number;
}

export interface CommissionBreakdown {
  grossMerchandise: number;
  commissionPercent: number;
  platformFee: number;
  sellerPayout: number;
}

export interface SettlementSchedule {
  deliveredAt: string;
  returnClaimDeadline: string;
  settlementAvailableAt: string;
  status: 'escrow' | 'processing-settlement' | 'available';
}

export const DEFAULT_PLATFORM_COMMISSION_PERCENT = 5;
export const DELIVERY_BASE_RATES: Record<Exclude<PakistanDeliveryZone, 'remote'>, number> = {
  'same-city': 160,
  'major-intercity': 200
};
export const ADDITIONAL_KG_RATE = 60;
export const REMOTE_ZONE_SURCHARGE = 50;

export function calculateDeliveryQuote({ zone, weightKg }: DeliveryQuoteInput): DeliveryQuote {
  const safeWeight = Math.max(0.5, weightKg);
  const baseRate = zone === 'remote' ? DELIVERY_BASE_RATES['major-intercity'] : DELIVERY_BASE_RATES[zone];
  const additionalWeightSurcharge = safeWeight > 1 ? Math.ceil(safeWeight - 1) * ADDITIONAL_KG_RATE : 0;
  const remoteSurcharge = zone === 'remote' ? REMOTE_ZONE_SURCHARGE : 0;

  return {
    zone,
    weightKg: safeWeight,
    baseRate,
    additionalWeightSurcharge,
    remoteSurcharge,
    total: baseRate + additionalWeightSurcharge + remoteSurcharge
  };
}

export function calculateCommission(grossMerchandise: number, commissionPercent = DEFAULT_PLATFORM_COMMISSION_PERCENT): CommissionBreakdown {
  const safePercent = Math.max(0, Math.min(100, commissionPercent));
  const platformFee = Math.round(grossMerchandise * (safePercent / 100));
  return {
    grossMerchandise,
    commissionPercent: safePercent,
    platformFee,
    sellerPayout: Math.max(0, grossMerchandise - platformFee)
  };
}

export function getSettlementSchedule(deliveredAt: Date, now = new Date()): SettlementSchedule {
  const claimDeadline = new Date(deliveredAt.getTime() + 9 * 24 * 60 * 60 * 1000);
  const availableAt = new Date(deliveredAt.getTime() + 13 * 24 * 60 * 60 * 1000);
  const status = now < claimDeadline ? 'escrow' : now < availableAt ? 'processing-settlement' : 'available';
  return {
    deliveredAt: deliveredAt.toISOString(),
    returnClaimDeadline: claimDeadline.toISOString(),
    settlementAvailableAt: availableAt.toISOString(),
    status
  };
}
