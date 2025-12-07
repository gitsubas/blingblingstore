# User Profile Editing Implementation Plan

## Goal Description
Implement full user profile editing capabilities, allowing users to update their username, password, email, shipping addresses, and profile picture.

## User Review Required
- [ ] Confirm if there are specific design requirements for the profile page.
- [ ] Confirm if email update requires re-verification.

## Proposed Changes

### [Client]
#### [MODIFY] [AuthContext.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/context/AuthContext.tsx)
- Update `User` interface to include:
    - `shippingAddresses: Address[]`
    - `profilePicture: string` (URL)
- Update `updateUser` to allow users to update their own profile.
- Add `changePassword` method.
- Update `signup` and `login` to handle new fields if necessary.

#### [MODIFY] [UserProfile.tsx](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/pages/user/UserProfile.tsx)
- Add state for editing mode.
- Add forms for:
    - Basic Info (Username, Email)
    - Password Change
    - Shipping Addresses (List + Add/Edit/Delete)
    - Profile Picture (URL input or file picker converting to base64)

#### [NEW] [Address.ts](file:///Users/subas/Documents/Software_Development/blingblingstore/client/src/types/Address.ts)
- Define `Address` interface.

## Verification Plan
### Manual Verification
- [ ] Register a new user.
- [ ] Go to Profile page.
- [ ] Update Username and Email -> Verify reflected in UI and localStorage.
- [ ] Change Password -> Logout and Login with new password.
- [ ] Add/Edit/Delete Shipping Addresses -> Verify persistence.
- [ ] Set Profile Picture -> Verify image updates.
