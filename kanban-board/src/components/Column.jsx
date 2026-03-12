import { useState } from 'react';
import TaskCard from './TaskCard';

export default function Column({ title, tasks, onUpdateTask, onArchiveTask, onAddTask, onCopyList, onRenameList, onSortList, onDeleteList, onReorder }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('Low');
  const [editListTitle, setEditListTitle] = useState(title);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask({ id: crypto.randomUUID(), title: newTitle, description: newDesc, priority: newPriority, status: title });
    setNewTitle(''); setNewDesc(''); setNewPriority('Low'); setIsAdding(false);
  };

  const handleRenameSubmit = (e) => {
    e?.preventDefault();
    onRenameList(title, editListTitle);
    setIsRenaming(false);
  };

  return (
    <>
      <div className="column-header">
        {isRenaming ? (
          <form onSubmit={handleRenameSubmit} style={{ flexGrow: 1, marginRight: '10px' }}>
            <input 
              autoFocus 
              value={editListTitle} 
              onChange={e => setEditListTitle(e.target.value)} 
              onBlur={handleRenameSubmit}
              style={{ padding: '4px 8px', margin: 0, width: '100%' }} 
            />
          </form>
        ) : (
          <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {title} 
            <span style={{color: 'var(--text-muted)', fontSize: '0.8rem', background: 'var(--border-color)', padding: '2px 8px', borderRadius: '12px'}}>{tasks.length}</span>
          </h3>
        )}

        <div>
          <button className="menu-btn" onClick={() => setShowMenu(!showMenu)}>•••</button>
          {showMenu && (
            <div className="dropdown-menu">
              <button onClick={() => { setIsRenaming(true); setShowMenu(false); }}>Rename List</button>
              <button onClick={() => { onCopyList(title); setShowMenu(false); }}>Copy List</button>
              <button onClick={() => { onSortList(title, 'Priority'); setShowMenu(false); }}>Sort by Priority</button>
              <button onClick={() => { onSortList(title, 'Title'); setShowMenu(false); }}>Sort by Name</button>
              <hr style={{borderColor: 'var(--border-color)', margin: '4px 0'}} />
              <button className="text-danger" onClick={() => { onDeleteList(title); setShowMenu(false); }}>Delete List</button>
            </div>
          )}
        </div>
      </div>

      <div className="task-list">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onUpdateTask={onUpdateTask} onArchiveTask={onArchiveTask} onReorder={onReorder} />
        ))}
      </div>

      <div className="add-card-wrapper">
        {isAdding ? (
          <form className="add-form" onSubmit={handleAddSubmit}>
            <input autoFocus placeholder="Task title..." value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <textarea placeholder="Description..." value={newDesc} onChange={e => setNewDesc(e.target.value)} rows="2" />
            <select value={newPriority} onChange={e => setNewPriority(e.target.value)}>
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
            <div className="form-actions">
              <button type="submit" className="btn" style={{flex: 1}}>Add</button>
              <button type="button" className="btn btn-outline" onClick={() => setIsAdding(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <button className="add-card-toggle" onClick={() => setIsAdding(true)}>+ Add a Card</button>
        )}
      </div>
    </>
  );
}