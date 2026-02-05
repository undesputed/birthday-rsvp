'use client';

import { useCallback, useEffect, useState } from 'react';
import { RSVPEntry } from '@/lib/rsvp-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function computeSummary(rsvps: RSVPEntry[]) {
  return {
    totalResponses: rsvps.length,
    confirmed: rsvps.filter((r) => r.attending === 'yes').length,
    declined: rsvps.filter((r) => r.attending === 'no').length,
    maybe: rsvps.filter((r) => r.attending === 'maybe').length,
    totalGuests: rsvps.reduce((sum, r) => sum + (r.attending === 'yes' ? 1 + r.numberOfGuests : 0), 0),
  };
}

export default function AdminPage() {
  const [rsvps, setRsvps] = useState<RSVPEntry[]>([]);
  const [summary, setSummary] = useState(computeSummary([]));
  const [error, setError] = useState<string | null>(null);

  const fetchRsvps = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/rsvp');
      if (!res.ok) throw new Error('Failed to load RSVPs');
      const data = (await res.json()) as RSVPEntry[];
      setRsvps(Array.isArray(data) ? data : []);
      setSummary(computeSummary(Array.isArray(data) ? data : []));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load RSVPs');
    }
  }, []);

  useEffect(() => {
    fetchRsvps();
    const interval = setInterval(fetchRsvps, 3000);
    return () => clearInterval(interval);
  }, [fetchRsvps]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this RSVP?')) return;
    try {
      const res = await fetch(`/api/rsvp?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setRsvps((prev) => {
        const next = prev.filter((r) => r.id !== id);
        setSummary(computeSummary(next));
        return next;
      });
    } catch {
      setError('Failed to delete RSVP');
    }
  };

  const getAttendingBadgeColor = (attending: string) => {
    switch (attending) {
      case 'yes':
        return 'bg-green-100 text-green-800';
      case 'no':
        return 'bg-red-100 text-red-800';
      case 'maybe':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="min-h-screen bg-background p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8">RSVP Dashboard</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <Card className="p-2 sm:p-4 bg-primary/10 border-primary">
            <p className="text-xs sm:text-sm text-foreground/70 mb-1">Total Responses</p>
            <p className="text-2xl sm:text-3xl font-bold text-primary">{summary.totalResponses}</p>
          </Card>
          <Card className="p-2 sm:p-4 bg-green-100 border-green-400">
            <p className="text-xs sm:text-sm text-green-800 mb-1">Confirmed</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-700">{summary.confirmed}</p>
          </Card>
          <Card className="p-2 sm:p-4 bg-red-100 border-red-400">
            <p className="text-xs sm:text-sm text-red-800 mb-1">Declined</p>
            <p className="text-2xl sm:text-3xl font-bold text-red-700">{summary.declined}</p>
          </Card>
          <Card className="p-2 sm:p-4 bg-yellow-100 border-yellow-400">
            <p className="text-xs sm:text-sm text-yellow-800 mb-1">Maybe</p>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-700">{summary.maybe}</p>
          </Card>
          <Card className="p-2 sm:p-4 bg-accent/10 border-accent">
            <p className="text-xs sm:text-sm text-foreground/70 mb-1">Total Guests</p>
            <p className="text-2xl sm:text-3xl font-bold text-accent">{summary.totalGuests}</p>
          </Card>
        </div>

        {/* RSVP List */}
        <Card className="border-2 border-primary/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary/10">
                <tr>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-foreground">
                    Name
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="hidden sm:table-cell px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-foreground">
                    Additional Guests
                  </th>
                  <th className="hidden md:table-cell px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-foreground">
                    Dietary Notes
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {rsvps.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-2 sm:px-6 py-6 sm:py-8 text-center text-foreground/60 text-xs sm:text-base">
                      No RSVPs yet. Responses will appear here.
                    </td>
                  </tr>
                ) : (
                  rsvps.map((rsvp) => (
                    <tr key={rsvp.id} className="border-t border-border hover:bg-secondary/30">
                      <td className="px-2 sm:px-6 py-3 sm:py-4 text-foreground font-medium text-xs sm:text-base">{rsvp.guestName}</td>
                      <td className="px-2 sm:px-6 py-3 sm:py-4">
                        <span
                          className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium capitalize ${getAttendingBadgeColor(
                            rsvp.attending
                          )}`}
                        >
                          {rsvp.attending}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-2 sm:px-6 py-3 sm:py-4 text-foreground/80 text-xs sm:text-base">
                        {rsvp.attending === 'yes' && rsvp.numberOfGuests > 0
                          ? `${rsvp.numberOfGuests} guest${rsvp.numberOfGuests !== 1 ? 's' : ''}`
                          : '—'}
                      </td>
                      <td className="hidden md:table-cell px-2 sm:px-6 py-3 sm:py-4 text-foreground/80 max-w-xs truncate text-xs sm:text-base">
                        {rsvp.dietaryRestrictions || '—'}
                      </td>
                      <td className="px-2 sm:px-6 py-3 sm:py-4">
                        <Button
                          onClick={() => handleDelete(rsvp.id)}
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-100 text-xs sm:text-base py-1 sm:py-2 px-2 sm:px-3"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  );
}
