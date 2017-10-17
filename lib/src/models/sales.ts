import * as date from '../utils/date';
import ESIndex from './esIndex';

class Sales extends ESIndex {
    index = 'sales';

    headers = [
        'date',
        'store',
        'item_number',
        'item_flag',
        'sales_type',
        'sales_description',
        'quantity',
        'sales',
    ];

    fields = [
        {
            name: 'date',
            type: 'date',
            format: 'MM/dd/yyyy',
            transform: (row: any) => date.toMMDDYYYY(new Date(row['date'])),
        }, {
            name: 'item_number',
            type: 'keyword',
            transform: (row: any) => row['item_number'],
        }, {
            name: 'store',
            type: 'keyword',
            transform: (row: any) => parseInt(row['store'], 10).toString(),
        }, {
            name: 'item_flag',
            type: 'keyword',
            transform: (row: any) => row['item_flag'],
        }, {
            name: 'sales_type',
            type: 'keyword',
            transform: (row: any) => row['sales_type'],
        }, {
            name: 'sales_description',
            type: 'keyword',
            transform: (row: any) => row['sales_description'],
        }, {
            name: 'quantity',
            type: 'integer',
            transform: (row: any) => parseInt(row['quantity'], 10),
        }, {
            name: 'sales',
            type: 'double',
            transform: (row: any) => parseFloat(row['sales']),
        },
    ];

    computeKey = (data: any) => `${data['date']}.${data['item_number']}.${data['store']}.${data['sales_type']}`;
}

export default new Sales();
