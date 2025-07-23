import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import Layout from '@/components/Layout'
import Dashboard from '@/pages/Dashboard'
import Clients from '@/pages/Clients'
import Jobs from '@/pages/Jobs'
import Candidates from '@/pages/Candidates'
import Applications from '@/pages/Applications'
import Analytics from '@/pages/Analytics'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </Layout>
        <Toaster />
      </div>
    </Router>
  )
}

export default App