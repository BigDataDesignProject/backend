import ESIndex from './esIndex';

class Sales extends ESIndex {
    index = 'sales';

    fields = [
        {
            name: 'date',
            type: 'date',
            format: 'MM/dd/yyyy',
        }, {
            name: 'item_number',
            type: 'keyword',
        },
    ];

    computeKey = (data: any) => data.date;
}

export default new Sales();
