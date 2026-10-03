import type { AccuracyTier } from '../../lib/game-logic';

/** Color for each accuracy tier, shared by the results accent bar and gauge. */
export const TIER_BAR_CLASS: Record<AccuracyTier, string> = {
  excellent: 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]',
  good: 'bg-emerald-500',
  fair: 'bg-amber-500',
  poor: 'bg-rose-500',
};

export const TIER_TEXT_CLASS: Record<AccuracyTier, string> = {
  excellent: 'text-emerald-400',
  good: 'text-emerald-500',
  fair: 'text-amber-500',
  poor: 'text-rose-500',
};

export const TIER_MESSAGE: Record<AccuracyTier, string> = {
  excellent: 'Desempenho extraordinário! Meta de >90% superada com sucesso!',
  good: 'Bom desempenho, continue treinando para alcançar os >90%!',
  fair: 'Nível desafiador, continue praticando para consolidar sua memória de trabalho.',
  poor: 'Nível desafiador, continue praticando para consolidar sua memória de trabalho.',
};
