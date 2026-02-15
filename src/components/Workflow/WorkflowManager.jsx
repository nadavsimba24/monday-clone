import { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { WORKFLOW_CATEGORIES, WORKFLOW_BLOCKS, createBoardFromBlock } from '../../data/workflowTemplates';
import { FiArrowLeft, FiCheck, FiPlus, FiX } from 'react-icons/fi';
import './Workflow.css';

export default function WorkflowManager({ onClose }) {
  const { dispatch } = useBoard();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBlocks, setSelectedBlocks] = useState(new Set());
  const [step, setStep] = useState('categories'); // 'categories' | 'blocks' | 'confirm'

  function handleSelectCategory(cat) {
    setSelectedCategory(cat);
    setSelectedBlocks(new Set());
    setStep('blocks');
  }

  function toggleBlock(blockId) {
    setSelectedBlocks((prev) => {
      const next = new Set(prev);
      if (next.has(blockId)) next.delete(blockId);
      else next.add(blockId);
      return next;
    });
  }

  function handleSelectAll() {
    const blocks = WORKFLOW_BLOCKS[selectedCategory.id] || [];
    if (selectedBlocks.size === blocks.length) {
      setSelectedBlocks(new Set());
    } else {
      setSelectedBlocks(new Set(blocks.map((b) => b.id)));
    }
  }

  function handleCreate() {
    const blocks = WORKFLOW_BLOCKS[selectedCategory.id] || [];
    const chosen = blocks.filter((b) => selectedBlocks.has(b.id));
    let lastBoardId = null;

    chosen.forEach((block) => {
      const board = createBoardFromBlock(block);
      lastBoardId = board.id;
      dispatch({ type: 'ADD_BOARD_DIRECT', board });
    });

    if (lastBoardId) {
      dispatch({ type: 'SET_ACTIVE_BOARD', boardId: lastBoardId });
    }

    onClose();
  }

  function handleBack() {
    if (step === 'blocks') {
      setStep('categories');
      setSelectedCategory(null);
      setSelectedBlocks(new Set());
    }
  }

  const blocks = selectedCategory ? WORKFLOW_BLOCKS[selectedCategory.id] || [] : [];

  return (
    <div className="workflow-overlay" onClick={onClose}>
      <div className="workflow-panel" onClick={(e) => e.stopPropagation()}>
        <div className="workflow-header">
          <div className="workflow-header-left">
            {step === 'blocks' && (
              <button className="wf-back-btn" onClick={handleBack}>
                <FiArrowLeft />
              </button>
            )}
            <h2>
              {step === 'categories'
                ? 'Workflow Manager'
                : selectedCategory?.icon + ' ' + selectedCategory?.name + ' Workflows'}
            </h2>
          </div>
          <button className="wf-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {step === 'categories' && (
          <>
            <p className="workflow-subtitle">
              Choose an industry to get pre-built workflow boards with building blocks tailored to your needs.
            </p>
            <div className="wf-categories-grid">
              {WORKFLOW_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="wf-category-card"
                  onClick={() => handleSelectCategory(cat)}
                >
                  <div className="wf-cat-icon" style={{ backgroundColor: cat.color }}>
                    {cat.icon}
                  </div>
                  <div className="wf-cat-info">
                    <h3>{cat.name}</h3>
                    <p>{cat.description}</p>
                  </div>
                  <div className="wf-cat-count">
                    {(WORKFLOW_BLOCKS[cat.id] || []).length} workflows
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 'blocks' && (
          <>
            <p className="workflow-subtitle">
              Select the workflow building blocks you want to add as boards. Mix and match to fit your needs.
            </p>
            <div className="wf-blocks-actions">
              <button className="wf-select-all-btn" onClick={handleSelectAll}>
                {selectedBlocks.size === blocks.length ? 'Deselect All' : 'Select All'}
              </button>
              <span className="wf-selected-count">
                {selectedBlocks.size} of {blocks.length} selected
              </span>
            </div>
            <div className="wf-blocks-grid">
              {blocks.map((block) => {
                const isSelected = selectedBlocks.has(block.id);
                return (
                  <div
                    key={block.id}
                    className={`wf-block-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleBlock(block.id)}
                  >
                    <div className="wf-block-check">
                      {isSelected ? (
                        <div className="wf-check-on"><FiCheck /></div>
                      ) : (
                        <div className="wf-check-off" />
                      )}
                    </div>
                    <div className="wf-block-info">
                      <h4>{block.name}</h4>
                      <p>{block.description}</p>
                      <div className="wf-block-meta">
                        <span>{block.groups.length} groups</span>
                        <span>{block.columns.length} columns</span>
                        <span>
                          {block.groups.reduce((sum, g) => sum + g.items.length, 0)} items
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedBlocks.size > 0 && (
              <div className="wf-create-bar">
                <button className="wf-create-btn" onClick={handleCreate}>
                  <FiPlus /> Create {selectedBlocks.size} Board{selectedBlocks.size > 1 ? 's' : ''}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
