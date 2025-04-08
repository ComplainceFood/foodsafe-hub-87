
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Toaster } from '@/components/ui/toaster';
import SidebarLayout from '@/components/layout/SidebarLayout';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Loading from '@/components/Loading';

// Authentication Pages
import Auth from '@/pages/Auth';
import UserOnboarding from '@/pages/UserOnboarding';

// Lazy-loaded pages
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Documents = lazy(() => import('@/pages/Documents'));
const OrganizationsList = lazy(() => import('@/pages/OrganizationsList'));
const OrganizationManagement = lazy(() => import('@/pages/OrganizationManagement'));
const FacilityManagement = lazy(() => import('@/pages/FacilityManagement'));
const DepartmentManagement = lazy(() => import('@/pages/DepartmentManagement'));
const TrainingModule = lazy(() => import('@/pages/TrainingModule'));
const NonConformance = lazy(() => import('@/pages/NonConformance'));
const NonConformanceFormPage = lazy(() => import('@/pages/NonConformanceFormPage'));
const UserManagement = lazy(() => import('@/pages/UserManagement'));
const AuditsModule = lazy(() => import('@/pages/AuditsModule'));
const Traceability = lazy(() => import('@/pages/Traceability'));
const ComplaintManagement = lazy(() => import('@/pages/ComplaintManagement'));
const SupplierManagement = lazy(() => import('@/pages/SupplierManagement'));
const DatabaseConnectionTest = lazy(() => import('@/pages/DatabaseConnectionTest'));
const RoleManagement = lazy(() => import('@/pages/RoleManagement'));
const StandardsPage = lazy(() => import('@/pages/StandardsPage'));
const ModuleContent = lazy(() => import('@/components/standards/ModuleContent'));
const TestingVerification = lazy(() => import('@/pages/TestingVerification'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Public routes */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<UserOnboarding />} />

          {/* Protected routes with SidebarLayout */}
          <Route element={<ProtectedRoute><SidebarLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="documents" element={<Documents />} />
            <Route path="organizations" element={<OrganizationsList />} />
            <Route path="organization" element={<OrganizationManagement />} />
            <Route path="facilities" element={<FacilityManagement />} />
            <Route path="departments" element={<DepartmentManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="training" element={<TrainingModule />} />
            <Route path="audits" element={<AuditsModule />} />
            <Route path="traceability" element={<Traceability />} />
            
            {/* Non-conformance routes */}
            <Route path="non-conformance" element={<NonConformance />} />
            <Route path="non-conformance/new" element={<NonConformanceFormPage />} />
            <Route path="non-conformance/:id" element={<NonConformanceFormPage />} />
            
            <Route path="suppliers" element={<SupplierManagement />} />
            <Route path="complaints" element={<ComplaintManagement />} />
            
            {/* Standards routes */}
            <Route path="standards" element={<StandardsPage />} />
            <Route path="standards/:standardId" element={<StandardsPage />} />
            <Route path="standards/:standardId/:moduleId" element={<StandardsPage />}>
              <Route index element={<ModuleContent />} />
            </Route>
            
            {/* Testing and Verification routes */}
            <Route path="testing" element={<TestingVerification />} />
            
            <Route path="haccp" element={<NotFound />} />
            <Route path="capa" element={<NotFound />} />
            <Route path="database-test" element={<DatabaseConnectionTest />} />
            <Route path="roles" element={<RoleManagement />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
