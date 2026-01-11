const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
    
    // Get reference to our entity
    const { BusinessPartners } = this.entities;

    /**
     * Custom Action: Receive Business Partner from S/4HANA
     * This is our INBOUND API
     */
    this.on('receiveBusinessPartner', async (req) => {
        try {
            // Extract data from the request
            const incomingData = req.data;

            console.log('📥 Received Business Partner from S/4HANA:', incomingData);

            // Prepare the data for our database
            const businessPartner = {
                ID: incomingData.ID,
                FirstName: incomingData.FirstName,
                LastName: incomingData.LastName,
                Email: incomingData.Email,
                Phone: incomingData.Phone,
                Country: incomingData.Country,
                PartnerType: incomingData.PartnerType,
                CreatedAt: new Date().toISOString(),
                ModifiedAt: new Date().toISOString()
            };

            // Check if this Business Partner already exists
            const existing = await SELECT.one.from(BusinessPartners).where({ ID: incomingData.ID });

            if (existing) {
                // UPDATE existing record
                await UPDATE(BusinessPartners)
                    .set({ 
                        ...businessPartner,
                        CreatedAt: existing.CreatedAt  // Keep original creation time
                    })
                    .where({ ID: incomingData.ID });

                console.log('✅ Updated existing Business Partner:', incomingData.ID);
                return { message: 'Business Partner updated successfully', ID: incomingData.ID };

            } else {
                // INSERT new record
                await INSERT.into(BusinessPartners).entries(businessPartner);

                console.log('✅ Created new Business Partner:', incomingData.ID);
                return { message: 'Business Partner created successfully', ID: incomingData.ID };
            }

        } catch (error) {
            console.error('❌ Error processing Business Partner:', error);
            req.error(500, `Failed to process Business Partner: ${error.message}`);
        }
    });

    /**
     * Custom READ handler: Add filtering capabilities
     * Example: Get only Customers from India
     */
    this.before('READ', BusinessPartners, async (req) => {
        console.log('🔍 Reading Business Partners with filters:', req.query);
    });

    this.after('READ', BusinessPartners, (data) => {
        console.log(`📤 Returning ${Array.isArray(data) ? data.length : 1} Business Partner(s)`);
    });
});