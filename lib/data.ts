export type DailyPoint = { date: string; sales: number; marginPct: number; invTurn: number; refundPct: number };
export type Store = {
  id: string; name: string; sector: string; goal: number; fundedPct: number;
  series: DailyPoint[]; // 60 days
};

export const stores: Store[] = [
  {
    id: "main-street-coffee",
    name: "Main Street Coffee",
    sector: "Cafe",
    goal: 2000, fundedPct: 0.8,
    series: Array.from({ length: 60 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (59 - i));
      const sales = 600 + Math.round(60 * Math.sin(i/6)) + Math.round(Math.random()*30);
      return {
        date: d.toISOString().slice(0,10),
        sales,
        marginPct: 0.58 + (Math.random()*0.06 - 0.03),
        invTurn: 2.0 + (Math.random()*0.6 - 0.3),
        refundPct: 0.02 + (Math.random()*0.01 - 0.005)
      };
    })
  },
  {
    id: "pine-bluff-auto",
    name: "Pine Bluff Auto Repair",
    sector: "Auto",
    goal: 1500, fundedPct: 0.6,
    series: /* similar generator with different baseline */
    Array.from({ length: 60 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (59 - i));
      const sales = 900 + Math.round(120 * Math.cos(i/7)) + Math.round(Math.random()*60);
      return {
        date: d.toISOString().slice(0,10),
        sales,
        marginPct: 0.42 + (Math.random()*0.06 - 0.03),
        invTurn: 1.3 + (Math.random()*0.5 - 0.25),
        refundPct: 0.015 + (Math.random()*0.01 - 0.005)
      };
    })
  },
  {
    id: "downtown-boutique",
    name: "Downtown Boutique",
    sector: "Retail",
    goal: 3000, fundedPct: 0.5,
    series: Array.from({ length: 60 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (59 - i));
      const sales = 500 + Math.round(80 * Math.sin(i/5 + 1)) + Math.round(Math.random()*40);
      return {
        date: d.toISOString().slice(0,10),
        sales,
        marginPct: 0.52 + (Math.random()*0.08 - 0.04),
        invTurn: 2.4 + (Math.random()*0.7 - 0.35),
        refundPct: 0.03 + (Math.random()*0.015 - 0.007)
      };
    })
  }
];
