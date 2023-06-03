# Runescape-ts
A runescape 377 server and client written in typescript.
<br>
Not finished, expect bugs.

# Server
Written from scratch in typescript, doesn't have that many features but it works.

## Run
```bash
cd server
node ./dist/runserver-ts.js
```

## Dev
```bash
cd server
yarn install
yarn start

$ node ./dist/runserver-ts.js
Parsing map regions...
Parsed 1667192 map region tiles and 1376518 landscape objects.
[ClientData] Loaded 7956 items.
[ClientData] Loaded 3852 npcs.
[ClientData] Loaded 14974 landscape objects.
[ClientData] Loaded 1667192 region tiles.
[ClientData] Loaded 1376518 region objects.

[ServerData] Loaded 11958 items.
[ServerData] Loaded 1833 npcs.
[CacheData] Processed 5940 merged items.
[CacheData] Processed 960 merged npcs.
[CacheData] Processed 14974 landscape items.
Started Server.
Started GameServer service.
Started NetworkService service.
```

# Client
Based on https://github.com/reinismu/runescape-web-client-377
<br>
Removed all the react/docker/babel stuff and added sounds.

## Run
```bash
cd web-client

# Serve the dist folder
python3 -m http.server --directory dist

# Browse http://localhost:8000
open http://localhost:8000
```

## Dev
```bash
cd web-client
yarn install
yarn dev

# Serve the dist folder
python3 -m http.server --directory dist

# Browse http://localhost:8000
open http://localhost:8000
```