import { IProvider } from "./IProvider";

export class MongoProvider implements IProvider {
    generate(statements: any): string {
        console.log(statements);
        return "This is a test result";
    }

}