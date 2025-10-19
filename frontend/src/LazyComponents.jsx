import { lazy, Suspense } from 'react';

// Inject spinner keyframes into document if not already present
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('spinner-keyframes');
  if (!existingStyle) {
    const style = document.createElement('style');
    style.id = 'spinner-keyframes';
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

// Lazy load heavy components
export const LazyReports = lazy(() => import('./Reports.jsx'));
export const LazyInventory = lazy(() => import('./Inventory.jsx'));
export const LazyOrders = lazy(() => import('./Orders.jsx'));
export const LazyMenu = lazy(() => import('./Menu.jsx'));
export const LazyReservation = lazy(() => import('./Reservation.jsx'));
export const LazyReservationDetails = lazy(() => import('./ReservationDetails.jsx'));
export const LazyStaff = lazy(() => import('./Staff.jsx'));
export const LazyStaffAttendance = lazy(() => import('./StaffAttendance.jsx'));
export const LazyStaffDetail = lazy(() => import('./StaffDetail.jsx'));
export const LazyProfile = lazy(() => import('./Profile.jsx'));
export const LazyNotifications = lazy(() => import('./Notifications.jsx'));

// Loading component
export const LoadingSpinner = ({ message = "Loading..." }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    color: '#FAC1D9',
    fontSize: '16px',
    fontWeight: '500'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid #3D4142',
      borderTop: '3px solid #FAC1D9',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '16px'
    }} />
    {message}
  </div>
);

// Higher-order component for lazy loading
export const withLazyLoading = (Component, fallback = <LoadingSpinner />) => {
  return (props) => (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
};

