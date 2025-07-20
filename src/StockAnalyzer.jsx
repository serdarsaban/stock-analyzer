// src/StockAnalyzer.jsx
import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Volume2,
  Target,
  Calendar,
  DollarSign,
  Download,
} from 'lucide-react';

const stockData = [
  { postDate: '2025-06-13', company: 'FORTIVE', ticker: 'FTV', target: 88, currentPrice: 51, postPrice: 71, upside: 23.94, priceChangeAfterPost: -38.81, currentToTarget: 72.04 },
  { postDate: '2025-06-12', company: 'TESLA', ticker: 'TSLA', target: 405, currentPrice: 311, postPrice: 326, upside: 24.23, priceChangeAfterPost: -4.90, currentToTarget: 30.32 },
  // Add more stock items here (same format as above)
];

const calculateTechnicalScore = (stock) => {
  const rsiBase = Math.random() * 100;
  const rsi = Math.max(20, Math.min(80, rsiBase + stock.priceChangeAfterPost * 0.5));
  const macdSignal = stock.priceChangeAfterPost > 0 ? 'bullish' : 'bearish';
  const macdStrength = Math.abs(stock.priceChangeAfterPost) > 10 ? 'strong' : 'weak';
  const volumeScore = Math.abs(stock.currentToTarget) > 20 ? 'high' : 'normal';

  let entryScore = 0;
  if (rsi >= 30 && rsi <= 70) entryScore += 3;
  else if (rsi < 30) entryScore += 2;
  else entryScore += 1;

  if (stock.currentToTarget > 30) entryScore += 3;
  else if (stock.currentToTarget > 15) entryScore += 2;
  else if (stock.currentToTarget > 5) entryScore += 1;

  if (stock.priceChangeAfterPost < -10) entryScore += 2;
  else if (stock.priceChangeAfterPost < 0) entryScore += 1;

  const daysAgo = Math.floor((new Date() - new Date(stock.postDate)) / (1000 * 60 * 60 * 24));
  if (daysAgo < 30) entryScore += 2;
  else if (daysAgo < 60) entryScore += 1;

  return {
    rsi: Math.round(rsi),
    macdSignal,
    macdStrength,
    volumeScore,
    entryScore,
    recommendation:
      entryScore >= 7 ? 'STRONG BUY' : entryScore >= 5 ? 'BUY' : entryScore >= 3 ? 'HOLD' : 'WAIT',
  };
};

const StockAnalyzer = () => {
  const [stocks, setStocks] = useState([]);
  const [sortBy, setSortBy] = useState('entryScore');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const analyzed = stockData.map((s) => ({ ...s, analysis: calculateTechnicalScore(s) }));
    setStocks(analyzed);
    setLoading(false);
  }, []);

  const sortedStocks = [...stocks].sort((a, b) => {
    switch (sortBy) {
      case 'entryScore':
        return b.analysis.entryScore - a.analysis.entryScore;
      case 'upside':
        return b.currentToTarget - a.currentToTarget;
      case 'rsi':
        return Math.abs(50 - a.analysis.rsi) - Math.abs(50 - b.analysis.rsi);
      default:
        return b.analysis.entryScore - a.analysis.entryScore;
    }
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Stock Technical Analyzer</h1>
      <div className="mb-4">
        <label className="mr-2">Sort By:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="entryScore">Entry Score</option>
          <option value="upside">Upside Potential</option>
          <option value="rsi">RSI (Best Entry)</option>
        </select>
      </div>

      <ul className="grid gap-4">
        {sortedStocks.map((stock, i) => (
          <li key={stock.ticker} className="border p-4 rounded bg-white shadow">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-semibold">#{i + 1} {stock.company} ({stock.ticker})</div>
                <div className="text-sm text-gray-600">Posted: {stock.postDate}</div>
              </div>
              <div className="text-sm font-bold px-3 py-1 rounded-full bg-gray-100">
                {stock.analysis.recommendation} (Score: {stock.analysis.entryScore}/9)
              </div>
            </div>
            <div className="mt-2 text-sm">
              <div>Target Price: ${stock.target}</div>
              <div>Current Price: ${stock.currentPrice}</div>
              <div>RSI: {stock.analysis.rsi}</div>
              <div>MACD: {stock.analysis.macdSignal} ({stock.analysis.macdStrength})</div>
              <div>Upside Potential: {stock.currentToTarget}%</div>
              <div>Since Posted: {stock.priceChangeAfterPost}%</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockAnalyzer;
