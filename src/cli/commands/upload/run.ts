/**
 * @file tan build 命令
 *
 * @author kidnes
 * @date 2021-02-02
 */

import BosAction from '../../utils/bos-action';

import {
    BosCommandLineArgs
} from '../../../../types';

const parse = cmd => {
    const {endpoint, ak, sk, from, to} = cmd;

    const toBucket = to.split('/')[0];
    const toDir = to.split('/')[1];

    const config = {
        endpoint,
        credentials: {
            ak,
            sk
        },
        bucket: toBucket
    };

    return {
        config,
        toBucket,
        toDir,
        from
    };
};

export default async (cmd: BosCommandLineArgs): Promise<void> => {
    const {config, toDir, from} = parse(cmd);

    const action = new BosAction(config);

    action.upload(from, toDir).catch((error) => {
        console.error(error);
        process.exit(1);
    });

};
