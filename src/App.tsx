import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';

import SidebarLayout from '@/components/layout/SidebarLayout';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Loading from '@/components/Loading';

// Authentication Pages
import Auth from '@/pages/Auth';

// Lazy-loaded pages
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Documents = lazy(() => import('@/pages/Documents'));
const OrganizationsList = lazy(() => import('@/pages/OrganizationsList'));
const OrganizationManagement = lazy(() => import('@/pages/OrganizationManagement'));
const OrganizationDashboard = lazy(() => import('@/pages/OrganizationDashboard'));
const OrganizationSettings = lazy(() => import('@/pages/OrganizationSettings'));
const FacilityManagement = lazy(() => import('@/pages/FacilityManagement'));
const FacilityDetail = lazy(() => import('@/pages/FacilityDetail'));
const DepartmentManagement = lazy(() => import('@/pages/DepartmentManagement'));
const RoleManagement = lazy(() => import('@/pages/RoleManagement'));
const UserManagement = lazy(() => import('@/pages/UserManagement'));
const TrainingModule = lazy(() => import('@/pages/TrainingModule'));
const StandardsModule = lazy(() => import('@/pages/StandardsModule'));
const AuditManagement = lazy(() => import('@/pages/AuditManagement'));
const Traceability = lazy(() => import('@/pages/Traceability'));
const NonConformance = lazy(() => import('@/pages/NonConformance'));
const CAPAManagement = lazy(() => import('@/pages/CAPAManagement'));
const SupplierManagement = lazy(() => import('@/pages/SupplierManagement'));
const ComplaintManagement = lazy(() => import('@/pages/ComplaintManagement'));
const Settings = lazy(() => import('@/pages/Settings'));
const ErrorPage = lazy(() => import('@/pages/ErrorPage'));

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected Routes with Sidebar */}
            <Route element={<ProtectedRoute><SidebarLayout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/documents" element={<Documents />} />
              
              {/* Organization Management */}
              <Route path="/organizations" element={<OrganizationsList />} />
              <Route path="/organization" element={<OrganizationManagement />} />
              <Route path="/organization/dashboard/:id" element={<OrganizationDashboard />} />
              <Route path="/organization/settings/:id" element={<OrganizationSettings />} />
              
              {/* Facility Management */}
              <Route path="/facilities" element={<FacilityManagement />} />
              <Route path="/facilities/:id" element={<FacilityDetail />} />
              
              {/* Department Management */}
              <Route path="/departments" element={<DepartmentManagement />} />
              
              {/* User & Role Management */}
              <Route path="/roles" element={<RoleManagement />} />
              <Route path="/users" element={<UserManagement />} />
              
              {/* Other Modules */}
              <Route path="/training" element={<TrainingModule />} />
              <Route path="/standards" element={<StandardsModule />} />
              <Route path="/audits" element={<AuditManagement />} />
              <Route path="/traceability" element={<Traceability />} />
              <Route path="/non-conformance" element={<NonConformance />} />
              <Route path="/capa" element={<CAPAManagement />} />
              <Route path="/suppliers" element={<SupplierManagement />} />
              <Route path="/complaints" element={<ComplaintManagement />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Fallback for unknown routes */}
              <Route path="*" element={<ErrorPage />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}

export default App;
