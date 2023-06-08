const pseudoDb ={
    origins: [
        EBS = {
            databaseName: "Mirror2EBS",
            polyBaseLocation: ["OracleEBS", "GOLD.APPS.XXFR_"],
            tableConvention: (externalName) => externalName.toLowerCase(),
            mergeConvention: (externalName, type) => `SP_FRISIA_MRG_${type}_${externalName.toUpperCase()}`

            
        },
        SIF = {
            databaseName: "Mirror1SIF",
            polyBaseLocation: ["OracleBCAP", "BCAP.ORASQL."],
            tableConvention: (externalName) => "sif_" + externalName.toLowerCase(),
            mergeConvention: (externalName, type) => `SP_FRISIA_MRG_SIF_${type}_${externalName.toUpperCase()}`
        }
    ],
    general: {
        
    }
}

export default pseudoDb;