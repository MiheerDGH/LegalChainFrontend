export const contractSchemas = {
  STANDARD: {
    key: 'STANDARD',
    label: 'Standard Contract',
    description: 'Generic contract with clauses, parties, governing law, and signatures.',
    fields: [
      { key: 'title', label: 'Title', type: 'text', placeholder: 'Agreement Title (optional)', optional: true },
      { key: 'parties', label: 'Parties', type: 'parties', min: 2, help: 'At least two signing parties' },
      { key: 'effectiveDate', label: 'Effective Date', type: 'date' },
      { key: 'jurisdiction', label: 'Jurisdiction (Governing Law)', type: 'text', placeholder: 'State, Country' },
      { key: 'clauses', label: 'Clauses / Section headings', type: 'repeatable', itemType: 'textarea', placeholder: 'Confidentiality clause' },
      { key: 'term', label: 'Term / Duration', type: 'text', optional: true },
      { key: 'notaryRequired', label: 'Require notary block', type: 'checkbox', optional: true }
    ]
  },

  SERVICE: {
    key: 'SERVICE',
    label: 'Service Agreement (SOW)',
    description: 'Scope of services, deliverables, fees, acceptance criteria, timelines.',
    fields: [
      { key: 'parties', label: 'Parties', type: 'parties', min: 2 },
      { key: 'effectiveDate', label: 'Effective Date', type: 'date' },
      { key: 'jurisdiction', label: 'Governing Law', type: 'text' },

      // i. Scope of Services, Deliverables, Timelines
      { key: 'scopeOfServices', label: 'Scope of Services', type: 'textarea', placeholder: 'Describe the services to be provided (scope, boundaries, exclusions)' },
      { key: 'deliverables', label: 'Deliverables (list)', type: 'repeatable', itemType: 'text', placeholder: 'Deliverable name / description' },
      { key: 'milestones', label: 'Milestones / Timeline', type: 'repeatable', itemType: 'text', placeholder: 'Milestone description & target date' },

      // ii. Payment Structure and Invoicing
      { key: 'paymentStructure', label: 'Payment Structure', type: 'select', options: ['Hourly', 'Fixed', 'Milestone'], help: 'Choose the pricing model' },
      { key: 'hourlyRate', label: 'Hourly Rate (if applicable)', type: 'text', optional: true },
      { key: 'fixedFee', label: 'Fixed Fee (if applicable)', type: 'text', optional: true },
      { key: 'milestonePayments', label: 'Milestone Payment Schedule', type: 'repeatable', itemType: 'text', optional: true, placeholder: 'Milestone name — amount — due on acceptance' },
      { key: 'invoicingSchedule', label: 'Invoicing Schedule', type: 'textarea', placeholder: 'When invoices are issued and payment due dates (e.g., Net 30)' },

      // iii. Independent Contractor status
      { key: 'independentContractor', label: 'Independent Contractor Status', type: 'checkbox', optional: true, help: 'Check to confirm the service provider is an independent contractor' },

      // iv. Warranties, Representations, Compliance
      { key: 'warrantiesAndRepresentations', label: 'Warranties & Representations', type: 'textarea', placeholder: 'Any affirmative warranties or representations by the parties' },
      { key: 'complianceAssurances', label: 'Compliance Assurances', type: 'textarea', optional: true, placeholder: 'e.g., data protection, export controls, applicable laws' },

      // v. Indemnification and Liability Limits
      { key: 'indemnification', label: 'Indemnification', type: 'textarea', placeholder: 'Scope of indemnity (who indemnifies whom and for what)' },
      { key: 'liabilityLimit', label: 'Liability Limit / Cap', type: 'text', optional: true, placeholder: 'e.g., amount, "direct damages only", or exclude certain types of damages' },

      // vi. Termination triggers, notice, fees
      { key: 'terminationTriggers', label: 'Termination Triggers', type: 'textarea', placeholder: 'Events allowing termination (e.g., material breach, insolvency)' },
      { key: 'terminationNotice', label: 'Termination Notice Requirement', type: 'text', placeholder: 'Notice period required (e.g., 30 days)' },
      { key: 'terminationFees', label: 'Termination Fees / Early-termination Remedies', type: 'textarea', optional: true, placeholder: 'Any fees or remedies on termination' },

      { key: 'acceptanceCriteria', label: 'Acceptance Criteria', type: 'textarea', optional: true },
      { key: 'additionalNotes', label: 'Additional Notes / Special Terms', type: 'textarea', optional: true }
    ]
  },

  NDA: {
    key: 'NDA',
    label: 'Non-Disclosure Agreement (NDA)',
    description: 'Defines confidential information, exclusions, permitted disclosures, and duration.',
    fields: [
      { key: 'parties', label: 'Parties', type: 'parties', min: 2 },
      { key: 'effectiveDate', label: 'Effective Date', type: 'date' },
      { key: 'jurisdiction', label: 'Governing Law', type: 'text' },
      { key: 'confidentialInformationTypes', label: 'Confidential Information Types', type: 'repeatable', itemType: 'text', placeholder: 'e.g., trade secrets, business plans, financial data' },
      { key: 'permittedUsesAndExclusions', label: 'Permitted Uses and Exclusions', type: 'textarea', placeholder: 'Public info, independently developed data, etc.' },
      { key: 'confidentialityTerm', label: 'Confidentiality Term / Duration', type: 'text', placeholder: 'e.g., 2 years' },
      { key: 'returnOrDestruction', label: 'Return or Destruction of Materials upon Termination', type: 'textarea', placeholder: 'Describe return or destruction procedures' },
      { key: 'desiredRemedies', label: 'Desired Remedies', type: 'textarea', optional: true, placeholder: 'e.g., injunctive relief, damages' }
    ]
  },

  EMPLOYMENT: {
    key: 'EMPLOYMENT',
    label: 'Employment Agreement',
    description: 'Employment terms, compensation, duties, IP assignment, termination.',
    fields: [
      { key: 'employer', label: 'Employer (Company)', type: 'text' },
      { key: 'employee', label: 'Employee', type: 'text' },
      { key: 'jobTitle', label: 'Job Title', type: 'text' },
      { key: 'duties', label: 'Duties & Responsibilities', type: 'textarea', placeholder: 'Describe primary duties and reporting line' },
      { key: 'reportingLine', label: 'Reporting Line', type: 'text', optional: true },
      { key: 'compensationDetails', label: 'Compensation Details', type: 'textarea', placeholder: 'Salary, bonuses, commissions, benefits' },
      { key: 'employmentTerm', label: 'Employment Term', type: 'select', options: ['At-will', 'Fixed-term'], help: 'Select at-will or fixed-term' },
      { key: 'renewalOptions', label: 'Renewal Options', type: 'text', optional: true },
      { key: 'terminationGrounds', label: 'Termination Grounds', type: 'textarea', placeholder: 'Grounds for termination' },
      { key: 'noticePeriod', label: 'Notice Period', type: 'text', placeholder: 'e.g., 30 days' },
      { key: 'severance', label: 'Severance', type: 'textarea', optional: true },
      { key: 'confidentiality', label: 'Confidentiality', type: 'textarea', placeholder: 'Confidentiality obligations and scope' },
      { key: 'ipAssignment', label: 'IP Assignment', type: 'checkbox', optional: true },
      { key: 'nonCompete', label: 'Non-Competition Clause / Restrictions', type: 'textarea', optional: true },
      { key: 'nonSolicitation', label: 'Non-Solicitation Clause / Restrictions', type: 'textarea', optional: true }
    ]
  },

  CONSULTING: {
    key: 'CONSULTING',
    label: 'Consulting Agreement',
    fields: [
      { key: 'parties', label: 'Parties', type: 'parties', min: 2 },
      { key: 'effectiveDate', label: 'Effective Date', type: 'date' },
      { key: 'scope', label: 'Scope / Services', type: 'textarea' },
      { key: 'fees', label: 'Fees / Payment', type: 'textarea' },
      { key: 'term', label: 'Term / Termination', type: 'text', optional: true }
    ]
  },

  LEASE: {
    key: 'LEASE',
    label: 'Lease Agreement',
    fields: [
      { key: 'landlord', label: 'Landlord', type: 'text' },
      { key: 'tenant', label: 'Tenant', type: 'text' },

      // i. Exact Property Description
      { key: 'propertyAddress', label: 'Property Address', type: 'address', placeholder: 'Full street address' },
      { key: 'unitOrApt', label: 'Unit / Apartment', type: 'text', optional: true },
      { key: 'includedAppliances', label: 'Included Appliances / Fixtures', type: 'repeatable', itemType: 'text', optional: true, placeholder: 'e.g., Refrigerator, Washer' },

      // ii. Lease Term
      { key: 'leaseStart', label: 'Lease Start Date', type: 'date' },
      { key: 'leaseEnd', label: 'Lease End Date', type: 'date', optional: true },
      { key: 'renewalOptions', label: 'Renewal Options', type: 'text', optional: true, placeholder: 'Automatic renewal, notice required, conversion to month-to-month' },
      { key: 'monthToMonthConversion', label: 'Month-to-Month Conversion Terms', type: 'text', optional: true },

      // iii. Rent, Security Deposit, Due Dates, Late Fee Policy
      { key: 'rentAmount', label: 'Rent Amount', type: 'currency' },
      { key: 'rentDueDate', label: 'Rent Due Date', type: 'text', placeholder: 'e.g., 1st of each month' },
      { key: 'securityDeposit', label: 'Security Deposit Amount', type: 'currency', optional: true },
      { key: 'lateFeePolicy', label: 'Late Fee Policy', type: 'text', optional: true, placeholder: 'Amount or percentage and when it applies' },

      // Permitted Uses / Occupancy / Guest / Business Restrictions
      { key: 'permittedUses', label: 'Permitted Uses', type: 'textarea', optional: true, placeholder: 'Residential only, home office restrictions, etc.' },
      { key: 'occupancyLimits', label: 'Occupancy Limits', type: 'text', optional: true, placeholder: 'Maximum number of occupants' },
      { key: 'guestBusinessRestrictions', label: 'Guest / Business Restrictions', type: 'textarea', optional: true },

      // v. Maintenance Responsibilities
      { key: 'landlordMaintenanceResponsibilities', label: 'Landlord Maintenance Responsibilities', type: 'textarea', optional: true, placeholder: 'What landlord will maintain or repair' },
      { key: 'tenantMaintenanceResponsibilities', label: 'Tenant Maintenance Responsibilities', type: 'textarea', optional: true, placeholder: 'What tenant must maintain' },

      // vi. Utilities, Pet/Smoking/Noise, Alteration Policies
      { key: 'utilitiesIncluded', label: 'Utilities Included', type: 'repeatable', itemType: 'text', optional: true, placeholder: 'e.g., Water, Gas, Electricity' },
      { key: 'petPolicy', label: 'Pet Policy', type: 'text', optional: true },
      { key: 'smokingPolicy', label: 'Smoking Policy', type: 'text', optional: true },
      { key: 'noisePolicy', label: 'Noise Rules', type: 'text', optional: true },
      { key: 'alterationPolicy', label: 'Lease Alteration / Modification Policy', type: 'textarea', optional: true, placeholder: 'Permissions and procedures for alterations' },

      // vii. Default and Eviction Procedures
      { key: 'defaultEvents', label: 'Defaults / Events of Default', type: 'textarea', optional: true, placeholder: 'Non-payment, breach, illegal use, etc.' },
      { key: 'noticePeriods', label: 'Notice Periods', type: 'textarea', optional: true, placeholder: 'Notice required for remedy or termination' },
      { key: 'cureTimelines', label: 'Cure Timelines', type: 'text', optional: true, placeholder: 'Time allowed to cure a breach' },
      { key: 'evictionProcedures', label: 'Eviction Procedures / Remedies', type: 'textarea', optional: true },

      // viii. Landlord Right of Entry
      { key: 'rightOfEntry', label: 'Landlord Right of Entry / Inspection', type: 'textarea', optional: true, placeholder: 'Entry notice requirements, emergency entry, inspection schedule' }
    ]
  },

  PARTNERSHIP: {
    key: 'PARTNERSHIP',
    label: 'Partnership Agreement',
    fields: [
      { key: 'partners', label: 'Partners', type: 'repeatable', itemType: 'text', min: 2 },
      { key: 'capitalContributions', label: 'Capital Contributions', type: 'textarea' },
      { key: 'profitSharing', label: 'Profit / Loss Sharing', type: 'text' },
      { key: 'management', label: 'Governance / Management', type: 'textarea' },
      { key: 'dissolution', label: 'Withdrawal / Dissolution', type: 'textarea', optional: true }
    ]
  },

  IP_LICENSE: {
    key: 'IP_LICENSE',
    label: 'IP License',
    fields: [
      { key: 'licensor', label: 'Licensor', type: 'text' },
      { key: 'licensee', label: 'Licensee', type: 'text' },
      { key: 'scopeOfLicense', label: 'Scope of License', type: 'textarea' },
      { key: 'exclusivity', label: 'Exclusive / Non-exclusive', type: 'select', options: ['Exclusive', 'Non-exclusive'], optional: true },
      { key: 'territory', label: 'Territory', type: 'text', optional: true },
      { key: 'royalties', label: 'Royalties / Fees', type: 'text', optional: true },
      { key: 'duration', label: 'Duration', type: 'text' }
    ]
  },

  SAFE: {
    key: 'SAFE',
    label: 'SAFE (Simple Agreement for Future Equity)',
    description: 'Investor provides funds now in exchange for future equity on qualifying events; includes valuation cap, discount and conversion terms.',
    fields: [
      { key: 'investor', label: 'Investor', type: 'text' },
      { key: 'company', label: 'Company', type: 'text' },
      { key: 'investmentAmount', label: 'Investment Amount', type: 'currency' },
      { key: 'valuationCap', label: 'Valuation Cap', type: 'text', optional: true },
      { key: 'discountRate', label: 'Discount Rate', type: 'text', optional: true, placeholder: 'e.g., 20%'},
      { key: 'conversionTerms', label: 'Conversion Terms', type: 'textarea', optional: true },
      { key: 'maturityDate', label: 'Maturity Date / Term', type: 'date', optional: true },
      { key: 'investorRights', label: 'Investor Rights (e.g., information, pro rata)', type: 'textarea', optional: true },
      { key: 'transferRestrictions', label: 'Transfer Restrictions', type: 'textarea', optional: true },
      { key: 'closingConditions', label: 'Closing Conditions', type: 'textarea', optional: true },
      { key: 'jurisdiction', label: 'Governing Law / Jurisdiction', type: 'text', optional: true }
    ]
  },

  EQUITY: {
    key: 'EQUITY',
    label: 'Equity / Stock Purchase Agreement',
    description: 'Purchase of equity securities: purchase price, number of shares, representations, vesting and transfer restrictions.',
    fields: [
      { key: 'buyer', label: 'Buyer', type: 'text' },
      { key: 'seller', label: 'Seller', type: 'text' },
      { key: 'shareClass', label: 'Share Class', type: 'text', optional: true },
      { key: 'numberOfShares', label: 'Number of Shares', type: 'text' },
      { key: 'purchasePrice', label: 'Purchase Price', type: 'currency' },
      { key: 'vestingSchedule', label: 'Vesting Schedule (if applicable)', type: 'textarea', optional: true },
      { key: 'representationsWarranties', label: 'Representations & Warranties', type: 'textarea', optional: true },
      { key: 'closingDate', label: 'Closing Date', type: 'date', optional: true },
      { key: 'conditionsPrecedent', label: 'Conditions Precedent', type: 'textarea', optional: true },
      { key: 'transferRestrictions', label: 'Transfer Restrictions / Right of First Refusal', type: 'textarea', optional: true },
      { key: 'jurisdiction', label: 'Governing Law / Jurisdiction', type: 'text', optional: true }
    ]
  },

  SALES: {
    key: 'SALES',
    label: 'Sales Agreement',
    fields: [
      { key: 'buyer', label: 'Buyer', type: 'text' },
      { key: 'seller', label: 'Seller', type: 'text' },

      // i. Products Description & Specifications
      { key: 'goodsDescription', label: 'Goods / Products Description', type: 'textarea', placeholder: 'High-level description of the goods or products' },
      { key: 'productQuantity', label: 'Quantity', type: 'text', optional: true, placeholder: 'Number of units or quantity details' },
      { key: 'productModel', label: 'Model / Part Number', type: 'text', optional: true },
      { key: 'qualityStandards', label: 'Quality Standards / Specifications', type: 'textarea', optional: true, placeholder: 'e.g., ISO standard, tolerance, specs' },

      // ii. Purchase Price & Payment Terms
      { key: 'purchasePrice', label: 'Purchase Price', type: 'currency', help: 'Total contract price or unit price' },
      { key: 'paymentSchedule', label: 'Payment Schedule', type: 'repeatable', itemType: 'text', placeholder: 'Milestone/portion — amount — due date', optional: true },
      { key: 'acceptedPaymentMethods', label: 'Accepted Payment Methods', type: 'repeatable', itemType: 'text', optional: true, placeholder: 'e.g., Wire, ACH, Credit Card, Check' },
      { key: 'paymentTerms', label: 'Payment Terms (e.g., Net 30)', type: 'text', optional: true },

      // iii. Delivery Terms
      { key: 'incoterm', label: 'Incoterms / Delivery Terms', type: 'select', options: ['EXW','FCA','CPT','CIP','DAP','DPU','DDP','FOB','CFR','CIF'], optional: true },
      { key: 'shippingMethod', label: 'Shipping Method', type: 'text', optional: true },
      { key: 'deliveryLocation', label: 'Delivery Location', type: 'text', optional: true },
      { key: 'deliveryDate', label: 'Estimated Delivery Date', type: 'date', optional: true },
      { key: 'riskOfLoss', label: 'Risk of Loss Allocation', type: 'text', optional: true, placeholder: 'When risk passes between buyer and seller' },

      // iv. Inspection & Acceptance
      { key: 'inspectionCriteria', label: 'Inspection Criteria', type: 'textarea', optional: true, placeholder: 'Standards and tests used to inspect goods' },
      { key: 'acceptancePeriod', label: 'Acceptance Period', type: 'text', optional: true, placeholder: 'Timeframe for buyer to inspect and accept/reject' },
      { key: 'rejectionRights', label: 'Rejection Rights & Procedures', type: 'textarea', optional: true },

      // v. Warranties
      { key: 'warranties', label: 'Warranties (express & implied)', type: 'textarea', optional: true },
      { key: 'warrantyDuration', label: 'Warranty Duration', type: 'text', optional: true, placeholder: 'e.g., 12 months from delivery' },
      { key: 'warrantyDisclaimer', label: 'Warranty Disclaimer / Limitations', type: 'textarea', optional: true, placeholder: 'Any disclaimers of implied warranties or limits' },

      // vi. Title transfer & risk point
      { key: 'titleTransferPoint', label: 'Title Transfer Point', type: 'text', optional: true, placeholder: 'When legal title passes (e.g., upon shipment/delivery/payment)' },

      // vii. Remedies for breach
      { key: 'remediesNonDelivery', label: 'Remedies for Non-Delivery', type: 'textarea', optional: true },
      { key: 'remediesDefectiveGoods', label: 'Remedies for Defective Goods', type: 'textarea', optional: true },
      { key: 'remediesNonPayment', label: 'Remedies for Non-Payment', type: 'textarea', optional: true },
      { key: 'generalRemedies', label: 'General Remedies for Breach', type: 'textarea', optional: true }
    ]
  }
};

export default contractSchemas;
