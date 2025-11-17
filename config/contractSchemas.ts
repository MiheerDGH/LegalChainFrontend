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
  LEASE: { key:'LEASE', label:'Lease Agreement', fields:[{key:'landlord',label:'Landlord',type:'text'},{key:'tenant',label:'Tenant',type:'text'}] }
};

export default contractSchemas;
