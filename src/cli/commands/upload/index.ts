/**
 * @file bos upload 命令
 *
 * @author kidnes
 * @date 2021-02-02
 */

import {CommandArgs, BosCommandLineArgs} from '../../../../types';

export const command = 'upload';

export const description = 'Upload files from local.';

export const args: CommandArgs = [
    ['--endpoint [endpoint]', 'bos endpoint', 'https://bj.bcebos.com'],
    ['--ak <ak>', 'bos ak', ''],
    ['--sk <sk>', 'bos sk', ''],
    ['--to <to>', 'target bos bucket & path, eg: bucket/a/b', ''],
    ['--from <from>', 'upload file source from local path', './dist']
];

export const run = async (cmd: BosCommandLineArgs): Promise<void> => {
    const {default: run} = await import('./run');
    run(cmd);
};
