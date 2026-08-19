'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check, Sparkles, ExternalLink } from 'lucide-react';

interface QRGeneratorProps {
  slug: string;
  name: string;
  baseUrl?: string;
}

export default function QRGenerator({ slug, name, baseUrl }: QRGeneratorProps) {
  const [theme, setTheme] = useState<'emerald' | 'dark' | 'classic'>('emerald');
  const [copied, setCopied] = useState(false);
  const [qrMatrix, setQrMatrix] = useState<boolean[][]>([]);
  const [matrixSize, setMatrixSize] = useState(21);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const fullUrl = `${baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://saarthi-travel.app')}/qr/${slug}`;

  // Theme color palettes
  const themes = {
    emerald: { bg: '#064E3B', fg: '#10B981', cardBg: '#022C22', text: '#ECFDF5', accent: '#34D399' },
    dark: { bg: '#0F172A', fg: '#38BDF8', cardBg: '#1E293B', text: '#F8FAFC', accent: '#7DD3FC' },
    classic: { bg: '#FFFFFF', fg: '#0F172A', cardBg: '#F8FAFC', text: '#0F172A', accent: '#059669' },
  };

  const activeTheme = themes[theme];

  // Generate ISO-Compliant QR Code Matrix using 'qrcode' library with High Error Correction ('H')
  useEffect(() => {
    try {
      const qrData = QRCode.create(fullUrl, { errorCorrectionLevel: 'H' });
      const modules = qrData.modules;
      const size = modules.size;
      const data = modules.data;

      const grid: boolean[][] = [];
      for (let r = 0; r < size; r++) {
        const row: boolean[] = [];
        for (let c = 0; c < size; c++) {
          row.push(Boolean(data[r * size + c]));
        }
        grid.push(row);
      }

      setQrMatrix(grid);
      setMatrixSize(size);
    } catch (err) {
      console.error('Failed to generate compliant QR Code:', err);
    }
  }, [fullUrl]);

  function copyLink() {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadPNG() {
    if (!svgRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));

    img.onload = () => {
      ctx.drawImage(img, 0, 0, 1200, 1200);
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `saarthi-qr-${slug}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
  }

  function downloadSVG() {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `saarthi-qr-${slug}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  const cellSize = 200 / (matrixSize || 21);
  const centerModuleSize = Math.floor(matrixSize * 0.28);
  const centerStart = Math.floor((matrixSize - centerModuleSize) / 2);
  const centerEnd = centerStart + centerModuleSize;

  return (
    <div style={{
      backgroundColor: activeTheme.cardBg,
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      padding: '24px',
      color: activeTheme.text,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
    }}>
      {/* Header & Theme Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: activeTheme.accent, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={12} /> Standard ISO-Compliant Marketing QR
          </span>
          <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '2px 0 0 0' }}>{name}</h3>
        </div>

        <div style={{ display: 'flex', gap: '4px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '10px' }}>
          <button
            onClick={() => setTheme('emerald')}
            style={{
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: theme === 'emerald' ? '#10B981' : 'transparent',
              color: theme === 'emerald' ? '#FFFFFF' : '#94A3B8',
            }}
          >
            Emerald
          </button>
          <button
            onClick={() => setTheme('dark')}
            style={{
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: theme === 'dark' ? '#38BDF8' : 'transparent',
              color: theme === 'dark' ? '#0F172A' : '#94A3B8',
            }}
          >
            Dark
          </button>
          <button
            onClick={() => setTheme('classic')}
            style={{
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: theme === 'classic' ? '#FFFFFF' : 'transparent',
              color: theme === 'classic' ? '#0F172A' : '#94A3B8',
            }}
          >
            Light
          </button>
        </div>
      </div>

      {/* High-Precision SVG Render */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundColor: activeTheme.bg,
        borderRadius: '16px',
        margin: '0 auto 20px auto',
        maxWidth: '280px',
      }}>
        <svg
          ref={svgRef}
          viewBox="0 0 250 250"
          width="220"
          height="220"
          style={{ display: 'block', borderRadius: '8px' }}
        >
          <defs>
            <linearGradient id="logoSunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="logoHillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EAB308" />
              <stop offset="50%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <linearGradient id="logoRoadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFDF0" />
              <stop offset="40%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <clipPath id={`saarthiPinClip-${slug}`}>
              <path d="M 50 6 C 28 6 10 24 10 48 C 10 72 44 94 50 98 C 56 94 90 72 90 48 C 90 24 72 6 50 6 Z" />
            </clipPath>
          </defs>

          {/* Background */}
          <rect width="250" height="250" fill={activeTheme.bg} rx="12" />

          {/* Standard ISO Matrix Modules */}
          <g transform="translate(25, 25)">
            {qrMatrix.map((row, r) =>
              row.map((cell, c) => {
                // Clear out center area for logo emblem
                const isCenterZone = r >= centerStart && r < centerEnd && c >= centerStart && c < centerEnd;
                if (!cell || isCenterZone) return null;

                return (
                  <rect
                    key={`${r}-${c}`}
                    x={c * cellSize}
                    y={r * cellSize}
                    width={cellSize * 0.96}
                    height={cellSize * 0.96}
                    rx={cellSize * 0.15}
                    fill={activeTheme.fg}
                  />
                );
              })
            )}

            {/* Official Saarthi Brand Map Pin Logo Badge */}
            <g transform={`translate(${100 - 28}, ${100 - 28})`}>
              {/* Outer Badge Disc */}
              <rect x="0" y="0" width="56" height="56" rx="16" fill={activeTheme.cardBg} stroke={activeTheme.fg} strokeWidth="2.5" />
              
              {/* Map Pin Vector Emblem */}
              <g transform="translate(7, 5) scale(0.42)">
                {/* Map Pin Dark Navy Outer Frame */}
                <path
                  d="M 50 2 C 23.5 2 4 23.5 4 50 C 4 77 43 101 50 105 C 57 101 96 77 96 50 C 96 23.5 76.5 2 50 2 Z"
                  fill="#07192C"
                />

                {/* Clipped Pin Interior */}
                <g clipPath={`url(#saarthiPinClip-${slug})`}>
                  {/* 1. Cream / Ivory Sky Background */}
                  <rect x="0" y="0" width="100" height="110" fill="#FAF5EC" />

                  {/* 2. Golden Sun */}
                  <circle cx="50" cy="36" r="17" fill="url(#logoSunGrad)" />

                  {/* 3. Rolling Golden Hills (Middleground) */}
                  <path
                    d="M -5 54 C 20 40 42 46 65 44 C 80 43 90 47 105 52 L 105 110 L -5 110 Z"
                    fill="url(#logoHillGrad)"
                  />

                  {/* 4. Deep Dark Navy Foreground Landscape */}
                  <path
                    d="M -5 50 C 25 58 45 46 105 58 L 105 110 L -5 110 Z"
                    fill="#07192C"
                  />

                  {/* 5. S-Curved Winding Golden Road */}
                  <path
                    d="M 40 102 C 45 88 23 76 44 60 C 52 54 46 49 50 47 C 54 49 58 54 53 60 C 35 74 57 86 54 102 Z"
                    fill="url(#logoRoadGrad)"
                  />
                </g>
              </g>
            </g>
          </g>
        </svg>

        <div style={{ marginTop: '14px', fontSize: '11px', fontWeight: 600, color: activeTheme.text, opacity: 0.8, letterSpacing: '0.5px' }}>
          SCAN: saarthi-travel.app/qr/{slug}
        </div>
      </div>

      {/* Copy & Export Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
        <button
          onClick={copyLink}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            padding: '10px 8px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: activeTheme.text,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>

        <button
          onClick={downloadSVG}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            padding: '10px 8px',
            borderRadius: '12px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            color: '#38BDF8',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Download size={14} />
          <span>Vector SVG</span>
        </button>

        <button
          onClick={downloadPNG}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            padding: '10px 8px',
            borderRadius: '12px',
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          }}
        >
          <Download size={14} />
          <span>High-Res PNG</span>
        </button>
      </div>
    </div>
  );
}
