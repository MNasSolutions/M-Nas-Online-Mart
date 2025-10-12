import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type Currency = "USD" | "NGN" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CNY";

const symbols: Record<Currency, string> = {
  USD: "$",
  NGN: "₦",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "C$",
  AUD: "A$",
  CNY: "¥",
};

const rates: Record<Currency, number> = {
  USD: 1,      // base
  NGN: 1500,   // Nigerian Naira
  EUR: 0.92,   // Euro
  GBP: 0.79,   // British Pound
  JPY: 149.50, // Japanese Yen
  CAD: 1.36,   // Canadian Dollar
  AUD: 1.52,   // Australian Dollar
  CNY: 7.24,   // Chinese Yuan
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
