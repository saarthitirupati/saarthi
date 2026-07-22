import React from 'react';

export default function ErrorRenderer() {
  return (
    <div className="px-4 py-12 text-center">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong.</h2>
      <p className="text-gray-500 mb-6">We couldn't load the content right now.</p>
      <button 
        onClick={() => window.location.reload()}
        className="bg-emerald-600 text-white px-6 py-2 rounded-full font-medium"
      >
        Try Again
      </button>
    </div>
  );
}
