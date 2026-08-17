'use client';

import React, { useState } from 'react';
import { Sun, Moon, Clock, Calendar, Sparkles, X, ChevronRight, Compass, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { getPanchangamData, PanchangamData } from '@/lib/panchangam';
import { useLanguage } from '@/lib/useLanguage';
import styles from './PanchangamBar.module.css';

export function PanchangamBar() {
  const lang = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const data: PanchangamData = getPanchangamData();

  const isTelugu = lang === 'te';

  return (
    <>
      {/* Mini Divine Panchangam Strip */}
      <section 
        className={styles.barContainer}
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={isTelugu ? 'నేటి పంచాంగం చూడండి' : "View Today's Vedic Panchangam"}
      >
        <div className={styles.barGlow} />
        <div className={styles.barContent}>
          <div className={styles.badgeSection}>
            <span className={styles.omSymbol}>🕉️</span>
            <div className={styles.tithiBadge}>
              <span className={styles.tithiTitle}>
                {isTelugu ? data.tithiTe : data.tithiEn}
              </span>
              <span className={styles.pakshaSubtitle}>
                {isTelugu ? data.pakshaTe : data.pakshaEn}
              </span>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.infoPills}>
            <div className={styles.infoPill}>
              <Sparkles size={13} className={styles.starIcon} />
              <span>{isTelugu ? data.nakshatraTe : data.nakshatraEn}</span>
            </div>

            <div className={styles.infoPill}>
              <Clock size={13} className={styles.clockIcon} />
              <span>
                <strong className={styles.rahuLabel}>{isTelugu ? 'రాహు:' : 'Rahu:'}</strong> {data.rahuKalam.split('–')[0]?.trim()}
              </span>
            </div>
          </div>

          <div className={styles.actionArrow}>
            <span className={styles.viewDetailsText}>
              {isTelugu ? 'పంచాంగం' : 'Panchangam'}
            </span>
            <ChevronRight size={14} />
          </div>
        </div>
      </section>

      {/* Expanded Vedic Panchangam Modal */}
      {isOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div 
            className={styles.modalCard} 
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div className={styles.headerTitleGroup}>
                <div className={styles.headerIconWrap}>🕉️</div>
                <div>
                  <h3 className={styles.modalHeading}>
                    {isTelugu ? 'నేటి శ్రీవారి తిరుమల పంచాంగం' : "Today's Tirumala Vedic Panchangam"}
                  </h3>
                  <p className={styles.modalSubheading}>
                    {isTelugu ? `${data.vaaramTe}, ${data.date}` : `${data.vaaramEn}, ${data.date}`}
                  </p>
                </div>
              </div>
              <button 
                className={styles.closeBtn} 
                onClick={() => setIsOpen(false)}
                aria-label="Close Panchangam"
              >
                <X size={18} />
              </button>
            </div>

            {/* Srivari Day Significance Banner */}
            <div className={`${styles.significanceCard} ${data.isAuspiciousDay ? styles.auspiciousGlow : ''}`}>
              <div className={styles.significanceHeader}>
                <Sparkles size={16} className={styles.goldenStar} />
                <span className={styles.significanceTitle}>
                  {isTelugu ? 'నేటి విశిష్టత & శ్రీవారి సేవ' : "Today's Sacred Significance"}
                </span>
              </div>
              <p className={styles.significanceText}>
                {isTelugu ? data.srivariSignificanceTe : data.srivariSignificanceEn}
              </p>
            </div>

            {/* Panchangam 5 Core Elements Grid */}
            <div className={styles.grid}>
              {/* Tithi */}
              <div className={styles.gridItem}>
                <span className={styles.itemLabel}>
                  <Moon size={14} className={styles.itemIcon} />
                  {isTelugu ? 'తిథి & పక్షం' : 'Tithi & Paksha'}
                </span>
                <span className={styles.itemValue}>
                  {isTelugu ? `${data.tithiTe} (${data.pakshaTe})` : `${data.tithiEn} (${data.pakshaEn})`}
                </span>
              </div>

              {/* Nakshatram */}
              <div className={styles.gridItem}>
                <span className={styles.itemLabel}>
                  <Sparkles size={14} className={styles.itemIcon} />
                  {isTelugu ? 'నక్షత్రం' : 'Nakshatram'}
                </span>
                <span className={styles.itemValue}>
                  {isTelugu ? data.nakshatraTe : data.nakshatraEn}
                  {data.isSravanaNakshatra && (
                    <span className={styles.sravanaTag}>
                      {isTelugu ? 'శ్రీవారి జన్మ నక్షత్రం' : 'Srivari Star'}
                    </span>
                  )}
                </span>
              </div>

              {/* Vaaram */}
              <div className={styles.gridItem}>
                <span className={styles.itemLabel}>
                  <Calendar size={14} className={styles.itemIcon} />
                  {isTelugu ? 'వారం (వాసరము)' : 'Vaaram (Weekday)'}
                </span>
                <span className={styles.itemValue}>
                  {isTelugu ? data.vaaramTe : data.vaaramEn}
                </span>
              </div>

              {/* Abhijit Muhurtham (Auspicious) */}
              <div className={`${styles.gridItem} ${styles.auspiciousItem}`}>
                <span className={styles.itemLabel}>
                  <CheckCircle2 size={14} className={styles.goodIcon} />
                  {isTelugu ? 'అభిజిత్ ముహూర్తం (శుభ సమయం)' : 'Abhijit Muhurtham (Auspicious)'}
                </span>
                <span className={styles.itemValueGood}>{data.abhijitMuhurtham}</span>
              </div>

              {/* Rahu Kalam (Inauspicious) */}
              <div className={`${styles.gridItem} ${styles.cautionItem}`}>
                <span className={styles.itemLabel}>
                  <ShieldAlert size={14} className={styles.cautionIcon} />
                  {isTelugu ? 'రాహు కాలం (వర్జ్యం)' : 'Rahu Kalam (Avoid starting travel)'}
                </span>
                <span className={styles.itemValueCaution}>{data.rahuKalam}</span>
              </div>

              {/* Yamagandam */}
              <div className={styles.gridItem}>
                <span className={styles.itemLabel}>
                  <Clock size={14} className={styles.itemIcon} />
                  {isTelugu ? 'యమగండం' : 'Yamagandam'}
                </span>
                <span className={styles.itemValue}>{data.yamagandam}</span>
              </div>

              {/* Gulika Kalam */}
              <div className={styles.gridItem}>
                <span className={styles.itemLabel}>
                  <Compass size={14} className={styles.itemIcon} />
                  {isTelugu ? 'గుళిక కాలం' : 'Gulika Kalam'}
                </span>
                <span className={styles.itemValue}>{data.gulikaKalam}</span>
              </div>

              {/* Sunrise & Sunset */}
              <div className={styles.gridItem}>
                <span className={styles.itemLabel}>
                  <Sun size={14} className={styles.itemIcon} />
                  {isTelugu ? 'సూర్యోదయం / సూర్యాస్తమయం' : 'Sunrise / Sunset'}
                </span>
                <span className={styles.itemValue}>{data.sunrise} / {data.sunset}</span>
              </div>
            </div>

            {/* Pilgrim Guidance Tip */}
            <div className={styles.modalFooter}>
              <p className={styles.footerNote}>
                {isTelugu 
                  ? '💡 యాత్రికుల సూచన: తిరుమల కొండపైకి నడక లేదా ప్రయాణం ప్రారంభించేందుకు అభిజిత్ ముహూర్తం అత్యంత శుభప్రదమైనది.'
                  : '💡 Pilgrim Tip: Abhijit Muhurtham (midday) is considered ideal for commencing the uphill footpath trek or darshan line.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
