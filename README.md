# Asset Hashing Demo

This is a simple example of using Gulp to generate hashes of files based on their contents and save them to a JSON file so they can later be used for versioning.

To run, simply execute the following two commands.

```bash
> npm install
> gulp generateAssetHashes
```

The end product is an `asset-hashes.json` file, where each key is a file path (e.g. `"wwwroot/css/animate.min.css"`) and its value is a hash based on its content. If you change a file's contents and then regenerate the hash, it will be completely different.

The hashing algorithm used doesn't need to be secure. I chose the `farmhash` library because it's fast, has few collisions, and is maintained and used by Google. Its `fingerprint64()` method ensures that the generated hash will be the same no matter which CPU it's run on.

To use these hashes for versioning and client cache busting, you can implement your server-side code to append the hash to the file path's query string. The end product should be HTML tags that look something like this:
```html
<link href="/css/animate.min.css?v=2988535192492052684" rel="stylesheet"/>
<script src="/js/jquery.min.js?v=17423596266743767920"></script>
```

## License

MIT