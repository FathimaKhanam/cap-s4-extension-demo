#  SAP CAP Extension for S/4HANA
# 📋 Project Overview
Project Name: cap-s4-extension-demo
Purpose: Build a side-by-side extension for S/4HANA to receive and manage Business Partner data
Technology Stack: SAP CAP, Node.js, SQLite, OData V4
Business Scenario: Receive Business Partner master data from S/4HANA system and expose it via REST API
________________________________________
📂 Project Structure

![Project Structure](images/s1.png)

________________________________________
# 🛠️ Step-by-Step Development Process<br>
# STEP 1: Prerequisites Installation<br>
1.1 Install Node.js<br>
What: JavaScript runtime environment<br>
Why: Required to run SAP CAP applications<br>
Version: 20.x or higher<br>
Installation:<br>
1.	Download from: https://nodejs.org/
2.	Choose LTS (Long Term Support) version
3.	Run installer with default settings
4.	Restart computer after installation
Verification:<br>
node --version<br>

1.2 Install SAP CDS Development Kit<br>
What: SAP Cloud Application Programming Model tools<br>
Why: Provides cds command and development tools<br>
Installation:<br>
npm install -g @sap/cds-dk<br>
Verification:<br>
cds --version<br>
Expected output: Shows CDS version information<br>
![CDS Installation](images/s2.png)

# STEP 2: Create New CAP Project<br>
2.1 Create Project<br>
Open Terminal/Command Prompt:<br>
Navigate to your workspace (e.g., Desktop)<br>
cd Desktop<br>

Create new CAP project<br>
cds init cap-s4-extension-demo<br>

Navigate into project folder<br>
cd cap-s4-extension-demo<br>
What Happened:<br>
•	Created project folder structure<br>
•	Generated basic files (package.json, README.md)<br>
•	Created empty db/ and srv/ folders<br>

![Create Project](images/s3.png)

2.2 Open in VS Code<br>
Open project in VS Code<br>
code .<br>
What You See:<br>
•	File explorer with project structure<br>
•	Empty db/ and srv/ folders<br>
•	package.json file<br>

# STEP 3: Define Data Model
3.1 Create Schema File<br>
File: db/schema.cds<br>
Purpose: Define Business Partner entity structure<br>
Create the file:<br>
1.	Right-click on db folder
2.	Select "New File"
3.	Name it: schema.cds
Add this content:<br>
namespace s4extension;<br>

/**<br>
 * Business Partner Entity<br>
 * Stores master data received from S/4HANA<br>
 */<br>
entity BusinessPartners {<br>
    key ID          : String(10);      // Unique Business Partner ID<br>
        FirstName   : String(100);     // First name<br>
        LastName    : String(100);     // Last name<br>
        Email       : String(150);     // Email address<br>
        Phone       : String(30);      // Phone number<br>
        Country     : String(3);       // Country code (ISO 3166-1 alpha-3)<br>
        PartnerType : String(20);      // Customer or Supplier<br>
        CreatedAt   : Timestamp;       // Record creation time<br>
        ModifiedAt  : Timestamp;       // Last modification time<br>
}<br>
Understanding the Code:<br>
Element     -   Explanation<br>
namespace   -   Logical grouping for entities (like a package)<br>
entity      -   Defines a database table<br>
key         -   Primary key field<br>
String(100)	-   Text field with max 100 characters<br>
Timestamp	-   Date and time field<br>
Save the file: Ctrl+S<br>
![Code](images/s4.png)

# STEP 4: Define Service API
4.1 Create Service Definition
File: srv/service.cds
Purpose: Expose OData API and define custom actions
Create the file:
1.	Right-click on srv folder
2.	Select "New File"
3.	Name it: service.cds
Add this content:
using s4extension from '../db/schema';

/**
 * Business Partner Service
 * Provides OData API and inbound integration endpoint
 */
@impl: './business-partner-handler.js'
service BusinessPartnerService {
    
    /**
     * OData Entity: Read-only access to Business Partners
     * External systems can query but not directly modify
     */
    @readonly 
    entity BusinessPartners as projection on s4extension.BusinessPartners;

    /**
     * Custom Action: Inbound API for S/4HANA
     * This is the endpoint S/4HANA calls to send Business Partner data
     * 
     * Input: Business Partner details as parameters
     * Output: Success message and ID
     */
    action receiveBusinessPartner(
        ID          : String,
        FirstName   : String,
        LastName    : String,
        Email       : String,
        Phone       : String,
        Country     : String,
        PartnerType : String
    ) returns {
        message : String;
        ID      : String;
    };
}
Understanding the Code:
Element	Explanation
using	Import entities from schema
@impl	Links service to handler JavaScript file
service	Creates an OData service
@readonly	Users can only read, not create/update/delete
projection	View of the entity
action	Custom operation (like a function call)
returns	Defines output structure
This Creates Endpoints:
•	GET /odata/v4/business-partner/BusinessPartners - Read all
•	GET /odata/v4/business-partner/BusinessPartners('BP001') - Read one
•	POST /odata/v4/business-partner/receiveBusinessPartner - Inbound API
Save the file: Ctrl+S
![Define Service](images/s5.png)