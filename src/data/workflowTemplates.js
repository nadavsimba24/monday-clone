import { v4 as uuid } from 'uuid';

export const WORKFLOW_CATEGORIES = [
  {
    id: 'banking',
    name: 'Banking',
    icon: '🏦',
    description: 'Loan processing, compliance, customer onboarding & risk management',
    color: '#2e7d5a',
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    icon: '🏠',
    description: 'Property listings, transactions, tenant management & inspections',
    color: '#4caf82',
  },
  {
    id: 'logistics',
    name: 'Logistics',
    icon: '🚚',
    description: 'Shipment tracking, warehouse ops, fleet management & delivery',
    color: '#fdab3d',
  },
  {
    id: 'municipal',
    name: 'Municipal',
    icon: '🏛️',
    description: 'Permits, public works, citizen requests & budget tracking',
    color: '#43a047',
  },
  {
    id: 'hedge-funds',
    name: 'Hedge Funds',
    icon: '📈',
    description: 'Portfolio tracking, trade execution, due diligence & compliance',
    color: '#00c875',
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: '✈️',
    description: 'Trip planning, booking management, vendor relations & itineraries',
    color: '#81c784',
  },
];

// Building blocks that users can pick from per industry
export const WORKFLOW_BLOCKS = {
  banking: [
    {
      id: 'loan-pipeline',
      name: 'Loan Pipeline',
      description: 'Track loan applications from submission to approval',
      columns: [
        { type: 'status', title: 'Status' },
        { type: 'person', title: 'Loan Officer' },
        { type: 'numbers', title: 'Loan Amount ($)' },
        { type: 'date', title: 'Application Date' },
        { type: 'priority', title: 'Priority' },
        { type: 'text', title: 'Loan Type' },
      ],
      groups: [
        { title: 'New Applications', color: '#4caf82', items: ['Review mortgage application - Smith', 'Auto loan request - Johnson', 'Business credit line - TechCorp'] },
        { title: 'Under Review', color: '#fdab3d', items: ['Home equity loan - Williams', 'Personal loan - Davis'] },
        { title: 'Approved', color: '#00c875', items: ['Refinance - Anderson'] },
        { title: 'Declined', color: '#e2445c', items: [] },
      ],
    },
    {
      id: 'compliance-tracker',
      name: 'Compliance Tracker',
      description: 'Monitor regulatory compliance tasks and audits',
      columns: [
        { type: 'status', title: 'Status' },
        { type: 'person', title: 'Compliance Officer' },
        { type: 'date', title: 'Due Date' },
        { type: 'priority', title: 'Risk Level' },
        { type: 'text', title: 'Regulation' },
      ],
      groups: [
        { title: 'KYC Reviews', color: '#4caf82', items: ['Quarterly KYC audit', 'New client verification batch', 'High-risk account review'] },
        { title: 'AML Monitoring', color: '#fdab3d', items: ['Transaction monitoring update', 'Suspicious activity reports'] },
        { title: 'Regulatory Filings', color: '#2e7d5a', items: ['Q4 regulatory report', 'Annual compliance certificate'] },
      ],
    },
    {
      id: 'customer-onboarding',
      name: 'Customer Onboarding',
      description: 'New customer account setup and verification',
      columns: [
        { type: 'status', title: 'Stage' },
        { type: 'person', title: 'Account Manager' },
        { type: 'date', title: 'Start Date' },
        { type: 'text', title: 'Account Type' },
        { type: 'priority', title: 'Priority' },
      ],
      groups: [
        { title: 'Identity Verification', color: '#fdab3d', items: ['Document collection - Martinez', 'Background check - Lee'] },
        { title: 'Account Setup', color: '#4caf82', items: ['Configure online banking - Chen', 'Issue debit card - Patel'] },
        { title: 'Completed', color: '#00c875', items: ['Welcome package sent - Wilson'] },
      ],
    },
    {
      id: 'risk-assessment',
      name: 'Risk Assessment',
      description: 'Evaluate and manage financial risks',
      columns: [
        { type: 'status', title: 'Status' },
        { type: 'priority', title: 'Risk Level' },
        { type: 'person', title: 'Analyst' },
        { type: 'numbers', title: 'Exposure ($)' },
        { type: 'text', title: 'Category' },
        { type: 'date', title: 'Review Date' },
      ],
      groups: [
        { title: 'Credit Risk', color: '#e2445c', items: ['Large exposure review', 'Portfolio concentration analysis'] },
        { title: 'Market Risk', color: '#fdab3d', items: ['Interest rate sensitivity', 'Currency exposure report'] },
        { title: 'Operational Risk', color: '#4caf82', items: ['System downtime assessment', 'Fraud prevention review'] },
      ],
    },
  ],

  'real-estate': [
    {
      id: 'property-listings',
      name: 'Property Listings',
      description: 'Manage active property listings and their status',
      columns: [
        { type: 'status', title: 'Listing Status' },
        { type: 'person', title: 'Agent' },
        { type: 'numbers', title: 'Price ($)' },
        { type: 'text', title: 'Address' },
        { type: 'date', title: 'Listed Date' },
        { type: 'priority', title: 'Hot Lead' },
      ],
      groups: [
        { title: 'Active Listings', color: '#4caf82', items: ['123 Oak Street - 3BR/2BA', '456 Maple Ave - Condo', '789 Pine Road - Commercial'] },
        { title: 'Under Contract', color: '#fdab3d', items: ['321 Elm Drive - 4BR/3BA', '654 Birch Lane - Townhouse'] },
        { title: 'Closed', color: '#00c875', items: ['987 Cedar Court - 2BR/1BA'] },
      ],
    },
    {
      id: 'transaction-tracker',
      name: 'Transaction Tracker',
      description: 'Track real estate transactions from offer to close',
      columns: [
        { type: 'status', title: 'Stage' },
        { type: 'person', title: 'Agent' },
        { type: 'date', title: 'Close Date' },
        { type: 'numbers', title: 'Sale Price ($)' },
        { type: 'text', title: 'Property' },
        { type: 'priority', title: 'Urgency' },
      ],
      groups: [
        { title: 'Offer Submitted', color: '#4caf82', items: ['Offer on 123 Main St', 'Counter-offer pending 456 Oak'] },
        { title: 'Inspection Phase', color: '#fdab3d', items: ['Home inspection scheduled - 789 Elm', 'Appraisal in progress - 321 Pine'] },
        { title: 'Closing', color: '#81c784', items: ['Final walkthrough - 654 Maple'] },
      ],
    },
    {
      id: 'tenant-management',
      name: 'Tenant Management',
      description: 'Track tenants, leases, and maintenance requests',
      columns: [
        { type: 'status', title: 'Status' },
        { type: 'person', title: 'Property Manager' },
        { type: 'date', title: 'Lease End' },
        { type: 'numbers', title: 'Monthly Rent ($)' },
        { type: 'text', title: 'Unit' },
      ],
      groups: [
        { title: 'Active Tenants', color: '#00c875', items: ['Smith - Unit 4A', 'Johnson - Unit 2B', 'Williams - Unit 7C'] },
        { title: 'Lease Renewals', color: '#fdab3d', items: ['Davis - Unit 1A (expires Mar)', 'Brown - Unit 5B (expires Apr)'] },
        { title: 'Maintenance Requests', color: '#e2445c', items: ['Plumbing issue - Unit 3C', 'HVAC repair - Unit 6A'] },
      ],
    },
    {
      id: 'property-inspections',
      name: 'Property Inspections',
      description: 'Schedule and track property inspections',
      columns: [
        { type: 'status', title: 'Status' },
        { type: 'person', title: 'Inspector' },
        { type: 'date', title: 'Inspection Date' },
        { type: 'text', title: 'Property' },
        { type: 'priority', title: 'Priority' },
      ],
      groups: [
        { title: 'Scheduled', color: '#4caf82', items: ['Annual inspection - 123 Oak', 'Pre-sale inspection - 456 Maple'] },
        { title: 'In Progress', color: '#fdab3d', items: ['Fire safety check - 789 Pine'] },
        { title: 'Completed', color: '#00c875', items: ['Move-out inspection - 321 Elm'] },
      ],
    },
  ],

  logistics: [
    {
      id: 'shipment-tracking',
      name: 'Shipment Tracking',
      description: 'Track shipments from origin to destination',
      columns: [
        { type: 'status', title: 'Status' },
        { type: 'person', title: 'Coordinator' },
        { type: 'date', title: 'ETA' },
        { type: 'text', title: 'Origin → Destination' },
        { type: 'numbers', title: 'Weight (kg)' },
        { type: 'priority', title: 'Priority' },
      ],
      groups: [
        { title: 'In Transit', color: '#fdab3d', items: ['SHP-1001 NYC → LA', 'SHP-1002 Chicago → Miami', 'SHP-1003 Seattle → Denver'] },
        { title: 'At Warehouse', color: '#4caf82', items: ['SHP-1004 Sorting - Bay 3', 'SHP-1005 Awaiting pickup'] },
        { title: 'Delivered', color: '#00c875', items: ['SHP-0998 Boston → DC', 'SHP-0999 Dallas → Houston'] },
        { title: 'Delayed', color: '#e2445c', items: ['SHP-1000 Weather delay - Atlanta'] },
      ],
    },
    {
      id: 'warehouse-ops',
      name: 'Warehouse Operations',
      description: 'Manage warehouse inventory and operations',
      columns: [
        { type: 'status', title: 'Status' },
        { type: 'person', title: 'Supervisor' },
        { type: 'numbers', title: 'Quantity' },
        { type: 'text', title: 'Location' },
        { type: 'date', title: 'Date' },
      ],
      groups: [
        { title: 'Receiving', color: '#4caf82', items: ['Inbound shipment - Dock A', 'Quality check - Batch 445'] },
        { title: 'Storage', color: '#81c784', items: ['Reorganize Zone C', 'Inventory count - Electronics'] },
        { title: 'Outbound', color: '#fdab3d', items: ['Pick & pack - Order 2201', 'Loading - Truck T-15'] },
      ],
    },
    {
      id: 'fleet-management',
      name: 'Fleet Management',
      description: 'Track vehicles, maintenance, and driver assignments',
      columns: [
        { type: 'status', title: 'Status' },
        { type: 'person', title: 'Driver' },
        { type: 'date', title: 'Next Service' },
        { type: 'numbers', title: 'Mileage' },
        { type: 'text', title: 'Vehicle ID' },
      ],
      groups: [
        { title: 'Active Fleet', color: '#00c875', items: ['TRK-01 - Route A (On road)', 'TRK-02 - Route B (On road)', 'VAN-05 - Local deliveries'] },
        { title: 'Maintenance', color: '#fdab3d', items: ['TRK-03 - Oil change due', 'TRK-04 - Tire replacement'] },
        { title: 'Out of Service', color: '#e2445c', items: ['VAN-03 - Engine repair'] },
      ],
    },
    {
      id: 'delivery-scheduling',
      name: 'Delivery Scheduling',
      description: 'Plan and schedule deliveries',
      columns: [
        { type: 'status', title: 'Status' },
        { type: 'person', title: 'Driver' },
        { type: 'date', title: 'Delivery Date' },
        { type: 'text', title: 'Customer' },
        { type: 'priority', title: 'Priority' },
        { type: 'text', title: 'Time Window' },
      ],
      groups: [
        { title: 'Today', color: '#e2445c', items: ['DEL-301 Express - AcmeCorp', 'DEL-302 Standard - GlobalTech'] },
        { title: 'Tomorrow', color: '#fdab3d', items: ['DEL-303 Bulk - MegaStore', 'DEL-304 Fragile - ArtGallery'] },
        { title: 'This Week', color: '#4caf82', items: ['DEL-305 Scheduled - HealthCo', 'DEL-306 Recurring - FoodMart'] },
      ],
    },
  ],

  municipal: [
    {
      id: 'permit-processing',
      name: 'Permit Processing',
      description: 'Track building permits and approvals',
      columns: [
        { type: 'status', title: 'Status' },
        { type: 'person', title: 'Reviewer' },
        { type: 'date', title: 'Filed Date' },
        { type: 'text', title: 'Applicant' },
        { type: 'text', title: 'Permit Type' },
        { type: 'priority', title: 'Priority' },
      ],
      groups: [
        { title: 'New Applications', color: '#4caf82', items: ['Building permit - 100 Main St', 'Renovation permit - City Library', 'Sign permit - Downtown Mall'] },
        { title: 'Under Review', color: '#fdab3d', items: ['Zoning variance - Industrial Park', 'Environmental review - Riverside'] },
        { title: 'Approved', color: '#00c875', items: ['Demolition permit - Old Warehouse'] },
        { title: 'Denied', color: '#e2445c', items: [] },
      ],
    },
    {
      id: 'public-works',
      name: 'Public Works Projects',
      description: 'Track infrastructure and public works projects',
      columns: [
        { type: 'status', title: 'Phase' },
        { type: 'person', title: 'Project Lead' },
        { type: 'date', title: 'Target Completion' },
        { type: 'numbers', title: 'Budget ($)' },
        { type: 'text', title: 'Location' },
        { type: 'priority', title: 'Priority' },
      ],
      groups: [
        { title: 'Planning', color: '#4caf82', items: ['New playground - Central Park', 'Bridge repair - River Rd'] },
        { title: 'Construction', color: '#fdab3d', items: ['Road resurfacing - Highway 9', 'Water main replacement - Oak St'] },
        { title: 'Completed', color: '#00c875', items: ['Sidewalk repair - Elm District'] },
      ],
    },
    {
      id: 'citizen-requests',
      name: 'Citizen Requests',
      description: 'Manage citizen service requests and complaints',
      columns: [
        { type: 'status', title: 'Status' },
        { type: 'person', title: 'Assigned To' },
        { type: 'date', title: 'Received' },
        { type: 'priority', title: 'Urgency' },
        { type: 'text', title: 'Category' },
        { type: 'text', title: 'Description' },
      ],
      groups: [
        { title: 'Open Requests', color: '#e2445c', items: ['Pothole report - 5th Avenue', 'Street light out - Park Blvd', 'Noise complaint - Industrial Zone'] },
        { title: 'In Progress', color: '#fdab3d', items: ['Tree removal request - Elm St', 'Graffiti cleanup - Downtown'] },
        { title: 'Resolved', color: '#00c875', items: ['Water pressure issue - Oak Lane'] },
      ],
    },
    {
      id: 'budget-tracker',
      name: 'Budget Tracker',
      description: 'Track departmental budgets and expenditures',
      columns: [
        { type: 'status', title: 'Status' },
        { type: 'person', title: 'Department Head' },
        { type: 'numbers', title: 'Allocated ($)' },
        { type: 'numbers', title: 'Spent ($)' },
        { type: 'text', title: 'Department' },
        { type: 'date', title: 'Fiscal Year End' },
      ],
      groups: [
        { title: 'On Budget', color: '#00c875', items: ['Parks & Recreation', 'Public Library', 'Fire Department'] },
        { title: 'Over Budget', color: '#e2445c', items: ['Road Maintenance', 'Emergency Services'] },
        { title: 'Under Review', color: '#fdab3d', items: ['IT Department', 'Water Utility'] },
      ],
    },
  ],

  'hedge-funds': [
    {
      id: 'portfolio-tracker',
      name: 'Portfolio Tracker',
      description: 'Track portfolio positions and performance',
      columns: [
        { type: 'status', title: 'Action' },
        { type: 'person', title: 'Analyst' },
        { type: 'numbers', title: 'Position ($M)' },
        { type: 'numbers', title: 'P&L ($K)' },
        { type: 'text', title: 'Ticker / Asset' },
        { type: 'priority', title: 'Conviction' },
      ],
      groups: [
        { title: 'Long Positions', color: '#00c875', items: ['AAPL - Tech Core', 'NVDA - AI Thesis', 'AMZN - E-Commerce'] },
        { title: 'Short Positions', color: '#e2445c', items: ['XYZ Corp - Overvalued', 'ABC Inc - Declining'] },
        { title: 'Watchlist', color: '#fdab3d', items: ['MSFT - Earnings play', 'TSLA - Volatility trade', 'BTC - Crypto allocation'] },
      ],
    },
    {
      id: 'trade-execution',
      name: 'Trade Execution',
      description: 'Manage trade orders and execution',
      columns: [
        { type: 'status', title: 'Status' },
        { type: 'person', title: 'Trader' },
        { type: 'date', title: 'Trade Date' },
        { type: 'numbers', title: 'Notional ($M)' },
        { type: 'text', title: 'Instrument' },
        { type: 'text', title: 'Strategy' },
      ],
      groups: [
        { title: 'Pending Orders', color: '#fdab3d', items: ['Buy 10K shares NVDA', 'Sell 5K shares ABC', 'Options spread - SPY'] },
        { title: 'Executed Today', color: '#00c875', items: ['Bought AAPL calls', 'Sold XYZ puts'] },
        { title: 'Settled', color: '#4caf82', items: ['AMZN block trade', 'Bond allocation'] },
      ],
    },
    {
      id: 'due-diligence',
      name: 'Due Diligence',
      description: 'Track investment research and due diligence',
      columns: [
        { type: 'status', title: 'Stage' },
        { type: 'person', title: 'Lead Analyst' },
        { type: 'date', title: 'Deadline' },
        { type: 'priority', title: 'Conviction' },
        { type: 'text', title: 'Thesis' },
      ],
      groups: [
        { title: 'Initial Screening', color: '#4caf82', items: ['BioTech startup - Gene therapy', 'FinTech - Payment platform', 'Clean Energy - Solar manufacturer'] },
        { title: 'Deep Dive', color: '#fdab3d', items: ['AI Infrastructure play', 'Healthcare REIT analysis'] },
        { title: 'Investment Committee', color: '#81c784', items: ['Quantum computing thesis'] },
      ],
    },
    {
      id: 'fund-compliance',
      name: 'Fund Compliance',
      description: 'Regulatory compliance and reporting',
      columns: [
        { type: 'status', title: 'Status' },
        { type: 'person', title: 'Compliance Officer' },
        { type: 'date', title: 'Deadline' },
        { type: 'priority', title: 'Priority' },
        { type: 'text', title: 'Filing Type' },
      ],
      groups: [
        { title: 'Upcoming Filings', color: '#fdab3d', items: ['Form PF - Quarterly', '13F Filing', 'ADV Amendment'] },
        { title: 'In Progress', color: '#4caf82', items: ['Investor letter - Q4', 'NAV calculation review'] },
        { title: 'Completed', color: '#00c875', items: ['Annual audit', 'Tax K-1 distribution'] },
      ],
    },
  ],

  travel: [
    {
      id: 'trip-planning',
      name: 'Trip Planning',
      description: 'Plan and organize trips end-to-end',
      columns: [
        { type: 'status', title: 'Status' },
        { type: 'person', title: 'Travel Agent' },
        { type: 'date', title: 'Travel Date' },
        { type: 'numbers', title: 'Budget ($)' },
        { type: 'text', title: 'Destination' },
        { type: 'priority', title: 'Priority' },
      ],
      groups: [
        { title: 'Planning', color: '#4caf82', items: ['Tokyo corporate retreat', 'Paris client meeting', 'Bali team offsite'] },
        { title: 'Booked', color: '#00c875', items: ['London conference - March', 'NYC workshop - April'] },
        { title: 'Completed', color: '#81c784', items: ['Dubai summit - January'] },
      ],
    },
    {
      id: 'booking-management',
      name: 'Booking Management',
      description: 'Track all reservations and bookings',
      columns: [
        { type: 'status', title: 'Status' },
        { type: 'person', title: 'Traveler' },
        { type: 'date', title: 'Check-in' },
        { type: 'date', title: 'Check-out' },
        { type: 'text', title: 'Booking Type' },
        { type: 'numbers', title: 'Cost ($)' },
      ],
      groups: [
        { title: 'Flights', color: '#4caf82', items: ['JFK → NRT - March 15', 'CDG → LHR - March 22', 'SFO → HNL - April 1'] },
        { title: 'Hotels', color: '#81c784', items: ['Hilton Tokyo - 5 nights', 'Marriott Paris - 3 nights'] },
        { title: 'Car Rentals', color: '#fdab3d', items: ['Hertz - LA Airport pickup', 'Enterprise - London Heathrow'] },
      ],
    },
    {
      id: 'vendor-relations',
      name: 'Vendor Relations',
      description: 'Manage relationships with travel vendors and partners',
      columns: [
        { type: 'status', title: 'Status' },
        { type: 'person', title: 'Account Manager' },
        { type: 'text', title: 'Vendor' },
        { type: 'date', title: 'Contract Renewal' },
        { type: 'numbers', title: 'Annual Volume ($)' },
        { type: 'priority', title: 'Tier' },
      ],
      groups: [
        { title: 'Airlines', color: '#4caf82', items: ['Delta - Preferred partner', 'United - Corporate rate', 'Emirates - Premium contract'] },
        { title: 'Hotels', color: '#81c784', items: ['Marriott - Global chain deal', 'Hilton - Group rates'] },
        { title: 'Ground Transport', color: '#fdab3d', items: ['Hertz - Fleet discount', 'Uber Business - API integration'] },
      ],
    },
    {
      id: 'itinerary-builder',
      name: 'Itinerary Builder',
      description: 'Build detailed day-by-day itineraries',
      columns: [
        { type: 'status', title: 'Confirmed' },
        { type: 'date', title: 'Date' },
        { type: 'text', title: 'Activity' },
        { type: 'text', title: 'Location' },
        { type: 'text', title: 'Time' },
        { type: 'person', title: 'Contact' },
      ],
      groups: [
        { title: 'Day 1 - Arrival', color: '#4caf82', items: ['Airport transfer', 'Hotel check-in', 'Welcome dinner'] },
        { title: 'Day 2 - Meetings', color: '#fdab3d', items: ['Morning keynote', 'Lunch with partners', 'Afternoon workshops'] },
        { title: 'Day 3 - Activities', color: '#81c784', items: ['City tour', 'Team building event', 'Farewell dinner'] },
      ],
    },
  ],
};

export function createBoardFromBlock(block) {
  return {
    id: uuid(),
    name: block.name,
    favorite: false,
    columns: block.columns.map((col) => ({
      id: uuid(),
      type: col.type,
      title: col.title,
      width: col.type === 'text' ? 200 : col.type === 'numbers' ? 120 : 140,
    })),
    groups: block.groups.map((g) => ({
      id: uuid(),
      title: g.title,
      color: g.color,
      collapsed: false,
      items: g.items.map((name) => ({
        id: uuid(),
        name,
        values: {},
      })),
    })),
  };
}
