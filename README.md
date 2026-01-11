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
4.1 Create Service Definition <br>
File: srv/service.cds <br>
Purpose: Expose OData API and define custom actions <br>
Create the file: <br>
1.	Right-click on srv folder <br>
2.	Select "New File" <br>
3.	Name it: service.cds <br>
Add this content: <br>
using s4extension from '../db/schema'; <br>

Understanding the Code:<br>
Element     -   Explanation<br>
using   	-   Import entities from schema<br>
@impl	    -   Links service to handler JavaScript file<br>
service	    -   Creates an OData service<br>
@readonly   -	Users can only read, not create/update/delete<br>
projection  -	View of the entity<br>
action      -	Custom operation (like a function call)<br>
returns     -	Defines output structure<br>
This Creates Endpoints:<br>
•	GET /odata/v4/business-partner/BusinessPartners - Read all<br>
•	GET /odata/v4/business-partner/BusinessPartners('BP001') - Read one<br>
•	POST /odata/v4/business-partner/receiveBusinessPartner - Inbound API<br>
Save the file: Ctrl+S<br>
![Define Service](images/s5.png)

# STEP 5: Implement Business Logic
## 5.1 Create Handler File<br>

File: `srv/business-partner-handler.js`<br>
Purpose: Implement custom action logic<br>

Create the file:<br>
1. Right-click on `srv` folder<br>
2. Select "New File"<br>
3. Name it: `business-partner-handler.js`<br>

Add this content:<br>
![Implement Business Logic](images/s6.png)
![Implement Business Logic](images/s7.png)
![Implement Business Logic](images/s8.png)
Understanding the Code:<br>

Key Concepts:<br>

1. Event Handlers:<br>
- `this.on('receiveBusinessPartner')` - Handles custom action<br>
- `this.before('READ')` - Runs before read operations<br>
- `this.after('READ')` - Runs after read operations<br>

2. CDS Query Language:<br>
- `SELECT.one.from()` - Query single record<br>
- `UPDATE().set().where()` - Update existing record<br>
- `INSERT.into().entries()` - Insert new record<br>

3. Upsert Pattern:<br>
- Check if record exists<br>
- If yes → Update<br>
- If no → Create<br>
- Common in integration scenarios<br>

4. Error Handling:<br>
- Try-catch block<br>
- Detailed error logging<br>
- Proper HTTP error responses<br>

Save the file: **Ctrl + S**<br>

# STEP 6: Configure Project Dependencies
## 6.1 Update package.json
File: package.json<br>
Purpose: Define project dependencies and database configuration<br>
Replace entire content with:<br>

Understanding the Configuration:<br>

Section — Explanation<br>
engines — Minimum Node.js version required<br>
dependencies — Runtime libraries (CAP, Express)<br>
devDependencies — Development-only libraries (SQLite)<br>
scripts — Command shortcuts<br>
cds.requires.db — Database configuration<br>

Key Configuration:<br>
• `"kind": "sqlite"` — Use SQLite database<br>
• `"database": "businesspartners.db"` — Database file name<br>
• This makes data persistent across server restarts<br>

Save the file: **Ctrl + S**<br>
![Project Dependency](images/s9.png)

# STEP 7: Install Dependencies<br>

## 7.1 Install Node Modules<br>

Open Terminal in VS Code:<br>
• Press **Ctrl + `** (backtick key)<br>
• Or: Menu → Terminal → New Terminal<br>

Run installation command:<br>

bash
npm install

![Node Modules](images/s10.png)

# STEP 8: Deploy Database Schema<br>

## 8.1 Create Database Tables<br>

Purpose: Transform CDS entities into actual database tables<br>

Run deployment command:<br>

bash
cds deploy --to sqlite:businesspartners.db


![Database Tables](images/s11.png)

Verify Database Creation:<br>
Check that businesspartners.db file exists in project root:<br>

![Verify DB](images/s12.png)

## 8.2 Verify Database Structure<br>

Optional: Check created tables<br>

Using VS Code Extension<br>

1. Ensure "SQLite Viewer" extension is installed<br>
2. Click on `businesspartners.db` file in VS Code<br>
3. Extension opens showing:<br>
&nbsp;&nbsp;o List of tables<br>
&nbsp;&nbsp;o Table structures<br>
&nbsp;&nbsp;o Empty data grids<br>

![Verify DB Structure](images/s13.png)
![Verify DB Structure](images/s14.png)

# STEP 9: Start the Application<br>

## 9.1 Start Development Server<br>

Run server command:<br>
cds watch<br>

What This Does:<br>

1. Compiles CDS models<br>
2. Connects to database<br>
3. Loads handler implementations<br>
4. Generates OData services<br>
5. Starts Express web server on port 4004<br>
6. Watches for file changes (auto-reload)<br>

Expected Output:<br>

![Dev Server](images/s15.png)

## 9.2 Verify Server is Running<br>
Open browser and navigate to:<br>
http://localhost:4004<br>
Expected Result:<br>
Welcome page showing:<br>
Welcome to cds.services<br>
<br>
BusinessPartnerService<br>
  /odata/v4/business-partner<br>

![Verify Server](images/s16.png)
Test Service Metadata:<br>
Navigate to:<br>
http://localhost:4004/odata/v4/business-partner/$metadata<br>
Expected Result:<br>
![Test Service](images/s17.png)

STEP 10: Create Test File<br>
10.1 Create HTTP Test Requests<br>
File: test-requests.http<br>
Purpose: Test API endpoints using REST Client extension<br>
Create file in project root:<br>
1. Right-click in Explorer (root level)<br>
2. New File<br>
3. Name: test-requests.http<br>
Add this content: &<br>
Testing the Application<br>
1. Test: Send Business Partner from S/4HANA (Create New)<br>
POST http://localhost:4004/odata/v4/business-partner/receiveBusinessPartner<br>
Content-Type: application/json<br>
<br>
{<br>
  "ID": "BP001",<br>
  "FirstName": "Rajesh",<br>
  "LastName": "Kumar",<br>
  "Email": "rajesh.kumar@example.com",<br>
  "Phone": "+91-9876543210",<br>
  "Country": "IND",<br>
  "PartnerType": "Customer"<br>
}<br>


![Create Test](images/s18.png)
![Create Test](images/s19.png)

2. Test: Send Another Business Partner<br>
POST http://localhost:4004/odata/v4/business-partner/receiveBusinessPartner<br>
Content-Type: application/json<br>
{<br>
  "ID": "BP002",<br>
  "FirstName": "Sarah",<br>
  "LastName": "Johnson",<br>
  "Email": "sarah.j@example.com",<br>
  "Phone": "+1-555-0123",<br>
  "Country": "USA",<br>
  "PartnerType": "Supplier"<br>
}<br>

![Create Test](images/s20.png)
![Create Test](images/s21.png)

3. Test: Send Indian Supplier<br>
POST http://localhost:4004/odata/v4/business-partner/receiveBusinessPartner<br>
Content-Type: application/json<br>
<br>
{<br>
  "ID": "BP003",<br>
  "FirstName": "Priya",<br>
  "LastName": "Sharma",<br>
  "Email": "priya.sharma@example.com",<br>
  "Phone": "+91-9988776655",<br>
  "Country": "IND",<br>
  "PartnerType": "Supplier"<br>
}<br>

![Create Test](images/s22.png)
![Create Test](images/s23.png)

4. Test: Update Existing Business Partner (send BP001 again with changes)<br>
POST http://localhost:4004/odata/v4/business-partner/receiveBusinessPartner<br>
Content-Type: application/json<br>
<br>
{<br>
  "ID": "BP001",<br>
  "FirstName": "Rajesh",<br>
  "LastName": "Kumar Updated",<br>
  "Email": "rajesh.new@example.com",<br>
  "Phone": "+91-9876543210",<br>
  "Country": "IND",<br>
  "PartnerType": "Customer"<br>
}<br>

![Create Test](images/s24.png)
![Create Test](images/s25.png)

READ OPERATIONS - Query the Data<br>
5. Get All Business Partners<br>
GET http://localhost:4004/odata/v4/business-partner/BusinessPartners<br>
<br>

![Create Test](images/s26.png)
6. Get Specific Business Partner by ID<br>
GET http://localhost:4004/odata/v4/business-partner/BusinessPartners('BP001')<br>
<br>

![Create Test](images/s27.png)

7. Filter: Get Only Customers<br>
GET http://localhost:4004/odata/v4/business-partner/BusinessPartners?$filter=PartnerType eq 'Customer'<br>
<br>

![Create Test](images/s28.png)

8. Filter: Get Only Business Partners from India<br>
GET http://localhost:4004/odata/v4/business-partner/BusinessPartners?$filter=Country eq 'IND'<br>
<br>


![Create Test](images/s29.png)
9. Filter: Get Indian Customers Only<br>
GET http://localhost:4004/odata/v4/business-partner/BusinessPartners?$filter=Country eq 'IND' and PartnerType eq 'Customer'<br>
<br>

![Create Test](images/s30.png)

10. Sort: Order by Last Name<br>
GET http://localhost:4004/odata/v4/business-partner/BusinessPartners?$orderby=LastName<br>
<br>

![Create Test](images/s31.png)

11. Sort: Order by Country, then LastName<br>
GET http://localhost:4004/odata/v4/business-partner/BusinessPartners?$orderby=Country,LastName<br>
<br>

![Create Test](images/s32.png)

12. Select: Get Only Specific Fields<br>
GET http://localhost:4004/odata/v4/business-partner/BusinessPartners?$select=ID,FirstName,LastName,Country<br>
<br>

![Create Test](images/s33.png)

13. Top: Get Only First 2 Records<br>
GET http://localhost:4004/odata/v4/business-partner/BusinessPartners?$top=2<br>
<br>

![Create Test](images/s34.png)

14. Count: How Many Business Partners?<br>
GET http://localhost:4004/odata/v4/business-partner/BusinessPartners/$count<br>
<br>

![Create Test](images/s35.png)

15. Complex Query: Indian Customers, sorted by name, only ID and Name<br>
GET http://localhost:4004/odata/v4/business-partner/BusinessPartners?$filter=Country eq 'IND' and PartnerType eq 'Customer'&$orderby=LastName&$select=ID,FirstName,LastName<br>
<br>

![Create Test](images/s36.png)

ERROR TESTING<br>
<br>
16. Test: Missing Required Field (should fail gracefully)<br>
POST http://localhost:4004/odata/v4/business-partner/receiveBusinessPartner<br>
Content-Type: application/json<br>
{<br>
  "ID": "BP999",<br>
  "FirstName": "Test"<br>
}<br>
<br>

![Create Test](images/s37.png)

17. Test: Empty ID (should handle error)<br>
POST http://localhost:4004/odata/v4/business-partner/receiveBusinessPartner<br>
Content-Type: application/json<br>
{<br>
  "ID": "",<br>
  "FirstName": "Test",<br>
  "LastName": "User",<br>
  "Email": "test@example.com",<br>
  "Phone": "+1-555-0000",<br>
  "Country": "USA",<br>
  "PartnerType": "Customer"<br>
}<br>

![Create Test](images/s38.png)


# STEP 12: Verify in Database<br>
12.1 Check Database Directly<br>
Method 1: Using SQLite Viewer Extension<br>
1. Click on businesspartners.db file in VS Code<br>
2. Extension opens showing database structure<br>
3. Click on table: s4extension_BusinessPartners<br>
4. View all records in grid format<br>

![check db](images/s38.png)

# STEP 13: Understanding OData Query Capabilities<br>
13.1 Filter Operations ($filter)<br>
Equals:<br>
$filter=Country eq 'IND'<br>
SQL equivalent: WHERE Country = 'IND'<br>
<br>
Not Equals:<br>
$filter=Country ne 'USA'<br>
SQL equivalent: WHERE Country != 'USA'<br>
<br>
Greater Than (for strings, alphabetically):<br>
$filter=ID gt 'BP002'<br>
SQL equivalent: WHERE ID > 'BP002'<br>
<br>
Multiple Conditions (AND):<br>
$filter=Country eq 'IND' and PartnerType eq 'Customer'<br>
SQL equivalent: WHERE Country = 'IND' AND PartnerType = 'Customer'<br>
<br>
Multiple Conditions (OR):<br>
$filter=Country eq 'IND' or Country eq 'USA'<br>
SQL equivalent: WHERE Country = 'IND' OR Country = 'USA'<br>
<br>
Contains (Substring Search):<br>
$filter=contains(LastName,'Kumar')<br>
SQL equivalent: WHERE LastName LIKE '%Kumar%'<br>
<br>
Starts With:<br>
$filter=startswith(Email,'rajesh')<br>
SQL equivalent: WHERE Email LIKE 'rajesh%'<br>
<br>
Ends With:<br>
$filter=endswith(Email,'example.com')<br>
SQL equivalent: WHERE Email LIKE '%example.com'<br>
<br>
13.2 Sorting ($orderby)<br>
Sort Ascending:<br>
$orderby=LastName<br>
SQL equivalent: ORDER BY LastName ASC<br>
<br>
Sort Descending:<br>
$orderby=LastName desc<br>
SQL equivalent: ORDER BY LastName DESC<br>
<br>
Sort by Multiple Fields:<br>
$orderby=Country,LastName<br>
SQL equivalent: ORDER BY Country ASC, LastName ASC<br>
13.3 Field Selection ($select)<br>
Select Specific Fields:<br>
$select=ID,FirstName,LastName<br>
SQL equivalent: SELECT ID, FirstName, LastName<br>
Benefits:<br>
• Reduces response size<br>
• Faster data transfer<br>
• Better performance<br>
<br>
13.4 Pagination<br>
Limit Results ($top):<br>
$top=5<br>
SQL equivalent: LIMIT 5<br>
Returns first 5 records.<br>
<br>
Skip Records ($skip):<br>
$skip=10<br>
SQL equivalent: OFFSET 10<br>
Skips first 10 records.<br>
<br>
Combine for Pagination:<br>
$skip=10&$top=5<br>
SQL equivalent: LIMIT 5 OFFSET 10<br>
Skips 10, returns next 5 (records 11-15).<br>
Use Case: Building paginated tables<br>
• Page 1: $skip=0&$top=10<br>
• Page 2: $skip=10&$top=10<br>
• Page 3: $skip=20&$top=10<br>
<br>
13.5 Count Records ($count)<br>
Get Total Count:<br>
/BusinessPartners/$count<br>
Response:<br>
3<br>
Just a number, not JSON.<br>
<br>
13.6 Combining Multiple Operations<br>
Complex Query Example:<br>
GET /BusinessPartners<br>
  ?$filter=Country eq 'IND' and PartnerType eq 'Customer'<br>
  &$orderby=LastName desc<br>
  &$select=ID,FirstName,LastName,Email,Phone<br>
  &$top=10<br>
  &$skip=0<br>
This Query:<br>
1. Filters: Indian Customers only<br>
2. Sorts: By LastName descending<br>
3. Selects: Only 5 fields<br>
4. Limits: First 10 results<br>
5. Pagination: Starting from record 0<br>
Use Case: Building a filtered, sorted, paginated table in UI<br>
<br>
STEP 14: How the Application Works<br>
14.1 Request Flow - CREATE Operation<br>
Step-by-Step Flow:<br>
1. HTTP POST Request Arrives<br>
   ↓<br>
   URL: /odata/v4/business-partner/receiveBusinessPartner<br>
   Body: { "ID": "BP001", "FirstName": "Rajesh", ... }<br>
<br>
2. CAP Framework Routes Request<br>
   ↓<br>
   Identifies: receiveBusinessPartner action<br>
   Finds: @impl annotation pointing to handler file<br>
<br>
3. Handler Function Executes<br>
   ↓<br>
   this.on('receiveBusinessPartner', async (req) => { ... })<br>
   Extracts: req.data<br>
<br>
4. Data Preparation<br>
   ↓<br>
   Creates businessPartner object with timestamps<br>
<br>
5. Database Check<br>
   ↓<br>
   SELECT.one.from(BusinessPartners).where({ ID: 'BP001' })<br>
   Result: null (doesn't exist)<br>
<br>
6. Insert Operation<br>
   ↓<br>
   INSERT.into(BusinessPartners).entries(businessPartner)<br>
   SQLite executes: INSERT INTO s4extension_BusinessPartners VALUES (...)<br>
<br>
7. Return Success<br>
   ↓<br>
   Returns: { message: "Business Partner created successfully", ID: "BP001" }<br>
<br>
8. HTTP Response Sent<br>
   ↓<br>
   Status: 200 OK<br>
   Body: { "message": "...", "ID": "BP001" }<br>
<br>
14.2 Request Flow - UPDATE Operation (Upsert)<br>
Step-by-Step Flow:<br>
1. HTTP POST Request Arrives<br>
   ↓<br>
   Same endpoint, but ID already exists: BP001<br>
<br>
2-4. Same as Create Flow<br>
   ↓<br>
<br>
5. Database Check<br>
   ↓<br>
   SELECT.one.from(BusinessPartners).where({ ID: 'BP001' })<br>
   Result: { ID: 'BP001', ... } (exists!)<br>
<br>
6. Update Operation<br>
   ↓<br>
   UPDATE(BusinessPartners)<br>
     .set({ ...businessPartner, CreatedAt: existing.CreatedAt })<br>
     .where({ ID: 'BP001' })<br>
   SQLite executes: UPDATE s4extension_BusinessPartners SET ... WHERE ID = 'BP001'<br>
<br>
7. Return Success<br>
   ↓<br>
