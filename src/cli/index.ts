#! /usr/bin/env node

import * as program from 'commander';
import * as globby from 'globby';
import * as semver from 'semver';
import chalk from 'chalk';

import {CommandConfig} from '../../types';

const buildCommand = async (route: string): Promise<void> => {
    const {command, description, args, run}: CommandConfig = await import(route);
    const commandConfig = program.command(command);

    commandConfig.description(description);
    args.forEach(option => commandConfig.option(option[0], option[1], option[2]));

    commandConfig.action(run);
};

const main = async (): Promise<void> => {
    if (semver.lt(process.version, '8.9.0')) {
        console.error(chalk.yellow('Require node >= v8.9.0 to be installed'));
        process.exit(1);
    }

    const routes = await globby('./commands/*', {
        expandDirectories: false,
        onlyFiles: false,
        cwd: __dirname
    });

    await Promise.all(routes.map(buildCommand));

    program.parse(process.argv);
};

main();
