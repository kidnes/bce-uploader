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
    const fromBucket = to.split('/')[0];
    const fromDir = to.split('/')[1];

    const config = {
        endpoint,
        credentials: {
            ak,
            sk
        },
        bucket: fromBucket
    };

    return {
        config,
        toBucket,
        toDir,
        fromBucket,
        fromDir
    };
};

export default async (cmd: BosCommandLineArgs): Promise<void> => {
    const {config, toBucket, toDir, fromDir} = parse(cmd);

    const action = new BosAction(config);
    
    return action.copy(fromDir, toBucket, toDir);
};
