# bos-uploader

上传文件到百度云 BOS

## 命令

Usage: bos [options] [command]

Options:
  -h, --help        output usage information

Commands:
  copy [options]    Copy files form remote bos.
  upload [options]  Upload files from local.

## bos upload 命令

Usage: bos upload [options]

Upload files from local.

Options:
  --cwd [value]          override current working directory (default: "/Volumes/Source/baidu/bos-uploader")
  --endpoint [endpoint]  bos endpoint (default: "https://bj.bcebos.com")
  --ak <ak>              bos ak (default: "")
  --sk <sk>              bos sk (default: "")
  --to <to>              target bos bucket & path, like: bucket/a/b (default: "")
  --from <from>          upload file source from local path (default: "./dist")
  -h, --help             output usage information

## bos copy 命令

Usage: bos copy [options]

Copy files form remote bos.

Options:
  --cwd [value]          override current working directory (default: "/Volumes/Source/baidu/bos-uploader")
  --endpoint [endpoint]  bos endpoint (default: "https://bj.bcebos.com")
  --ak <ak>              bos ak (default: "")
  --sk <sk>              bos sk (default: "")
  --to <to>              target bos bucket & path, like: bucket/a/b (default: "")
  --from <from>          copy bucket from (default: "")
  -h, --help             output usage information
