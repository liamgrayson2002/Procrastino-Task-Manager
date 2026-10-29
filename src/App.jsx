import { useEffect, useMemo, useState } from 'react';
import { AlarmClock, ArrowUpRight, BookOpen, CalendarDays, Check, CheckCheck, ChevronDown, CircleHelp, Clock3, Coffee, Flame, LayoutGrid, ListTodo, MoreHorizontal, Plus, Search, Settings2, Sparkles, Target, Trash2, X } from 'lucide-react';

const initialTasks = [
  { id: 1, title: 'Finish the history essay', category: 'History', deadline: '2026-10-31', done: false },
  { id: 2, title: 'Study for biology midterm', category: 'Science', deadline: '2026-11-02', done: false },
  { id: 3, title: 'Read chapter 8 (actually this time)', category: 'Reading', deadline: '2026-11-04', done: false },
  { id: 4, title: 'Submit calculus problem set', category: 'Math', deadline: '2026-10-27', done: true },
];

const categories = ['History', 'Science', 'Reading', 'Math', 'Other'];
const categoryIcon = { History: BookOpen, Science: Sparkles, Reading: BookOpen, Math: Target, Other: ListTodo };

function relativeDeadline(value) {
  if (!value) return 'No deadline';
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const date = new Date(`${value}T00:00:00`);
  const days = Math.round((date - today) / 86400000);
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `Due ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

function App() {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('procrastino-tasks')) ?? initialTasks; } catch { return initialTasks; }
  });
  const [filter, setFilter] = useState('All tasks');
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({ title: '', category: 'Other', deadline: '' });
  useEffect(() => localStorage.setItem('procrastino-tasks', JSON.stringify(tasks)), [tasks]);

  const pending = tasks.filter(t => !t.done).length;
  const completed = tasks.length - pending;
  const visible = useMemo(() => tasks.filter(t => {
    const matchesFilter = filter === 'All tasks' || (filter === 'Pending' ? !t.done : t.done);
    return matchesFilter && t.title.toLowerCase().includes(query.toLowerCase());
  }), [tasks, filter, query]);

  function openAdd() { setEditing(null); setDraft({ title: '', category: 'Other', deadline: '' }); setModal(true); }
  function openEdit(task) { setEditing(task.id); setDraft({ title: task.title, category: task.category, deadline: task.deadline }); setModal(true); }
  function saveTask(e) {
    e.preventDefault();
    if (!draft.title.trim()) return;
    if (editing) setTasks(prev => prev.map(t => t.id === editing ? { ...t, ...draft, title: draft.title.trim() } : t));
    else setTasks(prev => [{ ...draft, title: draft.title.trim(), id: Date.now(), done: false }, ...prev]);
    setModal(false);
  }
  function toggleTask(id) { setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t)); }
  function deleteTask(id) { setTasks(prev => prev.filter(t => t.id !== id)); }
  const message = pending === 0 ? 'Look at you! Actually being productive.' : pending >= 4 ? 'You said tomorrow yesterday.' : 'Bro, the deadline is approaching.';

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#top"><span className="brand-mark"><span /></span><span>procrastino<span className="brand-dot">.</span></span></a>
      <div className="side-label">WORKSPACE</div>
      <nav className="side-nav">
        <a className="nav-link active" href="#dashboard"><LayoutGrid size={18} /> Dashboard <span className="nav-count">{pending}</span></a>
        <a className="nav-link" href="#tasks"><ListTodo size={18} /> My tasks</a>
        <a className="nav-link" href="#tasks"><CalendarDays size={18} /> Calendar <span className="soon">soon</span></a>
      </nav>
      <div className="sidebar-bottom">
        <div className="streak-card"><div className="streak-icon"><Flame size={17} fill="currentColor" /></div><div><strong>Little by little</strong><span>You're building a habit</span></div><ArrowUpRight size={16} /></div>
        <a className="nav-link muted-link" href="#help"><CircleHelp size={18} /> Help & feedback</a>
        <a className="nav-link muted-link" href="#settings"><Settings2 size={18} /> Settings</a>
        <div className="profile"><div className="avatar">S</div><div className="profile-copy"><strong>Student mode</strong><span>Making it happen-ish</span></div><MoreHorizontal size={19} /></div>
      </div>
    </aside>

    <main className="main" id="top">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <b>Dashboard</b></div><div className="top-actions"><div className="date-chip"><CalendarDays size={15} /> {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div><button className="icon-button" aria-label="Search" onClick={() => document.querySelector('.search-input')?.focus()}><Search size={18} /></button><div className="avatar small-avatar">S</div></div></header>
      <div className="content" id="dashboard">
        <section className="welcome-row"><div><div className="eyebrow"><Sparkles size={14} /> YOUR VERY OFFICIAL PRODUCTIVITY ZONE</div><h1>Hey, you've got this<span className="heading-dot">.</span></h1><p className="subhead">A little progress is still progress. Let's make today count.</p></div><button className="primary-button" onClick={openAdd}><Plus size={18} strokeWidth={2.5} /> Add a task</button></section>

        <section className="stats-grid" aria-label="Task statistics">
          <article className="stat-card total-stat"><div className="stat-top"><span className="stat-icon lavender"><ListTodo size={18} /></span><span className="stat-kicker">THE BIG PICTURE</span></div><div className="stat-value">{tasks.length}<span>tasks</span></div><div className="stat-foot">On your plate right now</div><div className="stat-spark spark-one">⌁</div></article>
          <article className="stat-card pending-stat"><div className="stat-top"><span className="stat-icon yellow"><Clock3 size={18} /></span><span className="stat-kicker">STILL IN THE WILD</span></div><div className="stat-value">{pending}<span>pending</span></div><div className="stat-foot">One step at a time, friend</div><div className="stat-spark spark-two">✳</div></article>
          <article className="stat-card done-stat"><div className="stat-top"><span className="stat-icon green"><CheckCheck size={18} /></span><span className="stat-kicker">LOOK AT YOU GO</span></div><div className="stat-value">{completed}<span>completed</span></div><div className="stat-foot">{completed ? 'Actual proof you can do it' : 'Your future victory lap starts here'}</div><div className="stat-spark spark-three">✳</div></article>
        </section>

        <section className="motivation-banner"><div className="banner-emoji">{pending === 0 ? '🎉' : '🫠'}</div><div className="banner-copy"><strong>{message}</strong><span>{pending === 0 ? 'Everything is done. You earned that break.' : 'Your future self is rooting for you. Probably.'}</span></div><div className="banner-doodle">✦</div><button className="banner-close" aria-label="Dismiss message" onClick={e => e.currentTarget.closest('.motivation-banner').classList.add('dismissed')}><X size={16} /></button></section>

        <section className="tasks-section" id="tasks"><div className="section-heading"><div><div className="eyebrow section-eyebrow">THE MASTER PLAN <span>·</span> (KIND OF)</div><h2>Your tasks <span className="task-total">{tasks.length}</span></h2></div><button className="sort-button"><span className="sort-dot" /> Due date <ChevronDown size={15} /></button></div>
          <div className="task-toolbar"><div className="tabs">{['All tasks', 'Pending', 'Completed'].map(item => <button key={item} className={`tab ${filter === item ? 'selected' : ''}`} onClick={() => setFilter(item)}>{item}{item === 'Pending' && <span>{pending}</span>}</button>)}</div><label className="search-field"><Search size={16} /><input className="search-input" value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a task..." /></label></div>
          <div className="task-list">{visible.length ? visible.map(task => {
            const Icon = categoryIcon[task.category] || ListTodo;
            const overdue = !task.done && task.deadline && new Date(`${task.deadline}T00:00:00`) < new Date(new Date().setHours(0, 0, 0, 0));
            return <article className={`task-row ${task.done ? 'is-done' : ''}`} key={task.id}><button className={`task-check ${task.done ? 'checked' : ''}`} aria-label={task.done ? 'Mark pending' : 'Mark complete'} onClick={() => toggleTask(task.id)}>{task.done && <Check size={14} strokeWidth={3} />}</button><div className={`category-icon category-${task.category.toLowerCase()}`}><Icon size={17} /></div><div className="task-info"><button className="task-title" onClick={() => openEdit(task)}>{task.title}</button><div className="task-meta"><span className="category-name">{task.category}</span><i /> <span className={overdue ? 'overdue' : ''}><AlarmClock size={13} /> {relativeDeadline(task.deadline)}</span></div></div><div className={`status-pill ${task.done ? 'status-done' : 'status-pending'}`}><span />{task.done ? 'Done' : 'In progress'}</div><div className="task-actions"><button onClick={() => openEdit(task)} aria-label="Edit task" title="Edit task"><Settings2 size={16} /></button><button onClick={() => deleteTask(task.id)} aria-label="Delete task" title="Delete task"><Trash2 size={16} /></button></div></article>;
          }) : <div className="empty-state"><span>🧃</span><strong>{query ? 'No tasks found' : 'Nothing on the list. Suspicious.'}</strong><p>{query ? 'Try another search.' : 'Enjoy this rare moment of peace.'}</p>{!query && <button className="text-button" onClick={openAdd}>Add your first task <ArrowUpRight size={15} /></button>}</div>}</div>
          <div className="list-footer"><span>Showing <b>{visible.length}</b> of <b>{tasks.length}</b> tasks</span><span>Keep showing up <span className="footer-heart">♥</span></span></div>
        </section>
        <footer className="page-footer"><span>Made for the “I'll do it tomorrow” generation.</span><span>Small steps count. <Coffee size={14} /></span></footer>
      </div>
    </main>

    {modal && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setModal(false)}><form className="task-modal" onSubmit={saveTask}><div className="modal-heading"><div><span className="eyebrow">ONE THING AT A TIME</span><h2>{editing ? 'Edit your task' : 'Add a task'}</h2></div><button type="button" className="icon-button" onClick={() => setModal(false)} aria-label="Close"><X size={18} /></button></div><label className="form-label">What needs doing?<input autoFocus required maxLength={100} value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. Start that essay (for real)" /></label><div className="form-row"><label className="form-label">Category<select value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })}>{categories.map(c => <option key={c}>{c}</option>)}</select></label><label className="form-label">Deadline<input type="date" value={draft.deadline} onChange={e => setDraft({ ...draft, deadline: e.target.value })} /></label></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModal(false)}>Cancel</button><button className="primary-button" type="submit"><Plus size={17} /> {editing ? 'Save changes' : 'Add task'}</button></div></form></div>}
  </div>;
}

export default App;
