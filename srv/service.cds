using s4extension from '../db/schema';

@impl: './business-partner-handler.js'
service BusinessPartnerService {
    
    // OData entity exposure
    @readonly entity BusinessPartners as projection on s4extension.BusinessPartners;

    /**
     * Custom Action: Inbound API for S/4HANA
     * This is what S/4HANA will call to send us data
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