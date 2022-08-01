export const Utils = {
  roundAmount: (amount: number, nbDecimal: number): number => {
    return Math.round(10 ** nbDecimal * amount) / 10 ** nbDecimal;
  },
  sleep: (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  timeZone: 'Europe/Paris',
};
