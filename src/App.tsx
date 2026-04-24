import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import CreateExperiment from './experiment/CreateExperiment'
import ExperimentList from './experiment/ExperimentList'
import ExperimentView from './experiment/ExperimentView'
import StocksPage from './stocks/StocksPage'

function App() {
  return (
    <div className="app">
      <nav className="tab-nav">
        <NavLink
          to="/stocks"
          className={({ isActive }) =>
            isActive ? 'tab-button tab-active' : 'tab-button'
          }
        >
          Stocks
        </NavLink>
        <NavLink
          to="/experiments"
          className={({ isActive }) =>
            isActive ? 'tab-button tab-active' : 'tab-button'
          }
        >
          Experiments
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/stocks" replace />} />
        <Route path="/stocks" element={<StocksPage />} />
        <Route path="/stocks/:stockId" element={<StocksPage />} />
        <Route path="/experiments" element={<ExperimentList />} />
        <Route path="/experiments/new" element={<CreateExperiment />} />
        <Route path="/experiments/:id" element={<ExperimentView />} />
      </Routes>
    </div>
  )
}

export default App
