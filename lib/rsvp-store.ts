// In-memory RSVP storage
export interface RSVPEntry {
  id: string;
  guestName: string;
  attending: 'yes' | 'no' | 'maybe';
  numberOfGuests: number;
  additionalGuests: string;
  dietaryRestrictions: string;
  createdAt: Date;
}

// In-memory database
let rsvpDatabase: RSVPEntry[] = [];

export const rsvpStore = {
  addRSVP(entry: Omit<RSVPEntry, 'id' | 'createdAt'>) {
    const newEntry: RSVPEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    rsvpDatabase.push(newEntry);
    return newEntry;
  },

  getAllRSVPs() {
    return rsvpDatabase;
  },

  getRSVPById(id: string) {
    return rsvpDatabase.find((entry) => entry.id === id);
  },

  updateRSVP(id: string, updates: Partial<Omit<RSVPEntry, 'id' | 'createdAt'>>) {
    const index = rsvpDatabase.findIndex((entry) => entry.id === id);
    if (index !== -1) {
      rsvpDatabase[index] = { ...rsvpDatabase[index], ...updates };
      return rsvpDatabase[index];
    }
    return null;
  },

  deleteRSVP(id: string) {
    rsvpDatabase = rsvpDatabase.filter((entry) => entry.id !== id);
  },

  getSummary() {
    const summary = {
      totalResponses: rsvpDatabase.length,
      confirmed: rsvpDatabase.filter((r) => r.attending === 'yes').length,
      declined: rsvpDatabase.filter((r) => r.attending === 'no').length,
      maybe: rsvpDatabase.filter((r) => r.attending === 'maybe').length,
      totalGuests: rsvpDatabase.reduce((sum, r) => sum + (r.attending === 'yes' ? 1 + r.numberOfGuests : 0), 0),
    };
    return summary;
  },
};
