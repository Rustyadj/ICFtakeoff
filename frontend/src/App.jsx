import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import Dashboard from './pages/Dashboard'
import CompareManufacturers from './pages/compare/CompareManufacturers'
import Estimates from './pages/estimates/Estimates'
import Placeholder from './pages/Placeholder'
import ModelPage from './pages/model/ModelPage'
import PlanViewer from './pages/planviewer/PlanViewer'
import Takeoff from './pages/takeoff/Takeoff'
import AIDetection from './pages/aidetection/AIDetection'
import Home from './pages/Home'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'projects', element: <Placeholder title="Projects" /> },
      { path: 'preconstruction', element: <Navigate to="/preconstruction/plan-viewer" replace /> },
      { path: 'preconstruction/plan-viewer', element: <PlanViewer /> },
      { path: 'preconstruction/ai-detection', element: <AIDetection /> },
      { path: 'preconstruction/3d-model', element: <ModelPage /> },
      { path: 'preconstruction/takeoff', element: <Takeoff /> },
      { path: 'preconstruction/estimates', element: <Estimates /> },
      { path: 'preconstruction/bid-proposal', element: <Placeholder title="Bid / Proposal" /> },
      { path: 'preconstruction/compare', element: <CompareManufacturers /> },
      { path: 'preconstruction/scope-matrix', element: <Placeholder title="Scope & Matrix" /> },
      { path: 'preconstruction/project-dashboard', element: <Placeholder title="Project Dashboard" /> },
      { path: 'crm/*', element: <Placeholder title="CRM" /> },
      { path: 'reports', element: <Placeholder title="Reports" /> },
      { path: 'reports/takeoff', element: <Placeholder title="Takeoff Report" /> },
      { path: 'reports/export', element: <Placeholder title="Export Data" /> },
      { path: 'cost-database', element: <Placeholder title="Pricing Database" /> },
      { path: 'database/labor', element: <Placeholder title="Labor Database" /> },
      { path: 'database/manufacturers', element: <Placeholder title="Manufacturer Center" /> },
      { path: 'database/products', element: <Placeholder title="Product Database" /> },
      { path: 'estimating/cost-breakdown', element: <Placeholder title="Cost Breakdown" /> },
      { path: 'estimating/labor-calculator', element: <Placeholder title="Labor Calculator" /> },
      { path: 'estimating/bid-summary', element: <Placeholder title="Bid Summary" /> },
      { path: 'tools/notes', element: <Placeholder title="Notes & Voice" /> },
      { path: 'tools/export', element: <Placeholder title="Export" /> },
      { path: 'settings/*', element: <Placeholder title="Settings" /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
