//test work
const pseudoDb ={
    origins: [
        {
            originName: "EBS",
            databaseName: "Mirror2EBS",
            polyBaseLocation: ["OracleEBS", "GOLD.APPS."],
            tableTemplatePrefix: "",
            tableConvention: (externalName) => externalName.toLowerCase().replace(/xxfr_|vw_|dw_/gi,''),
            mergeTemplatePrefix: "SP_FRISIA_MRG",
            mergeConvention: (externalName) => externalName.toUpperCase().replace(/xxfr_|vw_|dw_/gi,'')

            
        },
        {
            originName: "SIF",
            databaseName: "Mirror1SIF",
            polyBaseLocation: ["OracleBCAP", "BCAP.ORASQL."],
            tableTemplatePrefix: "sif_",
            tableConvention: (externalName) => externalName.toLowerCase(),
            mergeTemplatePrefix: "SP_FRISIA_MRG_SIF",
            mergeConvention: (externalName) => externalName.toUpperCase()
        }
    ],
    general: {
        
    }
}

export default pseudoDb;