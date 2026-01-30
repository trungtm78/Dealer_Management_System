export const calculateOTR = (
    vehiclePrice: number,
    registrationFeeRate: number, // percentage, e.g., 10 or 12
    plateFee: number,
    registryFee: number,
    civilInsurance: number,
    roadUseFee: number,
    servicesTotal: number,
    accessoriesTotal: number,
    insuranceTotal: number,
    deposit: number,
    promotionValue: number
) => {
    const registrationFee = Math.round((vehiclePrice * registrationFeeRate) / 100);

    const rollingTotal =
        vehiclePrice +
        registrationFee +
        plateFee +
        registryFee +
        civilInsurance +
        roadUseFee;

    const finalPrice =
        rollingTotal +
        servicesTotal +
        accessoriesTotal +
        insuranceTotal -
        promotionValue;

    const remainingBalance = finalPrice - deposit;

    return {
        registrationFee,
        rollingTotal,
        finalPrice,
        remainingBalance
    };
};
