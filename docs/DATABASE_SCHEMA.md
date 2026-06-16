# Database Schema Documentation

## User Schema

```javascript
{
  _id: ObjectId,
  email: String (unique),
  firstName: String,
  lastName: String,
  googleId: String,
  password: String (hashed),
  profilePicture: String,
  mobileNumber: String (hidden),
  role: ObjectId (ref: Role),
  department: ObjectId (ref: Department),
  assignedTeams: [ObjectId] (ref: Team),
  isActive: Boolean,
  isApproved: Boolean,
  approvedBy: ObjectId (ref: User),
  approvalDate: Date,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Role Schema

```javascript
{
  _id: ObjectId,
  name: String (enum: ['Super Admin', 'Admin', 'Manager', 'Team Leader', 'Assistant Team Leader', 'Agent']),
  description: String,
  permissions: [String],
  level: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Department Schema

```javascript
{
  _id: ObjectId,
  name: String (unique),
  code: String (unique),
  description: String,
  parentDepartment: ObjectId (ref: Department),
  subdepartments: [ObjectId] (ref: Department),
  manager: ObjectId (ref: User),
  dispositions: [
    {
      name: String,
      description: String,
      color: String,
      isActive: Boolean
    }
  ],
  googleSheetId: String,
  googleSheetRange: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Lead Schema

```javascript
{
  _id: ObjectId,
  leadId: String (unique),
  firstName: String,
  lastName: String,
  email: String,
  mobileNumber: String (hidden),
  department: ObjectId (ref: Department),
  currentAssignee: ObjectId (ref: User),
  disposition: String,
  status: String (enum: ['Open', 'Closed', 'On Hold', 'Recycled']),
  stage: String,
  source: String,
  customFields: Mixed,
  comments: [
    {
      userId: ObjectId (ref: User),
      text: String,
      createdAt: Date
    }
  ],
  assignmentHistory: [
    {
      assignedTo: ObjectId (ref: User),
      assignedBy: ObjectId (ref: User),
      department: ObjectId (ref: Department),
      stage: String,
      disposition: String,
      assignedAt: Date
    }
  ],
  activityLog: [
    {
      action: String,
      performedBy: ObjectId (ref: User),
      details: Mixed,
      timestamp: Date
    }
  ],
  lastTouchedBy: ObjectId (ref: User),
  lastTouchedAt: Date,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Indexes

- Lead: `{ department: 1, currentAssignee: 1 }`
- Lead: `{ email: 1 }`
- Lead: `{ leadId: 1 }`
- User: `{ email: 1 }`
- Department: `{ code: 1 }`
- Role: `{ name: 1 }`
