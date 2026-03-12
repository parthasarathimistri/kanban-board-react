import { useState, useEffect } from 'react';
import Board from './components/Board';
import './index.css';

const INITIAL_LISTS = ['Todo', 'In Progress', 'Done'];

export default function App() {
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('kanban-tasks')) || []);
  const [lists, setLists] = useState(() => JSON.parse(localStorage.getItem('kanban-lists')) || INITIAL_LISTS);
  const [archivedTasks, setArchivedTasks] = useState(() => JSON.parse(localStorage.getItem('kanban-archived')) || []);
  
  const [theme, setTheme] = useState(() => localStorage.getItem('kanban-theme') || 'dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchive, setShowArchive] = useState(false);

  useEffect(() => {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
    localStorage.setItem('kanban-lists', JSON.stringify(lists));
    localStorage.setItem('kanban-archived', JSON.stringify(archivedTasks));
    localStorage.setItem('kanban-theme', theme);
    document.body.className = theme;
  }, [tasks, lists, archivedTasks, theme]);

  const addTask = (newTask) => setTasks([...tasks, newTask]);
  const updateTask = (updatedTask) => setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  const archiveTask = (task) => { setTasks(tasks.filter(t => t.id !== task.id)); setArchivedTasks([...archivedTasks, task]); };
  const restoreTask = (task) => { setArchivedTasks(archivedTasks.filter(t => t.id !== task.id)); setTasks([...tasks, task]); };

  const moveTaskToColumn = (taskId, newStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  // NEW: Updated to handle before/after positioning precisely
  const reorderTask = (draggedId, targetId, position) => {
    if (draggedId === targetId) return;
    const draggedTask = tasks.find(t => t.id === draggedId);
    const targetTask = tasks.find(t => t.id === targetId);
    if (!draggedTask || !targetTask) return;

    const remainingTasks = tasks.filter(t => t.id !== draggedId);
    draggedTask.status = targetTask.status; 
    
    let targetIndex = remainingTasks.findIndex(t => t.id === targetId);
    if (position === 'after') {
      targetIndex += 1;
    }
    
    remainingTasks.splice(targetIndex, 0, draggedTask); 
    setTasks([...remainingTasks]);
  };

  const copyList = (listName) => {
    const newListTitle = `${listName} (Copy)`;
    setLists([...lists, newListTitle]);
    const copiedTasks = tasks.filter(t => t.status === listName).map(t => ({ ...t, id: crypto.randomUUID(), status: newListTitle }));
    setTasks([...tasks, ...copiedTasks]);
  };
  
  const renameList = (oldName, newName) => {
    if (!newName || newName.trim() === '' || lists.includes(newName)) return;
    setLists(lists.map(l => l === oldName ? newName : l));
    setTasks(tasks.map(t => t.status === oldName ? { ...t, status: newName } : t));
  };

  const deleteList = (listName) => {
    if (confirm(`Delete the list "${listName}" and all its tasks? This cannot be undone.`)) {
      setLists(lists.filter(l => l !== listName));
      setTasks(tasks.filter(t => t.status !== listName));
    }
  };

  const sortList = (listName, criteria) => {
    const listTasks = tasks.filter(t => t.status === listName);
    const otherTasks = tasks.filter(t => t.status !== listName);
    listTasks.sort((a, b) => criteria === 'Priority' ? { High: 3, Medium: 2, Low: 1 }[b.priority] - { High: 3, Medium: 2, Low: 1 }[a.priority] : a.title.localeCompare(b.title));
    setTasks([...otherTasks, ...listTasks]);
  };

  const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="app-container">
      <div className="header-top">
        <div>
          <h1 style={{ color: 'var(--text-main)', fontSize: '1.8rem' }}>Kanban Boards</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-outline" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button className="btn btn-outline" onClick={() => setShowArchive(true)}>View Archive</button>
        </div>
      </div>

      <div className="controls-row">
        <input 
          type="text" 
          placeholder="Search tasks..." 
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn" onClick={() => setLists([...lists, `New List ${lists.length + 1}`])}>+ Add List</button>
      </div>

      <Board 
        tasks={filteredTasks} lists={lists} 
        onMoveToColumn={moveTaskToColumn} onReorder={reorderTask} 
        onUpdateTask={updateTask} onArchiveTask={archiveTask} onAddTask={addTask} 
        onCopyList={copyList} onRenameList={renameList} onSortList={sortList} onDeleteList={deleteList}
      />

      {showArchive && (
        <div className="archive-overlay">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
            <h2>Archived</h2>
            <button onClick={() => setShowArchive(false)} style={{background:'none', border:'none', color:'var(--text-main)', fontSize:'1.2rem', cursor:'pointer', fontWeight: 'bold'}}>Close</button>
          </div>
          {archivedTasks.map(task => (
            <div key={task.id} className="task-card" style={{ cursor: 'default' }}>
              <strong>{task.title}</strong>
              <button onClick={() => restoreTask(task)} className="btn btn-outline" style={{width: '100%', marginTop: '10px', fontSize: '0.8rem'}}>Restore Task</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}