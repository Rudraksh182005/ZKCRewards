import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function App() {
  const [bobFee, setBobFee] = useState(25);
  const [bobCycles, setBobCycles] = useState(10);
  const [totalTokens, setTotalTokens] = useState(1000);
  const [rewardFrequency, setRewardFrequency] = useState(1);
  const [pointRate, setPointRate] = useState(1);
  const [stakingAmount, setStakingAmount] = useState(0);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const simulate = () => {
    const bobRewardPct = Math.min(bobFee, bobCycles);
    const charlieRewardPct = Math.min(100 - bobFee, 100 - bobCycles);
    const totalRewardPct = bobRewardPct + charlieRewardPct;
    const totalDistributed = (totalRewardPct / 100) * totalTokens;
    const burned = totalTokens - totalDistributed;

    const bobZKC = (bobRewardPct / 100) * totalTokens;
    const charlieZKC = (charlieRewardPct / 100) * totalTokens;
    const bobPoints = bobZKC * pointRate * rewardFrequency;
    const charliePoints = charlieZKC * pointRate * rewardFrequency;
    const stakingBonus = stakingAmount > 0 ? stakingAmount * 0.05 : 0;

    const newResult = {
      bobZKC,
      charlieZKC,
      burned,
      bobPoints,
      charliePoints,
      stakingBonus,
      timestamp: new Date().toLocaleString(),
    };

    setResult(newResult);
    setHistory((prev) => [newResult, ...prev]);
  };

  const exportCSV = () => {
    if (!result) return;

    const headers = [
      "Timestamp",
      "BobZKC",
      "CharlieZKC",
      "Burned",
      "BobPoints",
      "CharliePoints",
      "StakingBonus",
    ];
    const rows = history.map((res) =>
      [
        res.timestamp,
        res.bobZKC.toFixed(2),
        res.charlieZKC.toFixed(2),
        res.burned.toFixed(2),
        res.bobPoints.toFixed(2),
        res.charliePoints.toFixed(2),
        res.stakingBonus.toFixed(2),
      ].join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zkc_simulation_history.csv";
    a.click();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>$ZKC Reward Simulator</h1>

      <div style={styles.form}>
        <label>Bob's Fee Contribution (%)</label>
        <input type="number" value={bobFee} onChange={(e) => setBobFee(+e.target.value)} style={styles.input} />

        <label>Bob's Cycle Contribution (%)</label>
        <input type="number" value={bobCycles} onChange={(e) => setBobCycles(+e.target.value)} style={styles.input} />

        <label>Total Tokens to Distribute</label>
        <input type="number" value={totalTokens} onChange={(e) => setTotalTokens(+e.target.value)} style={styles.input} />

        <label>Reward Frequency (per epoch)</label>
        <input type="number" value={rewardFrequency} onChange={(e) => setRewardFrequency(+e.target.value)} style={styles.input} />

        <label>Point Rate (points per token)</label>
        <input type="number" value={pointRate} onChange={(e) => setPointRate(+e.target.value)} style={styles.input} />

        <label>Staking Amount ($ZKC)</label>
        <input type="number" value={stakingAmount} onChange={(e) => setStakingAmount(+e.target.value)} style={styles.input} />

        <button onClick={simulate} style={styles.button}>Simulate</button>
        {history.length > 0 && (
          <button onClick={exportCSV} style={{ ...styles.button, backgroundColor: "#10b981" }}>Export CSV</button>
        )}
      </div>

      {result && (
        <div style={styles.results}>
          <h2>Simulation Results</h2>
          <p><strong>Bob's Reward:</strong> {result.bobZKC.toFixed(2)} $ZKC</p>
          <p><strong>Charlie's Reward:</strong> {result.charlieZKC.toFixed(2)} $ZKC</p>
          <p><strong>Burned Tokens:</strong> {result.burned.toFixed(2)} $ZKC</p>
          <p><strong>Bob's Points:</strong> {result.bobPoints.toFixed(2)}</p>
          <p><strong>Charlie's Points:</strong> {result.charliePoints.toFixed(2)}</p>
          <p><strong>Staking Bonus:</strong> {result.stakingBonus.toFixed(2)} $ZKC</p>

          <div style={{ width: "100%", height: 300, marginTop: 20 }}>
            <ResponsiveContainer>
              <BarChart data={[
                { name: "Bob", value: result.bobPoints },
                { name: "Charlie", value: result.charliePoints },
                { name: "Burned", value: result.burned }
              ]}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h2>Saved Simulations</h2>
          <ul>
            {history.map((r, i) => (
              <li key={i}>
                [{r.timestamp}] Bob: {r.bobZKC.toFixed(1)} / Charlie: {r.charlieZKC.toFixed(1)} / Burned: {r.burned.toFixed(1)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "auto",
    padding: "2rem",
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1.5rem",
    color: "#111827",
  },
  form: {
    display: "grid",
    gap: "0.75rem",
  },
  input: {
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
  },
  button: {
    padding: "0.75rem",
    fontSize: "1rem",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    cursor: "pointer",
    marginTop: "1rem",
  },
  results: {
    marginTop: "2rem",
  },
};
