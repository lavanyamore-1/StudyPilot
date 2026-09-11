import { type ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  Code2,
  Command,
  Database,
  FileText,
  Gauge,
  GitBranch,
  GraduationCap,
  Layers3,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  Menu,
  Moon,
  MoreHorizontal,
  Network,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Rocket,
  Save,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  Timer,
  TrendingUp,
  UserRound,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { Link, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { TooltipProvider } from '@/components/ui/tooltip';

const queryClient = new QueryClient();

type AgentPhase = 'idle' | 'observing' | 'reasoning' | 'adapting' | 'ready';
type ToastTone = 'success' | 'info' | 'warning';
type ToastState = { message: string; tone: ToastTone } | null;
type Goal = {
  title: string;
  subject: string;
  target: number;
  days: number;
  dailyMinutes: number;
  topics: string[];
};

type AppContextValue = {
  goal: Goal;
  setGoal: (goal: Goal) => void;
  readiness: number;
  setReadiness: (value: number) => void;
  transactions: number;
  normalization: number;
  agentPhase: AgentPhase;
  runAgent: () => void;
  quizDone: boolean;
  completeQuiz: () => void;
  dark: boolean;
  setDark: (value: boolean) => void;
  toast: ToastState;
  notify: (message: string, tone?: ToastTone) => void;
};

const initialGoal: Goal = {
  title: 'DBMS final exam readiness',
  subject: 'Database Management Systems',
  target: 80,
  days: 7,
  dailyMinutes: 180,
  topics: ['SQL', 'Transactions', 'Normalization', 'ER Modeling', 'Indexing'],
};

const AppContext = createContext<AppContextValue | null>(null);

function useStudyPilot() {
  const value = useContext(AppContext);
  if (!value) throw new Error('StudyPilot context is not available');
  return value;
}

function AppProvider({ children }: { children: ReactNode }) {
  const [goal, setGoal] = useState(initialGoal);
  const [readiness, setReadiness] = useState(58);
  const [transactions, setTransactions] = useState(58);
  const [normalization, setNormalization] = useState(85);
  const [agentPhase, setAgentPhase] = useState<AgentPhase>('idle');
  const [quizDone, setQuizDone] = useState(false);
  const [dark, setDarkState] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const notify = (message: string, tone: ToastTone = 'success') => setToast(message ? { message, tone } : null);

  const runAgent = () => {
    if (agentPhase !== 'idle' && agentPhase !== 'ready') return;
    setTransactions(58);
    setNormalization(85);
    setReadiness(58);
    setAgentPhase('observing');
    notify('Agent launched. Reading current mastery state.', 'info');
    window.setTimeout(() => {
      setTransactions(42);
      setAgentPhase('reasoning');
      notify('Transactions signal detected at 42%.', 'warning');
    }, 1600);
    window.setTimeout(() => {
      setNormalization(72);
      setAgentPhase('adapting');
      notify('Plan adapted: more Transactions, less Normalization.', 'info');
    }, 3200);
    window.setTimeout(() => {
      setAgentPhase('ready');
      notify('Adaptive plan ready for your review.', 'success');
    }, 4800);
  };

  const completeQuiz = () => {
    setQuizDone(true);
    setReadiness(86);
    setTransactions(78);
    notify('Quiz evaluated: 8/10. Readiness is now 86%.', 'success');
  };

  const value = useMemo(
    () => ({
      goal,
      setGoal,
      readiness,
      setReadiness,
      transactions,
      normalization,
      agentPhase,
      runAgent,
      quizDone,
      completeQuiz,
      dark,
      setDark: setDarkState,
      toast,
      notify,
    }),
    [goal, readiness, transactions, normalization, agentPhase, quizDone, dark, toast],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

type NavItem = { href: string; label: string; icon: LucideIcon };

const primaryNav: NavItem[] = [
  { href: '/', label: 'Command center', icon: LayoutDashboard },
  { href: '/goals', label: 'Learning goals', icon: Target },
  { href: '/agent', label: 'AI study agent', icon: BrainCircuit },
  { href: '/plan', label: 'Adaptive plan', icon: ListChecks },
  { href: '/practice', label: 'Practice lab', icon: CircleHelp },
];

const insightNav: NavItem[] = [
  { href: '/progress', label: 'Progress', icon: TrendingUp },
  { href: '/resources', label: 'Resources', icon: BookOpen },
  { href: '/activity', label: 'Agent activity', icon: Activity },
  { href: '/architecture', label: 'Architecture', icon: Network },
];

function Shell({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const { dark, setDark, toast, notify } = useStudyPilot();
  const [mobileNav, setMobileNav] = useState(false);
  const currentTitle =
    [...primaryNav, ...insightNav, { href: '/settings', label: 'Settings', icon: Settings }].find(
      (item) => item.href === location,
    )?.label ?? 'Command center';

  const nav = (items: NavItem[]) =>
    items.map((item) => {
      const Icon = item.icon;
      const active = location === item.href;
      return (
        <Link
          href={item.href}
          key={item.href}
          data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
          onClick={() => setMobileNav(false)}
          className={`focus-ring group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
            active
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          }`}
        >
          <Icon size={17} strokeWidth={active ? 2.4 : 1.8} />
          <span className="truncate">{item.label}</span>
          {item.href === '/agent' && (
            <span className={`ml-auto h-1.5 w-1.5 rounded-full ${active ? 'bg-accent' : 'bg-primary'}`} />
          )}
        </Link>
      );
    });

  return (
    <div className="min-h-[100dvh] bg-background">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r border-border bg-card/95 px-4 py-5 backdrop-blur transition-transform lg:translate-x-0 ${
          mobileNav ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <Link href="/" className="focus-ring flex items-center gap-2.5" data-testid="link-brand">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Command size={19} strokeWidth={2.4} />
            </span>
            <span>
              <span className="block font-display text-[17px] font-bold tracking-tight">StudyPilot</span>
              <span className="font-mono-ui block text-[9px] uppercase tracking-[.18em] text-muted-foreground">
                autonomous learning
              </span>
            </span>
          </Link>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileNav(false)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary lg:hidden"
            data-testid="button-close-navigation"
          >
            <X size={17} />
          </button>
        </div>
        <div className="mb-4 px-3 font-mono-ui text-[10px] uppercase tracking-[.18em] text-muted-foreground">
          Navigate
        </div>
        <nav className="space-y-1">{nav(primaryNav)}</nav>
        <div className="mb-4 mt-8 px-3 font-mono-ui text-[10px] uppercase tracking-[.18em] text-muted-foreground">
          Observe
        </div>
        <nav className="space-y-1">{nav(insightNav)}</nav>
        <div className="mt-auto">
          <div className="mb-4 rounded-xl border border-accent/30 bg-accent/10 p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold">
              <Zap size={14} className="text-accent-foreground" />
              <span>Agent status</span>
              <span className="ml-auto h-2 w-2 animate-pulse-signal rounded-full bg-primary" />
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">Watching your readiness target and adjusting the next move.</p>
            <Link
              href="/agent"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              data-testid="link-open-agent"
            >
              Open live view <ArrowRight size={12} />
            </Link>
          </div>
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
            data-testid="link-nav-settings"
          >
            <Settings size={17} />
            Settings
          </Link>
          <div className="mt-4 flex items-center gap-3 border-t border-border px-2 pt-4">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">AS</div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">Avery Singh</p>
              <p className="truncate text-[11px] text-muted-foreground">Exam sprint · 7 days left</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setDark(!dark);
                notify(`${!dark ? 'Midnight' : 'Daylight'} theme enabled.`, 'info');
              }}
              aria-label="Toggle theme"
              className="ml-auto rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
              data-testid="button-toggle-theme-sidebar"
            >
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>
      </aside>
      {mobileNav && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setMobileNav(false)}
          className="fixed inset-0 z-30 bg-foreground/20 lg:hidden"
          data-testid="button-navigation-overlay"
        />
      )}
      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur sm:px-7 lg:px-9">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNav(true)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-secondary lg:hidden"
              aria-label="Open navigation"
              data-testid="button-open-navigation"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-muted-foreground">StudyPilot / {currentTitle}</p>
              <h1 className="font-display text-lg font-semibold tracking-tight">{currentTitle}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-xs text-primary sm:flex">
              <span className="h-1.5 w-1.5 animate-pulse-signal rounded-full bg-primary" />
              Target tracking live
            </div>
            <button
              type="button"
              className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Notifications"
              onClick={() => notify('No new alerts. Your agent is watching.', 'info')}
              data-testid="button-notifications"
            >
              <Bell size={18} />
            </button>
            <button
              type="button"
              className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Toggle theme"
              onClick={() => {
                setDark(!dark);
                notify(`${!dark ? 'Midnight' : 'Daylight'} theme enabled.`, 'info');
              }}
              data-testid="button-toggle-theme"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-7 sm:py-8 lg:px-9">{children}</main>
      </div>
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg animate-slide-up ${
            toast.tone === 'warning'
              ? 'border-accent/50 bg-accent/15'
              : toast.tone === 'info'
                ? 'border-primary/30 bg-primary/10'
                : 'border-primary/30 bg-card'
          }`}
          role="status"
          data-testid="status-toast"
        >
          {toast.tone === 'warning' ? <AlertTriangle size={16} className="text-accent-foreground" /> : <CheckCircle2 size={16} className="text-primary" />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => notify('', 'info')} className="ml-2 text-muted-foreground" data-testid="button-dismiss-toast">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

function ProgressRing({ value, size = 126, stroke = 9, color = 'hsl(var(--primary))' }: { value: number; size?: number; stroke?: number; color?: string }) {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} data-testid={`progress-ring-${value}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="hsl(var(--muted))" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-700" />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-display text-3xl font-bold tracking-tight">{value}%</span>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, detail, action }: { eyebrow: string; title: string; detail?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-primary">{eyebrow}</p>
        <h2 className="mt-1 font-display text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
        {detail && <p className="mt-1 text-sm text-muted-foreground">{detail}</p>}
      </div>
      {action}
    </div>
  );
}

function MetricCard({ label, value, detail, icon: Icon, accent = false }: { label: string; value: string; detail: string; icon: LucideIcon; accent?: boolean }) {
  return (
    <div className={`card-surface rounded-xl p-4 ${accent ? 'border-primary/30 bg-primary/[.035]' : ''}`} data-testid={`metric-${label.toLowerCase().replaceAll(' ', '-')}`}>
      <div className="flex items-start justify-between">
        <span className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-muted-foreground">{label}</span>
        <span className={`rounded-md p-1.5 ${accent ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}><Icon size={15} /></span>
      </div>
      <p className="mt-4 font-display text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function Dashboard() {
  const { goal, readiness, transactions, agentPhase, runAgent, quizDone, notify } = useStudyPilot();
  const [, setLocation] = useLocation();
  const isRunning = agentPhase !== 'idle' && agentPhase !== 'ready';
  return (
    <div className="space-y-8 animate-slide-up">
      <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card p-5 shadow-lift sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-[25%] h-24 w-24 rounded-full bg-accent/10 blur-2xl" />
        <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/8 px-2.5 py-1 font-mono-ui text-[10px] uppercase tracking-wider text-primary">
                <span className="h-1.5 w-1.5 animate-pulse-signal rounded-full bg-primary" /> Goal in pursuit
              </span>
              <span className="rounded-full border border-border px-2.5 py-1 font-mono-ui text-[10px] text-muted-foreground">{goal.days} days remaining</span>
            </div>
            <h2 className="font-display text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl">Make exam readiness a moving target.</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              StudyPilot observes what you know, decides what matters next, and keeps steering until your <span className="font-semibold text-foreground">{goal.target}% target</span> is within reach.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  runAgent();
                  setLocation('/agent');
                }}
                disabled={isRunning}
                className="focus-ring inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                data-testid="button-launch-agent"
              >
                {isRunning ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
                {isRunning ? 'Agent is working…' : 'Launch agent demo'}
              </button>
              <button
                type="button"
                onClick={() => setLocation('/plan')}
                className="focus-ring inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-secondary"
                data-testid="button-view-plan"
              >
                Inspect current plan <ArrowRight size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-5 rounded-xl border border-border bg-background/70 p-4 sm:p-5">
            <ProgressRing value={readiness} size={126} />
            <div>
              <p className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-muted-foreground">Readiness score</p>
              <p className="mt-2 font-display text-xl font-semibold">{readiness >= goal.target ? 'Target reached' : `${goal.target - readiness} pts to target`}</p>
              <p className="mt-1 text-xs text-muted-foreground">Updated {quizDone ? 'just now' : 'today at 09:42'}</p>
              {quizDone && <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary"><Check size={13} /> Adaptive quiz complete</span>}
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="Telemetry" title="Your goal, at a glance" detail="The few signals that shape the agent's next decision." />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Readiness" value={`${readiness}%`} detail={readiness >= 80 ? 'Above target threshold' : '22 pts from target'} icon={Gauge} accent />
          <MetricCard label="Study horizon" value={`${goal.days} days`} detail={`${goal.dailyMinutes / 60}h daily budget`} icon={Clock3} />
          <MetricCard label="Weakest signal" value="Transactions" detail={`${transactions}% mastery · needs attention`} icon={AlertTriangle} />
          <MetricCard label="Plan mode" value={agentPhase === 'ready' ? 'Adapted' : 'Pursuing'} detail={agentPhase === 'ready' ? 'Next session is ready' : 'Agent is tracking your target'} icon={GitBranch} />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <section className="card-surface rounded-xl p-5 sm:p-6">
          <SectionHeading eyebrow="Agent brief" title="Why the next move matters" detail="A transparent decision, not a mystery recommendation." action={<Link href="/activity" className="text-xs font-semibold text-primary hover:underline" data-testid="link-view-activity">View activity <ArrowRight size={12} className="ml-1 inline" /></Link>} />
          <div className="rounded-lg border border-accent/30 bg-accent/10 p-4">
            <div className="flex gap-3">
              <div className="mt-0.5 rounded-md bg-accent/25 p-2 text-accent-foreground"><Lightbulb size={17} /></div>
              <div>
                <p className="text-sm font-semibold">Transactions is the current bottleneck</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">A short diagnostic found lower-than-expected recall in isolation levels and deadlock recovery. The agent will trade 30 minutes from Normalization for a focused recovery loop.</p>
                <button type="button" onClick={() => setLocation('/agent')} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline" data-testid="button-explain-decision">See the reasoning <ArrowRight size={13} /></button>
              </div>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ['Observe', 'Capture mastery signals', CheckCircle2],
              ['Decide', 'Prioritize the bottleneck', BrainCircuit],
              ['Adapt', 'Reallocate study time', RefreshCw],
            ].map(([label, detail, Icon]) => (
              <div key={label as string} className="rounded-lg border border-border p-3">
                <Icon size={16} className="text-primary" />
                <p className="mt-3 text-xs font-semibold">{label as string}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{detail as string}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="card-surface rounded-xl p-5 sm:p-6">
          <SectionHeading eyebrow="Next up" title="Today's mission" detail="One deliberate session beats a crowded timetable." />
          <div className="rounded-xl bg-foreground p-4 text-background">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-background/10 px-2 py-1 font-mono-ui text-[10px] uppercase tracking-wider text-background/70">Priority 01</span>
              <span className="font-mono-ui text-xs text-background/60">60 min</span>
            </div>
            <h3 className="mt-5 font-display text-2xl font-semibold">Transactions: recovery patterns</h3>
            <p className="mt-2 text-sm leading-relaxed text-background/65">Isolation anomalies → deadlock detection → a 10-question confidence check.</p>
            <button type="button" onClick={() => { setLocation('/practice'); notify('Practice lab opened with the Transactions set.', 'info'); }} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2.5 text-sm font-semibold text-accent-foreground hover:brightness-95" data-testid="button-start-mission">Start mission <ArrowRight size={15} /></button>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs">
            <span className="text-muted-foreground">After this</span>
            <span className="inline-flex items-center gap-1.5 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> SQL query optimization · 45 min</span>
          </div>
        </section>
      </div>
    </div>
  );
}

function GoalsPage() {
  const { goal, setGoal, notify } = useStudyPilot();
  const [draft, setDraft] = useState(goal);
  const [saved, setSaved] = useState(false);
  const update = (key: keyof Goal, value: string | number | string[]) => setDraft((current) => ({ ...current, [key]: value }));
  return (
    <div className="mx-auto max-w-5xl space-y-7 animate-slide-up">
      <div className="max-w-2xl">
        <p className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-primary">Goal constructor</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">Give the agent a finish line.</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">StudyPilot turns a target, a deadline, and a daily budget into a plan it can continuously revise. You can edit the goal whenever the situation changes.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <form
          className="card-surface rounded-xl p-5 sm:p-7"
          onSubmit={(event) => {
            event.preventDefault();
            setGoal(draft);
            setSaved(true);
            notify('Learning goal saved. The agent will re-evaluate the plan.', 'success');
          }}
        >
          <div className="mb-6 flex items-center gap-3 border-b border-border pb-5">
            <div className="rounded-lg bg-primary/10 p-2.5 text-primary"><Target size={19} /></div>
            <div><h3 className="font-display text-lg font-semibold">Learning goal</h3><p className="text-xs text-muted-foreground">What should the agent pursue?</p></div>
          </div>
          <label className="mb-4 block text-sm font-medium">Goal title<input value={draft.title} onChange={(event) => update('title', event.target.value)} className="mt-2 w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2" data-testid="input-goal-title" /></label>
          <label className="mb-4 block text-sm font-medium">Subject<input value={draft.subject} onChange={(event) => update('subject', event.target.value)} className="mt-2 w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2" data-testid="input-goal-subject" /></label>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-sm font-medium">Target score<div className="relative mt-2"><input type="number" min="1" max="100" value={draft.target} onChange={(event) => update('target', Number(event.target.value))} className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 pr-8 text-sm outline-none ring-primary/30 focus:ring-2" data-testid="input-goal-target" /><span className="absolute right-3 top-2.5 text-sm text-muted-foreground">%</span></div></label>
            <label className="text-sm font-medium">Days remaining<div className="relative mt-2"><input type="number" min="1" max="90" value={draft.days} onChange={(event) => update('days', Number(event.target.value))} className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 pr-10 text-sm outline-none ring-primary/30 focus:ring-2" data-testid="input-goal-days" /><span className="absolute right-3 top-2.5 text-sm text-muted-foreground">days</span></div></label>
            <label className="text-sm font-medium">Daily budget<div className="relative mt-2"><input type="number" min="15" max="600" step="15" value={draft.dailyMinutes} onChange={(event) => update('dailyMinutes', Number(event.target.value))} className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 pr-12 text-sm outline-none ring-primary/30 focus:ring-2" data-testid="input-goal-minutes" /><span className="absolute right-3 top-2.5 text-sm text-muted-foreground">min</span></div></label>
          </div>
          <div className="mt-6">
            <span className="text-sm font-medium">Focus topics</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {['SQL', 'Transactions', 'Normalization', 'ER Modeling', 'Indexing'].map((topic) => <button key={topic} type="button" onClick={() => update('topics', draft.topics.includes(topic) ? draft.topics.filter((item) => item !== topic) : [...draft.topics, topic])} className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${draft.topics.includes(topic) ? 'border-primary bg-primary/10 font-semibold text-primary' : 'border-border text-muted-foreground hover:bg-secondary'}`} data-testid={`button-topic-${topic.toLowerCase().replaceAll(' ', '-')}`}>{draft.topics.includes(topic) && <Check size={12} className="mr-1 inline" />}{topic}</button>)}
            </div>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-95" data-testid="button-save-goal"><Save size={15} /> Save learning goal</button>
            <button type="button" onClick={() => { setDraft(initialGoal); setSaved(false); }} className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-secondary" data-testid="button-reset-goal">Reset</button>
            {saved && <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary"><CheckCircle2 size={14} /> Saved just now</span>}
          </div>
        </form>
        <div className="space-y-4">
          <div className="signal-grid rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between"><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-muted-foreground">Agent contract</p><ShieldCheck size={17} className="text-primary" /></div>
            <p className="mt-5 font-display text-2xl font-semibold leading-tight">Pursue {draft.target}% in {draft.days} days.</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">With {Math.floor(draft.dailyMinutes / 60)}h {draft.dailyMinutes % 60 ? `${draft.dailyMinutes % 60}m` : ''} daily, your agent has enough room to diagnose, teach, and verify.</p>
            <div className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground"><span className="font-semibold text-foreground">{draft.topics.length} active signals</span> will shape your next plan.</div>
          </div>
          <div className="rounded-xl border border-accent/30 bg-accent/10 p-5">
            <div className="flex items-start gap-3"><Sparkles size={17} className="mt-0.5 text-accent-foreground" /><div><p className="text-sm font-semibold">Good goals have tension</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">A precise score and a real deadline give the agent something to optimize—not just a list to schedule.</p></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const agentEvents = [
  { phase: 'observe', title: 'Read mastery state', detail: 'Loaded 5 topic signals from your last check-in.', icon: Search },
  { phase: 'detect', title: 'Find the bottleneck', detail: 'Transactions is trending below the 65% confidence floor.', icon: AlertTriangle },
  { phase: 'reason', title: 'Choose a response', detail: 'Trade passive review time for a retrieval + feedback loop.', icon: BrainCircuit },
  { phase: 'adapt', title: 'Replan the next session', detail: 'Transactions 30 → 60 min · Normalization 60 → 30 min.', icon: RefreshCw },
  { phase: 'verify', title: 'Queue a proof point', detail: 'Adaptive quiz is ready to confirm the new signal.', icon: CheckCircle2 },
];

function AgentPage() {
  const { agentPhase, runAgent, transactions, normalization, readiness } = useStudyPilot();
  const [, setLocation] = useLocation();
  const currentIndex = agentPhase === 'idle' ? -1 : agentPhase === 'observing' ? 0 : agentPhase === 'reasoning' ? 2 : agentPhase === 'adapting' ? 3 : 4;
  return (
    <div className="space-y-7 animate-slide-up">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-primary">Live control loop</p><h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">AI Study Agent</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">This is the decision surface: observe state, explain the move, execute the plan, then verify whether it worked.</p></div>
        <button type="button" onClick={runAgent} disabled={agentPhase !== 'idle' && agentPhase !== 'ready'} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60" data-testid="button-run-agent"><Rocket size={16} /> {agentPhase === 'ready' ? 'Run again' : agentPhase === 'idle' ? 'Run live demo' : 'Agent running…'}</button>
      </div>
      <section className="grid gap-5 xl:grid-cols-[1.4fr_.6fr]">
        <div className="card-surface overflow-hidden rounded-xl">
          <div className="flex items-center justify-between border-b border-border px-5 py-4"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-muted-foreground">Autonomous trace</p><p className="mt-1 text-sm font-semibold">DBMS final exam readiness loop</p></div><span className={`rounded-full px-2.5 py-1 font-mono-ui text-[10px] uppercase ${agentPhase === 'ready' ? 'bg-primary/10 text-primary' : 'bg-accent/15 text-accent-foreground'}`}>{agentPhase === 'idle' ? 'standby' : agentPhase === 'ready' ? 'complete' : 'executing'}</span></div>
          <div className="p-5 sm:p-7">
            <div className="relative space-y-1">
              <div className="absolute bottom-7 left-[15px] top-7 w-px bg-border" />
              {agentEvents.map((event, index) => {
                const Icon = event.icon;
                const complete = index <= currentIndex;
                const active = index === currentIndex && agentPhase !== 'ready';
                return <div key={event.phase} className={`relative flex gap-4 py-3 transition-opacity ${index > currentIndex + 1 ? 'opacity-45' : 'opacity-100'}`} data-testid={`agent-event-${event.phase}`}>
                  <div className={`z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 ${complete ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground'} ${active ? 'animate-pulse-signal' : ''}`}>{complete ? <Check size={14} strokeWidth={3} /> : <Icon size={14} />}</div>
                  <div className="min-w-0 pt-0.5"><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold">{event.title}</p>{active && <span className="font-mono-ui text-[10px] uppercase text-primary">in progress</span>}{complete && !active && <span className="font-mono-ui text-[10px] uppercase text-primary">done</span>}</div><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{event.detail}</p></div>
                </div>;
              })}
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="rounded-xl bg-foreground p-5 text-background">
            <div className="flex items-center justify-between"><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-background/60">Current state</p><Activity size={16} className="text-accent" /></div>
            <p className="mt-6 font-display text-5xl font-bold">{readiness}%</p><p className="mt-1 text-sm text-background/60">readiness toward 80%</p>
            <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-background/15"><div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${readiness}%` }} /></div>
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-background/15 pt-4"><div><p className="font-mono-ui text-[10px] text-background/50">Transactions</p><p className="mt-1 text-xl font-semibold text-accent">{transactions}%</p></div><div><p className="font-mono-ui text-[10px] text-background/50">Normalization</p><p className="mt-1 text-xl font-semibold">{normalization}%</p></div></div>
          </div>
          <div className="card-surface rounded-xl p-5"><div className="flex items-center gap-2 text-primary"><BrainCircuit size={16} /><span className="font-mono-ui text-[10px] uppercase tracking-[.16em]">Decision rationale</span></div><p className="mt-3 text-sm leading-relaxed text-muted-foreground">“A topic at 42% can erase the value of a high score elsewhere. I am shifting time to the highest expected gain.”</p><button type="button" onClick={() => setLocation('/practice')} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline" data-testid="button-open-adaptive-quiz">Open adaptive quiz <ArrowRight size={13} /></button></div>
        </div>
      </section>
    </div>
  );
}

function PlanPage() {
  const { agentPhase, runAgent, notify } = useStudyPilot();
  const [paused, setPaused] = useState(false);
  const [expanded, setExpanded] = useState<string | null>('Transactions');
  const sessions = [
    { day: 'Today', date: 'Mon 14', topic: 'Transactions', minutes: 60, status: 'Priority', detail: 'Isolation levels, serializability, and deadlock recovery', color: 'bg-accent' },
    { day: 'Tomorrow', date: 'Tue 15', topic: 'SQL', minutes: 45, status: 'Queued', detail: 'Query plans, joins, and correlated subqueries', color: 'bg-primary' },
    { day: 'Wed', date: 'Wed 16', topic: 'Normalization', minutes: 30, status: 'Light review', detail: 'Functional dependencies and 3NF edge cases', color: 'bg-secondary' },
    { day: 'Thu', date: 'Thu 17', topic: 'ER Modeling', minutes: 35, status: 'Queued', detail: 'Mapping constraints and weak entity sets', color: 'bg-secondary' },
  ];
  return <div className="space-y-7 animate-slide-up">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-primary">Plan compiler</p><h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">Adaptive study plan</h2><p className="mt-3 text-sm text-muted-foreground">A plan is only useful when it can change its mind for the right reason.</p></div><div className="flex gap-2"><button type="button" onClick={() => { setPaused(!paused); notify(paused ? 'Plan resumed.' : 'Plan paused for today.', 'info'); }} className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm font-semibold ${paused ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-secondary'}`} data-testid="button-pause-plan">{paused ? <Play size={15} /> : <Pause size={15} />}{paused ? 'Resume plan' : 'Pause today'}</button><button type="button" onClick={runAgent} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground" data-testid="button-replan"><RefreshCw size={15} /> Replan now</button></div></div>
    <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><div className="card-surface rounded-xl p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-muted-foreground">Allocation</p><p className="mt-1 font-display text-2xl font-semibold">3h / day</p></div><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{agentPhase === 'ready' ? 'Adapted' : 'Baseline'}</span></div><div className="mt-6 space-y-3">{[['Transactions', 60, 'bg-accent'], ['SQL', 45, 'bg-primary'], ['Normalization', 30, 'bg-foreground/50'], ['ER Modeling', 35, 'bg-muted-foreground']].map(([topic, mins, color]) => <div key={topic as string}><div className="mb-1.5 flex justify-between text-xs"><span>{topic as string}</span><span className="font-mono-ui text-muted-foreground">{mins}m</span></div><div className="h-2 rounded-full bg-muted"><div className={`h-full rounded-full ${color}`} style={{ width: `${Number(mins) / 1.8}%` }} /></div></div>)}</div><div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Why this mix?</span> Transactions has the highest expected readiness gain per minute.</div></div><div className="card-surface rounded-xl p-5 sm:p-6"><div className="mb-4 flex items-center justify-between"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-muted-foreground">Next four sessions</p><p className="mt-1 text-sm font-semibold">{paused ? 'Plan paused' : 'Sequence ordered by expected gain'}</p></div><MoreHorizontal size={18} className="text-muted-foreground" /></div><div className="space-y-2">{sessions.map((session) => <button type="button" key={session.topic} onClick={() => setExpanded(expanded === session.topic ? null : session.topic)} className="w-full rounded-lg border border-border p-3 text-left transition-colors hover:bg-secondary/60" data-testid={`button-session-${session.topic.toLowerCase().replaceAll(' ', '-')}`}><div className="flex items-center gap-3"><span className={`h-2.5 w-2.5 rounded-full ${session.color}`} /><span className="w-20 text-xs text-muted-foreground">{session.day}<br /><span className="font-mono-ui text-[10px]">{session.date}</span></span><span className="flex-1 text-sm font-semibold">{session.topic}</span><span className="font-mono-ui text-xs text-muted-foreground">{session.minutes}m</span><ChevronDown size={15} className={`text-muted-foreground transition-transform ${expanded === session.topic ? 'rotate-180' : ''}`} /></div>{expanded === session.topic && <div className="ml-[calc(5rem+1.75rem)] mt-3 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">{session.detail}<span className="mt-2 block font-semibold text-primary">Method: retrieval → feedback → confidence check</span></div>}</button>)}</div></div></div>
  </div>;
}

function PracticePage() {
  const { completeQuiz, quizDone, notify } = useStudyPilot();
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const questions = [
    { q: 'Which schedule is conflict-serializable?', options: ['S1: r1(X), r2(X), w1(X), w2(X)', 'S2: r1(X), w1(X), r2(X), w2(X)', 'S3: w2(X), r1(X), w1(X), r2(X)'], answer: 1 },
    { q: 'What does strict 2PL prevent?', options: ['All deadlocks', 'Cascading rollbacks from dirty writes', 'Phantom reads under every isolation level'], answer: 1 },
    { q: 'A transaction waiting for itself indicates…', options: ['A deadlock cycle', 'A lost update', 'A checkpoint'], answer: 0 },
  ];
  const submit = () => { setSubmitted(true); completeQuiz(); };
  return <div className="mx-auto max-w-5xl space-y-7 animate-slide-up">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-primary">Proof point</p><h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">Adaptive practice lab</h2><p className="mt-3 max-w-2xl text-sm text-muted-foreground">The agent does not assume you learned it. It asks for evidence, scores your confidence, and feeds the result back into the plan.</p></div><div className="rounded-lg border border-border bg-card px-4 py-3 text-right"><p className="font-mono-ui text-[10px] uppercase text-muted-foreground">Set</p><p className="mt-1 font-display text-xl font-semibold">Transactions / 10</p></div></div>
    <div className="grid gap-5 lg:grid-cols-[1fr_280px]"><div className="card-surface rounded-xl p-5 sm:p-7"><div className="mb-6 flex items-center justify-between border-b border-border pb-4"><div><p className="text-sm font-semibold">Recovery patterns diagnostic</p><p className="mt-1 text-xs text-muted-foreground">3 representative questions · scored against your target</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${quizDone ? 'bg-primary/10 text-primary' : 'bg-accent/15 text-accent-foreground'}`}>{quizDone ? 'Evaluated' : 'In progress'}</span></div><div className="space-y-7">{questions.map((item, index) => <div key={item.q} data-testid={`question-${index + 1}`}><div className="flex gap-3"><span className="font-mono-ui text-xs text-primary">0{index + 1}</span><p className="text-sm font-semibold">{item.q}</p></div><div className="mt-3 space-y-2 pl-7">{item.options.map((option, optionIndex) => <button type="button" key={option} onClick={() => setSelected({ ...selected, [index]: String(optionIndex) })} className={`flex w-full items-center gap-3 rounded-lg border px-3.5 py-3 text-left text-xs transition-colors ${selected[index] === String(optionIndex) ? 'border-primary bg-primary/8 text-foreground' : 'border-border hover:bg-secondary'}`} data-testid={`button-answer-${index + 1}-${optionIndex + 1}`}><span className={`grid h-5 w-5 place-items-center rounded-full border text-[10px] ${selected[index] === String(optionIndex) ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground'}`}>{String.fromCharCode(65 + optionIndex)}</span>{option}{submitted && optionIndex === item.answer && <Check size={14} className="ml-auto text-primary" />}</button>)}</div></div>)}</div><div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-5"><button type="button" onClick={submit} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground" data-testid="button-submit-quiz"><CheckCircle2 size={15} /> Submit answers</button><button type="button" onClick={() => { completeQuiz(); notify('Simulated result applied: 8/10.', 'success'); }} className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-2.5 text-sm font-semibold text-accent-foreground" data-testid="button-simulate-result">Use simulated 8/10 result</button>{submitted && <span className="text-xs font-medium text-primary">Result sent to the agent.</span>}</div></div><aside className="space-y-4"><div className="rounded-xl bg-primary p-5 text-primary-foreground"><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary-foreground/70">Agent feedback</p><p className="mt-5 font-display text-3xl font-bold">{quizDone ? '8 / 10' : '— / 10'}</p><p className="mt-1 text-sm text-primary-foreground/75">{quizDone ? 'Evidence accepted' : 'Awaiting evidence'}</p><div className="mt-5 border-t border-primary-foreground/20 pt-4 text-xs leading-relaxed text-primary-foreground/75">A completed diagnostic updates readiness and changes which topic gets your next hour.</div></div><div className="card-surface rounded-xl p-5"><div className="flex items-center gap-2"><Timer size={16} className="text-primary" /><span className="text-sm font-semibold">Suggested cadence</span></div><p className="mt-3 text-xs leading-relaxed text-muted-foreground">Answer without notes. Mark uncertainty honestly. The agent learns more from a miss than a guess.</p></div></aside></div>
  </div>;
}

function ProgressPage() {
  const { readiness, transactions, normalization, quizDone } = useStudyPilot();
  const mastery = [['SQL', 90, 'text-primary', 'bg-primary'], ['Normalization', normalization, 'text-primary', 'bg-primary'], ['ER Modeling', 76, 'text-accent-foreground', 'bg-accent'], ['Transactions', transactions, 'text-destructive', 'bg-destructive'], ['Indexing', 82, 'text-primary', 'bg-primary']];
  const chart = [44, 49, 47, 53, 51, 58, readiness];
  return <div className="space-y-7 animate-slide-up">
    <div><p className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-primary">Evidence over time</p><h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">Readiness & mastery</h2><p className="mt-3 text-sm text-muted-foreground">A view of momentum, not just a final number.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Readiness" value={`${readiness}%`} detail={quizDone ? '+28 pts after adaptive quiz' : '+14 pts this week'} icon={Gauge} accent /><MetricCard label="Target" value="80%" detail={readiness >= 80 ? 'Crossed' : `${80 - readiness} pts remaining`} icon={Target} /><MetricCard label="Topics tracked" value="5" detail="2 require attention" icon={Layers3} /><MetricCard label="Confidence checks" value={quizDone ? '4' : '3'} detail="Last check: today" icon={CheckCircle2} /></div>
    <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]"><section className="card-surface rounded-xl p-5 sm:p-6"><SectionHeading eyebrow="Trajectory" title="Readiness trend" detail="Agent interventions are shown as the amber markers." /><div className="relative h-56 pt-3"><div className="absolute inset-x-0 top-0 flex justify-between text-[10px] text-muted-foreground"><span>100</span><span>75</span><span>50</span><span>25</span></div><div className="absolute inset-0 top-6 flex flex-col justify-between pb-7"><div className="border-t border-dashed border-border" /><div className="border-t border-dashed border-border" /><div className="border-t border-dashed border-border" /><div className="border-t border-dashed border-border" /></div><div className="absolute inset-x-0 bottom-7 top-8 flex items-end gap-2 sm:gap-4">{chart.map((value, index) => <div key={index} className="group relative flex h-full flex-1 items-end"><div className={`w-full rounded-t-md transition-all ${index === chart.length - 1 ? 'bg-primary' : 'bg-primary/35'}`} style={{ height: `${value}%` }} /><span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono-ui text-[10px] text-muted-foreground">{value}</span>{index === 4 && <span className="absolute bottom-[52%] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-accent ring-4 ring-accent/20" />}</div>)}</div><div className="absolute inset-x-0 bottom-0 flex justify-between text-[10px] text-muted-foreground"><span>May 08</span><span>May 10</span><span>May 12</span><span>Today</span></div></div><div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Readiness</span><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" /> Agent intervention</span></div></section><section className="card-surface rounded-xl p-5 sm:p-6"><SectionHeading eyebrow="Topic signals" title="Mastery map" detail="Scores the agent is using right now." /><div className="space-y-4">{mastery.map(([topic, score, text, bg]) => <div key={topic}><div className="mb-1.5 flex items-center justify-between text-xs"><span className="font-medium">{topic}</span><span className={`font-mono-ui font-semibold ${text}`}>{score}%</span></div><div className="h-2 rounded-full bg-muted"><div className={`h-full rounded-full ${bg} transition-all duration-700`} style={{ width: `${score}%` }} /></div></div>)}</div><div className="mt-6 rounded-lg border border-accent/30 bg-accent/10 p-3 text-xs leading-relaxed text-muted-foreground"><span className="font-semibold text-foreground">Signal:</span> Transactions moved {quizDone ? 'from 42% to 78%' : 'to 42%'} after the agent's diagnostic.</div></section></div>
  </div>;
}

function ResourcesPage() {
  const { notify } = useStudyPilot();
  const resources = [
    { topic: 'Transactions', title: 'The lock manager, without the fog', type: 'Guided note', time: '12 min', icon: Database, tone: 'accent' },
    { topic: 'SQL', title: 'Query plans you can read in one pass', type: 'Visual explainer', time: '18 min', icon: Code2, tone: 'primary' },
    { topic: 'Normalization', title: 'Functional dependencies field guide', type: 'Reference sheet', time: '8 min', icon: FileText, tone: 'muted' },
    { topic: 'ER Modeling', title: 'From entities to relations', type: 'Worked example', time: '15 min', icon: GitBranch, tone: 'primary' },
  ];
  return <div className="space-y-7 animate-slide-up"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-primary">Curated context</p><h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">Resources</h2><p className="mt-3 text-sm text-muted-foreground">Short, high-signal material selected for the current plan—not an endless library.</p></div><button type="button" onClick={() => notify('Resource search is scoped to your five active topics.', 'info')} className="inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2.5 text-sm font-semibold hover:bg-secondary" data-testid="button-search-resources"><Search size={15} /> Search resources</button></div><div className="grid gap-4 md:grid-cols-2">{resources.map((item) => { const Icon = item.icon; return <article key={item.title} className="card-surface group rounded-xl p-5 transition-transform hover:-translate-y-0.5"><div className="flex items-start justify-between"><span className={`rounded-lg p-2.5 ${item.tone === 'accent' ? 'bg-accent/20 text-accent-foreground' : item.tone === 'primary' ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}><Icon size={18} /></span><button type="button" onClick={() => notify(`${item.title} saved to your study queue.`, 'success')} aria-label={`Save ${item.title}`} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground" data-testid={`button-save-resource-${item.topic.toLowerCase().replaceAll(' ', '-')}`}><Plus size={16} /></button></div><p className="mt-5 font-mono-ui text-[10px] uppercase tracking-[.16em] text-muted-foreground">{item.topic} · {item.type}</p><h3 className="mt-2 font-display text-xl font-semibold">{item.title}</h3><div className="mt-5 flex items-center justify-between text-xs text-muted-foreground"><span>{item.time} read</span><button type="button" onClick={() => notify(`Opening ${item.title}.`, 'info')} className="inline-flex items-center gap-1 font-semibold text-primary" data-testid={`button-open-resource-${item.topic.toLowerCase().replaceAll(' ', '-')}`}>Open resource <ArrowRight size={13} /></button></div></article>; })}</div><div className="rounded-xl border border-primary/25 bg-primary/5 p-5"><div className="flex gap-3"><Sparkles size={18} className="mt-0.5 text-primary" /><div><p className="text-sm font-semibold">Resource selection is part of the loop</p><p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">When the agent sees a recurring miss, it does not just add time. It picks a different explanation format and schedules a confidence check afterward.</p></div></div></div></div>;
}

function ActivityPage() {
  const { notify } = useStudyPilot();
  const events = [
    ['09:42:08', 'Goal state loaded', 'read_goal', 'Read target 80%, 7-day horizon, and 5 active topics.', 'success'],
    ['09:42:12', 'Mastery snapshot captured', 'observe_mastery', 'Transactions 58% baseline; SQL 90%; Normalization 85%.', 'success'],
    ['09:42:18', 'Diagnostic queued', 'run_diagnostic', 'Selected 10-question retrieval check for the weakest signal.', 'info'],
    ['09:42:27', 'Bottleneck detected', 'evaluate_signal', 'Transactions fell through confidence floor at 42%.', 'warning'],
    ['09:42:31', 'Plan mutation proposed', 'reallocate_time', 'Transactions 30 → 60m; Normalization 60 → 30m.', 'info'],
    ['09:42:32', 'Awaiting proof', 'queue_quiz', 'Adaptive quiz is ready for learner confirmation.', 'success'],
  ];
  return <div className="space-y-7 animate-slide-up"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-primary">Event stream</p><h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">Agent activity</h2><p className="mt-3 text-sm text-muted-foreground">Every meaningful decision has a timestamp, a tool call, and a reason.</p></div><button type="button" onClick={() => notify('Activity stream refreshed.', 'success')} className="inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2.5 text-sm font-semibold hover:bg-secondary" data-testid="button-refresh-activity"><RefreshCw size={15} /> Refresh stream</button></div><div className="card-surface overflow-hidden rounded-xl"><div className="hidden grid-cols-[100px_1fr_145px] gap-4 border-b border-border bg-muted/40 px-5 py-3 font-mono-ui text-[10px] uppercase tracking-[.14em] text-muted-foreground sm:grid"><span>Time</span><span>Event</span><span>Tool call</span></div><div className="divide-y divide-border">{events.map(([time, title, tool, detail, tone], index) => <div key={tool} className="grid gap-3 px-5 py-4 sm:grid-cols-[100px_1fr_145px] sm:items-start sm:gap-4" data-testid={`activity-row-${index}`}><span className="font-mono-ui text-[11px] text-muted-foreground">{time}</span><div className="flex gap-3"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${tone === 'warning' ? 'bg-accent' : tone === 'info' ? 'bg-primary' : 'bg-primary/60'}`} /><div><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p></div></div><span className="ml-5 w-fit rounded-md bg-secondary px-2 py-1 font-mono-ui text-[10px] text-muted-foreground sm:ml-0">{tool}</span></div>)}</div></div></div>;
}

function ArchitecturePage() {
  const { notify } = useStudyPilot();
  const layers = [
    { label: 'Intent layer', detail: 'Goal · target · deadline · constraints', icon: Target, color: 'bg-accent/20 text-accent-foreground' },
    { label: 'State observer', detail: 'Mastery signals · quiz evidence · time budget', icon: Search, color: 'bg-primary/10 text-primary' },
    { label: 'Decision engine', detail: 'Bottleneck detection · expected gain · next action', icon: BrainCircuit, color: 'bg-primary/10 text-primary' },
    { label: 'Action tools', detail: 'Plan compiler · resource picker · quiz runner', icon: Code2, color: 'bg-secondary text-muted-foreground' },
    { label: 'Feedback loop', detail: 'Evaluate result · update state · adapt again', icon: RefreshCw, color: 'bg-primary/10 text-primary' },
  ];
  return <div className="space-y-7 animate-slide-up"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-primary">Under the hood</p><h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">System architecture</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">StudyPilot is a closed-loop agent. The plan is an output of reasoning, never the source of truth.</p></div><div className="card-surface rounded-xl p-5 sm:p-8"><div className="mx-auto flex max-w-3xl flex-col items-stretch">{layers.map((layer, index) => { const Icon = layer.icon; return <div key={layer.label} className="flex flex-col items-center"><div className="flex w-full items-center gap-4 rounded-xl border border-border bg-background p-4 sm:p-5"><div className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${layer.color}`}><Icon size={20} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="font-mono-ui text-[10px] uppercase tracking-[.15em] text-muted-foreground">0{index + 1}</span><h3 className="font-display text-base font-semibold">{layer.label}</h3></div><p className="mt-1 text-xs text-muted-foreground">{layer.detail}</p></div><ArrowDownRight size={18} className="hidden text-muted-foreground sm:block" /></div>{index < layers.length - 1 && <div className="h-6 w-px border-l border-dashed border-primary/50" />}</div>; })}</div><div className="mx-auto mt-8 max-w-3xl rounded-lg bg-foreground p-4 text-background sm:p-5"><div className="flex items-start gap-3"><Network size={18} className="mt-0.5 text-accent" /><div><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-background/60">Core invariant</p><p className="mt-2 text-sm leading-relaxed text-background/80">Observe → reason → act → evaluate. If the result disagrees with the goal, the loop starts again.</p></div></div></div></div><div className="grid gap-4 md:grid-cols-3">{[['Stateful', 'Remembers what changed between sessions.', Database], ['Explainable', 'Shows the signal behind every adaptation.', Lightbulb], ['Resilient', 'Recovers from misses instead of hiding them.', ShieldCheck]].map(([title, detail, Icon]) => <button type="button" key={title as string} onClick={() => notify(`${title} is a core design principle.`, 'info')} className="card-surface rounded-xl p-5 text-left hover:border-primary/40" data-testid={`button-architecture-${(title as string).toLowerCase()}`}><Icon size={18} className="text-primary" /><p className="mt-4 text-sm font-semibold">{title as string}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail as string}</p></button>)}</div></div>;
}

function SettingsPage() {
  const { dark, setDark, notify } = useStudyPilot();
  const [notifications, setNotifications] = useState(true);
  const [compact, setCompact] = useState(false);
  return <div className="mx-auto max-w-4xl space-y-7 animate-slide-up"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-primary">Control room</p><h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">Settings</h2><p className="mt-3 text-sm text-muted-foreground">Tune how StudyPilot surfaces signal while you focus.</p></div><div className="card-surface divide-y divide-border rounded-xl"><div className="flex flex-wrap items-center gap-4 p-5 sm:p-6"><div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><Moon size={18} /></div><div className="flex-1"><p className="text-sm font-semibold">Appearance</p><p className="mt-1 text-xs text-muted-foreground">Switch between daylight and midnight observability.</p></div><button type="button" onClick={() => { setDark(!dark); notify(`${!dark ? 'Midnight' : 'Daylight'} theme enabled.`, 'info'); }} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-secondary" data-testid="button-settings-theme">{dark ? <Sun size={14} /> : <Moon size={14} />}{dark ? 'Midnight mode' : 'Daylight mode'}</button></div><div className="flex items-center gap-4 p-5 sm:p-6"><div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-muted-foreground"><Bell size={18} /></div><div className="flex-1"><p className="text-sm font-semibold">Agent notifications</p><p className="mt-1 text-xs text-muted-foreground">Get a nudge when the agent detects a meaningful change.</p></div><button type="button" role="switch" aria-checked={notifications} onClick={() => { setNotifications(!notifications); notify(`Agent notifications ${notifications ? 'paused' : 'enabled'}.`, 'info'); }} className={`relative h-6 w-11 rounded-full transition-colors ${notifications ? 'bg-primary' : 'bg-muted'}`} data-testid="switch-notifications"><span className={`absolute top-1 h-4 w-4 rounded-full bg-card transition-transform ${notifications ? 'left-6' : 'left-1'}`} /></button></div><div className="flex items-center gap-4 p-5 sm:p-6"><div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-muted-foreground"><LayoutDashboard size={18} /></div><div className="flex-1"><p className="text-sm font-semibold">Compact telemetry</p><p className="mt-1 text-xs text-muted-foreground">Show denser cards and more event rows at once.</p></div><button type="button" role="switch" aria-checked={compact} onClick={() => { setCompact(!compact); notify(`Compact telemetry ${compact ? 'disabled' : 'enabled'}.`, 'info'); }} className={`relative h-6 w-11 rounded-full transition-colors ${compact ? 'bg-primary' : 'bg-muted'}`} data-testid="switch-compact"><span className={`absolute top-1 h-4 w-4 rounded-full bg-card transition-transform ${compact ? 'left-6' : 'left-1'}`} /></button></div></div><div className="rounded-xl border border-destructive/25 bg-destructive/5 p-5"><div className="flex items-start gap-3"><AlertTriangle size={17} className="mt-0.5 text-destructive" /><div><p className="text-sm font-semibold">Failure / recovery simulation</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Test the product's most important promise: when a source fails, the agent should explain the fallback and keep the goal moving.</p><button type="button" onClick={() => notify('Resource fetch failed. Agent recovered with a cached concept map and queued a retry.', 'warning')} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-destructive/30 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10" data-testid="button-simulate-failure"><AlertTriangle size={14} /> Simulate recovery</button></div></div></div></div>;
}

function NotFound() {
  const [, setLocation] = useLocation();
  return <div className="grid min-h-[60vh] place-items-center text-center"><div><p className="font-mono-ui text-xs uppercase tracking-[.2em] text-primary">404 / off course</p><h2 className="mt-3 font-display text-4xl font-bold">That route is not in the plan.</h2><button type="button" onClick={() => setLocation('/')} className="mt-5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground" data-testid="button-return-home">Return to command center</button></div></div>;
}

function Router() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/goals" component={GoalsPage} />
        <Route path="/agent" component={AgentPage} />
        <Route path="/plan" component={PlanPage} />
        <Route path="/practice" component={PracticePage} />
        <Route path="/progress" component={ProgressPage} />
        <Route path="/resources" component={ResourcesPage} />
        <Route path="/activity" component={ActivityPage} />
        <Route path="/architecture" component={ArchitecturePage} />
        <Route path="/settings" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <AppProvider>
            <RoutedErrorBoundary>
              <Router />
            </RoutedErrorBoundary>
          </AppProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;