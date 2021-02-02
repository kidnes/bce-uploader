/**
 * @file bos copy 命令
 *
 * @author kidnes
 * @date 2021-02-02
 */

import {CommandArgs, BosCommandLineArgs} from '../../../../types';

export const command = 'copy';

export const description = 'Copy files form remote bos.';

export const args: CommandArgs = [
    ['--cwd [value]', 'override current working directory', process.cwd()],
    ['--endpoint [endpoint]', 'bos endpoint', 'https://bj.bcebos.com'],
    ['--ak <ak>', 'bos ak', ''],
    ['--sk <sk>', 'bos sk', ''],
    ['--to <to>', 'target bos bucket & path, like: bucket/a/b', ''],
    ['--from <from>', 'copy bucket from', '']
];

export const run = async (cmd: BosCommandLineArgs): Promise<void> => {
    const {default: run} = await import('./run');
    run(cmd);
};
