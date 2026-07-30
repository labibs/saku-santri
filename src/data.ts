export type Role = 'admin' | 'tu' | 'parent'
export type Page = 'dashboard' | 'students' | 'billing' | 'dues' | 'savings' | 'cash' | 'reports' | 'settings'
export type InvoiceStatus = 'paid' | 'unpaid' | 'pending'
export type CashType = 'in' | 'out'
export type SavingType = 'deposit' | 'withdrawal'

export interface Student {
  id: string
  nis: string
  name: string
  className: string
  guardian: string
  phone: string
  status: 'active' | 'inactive'
  initials: string
  color: string
}

export interface Invoice {
  id: string
  studentId: string
  period: string
  dueDate: string
  amount: number
  status: InvoiceStatus
  paidAt?: string
  method?: string
  receipt?: string
}

export interface CashEntry {
  id: string
  date: string
  description: string
  category: string
  type: CashType
  amount: number
  ref?: string
  officer: string
}

export interface Contribution {
  id: string
  name: string
  description: string
  amount: number
  dueDate: string
  category: string
  status: 'active' | 'closed'
}

export interface ContributionPayment {
  id: string
  contributionId: string
  studentId: string
  status: InvoiceStatus
  paidAt?: string
  method?: string
  receipt?: string
}

export interface SavingEntry {
  id: string
  studentId: string
  date: string
  type: SavingType
  amount: number
  description: string
  ref: string
  officer: string
}

export interface BrandingSettings {
  appLogo?: string
  favicon?: string
  schoolLogo?: string
}

export interface AppData {
  students: Student[]
  invoices: Invoice[]
  cashEntries: CashEntry[]
  contributions: Contribution[]
  contributionPayments: ContributionPayment[]
  savingEntries: SavingEntry[]
  branding: BrandingSettings
}

const students: Student[] = [
  { id: 's1', nis: '230101', name: 'Ahmad Fadhil', className: '7A', guardian: 'Budi Santoso', phone: '0812-3456-7801', status: 'active', initials: 'AF', color: '#dbeafe' },
  { id: 's2', nis: '230102', name: 'Aisyah Humaira', className: '7A', guardian: 'Siti Aminah', phone: '0813-8821-1140', status: 'active', initials: 'AH', color: '#fce7f3' },
  { id: 's3', nis: '220201', name: 'Muhammad Rayyan', className: '8B', guardian: 'Hendra Wijaya', phone: '0821-5634-9020', status: 'active', initials: 'MR', color: '#dcfce7' },
  { id: 's4', nis: '220204', name: 'Nabila Zahra', className: '8A', guardian: 'Dewi Lestari', phone: '0812-9791-4508', status: 'active', initials: 'NZ', color: '#ede9fe' },
  { id: 's5', nis: '210306', name: 'Fauzan Akbar', className: '9A', guardian: 'Yusuf Akbar', phone: '0857-2309-6671', status: 'active', initials: 'FA', color: '#ffedd5' },
  { id: 's6', nis: '210309', name: 'Salma Nurfadila', className: '9B', guardian: 'Rahmawati', phone: '0819-4472-8870', status: 'active', initials: 'SN', color: '#cffafe' },
  { id: 's7', nis: '230111', name: 'Rafi Al Ghifari', className: '7B', guardian: 'M. Arifin', phone: '0822-1511-2670', status: 'active', initials: 'RG', color: '#fef3c7' },
  { id: 's8', nis: '220218', name: 'Hana Safitri', className: '8B', guardian: 'Nur Hidayah', phone: '0838-7821-9091', status: 'inactive', initials: 'HS', color: '#f1f5f9' },
]

const invoiceSeed = [
  ['i1', 's1', 'Juli 2026', '2026-07-10', 650000, 'unpaid'],
  ['i2', 's2', 'Juli 2026', '2026-07-10', 650000, 'paid', '2026-07-03', 'Transfer Bank', 'SPP-260703-019'],
  ['i3', 's3', 'Juli 2026', '2026-07-10', 650000, 'paid', '2026-07-02', 'Tunai', 'SPP-260702-014'],
  ['i4', 's4', 'Juli 2026', '2026-07-10', 650000, 'pending', '2026-07-06', 'Transfer Bank', 'SPP-260706-028'],
  ['i5', 's5', 'Juli 2026', '2026-07-10', 650000, 'unpaid'],
  ['i6', 's6', 'Juli 2026', '2026-07-10', 650000, 'paid', '2026-07-01', 'QRIS', 'SPP-260701-008'],
  ['i7', 's7', 'Juli 2026', '2026-07-10', 650000, 'paid', '2026-07-04', 'Transfer Bank', 'SPP-260704-023'],
  ['i8', 's1', 'Juni 2026', '2026-06-10', 650000, 'paid', '2026-06-08', 'Transfer Bank', 'SPP-260608-104'],
  ['i9', 's2', 'Juni 2026', '2026-06-10', 650000, 'paid', '2026-06-05', 'Transfer Bank', 'SPP-260605-088'],
  ['i10', 's3', 'Juni 2026', '2026-06-10', 650000, 'paid', '2026-06-09', 'Tunai', 'SPP-260609-116'],
] as const

const invoices: Invoice[] = invoiceSeed.map((item) => ({
  id: item[0],
  studentId: item[1],
  period: item[2],
  dueDate: item[3],
  amount: item[4],
  status: item[5],
  paidAt: item[6],
  method: item[7],
  receipt: item[8],
}))

const cashEntries: CashEntry[] = [
  { id: 'k-iuran-1', date: '2026-07-28', description: 'Iuran Haul Akbar — Ahmad Fadhil', category: 'Iuran', type: 'in', amount: 150000, ref: 'IUR-260728-031', officer: 'Nur Aini' },
  { id: 'k-tab-1', date: '2026-07-26', description: 'Setoran tabungan — Ahmad Fadhil', category: 'Tabungan Santri', type: 'in', amount: 300000, ref: 'TAB-260726-021', officer: 'Nur Aini' },
  { id: 'k-tab-2', date: '2026-07-22', description: 'Penarikan tabungan — Fauzan Akbar', category: 'Tabungan Santri', type: 'out', amount: 100000, ref: 'TAR-260722-015', officer: 'Nur Aini' },
  { id: 'k1', date: '2026-07-06', description: 'Pembayaran SPP Nabila Zahra', category: 'SPP', type: 'in', amount: 650000, ref: 'SPP-260706-028', officer: 'Nur Aini' },
  { id: 'k2', date: '2026-07-05', description: 'Pembelian ATK kantor', category: 'Operasional', type: 'out', amount: 475000, ref: 'KEL-260705-006', officer: 'Nur Aini' },
  { id: 'k3', date: '2026-07-04', description: 'Pembayaran SPP Rafi Al Ghifari', category: 'SPP', type: 'in', amount: 650000, ref: 'SPP-260704-023', officer: 'Nur Aini' },
  { id: 'k4', date: '2026-07-03', description: 'Pembayaran SPP Aisyah Humaira', category: 'SPP', type: 'in', amount: 650000, ref: 'SPP-260703-019', officer: 'Nur Aini' },
  { id: 'k5', date: '2026-07-03', description: 'Perawatan pompa air asrama', category: 'Pemeliharaan', type: 'out', amount: 850000, ref: 'KEL-260703-004', officer: 'Nur Aini' },
  { id: 'k6', date: '2026-07-02', description: 'Pembayaran SPP Muhammad Rayyan', category: 'SPP', type: 'in', amount: 650000, ref: 'SPP-260702-014', officer: 'Nur Aini' },
  { id: 'k7', date: '2026-07-01', description: 'Pembayaran SPP Salma Nurfadila', category: 'SPP', type: 'in', amount: 650000, ref: 'SPP-260701-008', officer: 'Nur Aini' },
  { id: 'k8', date: '2026-07-01', description: 'Pembayaran listrik bulan Juni', category: 'Utilitas', type: 'out', amount: 1250000, ref: 'KEL-260701-002', officer: 'Nur Aini' },
  { id: 'k9', date: '2026-06-30', description: 'Saldo awal kas bulan Juli', category: 'Saldo Awal', type: 'in', amount: 18750000, ref: 'SAL-260630', officer: 'Ahmad Hasyim' },
]

const contributions: Contribution[] = [
  { id: 'c1', name: 'Iuran Haul Akbar 2026', description: 'Partisipasi kegiatan haul pengasuh dan temu alumni.', amount: 150000, dueDate: '2026-08-15', category: 'Kegiatan Pondok', status: 'active' },
  { id: 'c2', name: 'Iuran Imtihan Semester Genap', description: 'Kebutuhan pelaksanaan ujian dan pembagian rapor.', amount: 200000, dueDate: '2026-06-20', category: 'Akademik', status: 'closed' },
]

const contributionPayments: ContributionPayment[] = [
  { id: 'cp1', contributionId: 'c1', studentId: 's1', status: 'paid', paidAt: '2026-07-28', method: 'Transfer Bank', receipt: 'IUR-260728-031' },
  { id: 'cp2', contributionId: 'c1', studentId: 's2', status: 'paid', paidAt: '2026-07-27', method: 'Tunai', receipt: 'IUR-260727-029' },
  { id: 'cp3', contributionId: 'c1', studentId: 's3', status: 'pending', paidAt: '2026-07-29', method: 'Transfer Bank' },
  { id: 'cp4', contributionId: 'c1', studentId: 's4', status: 'unpaid' },
  { id: 'cp5', contributionId: 'c1', studentId: 's5', status: 'unpaid' },
  { id: 'cp6', contributionId: 'c1', studentId: 's6', status: 'unpaid' },
  { id: 'cp7', contributionId: 'c1', studentId: 's7', status: 'unpaid' },
  { id: 'cp8', contributionId: 'c2', studentId: 's1', status: 'paid', paidAt: '2026-06-12', method: 'Transfer Bank', receipt: 'IUR-260612-122' },
  { id: 'cp9', contributionId: 'c2', studentId: 's2', status: 'paid', paidAt: '2026-06-10', method: 'Tunai', receipt: 'IUR-260610-114' },
  { id: 'cp10', contributionId: 'c2', studentId: 's3', status: 'paid', paidAt: '2026-06-11', method: 'Tunai', receipt: 'IUR-260611-119' },
  { id: 'cp11', contributionId: 'c2', studentId: 's4', status: 'paid', paidAt: '2026-06-13', method: 'QRIS', receipt: 'IUR-260613-130' },
  { id: 'cp12', contributionId: 'c2', studentId: 's5', status: 'paid', paidAt: '2026-06-14', method: 'Transfer Bank', receipt: 'IUR-260614-138' },
  { id: 'cp13', contributionId: 'c2', studentId: 's6', status: 'paid', paidAt: '2026-06-13', method: 'Tunai', receipt: 'IUR-260613-132' },
  { id: 'cp14', contributionId: 'c2', studentId: 's7', status: 'paid', paidAt: '2026-06-15', method: 'Tunai', receipt: 'IUR-260615-141' },
]

const savingEntries: SavingEntry[] = [
  { id: 'sv1', studentId: 's1', date: '2026-07-26', type: 'deposit', amount: 300000, description: 'Setoran tabungan Juli', ref: 'TAB-260726-021', officer: 'Nur Aini' },
  { id: 'sv2', studentId: 's1', date: '2026-06-18', type: 'deposit', amount: 250000, description: 'Setoran tabungan Juni', ref: 'TAB-260618-188', officer: 'Nur Aini' },
  { id: 'sv3', studentId: 's2', date: '2026-07-25', type: 'deposit', amount: 400000, description: 'Setoran tabungan Juli', ref: 'TAB-260725-019', officer: 'Nur Aini' },
  { id: 'sv4', studentId: 's3', date: '2026-07-24', type: 'deposit', amount: 200000, description: 'Setoran tabungan Juli', ref: 'TAB-260724-017', officer: 'Nur Aini' },
  { id: 'sv5', studentId: 's4', date: '2026-07-23', type: 'deposit', amount: 350000, description: 'Setoran tabungan Juli', ref: 'TAB-260723-016', officer: 'Nur Aini' },
  { id: 'sv6', studentId: 's5', date: '2026-07-20', type: 'deposit', amount: 500000, description: 'Setoran awal tabungan', ref: 'TAB-260720-012', officer: 'Nur Aini' },
  { id: 'sv7', studentId: 's5', date: '2026-07-22', type: 'withdrawal', amount: 100000, description: 'Keperluan perlengkapan santri', ref: 'TAR-260722-015', officer: 'Nur Aini' },
  { id: 'sv8', studentId: 's6', date: '2026-07-19', type: 'deposit', amount: 275000, description: 'Setoran tabungan Juli', ref: 'TAB-260719-010', officer: 'Nur Aini' },
  { id: 'sv9', studentId: 's7', date: '2026-07-18', type: 'deposit', amount: 150000, description: 'Setoran tabungan Juli', ref: 'TAB-260718-009', officer: 'Nur Aini' },
]

export const seedData: AppData = { students, invoices, cashEntries, contributions, contributionPayments, savingEntries, branding: {} }

export const monthlyChart = [
  { month: 'Feb', masuk: 27400000, keluar: 19200000 },
  { month: 'Mar', masuk: 30200000, keluar: 21800000 },
  { month: 'Apr', masuk: 28800000, keluar: 23100000 },
  { month: 'Mei', masuk: 33500000, keluar: 24700000 },
  { month: 'Jun', masuk: 31200000, keluar: 22600000 },
  { month: 'Jul', masuk: 27800000, keluar: 20500000 },
]

export const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)

export const formatDate = (value?: string) => {
  if (!value) return '—'
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`))
}

export const shortRupiah = (value: number) => `${Math.round(value / 1000000)} jt`
