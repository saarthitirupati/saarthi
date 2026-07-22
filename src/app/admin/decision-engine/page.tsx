'use client';

import React, { useState, useEffect } from 'react';
import { Sliders, Play, Save, Check, RefreshCw, Shield, Sparkles, AlertTriangle, Layers } from 'lucide-react';
import styles from './DecisionEngine.module.css';

export default function AdminDecisionEnginePage() {
  const [weights, setWeights] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Simulation State
  const [simWeather, setSimWeather] = useState<'sunny' | 'rain' | 'cloudy' | 'heatwave'>('rain');
  const [simCrowd, setSimCrowd] = useState<'low' | 'moderate' | 'high' | 'extreme'>('extreme');
  const [simTimeHour, setSimTimeHour] = useState<number>(9);
  const [simDay, setSimDay] = useState<string>('friday');
  const [simStage, setSimStage] = useState<'before_darshan' | 'after_darshan' | 'returning'>('before_darshan');
  const [simResults, setSimResults] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    fetch('/api/admin/decision-engine')
      .then(res => res.json())
      .then(data => {
        if (data.weights) setWeights(data.weights);
        if (data.rules) setRules(data.rules);
      })
      .catch(() => {});
  }, []);

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/decision-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weights, rules })
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      alert('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleRunSimulation = async () => {
    setSimulating(true);
    try {
      const res = await fetch('/api/admin/decision-engine/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weather: simWeather,
          liveCrowdStatus: simCrowd,
          timeHour: simTimeHour,
          dayOfWeek: simDay,
          journeyStage: simStage
        })
      });
      const data = await res.json();
      setSimResults(data);
    } catch {
      alert('Simulation error');
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <Sliders size={24} color="#7C3AED" /> Decision Engine v1.0.0
          </h1>
          <p className={styles.subtitle}>
            Manage recommendation scoring weights, configurable rules, and run live simulation sandboxes.
          </p>
        </div>
        <button className={styles.saveBtn} onClick={handleSaveConfig} disabled={saving}>
          {savedSuccess ? <Check size={16} /> : <Save size={16} />}
          {saving ? 'Saving...' : savedSuccess ? 'Config Saved!' : 'Save Configuration'}
        </button>
      </header>

      <div className={styles.grid}>
        {/* LEFT COLUMN: SIMULATION SANDBOX */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Play size={18} color="#E9801D" />
            <h2 className={styles.cardTitle}>Simulation Sandbox</h2>
          </div>
          <p className={styles.cardDesc}>
            Test how recommendations adapt to different real-world weather, crowd, and time scenarios without touching production.
          </p>

          <div className={styles.formGroup}>
            <label className={styles.label}>Weather Condition</label>
            <select value={simWeather} onChange={(e) => setSimWeather(e.target.value as any)} className={styles.select}>
              <option value="sunny">☀️ Sunny & Pleasant</option>
              <option value="rain">🌧️ Heavy Rain</option>
              <option value="heatwave">🔥 Heatwave</option>
              <option value="cloudy">☁️ Overcast / Cloudy</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Live Crowd Level</label>
            <select value={simCrowd} onChange={(e) => setSimCrowd(e.target.value as any)} className={styles.select}>
              <option value="low">🟢 Low Crowd</option>
              <option value="moderate">🟡 Moderate Crowd</option>
              <option value="high">🟠 High Crowd</option>
              <option value="extreme">🔴 Extreme Crowd</option>
            </select>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Time of Day (Hour: {simTimeHour}:00)</label>
              <input 
                type="range" 
                min="0" 
                max="23" 
                value={simTimeHour} 
                onChange={(e) => setSimTimeHour(Number(e.target.value))} 
                className={styles.range} 
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Day of Week</label>
              <select value={simDay} onChange={(e) => setSimDay(e.target.value)} className={styles.select}>
                <option value="monday">Monday (Shiva)</option>
                <option value="friday">Friday (Goddess)</option>
                <option value="saturday">Saturday (Venkateswara)</option>
                <option value="sunday">Sunday</option>
              </select>
            </div>
          </div>

          <button className={styles.simBtn} onClick={handleRunSimulation} disabled={simulating}>
            <RefreshCw size={16} className={simulating ? styles.spin : ''} />
            {simulating ? 'Calculating Scores...' : 'Run Simulation Preview'}
          </button>

          {/* SIMULATION RESULTS PREVIEW */}
          {simResults && simResults.sections && (
            <div className={styles.simOutputBox}>
              <h3 className={styles.simHeader}>
                <Sparkles size={16} color="#7C3AED" /> Simulated Results (Engine v{simResults.meta?.engineVersion})
              </h3>
              {simResults.sections.map((sec: any) => (
                <div key={sec.id} className={styles.simSection}>
                  <h4 className={styles.simSecTitle}>{sec.title}</h4>
                  <div className={styles.simList}>
                    {sec.items.map((item: any) => (
                      <div key={item.id} className={styles.simItem}>
                        <div className={styles.simItemMain}>
                          <span className={styles.simRank}>#{item.rank}</span>
                          <span className={styles.simName}>{item.name}</span>
                          <span className={styles.simConf}>{item.confidence}% Confidence</span>
                        </div>
                        <div className={styles.simReasons}>
                          {item.reasons.map((r: any, idx: number) => (
                            <span key={idx} className={styles.reasonTag}>
                              ✓ {r.label} <small>({r.source})</small>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: SCORING WEIGHTS & RULE BUILDER */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Layers size={18} color="#2563EB" />
            <h2 className={styles.cardTitle}>Configurable Rules & Weights</h2>
          </div>
          <p className={styles.cardDesc}>
            Adjust active rule modifiers and scoring tiers. Changes sync instantly across all user sessions.
          </p>

          <div className={styles.rulesList}>
            {rules.map((rule) => (
              <div key={rule.id} className={styles.ruleCard}>
                <div className={styles.ruleTop}>
                  <span className={styles.ruleTag}>{rule.condition_type.toUpperCase()} = {rule.condition_value}</span>
                  <span className={styles.ruleModifier} style={{ color: rule.score_modifier >= 0 ? '#16A34A' : '#DC2626' }}>
                    {rule.score_modifier >= 0 ? `+${rule.score_modifier}` : rule.score_modifier} pts
                  </span>
                </div>
                <p className={styles.ruleTemplate}>{rule.reason_template} <small>({rule.source_attribution})</small></p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
