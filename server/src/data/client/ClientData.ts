import { StreamBuffer } from '@runeserver-ts/net/StreamBuffer';
import { CacheArchive } from '@runeserver-ts/data/client/CacheArchive';
import { CacheIndices } from '@runeserver-ts/data/client/CacheIndices';
import { CacheMapRegions } from '@runeserver-ts/data/client/CacheMapRegions';

import { ClientItemDefinition } from "@runeserver-ts/data/client/definitions/ClientItemDefinition";
import { ClientNpcDefinition } from "@runeserver-ts/data/client/definitions/ClientNpcDefinition";
import { ClientLandscapeObjectDefinition } from "@runeserver-ts/data/client/definitions/ClientLandscapeObjectDefinition";

import { ClientItemParser } from "@runeserver-ts/data/client/parsers/ClientItemParser";
import { ClientNpcParser } from "@runeserver-ts/data/client/parsers/ClientNpcParser";
import { ClientLandscapeObjectParser } from "@runeserver-ts/data/client/parsers/ClientLandscapeObjectParser";

// TODO: esbuild is picky about using imports with these.
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const INDEX_FILE_COUNT = 5;
const INDEX_SIZE = 6;
const DATA_BLOCK_SIZE = 512;
const DATA_HEADER_SIZE = 8;
const DATA_SIZE = DATA_BLOCK_SIZE + DATA_HEADER_SIZE;

export interface CacheFile {
    cacheId: number;
    fileId: number;
    data: StreamBuffer;
}

export class ClientData {

    private dataFile: StreamBuffer;
    private indexFiles: StreamBuffer[] = [];
    public readonly cacheIndices: CacheIndices;
    public readonly definitionArchive: CacheArchive;
    public readonly versionListArchive: CacheArchive;
    public readonly itemDefinitions: Map<number, ClientItemDefinition>;
    public readonly npcDefinitions: Map<number, ClientNpcDefinition>;
    public readonly landscapeObjectDefinitions: Map<number, ClientLandscapeObjectDefinition>;
    public readonly mapRegions: CacheMapRegions;

    public constructor(cacheDirectory: string) {
        this.dataFile = new StreamBuffer(fs.readFileSync(path.join(cacheDirectory, 'main_file_cache.dat')));

        for(let i = 0; i < INDEX_FILE_COUNT; i++) {
            this.indexFiles.push(new StreamBuffer(fs.readFileSync(path.join(cacheDirectory, `main_file_cache.idx${i}`))));
        }

        this.definitionArchive = new CacheArchive(this.getCacheFile(0, 2));
        this.versionListArchive = new CacheArchive(this.getCacheFile(0, 5));

        this.cacheIndices = new CacheIndices(this.definitionArchive, this.versionListArchive);

        this.itemDefinitions = ClientItemParser.ParseItemDefinitions(this.cacheIndices.itemDefinitionIndices, this.definitionArchive);
        this.npcDefinitions = ClientNpcParser.ParseNpcDefinitions(this.cacheIndices.npcDefinitionIndices, this.definitionArchive);
        this.landscapeObjectDefinitions = ClientLandscapeObjectParser.ParseLandscapeObjectDefinitions(this.cacheIndices.landscapeObjectDefinitionIndices, this.definitionArchive);
        
        this.mapRegions = new CacheMapRegions();
        this.mapRegions.parseMapRegions(this.cacheIndices.mapRegionIndices, this);

        console.log(`[ClientData] Loaded ${this.itemDefinitions.size} items.`);
        console.log(`[ClientData] Loaded ${this.npcDefinitions.size} npcs.`);
        console.log(`[ClientData] Loaded ${this.landscapeObjectDefinitions.size} landscape objects.`);
        console.log(`[ClientData] Loaded ${this.mapRegions.mapRegionTileList.length} region tiles.`);
        console.log(`[ClientData] Loaded ${this.mapRegions.mapObjectList.length} region objects.`);
        console.info('');
    }

    public unzip(cacheFile: CacheFile): StreamBuffer {
        const unzippedBuffer = zlib.gunzipSync(cacheFile.data.getBuffer());
        return new StreamBuffer(unzippedBuffer);
    }

    public getCacheFile(cacheId: number, fileId: number) {
        const indexFile = this.indexFiles[cacheId];
        cacheId++;

        const index = indexFile.getSlice(INDEX_SIZE * fileId, INDEX_SIZE);
        const fileSize = (index.readUnsignedByte() << 16) | (index.readUnsignedByte() << 8) | index.readUnsignedByte();
        const fileBlock = (index.readUnsignedByte() << 16) | (index.readUnsignedByte() << 8) | index.readUnsignedByte();

        let remainingBytes = fileSize;
        let currentBlock = fileBlock;

        const fileBuffer = StreamBuffer.create(fileSize);
        let cycles = 0;

        while(remainingBytes > 0) {
            let size = DATA_SIZE;
            let remaining = this.dataFile.getReadable() - currentBlock * DATA_SIZE;
            if(remaining < DATA_SIZE) {
                size = remaining;
            }

            const block = this.dataFile.getSlice(currentBlock * DATA_SIZE, size);
            let nextFileId = block.readUnsignedShortBE();
            let currentPartId = block.readUnsignedShortBE();
            let nextBlockId = (block.readUnsignedByte() << 16) | (block.readUnsignedByte() << 8) | block.readUnsignedByte();
            let nextCacheId = block.readUnsignedByte();

            size -= 8;

            let bytesThisCycle = remainingBytes;
            if(bytesThisCycle > DATA_BLOCK_SIZE) {
                bytesThisCycle = DATA_BLOCK_SIZE;
            }

            //fileBuffer.writeBytes(block.getBuffer().slice(block.getReaderIndex(), bytesThisCycle));
            block.getBuffer().copy(fileBuffer.getBuffer(), fileBuffer.getWriterIndex(), block.getReaderIndex(), block.getReaderIndex() + size);
            fileBuffer.setWriterIndex(fileBuffer.getWriterIndex() + bytesThisCycle);
            remainingBytes -= bytesThisCycle;

            if(cycles != currentPartId) {
                throw('Cycle does not match part id.');
            }

            if(remainingBytes > 0) {
                if(nextCacheId != cacheId) {
                    throw('Unexpected next cache id.');
                }
                
                if(nextFileId != fileId) {
                    throw('Unexpected next file id.');
                }
            }

            cycles++;
            currentBlock = nextBlockId;
        }

        return { cacheId, fileId, data: fileBuffer } as CacheFile;
    }

}
