import esbuild from 'esbuild';
import globImport from 'esbuild-plugin-glob-import'

esbuild.build({
    watch: true,
    entryPoints: ["osrs/GamePlayground.ts"],
    outfile: "dist/runescape.js",
    bundle: true,
    loader: {
        ".ts": "ts", 
        ".dat":"file", 
        ".idx0":"file",
        ".idx1":"file",
        ".idx2":"file",
        ".idx3":"file",
        ".idx4":"file",
        
        ".file.js":"text",
    },
    target: "es2020",

    inject: [
        "inject.js"
    ],
    define: {
        Buffer: 'Buffer'
    },
    plugins: [
        globImport({
            camelCase: false,
            entryPoint: false,
            entryPointMatch: null
        }),
    ]
})
.then(() => console.log("⚡ Done"))
.catch(() => process.exit(1));