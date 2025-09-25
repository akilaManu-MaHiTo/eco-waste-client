export const targetSettingsData = [
    {
        id: "doc_1",
        division: "Cutting",
        category: "Energy",
        department: "Production",
        source: "Electricity",
        baseLineConsumption: "15000 kWh",
        ghcEmmision: "12 tons",
        problems: "High energy usage during idle time",
        action: "Install motion sensors",
        possibilityCategory: "High",
        opportunity: "Reduce idle energy usage",
        implementationCost: "2000 USD",
        expectedSavings: "3000 USD/year",
        targetGhcRedution: "3 tons",
        costSaving: "1000 USD/year",
        implementationTimeline: new Date("2025-05-01"),
        paybackPeriod: "2 years",
        projectLifespan: "5 years",
        approver: {
            id: "user456",
            name: "John Approver",
            email: "john.approver@example.com"
        },
        responsible: {
            id: "user456",
            name: "John Approver",
            email: "john.approver@example.com"
        },
        status: "complete",
        documents: [
            {
                fileName: "water_saving_plan.pdf",
                imageUrl: "https://example.com/water_saving_plan.pdf"
            }
        ],
    },
    
];
