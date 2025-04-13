
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AuthRedirect from "./components/AuthRedirect";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Bookings from "./pages/Bookings";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import AboutUs from "./pages/AboutUs";
import CreateCourse from "./pages/CreateCourse";
import MyCourses from "./pages/MyCourses";
import Layout from "./components/Layout";
import { useAuth } from "./contexts/AuthContext";
import { Suspense, lazy } from "react";
import { FullPageLoader } from "./components/ui/loading-states";
import ErrorBoundary from "./components/ErrorBoundary";

// Added new pages
import Subjects from "./pages/Subjects";
import Contact from "./pages/Contact";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FAQs from "./pages/FAQs";
import SuccessStories from "./pages/SuccessStories";
import Resources from "./pages/Resources";

// Lazy load components
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const BecomeATutor = lazy(() => import("./pages/BecomeATutor"));
const Company = lazy(() => import("./pages/Company"));

// Configure the query client with retry and error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Protected route component with loading state
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <FullPageLoader />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth-redirect" element={<AuthRedirect />} />
              <Route path="/about" element={<AboutUs />} />
              
              {/* Public pages */}
              <Route path="/how-it-works" element={
                <Suspense fallback={<FullPageLoader />}>
                  <HowItWorks />
                </Suspense>
              } />
              
              {/* New public pages */}
              <Route path="/subjects" element={<Subjects />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/resources" element={<Resources />} />
              
              {/* Protected routes */}
              <Route element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route path="/dashboard" element={
                  <Suspense fallback={<FullPageLoader />}>
                    <Dashboard />
                  </Suspense>
                } />
                <Route path="/profile" element={
                  <Suspense fallback={<FullPageLoader />}>
                    <Profile />
                  </Suspense>
                } />
                <Route path="/search" element={
                  <Suspense fallback={<FullPageLoader />}>
                    <Search />
                  </Suspense>
                } />
                <Route path="/bookings" element={
                  <Suspense fallback={<FullPageLoader />}>
                    <Bookings />
                  </Suspense>
                } />
                <Route path="/messages" element={
                  <Suspense fallback={<FullPageLoader />}>
                    <Messages />
                  </Suspense>
                } />
                <Route path="/settings" element={
                  <Suspense fallback={<FullPageLoader />}>
                    <Settings />
                  </Suspense>
                } />
                <Route path="/create-course" element={
                  <Suspense fallback={<FullPageLoader />}>
                    <CreateCourse />
                  </Suspense>
                } />
                <Route path="/courses" element={
                  <Suspense fallback={<FullPageLoader />}>
                    <MyCourses />
                  </Suspense>
                } />
                <Route path="/courses/:courseId" element={
                  <Suspense fallback={<FullPageLoader />}>
                    <CourseDetail />
                  </Suspense>
                } />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
