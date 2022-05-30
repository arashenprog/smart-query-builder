import { IProvider } from "./IProvider";

export class JSONProvider implements IProvider {
    generate(statements: any): string {
        return JSON.stringify(statements, null, 4);
    }

}