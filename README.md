# Lead Management CRM System

A comprehensive Customer Relationship Management (CRM) system designed for multi-departmental lead management with role-based access control, real-time data synchronization, and advanced reporting capabilities.

## 📋 System Overview

### Department Structure

#### Higher Management
- **Access**: All departments
- **Role**: Full visibility and control across the organization

#### Campaign Department
- **Sub-departments**:
  - NTC, NTC Email
  - CRLA, CRLA Email
  - CRLB, CRLB Email
  - CRLD, CRLD Email
  - CRM, CRM Email

#### NLPC & HR Team
- **Sub-departments**:
  - CRMFC
  - CRMC Email
  - NLPC Inbound
  - HR Inbound
  - NLPC
  - NLPC Postsales
  - NLPC Postsales Email

### User Roles & Permissions

| Role | Permissions |
|------|------------|
| **Super Admin** | All access - lead assignments, role assignments, changes, corrections, revoking, restricting |
| **Admin** | Changes, corrections, revoking, restricting, lead assignments and removals, role assignments |
| **Manager** | Manage assigned departments, lead operations, team oversight |
| **Team Leader** | Manage assigned teams, lead operations within team scope |
| **Assistant Team Leader** | Manage assigned teams, lead operations within team scope |
| **Agent** | View and work on assigned leads only |

### Lead Management Features

- **Lead Data Source**: Google Sheets (real-time synchronization)
- **Dispositions**: Customizable per department
- **Lead Movement**: Between stages and departments (tracked for ATL, TL, Manager, Admin, Super Admin)
- **Mandatory Fields**: Comments and dispositions when lead is opened
- **Lead History**: Complete audit trail of all changes
- **Mobile Number**: Always hidden from view
- **Email Address**: Visible in candidate details

### System Components

1. **Authentication Module**
   - SSO Login (Google/Enterprise credentials)
   - Profile setup from Headcount sheet
   - Session management

2. **Lead Management**
   - Lead CRUD operations
   - Real-time lead assignment
   - Disposition tracking
   - Comment system with activity log

3. **Admin Panel**
   - User management
   - Role assignment
   - Lead assignment
   - Department management

4. **Dashboard**
   - Summary statistics
   - KPI metrics
   - Department overview

5. **Agent Portal**
   - Personal lead queue
   - Lead interaction interface
   - Activity tracking

6. **Reporting Module**
   - Custom report generation
   - Export functionality (CSV, Excel, PDF)
   - Department-wise analytics

7. **Data Synchronization**
   - Google Sheets integration
   - Real-time lead import
   - Automatic updates

## 📁 Project Structure

```
LeadOpsCRM/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   └── LoginPage.jsx
│   │   │   ├── Dashboard/
│   │   │   ├── AdminPanel/
│   │   │   ├── AgentPortal/
│   │   │   ├── LeadManagement/
│   │   │   └── Reports/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── styles/
│   ├── package.json
│   └── .env.example
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── config/
│   │   └── utils/
│   ├── tests/
│   ├── .env.example
│   └── package.json
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   └── SETUP_GUIDE.md
└── docker-compose.yml
```

## 🚀 Technology Stack

### Frontend
- React.js
- Redux/Context API
- Tailwind CSS / Material-UI
- React Query
- Chart.js / Recharts

### Backend
- Node.js / Express.js
- MongoDB
- JWT + SSO Integration
- Google Sheets API
- Bull Queue (for background jobs)

### Infrastructure
- Docker
- Docker Compose
- PostgreSQL / MongoDB
- Redis (for caching)

## 📊 Key Features

- ✅ Multi-department organizational structure
- ✅ Role-based access control (RBAC)
- ✅ Real-time Google Sheets synchronization
- ✅ Complete audit trail and activity logs
- ✅ Customizable dispositions per department
- ✅ Lead movement tracking between stages/departments
- ✅ Mandatory comments and dispositions
- ✅ SSO authentication
- ✅ Custom report generation
- ✅ Mobile-responsive design
- ✅ Data privacy (mobile numbers hidden)

## 🔐 Security Considerations

- End-to-end encryption for sensitive data
- Role-based access control
- API rate limiting
- JWT token-based authentication
- Audit logging for compliance
- Data validation and sanitization

## 📈 Performance

- Lazy loading for large datasets
- Pagination for lead lists
- Caching mechanisms
- Database indexing
- CDN for static assets

## 🔄 Real-time Sync Features

- Google Sheets API integration
- Webhook-based updates
- Queue system for bulk operations
- Conflict resolution for concurrent updates
- Change notifications

## 📝 Database Models

- Users
- Leads
- Departments
- Roles
- Permissions
- LeadDispositions
- LeadComments
- LeadHistory
- LeadAssignments
- Reports

## 📞 Support & Documentation

See the `/docs` directory for:
- Complete API documentation
- Database schema details
- Setup and deployment guides
- User guides for each role

## 🤝 Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Last Updated**: 2026-06-16
**Version**: 1.0.0-alpha
