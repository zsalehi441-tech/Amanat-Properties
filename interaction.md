# Real Estate Website - User Interaction Design

## Core User Interactions

### 1. Language Switcher
**Location**: Top-right corner of header
**Functionality**: 
- Toggle between English (EN) and دری (DA)
- Smooth transition with fade effect
- Maintains current page context
- Stores preference in localStorage

### 2. Property Listings Grid
**Main Page**: Interactive grid of property cards
**Interactions**:
- Hover effects reveal additional details
- Click card → Navigate to detailed view
- Filter by price range with real-time updates
- Filter by property type (Land/House/Apartment/Villa)
- Sort by price (Low to High / High to Low)
- Sort by date (Newest First)

### 3. Price Range Filter
**Component**: Dual-handle slider
**Functionality**:
- Real-time price filtering
- Currency display (USD for English, Toman for Farsi)
- Smooth animation during filtering
- Reset button to clear filters

### 4. Property Detail View
**Navigation**: Click any property card
**Features**:
- Image gallery with thumbnail navigation
- Swipe support for mobile
- Zoom functionality on images
- Full property details display
- Contact section with WhatsApp integration
- Contact form with validation
- "Back to Listings" button

### 5. WhatsApp Integration
**Trigger**: "Contact via WhatsApp" button
**Functionality**:
- Pre-filled message with property details
- Property ID, title, and price included
- Opens WhatsApp web or mobile app
- Custom message for each property

### 6. Contact Form
**Fields**: Name, Email, Phone, Message
**Features**:
- Real-time validation
- Persian/English input support
- Success/error states
- Form submission to Formspree (configurable)
- Loading states during submission

### 7. Admin Panel Access
**Login**: Password-protected (/admin)
**Features**:
- Simple password authentication
- Session management
- Secure access to property management

### 8. Admin Property Management
**CRUD Operations**:
- **Create**: Add new property with image uploads
- **Read**: View all properties in table format
- **Update**: Edit existing property details
- **Delete**: Remove properties with confirmation

### 9. Image Upload System
**Functionality**:
- Multiple image selection
- Preview before upload
- Drag and drop support
- Image compression for optimization
- Gallery ordering functionality

### 10. Property Status Management
**Options**: Available, Sold, Pending
**Visual Indicators**:
- Color-coded status badges
- Automatic filtering options
- Status update notifications

## User Flow Diagrams

### Regular User Journey
1. **Landing** → View featured properties
2. **Browse** → Filter/search properties
3. **Select** → Click property for details
4. **Contact** → WhatsApp or contact form
5. **Return** → Back to listings

### Admin User Journey
1. **Login** → Access admin panel
2. **Manage** → View property list
3. **CRUD** → Add/edit/delete properties
4. **Upload** → Manage property images
5. **Logout** → Secure session end

## Interactive Components Detail

### Property Card Hover Effects
- Subtle lift animation (translateY: -5px)
- Shadow enhancement
- Overlay with quick details
- Smooth transition (300ms ease)

### Image Gallery Navigation
- Thumbnail row below main image
- Click thumbnail → Smooth transition
- Arrow navigation (keyboard + touch)
- Loading states for large images

### Form Interactions
- Focus states with accent colors
- Input validation on blur
- Success animations
- Error message positioning

### Filter Animations
- Smooth grid re-arrangement
- Fade out/in for filtered items
- Loading states during filtering
- Results count display

## Mobile Interactions
- Touch-friendly buttons (44px minimum)
- Swipe gestures for image galleries
- Pull-to-refresh on listings
- Bottom navigation for key actions
- Responsive filter drawer

## Accessibility Features
- Keyboard navigation support
- Screen reader friendly
- High contrast mode compatibility
- Focus indicators
- ARIA labels for interactive elements

## Performance Considerations
- Lazy loading for images
- Debounced search/filter
- Optimized animations
- Local storage for user preferences
- Efficient DOM manipulation