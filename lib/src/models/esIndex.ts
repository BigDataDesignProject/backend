import { Client } from 'elasticsearch';
import * as fs from 'fs';

import { createClient } from '../connections/elasticsearch';
import Field from '../interfaces/field';

const csv = require('csv');

abstract class ESIndex {
    private client: Client;
    private type = 'document';

    protected abstract index: string;
    protected abstract headers: string[];
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

    public upload (fileName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const file = fs.createReadStream(fileName);
            const parser = csv.parse({ delimiter: '\t', columns: this.headers });
            const transformer = csv.transform(((row: any) => this.transformRowToDoc(row)));

            let docs: any[] = [];
            const stream = file
            .pipe(parser)
            .pipe(transformer)
            .on('readable', (doc: any) => {
                doc = transformer.read();
                while (doc) {
                    docs.push(doc);
                    doc = transformer.read();
                }

                if (docs.length >= 10000) {
                    this.bulkInsert(docs);
                    docs = [];
                }
            })
            .on('error', (err: any) => {
                reject(err);
            })
            .on('finish', async () => {
                if (docs.length > 0) {
                    await this.bulkInsert(docs);
                }
                resolve();
            });
        });
    }

    private async bulkInsert(docs: any[]) {
        const body = [];
        for (const doc of docs) {
            body.push({ index: { _id: this.computeKey(doc) } });
            body.push(doc);
        }

        await this.client.bulk({
            index: this.index,
            type: this.type,
            body: body,
        });
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

    private transformRowToDoc (row: any) {
        return this.fields.reduce((doc, field) => {
            doc[field.name] = field.transform(row);
            return doc;
        }, <any> {});
    }

}

export default ESIndex;
