import { ComponentType, FormEvent, ReactNode, useEffect, useState } from 'react'
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Coins,
  Download,
  FileBarChart,
  HelpCircle,
  Home,
  HandCoins,
  ImageUp,
  Landmark,
  LogOut,
  Menu,
  MoreHorizontal,
  Plus,
  ReceiptText,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Trash2,
  UserRound,
  Users,
  WalletCards,
  X,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  AppData,
  CashEntry,
  CashType,
  Contribution,
  ContributionPayment,
  Invoice,
  InvoiceStatus,
  Page,
  Role,
  SavingEntry,
  SavingType,
  formatDate,
  formatRupiah,
  monthlyChart,
  seedData,
  shortRupiah,
} from './data'

const STORAGE_KEY = 'sakusantri-demo-v1'
const createId = (prefix: string) => `${prefix}${Date.now()}`
type IconComponent = ComponentType<{ size?: string | number; className?: string }>

const roleInfo: Record<Role, { name: string; label: string; initials: string }> = {
  admin: { name: 'Ahmad Hasyim', label: 'Administrator', initials: 'AH' },
  tu: { name: 'Nur Aini', label: 'Petugas TU', initials: 'NA' },
  parent: { name: 'Budi Santoso', label: 'Wali Santri', initials: 'BS' },
}

const navItems: { page: Page; label: string; icon: IconComponent; roles: Role[] }[] = [
  { page: 'dashboard', label: 'Ringkasan', icon: Home, roles: ['admin', 'tu', 'parent'] },
  { page: 'students', label: 'Data Santri', icon: Users, roles: ['admin', 'tu'] },
  { page: 'billing', label: 'Tagihan SPP', icon: ReceiptText, roles: ['admin', 'tu', 'parent'] },
  { page: 'dues', label: 'Iuran', icon: HandCoins, roles: ['admin', 'tu', 'parent'] },
  { page: 'savings', label: 'Tabungan Santri', icon: Coins, roles: ['admin', 'tu', 'parent'] },
  { page: 'cash', label: 'Buku Kas', icon: WalletCards, roles: ['admin', 'tu'] },
  { page: 'reports', label: 'Laporan', icon: FileBarChart, roles: ['admin', 'tu'] },
  { page: 'settings', label: 'Pengaturan', icon: Settings, roles: ['admin'] },
]

const pageMeta: Record<Page, { title: string; subtitle: string }> = {
  dashboard: { title: 'Assalamu’alaikum 👋', subtitle: 'Berikut ringkasan keuangan hari ini.' },
  students: { title: 'Data Santri', subtitle: 'Kelola data santri dan informasi wali santri.' },
  billing: { title: 'Tagihan SPP', subtitle: 'Pantau tagihan dan pembayaran SPP santri.' },
  dues: { title: 'Iuran Pondok', subtitle: 'Kelola iuran kegiatan di luar SPP secara transparan.' },
  savings: { title: 'Tabungan Santri', subtitle: 'Kelola setoran, penarikan, dan saldo tabungan santri.' },
  cash: { title: 'Buku Kas', subtitle: 'Catat seluruh arus kas masuk dan keluar.' },
  reports: { title: 'Laporan Keuangan', subtitle: 'Rekapitulasi keuangan pondok secara transparan.' },
  settings: { title: 'Pengaturan', subtitle: 'Atur profil lembaga dan preferensi sistem.' },
}

function App() {
  const [role, setRole] = useState<Role | null>(null)
  const [page, setPage] = useState<Page>('dashboard')
  const [mobileNav, setMobileNav] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return seedData
    try {
      const parsed = JSON.parse(saved) as Partial<AppData>
      return {
        ...seedData,
        ...parsed,
        contributions: parsed.contributions ?? seedData.contributions,
        contributionPayments: parsed.contributionPayments ?? seedData.contributionPayments,
        savingEntries: parsed.savingEntries ?? seedData.savingEntries,
        branding: parsed.branding ?? seedData.branding,
      }
    } catch {
      return seedData
    }
  })
  const [toast, setToast] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  useEffect(() => {
    let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (!favicon) {
      favicon = document.createElement('link')
      favicon.rel = 'icon'
      document.head.appendChild(favicon)
    }
    favicon.href = data.branding.favicon || data.branding.appLogo || '/favicon.svg'
  }, [data.branding.appLogo, data.branding.favicon])

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }

  const login = (nextRole: Role) => {
    setRole(nextRole)
    setPage('dashboard')
  }

  const switchRole = (nextRole: Role) => {
    setRole(nextRole)
    setPage('dashboard')
    setProfileOpen(false)
    notify(`Masuk sebagai ${roleInfo[nextRole].label}`)
  }

  if (!role) return <Login onLogin={login} branding={data.branding} />

  const meta = pageMeta[page]
  const user = roleInfo[role]

  return (
    <div className="app-shell">
      <Sidebar
        role={role}
        page={page}
        branding={data.branding}
        open={mobileNav}
        onClose={() => setMobileNav(false)}
        onNavigate={(next) => {
          setPage(next)
          setMobileNav(false)
        }}
      />

      <main className="main">
        <header className="topbar">
          <button className="icon-btn menu-btn" aria-label="Buka menu" onClick={() => setMobileNav(true)}>
            <Menu size={21} />
          </button>
          <div className="topbar-title">
            <strong>{page === 'dashboard' ? 'Dashboard' : meta.title}</strong>
            <span>TA 2026/2027</span>
          </div>
          <div className="global-search">
            <Search size={17} />
            <input aria-label="Pencarian global" placeholder="Cari santri, transaksi, atau laporan..." />
          </div>
          <div className="top-actions">
            <button className="icon-btn notification-btn" aria-label="Notifikasi">
              <Bell size={19} />
              <i />
            </button>
            <div className="profile-wrap">
              <button className="profile-button" onClick={() => setProfileOpen((value) => !value)}>
                <span className="avatar">{user.initials}</span>
                <span className="profile-copy"><strong>{user.name}</strong><small>{user.label}</small></span>
                <ChevronDown size={16} />
              </button>
              {profileOpen && (
                <div className="profile-menu">
                  <p>Tampilan demo sebagai</p>
                  {(['admin', 'tu', 'parent'] as Role[]).map((item) => (
                    <button key={item} className={item === role ? 'active' : ''} onClick={() => switchRole(item)}>
                      <span>{roleInfo[item].initials}</span>
                      <div><strong>{roleInfo[item].label}</strong><small>{roleInfo[item].name}</small></div>
                      {item === role && <Check size={15} />}
                    </button>
                  ))}
                  <hr />
                  <button onClick={() => setRole(null)}><LogOut size={17} /> Keluar dari akun</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="content">
          <div className="page-heading">
            <div><h1>{role === 'parent' && page === 'dashboard' ? 'Assalamu’alaikum, Pak Budi 👋' : meta.title}</h1><p>{role === 'parent' && page === 'dashboard' ? 'Pantau administrasi pendidikan Ahmad Fadhil di sini.' : meta.subtitle}</p></div>
            <div className="date-pill"><CalendarDays size={17} /> 30 Juli 2026</div>
          </div>

          {role === 'parent' ? (
            page === 'billing'
              ? <ParentBilling data={data} setData={setData} notify={notify} />
              : page === 'dues'
                ? <DuesPage role={role} data={data} setData={setData} notify={notify} />
                : page === 'savings'
                  ? <SavingsPage role={role} data={data} setData={setData} notify={notify} />
                  : <ParentDashboard data={data} onGoBilling={() => setPage('billing')} />
          ) : (
            <>
              {page === 'dashboard' && <StaffDashboard data={data} onNavigate={setPage} />}
              {page === 'students' && <StudentsPage data={data} setData={setData} notify={notify} />}
              {page === 'billing' && <BillingPage data={data} setData={setData} notify={notify} />}
              {page === 'dues' && <DuesPage role={role} data={data} setData={setData} notify={notify} />}
              {page === 'savings' && <SavingsPage role={role} data={data} setData={setData} notify={notify} />}
              {page === 'cash' && <CashPage data={data} setData={setData} notify={notify} />}
              {page === 'reports' && <ReportsPage data={data} notify={notify} />}
              {page === 'settings' && <SettingsPage data={data} setData={setData} notify={notify} />}
            </>
          )}
        </div>
      </main>

      {toast && <div className="toast"><span><Check size={15} /></span>{toast}</div>}
    </div>
  )
}

function Login({ onLogin, branding }: { onLogin: (role: Role) => void; branding: AppData['branding'] }) {
  const [selectedRole, setSelectedRole] = useState<Role>('admin')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="login-page">
      <div className="login-art">
        <div className="art-orb orb-one" /><div className="art-orb orb-two" />
        <div className="login-brand"><Logo light src={branding.appLogo} /><span>SakuSantri</span></div>
        <div className="art-copy">
          <div className="mini-badge"><Sparkles size={15} /> Administrasi lebih mudah</div>
          <h1>Satu tempat untuk<br />keuangan yang lebih <em>amanah.</em></h1>
          <p>Kelola SPP, arus kas, dan laporan pondok dengan rapi, transparan, dan mudah dipantau.</p>
          <div className="trust-row">
            <span><ShieldCheck size={18} /> Data terjaga</span>
            <span><BarChart3 size={18} /> Laporan real-time</span>
          </div>
        </div>
        <div className="quote-card">
          <div className="quote-icon">“</div>
          <p>Transparansi adalah awal dari kepercayaan.</p>
          <span>— Prinsip pengelolaan SakuSantri</span>
        </div>
      </div>
      <div className="login-panel">
        <div className="mobile-login-brand"><Logo src={branding.appLogo} /><span>SakuSantri</span></div>
        <div className="login-box">
          <div className="eyebrow">PORTAL KEUANGAN</div>
          <h2>Selamat datang kembali</h2>
          <p>Silakan masuk ke akun Anda untuk melanjutkan.</p>
          <div className="role-tabs">
            {(['admin', 'tu', 'parent'] as Role[]).map((item) => (
              <button key={item} className={selectedRole === item ? 'active' : ''} onClick={() => setSelectedRole(item)}>
                {item === 'admin' ? 'Admin' : item === 'tu' ? 'Petugas TU' : 'Wali Santri'}
              </button>
            ))}
          </div>
          <form onSubmit={(event) => { event.preventDefault(); onLogin(selectedRole) }}>
            <label>Email atau username</label>
            <div className="input-with-icon"><UserRound size={18} /><input defaultValue={selectedRole === 'parent' ? 'wali.ahmad' : selectedRole === 'tu' ? 'nur.aini' : 'admin'} /></div>
            <div className="label-row"><label>Kata sandi</label><button type="button">Lupa kata sandi?</button></div>
            <div className="input-with-icon"><ShieldCheck size={18} /><input type={showPassword ? 'text' : 'password'} defaultValue="demo12345" key={selectedRole} /><button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'Sembunyi' : 'Lihat'}</button></div>
            <button className="login-submit">Masuk ke SakuSantri <ArrowRight size={18} /></button>
          </form>
          <div className="demo-hint"><HelpCircle size={17} /><span><strong>Mode demo aktif.</strong> Pilih peran di atas, lalu klik masuk.</span></div>
        </div>
        <p className="login-footer">© 2026 SakuSantri · Sistem Keuangan Pondok</p>
      </div>
    </div>
  )
}

function Logo({ light = false, src }: { light?: boolean; src?: string }) {
  return <div className={`logo-mark ${light ? 'light' : ''} ${src ? 'has-image' : ''}`}>{src ? <img src={src} alt="Logo aplikasi" /> : <><BookOpen size={22} /><span /></>}</div>
}

function Sidebar({ role, page, branding, open, onClose, onNavigate }: { role: Role; page: Page; branding: AppData['branding']; open: boolean; onClose: () => void; onNavigate: (page: Page) => void }) {
  const [financeOpen, setFinanceOpen] = useState(false)
  const visibleItems = navItems.filter((item) => item.roles.includes(role))
  const financePages: Page[] = ['billing', 'dues', 'savings']
  const primaryItems = visibleItems.filter((item) => ['dashboard', 'students'].includes(item.page))
  const financeItems = visibleItems.filter((item) => financePages.includes(item.page))
  const utilityItems = visibleItems.filter((item) => !['dashboard', 'students', ...financePages].includes(item.page))
  const renderItem = (item: (typeof navItems)[number], nested = false) => {
    const Icon = item.icon
    return <button key={item.page} className={`${page === item.page ? 'active' : ''} ${nested ? 'nested' : ''}`} onClick={() => onNavigate(item.page)} title={item.label}><Icon size={nested ? 17 : 19} /><span>{item.label}</span>{item.page === 'billing' && role !== 'parent' && <i>3</i>}</button>
  }

  return (
    <>
      {open && <button className="nav-overlay" onClick={onClose} aria-label="Tutup menu" />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand"><Logo src={branding.appLogo} /><div><strong>SakuSantri</strong><small>SPP & Keuangan</small></div><button className="close-nav" onClick={onClose}><X size={19} /></button></div>
        <div className="school-chip"><div className={branding.schoolLogo ? 'has-image' : ''}>{branding.schoolLogo ? <img src={branding.schoolLogo} alt="Logo pondok" /> : <Landmark size={20} />}</div><span><small>Unit pendidikan</small><strong>Pondok Al-Hikmah</strong></span><ChevronDown size={15} /></div>
        <nav>
          <p>MENU UTAMA</p>
          {primaryItems.map((item) => renderItem(item))}
          <div className={`nav-group ${financePages.includes(page) ? 'active' : ''} ${financeOpen ? 'open' : ''}`}>
            <button className="nav-group-trigger" onClick={() => setFinanceOpen((value) => !value)} title="Keuangan Santri" aria-expanded={financeOpen}>
              <WalletCards size={19} /><span>Keuangan Santri</span><ChevronRight className="group-chevron" size={15} />
            </button>
            <div className="nav-submenu">{financeItems.map((item) => renderItem(item, true))}</div>
          </div>
          {utilityItems.map((item) => renderItem(item))}
        </nav>
        <div className="sidebar-help">
          <div><HelpCircle size={20} /></div>
          <strong>Butuh bantuan?</strong>
          <p>Tim kami siap membantu penggunaan sistem.</p>
          <button>Pusat Bantuan</button>
        </div>
        <div className="sidebar-version">SakuSantri v1.0</div>
      </aside>
    </>
  )
}

function StaffDashboard({ data, onNavigate }: { data: AppData; onNavigate: (page: Page) => void }) {
  const paid = data.invoices.filter((item) => item.period === 'Juli 2026' && item.status === 'paid')
  const unpaid = data.invoices.filter((item) => item.period === 'Juli 2026' && item.status !== 'paid')
  const cashIn = data.cashEntries.filter((item) => item.type === 'in').reduce((sum, item) => sum + item.amount, 0)
  const cashOut = data.cashEntries.filter((item) => item.type === 'out').reduce((sum, item) => sum + item.amount, 0)
  const cashBalance = cashIn - cashOut
  const sppCollected = paid.reduce((sum, item) => sum + item.amount, 0)
  const contributionCollected = data.contributionPayments.filter((item) => item.status === 'paid').reduce((sum, item) => sum + (data.contributions.find((value) => value.id === item.contributionId)?.amount ?? 0), 0)
  const savingsBalance = data.savingEntries.reduce((sum, item) => sum + (item.type === 'deposit' ? item.amount : -item.amount), 0)
  const activeStudents = data.students.filter((item) => item.status === 'active')
  const recent = data.cashEntries.slice(0, 4)
  const classCounts = ['7', '8', '9'].map((className) => ({ className, count: activeStudents.filter((item) => item.className.startsWith(className)).length }))
  const activeContribution = data.contributions.find((item) => item.status === 'active')
  const activeContributionPayments = data.contributionPayments.filter((item) => item.contributionId === activeContribution?.id)
  const contributionProgress = Math.round((activeContributionPayments.filter((item) => item.status === 'paid').length / Math.max(activeContributionPayments.length, 1)) * 100)
  const sppProgress = Math.round((paid.length / Math.max(paid.length + unpaid.length, 1)) * 100)
  const studentSavings = activeStudents.map((student) => ({
    student,
    balance: data.savingEntries.filter((item) => item.studentId === student.id).reduce((sum, item) => sum + (item.type === 'deposit' ? item.amount : -item.amount), 0),
  })).sort((a, b) => b.balance - a.balance)
  const maxSaving = Math.max(...studentSavings.map((item) => item.balance), 1)
  const incomeSources = [
    { label: 'SPP', value: data.cashEntries.filter((item) => item.type === 'in' && item.category === 'SPP').reduce((sum, item) => sum + item.amount, 0), tone: 'teal', page: 'billing' as Page },
    { label: 'Iuran', value: data.cashEntries.filter((item) => item.type === 'in' && item.category === 'Iuran').reduce((sum, item) => sum + item.amount, 0), tone: 'blue', page: 'dues' as Page },
    { label: 'Tabungan', value: data.cashEntries.filter((item) => item.type === 'in' && item.category === 'Tabungan Santri').reduce((sum, item) => sum + item.amount, 0), tone: 'amber', page: 'savings' as Page },
  ]
  const trackedIncome = incomeSources.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="dense-dashboard">
      <Card className="overview-board">
        <div className="overview-toolbar">
          <div className="dashboard-pills"><button className="active">Semua unit</button><button>Kelas 7</button><button>Kelas 8</button><button>Kelas 9</button></div>
          <button className="period-control"><CalendarDays size={15} /> Juli 2026 <ChevronDown size={14} /></button>
        </div>
        <div className="overview-main">
          <div className="overview-balance">
            <span>Saldo kas aktif</span>
            <h2>{formatRupiah(cashBalance)}</h2>
            <p><strong><TrendingUp size={13} /> 6,2%</strong> dibanding bulan lalu</p>
            <button onClick={() => onNavigate('cash')}>Buka Buku Kas <ArrowRight size={14} /></button>
          </div>
          <div className="overview-kpis">
            <button onClick={() => onNavigate('billing')}><span className="kpi-icon teal"><ReceiptText size={17} /></span><small>SPP terkumpul</small><strong>{formatRupiah(sppCollected)}</strong><em>{sppProgress}% lunas</em></button>
            <button onClick={() => onNavigate('dues')}><span className="kpi-icon blue"><HandCoins size={17} /></span><small>Iuran terkumpul</small><strong>{formatRupiah(contributionCollected)}</strong><em>{contributionProgress}% iuran aktif</em></button>
            <button onClick={() => onNavigate('savings')}><span className="kpi-icon amber"><Coins size={18} /></span><small>Saldo tabungan</small><strong>{formatRupiah(savingsBalance)}</strong><em>{data.savingEntries.length} transaksi</em></button>
            <button onClick={() => onNavigate('students')}><span className="kpi-icon purple"><Users size={17} /></span><small>Santri aktif</small><strong>{activeStudents.length} santri</strong><em>{classCounts.length} tingkat kelas</em></button>
          </div>
        </div>
        <div className="income-ribbon">
          {incomeSources.map((source) => <button key={source.label} onClick={() => onNavigate(source.page)} style={{ flex: Math.max(source.value, trackedIncome * .12) }}><span><i className={source.tone} />{source.label}</span><strong>{formatRupiah(source.value)}</strong><small>{Math.round((source.value / Math.max(trackedIncome, 1)) * 100)}%</small></button>)}
          <button className="other-income" onClick={() => onNavigate('cash')} style={{ flex: Math.max(cashIn - trackedIncome, trackedIncome * .12) }}><span><i />Kas lainnya</span><strong>{formatRupiah(cashIn - trackedIncome)}</strong><small>{Math.round(((cashIn - trackedIncome) / Math.max(cashIn, 1)) * 100)}%</small></button>
        </div>
      </Card>

      <section className="dashboard-bento">
        <div className="bento-stack">
          <Card className="module-card collection-snapshot">
            <CardHeader title="Status penagihan" subtitle="SPP dan iuran bulan berjalan"><button onClick={() => onNavigate('billing')}><MoreHorizontal size={17} /></button></CardHeader>
            <div className="collection-row"><span className="module-round teal"><ReceiptText size={17} /></span><div><p><strong>SPP Juli</strong><small>{paid.length} dari {paid.length + unpaid.length} santri</small></p><b>{formatRupiah(sppCollected)}</b><span className="thin-progress"><i style={{ width: `${sppProgress}%` }} /></span></div></div>
            <div className="collection-row"><span className="module-round blue"><HandCoins size={17} /></span><div><p><strong>{activeContribution?.name ?? 'Iuran aktif'}</strong><small>{activeContributionPayments.filter((item) => item.status === 'paid').length} dari {activeContributionPayments.length} santri</small></p><b>{formatRupiah(activeContribution?.amount ?? 0)}</b><span className="thin-progress blue"><i style={{ width: `${contributionProgress}%` }} /></span></div></div>
            <div className="collection-alerts">
              <button onClick={() => onNavigate('billing')}><span className="amber"><CalendarDays size={14} /></span><p><small>Tunggakan SPP</small><strong>{unpaid.length} santri</strong></p></button>
              <button onClick={() => onNavigate('dues')}><span className="blue"><BadgeCheck size={14} /></span><p><small>Menunggu verifikasi</small><strong>{activeContributionPayments.filter((item) => item.status === 'pending').length} pembayaran</strong></p></button>
            </div>
            <div className="collection-followup"><span>Perlu ditindaklanjuti</span><div>{unpaid.slice(0, 3).map((invoice) => { const student = data.students.find((item) => item.id === invoice.studentId); return student ? <i key={student.id} style={{ background: student.color }}>{student.initials}</i> : null })}<small>{unpaid.slice(0, 3).map((invoice) => data.students.find((item) => item.id === invoice.studentId)?.name.split(' ')[0]).filter(Boolean).join(', ')}</small></div></div>
            <button className="module-link" onClick={() => onNavigate('dues')}>Kelola seluruh tagihan <ArrowRight size={14} /></button>
          </Card>

          <Card className="module-card report-snapshot">
            <span className="report-visual"><FileBarChart size={22} /></span>
            <div><small>Laporan Juli 2026</small><strong>Rekap keuangan siap</strong><p>SPP, iuran, tabungan, dan arus kas.</p></div>
            <button onClick={() => onNavigate('reports')}>Buka <ArrowRight size={14} /></button>
          </Card>
        </div>

        <div className="bento-stack">
          <Card className="module-card student-snapshot">
            <CardHeader title="Data santri" subtitle={`${activeStudents.length} santri aktif`}><button onClick={() => onNavigate('students')}><ArrowRight size={16} /></button></CardHeader>
            <div className="student-avatar-stack">{activeStudents.slice(0, 5).map((student) => <span key={student.id} style={{ background: student.color }}>{student.initials}</span>)}<span>+{Math.max(activeStudents.length - 5, 0)}</span></div>
            <div className="class-counts">{classCounts.map((item) => <div key={item.className}><span>Kelas {item.className}</span><strong>{item.count}</strong><i><b style={{ width: `${(item.count / Math.max(activeStudents.length, 1)) * 100}%` }} /></i></div>)}</div>
          </Card>

          <Card className="module-card savings-snapshot">
            <CardHeader title="Tabungan santri" subtitle="Saldo tertinggi"><button onClick={() => onNavigate('savings')}><ArrowRight size={16} /></button></CardHeader>
            <div className="saving-bars">{studentSavings.slice(0, 5).map((item) => <div key={item.student.id}><span title={item.student.name}>{item.student.initials}</span><i><b style={{ height: `${Math.max((item.balance / maxSaving) * 100, 7)}%` }} /></i><small>{Math.round(item.balance / 1000)}k</small></div>)}</div>
          </Card>
        </div>

        <Card className="finance-analysis">
          <CardHeader title="Dinamika keuangan" subtitle="Arus kas 6 bulan terakhir">
            <div className="chart-legend"><span><i className="in" />Masuk</span><span><i className="out" />Keluar</span></div>
          </CardHeader>
          <div className="analysis-numbers"><div><small>Pemasukan</small><strong>{formatRupiah(cashIn)}</strong></div><div><small>Pengeluaran</small><strong>{formatRupiah(cashOut)}</strong></div><span><TrendingUp size={13} /> Kas sehat</span></div>
          <div className="dense-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyChart} margin={{ top: 8, right: 6, bottom: 0, left: -22 }}>
                <defs><linearGradient id="denseIncome" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0f766e" stopOpacity={.18} /><stop offset="100%" stopColor="#0f766e" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid vertical={false} stroke="#edf1f2" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#87939d', fontSize: 9 }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={shortRupiah} tick={{ fill: '#9aa4ac', fontSize: 8 }} />
                <Tooltip formatter={(value) => formatRupiah(Number(value ?? 0))} contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 10 }} />
                <Area isAnimationActive={false} type="monotone" dataKey="masuk" stroke="#0f766e" strokeWidth={2.2} fill="url(#denseIncome)" />
                <Area isAnimationActive={false} type="monotone" dataKey="keluar" stroke="#f59e0b" strokeWidth={1.8} fill="transparent" strokeDasharray="4 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="recent-compact">
            <div className="recent-compact-head"><strong>Transaksi terbaru</strong><button onClick={() => onNavigate('cash')}>Lihat semua <ArrowRight size={13} /></button></div>
            {recent.map((item) => <div key={item.id}><span className={`transaction-icon ${item.type}`}>{item.type === 'in' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}</span><p><strong>{item.description}</strong><small>{item.category} · {formatDate(item.date)}</small></p><b className={item.type}>{item.type === 'in' ? '+' : '−'}{formatRupiah(item.amount)}</b></div>)}
          </div>
        </Card>
      </section>
    </div>
  )
}

function ParentDashboard({ data, onGoBilling }: { data: AppData; onGoBilling: () => void }) {
  const student = data.students.find((item) => item.id === 's1')!
  const invoices = data.invoices.filter((item) => item.studentId === student.id)
  const current = invoices.find((item) => item.period === 'Juli 2026')
  const paidTotal = invoices.filter((item) => item.status === 'paid').reduce((sum, item) => sum + item.amount, 0)

  return (
    <>
      <div className="parent-banner">
        <div className="student-profile"><div className="student-avatar" style={{ background: student.color }}>{student.initials}</div><div><small>Data putra Anda</small><h2>{student.name}</h2><p>NIS {student.nis} · Kelas {student.className}</p></div></div>
        <div className="parent-banner-badge"><BadgeCheck size={18} /> Santri aktif</div>
      </div>
      <section className="parent-layout">
        <div>
          <Card className={`bill-hero ${current?.status === 'paid' ? 'settled' : ''}`}>
            <div className="bill-hero-top"><div className="big-icon"><ReceiptText size={26} /></div><StatusBadge status={current?.status || 'unpaid'} /></div>
            <p>Tagihan SPP Juli 2026</p><h2>{formatRupiah(current?.amount || 0)}</h2>
            <div className="due-info"><CalendarDays size={17} /> Jatuh tempo 10 Juli 2026</div>
            <button onClick={onGoBilling}>{current?.status === 'paid' ? 'Lihat bukti pembayaran' : 'Bayar tagihan sekarang'} <ArrowRight size={17} /></button>
          </Card>
          <Card className="payment-history">
            <CardHeader title="Riwayat pembayaran" subtitle="Pembayaran SPP terbaru">
              <button className="text-button" onClick={onGoBilling}>Lihat semua <ChevronRight size={15} /></button>
            </CardHeader>
            {invoices.map((invoice) => <InvoiceHistoryRow key={invoice.id} invoice={invoice} />)}
          </Card>
        </div>
        <div>
          <Card className="parent-stats">
            <h3>Ringkasan pembayaran</h3>
            <div><span className="round-icon teal"><TrendingUp size={18} /></span><p><small>Total terbayar</small><strong>{formatRupiah(paidTotal)}</strong></p></div>
            <div><span className="round-icon amber"><ReceiptText size={18} /></span><p><small>Sisa tagihan</small><strong>{formatRupiah(invoices.filter((item) => item.status !== 'paid').reduce((sum, item) => sum + item.amount, 0))}</strong></p></div>
            <div><span className="round-icon blue"><CalendarDays size={18} /></span><p><small>Pembayaran berikutnya</small><strong>10 Agustus 2026</strong></p></div>
          </Card>
          <div className="info-card">
            <div><Bell size={19} /></div><span><strong>Pengingat pembayaran</strong><p>Mohon melunasi SPP sebelum tanggal 10 setiap bulannya.</p></span>
          </div>
          <Card className="support-card"><HelpCircle size={22} /><div><strong>Ada kendala pembayaran?</strong><p>Hubungi petugas TU melalui WhatsApp.</p></div><button>Hubungi TU</button></Card>
        </div>
      </section>
    </>
  )
}

function StudentsPage({ data, setData, notify }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>>; notify: (message: string) => void }) {
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('Semua kelas')
  const [showAdd, setShowAdd] = useState(false)
  const filtered = data.students.filter((student) =>
    (student.name.toLowerCase().includes(search.toLowerCase()) || student.nis.includes(search)) &&
    (classFilter === 'Semua kelas' || student.className.startsWith(classFilter))
  )

  const addStudent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name'))
    const newStudent = {
      id: createId('s'), nis: String(form.get('nis')), name, className: String(form.get('className')),
      guardian: String(form.get('guardian')), phone: String(form.get('phone')), status: 'active' as const,
      initials: name.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase(), color: '#dbeafe',
    }
    setData((current) => ({ ...current, students: [newStudent, ...current.students] }))
    setShowAdd(false)
    notify('Data santri berhasil ditambahkan')
  }

  return (
    <>
      <div className="toolbar">
        <div className="search-box"><Search size={18} /><input placeholder="Cari nama atau NIS..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        <select value={classFilter} onChange={(event) => setClassFilter(event.target.value)}><option>Semua kelas</option><option>7</option><option>8</option><option>9</option></select>
        <div className="toolbar-spacer" />
        <button className="primary-button" onClick={() => setShowAdd(true)}><Plus size={17} /> Tambah santri</button>
      </div>
      <Card className="table-card">
        <div className="table-summary"><span>Menampilkan <strong>{filtered.length}</strong> dari {data.students.length} santri</span><button><Download size={16} /> Unduh data</button></div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>SANTRI</th><th>NIS</th><th>KELAS</th><th>WALI SANTRI</th><th>NO. TELEPON</th><th>STATUS</th><th /></tr></thead>
            <tbody>{filtered.map((student) => (
              <tr key={student.id}>
                <td><div className="name-cell"><span style={{ background: student.color }}>{student.initials}</span><strong>{student.name}</strong></div></td>
                <td>{student.nis}</td><td><span className="class-chip">{student.className}</span></td><td>{student.guardian}</td><td>{student.phone}</td>
                <td><span className={`status simple ${student.status}`}>{student.status === 'active' ? 'Aktif' : 'Nonaktif'}</span></td>
                <td><button className="row-menu"><MoreHorizontal size={19} /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
      {showAdd && <Modal title="Tambah santri baru" subtitle="Lengkapi data santri dan wali santri." onClose={() => setShowAdd(false)}>
        <form className="modal-form" onSubmit={addStudent}>
          <div className="form-grid"><Field label="Nama lengkap" name="name" placeholder="Nama santri" required /><Field label="NIS" name="nis" placeholder="Contoh: 230120" required /><Field label="Kelas" name="className" placeholder="Contoh: 7A" required /><Field label="Nama wali santri" name="guardian" placeholder="Nama ayah/ibu/wali" required /><Field label="Nomor telepon" name="phone" placeholder="08xx-xxxx-xxxx" required /></div>
          <ModalActions onCancel={() => setShowAdd(false)} submitLabel="Simpan santri" />
        </form>
      </Modal>}
    </>
  )
}

function BillingPage({ data, setData, notify }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>>; notify: (message: string) => void }) {
  const [status, setStatus] = useState<'all' | InvoiceStatus>('all')
  const [search, setSearch] = useState('')
  const [showGenerate, setShowGenerate] = useState(false)
  const [paying, setPaying] = useState<Invoice | null>(null)
  const rows = data.invoices.filter((invoice) => {
    const student = data.students.find((item) => item.id === invoice.studentId)
    return (status === 'all' || invoice.status === status) && (student?.name.toLowerCase().includes(search.toLowerCase()) || invoice.period.toLowerCase().includes(search.toLowerCase()))
  })
  const juli = data.invoices.filter((item) => item.period === 'Juli 2026')

  const markPaid = (invoice: Invoice, method = 'Tunai') => {
    const receipt = `SPP-${createId('').slice(-9)}`
    const student = data.students.find((item) => item.id === invoice.studentId)
    const cash: CashEntry = { id: createId('k'), date: '2026-07-30', description: `Pembayaran SPP ${student?.name}`, category: 'SPP', type: 'in', amount: invoice.amount, ref: receipt, officer: 'Nur Aini' }
    setData((current) => ({ ...current, invoices: current.invoices.map((item) => item.id === invoice.id ? { ...item, status: 'paid', paidAt: '2026-07-30', method, receipt } : item), cashEntries: [cash, ...current.cashEntries] }))
    setPaying(null)
    notify('Pembayaran berhasil dicatat')
  }

  const generate = () => {
    const existing = new Set(data.invoices.filter((item) => item.period === 'Agustus 2026').map((item) => item.studentId))
    const batchId = createId('aug-')
    const created = data.students.filter((item) => item.status === 'active' && !existing.has(item.id)).map((student, index) => ({ id: `${batchId}-${index}`, studentId: student.id, period: 'Agustus 2026', dueDate: '2026-08-10', amount: 650000, status: 'unpaid' as const }))
    setData((current) => ({ ...current, invoices: [...created, ...current.invoices] }))
    setShowGenerate(false)
    notify(`${created.length} tagihan Agustus berhasil dibuat`)
  }

  return (
    <>
      <section className="mini-stats">
        <MiniStat label="Total tagihan Juli" value={formatRupiah(juli.reduce((sum, item) => sum + item.amount, 0))} icon={ReceiptText} tone="blue" />
        <MiniStat label="Sudah dibayar" value={formatRupiah(juli.filter((item) => item.status === 'paid').reduce((sum, item) => sum + item.amount, 0))} icon={BadgeCheck} tone="teal" />
        <MiniStat label="Belum dibayar" value={formatRupiah(juli.filter((item) => item.status !== 'paid').reduce((sum, item) => sum + item.amount, 0))} icon={CalendarDays} tone="amber" />
      </section>
      <div className="toolbar">
        <div className="search-box"><Search size={18} /><input placeholder="Cari santri atau periode..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}><option value="all">Semua status</option><option value="paid">Lunas</option><option value="unpaid">Belum bayar</option><option value="pending">Menunggu</option></select>
        <div className="toolbar-spacer" />
        <button className="primary-button" onClick={() => setShowGenerate(true)}><Plus size={17} /> Buat tagihan massal</button>
      </div>
      <Card className="table-card">
        <div className="table-summary"><span><strong>{rows.length}</strong> data tagihan</span><button onClick={() => downloadInvoices(rows, data)}><Download size={16} /> Ekspor CSV</button></div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>SANTRI</th><th>PERIODE</th><th>JATUH TEMPO</th><th>NOMINAL</th><th>STATUS</th><th>PEMBAYARAN</th><th /></tr></thead>
            <tbody>{rows.map((invoice) => {
              const student = data.students.find((item) => item.id === invoice.studentId)!
              return <tr key={invoice.id}>
                <td><div className="name-cell"><span style={{ background: student.color }}>{student.initials}</span><div><strong>{student.name}</strong><small>{student.className} · {student.nis}</small></div></div></td>
                <td>{invoice.period}</td><td>{formatDate(invoice.dueDate)}</td><td><strong>{formatRupiah(invoice.amount)}</strong></td><td><StatusBadge status={invoice.status} /></td>
                <td>{invoice.status === 'paid' ? <div className="payment-cell"><strong>{invoice.method}</strong><small>{formatDate(invoice.paidAt)}</small></div> : invoice.status === 'pending' ? <button className="small-action" onClick={() => markPaid(invoice, invoice.method)}>Verifikasi</button> : <button className="small-action" onClick={() => setPaying(invoice)}>Catat bayar</button>}</td>
                <td><button className="row-menu"><MoreHorizontal size={19} /></button></td>
              </tr>
            })}</tbody>
          </table>
        </div>
      </Card>
      {showGenerate && <Modal title="Buat tagihan massal" subtitle="Tagihan akan dibuat untuk seluruh santri aktif." onClose={() => setShowGenerate(false)}>
        <div className="generate-preview"><div><CalendarDays size={22} /></div><span><strong>SPP Agustus 2026</strong><p>Jatuh tempo 10 Agustus 2026</p></span><b>{formatRupiah(650000)}<small>/santri</small></b></div>
        <div className="modal-note"><BadgeCheck size={17} /> Tagihan dibuat untuk {data.students.filter((item) => item.status === 'active').length} santri aktif. Data yang sudah ada tidak akan digandakan.</div>
        <ModalActions onCancel={() => setShowGenerate(false)} submitLabel="Buat tagihan" onSubmit={generate} />
      </Modal>}
      {paying && <PaymentModal invoice={paying} studentName={data.students.find((item) => item.id === paying.studentId)?.name || ''} onClose={() => setPaying(null)} onPay={markPaid} />}
    </>
  )
}

function ParentBilling({ data, setData, notify }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>>; notify: (message: string) => void }) {
  const [paying, setPaying] = useState<Invoice | null>(null)
  const invoices = data.invoices.filter((item) => item.studentId === 's1')
  const submitPay = (invoice: Invoice, method: string) => {
    setData((current) => ({ ...current, invoices: current.invoices.map((item) => item.id === invoice.id ? { ...item, status: 'pending', paidAt: '2026-07-30', method } : item) }))
    setPaying(null)
    notify('Bukti pembayaran terkirim, menunggu verifikasi TU')
  }
  return (
    <>
      <div className="parent-billing-head"><div><ReceiptText size={25} /><span><strong>Administrasi Ahmad Fadhil</strong><p>NIS 230101 · Kelas 7A</p></span></div><span>TA 2026/2027</span></div>
      <Card className="table-card">
        <div className="table-summary"><span>Daftar tagihan SPP</span><button onClick={() => downloadInvoices(invoices, data)}><Download size={16} /> Unduh riwayat</button></div>
        <div className="table-scroll">
          <table><thead><tr><th>PERIODE</th><th>JATUH TEMPO</th><th>NOMINAL</th><th>STATUS</th><th>METODE</th><th /></tr></thead>
            <tbody>{invoices.map((invoice) => <tr key={invoice.id}><td><strong>{invoice.period}</strong></td><td>{formatDate(invoice.dueDate)}</td><td><strong>{formatRupiah(invoice.amount)}</strong></td><td><StatusBadge status={invoice.status} /></td><td>{invoice.method || '—'}</td><td>{invoice.status === 'unpaid' ? <button className="small-action solid" onClick={() => setPaying(invoice)}>Bayar sekarang</button> : invoice.status === 'paid' ? <button className="small-action">Lihat bukti</button> : <span className="muted">Diproses TU</span>}</td></tr>)}</tbody>
          </table>
        </div>
      </Card>
      <div className="secure-note"><ShieldCheck size={19} /><div><strong>Pembayaran Anda aman</strong><p>Setelah transfer, data akan diverifikasi oleh petugas TU maksimal 1×24 jam.</p></div></div>
      {paying && <PaymentModal invoice={paying} studentName="Ahmad Fadhil" parentMode onClose={() => setPaying(null)} onPay={submitPay} />}
    </>
  )
}

function DuesPage({ role, data, setData, notify }: { role: Role; data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>>; notify: (message: string) => void }) {
  const isParent = role === 'parent'
  const [selectedId, setSelectedId] = useState(data.contributions.find((item) => item.status === 'active')?.id ?? data.contributions[0]?.id ?? '')
  const [showCreate, setShowCreate] = useState(false)
  const [paying, setPaying] = useState<ContributionPayment | null>(null)
  const selected = data.contributions.find((item) => item.id === selectedId)
  const selectedPayments = data.contributionPayments.filter((item) => item.contributionId === selectedId && (!isParent || item.studentId === 's1'))
  const allVisiblePayments = data.contributionPayments.filter((item) => !isParent || item.studentId === 's1')
  const collected = allVisiblePayments.filter((item) => item.status === 'paid').reduce((sum, item) => sum + (data.contributions.find((value) => value.id === item.contributionId)?.amount ?? 0), 0)
  const outstanding = allVisiblePayments.filter((item) => item.status !== 'paid').reduce((sum, item) => sum + (data.contributions.find((value) => value.id === item.contributionId)?.amount ?? 0), 0)

  const createContribution = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const contributionId = createId('c')
    const contribution: Contribution = {
      id: contributionId,
      name: String(form.get('name')),
      description: String(form.get('description')),
      amount: Number(String(form.get('amount')).replace(/\D/g, '')),
      dueDate: String(form.get('dueDate')),
      category: String(form.get('category')),
      status: 'active',
    }
    const payments: ContributionPayment[] = data.students.filter((item) => item.status === 'active').map((student, index) => ({
      id: `${contributionId}-p${index}`,
      contributionId,
      studentId: student.id,
      status: 'unpaid',
    }))
    setData((current) => ({ ...current, contributions: [contribution, ...current.contributions], contributionPayments: [...payments, ...current.contributionPayments] }))
    setSelectedId(contributionId)
    setShowCreate(false)
    notify(`Iuran dibuat untuk ${payments.length} santri`)
  }

  const completePayment = (payment: ContributionPayment, method: string) => {
    const campaign = data.contributions.find((item) => item.id === payment.contributionId)
    const student = data.students.find((item) => item.id === payment.studentId)
    if (!campaign || !student) return
    if (isParent) {
      setData((current) => ({ ...current, contributionPayments: current.contributionPayments.map((item) => item.id === payment.id ? { ...item, status: 'pending', paidAt: '2026-07-30', method } : item) }))
      setPaying(null)
      notify('Bukti pembayaran iuran terkirim untuk diverifikasi TU')
      return
    }
    const receipt = `IUR-${createId('').slice(-9)}`
    const cash: CashEntry = { id: createId('k-iur-'), date: '2026-07-30', description: `${campaign.name} — ${student.name}`, category: 'Iuran', type: 'in', amount: campaign.amount, ref: receipt, officer: 'Nur Aini' }
    setData((current) => ({
      ...current,
      contributionPayments: current.contributionPayments.map((item) => item.id === payment.id ? { ...item, status: 'paid', paidAt: '2026-07-30', method, receipt } : item),
      cashEntries: [cash, ...current.cashEntries],
    }))
    setPaying(null)
    notify('Pembayaran iuran tercatat dan masuk ke Buku Kas')
  }

  const closeCampaign = () => {
    if (!selected) return
    setData((current) => ({ ...current, contributions: current.contributions.map((item) => item.id === selected.id ? { ...item, status: item.status === 'active' ? 'closed' : 'active' } : item) }))
    notify(`Iuran ${selected.status === 'active' ? 'ditutup' : 'diaktifkan kembali'}`)
  }

  return (
    <>
      <section className={`mini-stats ${isParent ? 'parent-dues-stats' : ''}`}>
        <MiniStat label={isParent ? 'Total iuran terbayar' : 'Iuran terkumpul'} value={formatRupiah(collected)} icon={HandCoins} tone="teal" />
        <MiniStat label="Belum dibayar" value={formatRupiah(outstanding)} icon={CalendarDays} tone="amber" />
        <MiniStat label="Program iuran aktif" value={`${data.contributions.filter((item) => item.status === 'active').length} program`} icon={BadgeCheck} tone="blue" />
      </section>

      <div className="campaign-heading">
        <div><h3>Program iuran</h3><p>Pilih program untuk melihat rincian pembayaran.</p></div>
        {!isParent && <button className="primary-button" onClick={() => setShowCreate(true)}><Plus size={17} /> Buat iuran</button>}
      </div>
      <div className="campaign-grid">
        {data.contributions.map((item) => {
          const payments = data.contributionPayments.filter((payment) => payment.contributionId === item.id && (!isParent || payment.studentId === 's1'))
          const paid = payments.filter((payment) => payment.status === 'paid').length
          const percent = Math.round((paid / Math.max(payments.length, 1)) * 100)
          return <button key={item.id} className={`campaign-card ${item.id === selectedId ? 'active' : ''}`} onClick={() => setSelectedId(item.id)}>
            <span className="campaign-icon"><HandCoins size={21} /></span>
            <span className="campaign-copy"><small>{item.category}</small><strong>{item.name}</strong><em>Jatuh tempo {formatDate(item.dueDate)}</em></span>
            <span className="campaign-amount"><strong>{formatRupiah(item.amount)}</strong><small>{paid}/{payments.length} lunas</small></span>
            <span className="campaign-progress"><i style={{ width: `${percent}%` }} /></span>
          </button>
        })}
      </div>

      {selected && <Card className="table-card dues-table">
        <div className="table-summary">
          <span><strong>{selected.name}</strong> · {selected.description}</span>
          {!isParent && <button onClick={closeCampaign}>{selected.status === 'active' ? 'Tutup iuran' : 'Aktifkan iuran'}</button>}
        </div>
        <div className="table-scroll">
          <table>
            <thead><tr>{!isParent && <th>SANTRI</th>}<th>NOMINAL</th><th>JATUH TEMPO</th><th>STATUS</th><th>METODE</th><th /></tr></thead>
            <tbody>{selectedPayments.map((payment) => {
              const student = data.students.find((item) => item.id === payment.studentId)!
              return <tr key={payment.id}>
                {!isParent && <td><div className="name-cell"><span style={{ background: student.color }}>{student.initials}</span><div><strong>{student.name}</strong><small>{student.className} · {student.nis}</small></div></div></td>}
                <td><strong>{formatRupiah(selected.amount)}</strong></td><td>{formatDate(selected.dueDate)}</td><td><StatusBadge status={payment.status} /></td><td>{payment.method || '—'}</td>
                <td>{payment.status === 'paid'
                  ? <span className="receipt-ref">{payment.receipt}</span>
                  : payment.status === 'pending' && !isParent
                    ? <button className="small-action" onClick={() => completePayment(payment, payment.method ?? 'Transfer Bank')}>Verifikasi</button>
                    : payment.status === 'pending'
                      ? <span className="muted">Diproses TU</span>
                      : <button className={`small-action ${isParent ? 'solid' : ''}`} onClick={() => setPaying(payment)}>{isParent ? 'Bayar sekarang' : 'Catat bayar'}</button>}</td>
              </tr>
            })}</tbody>
          </table>
        </div>
      </Card>}

      {showCreate && <Modal title="Buat iuran baru" subtitle="Tagihan akan dibuat untuk seluruh santri aktif." onClose={() => setShowCreate(false)}>
        <form className="modal-form" onSubmit={createContribution}>
          <div className="form-grid">
            <Field label="Nama iuran" name="name" placeholder="Contoh: Iuran Haul 2026" required />
            <Field label="Nominal per santri" name="amount" placeholder="Contoh: 150000" required />
            <Field label="Tanggal jatuh tempo" name="dueDate" type="date" required />
            <label className="field"><span>Kategori</span><select name="category" required><option value="">Pilih kategori</option><option>Kegiatan Pondok</option><option>Akademik</option><option>Sarana</option><option>Sosial</option><option>Lainnya</option></select></label>
          </div>
          <label className="field full contribution-description"><span>Keterangan</span><textarea name="description" placeholder="Jelaskan penggunaan dana iuran..." required /></label>
          <div className="modal-note"><WalletCards size={17} /> Setiap pembayaran yang diverifikasi otomatis dicatat sebagai kas masuk kategori Iuran.</div>
          <ModalActions onCancel={() => setShowCreate(false)} submitLabel="Buat dan bagikan iuran" />
        </form>
      </Modal>}
      {paying && selected && <ContributionPaymentModal contribution={selected} payment={paying} studentName={data.students.find((item) => item.id === paying.studentId)?.name ?? ''} parentMode={isParent} onClose={() => setPaying(null)} onPay={completePayment} />}
    </>
  )
}

function SavingsPage({ role, data, setData, notify }: { role: Role; data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>>; notify: (message: string) => void }) {
  const isParent = role === 'parent'
  const [search, setSearch] = useState('')
  const [action, setAction] = useState<{ studentId: string; type: SavingType } | null>(null)
  const balanceFor = (studentId: string) => data.savingEntries.filter((item) => item.studentId === studentId).reduce((sum, item) => sum + (item.type === 'deposit' ? item.amount : -item.amount), 0)
  const visibleStudents = data.students.filter((student) => (!isParent || student.id === 's1') && student.status === 'active' && (student.name.toLowerCase().includes(search.toLowerCase()) || student.nis.includes(search)))
  const visibleEntries = data.savingEntries.filter((item) => !isParent || item.studentId === 's1')
  const totalBalance = visibleStudents.reduce((sum, student) => sum + balanceFor(student.id), 0)
  const totalDeposits = visibleEntries.filter((item) => item.type === 'deposit').reduce((sum, item) => sum + item.amount, 0)
  const totalWithdrawals = visibleEntries.filter((item) => item.type === 'withdrawal').reduce((sum, item) => sum + item.amount, 0)

  const addSavingEntry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!action) return
    const form = new FormData(event.currentTarget)
    const amount = Number(String(form.get('amount')).replace(/\D/g, ''))
    const currentBalance = balanceFor(action.studentId)
    if (amount <= 0) {
      notify('Nominal transaksi harus lebih dari nol')
      return
    }
    if (action.type === 'withdrawal' && amount > currentBalance) {
      notify('Saldo tabungan tidak mencukupi')
      return
    }
    const student = data.students.find((item) => item.id === action.studentId)
    if (!student) return
    const id = createId(action.type === 'deposit' ? 'sv-dep-' : 'sv-out-')
    const ref = `${action.type === 'deposit' ? 'TAB' : 'TAR'}-${id.slice(-9)}`
    const description = String(form.get('description'))
    const savingEntry: SavingEntry = { id, studentId: student.id, date: String(form.get('date')), type: action.type, amount, description, ref, officer: isParent ? 'Budi Santoso' : 'Nur Aini' }
    const cashEntry: CashEntry = {
      id: createId('k-tab-'),
      date: savingEntry.date,
      description: `${action.type === 'deposit' ? 'Setoran' : 'Penarikan'} tabungan — ${student.name}`,
      category: 'Tabungan Santri',
      type: action.type === 'deposit' ? 'in' : 'out',
      amount,
      ref,
      officer: savingEntry.officer,
    }
    setData((current) => ({ ...current, savingEntries: [savingEntry, ...current.savingEntries], cashEntries: [cashEntry, ...current.cashEntries] }))
    setAction(null)
    notify(`${action.type === 'deposit' ? 'Setoran' : 'Penarikan'} tersimpan dan masuk ke Buku Kas`)
  }

  return (
    <>
      {isParent && <div className="savings-hero">
        <div><span><Coins size={26} /></span><p><small>Saldo tabungan Ahmad Fadhil</small><strong>{formatRupiah(balanceFor('s1'))}</strong><em>Terakhir diperbarui 30 Juli 2026</em></p></div>
        <button onClick={() => setAction({ studentId: 's1', type: 'deposit' })}><Plus size={17} /> Tambah setoran</button>
      </div>}
      <section className={`mini-stats ${isParent ? 'parent-savings-stats' : ''}`}>
        <MiniStat label="Total saldo tabungan" value={formatRupiah(totalBalance)} icon={Coins} tone="teal" />
        <MiniStat label="Total setoran" value={formatRupiah(totalDeposits)} icon={ArrowDownLeft} tone="blue" />
        <MiniStat label="Total penarikan" value={formatRupiah(totalWithdrawals)} icon={ArrowUpRight} tone="amber" />
      </section>

      {!isParent && <div className="toolbar">
        <div className="search-box"><Search size={18} /><input placeholder="Cari nama atau NIS santri..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        <div className="toolbar-spacer" />
        <button className="outline-button" onClick={() => downloadSavings(data.savingEntries, data)}><Download size={16} /> Ekspor tabungan</button>
      </div>}

      {!isParent && <Card className="table-card savings-balance-table">
        <div className="table-summary"><span>Saldo tabungan per santri</span><span className="cash-link-note"><WalletCards size={15} /> Terhubung ke Buku Kas</span></div>
        <div className="table-scroll"><table>
          <thead><tr><th>SANTRI</th><th>TOTAL SETORAN</th><th>TOTAL PENARIKAN</th><th>SALDO</th><th>AKSI</th></tr></thead>
          <tbody>{visibleStudents.map((student) => {
            const entries = data.savingEntries.filter((item) => item.studentId === student.id)
            const deposits = entries.filter((item) => item.type === 'deposit').reduce((sum, item) => sum + item.amount, 0)
            const withdrawals = entries.filter((item) => item.type === 'withdrawal').reduce((sum, item) => sum + item.amount, 0)
            return <tr key={student.id}><td><div className="name-cell"><span style={{ background: student.color }}>{student.initials}</span><div><strong>{student.name}</strong><small>{student.className} · {student.nis}</small></div></div></td><td className="money-in">{formatRupiah(deposits)}</td><td className="money-out">{formatRupiah(withdrawals)}</td><td><strong className="saving-balance">{formatRupiah(deposits - withdrawals)}</strong></td><td><div className="saving-actions"><button onClick={() => setAction({ studentId: student.id, type: 'deposit' })}><ArrowDownLeft size={14} /> Setor</button><button onClick={() => setAction({ studentId: student.id, type: 'withdrawal' })}><ArrowUpRight size={14} /> Tarik</button></div></td></tr>
          })}</tbody>
        </table></div>
      </Card>}

      <Card className={`table-card saving-history ${!isParent ? 'staff-history' : ''}`}>
        <div className="table-summary"><span>Riwayat transaksi {isParent ? 'Ahmad Fadhil' : 'terbaru'}</span>{isParent && <button onClick={() => downloadSavings(visibleEntries, data)}><Download size={16} /> Unduh riwayat</button>}</div>
        <div className="transaction-list cash-list">{visibleEntries.slice(0, 12).map((item) => {
          const student = data.students.find((value) => value.id === item.studentId)
          const cashLike: CashEntry = { id: item.id, date: item.date, description: `${item.type === 'deposit' ? 'Setoran' : 'Penarikan'} tabungan${isParent ? '' : ` — ${student?.name ?? ''}`}`, category: item.description, type: item.type === 'deposit' ? 'in' : 'out', amount: item.amount, ref: item.ref, officer: item.officer }
          return <TransactionRow key={item.id} item={cashLike} detailed />
        })}</div>
      </Card>

      {action && <Modal title={action.type === 'deposit' ? 'Tambah setoran tabungan' : 'Catat penarikan tabungan'} subtitle={`${data.students.find((item) => item.id === action.studentId)?.name} · Saldo ${formatRupiah(balanceFor(action.studentId))}`} onClose={() => setAction(null)}>
        <form className="modal-form" onSubmit={addSavingEntry}>
          <div className="form-grid">
            <Field label="Tanggal transaksi" name="date" type="date" defaultValue="2026-07-30" required />
            <Field label="Nominal" name="amount" placeholder="Contoh: 100000" required />
          </div>
          <label className="field full contribution-description"><span>Keterangan</span><textarea name="description" defaultValue={action.type === 'deposit' ? 'Setoran tabungan' : 'Penarikan untuk keperluan santri'} required /></label>
          <div className="modal-note"><WalletCards size={17} /> Transaksi otomatis dicatat sebagai kas {action.type === 'deposit' ? 'masuk' : 'keluar'} kategori Tabungan Santri.</div>
          <ModalActions onCancel={() => setAction(null)} submitLabel={action.type === 'deposit' ? 'Simpan setoran' : 'Proses penarikan'} />
        </form>
      </Modal>}
    </>
  )
}

function CashPage({ data, setData, notify }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>>; notify: (message: string) => void }) {
  const [type, setType] = useState<'all' | CashType>('all')
  const [showAdd, setShowAdd] = useState<CashType | null>(null)
  const cashIn = data.cashEntries.filter((item) => item.type === 'in').reduce((sum, item) => sum + item.amount, 0)
  const cashOut = data.cashEntries.filter((item) => item.type === 'out').reduce((sum, item) => sum + item.amount, 0)
  const rows = data.cashEntries.filter((item) => type === 'all' || item.type === type)
  const addCash = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const amount = Number(String(form.get('amount')).replace(/\D/g, ''))
    const id = createId('k')
    const entry: CashEntry = { id, date: String(form.get('date')), description: String(form.get('description')), category: String(form.get('category')), type: showAdd!, amount, ref: `${showAdd === 'in' ? 'MAS' : 'KEL'}-${id.slice(-8)}`, officer: 'Nur Aini' }
    setData((current) => ({ ...current, cashEntries: [entry, ...current.cashEntries] }))
    setShowAdd(null)
    notify(`Kas ${entry.type === 'in' ? 'masuk' : 'keluar'} berhasil dicatat`)
  }

  return (
    <>
      <section className="cash-summary">
        <div className="cash-balance"><div className="cash-title"><span><WalletCards size={20} /></span><p><small>Saldo kas saat ini</small><strong>{formatRupiah(cashIn - cashOut)}</strong></p></div><div className="balance-change"><TrendingUp size={15} /> 6,2% bulan ini</div></div>
        <div className="cash-in"><span><ArrowDownLeft size={20} /></span><p><small>Total kas masuk</small><strong>{formatRupiah(cashIn)}</strong></p></div>
        <div className="cash-out"><span><ArrowUpRight size={20} /></span><p><small>Total kas keluar</small><strong>{formatRupiah(cashOut)}</strong></p></div>
      </section>
      <div className="toolbar">
        <div className="segmented"><button className={type === 'all' ? 'active' : ''} onClick={() => setType('all')}>Semua</button><button className={type === 'in' ? 'active' : ''} onClick={() => setType('in')}>Kas masuk</button><button className={type === 'out' ? 'active' : ''} onClick={() => setType('out')}>Kas keluar</button></div>
        <div className="toolbar-spacer" />
        <button className="outline-button income-btn" onClick={() => setShowAdd('in')}><ArrowDownLeft size={17} /> Kas masuk</button>
        <button className="primary-button expense-btn" onClick={() => setShowAdd('out')}><ArrowUpRight size={17} /> Kas keluar</button>
      </div>
      <Card className="table-card">
        <div className="table-summary"><span>Mutasi kas · Juli 2026</span><button onClick={() => downloadCash(rows)}><Download size={16} /> Ekspor CSV</button></div>
        <div className="transaction-list cash-list">{rows.map((item) => <TransactionRow key={item.id} item={item} detailed />)}</div>
      </Card>
      {showAdd && <Modal title={`Catat kas ${showAdd === 'in' ? 'masuk' : 'keluar'}`} subtitle="Transaksi akan langsung masuk ke buku kas." onClose={() => setShowAdd(null)}>
        <form className="modal-form" onSubmit={addCash}>
          <div className="form-grid"><Field label="Tanggal transaksi" name="date" type="date" defaultValue="2026-07-30" required /><Field label="Nominal" name="amount" placeholder="Contoh: 500000" required /><Field label="Keterangan" name="description" placeholder={showAdd === 'in' ? 'Contoh: Donasi wali santri' : 'Contoh: Pembelian alat kebersihan'} required /><label className="field"><span>Kategori</span><select name="category" required><option value="">Pilih kategori</option>{(showAdd === 'in' ? ['SPP', 'Iuran', 'Tabungan Santri', 'Donasi', 'Dana Kegiatan', 'Lainnya'] : ['Tabungan Santri', 'Operasional', 'Pemeliharaan', 'Utilitas', 'Konsumsi', 'Lainnya']).map((item) => <option key={item}>{item}</option>)}</select></label></div>
          <ModalActions onCancel={() => setShowAdd(null)} submitLabel="Simpan transaksi" />
        </form>
      </Modal>}
    </>
  )
}

function ReportsPage({ data, notify }: { data: AppData; notify: (message: string) => void }) {
  const cashIn = data.cashEntries.filter((item) => item.type === 'in').reduce((sum, item) => sum + item.amount, 0)
  const cashOut = data.cashEntries.filter((item) => item.type === 'out').reduce((sum, item) => sum + item.amount, 0)
  const reports = [
    { title: 'Laporan pembayaran SPP', desc: 'Rekap tagihan, pembayaran, dan tunggakan santri.', icon: ReceiptText, color: 'teal', action: () => downloadInvoices(data.invoices, data) },
    { title: 'Laporan buku kas', desc: 'Rincian seluruh pemasukan dan pengeluaran kas.', icon: WalletCards, color: 'blue', action: () => downloadCash(data.cashEntries) },
    { title: 'Laporan tunggakan', desc: 'Daftar santri dengan tagihan yang belum dibayar.', icon: CalendarDays, color: 'amber', action: () => downloadInvoices(data.invoices.filter((item) => item.status !== 'paid'), data) },
    { title: 'Laporan iuran pondok', desc: 'Rekap program iuran dan pembayaran setiap santri.', icon: HandCoins, color: 'teal', action: () => downloadContributions(data) },
    { title: 'Laporan tabungan santri', desc: 'Rincian saldo, setoran, dan penarikan tabungan.', icon: Coins, color: 'blue', action: () => downloadSavings(data.savingEntries, data) },
  ]
  return (
    <>
      <div className="report-filter"><div><label>Periode laporan</label><select><option>Juli 2026</option><option>Juni 2026</option><option>Semester Genap 2025/2026</option></select></div><button className="outline-button" onClick={() => window.print()}><FileBarChart size={17} /> Cetak ringkasan</button></div>
      <section className="report-overview">
        <div><p>Total pemasukan</p><strong>{formatRupiah(cashIn)}</strong><span className="positive"><TrendingUp size={14} /> naik 8,4%</span></div>
        <div><p>Total pengeluaran</p><strong>{formatRupiah(cashOut)}</strong><span className="negative"><TrendingDown size={14} /> naik 2,1%</span></div>
        <div><p>Surplus kas</p><strong>{formatRupiah(cashIn - cashOut)}</strong><span className="positive"><BadgeCheck size={14} /> kondisi sehat</span></div>
      </section>
      <div className="report-cards">
        {reports.map((report) => { const Icon = report.icon; return <Card key={report.title} className="report-item"><span className={`report-icon ${report.color}`}><Icon size={23} /></span><div><h3>{report.title}</h3><p>{report.desc}</p></div><button onClick={() => { report.action(); notify('Laporan CSV berhasil diunduh') }}><Download size={17} /> Unduh CSV</button></Card> })}
      </div>
      <Card className="report-note"><div className="note-illustration"><BarChart3 size={28} /></div><div><h3>Rekonsiliasi bulanan</h3><p>Pastikan saldo fisik dan saldo sistem sudah sesuai sebelum menutup buku bulan Juli.</p></div><button className="primary-button" onClick={() => notify('Buku kas Juli sudah ditandai untuk direkonsiliasi')}>Mulai rekonsiliasi</button></Card>
    </>
  )
}

function SettingsPage({ data, setData, notify }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>>; notify: (message: string) => void }) {
  const updateBrandFile = (key: keyof AppData['branding'], file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/') && !file.name.toLowerCase().endsWith('.ico')) {
      notify('File harus berupa gambar')
      return
    }
    if (file.size > 1024 * 1024) {
      notify('Ukuran gambar maksimal 1 MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setData((current) => ({ ...current, branding: { ...current.branding, [key]: String(reader.result) } }))
      notify(`${key === 'appLogo' ? 'Logo aplikasi' : key === 'favicon' ? 'Favicon' : 'Logo pondok'} berhasil diperbarui`)
    }
    reader.readAsDataURL(file)
  }
  const removeBrandFile = (key: keyof AppData['branding']) => {
    setData((current) => ({ ...current, branding: { ...current.branding, [key]: undefined } }))
    notify('Gambar dikembalikan ke logo bawaan')
  }
  const reset = () => {
    setData(seedData)
    notify('Data demo berhasil dikembalikan')
  }
  return (
    <div className="settings-layout">
      <Card className="settings-card institution-card">
        <CardHeader title="Profil lembaga" subtitle="Informasi yang tampil pada kwitansi dan laporan." />
        <BrandingUpload label="Logo pondok" description="Tampil pada pemilih unit dan identitas lembaga." value={data.branding.schoolLogo} accept=".png,.jpg,.jpeg,.svg,.webp" fallback={<Landmark size={24} />} onSelect={(file) => updateBrandFile('schoolLogo', file)} onRemove={() => removeBrandFile('schoolLogo')} />
        <form onSubmit={(event) => { event.preventDefault(); notify('Pengaturan lembaga berhasil disimpan') }}><div className="form-grid"><Field label="Nama lembaga" name="school" defaultValue="Pondok Pesantren Al-Hikmah" /><Field label="NPSN" name="npsn" defaultValue="69912345" /><Field label="Nomor WhatsApp" name="phone" defaultValue="0812-7000-1200" /><Field label="Email" name="email" defaultValue="admin@alhikmah.sch.id" /></div><label className="field full"><span>Alamat</span><textarea defaultValue="Jl. Pendidikan No. 12, Kabupaten Bogor, Jawa Barat" /></label><button className="primary-button">Simpan perubahan</button></form>
      </Card>
      <Card className="settings-card app-branding-card">
        <CardHeader title="Identitas aplikasi" subtitle="Atur logo SakuSantri dan ikon pada tab browser." />
        <div className="branding-settings">
          <BrandingUpload label="Logo aplikasi" description="Disarankan PNG/SVG persegi, maksimal 1 MB." value={data.branding.appLogo} accept=".png,.jpg,.jpeg,.svg,.webp" fallback={<Logo />} onSelect={(file) => updateBrandFile('appLogo', file)} onRemove={() => removeBrandFile('appLogo')} />
          <BrandingUpload label="Favicon" description="Gunakan PNG, SVG, atau ICO berukuran persegi." value={data.branding.favicon} accept=".png,.svg,.ico" compact fallback={<span className="favicon-fallback">S</span>} onSelect={(file) => updateBrandFile('favicon', file)} onRemove={() => removeBrandFile('favicon')} />
        </div>
        <div className="branding-tip"><BadgeCheck size={16} /><span>Perubahan logo langsung diterapkan pada sidebar, halaman masuk, dan tab browser.</span></div>
      </Card>
      <Card className="settings-card"><CardHeader title="Pengaturan SPP" subtitle="Nilai standar tagihan bulanan." /><div className="form-grid"><Field label="Nominal SPP bulanan" name="fee" defaultValue="650000" /><Field label="Tanggal jatuh tempo" name="due" type="number" defaultValue="10" /></div><button className="primary-button" onClick={() => notify('Pengaturan SPP berhasil disimpan')}>Simpan pengaturan</button></Card>
      <Card className="settings-card danger-zone"><CardHeader title="Data demo" subtitle="Kembalikan seluruh perubahan ke kondisi awal." /><div><p>Saat ini terdapat {data.students.length} santri, {data.invoices.length} tagihan SPP, {data.contributions.length} program iuran, dan {data.savingEntries.length} transaksi tabungan.</p><button onClick={reset}><RotateCcw size={17} /> Reset data demo</button></div></Card>
    </div>
  )
}

function BrandingUpload({ label, description, value, accept, compact = false, fallback, onSelect, onRemove }: { label: string; description: string; value?: string; accept: string; compact?: boolean; fallback: ReactNode; onSelect: (file?: File) => void; onRemove: () => void }) {
  return <div className={`branding-upload ${compact ? 'compact' : ''}`}>
    <div className={`branding-preview ${value ? 'has-image' : ''}`}>{value ? <img src={value} alt={`Pratinjau ${label}`} /> : fallback}</div>
    <div className="branding-upload-copy"><strong>{label}</strong><p>{description}</p><div><label><ImageUp size={14} /> {value ? 'Ganti gambar' : 'Unggah gambar'}<input type="file" accept={accept} onChange={(event) => onSelect(event.target.files?.[0])} /></label>{value && <button type="button" onClick={onRemove}><Trash2 size={14} /> Hapus</button>}</div></div>
  </div>
}

function MiniStat({ icon: Icon, tone, label, value }: { icon: IconComponent; tone: string; label: string; value: string }) {
  return <Card className="mini-stat"><span className={`stat-icon ${tone}`}><Icon size={20} /></span><p><small>{label}</small><strong>{value}</strong></p></Card>
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`card ${className}`}>{children}</div>
}

function CardHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return <div className="card-header"><div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>{children}</div>
}

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const label = status === 'paid' ? 'Lunas' : status === 'pending' ? 'Menunggu' : 'Belum bayar'
  return <span className={`status ${status}`}><i />{label}</span>
}

function TransactionRow({ item, detailed = false }: { item: CashEntry; detailed?: boolean }) {
  return <div className="transaction-row"><span className={`transaction-icon ${item.type}`} >{item.type === 'in' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}</span><div className="transaction-main"><strong>{item.description}</strong><span>{item.category} · {formatDate(item.date)}{detailed && ` · Oleh ${item.officer}`}</span></div>{detailed && <span className="transaction-ref">{item.ref}</span>}<strong className={`transaction-amount ${item.type}`}>{item.type === 'in' ? '+' : '−'}{formatRupiah(item.amount)}</strong></div>
}

function InvoiceHistoryRow({ invoice }: { invoice: Invoice }) {
  return <div className="invoice-history-row"><span className={`round-icon ${invoice.status === 'paid' ? 'teal' : 'amber'}`}>{invoice.status === 'paid' ? <Check size={17} /> : <ReceiptText size={17} />}</span><div><strong>SPP {invoice.period}</strong><small>{invoice.status === 'paid' ? `Dibayar ${formatDate(invoice.paidAt)}` : `Jatuh tempo ${formatDate(invoice.dueDate)}`}</small></div><strong>{formatRupiah(invoice.amount)}</strong><StatusBadge status={invoice.status} /></div>
}

function Modal({ title, subtitle, onClose, children }: { title: string; subtitle?: string; onClose: () => void; children: ReactNode }) {
  return <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="modal"><button className="modal-close" onClick={onClose}><X size={20} /></button><div className="modal-heading"><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{children}</div></div>
}

function ModalActions({ onCancel, submitLabel, onSubmit }: { onCancel: () => void; submitLabel: string; onSubmit?: () => void }) {
  return <div className="modal-actions"><button type="button" className="outline-button" onClick={onCancel}>Batal</button><button type={onSubmit ? 'button' : 'submit'} className="primary-button" onClick={onSubmit}>{submitLabel}</button></div>
}

function Field({ label, name, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  return <label className="field"><span>{label}</span><input name={name} {...props} /></label>
}

function PaymentModal({ invoice, studentName, parentMode = false, onClose, onPay }: { invoice: Invoice; studentName: string; parentMode?: boolean; onClose: () => void; onPay: (invoice: Invoice, method: string) => void }) {
  const [method, setMethod] = useState(parentMode ? 'Transfer Bank' : 'Tunai')
  return <Modal title={parentMode ? 'Bayar tagihan SPP' : 'Catat pembayaran'} subtitle={`${studentName} · ${invoice.period}`} onClose={onClose}>
    <div className="payment-total"><span>Total pembayaran</span><strong>{formatRupiah(invoice.amount)}</strong></div>
    <label className="field"><span>Metode pembayaran</span><select value={method} onChange={(event) => setMethod(event.target.value)}><option>Tunai</option><option>Transfer Bank</option><option>QRIS</option></select></label>
    {parentMode && method === 'Transfer Bank' && <div className="bank-box"><div><Landmark size={19} /></div><span><small>Bank Syariah Indonesia</small><strong>7120 8890 123</strong><p>a.n. Pondok Pesantren Al-Hikmah</p></span></div>}
    {parentMode && <label className="upload-box"><Download size={20} /><span><strong>Unggah bukti transfer</strong><small>JPG, PNG, atau PDF · maks. 2 MB</small></span><input type="file" accept=".jpg,.jpeg,.png,.pdf" /></label>}
    <ModalActions onCancel={onClose} submitLabel={parentMode ? 'Kirim bukti pembayaran' : 'Simpan pembayaran'} onSubmit={() => onPay(invoice, method)} />
  </Modal>
}

function ContributionPaymentModal({ contribution, payment, studentName, parentMode, onClose, onPay }: { contribution: Contribution; payment: ContributionPayment; studentName: string; parentMode: boolean; onClose: () => void; onPay: (payment: ContributionPayment, method: string) => void }) {
  const [method, setMethod] = useState(parentMode ? 'Transfer Bank' : 'Tunai')
  return <Modal title={parentMode ? 'Bayar iuran pondok' : 'Catat pembayaran iuran'} subtitle={`${studentName} · ${contribution.name}`} onClose={onClose}>
    <div className="payment-total"><span>Total pembayaran</span><strong>{formatRupiah(contribution.amount)}</strong></div>
    <label className="field"><span>Metode pembayaran</span><select value={method} onChange={(event) => setMethod(event.target.value)}><option>Tunai</option><option>Transfer Bank</option><option>QRIS</option></select></label>
    {parentMode && method === 'Transfer Bank' && <div className="bank-box"><div><Landmark size={19} /></div><span><small>Bank Syariah Indonesia</small><strong>7120 8890 123</strong><p>a.n. Pondok Pesantren Al-Hikmah</p></span></div>}
    {parentMode && <label className="upload-box"><Download size={20} /><span><strong>Unggah bukti pembayaran</strong><small>JPG, PNG, atau PDF · maks. 2 MB</small></span><input type="file" accept=".jpg,.jpeg,.png,.pdf" /></label>}
    <div className="modal-note"><WalletCards size={17} /> Setelah diverifikasi, pembayaran otomatis masuk ke Buku Kas kategori Iuran.</div>
    <ModalActions onCancel={onClose} submitLabel={parentMode ? 'Kirim bukti pembayaran' : 'Simpan pembayaran'} onSubmit={() => onPay(payment, method)} />
  </Modal>
}

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function downloadInvoices(invoices: Invoice[], data: AppData) {
  downloadCsv('laporan-spp.csv', [
    ['Santri', 'NIS', 'Kelas', 'Periode', 'Jatuh Tempo', 'Nominal', 'Status', 'Metode', 'No. Bukti'],
    ...invoices.map((item) => {
      const student = data.students.find((value) => value.id === item.studentId)
      return [student?.name || '', student?.nis || '', student?.className || '', item.period, item.dueDate, item.amount, item.status, item.method || '', item.receipt || '']
    }),
  ])
}

function downloadCash(entries: CashEntry[]) {
  downloadCsv('buku-kas.csv', [['Tanggal', 'Keterangan', 'Kategori', 'Jenis', 'Nominal', 'Referensi', 'Petugas'], ...entries.map((item) => [item.date, item.description, item.category, item.type === 'in' ? 'Masuk' : 'Keluar', item.amount, item.ref || '', item.officer])])
}

function downloadContributions(data: AppData) {
  downloadCsv('laporan-iuran.csv', [
    ['Nama Iuran', 'Kategori', 'Santri', 'NIS', 'Nominal', 'Jatuh Tempo', 'Status', 'Metode', 'Referensi'],
    ...data.contributionPayments.map((payment) => {
      const contribution = data.contributions.find((item) => item.id === payment.contributionId)
      const student = data.students.find((item) => item.id === payment.studentId)
      return [contribution?.name ?? '', contribution?.category ?? '', student?.name ?? '', student?.nis ?? '', contribution?.amount ?? 0, contribution?.dueDate ?? '', payment.status, payment.method ?? '', payment.receipt ?? '']
    }),
  ])
}

function downloadSavings(entries: SavingEntry[], data: AppData) {
  downloadCsv('laporan-tabungan-santri.csv', [
    ['Tanggal', 'Santri', 'NIS', 'Jenis', 'Nominal', 'Keterangan', 'Referensi', 'Petugas'],
    ...entries.map((item) => {
      const student = data.students.find((value) => value.id === item.studentId)
      return [item.date, student?.name ?? '', student?.nis ?? '', item.type === 'deposit' ? 'Setoran' : 'Penarikan', item.amount, item.description, item.ref, item.officer]
    }),
  ])
}

export default App
