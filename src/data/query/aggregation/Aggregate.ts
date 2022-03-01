export interface Aggregate {
    name: string,
    initial: any,
    reducer: (acc:any, data: any) => any,
    final: (acc: any) => any
}