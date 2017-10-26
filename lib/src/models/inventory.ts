import * as date from '../utils/date';
import ESIndex from './esIndex';

class Inventory extends ESIndex {
    index = 'inventory';

    headers = [
        'store',
        'item_number',
        'item_flag',
        'date',
        'inventory',
        'pos_quantity',
        'pos_sales',
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
            name: 'inventory',
            type: 'integer',
            transform: (row: any) => parseInt(row['inventory'], 10),
        },
    ];

    computeKey = (data: any) => `${data['date']}.${data['item_number']}.${data['store']}`;
}

export default new Inventory();
