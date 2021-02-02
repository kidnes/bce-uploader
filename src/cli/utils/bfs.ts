/**
 * @file BFS(Bos 虚拟文件系统)
 *
 * @author kidnes
 * @date 2021-02-02
 */

import {BosClient} from 'bce-sdk-js';
import {Minimatch} from 'minimatch';

import {BfsConfig} from '../../../types';

export default class Bfs {
    public MAX_COPY_COUNT: number = 10;

    public config: BfsConfig;
    public client: any;

    constructor(bosConfig: BfsConfig) {
        this.config = bosConfig;
        this.client = new BosClient(bosConfig);
    }

    private async readDirInfo(options: any) {
        let fileList = [];

        let res;
        try {
            res = await this.client.listObjects(this.config.bucket, options);
        } catch (e) {
            console.log('readdir Error:', e);
            return Promise.reject(e);
        }

        fileList = (res.body.contents || []).concat(
            res.body.commonPrefixes || []
        );

        if (res.isTruncated) {
            options.marker = res.nextMarker;

            const list: any = await this.readDirInfo(options);

            fileList = fileList.concat(list);
        }

        return Promise.resolve(fileList);
    }

    public async readdir(path: string) {
        const options = {
            prefix: path[path.length - 1] === '/' ? path : path + '/',
            delimiter: '/'
        };
        return await this.readDirInfo(options);
    }

    public async readdirAll(path: string) {
        const options = {
            prefix: path
        };
        return await this.readDirInfo(options);
    }

    public async glob(pattern: string) {
        if (!pattern) {
            return Promise.reject(new Error('Pattern 参数为空。'));
        }

        const reg = /[\*\+\!\?]/;
        const pathArr = pattern.split('/');
        let index;
        for (index = 0; index < pathArr.length; index++) {
            if (reg.test(pathArr[index])) {
                break;
            }
        }
        const path = pathArr.splice(0, index).join('/');

        const fileList: any[] = await this.readdirAll(path);

        const mm = new Minimatch(pattern);
        const files = fileList.filter(item => mm.match(item.key));

        return Promise.resolve(files);
    }

    public readfile(key: string) {
        return this.client
            .getObject(this.config.bucket, key)
            .then((res: any) => {
                const buffer = res.body.toString('utf8');
                return buffer;
            })
            .catch((res: any) => {
                console.log('readfile Error:', res);
            });
    }

    public writeFileFromString(key: string, content: string) {
        return this.client
            .putObjectFromString(this.config.bucket, key, content)
            .then(() => {
                return true;
            })
            .catch((res: any) => {
                console.log('writeFile Error:', res);
            });
    }

    public writeFileFromFile(key: string, content: string) {
        return this.client
            .putObjectFromFile(this.config.bucket, key, content)
            .then(() => {
                return true;
            })
            .catch((res: any) => {
                console.log('writeFile Error:', res);
            });
    }

    public rmfile(key: string) {
        return this.client
            .deleteObject(this.config.bucket, key)
            .then(() => {
                return true;
            })
            .catch((res: any) => {
                console.log('rmfile Error:', res);
            });
    }

    public copyfile(srcKey: string, destBucket: string, destKey: string, options = {}) {
        const srcBucket = this.config.bucket;
        return this.client
            .copyObject(srcBucket, srcKey, destBucket, destKey, options)
            .then(() => {
                return true;
            })
            .catch((res: any) => {
                console.log(
                    'copyfile Error:',
                    srcKey,
                    destBucket,
                    destKey,
                    res
                );
            });
    }

    public async copydir(srcPrefix: string, destBucket: string, destPrefix: string) {
        return new Promise(async (resolve, reject) => {
            let errCount = 0;
            const contents: any[] = await this.readdirAll(srcPrefix);

            const fileList: any[] = contents.map(content => {
                const srcKey = content.key;
                const relativeKey = srcKey.replace(srcPrefix, '');
                const destKey = destPrefix + relativeKey;
                return {srcKey, destKey};
            });

            const start = new Date().getTime();
            const total = fileList.length;
            let count = 0;

            const copySingle = ({srcKey, destKey}: {srcKey: string, destKey: string}) => {
                this.copyfile(srcKey, destBucket, destKey)
                    .then(() => {
                        console.log(
                            ++count + ' / ' + total + ': ' + srcKey
                        );
                        copy();
                    })
                    .catch((err: any) => {
                        console.error(err);
                        if (++errCount >= 5) {
                            console.error(err);
                            return Promise.reject({});
                        } else {
                            // fileList.unshift(item);
                            return copy();
                        }
                    });
            };

            const copy = () => {
                if (!fileList || fileList.length === 0) {
                    if (count === total) {
                        console.log(
                            'COPY DIR计时：' +
                                (new Date().getTime() - start) / 1000 +
                                ' s'
                        );
                        return resolve();
                    }

                    return;
                }

                return copySingle(fileList.shift());
            };

            for (let i = 0; i < this.MAX_COPY_COUNT; i++) {
                copy();
            }
        });
    }
}

