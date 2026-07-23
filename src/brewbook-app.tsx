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
import { completeOnboarding, getDrinkDay, getProfile, saveDefault, saveResponse, drinks, periods, type Company, type Drink, type DrinkChoice, type Period, type PollRecord, type User } from '#/lib/drinks'

type AppState = { user: User | null; defaults: DrinkChoice; entries: Record<string, PollRecord[]> }
type View = 'today' | 'history' | 'defaults'
type OpenPoll = { date: string; period: Period } | null
type OnboardingState = { company: Company | ''; defaults: DrinkChoice; step: 'company' | 'morning' | 'evening' }

const periodDetails: Array<{ id: Period; label: string; helper: string }> = [
  { id: 'morning', label: 'Morning', helper: 'Before the first prep round' },
  { id: 'evening', label: 'Evening', helper: 'For the afternoon round' },
]
const dateFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' })
const displayDateFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Asia/Kolkata' })
const chipDateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'Asia/Kolkata' })
const todayKey = dateFormatter.format(new Date())
const initialState: AppState = { user: null, defaults: { morning: 'No drink', evening: 'No drink' }, entries: {} }

function dateKeyOffset(offset: number) { const date = new Date(); date.setDate(date.getDate() - offset); return dateFormatter.format(date) }
function displayDate(dateKey: string) { return displayDateFormatter.format(new Date(`${dateKey}T12:00:00`)) }
function displayChipDate(dateKey: string) { return chipDateFormatter.format(new Date(`${dateKey}T12:00:00`)) }
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
  const { data: session, isPending: authPending } = authClient.useSession()
  const sessionUserId = session?.user?.id
  const sessionUserName = session?.user?.name
  const sessionUserEmail = session?.user?.email
  const sessionUserImage = session?.user?.image
  const todayPoll = state.user ? state.entries[todayKey]?.find((entry) => entry.user.email === state.user?.email) : undefined
  const todaysEntry = todayPoll?.choices ?? state.defaults
  const todayPolls = state.entries[todayKey] ?? []
  useEffect(() => {
    let cancelled = false
    if (localUser) {
      setState({ ...initialState, user: localUser })
      setOnboarding({ company: '', defaults: initialState.defaults, step: 'company' })
      setProfileReady(true)
      return () => { cancelled = true }
    }
    if (!sessionUserId || !sessionUserName || !sessionUserEmail) { setState(initialState); setProfileReady(false); setOnboarding(null); return () => { cancelled = true } }
    const user = { id: sessionUserId, name: sessionUserName, email: sessionUserEmail, image: sessionUserImage }
    setState((current) => ({ ...current, user }))
    setProfileReady(false)
    void getProfile().then((profile) => {
      if (cancelled) return
      setState((current) => ({ ...current, user, defaults: profile.defaults }))
      if (profile.needsOnboarding) {
        setOnboarding({ company: profile.company ?? '', defaults: profile.defaults, step: 'company' })
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
  }, [localUser, sessionUserEmail, sessionUserId, sessionUserImage, sessionUserName])
  useEffect(() => {
    if (!sessionUserId || view !== 'history') return
    let cancelled = false
    void getDrinkDay(historyDate).then((day) => {
      if (cancelled) return
      setState((current) => ({ ...current, defaults: day.defaults, entries: { ...current.entries, [historyDate]: day.responses } }))
      setError(null)
    }).catch((reason: unknown) => { if (!cancelled) setError(reason instanceof Error ? reason.message : 'Unable to load history') })
    return () => { cancelled = true }
  }, [historyDate, sessionUserId, view])
  useEffect(() => {
    if (!sessionUserId || !openPoll || state.entries[openPoll.date]) return
    let cancelled = false
    void getDrinkDay(openPoll.date).then((day) => {
      if (cancelled) return
      setState((current) => ({ ...current, entries: { ...current.entries, [openPoll.date]: day.responses } }))
    }).catch((reason: unknown) => { if (!cancelled) setError(reason instanceof Error ? reason.message : 'Unable to load poll details') })
    return () => { cancelled = true }
  }, [openPoll, sessionUserId, state.entries])

  function signIn() { void authClient.signIn.social({ provider: 'google', callbackURL: '/' }) }
  function signOut() { void authClient.signOut(); setLocalUser(null); setLocalComplete(false); setState((current) => ({ ...current, user: null })) }
  function signUpLocally() { setLocalComplete(false); setLocalUser({ id: 'local-test-user', name: 'Local test user', email: 'local@brewbook.test' }) }
  async function finishOnboarding() {
    const currentOnboarding = onboarding
    if (!currentOnboarding?.company) return
    if (localUser) { setOnboarding(null); setLocalComplete(true); return }
    try {
      const profile = await completeOnboarding({ company: currentOnboarding.company, defaults: currentOnboarding.defaults })
      const day = await getDrinkDay(todayKey)
      setState((current) => ({ ...current, defaults: profile.defaults, entries: { ...current.entries, [todayKey]: day.responses } }))
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
    setState((current) => {
      if (!current.user) return current
      const nextEntries = (current.entries[todayKey] ?? []).map((entry) => entry.user.email === current.user?.email ? { ...entry, choices, sources: { ...entry.sources, [period]: 'manual' as const } } : entry)
      return {
        ...current,
        entries: { ...current.entries, [todayKey]: nextEntries },
      }
    })
    void saveResponse({ date: todayKey, period, drink }).then((day) => {
      setState((current) => ({ ...current, defaults: day.defaults, entries: { ...current.entries, [todayKey]: day.responses } }))
      setError(null)
    }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Unable to save your drink'))
  }

  function updateDefault(period: Period, drink: Drink) {
    setState((current) => ({ ...current, defaults: { ...current.defaults, [period]: drink } }))
    void saveDefault({ period, drink }).then((defaults) => { setState((current) => ({ ...current, defaults })); setError(null) }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Unable to save your default'))
  }

  if (authPending) return <AuthLoading />
  if (!session?.user && !localUser) return <SignInPage signIn={signIn} onLocalSignUp={import.meta.env.DEV ? signUpLocally : undefined} />
  if (localComplete) return <LocalSetupComplete onReset={signOut} />
  if (!state.user) return <AuthLoading />
  if (!profileReady) return <AuthLoading message="Loading your workspace..." />
  if (onboarding) return <OnboardingPage state={onboarding} setState={setOnboarding} onComplete={finishOnboarding} error={error} />
  const visiblePolls = view === 'history' ? (state.entries[historyDate] ?? []) : todayPolls
  const openPollData = openPoll ? (state.entries[openPoll.date] ?? []) : []
  return <main className="min-h-svh bg-[#f6f5f1] text-[#2d2925] pb-20 lg:pb-0">
    <header className="border-b border-[#e6e0d6] bg-[#fffdf9]"><div className="mx-auto flex max-w-[1180px] items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8"><div className="flex items-center gap-2.5"><BrandMark /><span className="font-serif text-xl font-semibold tracking-[-0.02em]">BrewBook</span></div><div className="relative"><button className="grid size-9 place-items-center rounded-full bg-[#dfc5a5] text-xs font-semibold text-[#5a3c26] transition hover:ring-2 hover:ring-[#a36f43]/40" onClick={() => setProfileOpen((open) => !open)} type="button" aria-label="Open profile" aria-expanded={profileOpen}>{initials(state.user.name)}</button>{profileOpen && <div className="absolute right-0 top-11 z-20 w-64 rounded-2xl border border-[#e6e0d6] bg-[#fffdf9] p-4 shadow-xl"><p className="text-sm font-semibold text-[#33271f]">{state.user.name}</p><p className="mt-1 break-words text-xs text-[#887f74]">{state.user.email}</p><button className="mt-4 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#5a3c26] text-sm font-semibold text-white transition hover:bg-[#68452e]" onClick={signOut} type="button"><LogOut size={16} />Log out</button></div>}</div></div></header>
    {error && <div className="mx-auto mt-4 max-w-[1180px] px-4 sm:px-6 lg:px-8"><div className="rounded-xl border border-[#e7cfc3] bg-[#fff5f0] px-3 py-2 text-sm text-[#8b4d35]" role="alert">{error}</div></div>}
    <div className="mx-auto grid max-w-[1180px] gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[190px_1fr] lg:gap-10 lg:px-8 lg:py-8"><aside className="hidden lg:block lg:sticky lg:top-8 lg:h-fit"><Nav view={view} setView={setView} /></aside><section className="min-w-0">{view === 'today' && <TodayView entry={todaysEntry} todayPolls={todayPolls} updateEntry={updateEntry} onOpen={(period) => setOpenPoll({ date: todayKey, period })} />}{view === 'history' && <HistoryView date={historyDate} setDate={setHistoryDate} polls={visiblePolls} />}{view === 'defaults' && <DefaultsView defaults={state.defaults} updateDefault={updateDefault} />}</section></div>
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#e6e0d6] bg-[#fffdf9]/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur sm:px-4 lg:hidden"><Nav view={view} setView={setView} /></div>
    {openPoll && <PollDetailsSheet date={openPoll.date} period={openPoll.period} polls={openPollData} onClose={() => setOpenPoll(null)} />}
  </main>
}

function Nav({ view, setView }: { view: View; setView: (view: View) => void }) { const items: Array<{ id: View; label: string; icon: React.ReactNode }> = [{ id: 'today', label: 'Today', icon: <CalendarDays size={18} /> }, { id: 'history', label: 'History', icon: <History size={18} /> }, { id: 'defaults', label: 'Defaults', icon: <Settings size={18} /> }]; return <nav className="grid grid-cols-3 gap-2 lg:grid-cols-1">{items.map((item) => <button key={item.id} onClick={() => setView(item.id)} type="button" className={cx('flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[11px] font-semibold transition lg:flex-row lg:justify-start lg:gap-2 lg:px-3 lg:text-sm', view === item.id ? 'bg-[#5a3c26] text-white' : 'text-[#887f74] hover:bg-[#f1ede6] hover:text-[#5a3c26]')}>{item.icon}<span>{item.label}</span>{view === item.id && <ChevronRight className="ml-auto hidden lg:block" size={15} />}</button>)}</nav> }
function BrandMark({ className = 'size-8', iconSize = 17, iconColor = 'currentColor' }: { className?: string; iconSize?: number; iconColor?: string }) { return <div className={cx('grid place-items-center rounded-[10px] bg-[#5a3c26] text-[#fff9ef]', className)}><Coffee color={iconColor} size={iconSize} strokeWidth={2.2} /></div> }

function AuthLoading({ message = 'Checking your account...' }: { message?: string }) { return <main className="grid min-h-svh place-items-center bg-[#f6f5f1]"><output aria-label={message} className="size-10 animate-spin rounded-full border-2 border-[#e6e0d6] border-t-[#5a3c26]" /></main> }
function SignInPage({ signIn, onLocalSignUp }: { signIn: () => void; onLocalSignUp?: () => void }) { return <main className="relative grid min-h-svh place-items-center overflow-hidden bg-[#f6f5f1] px-5 py-10 text-[#fff9ef]"><div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden text-[#c9ad90]/35"><Coffee className="absolute -right-24 -top-20 size-[30rem] rotate-12" strokeWidth={0.7} /><Coffee className="absolute -bottom-32 -left-24 size-[24rem] -rotate-12 text-[#e0d0bf]" strokeWidth={0.7} /></div><section className="relative z-10 flex w-full max-w-sm flex-col items-center rounded-3xl bg-[#5a3c26] px-6 py-9 text-center shadow-[0_20px_60px_rgba(77,57,38,0.2)] sm:px-8"><BrandMark className="size-16 rounded-[18px] bg-[#fff9ef] text-[#5a3c26]" iconColor="#5a3c26" iconSize={30} /><h1 className="mt-7 font-serif text-5xl leading-tight">BrewBook</h1><p className="mt-4 max-w-xs text-[15px] leading-6 text-[#e7d8c4]">Use your work email to continue.</p><button onClick={signIn} type="button" className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#fff9ef] text-sm font-semibold text-[#5a3c26] shadow-[0_12px_30px_rgba(38,24,16,0.22)] transition hover:bg-white"><img alt="" className="size-5" src="/google-g.png" />Continue with Google<ArrowRight size={17} /></button>{onLocalSignUp && <button onClick={onLocalSignUp} type="button" className="mt-3 text-xs font-semibold text-[#e7d8c4] underline decoration-[#c9ad90] underline-offset-4">Sign up locally</button>}</section></main> }
function OnboardingPage({ state, setState, onComplete, error }: { state: OnboardingState; setState: (state: OnboardingState) => void; onComplete: () => void; error: string | null }) { const period = state.step === 'morning' ? periodDetails[0] : state.step === 'evening' ? periodDetails[1] : null; const activePeriod = period ?? periodDetails[0]; const next = () => { if (state.step === 'company') setState({ ...state, step: 'morning' }); else if (state.step === 'morning') setState({ ...state, step: 'evening' }); else onComplete() }; const back = () => { if (state.step === 'morning') setState({ ...state, step: 'company' }); if (state.step === 'evening') setState({ ...state, step: 'morning' }); }; return <main className="flex min-h-svh items-center justify-center bg-[#5a3c26] px-4 py-8 text-[#33271f]"><section className="mx-auto w-full max-w-lg rounded-3xl bg-[#fffdf9] p-5 shadow-2xl sm:p-8"><h1 className="mt-2 font-serif text-3xl text-[#33271f]">{state.step === 'company' ? 'Choose your company' : `Choose your ${period?.label.toLowerCase()} default`}</h1>{error && <p className="mt-3 rounded-xl border border-[#e7cfc3] bg-[#fff5f0] px-3 py-2 text-sm text-[#8b4d35]" role="alert">{error}</p>}{state.step === 'company' ? <div className="mt-8 grid gap-2"><button onClick={() => setState({ ...state, company: 'Mygate' })} type="button" className={cx('flex min-h-14 items-center justify-between rounded-xl border px-4 text-left text-base font-semibold transition', state.company === 'Mygate' ? 'border-[#a36f43] bg-[#f6ece1] text-[#68452e]' : 'border-[#eee8df] text-[#665b50] hover:border-[#dbc9b6]')}>Mygate{state.company === 'Mygate' && <Check size={17} />}</button></div> : <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-5">{drinks.map((drink) => <button key={drink} onClick={() => setState({ ...state, defaults: { ...state.defaults, [activePeriod.id]: drink } })} type="button" className={cx('flex min-h-12 items-center justify-between whitespace-nowrap rounded-xl border px-3 text-left text-sm font-semibold transition', state.defaults[activePeriod.id] === drink ? 'border-[#a36f43] bg-[#f6ece1] text-[#68452e]' : 'border-[#eee8df] text-[#665b50] hover:border-[#dbc9b6]')}>{drink}{state.defaults[activePeriod.id] === drink && <Check size={15} />}</button>)}</div>}<div className="mt-8 flex items-center gap-2">{state.step !== 'company' && <button onClick={back} type="button" className="flex min-h-11 items-center gap-2 rounded-xl border border-[#e6e0d6] px-4 text-sm font-semibold text-[#68452e] transition hover:bg-[#fdf8f1]"><ArrowLeft size={16} />Back</button>}<button disabled={!state.company || (!!period && !state.defaults[period.id])} onClick={next} type="button" className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#5a3c26] px-4 text-sm font-semibold text-white transition hover:bg-[#68452e] disabled:cursor-not-allowed disabled:opacity-45">{state.step === 'evening' ? 'Finish setup' : 'Next'}<ArrowRight size={17} /></button></div></section></main> }
function LocalSetupComplete({ onReset }: { onReset: () => void }) { return <main className="grid min-h-svh place-items-center bg-[#5a3c26] px-5 py-10 text-[#fff9ef]"><section className="w-full max-w-sm rounded-3xl bg-[#fffdf9] p-8 text-center text-[#33271f] shadow-2xl"><div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#5a3c26] text-[#fff9ef]"><Check size={26} /></div><h1 className="mt-6 font-serif text-3xl">Setup complete</h1><p className="mt-2 text-sm leading-6 text-[#887f74]">The local test flow is complete. The app is not loaded in local signup mode.</p><button onClick={onReset} type="button" className="mt-7 min-h-11 rounded-xl bg-[#5a3c26] px-4 text-sm font-semibold text-white">Run setup again</button></section></main> }
function TodayView({ entry, todayPolls, updateEntry, onOpen }: { entry: DrinkChoice; todayPolls: PollRecord[]; updateEntry: (period: Period, drink: Drink) => void; onOpen: (period: Period) => void }) { return <div className="grid gap-5"><PageHeader eyebrow={displayDate(todayKey)} title="Today" action={`${todayPolls.length} people`} /><div className="grid gap-3">{periodDetails.map((period) => <DrinkPoll key={period.id} period={period} polls={todayPolls} selected={entry[period.id]} editable onSelect={(drink) => updateEntry(period.id, drink)} onOpen={() => onOpen(period.id)} />)}</div></div> }
function HistoryView({ date, setDate, polls }: { date: string; setDate: (date: string) => void; polls: PollRecord[] }) { const dates = Array.from({ length: 7 }, (_, index) => dateKeyOffset(index + 1)); return <div className="grid gap-5"><PageHeader eyebrow="History" title={displayDate(date)} action={polls.length ? `${polls.length} people` : 'No responses'} /><div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-0 sm:-mx-6 sm:px-6">{dates.map((item) => <button key={item} onClick={() => setDate(item)} type="button" className={cx('shrink-0 rounded-lg border px-3 py-2 text-left text-sm font-semibold transition', date === item ? 'border-[#5a3c26] bg-[#5a3c26] text-white' : 'border-[#e6e0d6] bg-[#fffdf9] text-[#887f74]')}><span className="block text-xs font-normal opacity-75">{displayDate(item).split(',')[0]}</span>{displayChipDate(item)}</button>)}</div><HistoryResponseCards polls={polls} /></div> }
function HistoryResponseCards({ polls }: { polls: PollRecord[] }) { if (!polls.length) return <div className="rounded-2xl border border-dashed border-[#dbcfc1] bg-[#fffdf9] px-4 py-8 text-center text-sm text-[#887f74]">No responses for this day.</div>; return <div className="grid gap-3">{polls.map((poll) => <article className="rounded-2xl border border-[#e6e0d6] bg-[#fffdf9] p-4 shadow-[0_8px_30px_rgba(77,57,38,0.04)]" key={poll.user.email}><div className="flex items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#eee1d1] text-xs font-semibold text-[#68452e]">{initials(poll.user.name)}</span><div className="min-w-0"><p className="truncate text-sm font-semibold text-[#33271f]">{poll.user.name}</p><p className="text-xs text-[#9a9084]">Drink choices</p></div></div><div className="mt-4 grid grid-cols-2 gap-2"><HistoryChoice label="Morning" drink={poll.choices.morning} source={poll.sources.morning} /><HistoryChoice label="Evening" drink={poll.choices.evening} source={poll.sources.evening} /></div></article>)}</div> }
function HistoryChoice({ label, drink, source }: { label: string; drink: Drink; source: 'default' | 'manual' }) { return <div className="rounded-xl bg-[#f8f5f0] px-3 py-2.5"><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a9084]">{label}</p><p className="mt-1 truncate text-sm font-semibold text-[#68452e]">{drink}</p><p className="mt-1 text-[11px] text-[#9a9084]">{source === 'default' ? 'Default' : 'Manual'}</p></div> }
function DefaultsView({ defaults, updateDefault }: { defaults: DrinkChoice; updateDefault: (period: Period, drink: Drink) => void }) { return <div className="grid gap-5"><PageHeader eyebrow="Defaults" title="Default drinks" action="Saved automatically" /><div className="grid gap-3">{periodDetails.map((period) => <DefaultDrinkSetting key={period.id} period={period} selected={defaults[period.id]} onSelect={(drink) => updateDefault(period.id, drink)} />)}</div></div> }
function DefaultDrinkSetting({ period, selected, onSelect }: { period: { id: Period; label: string; helper: string }; selected: Drink; onSelect: (drink: Drink) => void }) { return <section className="rounded-2xl border border-[#e6e0d6] bg-[#fffdf9] p-4 shadow-[0_8px_30px_rgba(77,57,38,0.04)] sm:p-5"><div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#f1ede6] text-[#a36f43]"><Coffee size={17} /></span><div><h2 className="text-sm font-semibold text-[#33271f]">{period.label} default</h2><p className="mt-0.5 text-xs text-[#9a9084]">{period.helper}</p></div></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">{drinks.map((drink) => <button key={drink} onClick={() => onSelect(drink)} type="button" className={cx('flex min-h-11 items-center justify-between rounded-xl border px-3 text-left text-sm font-semibold transition', selected === drink ? 'border-[#a36f43] bg-[#f6ece1] text-[#68452e]' : 'border-[#eee8df] text-[#665b50] hover:border-[#dbc9b6]')}>{drink}{selected === drink && <Check size={15} />}</button>)}</div></section> }
function PageHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action: string }) { return <div className="flex items-end justify-between gap-4 border-b border-[#e6e0d6] pb-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a36f43]">{eyebrow}</p><h1 className="mt-1 font-serif text-3xl tracking-[-0.03em] text-[#33271f] sm:text-4xl">{title}</h1></div><span className="shrink-0 text-xs font-semibold text-[#9a9084]">{action}</span></div> }

function DrinkPoll({ period, polls, selected, editable, onSelect, onOpen }: { period: { id: Period; label: string; helper: string }; polls: PollRecord[]; selected?: Drink; editable: boolean; onSelect?: (drink: Drink) => void; onOpen?: () => void }) { const counts = countChoices(polls.map((entry) => entry.choices))[period.id]; const total = polls.length; return <div className="overflow-hidden rounded-2xl border border-[#e6e0d6] bg-[#fffdf9] shadow-[0_8px_30px_rgba(77,57,38,0.04)]"><div className="flex items-center justify-between gap-4 border-b border-[#eee8df] px-4 py-3.5 sm:px-5"><span className="flex items-center gap-2.5"><span className="grid size-8 place-items-center rounded-lg bg-[#f1ede6] text-[#a36f43]"><Coffee size={16} /></span><span><span className="block text-sm font-semibold text-[#33271f]">{period.label} drink poll</span><span className="block text-xs text-[#9a9084]">{total} {total === 1 ? 'response' : 'responses'}</span></span></span></div><div className="grid gap-2 p-3 sm:p-4">{drinks.map((drink) => { const count = counts[drink]; const percent = total ? Math.round((counts[drink] / total) * 100) : 0; return <button key={drink} disabled={!editable} onClick={() => onSelect?.(drink)} type="button" className={cx('relative flex min-h-11 items-center justify-between overflow-hidden rounded-xl border px-3.5 text-left text-sm font-semibold', editable ? 'transition hover:border-[#dbc9b6]' : 'cursor-default', selected === drink ? 'border-[#a36f43] bg-[#f6ece1] text-[#68452e]' : 'border-[#eee8df] text-[#665b50]')}><span className="absolute inset-y-0 left-0 bg-[#f6ece1] transition-all" style={{ width: editable ? (selected === drink ? '100%' : '0%') : `${percent}%` }} /><span className="relative">{drink}</span><span className="relative flex items-center gap-2 text-xs text-[#887f74]">{count}{selected === drink && <span className="grid size-5 place-items-center rounded-full bg-[#a36f43] text-white"><Check size={13} strokeWidth={3} /></span>}</span></button> })}</div><button className="mx-3 mb-3 flex min-h-11 w-[calc(100%-1.5rem)] items-center justify-center gap-2 rounded-xl border border-[#e6e0d6] text-sm font-semibold text-[#68452e] transition hover:border-[#a36f43] hover:bg-[#fdf8f1] sm:mx-4 sm:mb-4 sm:w-[calc(100%-2rem)]" onClick={onOpen} type="button"><Eye size={16} />View details</button></div> }


function PollDetailsSheet({ date, period, polls, onClose }: { date: string; period: Period; polls: PollRecord[]; onClose: () => void }) { const periodInfo = periodDetails.find((item) => item.id === period); return <div className="fixed inset-0 z-30 flex items-end p-0 sm:items-center sm:justify-center sm:p-4"><button className="absolute inset-0 cursor-default bg-[#2d2925]/30" onClick={onClose} type="button" aria-label="Close poll details" /><section className="relative z-10 max-h-[88svh] w-full overflow-y-auto rounded-t-3xl bg-[#fffdf9] px-4 pb-6 pt-3 shadow-2xl sm:max-w-lg sm:rounded-2xl sm:p-6"><div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#ddd3c7] sm:hidden" /><div className="flex items-start justify-between border-b border-[#eee8df] pb-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a36f43]">{date === todayKey ? 'Today' : displayDate(date)}</p><h2 className="mt-1 font-serif text-2xl text-[#33271f]">{periodInfo?.label ?? period} drink poll</h2><p className="mt-1 text-sm text-[#9a9084]">{polls.length} {polls.length === 1 ? 'response' : 'responses'}</p></div><button className="grid size-9 place-items-center rounded-full bg-[#f1ede6] text-[#887f74]" onClick={onClose} type="button" aria-label="Close poll details"><X size={18} /></button></div><div className="mt-5 grid gap-5">{drinks.map((drink) => { const drinkPolls = polls.filter((item) => item.choices[period] === drink); if (!drinkPolls.length) return null; return <section key={drink}><h3 className="mb-2 text-base font-semibold text-[#5a3c26]">{drink}</h3><div className="grid gap-2">{drinkPolls.map((item) => <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f8f5f0] px-3 py-2.5" key={item.user.email}><div className="flex min-w-0 items-center gap-2.5"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#eee1d1] text-[11px] font-semibold text-[#68452e]">{initials(item.user.name)}</span><span className="truncate text-sm font-semibold">{item.user.name}</span></div><span className="shrink-0 text-xs text-[#887f74]">{item.sources[period] === 'default' ? 'Default' : 'Manual'}</span></div>)}</div></section> })}</div></section></div> }

export default App
