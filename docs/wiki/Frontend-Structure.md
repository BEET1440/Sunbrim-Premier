# Frontend Structure

The frontend of Sunbrim Premier is built with React.js (Vite) and Tailwind CSS. It is a single-page application (SPA) optimized for mobile-first user experiences and low-bandwidth connections.

## Directory Structure
The frontend is located in the `/client` directory.

```text
/client
  ├── src/
  │   ├── components/      # UI components (Header, ProductCard, OrderModal)
  │   ├── pages/           # Application views (Home, Tracking, Admin, Login)
  │   ├── firebase/        # Configuration and SDK initialization
  │   ├── App.jsx          # Routing and layout
  │   └── index.css        # Tailwind & global styles
  ├── public/
  │   └── sw.js            # Service worker for offline support
  └── package.json         # Frontend dependencies
```

## Core Components
- **[Header.jsx](client/src/components/Header.jsx)**: Persistent navigation bar with links to tracking and profile/login.
- **[ProductCard.jsx](client/src/components/ProductCard.jsx)**: Display card for individual items with a "Quick Order" button.
- **[OrderModal.jsx](client/src/components/OrderModal.jsx)**: The central ordering interface that handles quantity and M-Pesa payment initiation.
- **[CategoryFilter.jsx](client/src/components/CategoryFilter.jsx)**: Horizontal scrollable filter for bakery categories.

## Page Views
- **[Home.jsx](client/src/pages/Home.jsx)**: Main landing page with the product catalog and search.
- **[OrderTracking.jsx](client/src/pages/OrderTracking.jsx)**: History and status tracking for customers.
- **[Admin.jsx](client/src/pages/Admin.jsx)**: Order and product management for bakery staff.
- **[Login.jsx](client/src/pages/Login.jsx)**: Firebase Phone Authentication with OTP.

## Styling & UX
- **Tailwind CSS**: Utility classes are used for all styling to maintain a small CSS bundle.
- **Lucide-React**: Consistent, lightweight icons are used for visual cues.
- **Responsive Design**: All components use a `max-w-md` container on desktop to maintain a mobile-friendly layout on all screens.
- **Transitions**: Smooth CSS transitions are applied to all interactive elements for a premium feel.

---
[Next: Backend & Firebase Setup](Backend-Firebase-Setup) | [Back to Home](Home)
