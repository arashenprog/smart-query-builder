export interface IProvider {
    generate(statements: any): string;
}