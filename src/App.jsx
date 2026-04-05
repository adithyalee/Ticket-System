import React, { useState } from 'react';
import 'noplin-uis/dist/styles.css';
import { TicketProvider } from './context/TicketContext';
import Dashboard from './pages/Dashboard';
import CreateTicket from './pages/CreateTicket';
import TicketDetail from './pages/TicketDetail';
import { Navbar } from './components/Navbar';
import { RoleSwitcher } from './components/RoleSwitcher';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('TicketFlow crashed:', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    const message = this.state.error?.message || 'Unknown runtime error';
    const stack = this.state.error?.stack;

    return (
      <div style={{ minHeight: '100vh', padding: '2rem', background: '#fff', color: '#111' }}>
        <h1 style={{ marginTop: 0 }}>Something went wrong</h1>
        <p style={{ whiteSpace: 'pre-wrap', color: '#444' }}>{message}</p>
        {stack && (
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f9fafb', padding: '1rem', borderRadius: 10, border: '1px solid #eee', overflow: 'auto' }}>
            {stack}
          </pre>
        )}
      </div>
    );
  }
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [dashboardState, setDashboardState] = useState({
    searchTerm: '',
    statusFilter: 'All',
    priorityFilter: 'All',
    categoryFilter: 'All',
    teamFilter: 'All',
    queueView: 'All',
    slaStatusFilter: 'All',
    sortBy: 'Newest',
    pageSize: 10,
    page: 1,
  });

  const navigateTo = (page, ticketId = null) => {
    setCurrentPage(page);
    setActiveTicketId(ticketId);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fafafa' }}>
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />

      <div
        style={{
          maxWidth: 1200,
          width: '100%',
          margin: '0 auto',
          padding: '1.25rem 2rem 0 2rem',
          position: 'sticky',
          top: 72,
          zIndex: 9,
          background: '#fafafa',
        }}
      >
        <RoleSwitcher />
      </div>

      <main style={{ padding: '1.75rem 2rem 2.5rem 2rem', maxWidth: '1200px', width: '100%', margin: '0 auto', flex: 1 }}>
        {currentPage === 'dashboard' && (
          <Dashboard
            onNavigate={navigateTo}
            initialState={dashboardState}
            onStateChange={setDashboardState}
          />
        )}
        {currentPage === 'new' && <CreateTicket onNavigate={navigateTo} />}
        {currentPage === 'detail' && <TicketDetail ticketId={activeTicketId} onNavigate={navigateTo} />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <TicketProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </TicketProvider>
  );
}
