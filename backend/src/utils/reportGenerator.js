const generateReport = (leads, format = 'json') => {
  if (format === 'csv') {
    return generateCSVReport(leads);
  } else if (format === 'excel') {
    return generateExcelReport(leads);
  }
  return leads;
};

const generateCSVReport = (leads) => {
  let csv = 'Lead ID,Name,Email,Status,Disposition,Assigned To,Last Touched\n';
  
  leads.forEach(lead => {
    csv += `${lead.leadId},${lead.firstName} ${lead.lastName},${lead.email},${lead.status},${lead.disposition},${lead.currentAssignee?.firstName || 'Unassigned'},${new Date(lead.lastTouchedAt).toLocaleString()}\n`;
  });

  return csv;
};

const generateExcelReport = (leads) => {
  // Implement Excel generation using a library like exceljs
  return leads;
};

const generateDepartmentReport = (leads, departmentId) => {
  return leads.filter(lead => lead.department?.toString() === departmentId.toString());
};

const generateAgentPerformanceReport = (leads, agentId) => {
  const agentLeads = leads.filter(lead => lead.currentAssignee?.toString() === agentId.toString());
  return {
    totalLeads: agentLeads.length,
    closedLeads: agentLeads.filter(l => l.status === 'Closed').length,
    openLeads: agentLeads.filter(l => l.status === 'Open').length,
    onHoldLeads: agentLeads.filter(l => l.status === 'On Hold').length,
    closeRate: (agentLeads.filter(l => l.status === 'Closed').length / agentLeads.length * 100).toFixed(2),
  };
};

module.exports = {
  generateReport,
  generateCSVReport,
  generateExcelReport,
  generateDepartmentReport,
  generateAgentPerformanceReport,
};
