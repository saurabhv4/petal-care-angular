# User Profile Feature Implementation

## Overview
This feature allows users to view their profile details by clicking on the "Profile" option in the dashboard drawer menu. The profile page fetches user data from the API and displays it in a modern, responsive design.

## Features Implemented

### 1. API Integration
- **Fetch Endpoint**: `GET /api/v1/profile/fetch-user`
- **Update Endpoint**: `PUT /api/v1/profile/update-details`
- **Authentication**: Bearer token required
- **Response Format**: JSON with user details

### 2. User Profile Component
- **Location**: `src/app/user-profile/`
- **Files**:
  - `user-profile.component.ts` - Component logic
  - `user-profile.component.html` - Template
  - `user-profile.component.css` - Styling

### 3. API Service Update
- **File**: `src/app/services/api.service.ts`
- **Methods**: 
  - `fetchUserProfile(token: string)` - Fetch user profile
  - `updateUserProfile(token: string, profileData: any)` - Update user profile
- **Features**: Automatic token handling, error management, console logging for debugging

### 4. Environment Configuration
- **Files**: `environment.ts` and `environment.prod.ts`
- **Added**: `fetchUserProfile: '/api/v1/profile/fetch-user'`

### 5. Routing
- **File**: `src/app/app.routes.ts`
- **Route**: `/user-profile` → `UserProfileComponent`

### 6. Dashboard Integration
- **File**: `src/app/user-dashboard/user-dashboard.component.ts`
- **Method**: `navigateToProfile()` - Handles navigation to profile page
- **UI**: Click handler on Profile menu item

## User Interface Features

### Profile Page Design
- **Modern gradient background** with glassmorphism effects
- **Responsive layout** that works on all screen sizes
- **Loading states** with animated spinner
- **Error handling** with retry functionality
- **Back navigation** to dashboard

### Profile Information Display
- **Personal Information**:
  - Full Name
  - Email Address
  - Mobile Number (Editable with inline editing)
  - Gender
  - Date of Birth

- **Professional Information**:
  - Occupation
  - Relation to Child

- **Account Information**:
  - User ID
  - Account Status (Active/Inactive)

### Visual Elements
- **Material Icons** for each information field
- **Status indicators** with color coding
- **Hover effects** and smooth transitions
- **Card-based layout** for better organization
- **Teal color scheme** matching the app's design
- **Gradient background** matching the login page design
- **Inline editing** for phone number with save/cancel buttons
- **Toast notifications** for update success/error messages

## API Response Structure

### Fetch Profile Response
```json
{
  "userId": 5,
  "firstName": "Saurabh",
  "lastName": "verma",
  "emailId": "saurabhv55a@gmail.com",
  "password": "$2a$10$KO46iTwQGCOLZTDRFjK8iOaSthE4kbGFHqPAIhAaCf2412NwSmCGa",
  "mobile": "6202884075",
  "gender": null,
  "dob": "2003-06-15",
  "occupation": "Teacher",
  "relationToChild": "Father",
  "isActive": true
}
```

### Update Profile Request
```json
{
  "firstName": "Sourav",
  "lastName": "Mandal",
  "mobile": "648364844",
  "patients": [
    {
      "id": 6,
      "fname": "Rittik",
      "lname": "Mandal",
      "gender": "Male",
      "dob": "2015-09-10",
      "patientMedicalHistory": "Asthma",
      "familyMedicalHistory": "Diabetes"
    }
  ]
}
```

## How to Use

### For Users
1. **Login** to the application
2. **Open dashboard** drawer menu (hamburger icon)
3. **Click "Profile"** in the menu
4. **View profile details** in the new page
5. **Edit phone number** by clicking the edit button next to mobile number
6. **Save changes** or cancel editing
7. **Click "Back to Dashboard"** to return

### For Developers
1. **Build the application**: `npm run build`
2. **Test the API**: Use the provided test script
3. **Deploy**: Follow the EC2 deployment guide

## Error Handling

### Authentication Errors
- **Missing token**: Redirects to login
- **Invalid token**: Shows error with retry option
- **Expired token**: Handles gracefully with user feedback

### API Errors
- **Network issues**: Retry functionality
- **Server errors**: User-friendly error messages
- **Invalid responses**: Graceful fallbacks

## Testing

### Manual Testing
1. Login with valid credentials
2. Navigate to profile page
3. Verify all information displays correctly
4. Test error scenarios (invalid token, network issues)

### API Testing
Use the provided test scripts:
```bash
# Test fetch profile API
node test-profile-api.js

# Test update profile API
node test-update-api.js
```

## Security Considerations

- **Token validation**: Checks for valid authentication token
- **Secure headers**: Uses proper Authorization header
- **Error handling**: Doesn't expose sensitive information
- **Input sanitization**: Handles null/undefined values safely

## Performance Optimizations

- **Lazy loading**: Component loads only when needed
- **Caching**: Profile data cached in component
- **Responsive images**: Optimized for different screen sizes
- **Minimal API calls**: Single request per profile view

## Future Enhancements

### Potential Improvements
1. **Edit more fields**: Allow editing of name, occupation, etc.
2. **Profile picture**: Add avatar upload capability
3. **Password change**: Add password update feature
4. **Activity history**: Show user activity timeline
5. **Preferences**: Add user preference settings

### Technical Improvements
1. **State management**: Use NgRx for better state handling
2. **Caching strategy**: Implement service worker caching
3. **Offline support**: Add offline profile viewing
4. **Real-time updates**: WebSocket integration for live updates

## Troubleshooting

### Common Issues

1. **Profile not loading**
   - Check authentication token
   - Verify API endpoint is accessible
   - Check browser console for errors

2. **Styling issues**
   - Ensure Material Icons are loaded
   - Check CSS compatibility
   - Verify responsive breakpoints

3. **Navigation problems**
   - Check route configuration
   - Verify component imports
   - Test router navigation

### Debug Steps
1. Open browser developer tools
2. Check Network tab for API calls
3. Review Console for error messages
4. Verify localStorage for token
5. Test API endpoint directly

## Deployment Notes

- **Build command**: `npm run build -- --configuration=production`
- **Environment**: Update `environment.prod.ts` with correct API URLs
- **Assets**: Ensure all icons and images are included in build
- **Routing**: Configure nginx for Angular routing support

---

**Last Updated**: July 13, 2025
**Version**: 1.0.0
**Status**: ✅ Complete and Ready for Deployment 