const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ['Super Admin', 'Admin', 'Manager', 'Team Leader', 'Assistant Team Leader', 'Agent'],
    },
    description: String,
    permissions: [
      {
        type: String,
        enum: [
          'view_all_leads',
          'view_department_leads',
          'view_team_leads',
          'view_own_leads',
          'create_leads',
          'edit_leads',
          'delete_leads',
          'assign_leads',
          'move_leads',
          'manage_users',
          'assign_roles',
          'manage_departments',
          'generate_reports',
          'manage_dispositions',
          'view_audit_logs',
          'sync_sheets',
        ],
      },
    ],
    level: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Role', roleSchema);
