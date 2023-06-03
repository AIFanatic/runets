const fs = require('fs');

export class Parser {
    public static requestFile(location: string): Array<any> {
        try {
            const file = fs.readFileSync(`./dist/${location}`);
            const data = JSON.parse(file);
            return data;
            
        } catch (error) {
            throw Error(`Could not process file at ${location}.`);
        }
    }

    // Type this?
    public static createHashmap(data: Array<any>, key: string): Map<number, any> {
        const map: Map<number, any> = new Map();

        for (let entry of data) {
            if (!entry[key]) {
                throw Error("Key not found in data");
            }

            map.set(entry[key], entry);
        }

        return map;
    }
}