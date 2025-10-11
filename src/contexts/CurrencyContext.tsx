import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type Currency = "USD" | "NGN" | "EUR";

const symbols: Record<Currency, string> = {
  USD: "$",
  NGN: "₦",
  EUR: "€",
};

const rates: Record<Currency, number> = {
  USD: 1,      // base
  NGN: 1500,   // example rate
  EUR: 0.92,   // example rate
};

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem("currency");
    return (saved as Currency) || "USD";
  });

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  const value = useMemo<CurrencyContextValue>(() => ({
    currency,
    setCurrency,
    format: (amount: number) => {
      const converted = amount * (rates[currency] || 1);
      return `${symbols[currency]}${converted.toFixed(2)}`;
    }
  }), [currency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
};
