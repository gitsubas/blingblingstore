# User Profile Editing Walkthrough

I have implemented full user profile editing capabilities. You can now update your personal information, change your password, manage shipping addresses, and upload a profile picture.

## Changes

### 1. AuthContext Updates
- Added `shippingAddresses` and `profilePicture` to the `User` interface.
- Implemented `changePassword` method.
- Updated `updateUser` to allow users to update their own profile.

### 2. UserProfile Component
- Completely redesigned the profile page with tabs:
    - **Profile Details**: Edit username, email, and upload profile picture.
    - **Security**: Change password.
    - **Shipping Addresses**: Add, delete, and set default shipping addresses.

## Verification Steps

### Manual Verification
1.  **Login** to the application.
2.  Navigate to the **Profile** page (click on username in header -> Profile).
3.  **Profile Picture**:
    - Click the camera icon on your avatar.
    - Select an image file.
    - Verify the image updates immediately.
4.  **Edit Profile**:
    - Click the "Edit" button in the "Profile Details" tab.
    - Change your username and email.
    - Click "Save Changes".
    - Verify the changes are reflected.
5.  **Change Password**:
    - Switch to the "Security" tab.
    - Enter your current password (any value works for this mock implementation if you are already logged in, but try to be realistic).
    - Enter a new password and confirm it.
    - Click "Update Password".
    - **Logout** and try to **Login** with the new password.
6.  **Manage Addresses**:
    - Switch to the "Shipping Addresses" tab.
    - Click "Add New Address".
    - Fill in the details and click "Save Address".
    - Verify the address appears in the list.
    - Add another address.
    - Try setting one as "Default".
    - Try deleting an address.

## Screenshots
*(Screenshots would be added here after manual verification)*
