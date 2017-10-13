import { Client } from 'elasticsearch';

import { createClient } from '../connections/elasticsearch';
import Field from '../interfaces/field';

abstract class ESIndex {
    private client: Client;
    private type = 'document';

    protected abstract index: string;
    protected abstract fields: Field[];
    protected abstract computeKey: (data: any) => string;

    public async initialize () {
        this.client = createClient();

        if (!await this.indexExists()) {
            await this.createIndex();
        }

        if (!await this.mappingsExists()) {
            await this.putMappings();
        }
    }

    private async putMappings() {
        await this.client.indices.putMapping({
            index: this.index,
            type: this.type,
            body: { properties: this.getMappings() },
        });
    }

    private async createIndex() {
        await this.client.indices.create({
            index: this.index,
        });
    }

    private async indexExists() {
        return await this.client.indices.exists({
            index: this.index,
        });
    }

    private async deleteIndex() {
        await this.client.indices.delete({
            index: this.index,
        });
    }

    private async mappingsExists() {
        return await this.client.indices.existsType({
            index: this.index,
            type: this.type,
        });
    }

    private getMappings () {
        return this.fields.reduce((mapping, field) => {
            mapping[field.name] = {
                type: field.type,
                format: field.format,
            };

            return mapping;
        }, {} as {[key: string]: any});
    }
}

export default ESIndex;
