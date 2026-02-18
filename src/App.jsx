import { useState } from 'react';
import { BoardProvider, useBoard } from './context/BoardContext';
import { SettingsProvider } from './context/SettingsContext';
import Sidebar from './components/Sidebar/Sidebar';
import BoardView from './components/Board/BoardView';
import ItemDetailPanel from './components/ItemDetail/ItemDetailPanel';
import FloatingAIAssistant from './components/AI/FloatingAIAssistant';
import './App.css';
import './themes/bloomberg.css';
import './themes/rtl.css';

function MainArea() {
  const { state } = useBoard();
  const [detailItem, setDetailItem] = useState(null);

  return (
    <>
      <BoardView onOpenDetail={(item, groupId) => setDetailItem({ item, groupId })} />
      {detailItem && (
        <ItemDetailPanel
          item={detailItem.item}
          groupId={detailItem.groupId}
          boardId={state.activeBoardId}
          onClose={() => setDetailItem(null)}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <BoardProvider>
        <div className="app-layout">
          <Sidebar />
          <MainArea />
          <FloatingAIAssistant />
        </div>
      </BoardProvider>
    </SettingsProvider>
  );
}
