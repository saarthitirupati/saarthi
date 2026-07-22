import React from 'react';

export default function UnknownSection({ section }: { section: any }) {
  // In production, we might log this to telemetry or Sentry to know we received an unknown section type
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl my-4">
        <p className="text-red-600 font-semibold text-sm">Unknown Section Type: {section.type}</p>
        <p className="text-red-500 text-xs mt-1">This won't be shown in production.</p>
      </div>
    );
  }
  
  // Fail gracefully by rendering nothing
  return null;
}
