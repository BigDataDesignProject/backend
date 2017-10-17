interface Field {
    name: string;
    type: string;
    format?: string;
    transform: (row: any) => any;
}

export default Field;
