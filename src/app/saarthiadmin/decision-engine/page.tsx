'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sliders, Play, Save, Check, RefreshCw, Sparkles, Layers, ToggleLeft, ToggleRight, Plus, Minus } from 'lucide-react';
import styles from './DecisionEngine.module.css';

export default function AdminDecisionEnginePage() {
  const [weights, setWeights] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Simulation State
  const [simWeather, setSimWeather] = useState<'sunny' | 'rain' | 'cloudy' | 'heatwave'>('rain');
  const [simCrowd, setSimCrowd] = useState<'low' | 'moderate' | 'high' | 'extreme'>('extreme');
  const [simTimeHour, setSimTimeHour] = useState<number>(9);
  const [simDay, setSimDay] = useState<string>('friday');
  const [simStage, setSimStage] = useState<'before_darshan' | 'after_darshan' | 'returning'>('before_darshan');
  const [simResults, setSimResults] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/decision-engine?t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (data.weights) setWeights(data.weights);
        if (data.rules) setRules(data.rules);
        setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (e) {
      console.error('Failed to fetch decision engine config:', e);
    }
  }, []);

  const handleRunSimulation = useCallback(async () => {
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
      console.error('Simulation error');
    } finally {
      setSimulating(false);
    }
  }, [simWeather, simCrowd, simTimeHour, simDay, simStage]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // Run initial simulation once page loads
  useEffect(() => {
    handleRunSimulation();
  }, [handleRunSimulation]);

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
      handleRunSimulation();
    } catch {
      alert('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const toggleRuleEnabled = (id: string) => {
    setRules(prev => prev.map(r => {
      if (r.id === id) {
        const currentEnabled = r.isEnabled !== undefined ? r.isEnabled : r.enabled;
        return { ...r, isEnabled: !currentEnabled, enabled: !currentEnabled };
      }
      return r;
    }));
  };

  const updateRuleWeight = (id: string, delta: number) => {
    setRules(prev => prev.map(r => {
      if (r.id === id) {
        const currentWeight = r.weight !== undefined ? Number(r.weight) : Number(r.score_modifier || 0);
        const newWeight = Math.max(-100, Math.min(100, currentWeight + delta));
        return { ...r, weight: newWeight, score_modifier: newWeight };
      }
      return r;
    }));
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            fontSize: '11.5px',
            fontWeight: 800,
            color: '#16A34A',
            background: '#DCFCE7',
            border: '1px solid #86EFAC',
            padding: '5px 12px',
            borderRadius: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
            Live Sync {lastUpdated && `· ${lastUpdated}`}
          </span>
          <button className={styles.saveBtn} onClick={handleSaveConfig} disabled={saving}>
            {savedSuccess ? <Check size={16} /> : <Save size={16} />}
            {saving ? 'Saving...' : savedSuccess ? 'Config Saved!' : 'Save Configuration'}
          </button>
        </div>
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
              <option value="sunny">Sunny & Pleasant</option>
              <option value="rain">Heavy Rain</option>
              <option value="heatwave">Heatwave</option>
              <option value="cloudy">Overcast / Cloudy</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Live Crowd Level</label>
            <select value={simCrowd} onChange={(e) => setSimCrowd(e.target.value as any)} className={styles.select}>
              <option value="low">Low Crowd</option>
              <option value="moderate">Moderate Crowd</option>
              <option value="high">High Crowd</option>
              <option value="extreme">Extreme Crowd</option>
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
                <Sparkles size={16} color="#7C3AED" /> Simulated Results (Engine v{simResults.meta?.engineVersion || '1.0.0'})
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
            Adjust active rule modifiers and scoring tiers. Changes sync instantly across all user recommendation sessions.
          </p>

          <div className={styles.rulesList}>
            {rules.map((rule) => {
              const ruleId = rule.id;
              const condType = (rule.context || rule.condition_type || rule.category || rule.name || 'Rule').toString();
              const condVal = rule.condition_value || rule.value || rule.target || 'Active';
              const mod = rule.weight !== undefined ? Number(rule.weight) : Number(rule.score_modifier || 0);
              const isEnabled = rule.isEnabled !== undefined ? rule.isEnabled : (rule.enabled !== false);
              const priority = rule.priority ? `P${rule.priority}` : '';

              return (
                <div key={ruleId} className={styles.ruleCard} style={{ opacity: isEnabled ? 1 : 0.6, transition: 'all 0.2s' }}>
                  <div className={styles.ruleTop}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button 
                        onClick={() => toggleRuleEnabled(ruleId)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                        title={isEnabled ? 'Disable Rule' : 'Enable Rule'}
                      >
                        {isEnabled ? <ToggleRight size={22} color="#16A34A" /> : <ToggleLeft size={22} color="#94A3B8" />}
                      </button>
                      <span className={styles.ruleTag}>
                        {condType} {condVal !== 'Active' ? `= ${condVal}` : ''} {priority && `(${priority})`}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button 
                        onClick={() => updateRuleWeight(ruleId, -5)}
                        style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '4px', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 800 }}
                        title="Decrease weight by 5"
                      >
                        -
                      </button>
                      <span className={styles.ruleModifier} style={{ color: mod >= 0 ? '#16A34A' : '#DC2626', minWidth: '48px', textAlign: 'center' }}>
                        {mod >= 0 ? `+${mod}` : mod} pts
                      </span>
                      <button 
                        onClick={() => updateRuleWeight(ruleId, 5)}
                        style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '4px', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 800 }}
                        title="Increase weight by 5"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className={styles.ruleTemplate}>
                    {rule.reason_template || rule.description || `${condType} scoring rule modifier`} 
                    {rule.source_attribution && <small> ({rule.source_attribution})</small>}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

