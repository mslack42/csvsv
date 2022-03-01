export interface Column {
    header: string,
    cellFunction: ((data:any) => any)
}