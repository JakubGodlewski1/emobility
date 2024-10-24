// Function to convert snake_case string to camelCase
const snakeToCamelString =  (str: string): string=> {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

 const snakeToCamelObj = (obj: Record<string, any> ): Record<string, any>=> {

    const result: Record<string, any> = {}

    for (const key in obj) {
        result[snakeToCamelString(key)] = obj[key];
    }

    return result;
}

export const toCamelCase = (rows: Record<string, any>[] ): Record<string, any>[]=>{
    const result :Record<string, any>[]= []

    rows.forEach(row=>{
        result.push(snakeToCamelObj(row))
    })

    return result
}