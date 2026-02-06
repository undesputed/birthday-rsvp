'use client';

import { useCallback, useEffect, useState } from 'react';
import { RSVPEntry } from '@/lib/rsvp-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

function computeSummary(rsvps: RSVPEntry[]) {
  return {
    totalResponses: rsvps.length,
    confirmed: rsvps.filter((r) => r.attending === 'yes').length,
    declined: rsvps.filter((r) => r.attending === 'no').length,
    maybe: rsvps.filter((r) => r.attending === 'maybe').length,
    totalGuests: rsvps.reduce((sum, r) => sum + (r.attending === 'yes' ? 1 + r.numberOfGuests : 0), 0),
  };
}

type UpdateFormState = {
  guestName: string;
  attending: 'yes' | 'no' | 'maybe';
  numberOfGuests: number;
  additionalGuests: string;
  dietaryRestrictions: string;
};

export default function AdminPage() {
  const [rsvps, setRsvps] = useState<RSVPEntry[]>([]);
  const [summary, setSummary] = useState(computeSummary([]));
  const [error, setError] = useState<string | null>(null);
  const [editingRsvp, setEditingRsvp] = useState<RSVPEntry | null>(null);
  const [updateForm, setUpdateForm] = useState<UpdateFormState>({
    guestName: '',
    attending: 'yes',
    numberOfGuests: 0,
    additionalGuests: '',
    dietaryRestrictions: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

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

  const openUpdateDialog = (rsvp: RSVPEntry) => {
    setUpdateError(null);
    setEditingRsvp(rsvp);
    setUpdateForm({
      guestName: rsvp.guestName,
      attending: rsvp.attending,
      numberOfGuests: rsvp.numberOfGuests ?? 0,
      additionalGuests: rsvp.additionalGuests ?? '',
      dietaryRestrictions: rsvp.dietaryRestrictions ?? '',
    });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRsvp) return;
    if (!updateForm.guestName.trim()) {
      setUpdateError('Name is required');
      return;
    }
    setUpdateError(null);
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/rsvp?id=${encodeURIComponent(editingRsvp.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: updateForm.guestName.trim(),
          attending: updateForm.attending,
          numberOfGuests: updateForm.numberOfGuests,
          additionalGuests: updateForm.additionalGuests,
          dietaryRestrictions: updateForm.dietaryRestrictions,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? 'Failed to update');
      }
      await fetchRsvps();
      setEditingRsvp(null);
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update RSVP');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({
      ...prev,
      [name]: name === 'numberOfGuests' ? Math.max(0, Math.min(5, parseInt(value, 10) || 0)) : value,
    }));
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
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-foreground">
                    Additional Guests
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
                      <td className="hidden sm:table-cell px-2 sm:px-6 py-3 sm:py-4 text-foreground/80 text-xs sm:text-base whitespace-pre-wrap break-words max-w-xs">
                        {rsvp.attending === 'yes' && rsvp.numberOfGuests > 0
                          ? rsvp.additionalGuests && rsvp.additionalGuests.trim().length > 0
                            ? `${rsvp.numberOfGuests} guest${rsvp.numberOfGuests !== 1 ? 's' : ''}: ${rsvp.additionalGuests}`
                            : `${rsvp.numberOfGuests} guest${rsvp.numberOfGuests !== 1 ? 's' : ''}`
                          : '—'}
                      </td>
                      <td className="px-2 sm:px-6 py-3 sm:py-4">
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                          <Button
                            onClick={() => openUpdateDialog(rsvp)}
                            variant="ghost"
                            className="text-primary hover:text-primary/90 hover:bg-primary/10 text-xs sm:text-base py-1 sm:py-2 px-2 sm:px-3"
                          >
                            Update
                          </Button>
                          <Button
                            onClick={() => handleDelete(rsvp.id)}
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-100 text-xs sm:text-base py-1 sm:py-2 px-2 sm:px-3"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Update RSVP Dialog */}
        <Dialog open={!!editingRsvp} onOpenChange={(open) => !open && setEditingRsvp(null)}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Update RSVP</DialogTitle>
              <DialogDescription>
                Edit the guest details below and save to update this RSVP.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {updateError && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-800 rounded-lg text-sm">
                  {updateError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="edit-guestName">Name *</Label>
                <Input
                  id="edit-guestName"
                  name="guestName"
                  value={updateForm.guestName}
                  onChange={handleUpdateFormChange}
                  placeholder="Guest name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Attending</Label>
                <div className="flex flex-wrap gap-3">
                  {(['yes', 'no', 'maybe'] as const).map((value) => (
                    <label key={value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="attending"
                        value={value}
                        checked={updateForm.attending === value}
                        onChange={handleUpdateFormChange}
                        className="rounded border-input accent-primary"
                      />
                      <span className="text-sm font-medium capitalize">{value}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-numberOfGuests">Additional guests</Label>
                <select
                  id="edit-numberOfGuests"
                  name="numberOfGuests"
                  value={updateForm.numberOfGuests}
                  onChange={handleUpdateFormChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'guest' : 'guests'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-additionalGuests">Names of additional guests</Label>
                <Textarea
                  id="edit-additionalGuests"
                  name="additionalGuests"
                  value={updateForm.additionalGuests}
                  onChange={handleUpdateFormChange}
                  placeholder="One per line"
                  rows={2}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-dietaryRestrictions">Dietary restrictions</Label>
                <Textarea
                  id="edit-dietaryRestrictions"
                  name="dietaryRestrictions"
                  value={updateForm.dietaryRestrictions}
                  onChange={handleUpdateFormChange}
                  placeholder="Optional"
                  rows={2}
                  className="resize-none"
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingRsvp(null)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? 'Saving…' : 'Save changes'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
