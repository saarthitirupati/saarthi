import React from 'react';
import LiveCardSection from '../sections/LiveCardSection';
import BestRightNowSection from '../sections/BestRightNowSection';
import EssentialsQuickSection from '../sections/EssentialsQuickSection';
import ContextStripSection from '../sections/ContextStripSection';
import SearchBarSection from '../sections/SearchBarSection';
import DecisionCardsSection from '../sections/DecisionCardsSection';
import ExperiencesSection from '../sections/ExperiencesSection';
import QuickToReachSection from '../sections/QuickToReachSection';
import HiddenGemsSection from '../sections/HiddenGemsSection';
import NoticeSection from '../sections/NoticeSection';
import CommonMistakesSection from '../sections/CommonMistakesSection';
import JourneySection from '../sections/JourneySection';
import EmergencySection from '../sections/EmergencySection';
import QuickGuidesSection from '../sections/QuickGuidesSection';
import ContactsSection from '../sections/ContactsSection';
import UnknownSection from '../sections/UnknownSection';

export default function SectionRenderer({ section }: { section: any }) {
  switch (section.type) {
    case 'live_card':
      return <LiveCardSection section={section} />;
    case 'best_right_now':
      return <BestRightNowSection section={section} />;
    case 'essentials_quick':
      return <EssentialsQuickSection section={section} />;
    case 'context_strip':
      return <ContextStripSection section={section} />;
    case 'search_bar':
      return <SearchBarSection section={section} />;
    case 'decision_cards':
      return <DecisionCardsSection section={section} />;
    case 'experiences':
      return <ExperiencesSection section={section} />;
    case 'quick_to_reach':
      return <QuickToReachSection section={section} />;
    case 'hidden_gems':
      return <HiddenGemsSection section={section} />;
    case 'notice':
      return <NoticeSection section={section} />;
    case 'common_mistakes':
      return <CommonMistakesSection section={section} />;
    case 'journey':
      return <JourneySection section={section} />;
    case 'emergency':
      return <EmergencySection section={section} />;
    case 'quick_guides':
      return <QuickGuidesSection section={section} />;
    case 'contacts':
      return <ContactsSection section={section} />;
    default:
      return <UnknownSection section={section} />;
  }
}

