export const contractSchemas: Record<string, any> = {
  STANDARD: {
    key: 'STANDARD',
    label: 'Standard Contract',
    fields: [
      { key: 'parties', label: 'Parties', type: 'parties', min: 2 },
      { key: 'effectiveDate', label: 'Effective Date', type: 'date' },
      { key: 'jurisdiction', label: 'Governing Law / Jurisdiction', type: 'text', placeholder: 'State, Country' },
      { key: 'clauses', label: 'Clauses', type: 'repeatable', itemType: 'textarea', placeholder: 'Confidentiality' },
      { key: 'term', label: 'Term / Duration', type: 'text', optional: true }
    ]
  },

  NDA: {
    key: 'NDA',
    label: 'NDA',
    fields: [
      { key: 'parties', label: 'Parties', type: 'parties', min: 2 },
      { key: 'effectiveDate', label: 'Effective Date', type: 'date' },
      { key: 'jurisdiction', label: 'Governing Law', type: 'text' },
      { key: 'confidentialDefinition', label: 'Definition of Confidential Information', type: 'textarea' },
      { key: 'duration', label: 'Duration', type: 'text', placeholder: '2 years' }
    ]
  },

  SERVICE: { key: 'SERVICE', label: 'Service Agreement', fields: [{ key:'parties', label:'Parties', type:'parties', min:2 }, { key:'scope', label:'Scope of Services', type:'textarea' }] },
  EMPLOYMENT: { key:'EMPLOYMENT', label:'Employment Agreement', fields: [{ key:'employer', label:'Employer', type:'text' }, { key:'employee', label:'Employee', type:'text' }] },
  // Extended Employment schema (mirrors src/config version) including Effective Date for consistency
  // Note: Retain original minimal version above if referenced elsewhere; consumers should prefer extended schema.
  EMPLOYMENT_EXTENDED: { key:'EMPLOYMENT', label:'Employment Agreement', fields: [
    { key:'employer', label:'Employer (Company)', type:'text' },
    { key:'employee', label:'Employee', type:'text' },
    { key:'effectiveDate', label:'Effective Date', type:'date' },
    { key:'jobTitle', label:'Job Title', type:'text' },
    { key:'duties', label:'Duties & Responsibilities', type:'textarea' },
    { key:'reportingLine', label:'Reporting Line', type:'text', optional:true },
    { key:'compensationDetails', label:'Compensation Details', type:'textarea' },
    { key:'employmentTerm', label:'Employment Term', type:'text' },
    { key:'renewalOptions', label:'Renewal Options', type:'text', optional:true },
    { key:'terminationGrounds', label:'Termination Grounds', type:'textarea' },
    { key:'noticePeriod', label:'Notice Period', type:'text' },
    { key:'severance', label:'Severance', type:'textarea', optional:true },
    { key:'confidentiality', label:'Confidentiality', type:'textarea' },
    { key:'ipAssignment', label:'IP Assignment', type:'checkbox', optional:true },
    { key:'nonCompete', label:'Non-Competition Clause / Restrictions', type:'textarea', optional:true },
    { key:'nonSolicitation', label:'Non-Solicitation Clause / Restrictions', type:'textarea', optional:true }
  ] },
  LEASE: { key:'LEASE', label:'Lease Agreement', fields:[
    {key:'landlord',label:'Landlord',type:'text'},
    {key:'tenant',label:'Tenant',type:'text'},
    {key:'effectiveDate',label:'Effective Date',type:'date'}
  ] }
  , SAFE: { key:'SAFE', label:'SAFE Agreement', fields:[
    { key:'investor', label:'Investor', type:'text' },
    { key:'company', label:'Company', type:'text' },
    { key:'effectiveDate', label:'Effective Date', type:'date' },
    { key:'investmentAmount', label:'Investment Amount', type:'text' }
  ] }
};

export default contractSchemas;
