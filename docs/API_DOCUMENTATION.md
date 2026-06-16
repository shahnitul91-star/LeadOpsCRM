# Lead Management CRM - API Documentation

## Authentication Endpoints

### Google SSO Login
- **GET** `/api/auth/google`
  - Initiates Google OAuth2 flow

### Google Callback
- **GET** `/api/auth/google/callback`
  - Handles Google OAuth2 callback
  - Returns JWT token

### Get User Profile
- **GET** `/api/auth/profile`
  - Headers: `Authorization: Bearer {token}`
  - Returns: Current user profile with role and department

### Logout
- **POST** `/api/auth/logout`
  - Headers: `Authorization: Bearer {token}`
  - Invalidates session

## Admin Endpoints

### Create User
- **POST** `/api/admin/users`
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ firstName, lastName, email, roleId, departmentId }`
  - Returns: Created user object

### Update User
- **PUT** `/api/admin/users/:userId`
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ firstName, lastName, roleId, departmentId, isActive }`
  - Returns: Updated user object

### Assign Role
- **POST** `/api/admin/assign-role`
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ userId, roleId }`
  - Returns: Updated user with new role

### Assign Lead
- **POST** `/api/admin/assign-lead`
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ leadId, userId, departmentId }`
  - Returns: Lead with assignment history

### Get All Users
- **GET** `/api/admin/users`
  - Headers: `Authorization: Bearer {token}`
  - Query: `?roleId=...&departmentId=...&isActive=true/false`
  - Returns: Array of users

### Get Department Statistics
- **GET** `/api/admin/stats/departments`
  - Headers: `Authorization: Bearer {token}`
  - Returns: Department-wise lead statistics

## Lead Endpoints

### Get User's Leads
- **GET** `/api/leads`
  - Headers: `Authorization: Bearer {token}`
  - Query: `?status=Open&disposition=New`
  - Returns: Array of leads assigned to user

### Get Lead Details
- **GET** `/api/leads/:leadId`
  - Headers: `Authorization: Bearer {token}`
  - Returns: Detailed lead information with comments and activity log

### Update Lead
- **PUT** `/api/leads/:leadId`
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ disposition, status, stage, customFields }`
  - Returns: Updated lead

### Add Comment to Lead
- **POST** `/api/leads/:leadId/comments`
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ text }`
  - Returns: Lead with new comment

### Get Lead History
- **GET** `/api/leads/:leadId/history`
  - Headers: `Authorization: Bearer {token}`
  - Returns: Assignment history and activity log

### Move Lead
- **POST** `/api/leads/:leadId/move`
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ newDepartmentId, newStage, newDisposition }`
  - Returns: Moved lead with activity log

## User Endpoints

### Get Current User
- **GET** `/api/users/me`
  - Headers: `Authorization: Bearer {token}`
  - Returns: Current user profile

## Department Endpoints

### Get All Departments
- **GET** `/api/departments`
  - Headers: `Authorization: Bearer {token}`
  - Returns: Array of active departments

### Get Department Details
- **GET** `/api/departments/:departmentId`
  - Headers: `Authorization: Bearer {token}`
  - Returns: Department details with manager and subdepartments

## Role Endpoints

### Get All Roles
- **GET** `/api/roles`
  - Headers: `Authorization: Bearer {token}`
  - Returns: Array of active roles

### Get Role Details
- **GET** `/api/roles/:roleId`
  - Headers: `Authorization: Bearer {token}`
  - Returns: Role details with permissions

## Error Responses

All errors return the following format:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error
