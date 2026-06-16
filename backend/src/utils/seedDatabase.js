const User = require('../models/User');
const Role = require('../models/Role');
const Department = require('../models/Department');

const initializeDatabaseSeeds = async () => {
  try {
    console.log('Initializing database seeds...');

    const rolesData = [
      { name: 'Super Admin', level: 6, description: 'Full system access', permissions: ['view_all_leads', 'manage_users', 'assign_roles', 'manage_departments', 'manage_dispositions', 'view_audit_logs', 'sync_sheets', 'generate_reports', 'move_leads', 'assign_leads', 'delete_leads', 'edit_leads', 'create_leads'] },
      { name: 'Admin', level: 5, description: 'Administrative access', permissions: ['view_all_leads', 'manage_users', 'assign_roles', 'assign_leads', 'move_leads', 'generate_reports', 'view_audit_logs'] },
      { name: 'Manager', level: 4, description: 'Department management', permissions: ['view_department_leads', 'assign_leads', 'move_leads', 'generate_reports', 'edit_leads'] },
      { name: 'Team Leader', level: 3, description: 'Team oversight', permissions: ['view_team_leads', 'assign_leads', 'edit_leads', 'move_leads'] },
      { name: 'Assistant Team Leader', level: 2, description: 'Team support', permissions: ['view_team_leads', 'edit_leads'] },
      { name: 'Agent', level: 1, description: 'Lead handling only', permissions: ['view_own_leads', 'edit_leads'] },
    ];

    for (const role of rolesData) {
      const existingRole = await Role.findOne({ name: role.name });
      if (!existingRole) {
        await Role.create(role);
        console.log(`Created role: ${role.name}`);
      }
    }

    const departmentsData = [
      { name: 'Higher Management', code: 'HM', description: 'Full organizational access' },
      { name: 'Campaign', code: 'CAMP', description: 'Campaign hiring department' },
      { name: 'NLPC & HR Team', code: 'NLPC_HR', description: 'Sales and HR team' },
      { name: 'NTC', code: 'NTC', parentDepartment: null, description: 'New Talent Campaigns' },
      { name: 'CRLA', code: 'CRLA', parentDepartment: null, description: 'Campaign Resources LA' },
      { name: 'CRLB', code: 'CRLB', parentDepartment: null, description: 'Campaign Resources LB' },
      { name: 'CRLD', code: 'CRLD', parentDepartment: null, description: 'Campaign Resources LD' },
      { name: 'CRM', code: 'CRM', parentDepartment: null, description: 'Campaign Resource Management' },
      { name: 'NLPC Inbound', code: 'NLPC_IB', parentDepartment: null, description: 'NLPC Inbound' },
      { name: 'HR Inbound', code: 'HR_IB', parentDepartment: null, description: 'HR Inbound' },
      { name: 'NLPC Postsales', code: 'NLPC_PS', parentDepartment: null, description: 'NLPC Post-sales' },
    ];

    for (const dept of departmentsData) {
      const existingDept = await Department.findOne({ code: dept.code });
      if (!existingDept) {
        await Department.create(dept);
        console.log(`Created department: ${dept.name}`);
      }
    }

    console.log('Database seeds initialized successfully');
  } catch (error) {
    console.error('Error initializing database seeds:', error);
  }
};

module.exports = { initializeDatabaseSeeds };
