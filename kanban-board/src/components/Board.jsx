import Column from './Column';

export default function Board({ tasks, lists, onMoveToColumn, onReorder, onUpdateTask, onArchiveTask, onAddTask, onCopyList, onRenameList, onSortList, onDeleteList }) {
  
  const handleDropOnColumn = (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) onMoveToColumn(taskId, status);
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="board">
      {lists.map(listName => (
        <div 
          key={listName} className="column" 
          onDrop={(e) => handleDropOnColumn(e, listName)} 
          onDragOver={handleDragOver}
        >
          <Column 
            title={listName} 
            tasks={tasks.filter(t => t.status === listName)}
            onUpdateTask={onUpdateTask}
            onArchiveTask={onArchiveTask}
            onAddTask={onAddTask}
            onCopyList={onCopyList}
            onRenameList={onRenameList}
            onSortList={onSortList}
            onDeleteList={onDeleteList}
            onReorder={onReorder}
          />
        </div>
      ))}
    </div>
  );
}