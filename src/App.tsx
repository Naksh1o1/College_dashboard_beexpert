import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { KpiRow } from './components/readiness/KpiRow';
import { CohortDonut, type Band } from './components/readiness/CohortDonut';
import { DimensionGrid } from './components/readiness/DimensionGrid';
import { AiInsights, type InsightGroup, type Priority } from './components/readiness/AiInsights';
import {
  Activity,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Download,
  FileBarChart,
  FileText,
  Filter,
  GraduationCap,
  LayoutDashboard,
  ListFilter,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Target,
  UserRound,
  Users,
  X,
  Zap,
} from 'lucide-react';

type Page = 'Overview' | 'Students' | 'Companies & Jobs' | 'Placement Readiness' | 'Notifications' | 'Settings';
type Student = { 
  id: string; 
  name: string; 
  email: string; 
  department: string; 
  year: string; 
  score: number; 
  creditsUsed: number;
  placementStatus: 'Unplaced' | 'In Process' | 'Placed' | 'Not Eligible' | 'Opted Out'; 
  applications: number; 
  activeApplications: number;
  assessmentsTaken: number;
  assessmentsCleared: number;
  interviewsTaken: number;
  interviewsCleared: number;
  assessmentsList?: { name: string; cleared: boolean }[];
  interviewsList?: { name: string; detail: string; cleared: boolean }[];
  profileComplete?: boolean;
  missingFields?: string[];
  practiceAssessmentCredits?: number;
  practiceInterviewCredits?: number;
};
type Job = { id: string; company: string; role: string; department: string; location: string; applicants: number; status: string; deadline: string; logo: string; postedDate?: string; package?: string; description?: string; };
type Application = { studentId: string; jobId: string; status: 'Applied' | 'Not Applied' | 'In Progress' | 'Selected' | 'Rejected'; offerStatus?: 'Pending' | 'Accepted' | 'Declined' };

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const navItems: { label: Page; icon: typeof LayoutDashboard }[] = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Students', icon: Users },
  { label: 'Companies & Jobs', icon: BriefcaseBusiness },
  { label: 'Placement Readiness', icon: Target },
  { label: 'Notifications', icon: Bell },
  { label: 'Settings', icon: Settings2 },
];

const students: Student[] = [
  { 
    id: 'STU-2401', name: 'Aarav Mehta', email: 'aarav.mehta@campus.edu', department: 'CSE', year: 'Final Year', score: 88, creditsUsed: 12, placementStatus: 'In Process', 
    applications: 8, activeApplications: 3, assessmentsTaken: 4, assessmentsCleared: 3, interviewsTaken: 2, interviewsCleared: 1,
    assessmentsList: [
      { name: 'Python Fundamentals (TCS)', cleared: true },
      { name: 'Logical Reasoning (Infosys)', cleared: true },
      { name: 'Frontend Challenge (Wipro)', cleared: false },
      { name: 'Communication Skills', cleared: true }
    ],
    interviewsList: [
      { name: 'TCS', detail: 'Technical Round 1', cleared: true },
      { name: 'Infosys', detail: 'HR Round', cleared: false }
    ],
    profileComplete: true,
    practiceAssessmentCredits: 8,
    practiceInterviewCredits: 4
  },
  { 
    id: 'STU-2388', name: 'Diya Sharma', email: 'diya.sharma@campus.edu', department: 'ECE', year: 'Final Year', score: 82, creditsUsed: 8, placementStatus: 'In Process', 
    applications: 6, activeApplications: 2, assessmentsTaken: 2, assessmentsCleared: 2, interviewsTaken: 1, interviewsCleared: 1,
    assessmentsList: [
      { name: 'Core Electronics', cleared: true },
      { name: 'Aptitude Test', cleared: true }
    ],
    interviewsList: [
      { name: 'Qualcomm', detail: 'Technical Round 1', cleared: true }
    ],
    profileComplete: false,
    missingFields: ['Resume Upload', 'GitHub Link'],
    practiceAssessmentCredits: 5,
    practiceInterviewCredits: 3
  },
  { id: 'STU-2377', name: 'Rohan Kapoor', email: 'rohan.kapoor@campus.edu', department: 'IT', year: 'Final Year', score: 76, creditsUsed: 15, placementStatus: 'Unplaced', applications: 5, activeApplications: 4, assessmentsTaken: 8, assessmentsCleared: 5, interviewsTaken: 2, interviewsCleared: 0, profileComplete: true, practiceAssessmentCredits: 10, practiceInterviewCredits: 5 },
  { id: 'STU-2364', name: 'Ananya Iyer', email: 'ananya.iyer@campus.edu', department: 'CSE', year: 'Final Year', score: 91, creditsUsed: 10, placementStatus: 'Placed', applications: 9, activeApplications: 0, assessmentsTaken: 14, assessmentsCleared: 12, interviewsTaken: 6, interviewsCleared: 5, profileComplete: true, practiceAssessmentCredits: 6, practiceInterviewCredits: 4 },
  { id: 'STU-2359', name: 'Kabir Singh', email: 'kabir.singh@campus.edu', department: 'Mechanical', year: 'Final Year', score: 68, creditsUsed: 18, placementStatus: 'Unplaced', applications: 2, activeApplications: 1, assessmentsTaken: 5, assessmentsCleared: 2, interviewsTaken: 1, interviewsCleared: 0, profileComplete: false, missingFields: ['10th Marksheet', '12th Marksheet'], practiceAssessmentCredits: 12, practiceInterviewCredits: 6 },
  { id: 'STU-2341', name: 'Meera Nair', email: 'meera.nair@campus.edu', department: 'EEE', year: 'Final Year', score: 73, creditsUsed: 14, placementStatus: 'In Process', applications: 4, activeApplications: 2, assessmentsTaken: 7, assessmentsCleared: 4, interviewsTaken: 3, interviewsCleared: 1, profileComplete: true, practiceAssessmentCredits: 9, practiceInterviewCredits: 5 },
  { id: 'STU-2330', name: 'Arjun Rao', email: 'arjun.rao@campus.edu', department: 'Civil', year: 'Final Year', score: 64, creditsUsed: 4, placementStatus: 'Not Eligible', applications: 0, activeApplications: 0, assessmentsTaken: 3, assessmentsCleared: 0, interviewsTaken: 0, interviewsCleared: 0, profileComplete: false, missingFields: ['Portfolio Link'], practiceAssessmentCredits: 2, practiceInterviewCredits: 2 },
  { id: 'STU-2318', name: 'Ishita Bose', email: 'ishita.bose@campus.edu', department: 'MBA', year: 'Final Year', score: 79, creditsUsed: 9, placementStatus: 'In Process', applications: 7, activeApplications: 3, assessmentsTaken: 9, assessmentsCleared: 7, interviewsTaken: 4, interviewsCleared: 2, profileComplete: true, practiceAssessmentCredits: 6, practiceInterviewCredits: 3 },
  { id: 'STU-2305', name: 'Vikram Reddy', email: 'vikram.reddy@campus.edu', department: 'CSE', year: 'Final Year', score: 58, creditsUsed: 22, placementStatus: 'Opted Out', applications: 1, activeApplications: 0, assessmentsTaken: 4, assessmentsCleared: 1, interviewsTaken: 0, interviewsCleared: 0, profileComplete: true, practiceAssessmentCredits: 14, practiceInterviewCredits: 8 },
  { id: 'STU-2291', name: 'Sara Khan', email: 'sara.khan@campus.edu', department: 'IT', year: 'Final Year', score: 85, creditsUsed: 11, placementStatus: 'Placed', applications: 6, activeApplications: 0, assessmentsTaken: 11, assessmentsCleared: 9, interviewsTaken: 5, interviewsCleared: 4, profileComplete: true, practiceAssessmentCredits: 7, practiceInterviewCredits: 4 },
];

const mockApplications: Application[] = [
  { studentId: 'STU-2401', jobId: 'JOB-108', status: 'Applied' },
  { studentId: 'STU-2401', jobId: 'JOB-106', status: 'Applied' },
  { studentId: 'STU-2388', jobId: 'JOB-108', status: 'Applied' },
  { studentId: 'STU-2364', jobId: 'JOB-106', status: 'Selected', offerStatus: 'Pending' },
  { studentId: 'STU-2291', jobId: 'JOB-104', status: 'Selected', offerStatus: 'Accepted' },
  { studentId: 'STU-2341', jobId: 'JOB-101', status: 'Selected', offerStatus: 'Pending' },
];

const jobs: Job[] = [
  { id: 'JOB-108', company: 'TCS', role: 'Digital Engineer', department: 'All departments', location: 'Bengaluru', applicants: 231, status: 'Applications Open', deadline: 'Sep 18, 2025', logo: 'T', postedDate: '2026-08-08', package: '₹7.0 LPA', description: 'Development and maintenance of digital applications.' },
  { id: 'JOB-106', company: 'Infosys', role: 'Systems Engineer', department: 'CSE, IT, ECE', location: 'Pune', applicants: 184, status: 'Assessment Ongoing', deadline: 'Sep 12, 2025', logo: 'I', postedDate: '2026-07-28', package: '₹3.6 - ₹5.0 LPA', description: 'System integration and software engineering.' },
  { id: 'JOB-104', company: 'Wipro', role: 'Associate Engineer', department: 'CSE, EEE', location: 'Hyderabad', applicants: 142, status: 'Interviews Ongoing', deadline: 'Sep 04, 2025', logo: 'W', postedDate: '2026-08-09', package: '₹4.0 LPA', description: 'Assisting in software development lifecycle.' },
  { id: 'JOB-101', company: 'HCLTech', role: 'Graduate Engineer', department: 'All departments', location: 'Noida', applicants: 98, status: 'Applications Open', deadline: 'Sep 22, 2025', logo: 'H', postedDate: '2026-08-10', package: '₹4.25 LPA', description: 'Entry level software engineering position.' },
  { id: 'JOB-099', company: 'Zoho', role: 'Product Engineer', department: 'CSE, IT', location: 'Chennai', applicants: 76, status: 'Assessment Ongoing', deadline: 'Aug 29, 2025', logo: 'Z', postedDate: '2026-08-05', package: '₹8.0 - ₹12.0 LPA', description: 'Full stack product development.' },
];

const funnel = [
  { label: 'Registered', value: 2438, percent: '100%', color: '#5438d8' },
  { label: 'Eligible', value: 2146, percent: '88%', color: '#6751de' },
  { label: 'Applied', value: 1804, percent: '74%', color: '#7969e4' },
  { label: 'Assessment Completed', value: 1614, percent: '66%', color: '#3b9bb6' },
  { label: 'Interview Completed', value: 982, percent: '40%', color: '#ee9d19' },
  { label: 'Selected', value: 624, percent: '26%', color: '#e54f45' },
];

const attentionItems = [
  { label: 'Profiles incomplete', value: 148, icon: UserRound, tone: 'red', page: 'Students' as Page, filter: 'Profile incomplete' },
  { label: 'Offers awaiting response', value: 19, icon: FileText, tone: 'purple', page: 'Students' as Page, filter: 'Shortlisted' },
  { label: 'New companies this week', value: 6, icon: Building2, tone: 'green', page: 'Companies & Jobs' as Page, filter: 'New' },
];

const trend = [220, 340, 500, 650, 890, 710, 850, 950];
const departments = [{ name: 'CSE', value: 82 }, { name: 'ECE', value: 68 }, { name: 'IT', value: 61 }, { name: 'Mech', value: 54 }, { name: 'EEE', value: 47 }, { name: 'Civil', value: 39 }, { name: 'MBA', value: 52 }, { name: 'MCA', value: 58 }];

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value);
}

function App() {
  const getInitialSettings = () => {
    try {
      const saved = localStorage.getItem('placement_dashboard_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      academicYear: '2025–26',
      department: 'All Departments',
      weeklyEmails: true,
      opportunityAlerts: true,
      practiceCredits: false,
      institutionName: 'P.K. College of Engineering',
      placementOfficer: 'Placement Officer',
      contactEmail: 'placements@pkce.edu'
    };
  };

  const initialSettings = getInitialSettings();
  const [page, setPage] = useState<Page>('Overview');
  const [academicYear, setAcademicYear] = useState(initialSettings.academicYear);
  const [department, setDepartment] = useState(initialSettings.department);
  const [weeklyEmails, setWeeklyEmails] = useState(initialSettings.weeklyEmails);
  const [opportunityAlerts, setOpportunityAlerts] = useState(initialSettings.opportunityAlerts);
  const [practiceCredits, setPracticeCredits] = useState(initialSettings.practiceCredits ?? false);
  const [institutionName, setInstitutionName] = useState(initialSettings.institutionName);
  const [placementOfficer, setPlacementOfficer] = useState(initialSettings.placementOfficer);
  const [contactEmail, setContactEmail] = useState(initialSettings.contactEmail);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New job posted by Deloitte', description: '3 new roles match your campus criteria', time: '10 min ago', icon: Building2, unread: true },
    { id: 2, title: '73 assessment submissions pending', description: 'Python Fundamentals needs follow-up', time: '2 hours ago', icon: ClipboardCheck, unread: true },
    { id: 3, title: 'Interview panel conflict detected', description: 'TCS · Digital Engineer · Sep 04', time: '5 hours ago', icon: CalendarDays, unread: true },
    { id: 4, title: 'Monthly placement report is ready', description: 'Your August review can be downloaded', time: 'Yesterday', icon: FileBarChart, unread: true }
  ]);
  const unreadCount = notifications.filter(n => n.unread).length;
  const [toast, setToast] = useState('');
  const [studentFilter, setStudentFilter] = useState('All Students');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [query, setQuery] = useState('');
  const [jobStatus, setJobStatus] = useState('All statuses');
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const loadState = async (): Promise<void> => {
      if (!supabase) return;
      const { data } = await supabase.from('placement_dashboard_state').select('academic_year, department, notifications_read').eq('id', 'demo').maybeSingle();
      if (active && data && data.notifications_read !== undefined) {
        setNotifications(prev => prev.map((n, i) => ({ ...n, unread: i >= data.notifications_read })));
      }
    };
    void loadState();
    return () => { active = false; };
  }, []);

  const saveState = async (changes: { academic_year?: string; department?: string; notifications_read?: number }): Promise<void> => {
    if (!supabase) return;
    await supabase.from('placement_dashboard_state').upsert({ id: 'demo', ...changes, updated_at: new Date().toISOString() });
  };

  const notify = (message: string): void => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2400);
  };

  const changeYear = (value: string): void => { 
    setAcademicYear(value); 
    void saveState({ academic_year: value }); 
    const current = getInitialSettings();
    localStorage.setItem('placement_dashboard_settings', JSON.stringify({ ...current, academicYear: value }));
  };
  const changeDepartment = (value: string): void => { 
    setDepartment(value); 
    void saveState({ department: value }); 
    const current = getInitialSettings();
    localStorage.setItem('placement_dashboard_settings', JSON.stringify({ ...current, department: value }));
  };
  
  const saveAllSettings = (newSettings: any): void => {
    setAcademicYear(newSettings.academicYear);
    setDepartment(newSettings.department);
    setWeeklyEmails(newSettings.weeklyEmails);
    setOpportunityAlerts(newSettings.opportunityAlerts);
    setPracticeCredits(newSettings.practiceCredits);
    setInstitutionName(newSettings.institutionName);
    setPlacementOfficer(newSettings.placementOfficer);
    setContactEmail(newSettings.contactEmail);
    
    void saveState({ academic_year: newSettings.academicYear, department: newSettings.department });
    localStorage.setItem('placement_dashboard_settings', JSON.stringify(newSettings));
    notify('Changes saved');
  };

  const openAttention = (item: typeof attentionItems[number]): void => { setPage(item.page); setStudentFilter(item.filter); setQuery(''); };

  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={(next) => { setPage(next); setSelectedStudent(null); setSelectedJob(null); }} unreadCount={unreadCount} institutionName={institutionName} placementOfficer={placementOfficer} />
      <main className="main-area">
        <Header page={page} academicYear={academicYear} department={department} changeYear={changeYear} changeDepartment={changeDepartment} notifications={notifications} setNotifications={(n) => { setNotifications(n); void saveState({ notifications_read: n.filter(x => !x.unread).length }); }} unreadCount={unreadCount} setPage={setPage} institutionName={institutionName} placementOfficer={placementOfficer} openProfile={() => setProfileModalOpen(true)} />
        {page === 'Overview' && <Overview setPage={setPage} setStudentFilter={setStudentFilter} setSelectedJob={setSelectedJob} setSelectedStudent={setSelectedStudent} openAttention={openAttention} notify={notify} />}
        {page === 'Students' && <StudentsPage query={query} setQuery={setQuery} filter={studentFilter} setFilter={setStudentFilter} department={department} selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent} practiceCredits={practiceCredits} />}
        {page === 'Companies & Jobs' && <JobsPage query={query} setQuery={setQuery} status={jobStatus} setStatus={setJobStatus} selectedJob={selectedJob} setSelectedJob={setSelectedJob} notify={notify} />}
        {page === 'Placement Readiness' && <PlacementReadinessPage setSelectedStudent={setSelectedStudent} />}
        {page === 'Notifications' && <NotificationsPage notifications={notifications} setNotifications={(n) => { setNotifications(n); void saveState({ notifications_read: n.filter(x => !x.unread).length }); }} />}
        {page === 'Settings' && <SettingsPage currentSettings={{ academicYear, department, weeklyEmails, opportunityAlerts, practiceCredits, institutionName, placementOfficer, contactEmail }} onSave={saveAllSettings} />}
      </main>
      {toast && <div className="toast"><CheckCircle2 size={17} />{toast}</div>}
      {selectedStudent && <StudentProfileModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />}
      {selectedJob && <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
      {profileModalOpen && <OfficerProfileModal institutionName={institutionName} placementOfficer={placementOfficer} contactEmail={contactEmail} onClose={() => setProfileModalOpen(false)} onSave={(info) => { saveAllSettings({ academicYear, department, weeklyEmails, opportunityAlerts, practiceCredits, ...info }); setProfileModalOpen(false); }} />}
    </div>
  );
}

function Sidebar({ page, setPage, unreadCount, institutionName, placementOfficer }: { page: Page; setPage: (page: Page) => void; unreadCount: number; institutionName: string; placementOfficer: string }) {
  const initials = placementOfficer.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'PO';
  return <aside className="sidebar">
    <div className="brand"><div className="brand-mark"><Sparkles size={21} /></div><span>BeExpert<span className="brand-dot">.ai</span></span></div>
    <nav className="nav-list">{navItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${page === label ? 'active' : ''}`} onClick={() => setPage(label)}><Icon size={17} /><span>{label}</span>{label === 'Notifications' && unreadCount > 0 && <b className="nav-badge">{unreadCount}</b>}</button>)}</nav>
    <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><Sparkles size={16} /></div><div><strong>Need Help?</strong><span>Contact Support</span></div><ChevronRight size={15} /></div></div>
  </aside>;
}

function Header({ page, academicYear, department, changeYear, changeDepartment, notifications, setNotifications, unreadCount, setPage, institutionName, placementOfficer, openProfile }: { page: Page; academicYear: string; department: string; changeYear: (value: string) => void; changeDepartment: (value: string) => void; notifications: any[]; setNotifications: (n: any[]) => void; unreadCount: number; setPage: (page: Page) => void; institutionName: string; placementOfficer: string; openProfile: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (!notifOpen && !profileOpen) return;
    const close = () => { setNotifOpen(false); setProfileOpen(false); };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [notifOpen, profileOpen]);

  return <header className="topbar">
    <div><div className="eyebrow">PLACEMENT COMMAND CENTER</div><h1>{page}</h1><p>{page === 'Overview' ? `Placement overview for Academic Year ${academicYear}` : 'Manage your campus placement operations'}</p></div>
    <div className="header-actions">
      <Select value={academicYear} onChange={changeYear} options={['2025–26', '2024–25', '2023–24']} icon={<CalendarDays size={15} />} />
      <Select value={department} onChange={changeDepartment} options={['All Departments', 'CSE', 'IT', 'ECE', 'EEE']} icon={<GraduationCap size={15} />} />
      
      <div className="header-control" onClick={(e) => { e.stopPropagation(); setNotifOpen(!notifOpen); setProfileOpen(false); }}>
        <button className={`icon-button notification-button ${notifOpen ? 'active' : ''}`} style={{ borderColor: notifOpen ? '#b0a3f8' : '', background: notifOpen ? '#f5f3ff' : '' }}>
          <Bell size={18} />{unreadCount > 0 && <i>{unreadCount}</i>}
        </button>
        {notifOpen && <div className="popover large" onClick={(e) => e.stopPropagation()}>
          <div className="popover-header">
            <span>Notifications</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}>Mark all read</button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {notifications.length > 0 ? notifications.map(n => {
              const Icon = n.icon;
              return (
              <button key={n.id} className={`notification-item ${n.unread ? 'unread' : ''}`} onClick={() => setNotifications(notifications.map(item => item.id === n.id ? { ...item, unread: false } : item))}>
                <div className="notification-icon-wrap"><Icon size={14} /></div>
                <div className="notification-content">
                  <strong>{n.title}</strong>
                  <span>{n.time}</span>
                </div>
              </button>
            )}) : <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)', fontSize: '11px' }}>No new notifications</div>}
          </div>
        </div>}
      </div>

      <div className="header-control" onClick={(e) => { e.stopPropagation(); setProfileOpen(!profileOpen); setNotifOpen(false); }}>
        <div className="header-user" style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', background: profileOpen ? '#f5f3ff' : 'transparent', transition: '0.15s' }}>
          <div className="avatar small">{placementOfficer.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'PO'}</div><div><strong>{placementOfficer}</strong><span>{institutionName}</span></div><ChevronDown size={14} style={{ transform: profileOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
        </div>
        {profileOpen && <div className="popover" onClick={(e) => e.stopPropagation()}>
          <div className="popover-header">Account</div>
          <button className="popover-item" onClick={() => { setProfileOpen(false); openProfile(); }}><UserRound size={15} /> Profile</button>
          <button className="popover-item" onClick={() => { setProfileOpen(false); setPage('Settings'); }}><Settings2 size={15} /> Settings</button>
          <div className="popover-divider"></div>
          <button className="popover-item" onClick={() => { setProfileOpen(false); }} style={{ color: '#e0524a' }}><Zap size={15} /> Sign Out</button>
        </div>}
      </div>
    </div>
  </header>;
}

function Select({ value, onChange, options, icon }: { value: string; onChange: (value: string) => void; options: string[]; icon?: ReactNode }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);

  return <div className="header-control" onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
    <button className={`header-control-trigger select-wrap ${open ? 'active' : ''}`}>
      {icon}
      <span style={{ flex: 1, textAlign: 'left' }}>{value}</span>
      <ChevronDown size={13} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
    </button>
    {open && <div className="popover left" onClick={(e) => e.stopPropagation()}>
      {options.map((option) => <button key={option} className="popover-item" onClick={() => { onChange(option); setOpen(false); }}>{option}{value === option && <Check size={14} style={{ marginLeft: 'auto' }} />}</button>)}
    </div>}
  </div>;
}

function Overview({ setPage, setStudentFilter, setSelectedJob, setSelectedStudent, openAttention, notify }: { setPage: (page: Page) => void; setStudentFilter: (filter: string) => void; setSelectedJob: (job: Job | null) => void; setSelectedStudent: (student: Student | null) => void; openAttention: (item: any) => void; notify: (message: string) => void }) {
  const uniqueStudentsApplied = new Set(mockApplications.map(app => app.studentId)).size;
  const uniqueStudentsAssessmentsCleared = students.filter(s => s.assessmentsCleared > 0).length;
  const uniqueStudentsInterviewsCleared = students.filter(s => s.interviewsCleared > 0).length;

  const incompleteProfiles = students.filter(s => s.profileComplete === false);
  const pendingOffers = mockApplications.filter(a => a.status === 'Selected' && a.offerStatus === 'Pending');
  
  // Use today as proxy for 'current week' logic (mocking current date to 2026-08-11)
  const today = new Date('2026-08-11');
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);
  const newCompanies = jobs.filter(j => j.postedDate && new Date(j.postedDate) >= oneWeekAgo);

  const dynamicAttentionItems = [
    { label: 'Profiles incomplete', value: incompleteProfiles.length, icon: UserRound, tone: 'red', category: 'Profiles Incomplete' },
    { label: 'Offers awaiting response', value: pendingOffers.length, icon: FileText, tone: 'purple', category: 'Offers Awaiting Response' },
    { label: 'New companies this week', value: newCompanies.length, icon: Building2, tone: 'green', category: 'New Companies This Week' },
  ];

  const kpis = [
    { label: 'Total Students', value: '2,438', note: '100% registered', icon: Users, tone: 'lilac' },
    { label: 'Eligible Students', value: '2,146', note: '88% of total students', icon: CheckCircle2, tone: 'mint' },
    { label: 'Students Applied', value: uniqueStudentsApplied.toString(), note: '74% of eligible students', icon: BriefcaseBusiness, tone: 'blue' },
    { label: 'Assessments Cleared', value: uniqueStudentsAssessmentsCleared.toString(), note: '66% of eligible students', icon: ClipboardCheck, tone: 'peach' },
    { label: 'Interviews Cleared', value: uniqueStudentsInterviewsCleared.toString(), note: '40% of eligible students', icon: CalendarDays, tone: 'sky' },
    { label: 'Active Companies', value: jobs.length.toString(), note: 'Based on current data', icon: Building2, tone: 'green' },
  ];

  const [attentionModalOpen, setAttentionModalOpen] = useState(false);
  const [attentionTab, setAttentionTab] = useState('Profiles Incomplete');

  const openAttentionModal = (category: string) => {
    setAttentionTab(category);
    setAttentionModalOpen(true);
  };

  return <div className="page-content">
    <div className="kpi-grid">{kpis.map(({ label, value, note, icon: Icon, tone }) => <div className="kpi-card" key={label}><div className={`metric-icon ${tone}`}><Icon size={21} /></div><div className="metric-copy"><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div>)}</div>
    <div className="two-col top-panels">
      <Opportunities setPage={setPage} setSelectedJob={setSelectedJob} />
      <Panel title="Needs Attention" action="View all" onAction={() => openAttentionModal('Profiles Incomplete')}>
        <div className="attention-list">
          {dynamicAttentionItems.map((item) => 
            <button className="attention-row" key={item.label} onClick={() => openAttentionModal(item.category)}>
              <div className={`attention-icon ${item.tone}`}><item.icon size={16} /></div>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </Panel>
    </div>
    <DepartmentChart notify={notify} />
    <Panel title="Recent Activity" action="View all"><div className="activity-strip">{['Accenture registered for campus drive', 'Python assessment completed by 56 students', 'TCS interview scheduled for 18 students', '24 students updated their profiles', 'Deloitte posted 3 new job openings'].map((text, index) => <div className="activity-item" key={text}><div className={`activity-icon a${index}`}><Activity size={15} /></div><div><strong>{text}</strong><span>{index < 3 ? `${index + 2} hours ago` : 'Yesterday'}</span></div></div>)}</div></Panel>
    
    {attentionModalOpen && <DetailModal title={attentionTab === 'Profiles Incomplete' ? 'Incomplete Profiles' : attentionTab === 'Offers Awaiting Response' ? 'Offers Awaiting Response' : 'New Companies This Week'} onClose={() => setAttentionModalOpen(false)}>
      
      {attentionTab === 'Profiles Incomplete' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Student</th><th>Department</th><th>Score</th><th>Missing Information</th></tr></thead>
            <tbody>
              {incompleteProfiles.length > 0 ? incompleteProfiles.map(s => (
                <tr key={s.id} onClick={() => { setSelectedStudent(s); setAttentionModalOpen(false); }} style={{ cursor: 'pointer' }}>
                  <td><div className="person-cell"><div><strong>{s.name}</strong><span>{s.year}</span></div></div></td>
                  <td>{s.department}</td>
                  <td><div className="readiness-cell"><span className="readiness-score">{s.score}</span></div></td>
                  <td><span className="status-pill warning">{s.missingFields?.join(', ') || 'Unknown'}</span></td>
                </tr>
              )) : <tr><td colSpan={4} style={{ textAlign: 'center' }}>No incomplete profiles</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      
      {attentionTab === 'Offers Awaiting Response' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Student</th><th>Company</th><th>Role</th><th>Offer Status</th></tr></thead>
            <tbody>
              {pendingOffers.length > 0 ? pendingOffers.map((a, i) => {
                const s = students.find(st => st.id === a.studentId);
                const j = jobs.find(jb => jb.id === a.jobId);
                return <tr key={i} onClick={() => { if(s) { setSelectedStudent(s); setAttentionModalOpen(false); } }} style={{ cursor: 'pointer' }}>
                  <td><div className="person-cell"><div><strong>{s?.name}</strong><span>{s?.department}</span></div></div></td>
                  <td>{j?.company}</td>
                  <td>{j?.role}</td>
                  <td><span className="status-pill neutral">Awaiting Student Response</span></td>
                </tr>
              }) : <tr><td colSpan={4} style={{ textAlign: 'center' }}>No pending offers</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {attentionTab === 'New Companies This Week' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Company</th><th>Role</th><th>Date Added</th><th>Location</th></tr></thead>
            <tbody>
              {newCompanies.length > 0 ? newCompanies.map(j => (
                <tr key={j.id} onClick={() => { setSelectedJob(j); setAttentionModalOpen(false); }} style={{ cursor: 'pointer' }}>
                  <td><div className="person-cell"><div className="company-logo table-logo">{j.logo}</div><div><strong>{j.company}</strong><span>{j.status}</span></div></div></td>
                  <td>{j.role}</td>
                  <td>{new Date(j.postedDate!).toLocaleDateString()}</td>
                  <td>{j.location}</td>
                </tr>
              )) : <tr><td colSpan={4} style={{ textAlign: 'center' }}>No new companies this week</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </DetailModal>}
  </div>;
}



function Panel({ title, action, children, onAction, className }: { title: string; action?: string; children: ReactNode; onAction?: () => void; className?: string }) { return <section className={`panel ${className || ''}`}><div className="panel-heading"><h2>{title}</h2>{action && <button className="text-action" onClick={onAction}>{action}<ChevronRight size={14} /></button>}</div>{children}</section>; }
function ArrowUpRight({ size = 15 }: { size?: number }) { return <ArrowDownRight className="kpi-arrow" size={size} />; }

function DepartmentChart({ notify }: { notify: (message: string) => void }) { return <Panel title="Placement Rate by Department" action="Export"><div className="bar-chart">{departments.map((department) => <div className="bar-group" key={department.name}><strong>{department.value}%</strong><div className="bar" style={{ height: `${department.value}%` }} /><span>{department.name}</span></div>)}</div><p className="chart-note">Placement rate = Selected Students / Eligible Students</p><button className="chart-export" onClick={() => notify('Department report exported')}>Export department report <Download size={13} /></button></Panel>; }
function Opportunities({ setPage, setSelectedJob }: { setPage: (page: Page) => void; setSelectedJob: (job: Job | null) => void }) { return <Panel title="Active Opportunities" action="View all jobs"><div className="opportunity-list">{jobs.map((job) => <button className="opportunity-row" key={job.id} onClick={() => { setSelectedJob(job); setPage('Companies & Jobs'); }}><div className="company-logo">{job.logo}</div><div className="opportunity-name"><strong>{job.company}</strong><span>{job.role}</span></div><small>{job.applicants} Applicants</small><em className={job.status === 'Applications Open' ? 'open' : 'ongoing'}>{job.status}</em></button>)}</div><button className="more-link" onClick={() => setPage('Companies & Jobs')}><Plus size={14} />31 more active jobs</button></Panel>; }

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) { return <div className="content-head"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2><p>{description}</p></div>{action}</div>; }
function Toolbar({ query, setQuery, children, placeholder = 'Search by name, email or ID...' }: { query: string; setQuery: (query: string) => void; children?: ReactNode; placeholder?: string }) { return <div className="toolbar"><div className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} /></div>{children}</div>; }

function StudentsPage({ query, setQuery, filter, setFilter, department, selectedStudent, setSelectedStudent, practiceCredits }: { query: string; setQuery: (query: string) => void; filter: string; setFilter: (filter: string) => void; department: string; selectedStudent: Student | null; setSelectedStudent: (student: Student | null) => void; practiceCredits: boolean }) {
  const readinessLabel = (score: number) => score >= 80 ? 'Ready' : score >= 60 ? 'Developing' : 'Needs Improvement';
  const filtered = useMemo(() => students.filter((student) => (department === 'All Departments' || student.department === department) && (filter === 'All Students' || student.placementStatus === filter) && `${student.name} ${student.email} ${student.id}`.toLowerCase().includes(query.toLowerCase())), [department, filter, query]);
  
  return <div className="page-content"><PageHeader eyebrow="STUDENT DIRECTORY" title="Students" description="Track readiness, applications, and placement progress for every student." action={<button className="primary-button"><Plus size={16} />Add student</button>} /><Panel title="Student directory"><Toolbar query={query} setQuery={setQuery}><Select value={department} onChange={() => {}} options={['All Departments', 'CSE', 'ECE', 'IT', 'Mechanical', 'MBA']} icon={<Filter size={15} />} /><Select value="All Courses" onChange={() => {}} options={['All Courses', 'B.Tech', 'M.Tech', 'MBA']} icon={<Filter size={15} />} /><Select value="All Batches" onChange={() => {}} options={['All Batches', '2021-25', '2022-26', '2023-27']} icon={<Filter size={15} />} /><Select value="All Semesters" onChange={() => {}} options={['All Semesters', 'Sem 7', 'Sem 8']} icon={<Filter size={15} />} /><Select value={filter} onChange={setFilter} options={['All Students', 'Unplaced', 'In Process', 'Placed', 'Not Eligible', 'Opted Out']} icon={<Filter size={15} />} /><Select value="All Readiness" onChange={() => {}} options={['All Readiness', 'Ready', 'Developing', 'Needs Improvement']} icon={<Filter size={15} />} /><button className="outline-button"><SlidersHorizontal size={15} />More Filters</button></Toolbar><div className="table-wrap"><table><thead><tr><th>Student</th><th>Department</th><th>Readiness</th><th>Credits Used</th><th>Placement Status</th><th>View</th></tr></thead><tbody>{filtered.map((student) => <tr key={student.id} onClick={() => setSelectedStudent(student)}><td><div className="person-cell"><div className="avatar table-avatar">{student.name.split(' ').map((part) => part[0]).join('')}</div><div><strong>{student.name}</strong><span>{student.id} · {student.email}</span></div></div></td><td>{student.department}<small>{student.year}</small></td><td><div className="readiness-cell"><span className="readiness-score">{student.score}</span><span className={`readiness-label ${student.score >= 80 ? 'ready' : student.score >= 60 ? 'developing' : 'needs'}`}>{readinessLabel(student.score)}</span></div></td><td><strong>{student.creditsUsed}</strong></td><td><span className={`status-pill ${student.placementStatus === 'Placed' ? 'success' : student.placementStatus === 'Not Eligible' || student.placementStatus === 'Opted Out' ? 'warning' : 'neutral'}`}>{student.placementStatus}</span></td><td><button className="icon-button" onClick={(e) => { e.stopPropagation(); setSelectedStudent(student); }}><ChevronRight size={16} /></button></td></tr>)}</tbody></table></div><div className="pagination"><span>Showing {filtered.length} of 2,438 students</span><div><button><ArrowLeft size={14} /></button><button className="current">1</button><button>2</button><button>3</button><button><ArrowRight size={14} /></button></div></div></Panel></div>;
}

function JobsPage({ query, setQuery, status, setStatus, selectedJob, setSelectedJob, notify }: { query: string; setQuery: (query: string) => void; status: string; setStatus: (status: string) => void; selectedJob: Job | null; setSelectedJob: (job: Job | null) => void; notify: (message: string) => void }) {
  const filtered = jobs.filter((job) => (status === 'All statuses' || job.status === status) && `${job.company} ${job.role} ${job.department}`.toLowerCase().includes(query.toLowerCase()));
  
  return <div className="page-content"><PageHeader eyebrow="EMPLOYER RELATIONSHIPS" title="Companies & Jobs" description="Manage hiring partners, open roles, and campus recruitment drives." action={<button className="primary-button" onClick={() => notify('New job form is ready to configure')}><Plus size={16} />Post a job</button>} /><div className="summary-row"><div><strong>86</strong><span>Active companies</span></div><div><strong>142</strong><span>Open positions</span></div><div><strong>731</strong><span>Applications this month</span></div><div><strong>12</strong><span>Active drives</span></div></div><Panel title="Job opportunities"><Toolbar query={query} setQuery={setQuery} placeholder="Search companies or roles..."><Select value="All Departments" onChange={() => {}} options={['All Departments', 'CSE', 'ECE', 'IT', 'Mechanical', 'MBA']} icon={<Filter size={15} />} /><Select value="All Drives" onChange={() => {}} options={['All Drives', 'TCS Campus Drive', 'Infosys Talent Hunt', 'Wipro Elite NTH', 'Accenture Triumphant']} icon={<Filter size={15} />} /><Select value="All Deadlines" onChange={() => {}} options={['All Deadlines', 'This week', 'Next week', 'This month', 'Overdue']} icon={<Filter size={15} />} /><Select value={status} onChange={setStatus} options={['All statuses', 'Applications Open', 'Assessment Ongoing', 'Interviews Ongoing']} icon={<ListFilter size={15} />} /><button className="outline-button"><SlidersHorizontal size={15} />More filters</button></Toolbar><div className="table-wrap"><table><thead><tr><th>Company & role</th><th>Eligible programs</th><th>Location</th><th>Applicants</th><th>Deadline</th><th>Status</th><th /></tr></thead><tbody>{filtered.map((job) => {
    const applicantCount = new Set(mockApplications.filter(app => app.jobId === job.id).map(app => app.studentId)).size;
    return (
      <tr key={job.id} onClick={() => setSelectedJob(job)}><td><div className="person-cell"><div className="company-logo table-logo">{job.logo}</div><div><strong>{job.company}</strong><span>{job.role} · {job.id}</span></div></div></td><td>{job.department}</td><td>{job.location}</td><td><strong>{applicantCount}</strong></td><td>{job.deadline}</td><td><span className={`status-pill ${job.status === 'Applications Open' ? 'success' : 'warning'}`}>{job.status}</span></td><td><ChevronRight size={16} /></td></tr>
    );
  })}</tbody></table></div><div className="pagination"><span>Showing {filtered.length} active opportunities</span><div><button className="current">1</button><button>2</button><button>3</button><button><ArrowRight size={14} /></button></div></div></Panel></div>;
}


function NotificationsPage({ notifications, setNotifications }: { notifications: any[]; setNotifications: (n: any[]) => void }) { return <div className="page-content"><PageHeader eyebrow="INBOX" title="Notifications" description="Stay on top of the actions that keep your placement cycle moving." action={<button className="outline-button" onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}><Check size={15} />Mark all as read</button>} /><Panel title="Your notifications"><div className="notification-list">{notifications.map((n) => { const Icon = n.icon; return <div className={`notification-row ${n.unread ? 'unread' : ''}`} key={n.id} onClick={() => setNotifications(notifications.map(item => item.id === n.id ? { ...item, unread: false } : item))} style={{ cursor: 'pointer' }}><div className="attention-icon purple"><Icon size={16} /></div><div><strong>{n.title}</strong><p>{n.description}</p><span>{n.time}</span></div>{n.unread && <i />}</div>; })}</div></Panel></div>; }

function SettingsPage({ currentSettings, onSave }: { currentSettings: any; onSave: (settings: any) => void }) { 
  const [localYear, setLocalYear] = useState(currentSettings.academicYear);
  const [localDept, setLocalDept] = useState(currentSettings.department);
  const [localWeekly, setLocalWeekly] = useState(currentSettings.weeklyEmails);
  const [localAlerts, setLocalAlerts] = useState(currentSettings.opportunityAlerts);
  const [localPractice, setLocalPractice] = useState(currentSettings.practiceCredits ?? false);
  const [localInst, setLocalInst] = useState(currentSettings.institutionName);
  const [localOfficer, setLocalOfficer] = useState(currentSettings.placementOfficer);
  const [localEmail, setLocalEmail] = useState(currentSettings.contactEmail);

  useEffect(() => {
    setLocalYear(currentSettings.academicYear);
    setLocalDept(currentSettings.department);
    setLocalWeekly(currentSettings.weeklyEmails);
    setLocalAlerts(currentSettings.opportunityAlerts);
    setLocalPractice(currentSettings.practiceCredits ?? false);
    setLocalInst(currentSettings.institutionName);
    setLocalOfficer(currentSettings.placementOfficer);
    setLocalEmail(currentSettings.contactEmail);
  }, [currentSettings]);

  const handleSave = () => {
    onSave({
      academicYear: localYear,
      department: localDept,
      weeklyEmails: localWeekly,
      opportunityAlerts: localAlerts,
      practiceCredits: localPractice,
      institutionName: localInst,
      placementOfficer: localOfficer,
      contactEmail: localEmail,
    });
  };

  return <div className="page-content"><PageHeader eyebrow="WORKSPACE PREFERENCES" title="Settings" description="Customize the dashboard for your placement office." action={<button className="primary-button" onClick={handleSave}><Check size={16} />Save changes</button>} /><Panel title="Dashboard defaults" className="overflow-visible"><div className="settings-form"><label><span>Default academic year</span><Select value={localYear} onChange={setLocalYear} options={['2025–26', '2024–25', '2023–24']} /></label><label><span>Default department view</span><Select value={localDept} onChange={setLocalDept} options={['All Departments', 'CSE', 'IT', 'ECE', 'EEE']} /></label><label><span>Weekly summary emails</span><div className={`toggle ${localWeekly ? 'active' : ''}`} onClick={() => setLocalWeekly(!localWeekly)}><i></i></div></label><label><span>New opportunity alerts</span><div className={`toggle ${localAlerts ? 'active' : ''}`} onClick={() => setLocalAlerts(!localAlerts)}><i></i></div></label><label><div><span>Practice Credit Usage</span><small style={{ display: 'block', color: 'var(--muted)', fontSize: '9px', marginTop: '4px' }}>Show separate practice assessment and practice interview credit usage in student records.</small></div><div className={`toggle ${localPractice ? 'active' : ''}`} onClick={() => setLocalPractice(!localPractice)}><i></i></div></label></div></Panel><Panel title="Placement office profile"><div className="profile-form"><label>Institution name<input value={localInst} onChange={e => setLocalInst(e.target.value)} /></label><label>Placement officer<input value={localOfficer} onChange={e => setLocalOfficer(e.target.value)} /></label><label>Contact email<input value={localEmail} onChange={e => setLocalEmail(e.target.value)} /></label></div></Panel></div>; 
}

function StatCard({ label, value, change, tone }: { label: string; value: string; change: string; tone: string }) { return <div className="stat-card"><div className={`stat-dot ${tone}`} /><span>{label}</span><strong>{value}</strong><small><ArrowUpRight size={13} />{change}</small></div>; }
function DetailDrawer({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) { return <div className="drawer-backdrop" onClick={onClose}><aside className="drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><div><div className="eyebrow">DETAIL VIEW</div><h2>{title}</h2></div><button className="icon-button" onClick={onClose}><X size={18} /></button></div>{children}</aside></div>; }
function DetailModal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) { return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><div><div className="eyebrow">DETAIL VIEW</div><h2>{title}</h2></div><button className="icon-button" onClick={onClose}><X size={18} /></button></div>{children}</div></div>; }

function StudentProfileModal({ student, onClose }: { student: Student; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'applications'>('overview');
  const [showReadiness, setShowReadiness] = useState(false);

  if (showReadiness) {
    return <ReadinessProfileModal student={student} onClose={() => setShowReadiness(false)} />;
  }

  const studentApplications = mockApplications.filter(app => app.studentId === student.id);
  const readinessLabelText = student.score >= 80 ? 'Ready' : student.score >= 60 ? 'Developing' : 'Needs Improvement';

  return (
    <DetailModal title="Student profile" onClose={onClose}>
      <div className="tabs-header" style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--border)', marginBottom: '20px', padding: '0 24px' }}>
        <button className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')} style={{ padding: '12px 0', borderBottom: activeTab === 'overview' ? '2px solid var(--brand)' : '2px solid transparent', background: 'none', cursor: 'pointer', fontWeight: 600, color: activeTab === 'overview' ? 'var(--brand)' : 'var(--muted)' }}>OVERVIEW</button>
        <button className={`tab-button ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')} style={{ padding: '12px 0', borderBottom: activeTab === 'applications' ? '2px solid var(--brand)' : '2px solid transparent', background: 'none', cursor: 'pointer', fontWeight: 600, color: activeTab === 'applications' ? 'var(--brand)' : 'var(--muted)' }}>JOB APPLICATIONS</button>
      </div>

      <div style={{ padding: '0 24px 24px', overflowY: 'auto', flex: 1 }}>
        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="drawer-profile" style={{ marginBottom: '20px', padding: 0, display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="avatar large" style={{ width: '56px', height: '56px', fontSize: '20px', flexShrink: 0 }}>{student.name.split(' ').map((part) => part[0]).join('')}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 600 }}>{student.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div className="student-profile-readiness" onClick={() => setShowReadiness(true)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }} title="Click to view Readiness Profile">
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Readiness:</span>
                    <span className={`readiness-label ${student.score >= 80 ? 'ready' : student.score >= 60 ? 'developing' : 'needs'}`} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px' }}>{readinessLabelText} ({student.score})</span>
                  </div>
                  <span className={`status-pill ${student.placementStatus === 'Placed' ? 'success' : student.placementStatus === 'Not Eligible' || student.placementStatus === 'Opted Out' ? 'warning' : 'neutral'}`}>{student.placementStatus}</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div><span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>Student ID</span><strong style={{ fontSize: '13px', fontWeight: 500 }}>{student.id}</strong></div>
              <div><span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>Email</span><strong style={{ fontSize: '13px', fontWeight: 500 }}>{student.email}</strong></div>
              <div><span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>Department</span><strong style={{ fontSize: '13px', fontWeight: 500 }}>{student.department}</strong></div>
              <div><span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>Year</span><strong style={{ fontSize: '13px', fontWeight: 500 }}>{student.year}</strong></div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', fontWeight: 600 }}>Activity Summary</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div className="metric-box" style={{ padding: '12px', margin: 0, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Assessments Completed</span>
                  <strong style={{ fontSize: '18px' }}>{student.assessmentsCleared}</strong>
                </div>
                <div className="metric-box" style={{ padding: '12px', margin: 0, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Interviews Completed</span>
                  <strong style={{ fontSize: '18px' }}>{student.interviewsCleared}</strong>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '8px' }}>
              <h4 style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', fontWeight: 600 }}>Placement Preparation</h4>
              <div className="metric-box" style={{ padding: '12px 16px', margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Practice Interview</span>
                  <strong style={{ fontSize: '13px', fontWeight: 500, display: 'block' }}>{(student.practiceInterviewCredits || 0) * 15} / 60 minutes used</strong>
                  <span style={{ fontSize: '11px', color: 'var(--brand)', display: 'block', marginTop: '4px', fontWeight: 500 }}>{60 - (student.practiceInterviewCredits || 0) * 15} minutes remaining</span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Practice Assessments</span>
                  <strong style={{ fontSize: '13px', fontWeight: 500, display: 'block' }}>{(student.practiceAssessmentCredits || 0) * 10} / 1,000 questions used</strong>
                  <span style={{ fontSize: '11px', color: 'var(--brand)', display: 'block', marginTop: '4px', fontWeight: 500 }}>{1000 - (student.practiceAssessmentCredits || 0) * 10} questions remaining</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="tab-content">
            {studentApplications.length > 0 ? (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid var(--border)' }}>Job / Role</th>
                      <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid var(--border)' }}>Company</th>
                      <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid var(--border)' }}>Applied On</th>
                      <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid var(--border)' }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid var(--border)' }}>Assessment</th>
                      <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid var(--border)' }}>Interview</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentApplications.map(app => {
                      const job = jobs.find(j => j.id === app.jobId);
                      if (!job) return null;
                      return (
                        <tr key={app.jobId}>
                          <td style={{ padding: '12px', borderBottom: '1px solid var(--border)' }}><strong>{job.role}</strong></td>
                          <td style={{ padding: '12px', borderBottom: '1px solid var(--border)' }}>{job.company}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid var(--border)' }}>{job.postedDate ? new Date(job.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid var(--border)' }}><span className={`status-pill ${app.status === 'Selected' ? 'success' : app.status === 'Rejected' ? 'warning' : 'neutral'}`}>{app.status}</span></td>
                          <td style={{ padding: '12px', borderBottom: '1px solid var(--border)' }}>
                            <span style={{ display: 'block' }}>{job.status === 'Assessment Ongoing' || job.status === 'Applications Open' ? 'Ongoing' : 'Cleared'}</span>
                            {(job.status !== 'Assessment Ongoing' && job.status !== 'Applications Open') && <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Score: {job.id === 'JOB-106' ? '85' : '92'}%</span>}
                          </td>
                          <td style={{ padding: '12px', borderBottom: '1px solid var(--border)' }}>
                            <span style={{ display: 'block' }}>{job.status === 'Interviews Ongoing' || job.status === 'Assessment Ongoing' || job.status === 'Applications Open' ? 'Ongoing' : 'Cleared'}</span>
                            {(job.status !== 'Interviews Ongoing' && job.status !== 'Assessment Ongoing' && job.status !== 'Applications Open') && <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Score: {job.id === 'JOB-106' ? '4/5' : '4.5/5'}</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state-text" style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>No job applications found.</div>
            )}
          </div>
        )}
      </div>
    </DetailModal>
  );
}

function JobDetailModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const jobApplications = mockApplications.filter(app => app.jobId === job.id);
  const appliedStudentIds = new Set(jobApplications.map(app => app.studentId));
  
  const appliedStudents = students.filter(s => appliedStudentIds.has(s.id));
  const clearedStudents = appliedStudents.filter(student => 
    student.assessmentsList?.some(a => a.name.includes(job.company) && a.cleared) ||
    student.interviewsList?.some(i => i.name.includes(job.company) && i.cleared) ||
    jobApplications.find(app => app.studentId === student.id)?.status === 'Selected'
  );

  return (
    <DetailModal title="Opportunity details" onClose={onClose}>
      <div className="job-hero">
        <div className="company-logo large-logo">{job.logo}</div>
        <div><h3>{job.company}</h3><p>{job.role}</p><span className="status-pill success">{job.status}</span></div>
      </div>
      <div style={{ padding: '20px 24px 0 24px' }}>
        <div style={{ marginBottom: '12px', fontSize: '13px', color: 'var(--text)', lineHeight: '1.5' }}><strong>Job Description:</strong> {job.description || 'Not provided'}</div>
        <div style={{ fontSize: '13px', color: 'var(--text)' }}><strong>Package:</strong> {job.package || 'Not provided'}</div>
      </div>
      <div className="detail-grid" style={{ marginTop: '20px' }}>
        <div><span>Applied Students</span><strong>{appliedStudents.length}</strong></div>
        <div><span>Students Cleared</span><strong>{clearedStudents.length}</strong></div>
        <div><span>Location</span><strong>{job.location}</strong></div>
        <div><span>Deadline</span><strong>{job.deadline}</strong></div>
      </div>
      
      <div className="student-applications-section" style={{ marginTop: '24px', padding: 0 }}>
        <div className="applications-header">
          <h4>APPLICANTS ({appliedStudents.length})</h4>
        </div>
        <div className="applications-list">
          {appliedStudents.length > 0 ? appliedStudents.map(student => {
            const appStatus = jobApplications.find(app => app.studentId === student.id)?.status || 'Applied';
            return (
              <div className="application-row" key={student.id}>
                <div>
                  <strong>{student.name}</strong>
                  <span style={{ display: 'block', fontSize: '10px', color: 'var(--muted)', marginTop: '3px' }}>
                    {student.department} • {student.year} • Score: {student.score}
                  </span>
                </div>
                <span className={`status-pill ${appStatus === 'Selected' ? 'success' : appStatus === 'Rejected' ? 'warning' : 'neutral'}`}>{appStatus}</span>
              </div>
            );
          }) : <div className="empty-state-text">No applications yet.</div>}
        </div>
      </div>
    </DetailModal>
  );
}

function ReadinessProfileModal({ student, onClose }: { student: Student; onClose: () => void }) {
  return (
    <DetailModal title="Readiness Profile" onClose={onClose}>
      <div className="drawer-profile">
         <div className="avatar large">{student.name.split(' ').map((part) => part[0]).join('')}</div>
         <div>
           <h3>{student.name}</h3>
           <p>{student.department} • {student.year}</p>
         </div>
      </div>
      <div className="detail-grid" style={{ marginTop: '20px' }}>
        <div><span>Readiness Score</span><strong className={student.score >= 80 ? 'ready-text' : student.score >= 60 ? 'developing-text' : 'needs-text'} style={{ fontSize: '24px' }}>{student.score}</strong></div>
        <div><span>Classification</span><strong className={student.score >= 80 ? 'ready-text' : student.score >= 60 ? 'developing-text' : 'needs-text'}>{student.score >= 80 ? 'Ready' : student.score >= 60 ? 'Developing' : 'At Risk'}</strong></div>
      </div>
      <div className="insights-list" style={{ marginTop: '20px', padding: 0 }}>
        <div className="insight-card strength"><strong>Strengths</strong><p>{student.assessmentsCleared > 0 ? 'Good assessment clearance rate.' : 'Consistent academic record.'}</p></div>
        <div className="insight-card weakness"><strong>Areas Needing Attention</strong><p>{student.profileComplete ? 'Interview performance could be improved.' : 'Profile is incomplete. Resume missing.'}</p></div>
        <div className="insight-card action"><strong>Recommended Action</strong><p>{student.score >= 80 ? 'Fast-track to premium job applications.' : 'Schedule 1-on-1 counseling session.'}</p></div>
      </div>
    </DetailModal>
  );
}

function OfficerProfileModal({ institutionName, placementOfficer, contactEmail, onClose, onSave }: { institutionName: string; placementOfficer: string; contactEmail: string; onClose: () => void; onSave: (info: { institutionName: string; placementOfficer: string; contactEmail: string; }) => void }) {
  const [editMode, setEditMode] = useState(false);
  const [localInst, setLocalInst] = useState(institutionName);
  const [localOfficer, setLocalOfficer] = useState(placementOfficer);
  const [localEmail, setLocalEmail] = useState(contactEmail);

  return (
    <DetailModal title="Placement Officer Profile" onClose={onClose}>
      <div className="drawer-profile" style={{ marginBottom: '20px' }}>
        <div className="avatar large">{placementOfficer.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'PO'}</div>
        <div>
          <h3>{placementOfficer}</h3>
          <p>Placement Officer</p>
        </div>
      </div>
      
      {editMode ? (
        <div className="profile-form" style={{ padding: '0', gridTemplateColumns: '1fr', gap: '12px' }}>
          <label>Institution name<input value={localInst} onChange={e => setLocalInst(e.target.value)} /></label>
          <label>Placement officer<input value={localOfficer} onChange={e => setLocalOfficer(e.target.value)} /></label>
          <label>Contact email<input value={localEmail} onChange={e => setLocalEmail(e.target.value)} /></label>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button className="primary-button" onClick={() => { onSave({ institutionName: localInst, placementOfficer: localOfficer, contactEmail: localEmail }); setEditMode(false); }} style={{ flex: 1 }}>Save Changes</button>
            <button className="outline-button" onClick={() => { setLocalInst(institutionName); setLocalOfficer(placementOfficer); setLocalEmail(contactEmail); setEditMode(false); }} style={{ flex: 1 }}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="detail-grid" style={{ gridTemplateColumns: '1fr', marginBottom: '16px' }}>
            <div><span>Role</span><strong>Placement Officer</strong></div>
            <div><span>Institution Name</span><strong>{institutionName}</strong></div>
            <div><span>Contact Email</span><strong>{contactEmail}</strong></div>
          </div>
          <button className="outline-button" onClick={() => setEditMode(true)} style={{ width: '100%' }}>Edit Profile</button>
        </>
      )}
    </DetailModal>
  );
}

function PlacementReadinessPage({ setSelectedStudent }: { setSelectedStudent: (student: Student | null) => void }) {
  const assessedStudents = students.filter(s => s.assessmentsTaken > 0 || s.interviewsTaken > 0 || s.score > 0);
  const assessedCount = assessedStudents.length;
  const safeTotal = assessedCount || 1;
  const avgScore = assessedCount > 0 ? Math.round(assessedStudents.reduce((acc, s) => acc + s.score, 0) / assessedCount) : 0;
  
  const readyCount = assessedStudents.filter(s => s.score >= 80).length;
  const developingCount = assessedStudents.filter(s => s.score >= 60 && s.score < 80).length;
  const atRiskCount = assessedStudents.filter(s => s.score < 60).length;

  const deptMap = new Map<string, { totalScore: number, count: number }>();
  assessedStudents.forEach(s => {
    if (!deptMap.has(s.department)) deptMap.set(s.department, { totalScore: 0, count: 0 });
    const d = deptMap.get(s.department)!;
    d.totalScore += s.score;
    d.count += 1;
  });
  const departmentAverages = Array.from(deptMap.entries()).map(([dept, data]) => ({
    department: dept,
    avg: Math.round(data.totalScore / data.count)
  })).sort((a, b) => b.avg - a.avg);

  const mockInsights = [
    { insightId: 'INS-1', category: 'Assessment Gaps', priority: 'High', studentId: 'STU-2377', insight: 'Assessment clearance rate is 62.5%.', recommendedAction: 'Prioritize technical assessment practice.' },
    { insightId: 'INS-2', category: 'Assessment Gaps', priority: 'High', studentId: 'STU-2359', insight: 'Failed 3 technical assessments recently.', recommendedAction: 'Assign foundational coding practice modules.' },
    { insightId: 'INS-3', category: 'Interview Gaps', priority: 'High', studentId: 'STU-2377', insight: 'Clears assessments but 0/2 interviews cleared.', recommendedAction: 'Assign mock interviews with HR focus.' },
    { insightId: 'INS-4', category: 'Application Gaps', priority: 'Medium', studentId: 'STU-2364', insight: '0 active applications despite being eligible for 12.', recommendedAction: 'Increase applications to relevant open roles.' },
    { insightId: 'INS-5', category: 'Profile / Resume Gaps', priority: 'Medium', studentId: 'STU-2388', insight: 'Missing fields: Resume Upload, GitHub Link.', recommendedAction: 'Mandate profile completion.' },
    { insightId: 'INS-6', category: 'Profile / Resume Gaps', priority: 'High', studentId: 'STU-2330', insight: 'Missing fields: Portfolio Link.', recommendedAction: 'Prompt student to upload portfolio.' },
    { insightId: 'INS-7', category: 'Skill Gaps', priority: 'High', studentId: 'STU-2305', insight: 'Failed 3 consecutive coding challenges.', recommendedAction: 'Enroll in DSA remedial bootcamp.' },
    { insightId: 'INS-8', category: 'At Risk', priority: 'Critical', studentId: 'STU-2305', insight: 'Lowest readiness score, 22 credits used with minimal results.', recommendedAction: 'Schedule an immediate 1-on-1 counseling session.' },
    { insightId: 'INS-9', category: 'Placement Ready', priority: 'Low', studentId: 'STU-2401', insight: 'Cleared 3/4 assessments, 1/2 interviews.', recommendedAction: 'Fast-track to premium job opportunities.' },
    { insightId: 'INS-10', category: 'High Potential / Low Activity', priority: 'Medium', studentId: 'STU-2364', insight: '12 assessments cleared, 5 interviews cleared, 0 active apps.', recommendedAction: 'Check in on off-campus offers.' }
  ];

  const categories = [
    'Assessment Gaps',
    'Interview Gaps',
    'Application Gaps',
    'Profile / Resume Gaps',
    'Skill Gaps',
    'At Risk',
    'Placement Ready',
    'High Potential / Low Activity'
  ];

  const pReady = (readyCount / safeTotal) * 100;
  const pDev = (developingCount / safeTotal) * 100;

  const kpis = {
    assessed: assessedCount,
    averageScore: avgScore,
    ready: readyCount,
    developing: developingCount,
    atRisk: atRiskCount,
  };

  const cohort = [
    { label: "Ready", band: "ready" as Band, count: readyCount, percent: Math.round(pReady) || 0 },
    { label: "Developing", band: "developing" as Band, count: developingCount, percent: Math.round(pDev) || 0 },
    { label: "At Risk", band: "at-risk" as Band, count: atRiskCount, percent: 100 - (Math.round(pReady) || 0) - (Math.round(pDev) || 0) },
  ];

  const grouped = categories.map(cat => {
    const catInsights = mockInsights.filter(i => i.category === cat);
    if (catInsights.length === 0) return null;
    
    let p = catInsights[0].priority;
    if (p === 'High') p = 'High Priority';
    if (p === 'Medium') p = 'Medium Priority';
    if (p === 'Low') p = 'Low Priority';
    const priority = p as Priority;
    const explanation = catInsights[0].insight;

    return {
      id: cat.toLowerCase().replace(/ \/ /g, '-').replace(/ /g, '-'),
      name: cat,
      students: catInsights.length,
      priority,
      explanation,
    };
  }).filter(Boolean) as InsightGroup[];

  return (
    <div className="readiness-scope">
      <div className="mx-auto w-full max-w-full lg:max-w-[1400px] px-4 lg:px-10 py-6 lg:py-9">
        <header className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/80">
              Placement Intelligence
            </p>
            <h1 className="mt-2 text-[27px] font-semibold leading-none tracking-tight text-foreground">
              Placement Readiness
            </h1>
            <p className="mt-2 max-w-lg text-[12.5px] leading-relaxed text-muted-foreground">
              Understand how ready the student cohort is and identify where intervention is needed.
            </p>
          </div>
          <span className="rounded-full border border-border/70 bg-card px-3 py-1 text-[10.5px] font-medium tabular-nums text-muted-foreground shadow-[var(--shadow-card)]">
            2025–26 · All Departments
          </span>
        </header>

        <div className="space-y-8">
          <KpiRow kpis={kpis} />

          <section>
            <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-[15px] font-semibold tracking-tight text-foreground">Cohort Overview</h2>
              <p className="text-[11.5px] text-muted-foreground">Readiness distribution across the assessed cohort</p>
            </div>
            <CohortDonut kpis={kpis} cohort={cohort} />
          </section>

          <section>
            <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-[15px] font-semibold tracking-tight text-foreground">Readiness Framework</h2>
              <p className="text-[11.5px] text-muted-foreground">Six dimensions used to understand placement readiness.</p>
            </div>
            <DimensionGrid />
          </section>

          <AiInsights insightGroups={grouped} />
        </div>
      </div>
    </div>
  );
}

export default App;
