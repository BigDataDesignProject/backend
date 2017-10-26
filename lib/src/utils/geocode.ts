import * as fs from 'fs';

const csv = require('csv');

type ZipcodeToGeolocationMap = Map<string, {lat: number, lng: number}>;
type StoreToZipcodeMap = Map<string, string>;

const getZipcodeToGeolocation = () => {
    return new Promise<ZipcodeToGeolocationMap>((resolve, reject) => {
        const zipcodesToGeolocation = new Map<string, {lat: number, lng: number}>();

        const zipStream = fs.createReadStream('./res/zip_lat_long.txt');
        const parser = csv.parse({ delimiter: '\t', columns: true });

        zipStream
            .pipe(parser)
            .on('readable', () => {
                let row = parser.read();
                while (row) {
                    const zipcode = row['Zip_Code'];
                    const lat = row['zLatitude'];
                    const lng = row['zLongitude'];
                    if (zipcode !== '' && lat !== '' && lng !== '') {
                        zipcodesToGeolocation.set(zipcode, {
                            lat: Number.parseFloat(lat),
                            lng: Number.parseFloat(lng),
                        });
                    }
                    row = parser.read();
                }
            })
            .on('error', (err: any) => {
                reject(err);
            })
            .on('finish', async () => {
                resolve(zipcodesToGeolocation);
            });
    });
};

const getStoresToZipcode = () => {
    return new Promise<StoreToZipcodeMap>((resolve, reject) => {
        const storesToZipcode = new Map<string, string>();

        const storeStream = fs.createReadStream('./res/stores_master.txt');
        const parser = csv.parse({ delimiter: '\t', columns: true });
        storeStream
            .pipe(parser)
            .on('readable', () => {
                let row = parser.read();
                while (row) {
                    const store = row['Store Nbr'];
                    const zipcode = row['Zip Code'];
                    if (store !== '' && zipcode !== '') {
                        storesToZipcode.set(store, zipcode);
                    }
                    row = parser.read();
                }
            })
            .on('error', (err: any) => {
                reject(err);
            })
            .on('finish', async () => {
                resolve(storesToZipcode);
            });
    });
};

const storeToGeolocation = new Map<string, {lat: number, lng: number}>();
const initialize = async () => {
    const storesToZipcode = await getStoresToZipcode();
    const zipcodesToGeolocation = await getZipcodeToGeolocation();

    for (const [store, zipcode] of storesToZipcode.entries()) {
        const geolocation = zipcodesToGeolocation.has(zipcode)
                                ? zipcodesToGeolocation.get(zipcode)
                                : { lat: 0, lng: 0 };
        storeToGeolocation.set(store, geolocation);
    }
};

const geocode = (store: string) => {
    return storeToGeolocation.get(store);
};

export {
    geocode,
    initialize,
};
