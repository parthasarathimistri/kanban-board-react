export default function TaskCard({ task, onUpdateTask, onArchiveTask, onReorder }) {
  
  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task.id);
    document.body.classList.add('is-dragging');
    setTimeout(() => { e.target.classList.add('dragging'); }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    document.body.classList.remove('is-dragging');
    document.querySelectorAll('.drop-before, .drop-after').forEach(el => {
      el.classList.remove('drop-before', 'drop-after');
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Calculate mouse position relative to the center of the card
    const rect = e.currentTarget.getBoundingClientRect();
    const midPoint = rect.top + rect.height / 2;

    if (e.clientY < midPoint) {
      e.currentTarget.classList.add('drop-before');
      e.currentTarget.classList.remove('drop-after');
    } else {
      e.currentTarget.classList.add('drop-after');
      e.currentTarget.classList.remove('drop-before');
    }
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drop-before', 'drop-after');
  };

  const handleDropOnCard = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check where the indicator line was before finalizing
    const position = e.currentTarget.classList.contains('drop-before') ? 'before' : 'after';
    e.currentTarget.classList.remove('drop-before', 'drop-after');

    const draggedId = e.dataTransfer.getData('taskId');
    if (draggedId) onReorder(draggedId, task.id, position);
  };

  return (
    <div 
      className="task-card" draggable="true" 
      onDragStart={handleDragStart} onDragEnd={handleDragEnd}
      onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDropOnCard}
    >
      <div className={`bookmark bg-${task.priority || 'Low'}`} title={`Priority: ${task.priority || 'Low'}`}></div>

      <div className="task-header">
        <strong>{task.title}</strong>
        <div className="task-actions">
          <button onClick={() => {
            const newTitle = prompt('Edit Title:', task.title);
            if (newTitle) onUpdateTask({ ...task, title: newTitle });
          }}>Edit</button>
          <button onClick={() => onArchiveTask(task)} className="archive-btn">Archive</button>
        </div>
      </div>
      
      {task.description && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.4' }}>
          {task.description}
        </p>
      )}
    </div>
  );
}