export type PayrunStatus = 'draft' | 'finalized';

export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  currency: string;
  html?: string; // optional HTML payload for payslip
}

export interface Payrun {
  id: string;
  companyId: string;
  period: string; // YYYY-MM
  name: string;
  createdAt: string;
  status: PayrunStatus;
  payslips: Payslip[];
}

const STORAGE_KEY = 'nexgen_payruns_v1';

function loadAll(): Payrun[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Payrun[];
  } catch (e) {
    console.warn('Failed to load payruns from localStorage', e);
    return [];
  }
}

function saveAll(payruns: Payrun[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payruns));
}

export const payrunService = {
  list(companyId?: string) {
    const all = loadAll();
    return companyId ? all.filter(p => p.companyId === companyId) : all;
  },

  get(id: string) {
    return loadAll().find(p => p.id === id) || null;
  },

  createDraft(companyId: string, period: string, name?: string, payslips: Payslip[] = []): Payrun {
    const all = loadAll();

    // Prevent exact duplicate: same companyId, period and name
    if (all.some(p => p.companyId === companyId && p.period === period && p.name === (name || 'Payrun'))) {
      throw new Error('A payrun with the same name already exists for this period and company');
    }

    const payrun: Payrun = {
      id: `pr_${Date.now()}`,
      companyId,
      period,
      name: name || `Payrun ${period}`,
      createdAt: new Date().toISOString(),
      status: 'draft',
      payslips,
    };

    all.push(payrun);
    saveAll(all);
    return payrun;
  },

  finalize(id: string) {
    const all = loadAll();
    const idx = all.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Payrun not found');
    all[idx].status = 'finalized';
    saveAll(all);
    return all[idx];
  },

  delete(id: string) {
    const all = loadAll();
    const remaining = all.filter(p => p.id !== id);
    saveAll(remaining);
    return true;
  },

  update(id: string, updates: Partial<Payrun>) {
    const all = loadAll();
    const idx = all.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Payrun not found');
    all[idx] = { ...all[idx], ...updates };
    saveAll(all);
    return all[idx];
  }
};
