type BuildMode = 'production' | 'development';

type CommandArgs = Array<[string, string] | [string, string, any]>;

type TestTarget = 'node';

interface CommandConfig {
    command: string;
    description: string;
    args: CommandArgs;
    run<TCommandLineArgs>(cmd: TCommandLineArgs): Promise<void>;
}

export interface ProjectAware {
    readonly cwd: string;
    readonly sdkCwd: string;
    readonly version: string;
    readonly name: string;
    readonly mainAppCwd: string;
    readonly mainAppModule: string;
    readonly isMainApp: boolean;
    readonly isSubApp: boolean;
    readonly isGeneral: boolean;
}

export interface BuildCommandLineArgs extends ProjectAware {
}

export interface BfsConfig {
    readonly endpoint: string;
    readonly credentials: any;
    readonly bucket: string;
}

export interface BosCommandLineArgs extends ProjectAware {
    readonly type: string;
    readonly endpoint: string;
    readonly ak: string;
    readonly sk: string;
    readonly bucket: string;
    readonly destBucket: string;
    readonly source: string;
    readonly dest: string;
}

export interface ManifestCls {
}

type AssetGroup = 'entry' | 'chunk' | 'asset' | 'map';

interface WebpackCompileAsset {
    readonly name: string;
    readonly size: number;
}

interface GroupedWebpackCompileAsset extends WebpackCompileAsset {
    readonly group: AssetGroup;
}

interface WebpackCompileChild {
    readonly assets: WebpackCompileAsset[];
    readonly assetsByChunkName: {[key: string]: string};
}

interface WebpackCompileStatsResult {
    readonly errors: string[];
    readonly warnings: string[];
    readonly children: WebpackCompileChild[];
}

