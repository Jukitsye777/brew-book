import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Coffee,
  Eye,
  History,
  LogOut,
  Settings,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { authClient } from '#/lib/auth-client'
import { completeOnboarding, createGuest, getAdminDashboard, getCompanies, getDrinkDay, getGuestSession, getProfile, leaveGuest, saveDefault, saveResponse, updateGuestRequest, updateUserResponse, drinks, periods, type AdminDashboard, type Company, type CompanyRecord, type Drink, type DrinkChoice, type GuestSession, type Period, type PollRecord, type SugarChoice, type User } from '#/lib/drinks'

type AppState = { user: User | null; defaults: DrinkChoice; sugarDefaults: SugarChoice; entries: Record<string, PollRecord[]> }
type View = 'today' | 'history' | 'defaults' | 'admin'
type OpenPoll = { date: string; period: Period } | null
type OnboardingState = { company: Company | ''; defaults: DrinkChoice; sugarDefaults: SugarChoice; step: 'company' | 'morning' | 'evening' }

const periodDetails: Array<{ id: Period; label: string; helper: string }> = [
  { id: 'morning', label: 'Morning', helper: 'Before the first prep round' },
  { id: 'evening', label: 'Evening', helper: 'For the afternoon round' },
]
const dateFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' })
const displayDateFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Asia/Kolkata' })
const chipDayFormatter = new Intl.DateTimeFormat('en-US', { day: 'numeric', timeZone: 'Asia/Kolkata' })
const todayKey = dateFormatter.format(new Date())
const initialState: AppState = { user: null, defaults: { morning: 'No drink', evening: 'No drink' }, sugarDefaults: { morning: true, evening: true }, entries: {} }

function dateKeyOffset(offset: number) { const date = new Date(); date.setDate(date.getDate() - offset); return dateFormatter.format(date) }
function displayDate(dateKey: string) { return displayDateFormatter.format(new Date(`${dateKey}T12:00:00`)) }
function displayChipDay(dateKey: string) { return chipDayFormatter.format(new Date(`${dateKey}T12:00:00`)) }
function initials(name: string) { return name.split(' ').map((part) => part[0]).join('') }
function readState(): AppState { return initialState }
function cx(...classes: Array<string | false | null | undefined>) { return classes.filter(Boolean).join(' ') }
function countChoices(entries: DrinkChoice[]) { return periods.reduce((result, period) => { result[period] = drinks.reduce<Record<string, number>>((counts, drink) => { counts[drink] = entries.filter((entry) => entry[period] === drink).length; return counts }, {}); return result }, {} as Record<Period, Record<string, number>>) }

function App() {
  const [state, setState] = useState<AppState>(readState)
  const [view, setView] = useState<View>('today')
  const [historyDate, setHistoryDate] = useState(dateKeyOffset(1))
  const [openPoll, setOpenPoll] = useState<OpenPoll>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profileReady, setProfileReady] = useState(false)
  const [onboarding, setOnboarding] = useState<OnboardingState | null>(null)
  const [localUser, setLocalUser] = useState<User | null>(null)
  const [localComplete, setLocalComplete] = useState(false)
  const [guestSession, setGuestSession] = useState<GuestSession | null>(null)
  const [guestPending, setGuestPending] = useState(true)
  const [guestSetup, setGuestSetup] = useState(false)
  const [accessDenied, setAccessDenied] = useState(false)
  const [adminData, setAdminData] = useState<AdminDashboard | null>(null)
  const { data: session, isPending: authPending } = authClient.useSession()
  const sessionUserId = session?.user?.id
  const sessionUserName = session?.user?.name
  const sessionUserEmail = session?.user?.email
  const sessionUserImage = session?.user?.image
  const todayPoll = state.user ? state.entries[todayKey]?.find((entry) => entry.user.email === state.user?.email) : undefined
  const todaysEntry = todayPoll?.choices ?? state.defaults
  const todaysSugar = todayPoll?.sugar ?? state.sugarDefaults
  const todayPolls = state.entries[todayKey] ?? []
  const isGuest = Boolean(guestSession)
  useEffect(() => {
    void getGuestSession().then(setGuestSession).catch(() => setGuestSession(null)).finally(() => setGuestPending(false))
  }, [])
  useEffect(() => {
    let cancelled = false
    if (localUser) {
      setState({ ...initialState, user: localUser })
      setOnboarding({ company: 'Local', defaults: initialState.defaults, sugarDefaults: initialState.sugarDefaults, step: 'morning' })
      setProfileReady(true)
      return () => { cancelled = true }
    }
    if (guestSession) {
      setState({ ...initialState, user: guestSession.user, defaults: guestSession.defaults, sugarDefaults: guestSession.sugarDefaults, entries: { [todayKey]: guestSession.responses } })
      setOnboarding(null)
      setProfileReady(true)
      return () => { cancelled = true }
    }
    if (!sessionUserId || !sessionUserName || !sessionUserEmail) { setState(initialState); setProfileReady(false); setOnboarding(null); return () => { cancelled = true } }
    const user = { id: sessionUserId, name: sessionUserName, email: sessionUserEmail, image: sessionUserImage }
    setState((current) => ({ ...current, user }))
    setProfileReady(false)
    void getProfile().then((profile) => {
      if (cancelled) return
      setState((current) => ({ ...current, user: { ...user, role: profile.role }, defaults: profile.defaults, sugarDefaults: profile.sugarDefaults }))
      setAccessDenied(profile.accessDenied)
      if (profile.needsOnboarding) {
        setOnboarding({ company: profile.company ?? '', defaults: profile.defaults, sugarDefaults: profile.sugarDefaults, step: 'morning' })
        setProfileReady(true)
        return null
      }
      return getDrinkDay(todayKey).then((day) => {
        if (cancelled) return
        setState((current) => ({ ...current, user, defaults: day.defaults, entries: { ...current.entries, [todayKey]: day.responses } }))
        setProfileReady(true)
        setError(null)
      })
    }).catch((reason: unknown) => { if (!cancelled) { setProfileReady(true); setError(reason instanceof Error ? reason.message : 'Unable to load your profile') } })
    return () => { cancelled = true }
  }, [guestSession, localUser, sessionUserEmail, sessionUserId, sessionUserImage, sessionUserName])
  useEffect(() => {
    if (!state.user?.role || state.user.role !== 'admin' || view !== 'admin') return
    void getAdminDashboard().then(setAdminData).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Unable to load admin view'))
  }, [state.user?.role, view])
  useEffect(() => {
    if ((!sessionUserId && !guestSession) || view !== 'history') return
    let cancelled = false
    void getDrinkDay(historyDate).then((day) => {
      if (cancelled) return
      setState((current) => ({ ...current, defaults: day.defaults, sugarDefaults: day.sugarDefaults, entries: { ...current.entries, [historyDate]: day.responses } }))
      setError(null)
    }).catch((reason: unknown) => { if (!cancelled) setError(reason instanceof Error ? reason.message : 'Unable to load history') })
    return () => { cancelled = true }
  }, [guestSession, historyDate, sessionUserId, view])
  useEffect(() => {
    if ((!sessionUserId && !guestSession) || !openPoll || state.entries[openPoll.date]) return
    let cancelled = false
    void getDrinkDay(openPoll.date).then((day) => {
      if (cancelled) return
      setState((current) => ({ ...current, entries: { ...current.entries, [openPoll.date]: day.responses } }))
    }).catch((reason: unknown) => { if (!cancelled) setError(reason instanceof Error ? reason.message : 'Unable to load poll details') })
    return () => { cancelled = true }
  }, [guestSession, openPoll, sessionUserId, state.entries])

  function signIn() { void authClient.signIn.social({ provider: 'google', callbackURL: '/' }) }
  function signOut() { if (guestSession) void leaveGuest(); else void authClient.signOut(); setGuestSession(null); setGuestSetup(false); setAccessDenied(false); setAdminData(null); setLocalUser(null); setLocalComplete(false); setState((current) => ({ ...current, user: null })) }
  function signUpLocally() { setLocalComplete(false); setLocalUser({ id: 'local-test-user', name: 'Local test user', email: 'local@brewbook.test' }) }
  async function finishGuestSetup(name: string, company: Company) { try { const nextGuest = await createGuest({ name, company }); setGuestSession(nextGuest); setGuestSetup(false); setError(null) } catch (reason: unknown) { setError(reason instanceof Error ? reason.message : 'Unable to start guest access') } }
  async function finishOnboarding() {
    const currentOnboarding = onboarding
    if (!currentOnboarding?.company) return
    if (localUser) { setOnboarding(null); setLocalComplete(true); return }
    try {
      const profile = await completeOnboarding({ company: currentOnboarding.company, defaults: currentOnboarding.defaults, sugarDefaults: currentOnboarding.sugarDefaults })
      const day = await getDrinkDay(todayKey)
      setState((current) => ({ ...current, defaults: profile.defaults, sugarDefaults: profile.sugarDefaults, entries: { ...current.entries, [todayKey]: day.responses } }))
      setOnboarding(null)
      setError(null)
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'Unable to save your setup')
    }
  }
  function updateEntry(period: Period, drink: Drink) {
    if (!state.user) return
    const existing = state.entries[todayKey]?.find((entry) => entry.user.email === state.user?.email)
    const choices = { ...(existing?.choices ?? state.defaults), [period]: drink }
    const sugar = existing?.sugar?.[period] ?? state.sugarDefaults[period]
    setState((current) => {
      if (!current.user) return current
      const nextEntries = (current.entries[todayKey] ?? []).map((entry) => entry.user.email === current.user?.email ? { ...entry, choices, sugar: { ...entry.sugar, [period]: sugar }, sources: { ...entry.sources, [period]: 'manual' as const } } : entry)
      return {
        ...current,
        entries: { ...current.entries, [todayKey]: nextEntries },
      }
    })
    void saveResponse({ date: todayKey, period, drink, sugar }).then((day) => {
      setState((current) => ({ ...current, defaults: day.defaults, sugarDefaults: day.sugarDefaults, entries: { ...current.entries, [todayKey]: day.responses } }))
      setError(null)
    }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Unable to save your drink'))
  }

  function updateDefault(period: Period, drink: Drink, sugar: boolean) {
    setState((current) => ({ ...current, defaults: { ...current.defaults, [period]: drink }, sugarDefaults: { ...current.sugarDefaults, [period]: sugar } }))
    void saveDefault({ period, drink, sugar }).then((settings) => { setState((current) => ({ ...current, defaults: settings.defaults, sugarDefaults: settings.sugarDefaults })); setError(null) }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Unable to save your default'))
  }
  function updateSugar(period: Period, sugar: boolean) {
    if (!state.user) return
    const existing = state.entries[todayKey]?.find((entry) => entry.user.email === state.user?.email)
    const drink = existing?.choices[period] ?? state.defaults[period]
    setState((current) => ({ ...current, entries: { ...current.entries, [todayKey]: (current.entries[todayKey] ?? []).map((entry) => entry.user.email === current.user?.email ? { ...entry, sugar: { ...entry.sugar, [period]: sugar }, sources: { ...entry.sources, [period]: 'manual' as const } } : entry) } }))
    void saveResponse({ date: todayKey, period, drink, sugar }).then((day) => { setState((current) => ({ ...current, defaults: day.defaults, sugarDefaults: day.sugarDefaults, entries: { ...current.entries, [todayKey]: day.responses } })); setError(null) }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Unable to save sugar preference'))
  }

  if (authPending || guestPending) return <AuthLoading />
  if (!session?.user && !localUser && !guestSession) return guestSetup ? <GuestSetupPage onSubmit={finishGuestSetup} onBack={() => { setGuestSetup(false); setError(null) }} error={error} /> : <SignInPage signIn={signIn} onGuest={() => { setGuestSetup(true); setError(null) }} onLocalSignUp={import.meta.env.DEV ? signUpLocally : undefined} />
  if (localComplete) return <LocalSetupComplete onReset={signOut} />
  if (!state.user) return <AuthLoading />
  if (!profileReady) return <AuthLoading message="Loading your workspace..." />
  if (accessDenied) return <AccessDeniedPage onSignOut={signOut} />
  if (guestSession?.status === 'pending') return <GuestPendingPage onExit={signOut} />
  if (guestSession?.status === 'rejected') return <GuestRejectedPage onExit={signOut} />
  if (onboarding) return <OnboardingPage state={onboarding} setState={setOnboarding} onComplete={finishOnboarding} error={error} />
  const visiblePolls = view === 'history' ? (state.entries[historyDate] ?? []) : todayPolls
  const openPollData = openPoll ? (state.entries[openPoll.date] ?? []) : []
  return <main className="min-h-svh bg-[#f6f5f1] text-[#2d2925] pb-20 lg:pb-0">
    <header className="border-b border-[#e6e0d6] bg-[#fffdf9]"><div className="mx-auto flex max-w-[1180px] items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8"><div className="flex items-center gap-2.5"><BrandMark /><span className="font-serif text-xl font-semibold tracking-[-0.02em]">BrewBook</span></div><div className="relative"><button className="grid size-9 place-items-center rounded-full bg-[#dfc5a5] text-xs font-semibold text-[#5a3c26] transition hover:ring-2 hover:ring-[#a36f43]/40" onClick={() => setProfileOpen((open) => !open)} type="button" aria-label="Open profile" aria-expanded={profileOpen}>{initials(state.user.name)}</button>{profileOpen && <div className="absolute right-0 top-11 z-20 w-64 rounded-2xl border border-[#e6e0d6] bg-[#fffdf9] p-4 shadow-xl"><p className="text-sm font-semibold text-[#33271f]">{state.user.name}</p><p className="mt-1 break-words text-xs text-[#887f74]">{isGuest ? 'Guest access' : state.user.email}</p><button className="mt-4 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#5a3c26] text-sm font-semibold text-white transition hover:bg-[#68452e]" onClick={signOut} type="button"><LogOut size={16} />Exit</button></div>}</div></div></header>
    {error && <div className="mx-auto mt-4 max-w-[1180px] px-4 sm:px-6 lg:px-8"><div className="rounded-xl border border-[#e7cfc3] bg-[#fff5f0] px-3 py-2 text-sm text-[#8b4d35]" role="alert">{error}</div></div>}
    <div className="mx-auto grid max-w-[1180px] gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[190px_1fr] lg:gap-10 lg:px-8 lg:py-8"><aside className="hidden lg:block lg:sticky lg:top-8 lg:h-fit"><Nav guest={isGuest} admin={state.user.role === 'admin'} view={view} setView={setView} /></aside><section className="min-w-0">{view === 'today' && <TodayView entry={todaysEntry} sugar={todaysSugar} todayPolls={todayPolls} updateEntry={updateEntry} updateSugar={updateSugar} onOpen={(period) => setOpenPoll({ date: todayKey, period })} />}{view === 'history' && <HistoryView date={historyDate} setDate={setHistoryDate} polls={visiblePolls} />}{view === 'defaults' && <DefaultsView defaults={state.defaults} sugarDefaults={state.sugarDefaults} updateDefault={updateDefault} />}{view === 'admin' && <AdminView data={adminData} onRefresh={() => void getAdminDashboard().then(setAdminData)} />}</section></div>
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#e6e0d6] bg-[#fffdf9]/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur sm:px-4 lg:hidden"><Nav guest={isGuest} admin={state.user.role === 'admin'} view={view} setView={setView} /></div>
    {openPoll && <PollDetailsSheet date={openPoll.date} period={openPoll.period} polls={openPollData} onClose={() => setOpenPoll(null)} />}
  </main>
}

function GuestSetupPage({ onSubmit, onBack, error }: { onSubmit: (name: string, company: Company) => void; onBack: () => void; error: string | null }) { const [step, setStep] = useState<'name' | 'company'>('name'); const [name, setName] = useState(''); const [company, setCompany] = useState(''); const [companies, setCompanies] = useState<CompanyRecord[]>([]); useEffect(() => { void getCompanies().then(setCompanies).catch(() => undefined) }, []); return <main className="grid min-h-svh place-items-center bg-[#f6f5f1] px-5 py-10 text-[#33271f]"><section className="w-full max-w-sm rounded-3xl bg-[#fffdf9] p-6 shadow-[0_20px_60px_rgba(77,57,38,0.1)] sm:p-8"><h1 className="font-serif text-3xl">{step === 'name' ? 'What is your name?' : 'Choose your company'}</h1>{error && <p className="mt-4 rounded-xl border border-[#e7cfc3] bg-[#fff5f0] px-3 py-2 text-sm text-[#8b4d35]" role="alert">{error}</p>}{step === 'name' ? <><label className="mt-7 block text-sm font-semibold text-[#33271f]">Name<input className="mt-2 h-12 w-full rounded-xl border border-[#e6e0d6] bg-[#fffdf9] px-3 text-sm outline-none transition focus:border-[#a36f43]" onChange={(event) => setName(event.target.value)} placeholder="Your name" value={name} /></label><button disabled={name.trim().length < 2} onClick={() => setStep('company')} type="button" className="mt-7 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#5a3c26] px-3 text-sm font-semibold text-white transition hover:bg-[#68452e] disabled:cursor-not-allowed disabled:opacity-45">Next<ArrowRight size={16} /></button><button onClick={onBack} type="button" className="mt-3 w-full text-sm font-semibold text-[#68452e] underline underline-offset-4">Back</button></> : <><div className="mt-7 grid gap-2">{companies.map((item) => <button key={item.id} onClick={() => setCompany(item.name)} type="button" className={cx('flex min-h-12 items-center justify-between rounded-xl border px-3 text-left text-sm font-semibold transition', company === item.name ? 'border-[#a36f43] bg-[#f6ece1] text-[#68452e]' : 'border-[#eee8df] text-[#665b50] hover:border-[#dbc9b6]')}>{item.name}{company === item.name && <Check size={16} />}</button>)}</div><div className="mt-7 flex gap-2"><button onClick={() => setStep('name')} type="button" className="min-h-11 flex-1 rounded-xl border border-[#e6e0d6] px-3 text-sm font-semibold text-[#68452e]">Back</button><button disabled={!company} onClick={() => onSubmit(name.trim(), company)} type="button" className="min-h-11 flex-[1.5] rounded-xl bg-[#5a3c26] px-3 text-sm font-semibold text-white transition hover:bg-[#68452e] disabled:cursor-not-allowed disabled:opacity-45">Request access</button></div></>}</section></main> }
function AdminView({ data, onRefresh }: { data: AdminDashboard | null; onRefresh: () => void }) { if (!data) return <AuthLoading message="Loading admin view..." />; return <div className="grid gap-5"><PageHeader eyebrow="Admin" title="Manage today" action={data.pendingGuests.length ? `${data.pendingGuests.length} pending` : 'No pending guests'} />{data.pendingGuests.length > 0 && <section className="rounded-2xl border border-[#e6e0d6] bg-[#fffdf9] p-4"><h2 className="text-sm font-semibold text-[#33271f]">Guest requests</h2><div className="mt-3 grid gap-2">{data.pendingGuests.map((guest) => <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f8f5f0] px-3 py-3" key={guest.id}><div className="min-w-0"><p className="truncate text-sm font-semibold">{guest.name}</p><p className="text-xs text-[#887f74]">{guest.company ?? 'Unknown company'}</p></div><div className="flex shrink-0 gap-2"><button onClick={() => void updateGuestRequest({ type: 'reject', userId: guest.id }).then(onRefresh)} type="button" className="min-h-9 rounded-lg border border-[#e6e0d6] px-3 text-xs font-semibold text-[#68452e]">Decline</button><button onClick={() => void updateGuestRequest({ type: 'approve', userId: guest.id }).then(onRefresh)} type="button" className="min-h-9 rounded-lg bg-[#5a3c26] px-3 text-xs font-semibold text-white">Approve</button></div></div>)}</div></section>}<section className="rounded-2xl border border-[#e6e0d6] bg-[#fffdf9] p-4"><h2 className="text-sm font-semibold text-[#33271f]">Today’s choices</h2><div className="mt-3 grid gap-3">{data.responses.map((poll) => <AdminResponseRow key={poll.user.id ?? poll.user.email} poll={poll} onRefresh={onRefresh} />)}</div></section></div> }
function AdminResponseRow({ poll, onRefresh }: { poll: PollRecord; onRefresh: () => void }) { const update = (period: Period, drink: Drink) => { if (!poll.user.id) return; void updateUserResponse({ userId: poll.user.id, period, drink, sugar: drink === 'No drink' ? true : poll.sugar[period] }).then(onRefresh) }; return <article className="rounded-xl bg-[#f8f5f0] p-3"><div className="flex items-center justify-between gap-3"><p className="truncate text-sm font-semibold">{poll.user.name}</p><span className="text-xs text-[#887f74]">{poll.user.email.startsWith('guest-') ? 'Guest' : 'Member'}</span></div><div className="mt-2 grid gap-2 sm:grid-cols-2">{periods.map((period) => <label className="text-xs font-semibold text-[#887f74]" key={period}>{period === 'morning' ? 'Morning' : 'Evening'}<select className="mt-1 h-10 w-full rounded-lg border border-[#e6e0d6] bg-[#fffdf9] px-2 text-sm font-semibold text-[#68452e]" onChange={(event) => update(period, event.target.value as Drink)} value={poll.choices[period]}>{drinks.map((drink) => <option key={drink}>{drink}</option>)}</select></label>)}</div></article> }

function Nav({ view, setView, guest = false, admin = false }: { view: View; setView: (view: View) => void; guest?: boolean; admin?: boolean }) { const items: Array<{ id: View; label: string; icon: React.ReactNode }> = [{ id: 'today', label: 'Today', icon: <CalendarDays size={18} /> }, ...(!guest ? [{ id: 'history' as View, label: 'History', icon: <History size={18} /> }, { id: 'defaults' as View, label: 'Defaults', icon: <Settings size={18} /> }, ...(!admin ? [] : [{ id: 'admin' as View, label: 'Admin', icon: <Settings size={18} /> }])] : [])]; return <nav className={cx('grid gap-2', guest ? 'grid-cols-1 lg:grid-cols-1' : 'grid-cols-3 lg:grid-cols-1')}>{items.map((item) => <button key={item.id} onClick={() => setView(item.id)} type="button" className={cx('flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[11px] font-semibold transition lg:flex-row lg:justify-start lg:gap-2 lg:px-3 lg:text-sm', view === item.id ? 'bg-[#5a3c26] text-white' : 'text-[#887f74] hover:bg-[#f1ede6] hover:text-[#5a3c26]')}>{item.icon}<span>{item.label}</span>{view === item.id && <ChevronRight className="ml-auto hidden lg:block" size={15} />}</button>)}</nav> }
function BrandMark({ className = 'size-8', iconSize = 17, iconColor = 'currentColor' }: { className?: string; iconSize?: number; iconColor?: string }) { return <div className={cx('grid place-items-center rounded-[10px] bg-[#5a3c26] text-[#fff9ef]', className)}><Coffee color={iconColor} size={iconSize} strokeWidth={2.2} /></div> }

function AuthLoading({ message = 'Checking your account...' }: { message?: string }) { return <main className="grid min-h-svh place-items-center bg-[#f6f5f1]"><output aria-label={message} className="size-10 animate-spin rounded-full border-2 border-[#e6e0d6] border-t-[#5a3c26]" /></main> }
function SignInPage({ signIn, onGuest, onLocalSignUp }: { signIn: () => void; onGuest: () => void; onLocalSignUp?: () => void }) { return <main className="relative grid min-h-svh place-items-center overflow-hidden bg-[#f6f5f1] px-5 py-10 text-[#fff9ef]"><div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden text-[#c9ad90]/35"><Coffee className="absolute -right-24 -top-20 size-[30rem] rotate-12" strokeWidth={0.7} /><Coffee className="absolute -bottom-32 -left-24 size-[24rem] -rotate-12 text-[#e0d0bf]" strokeWidth={0.7} /></div><section className="relative z-10 flex w-full max-w-sm flex-col items-center rounded-3xl bg-[#5a3c26] px-6 py-9 text-center shadow-[0_20px_60px_rgba(77,57,38,0.2)] sm:px-8"><BrandMark className="size-16 rounded-[18px] bg-[#fff9ef] text-[#5a3c26]" iconColor="#5a3c26" iconSize={30} /><h1 className="mt-7 font-serif text-5xl leading-tight">BrewBook</h1><p className="mt-4 max-w-xs text-[15px] leading-6 text-[#e7d8c4]">Use your work email to continue.</p><button onClick={signIn} type="button" className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#fff9ef] text-sm font-semibold text-[#5a3c26] shadow-[0_12px_30px_rgba(38,24,16,0.22)] transition hover:bg-white"><img alt="" className="size-5" src="/google-g.png" />Continue with Google<ArrowRight size={17} /></button><button onClick={onGuest} type="button" className="mt-3 text-sm font-semibold text-[#e7d8c4] underline decoration-[#c9ad90] underline-offset-4">Continue as guest</button>{onLocalSignUp && <button onClick={onLocalSignUp} type="button" className="mt-2 text-xs font-semibold text-[#e7d8c4] underline decoration-[#c9ad90] underline-offset-4">Sign up locally</button>}</section></main> }

function AccessDeniedPage({ onSignOut }: { onSignOut: () => void }) { return <main className="grid min-h-svh place-items-center bg-[#f6f5f1] px-5 text-[#33271f]"><section className="w-full max-w-sm rounded-3xl bg-[#fffdf9] p-8 text-center shadow-[0_20px_60px_rgba(77,57,38,0.1)]"><h1 className="font-serif text-3xl">Work email not recognized</h1><p className="mt-3 text-sm leading-6 text-[#887f74]">Ask your company admin to add your email domain to BrewBook.</p><button onClick={onSignOut} type="button" className="mt-7 min-h-11 rounded-xl bg-[#5a3c26] px-5 text-sm font-semibold text-white">Sign out</button></section></main> }
function GuestPendingPage({ onExit }: { onExit: () => void }) { return <main className="grid min-h-svh place-items-center bg-[#f6f5f1] px-5 text-[#33271f]"><section className="w-full max-w-sm rounded-3xl bg-[#fffdf9] p-8 text-center shadow-[0_20px_60px_rgba(77,57,38,0.1)]"><h1 className="font-serif text-3xl">Waiting for approval</h1><p className="mt-3 text-sm leading-6 text-[#887f74]">A company admin needs to approve your guest request before you can join today’s polls.</p><button onClick={onExit} type="button" className="mt-7 min-h-11 rounded-xl border border-[#e6e0d6] px-5 text-sm font-semibold text-[#68452e]">Exit guest access</button></section></main> }
function GuestRejectedPage({ onExit }: { onExit: () => void }) { return <main className="grid min-h-svh place-items-center bg-[#f6f5f1] px-5 text-[#33271f]"><section className="w-full max-w-sm rounded-3xl bg-[#fffdf9] p-8 text-center shadow-[0_20px_60px_rgba(77,57,38,0.1)]"><h1 className="font-serif text-3xl">Guest request declined</h1><p className="mt-3 text-sm leading-6 text-[#887f74]">Ask the company admin to approve your guest access.</p><button onClick={onExit} type="button" className="mt-7 min-h-11 rounded-xl border border-[#e6e0d6] px-5 text-sm font-semibold text-[#68452e]">Exit guest access</button></section></main> }


function OnboardingPage({ state, setState, onComplete, error }: { state: OnboardingState; setState: (state: OnboardingState) => void; onComplete: () => void; error: string | null }) { const period = state.step === 'morning' ? periodDetails[0] : periodDetails[1]; const next = () => { if (state.step === 'morning') setState({ ...state, step: 'evening' }); else onComplete() }; const back = () => { if (state.step === 'evening') setState({ ...state, step: 'morning' }) }; const updateSugar = (sugar: boolean) => setState({ ...state, sugarDefaults: { ...state.sugarDefaults, [period.id]: sugar } }); return <main className="flex min-h-svh items-center justify-center bg-[#f6f5f1] px-4 py-8 text-[#33271f]"><section className="mx-auto w-full max-w-lg rounded-3xl bg-[#fffdf9] p-5 shadow-[0_20px_60px_rgba(77,57,38,0.1)] sm:p-8"><div className="flex items-start justify-between gap-4"><h1 className="mt-2 max-w-full font-serif text-xl leading-tight text-[#33271f] sm:text-2xl">Choose your {period.label.toLowerCase()} default</h1><SugarToggle compact disabled={state.defaults[period.id] === 'No drink'} sugar={state.sugarDefaults[period.id]} onChange={updateSugar} /></div>{error && <p className="mt-3 rounded-xl border border-[#e7cfc3] bg-[#fff5f0] px-3 py-2 text-sm text-[#8b4d35]" role="alert">{error}</p>}<div className="mt-8 grid grid-cols-1 gap-2">{drinks.map((drink) => <button key={drink} onClick={() => setState({ ...state, defaults: { ...state.defaults, [period.id]: drink } })} type="button" className={cx('flex min-h-12 min-w-0 items-center justify-between rounded-xl border px-3 text-left text-sm font-semibold transition', state.defaults[period.id] === drink ? 'border-[#a36f43] bg-[#f6ece1] text-[#68452e]' : 'border-[#eee8df] text-[#665b50] hover:border-[#dbc9b6]')}>{drink}{state.defaults[period.id] === drink && <Check size={15} />}</button>)}</div><div className="mt-8 flex items-center gap-2">{state.step === 'evening' && <button onClick={back} type="button" className="flex min-h-11 items-center gap-2 rounded-xl border border-[#e6e0d6] px-4 text-sm font-semibold text-[#68452e] transition hover:bg-[#fdf8f1]"><ArrowLeft size={16} />Back</button>}<button disabled={!state.defaults[period.id]} onClick={next} type="button" className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#5a3c26] px-4 text-sm font-semibold text-white transition hover:bg-[#68452e] disabled:cursor-not-allowed disabled:opacity-45">{state.step === 'evening' ? 'Finish setup' : 'Next'}<ArrowRight size={17} /></button></div></section></main> }
function LocalSetupComplete({ onReset }: { onReset: () => void }) { return <main className="grid min-h-svh place-items-center bg-[#f6f5f1] px-5 py-10 text-[#33271f]"><section className="w-full max-w-sm rounded-3xl bg-[#fffdf9] p-8 text-center shadow-[0_20px_60px_rgba(77,57,38,0.1)]"><div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#5a3c26] text-[#fff9ef]"><Check size={26} /></div><h1 className="mt-6 font-serif text-3xl">Setup complete</h1><p className="mt-2 text-sm leading-6 text-[#887f74]">The local test flow is complete. The app is not loaded in local signup mode.</p><button onClick={onReset} type="button" className="mt-7 min-h-11 rounded-xl bg-[#5a3c26] px-4 text-sm font-semibold text-white">Run setup again</button></section></main> }
function TodayView({ entry, sugar, todayPolls, updateEntry, updateSugar, onOpen }: { entry: DrinkChoice; sugar: SugarChoice; todayPolls: PollRecord[]; updateEntry: (period: Period, drink: Drink) => void; updateSugar: (period: Period, sugar: boolean) => void; onOpen: (period: Period) => void }) { return <div className="grid gap-5"><PageHeader eyebrow={displayDate(todayKey)} title="Today" action={`${todayPolls.length} people`} /><div className="grid gap-3">{periodDetails.map((period) => <DrinkPoll key={period.id} period={period} polls={todayPolls} selected={entry[period.id]} sugar={sugar[period.id]} editable onSelect={(drink) => updateEntry(period.id, drink)} onToggleSugar={(next) => updateSugar(period.id, next)} onOpen={() => onOpen(period.id)} />)}</div></div> }
function HistoryView({ date, setDate, polls }: { date: string; setDate: (date: string) => void; polls: PollRecord[] }) { const dates = Array.from({ length: 7 }, (_, index) => dateKeyOffset(index + 1)); return <div className="grid gap-5"><PageHeader eyebrow="History" title={displayDate(date)} action={polls.length ? `${polls.length} people` : 'No responses'} /><div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-0 sm:-mx-6 sm:px-6">{dates.map((item) => <button key={item} onClick={() => setDate(item)} type="button" className={cx('shrink-0 rounded-lg border px-3 py-2 text-left text-sm font-semibold transition', date === item ? 'border-[#5a3c26] bg-[#5a3c26] text-white' : 'border-[#e6e0d6] bg-[#fffdf9] text-[#887f74]')}><span className="block text-xs font-normal opacity-75">{displayDate(item).split(',')[0]}</span>{displayChipDay(item)}</button>)}</div><HistoryResponseCards polls={polls} /></div> }
function HistoryResponseCards({ polls }: { polls: PollRecord[] }) { if (!polls.length) return <div className="rounded-2xl border border-dashed border-[#dbcfc1] bg-[#fffdf9] px-4 py-8 text-center text-sm text-[#887f74]">No responses for this day.</div>; return <div className="grid gap-3">{polls.map((poll) => <article className="rounded-2xl border border-[#e6e0d6] bg-[#fffdf9] p-4 shadow-[0_8px_30px_rgba(77,57,38,0.04)]" key={poll.user.email}><div className="flex items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#eee1d1] text-xs font-semibold text-[#68452e]">{initials(poll.user.name)}</span><div className="min-w-0"><p className="truncate text-sm font-semibold text-[#33271f]">{poll.user.name}</p><p className="text-xs text-[#9a9084]">Drink choices</p></div></div><div className="mt-4 grid grid-cols-2 gap-2"><HistoryChoice label="Morning" drink={poll.choices.morning} sugar={poll.sugar.morning} source={poll.sources.morning} /><HistoryChoice label="Evening" drink={poll.choices.evening} sugar={poll.sugar.evening} source={poll.sources.evening} /></div></article>)}</div> }
function HistoryChoice({ label, drink, sugar, source }: { label: string; drink: Drink; sugar: boolean; source: 'default' | 'manual' }) { return <div className="rounded-xl bg-[#f8f5f0] px-3 py-2.5"><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a9084]">{label}</p><p className="mt-1 truncate text-sm font-semibold text-[#68452e]">{drink}</p><p className="mt-1 text-[11px] text-[#9a9084]">{sugar ? 'Sugar' : 'No sugar'} · {source === 'default' ? 'Default' : 'Manual'}</p></div> }
function DefaultsView({ defaults, sugarDefaults, updateDefault }: { defaults: DrinkChoice; sugarDefaults: SugarChoice; updateDefault: (period: Period, drink: Drink, sugar: boolean) => void }) { return <div className="grid gap-5"><PageHeader eyebrow="Defaults" title="Choose drinks" /><div className="grid gap-3">{periodDetails.map((period) => <DefaultDrinkSetting key={period.id} period={period} selected={defaults[period.id]} sugar={sugarDefaults[period.id]} onSelect={(drink) => updateDefault(period.id, drink, sugarDefaults[period.id])} onToggleSugar={(sugar) => updateDefault(period.id, defaults[period.id], sugar)} />)}</div></div> }
function DefaultDrinkSetting({ period, selected, sugar, onSelect, onToggleSugar }: { period: { id: Period; label: string; helper: string }; selected: Drink; sugar: boolean; onSelect: (drink: Drink) => void; onToggleSugar: (sugar: boolean) => void }) { return <section className="rounded-2xl border border-[#e6e0d6] bg-[#fffdf9] p-4 shadow-[0_8px_30px_rgba(77,57,38,0.04)] sm:p-5"><div className="flex items-start justify-between gap-3"><div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#f1ede6] text-[#a36f43]"><Coffee size={17} /></span><h2 className="pt-1 text-sm font-semibold text-[#33271f]">{period.label}</h2></div><SugarToggle compact disabled={selected === 'No drink'} sugar={sugar} onChange={onToggleSugar} /></div><div className="mt-4 grid grid-cols-1 gap-2">{drinks.map((drink) => <button key={drink} onClick={() => onSelect(drink)} type="button" className={cx('flex min-h-11 items-center justify-between rounded-xl border px-3 text-left text-sm font-semibold transition', selected === drink ? 'border-[#a36f43] bg-[#f6ece1] text-[#68452e]' : 'border-[#eee8df] text-[#665b50] hover:border-[#dbc9b6]')}>{drink}{selected === drink && <Check size={15} />}</button>)}</div></section> }
function PageHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: string }) { return <div className="flex items-end justify-between gap-4 border-b border-[#e6e0d6] pb-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a36f43]">{eyebrow}</p><h1 className="mt-1 font-serif text-3xl tracking-[-0.03em] text-[#33271f] sm:text-4xl">{title}</h1></div>{action && <span className="shrink-0 text-xs font-semibold text-[#9a9084]">{action}</span>}</div> }

function SugarToggle({ sugar, onChange, compact = false, disabled = false }: { sugar: boolean; onChange: (sugar: boolean) => void; compact?: boolean; disabled?: boolean }) { return <button aria-label="Sugar Free" aria-pressed={!sugar} disabled={disabled} className={cx(compact ? 'flex shrink-0 items-center gap-2 text-xs font-semibold text-[#68452e]' : 'mt-3 flex min-h-10 w-full items-center justify-between rounded-xl border border-[#e6e0d6] px-3 text-left transition hover:border-[#a36f43]', disabled && 'cursor-not-allowed opacity-45')} onClick={() => onChange(!sugar)} type="button"><span className={cx(compact ? 'whitespace-nowrap' : '')}><span className={cx('block font-semibold', compact ? 'text-xs' : 'text-sm')}>Sugar Free</span>{!compact && <span className="block text-xs text-[#9a9084]">{sugar ? 'Off' : 'On'}</span>}</span><span className={cx('relative h-6 w-11 rounded-full transition', sugar ? 'bg-[#d8cec2]' : 'bg-[#a36f43]')}><span className={cx('absolute top-1 size-4 rounded-full bg-white transition', sugar ? 'left-1' : 'left-6')} /></span></button> }
function DrinkPoll({ period, polls, selected, sugar, editable, onSelect, onToggleSugar, onOpen }: { period: { id: Period; label: string; helper: string }; polls: PollRecord[]; selected?: Drink; sugar: boolean; editable: boolean; onSelect?: (drink: Drink) => void; onToggleSugar?: (sugar: boolean) => void; onOpen?: () => void }) { const counts = countChoices(polls.map((entry) => entry.choices))[period.id]; const total = polls.length; return <div className="overflow-hidden rounded-2xl border border-[#e6e0d6] bg-[#fffdf9] shadow-[0_8px_30px_rgba(77,57,38,0.04)]"><div className="flex items-center justify-between gap-4 border-b border-[#eee8df] px-4 py-3.5 sm:px-5"><span className="flex items-center gap-2.5"><span className="grid size-8 place-items-center rounded-lg bg-[#f1ede6] text-[#a36f43]"><Coffee size={16} /></span><span><span className="block text-sm font-semibold text-[#33271f]">{period.label}</span><span className="block text-xs text-[#9a9084]">{total} {total === 1 ? 'response' : 'responses'}</span></span></span><SugarToggle compact disabled={selected === 'No drink'} sugar={sugar} onChange={onToggleSugar ?? (() => undefined)} /></div><div className="grid gap-2 p-3 sm:p-4">{drinks.map((drink) => { const count = counts[drink]; const percent = total ? Math.round((counts[drink] / total) * 100) : 0; return <button key={drink} disabled={!editable} onClick={() => onSelect?.(drink)} type="button" className={cx('relative flex min-h-11 items-center justify-between overflow-hidden rounded-xl border px-3.5 text-left text-sm font-semibold', editable ? 'transition hover:border-[#dbc9b6]' : 'cursor-default', selected === drink ? 'border-[#a36f43] bg-[#f6ece1] text-[#68452e]' : 'border-[#eee8df] text-[#665b50]')}><span className="absolute inset-y-0 left-0 bg-[#f6ece1] transition-all" style={{ width: editable ? (selected === drink ? '100%' : '0%') : `${percent}%` }} /><span className="relative">{drink}</span><span className="relative flex items-center gap-2 text-xs text-[#887f74]">{count}{selected === drink && <span className="grid size-5 place-items-center rounded-full bg-[#a36f43] text-white"><Check size={13} strokeWidth={3} /></span>}</span></button> })}</div><button className="mx-3 mb-3 flex min-h-11 w-[calc(100%-1.5rem)] items-center justify-center gap-2 rounded-xl bg-[#5a3c26] text-sm font-semibold text-white transition hover:bg-[#68452e] sm:mx-4 sm:mb-4 sm:w-[calc(100%-2rem)]" onClick={onOpen} type="button"><Eye size={16} />View details</button></div> }


function PollDetailsSheet({ date, period, polls, onClose }: { date: string; period: Period; polls: PollRecord[]; onClose: () => void }) { const periodInfo = periodDetails.find((item) => item.id === period); return <div className="fixed inset-0 z-30 flex items-end p-0 sm:items-center sm:justify-center sm:p-4"><button className="absolute inset-0 cursor-default bg-[#2d2925]/30" onClick={onClose} type="button" aria-label="Close poll details" /><section className="relative z-10 max-h-[88svh] w-full overflow-y-auto rounded-t-3xl bg-[#fffdf9] px-4 pb-6 pt-3 shadow-2xl sm:max-w-lg sm:rounded-2xl sm:p-6"><div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#ddd3c7] sm:hidden" /><div className="flex items-start justify-between border-b border-[#eee8df] pb-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a36f43]">{date === todayKey ? 'Today' : displayDate(date)}</p><h2 className="mt-1 font-serif text-2xl text-[#33271f]">{periodInfo?.label ?? period}</h2><p className="mt-1 text-sm text-[#9a9084]">{polls.length} {polls.length === 1 ? 'response' : 'responses'}</p></div><button className="grid size-9 place-items-center rounded-full bg-[#f1ede6] text-[#887f74]" onClick={onClose} type="button" aria-label="Close poll details"><X size={18} /></button></div><div className="mt-5 grid gap-5">{drinks.map((drink) => { const drinkPolls = polls.filter((item) => item.choices[period] === drink); const sugarFreeCount = drinkPolls.filter((item) => !item.sugar[period]).length; if (!drinkPolls.length) return null; return <section key={drink}><h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-[#5a3c26]">{drink}<span className="text-sm font-semibold text-[#9a9084]">{drinkPolls.length} ({sugarFreeCount} SF)</span></h3><div className="grid gap-2">{drinkPolls.map((item) => <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f8f5f0] px-3 py-2.5" key={item.user.email}><div className="flex min-w-0 items-center gap-2.5"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#eee1d1] text-[11px] font-semibold text-[#68452e]">{initials(item.user.name)}</span><span className="truncate text-sm font-semibold">{item.user.name}</span></div><span className="shrink-0 text-right text-xs text-[#887f74]">{item.sugar[period] ? 'Sugar' : 'No sugar'}<br />{item.sources[period] === 'default' ? 'Default' : 'Manual'}</span></div>)}</div></section> })}</div></section></div> }

export default App
