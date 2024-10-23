type Reply = {
    success: true,
    data: Record<string, any> | Record<string, any>[],
} | {
    success: false,
    error: string
}

type TableName = "chargingStationType" | "chargingStation" | "connector"
