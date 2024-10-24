export const toSnakeCase = (obj: Record<string, any>): Record<string, any> => {
    if (Array.isArray(obj)) {
        return obj.map(v => toSnakeCase(v));

    } else if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((result: any, key: string) => {
            const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            result[snakeKey] = toSnakeCase(obj[key]);
            return result;
        }, {});
    }
    return obj;
}