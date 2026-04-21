import { v4 as uuidv4 } from 'uuid';

// Device identity — generated once, persisted forever in localStorage
export function getDeviceId() {
  let id = localStorage.getItem('cigarhub_device_id');
  if (!id) {
    id = uuidv4();
    localStorage.setItem('cigarhub_device_id', id);
  }
  return id;
}

// Personal data — scoped to this device only
export const local = {
  get(key) {
    try { return JSON.parse(localStorage.getItem(`ch_${key}`)); }
    catch { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(`ch_${key}`, JSON.stringify(value)); }
    catch {}
  },
  remove(key) {
    localStorage.removeItem(`ch_${key}`);
  }
};

// Shared data — uses a simple JSON "database" stored in localStorage under a
// shared key. In a future version this will be replaced with a real backend
// (e.g. Supabase) so data is truly shared across all users. For now it is
// per-device but the code is structured to make that swap easy.
export const shared = {
  get(key) {
    try { return JSON.parse(localStorage.getItem(`ch_shared_${key}`)); }
    catch { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(`ch_shared_${key}`, JSON.stringify(value)); }
    catch {}
  }
};
