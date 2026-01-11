namespace s4extension;

// This is our Business Partner table definition
entity BusinessPartners {
    key ID          : String(10);    // Unique identifier from S/4
        FirstName   : String(100);   // First name
        LastName    : String(100);   // Last name
        Email       : String(150);   // Email address
        Phone       : String(30);    // Phone number
        Country     : String(3);     // Country code (e.g., USA, IND)
        PartnerType : String(20);    // Customer or Supplier
        CreatedAt   : Timestamp;     // When we received this
        ModifiedAt  : Timestamp;     // Last updated time
}