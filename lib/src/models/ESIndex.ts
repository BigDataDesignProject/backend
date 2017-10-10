import { Client } from 'elasticsearch';
import { createClient } from '../connections/elasticsearch';

abstract class ESIndex {
    private client: Client;
    private name: string;
    private type: 'document';

    protected abstract computeKey: (obj: any) => string;

}

export default ESIndex;
