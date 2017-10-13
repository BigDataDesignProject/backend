interface Field {
    name: string;
    type: string;
    format?: string;
    transform?: (data: any) => any;
}

export default Field;
