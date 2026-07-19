'use client';

import { useState, useEffect } from 'react';
import {} from 'next/navigation';

export default function AdminLivePage() {
  const [metrics, setMetrics] = useState({
    crowd_wait_minutes: 45,
    crowd_level: 'Moderate',
    sarva_darshan_wait: '16-20 hours',
    special_entry_wait: '3-5 hours',
    divya_darshan_wait: '1-1.5 hours',
    srivani_darshan_wait: 'Depends on slot',
    parking_status: 'Available',
    parking_location: 'Near Alipiri',
    next_bus_minutes: 12});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/v1/live-status')
      .then(res => res.json())
      .then(data => {
        setMetrics({
          crowd_wait_minutes: data.crowd.waitMinutes,
          crowd_level: data.crowd.status,
          sarva_darshan_wait: data.crowd.sarvaDarshan,
          special_entry_wait: data.crowd.specialEntry,
          divya_darshan_wait: data.crowd.divyaDarshan,
          srivani_darshan_wait: data.crowd.srivaniTrust,
          parking_status: data.parking.status,
          parking_location: data.parking.location,
          next_bus_minutes: data.transit.nextRtcBusMinutes});
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetrics(prev => ({
      ...prev,
      [name]: name.includes('minutes') ? parseInt(value) || 0 : value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics)
      });
      if (res.ok) {
        setMessage('Successfully updated live metrics!');
      } else {
        setMessage('Failed to update.');
      }
    } catch {
      setMessage('Error updating metrics.');
    }
    setSaving(false);
  };

  if (loading) return <div className="p-10 text-center">Loading Admin Panel...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Saarthi Admin: Live Metrics</h1>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tirumala Crowd Wait (Primary Score - Minutes)</label>
          <input 
            type="number" 
            name="crowd_wait_minutes"
            value={metrics.crowd_wait_minutes}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Overall Crowd Level</label>
          <select 
            name="crowd_level"
            value={metrics.crowd_level}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 bg-white"
          >
            <option value="Low">Low</option>
            <option value="Moderate">Moderate</option>
            <option value="High">High</option>
            <option value="Extreme">Extreme</option>
          </select>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 space-y-4">
          <h2 className="font-bold text-orange-800">Detailed Darshan Timings</h2>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sarva Darshan (Free)</label>
            <input 
              type="text" 
              name="sarva_darshan_wait"
              value={metrics.sarva_darshan_wait}
              onChange={handleChange}
              placeholder="e.g. 16-20 hours"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Special Entry (Rs. 300)</label>
            <input 
              type="text" 
              name="special_entry_wait"
              value={metrics.special_entry_wait}
              onChange={handleChange}
              placeholder="e.g. 3-5 hours"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Divya Darshan (Footpath)</label>
            <input 
              type="text" 
              name="divya_darshan_wait"
              value={metrics.divya_darshan_wait}
              onChange={handleChange}
              placeholder="e.g. 1-1.5 hours"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Time Slot Sarva Darshan (SSD Tokens)</label>
            <input 
              type="text" 
              name="srivani_darshan_wait"
              value={metrics.srivani_darshan_wait}
              onChange={handleChange}
              placeholder="e.g. Depends on slot"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Next RTC Bus (Minutes)</label>
          <input 
            type="number" 
            name="next_bus_minutes"
            value={metrics.next_bus_minutes}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Parking Status</label>
          <select 
            name="parking_status"
            value={metrics.parking_status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 bg-white"
          >
            <option value="Available">Available</option>
            <option value="Limited">Limited</option>
            <option value="Full">Full</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Parking Location Info</label>
          <input 
            type="text" 
            name="parking_location"
            value={metrics.parking_location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3"
          />
        </div>

        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          {saving ? 'Saving...' : 'Push Live Updates'}
        </button>

        {message && (
          <div className={`p-4 rounded-lg text-sm font-semibold ${message.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
