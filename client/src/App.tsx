import { Routes, Route, Navigate } from 'react-router-dom';
import { UserLayout } from '@/components/layout/UserLayout';
import { InfluencerLayout } from '@/components/layout/InfluencerLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedRoute } from '@/components/auth';

// User Pages
import {
  HomePage,
  LoginPage,
  CourseLandingPage,
  CourseApplyPage,
  MyApplicationsPage,
  ActiveTravelsPage,
  TravelDetailPage,
  MyPagePage,
  NotificationsPage,
  PaymentCompletePage,
} from '@/pages/user';

// Influencer Pages
import {
  DashboardPage as InfluencerDashboard,
  CourseListPage as InfluencerCourseList,
  CourseCreatePage,
  CourseDetailPage as InfluencerCourseDetail,
  ApplicationsPage,
  ParticipantsPage,
  AnnouncementsManagePage,
  ExpenseStatusPage,
  NbangManagePage,
  SettlementsPage as InfluencerSettlements,
  SettingsPage as InfluencerSettings,
} from '@/pages/influencer';

// Admin Pages
import {
  LoginPage as AdminLogin,
  DashboardPage as AdminDashboard,
  UsersPage,
  InfluencersPage,
  PaymentsPage,
  SettlementsPage as AdminSettlements,
  InquiriesPage,
  InquiryDetailPage,
} from '@/pages/admin';

function App() {
  return (
    <Routes>
      {/* User Routes */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<HomePage />} />
        <Route path="courses/:id" element={<CourseLandingPage />} />
        <Route path="courses/:id/apply" element={
          <ProtectedRoute>
            <CourseApplyPage />
          </ProtectedRoute>
        } />
        <Route path="my-applications" element={
          <ProtectedRoute>
            <MyApplicationsPage />
          </ProtectedRoute>
        } />
        <Route path="active-travels" element={
          <ProtectedRoute>
            <ActiveTravelsPage />
          </ProtectedRoute>
        } />
        <Route path="active-travels/:id" element={
          <ProtectedRoute>
            <TravelDetailPage />
          </ProtectedRoute>
        } />
        <Route path="mypage" element={
          <ProtectedRoute>
            <MyPagePage />
          </ProtectedRoute>
        } />
        <Route path="notifications" element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        } />
        <Route path="payment/complete" element={
          <ProtectedRoute>
            <PaymentCompletePage />
          </ProtectedRoute>
        } />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<div className="p-4">처리 중...</div>} />

      {/* Influencer Routes */}
      <Route
        path="/influencer"
        element={
          <ProtectedRoute roles={['influencer', 'admin']}>
            <InfluencerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/influencer/dashboard" replace />} />
        <Route path="dashboard" element={<InfluencerDashboard />} />
        <Route path="courses" element={<InfluencerCourseList />} />
        <Route path="courses/create" element={<CourseCreatePage />} />
        <Route path="courses/:id" element={<InfluencerCourseDetail />} />
        <Route path="courses/:id/applications" element={<ApplicationsPage />} />
        <Route path="courses/:id/participants" element={<ParticipantsPage />} />
        <Route path="courses/:id/announcements" element={<AnnouncementsManagePage />} />
        <Route path="courses/:id/expenses" element={<ExpenseStatusPage />} />
        <Route path="courses/:id/nbang" element={<NbangManagePage />} />
        <Route path="settlements" element={<InfluencerSettlements />} />
        <Route path="settings" element={<InfluencerSettings />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="influencers" element={<InfluencersPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="settlements" element={<AdminSettlements />} />
        <Route path="inquiries" element={<InquiriesPage />} />
        <Route path="inquiries/:id" element={<InquiryDetailPage />} />
      </Route>

      {/* Error Routes */}
      <Route path="/unauthorized" element={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">접근 권한이 없습니다</h1>
            <p className="text-gray-600">이 페이지에 접근할 권한이 없습니다.</p>
          </div>
        </div>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
