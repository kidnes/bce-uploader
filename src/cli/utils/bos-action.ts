/**
 * @file Bos Upload&Copy Action
 * @author kidnes
 * 2021-02-02
 */

import * as path from 'path';
import * as globby from 'globby';

import Bfs from './bfs';

interface FileInfo {
    readonly localPath: string;
    readonly remotePath: string;
}

export default class BosAction {
    public MAX_COUNT: number = 10;
    public client: any;

    private fileList: FileInfo[];

    private start: number;
    private end: number;

    private total = 0;
    private count = 0;
    private errCount = 0;

    private destPath: string;

    private resolve: Function;
    private reject: Function;

    constructor(config) {
        this.start = new Date().getTime();

        this.client = this.getClient(config);
    }

    private getClient(config) {
        return new Bfs({
            endpoint: config.endpoint,
            credentials: {
                ak: config.credentials.ak,
                sk: config.credentials.sk
            },
            bucket: config.bucket
        })
    }

    private startUpload() {
        if (!this.fileList || this.fileList.length === 0) {
            if (this.count === this.total && !this.end) {
                this.end = new Date().getTime();
                console.log('上传BOS计时：' + (this.end - this.start) / 1000 + ' s');

                this.resolve();
            }
            return;
        }

        this.uploadSingle(this.fileList.shift());
    };

    private uploadSingle(item) {
        this.client.writeFileFromFile(item.remotePath, item.localPath)
            .then(() => {
                console.log(++this.count + ' / ' + this.total + ': ' + item.remotePath);

                this.startUpload();
            }).catch((err) => {
                console.error(err);
                if (++this.errCount >= 1) {
                    this.reject(err);
                }
                else {
                    this.fileList.unshift(item);
                    this.startUpload();
                }
            });
    }

    private async initFileList(source) {
        const base = path.resolve(source);

        const list = await globby('**/*', {
            expandDirectories: true,
            onlyFiles: true,
            cwd: base
        });

        return list.map(item => ({
            localPath: `${base}/${item}`,
            remotePath: path.join(this.destPath, item)
        }));
    }

    public upload(srcPath, destPath): Promise<void> {
        this.destPath = destPath;

        return new Promise(async (res, rej) => {
            this.resolve = res;
            this.reject = rej;

            this.fileList = await this.initFileList(srcPath);
            this.total = this.fileList.length;

            for (let i = 0; i < this.MAX_COUNT; i++) {
                this.startUpload();
            }
        });
    }

    public copy(srcPath, destBucket, destPath) {
        srcPath = srcPath.replace(/^\//, '').replace(/\/$/, '');
        destPath = destPath.replace(/^\//, '').replace(/\/$/, '');

        return this.client
            .copydir(srcPath, destBucket, destPath)
            .then(() => {
                return true;
            })
            .catch((res: any) => {
                console.log(
                    'copyfile Error:',
                    srcPath,
                    destBucket,
                    destPath,
                    res
                );
            });
    }

};
