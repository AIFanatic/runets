var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/seek-bzip/lib/bitreader.js
var require_bitreader = __commonJS({
  "node_modules/seek-bzip/lib/bitreader.js"(exports, module) {
    var BITMASK = [0, 1, 3, 7, 15, 31, 63, 127, 255];
    var BitReader = function(stream) {
      this.stream = stream;
      this.bitOffset = 0;
      this.curByte = 0;
      this.hasByte = false;
    };
    BitReader.prototype._ensureByte = function() {
      if (!this.hasByte) {
        this.curByte = this.stream.readByte();
        this.hasByte = true;
      }
    };
    BitReader.prototype.read = function(bits) {
      var result = 0;
      while (bits > 0) {
        this._ensureByte();
        var remaining = 8 - this.bitOffset;
        if (bits >= remaining) {
          result <<= remaining;
          result |= BITMASK[remaining] & this.curByte;
          this.hasByte = false;
          this.bitOffset = 0;
          bits -= remaining;
        } else {
          result <<= bits;
          var shift = remaining - bits;
          result |= (this.curByte & BITMASK[bits] << shift) >> shift;
          this.bitOffset += bits;
          bits = 0;
        }
      }
      return result;
    };
    BitReader.prototype.seek = function(pos) {
      var n_bit = pos % 8;
      var n_byte = (pos - n_bit) / 8;
      this.bitOffset = n_bit;
      this.stream.seek(n_byte);
      this.hasByte = false;
    };
    BitReader.prototype.pi = function() {
      var buf = new Buffer(6), i;
      for (i = 0; i < buf.length; i++) {
        buf[i] = this.read(8);
      }
      return buf.toString("hex");
    };
    module.exports = BitReader;
  }
});

// node_modules/seek-bzip/lib/stream.js
var require_stream = __commonJS({
  "node_modules/seek-bzip/lib/stream.js"(exports, module) {
    var Stream = function() {
    };
    Stream.prototype.readByte = function() {
      throw new Error("abstract method readByte() not implemented");
    };
    Stream.prototype.read = function(buffer, bufOffset, length) {
      var bytesRead = 0;
      while (bytesRead < length) {
        var c = this.readByte();
        if (c < 0) {
          return bytesRead === 0 ? -1 : bytesRead;
        }
        buffer[bufOffset++] = c;
        bytesRead++;
      }
      return bytesRead;
    };
    Stream.prototype.seek = function(new_pos) {
      throw new Error("abstract method seek() not implemented");
    };
    Stream.prototype.writeByte = function(_byte) {
      throw new Error("abstract method readByte() not implemented");
    };
    Stream.prototype.write = function(buffer, bufOffset, length) {
      var i;
      for (i = 0; i < length; i++) {
        this.writeByte(buffer[bufOffset++]);
      }
      return length;
    };
    Stream.prototype.flush = function() {
    };
    module.exports = Stream;
  }
});

// node_modules/seek-bzip/lib/crc32.js
var require_crc32 = __commonJS({
  "node_modules/seek-bzip/lib/crc32.js"(exports, module) {
    module.exports = function() {
      var crc32Lookup = new Uint32Array([
        0,
        79764919,
        159529838,
        222504665,
        319059676,
        398814059,
        445009330,
        507990021,
        638119352,
        583659535,
        797628118,
        726387553,
        890018660,
        835552979,
        1015980042,
        944750013,
        1276238704,
        1221641927,
        1167319070,
        1095957929,
        1595256236,
        1540665371,
        1452775106,
        1381403509,
        1780037320,
        1859660671,
        1671105958,
        1733955601,
        2031960084,
        2111593891,
        1889500026,
        1952343757,
        2552477408,
        2632100695,
        2443283854,
        2506133561,
        2334638140,
        2414271883,
        2191915858,
        2254759653,
        3190512472,
        3135915759,
        3081330742,
        3009969537,
        2905550212,
        2850959411,
        2762807018,
        2691435357,
        3560074640,
        3505614887,
        3719321342,
        3648080713,
        3342211916,
        3287746299,
        3467911202,
        3396681109,
        4063920168,
        4143685023,
        4223187782,
        4286162673,
        3779000052,
        3858754371,
        3904687514,
        3967668269,
        881225847,
        809987520,
        1023691545,
        969234094,
        662832811,
        591600412,
        771767749,
        717299826,
        311336399,
        374308984,
        453813921,
        533576470,
        25881363,
        88864420,
        134795389,
        214552010,
        2023205639,
        2086057648,
        1897238633,
        1976864222,
        1804852699,
        1867694188,
        1645340341,
        1724971778,
        1587496639,
        1516133128,
        1461550545,
        1406951526,
        1302016099,
        1230646740,
        1142491917,
        1087903418,
        2896545431,
        2825181984,
        2770861561,
        2716262478,
        3215044683,
        3143675388,
        3055782693,
        3001194130,
        2326604591,
        2389456536,
        2200899649,
        2280525302,
        2578013683,
        2640855108,
        2418763421,
        2498394922,
        3769900519,
        3832873040,
        3912640137,
        3992402750,
        4088425275,
        4151408268,
        4197601365,
        4277358050,
        3334271071,
        3263032808,
        3476998961,
        3422541446,
        3585640067,
        3514407732,
        3694837229,
        3640369242,
        1762451694,
        1842216281,
        1619975040,
        1682949687,
        2047383090,
        2127137669,
        1938468188,
        2001449195,
        1325665622,
        1271206113,
        1183200824,
        1111960463,
        1543535498,
        1489069629,
        1434599652,
        1363369299,
        622672798,
        568075817,
        748617968,
        677256519,
        907627842,
        853037301,
        1067152940,
        995781531,
        51762726,
        131386257,
        177728840,
        240578815,
        269590778,
        349224269,
        429104020,
        491947555,
        4046411278,
        4126034873,
        4172115296,
        4234965207,
        3794477266,
        3874110821,
        3953728444,
        4016571915,
        3609705398,
        3555108353,
        3735388376,
        3664026991,
        3290680682,
        3236090077,
        3449943556,
        3378572211,
        3174993278,
        3120533705,
        3032266256,
        2961025959,
        2923101090,
        2868635157,
        2813903052,
        2742672763,
        2604032198,
        2683796849,
        2461293480,
        2524268063,
        2284983834,
        2364738477,
        2175806836,
        2238787779,
        1569362073,
        1498123566,
        1409854455,
        1355396672,
        1317987909,
        1246755826,
        1192025387,
        1137557660,
        2072149281,
        2135122070,
        1912620623,
        1992383480,
        1753615357,
        1816598090,
        1627664531,
        1707420964,
        295390185,
        358241886,
        404320391,
        483945776,
        43990325,
        106832002,
        186451547,
        266083308,
        932423249,
        861060070,
        1041341759,
        986742920,
        613929101,
        542559546,
        756411363,
        701822548,
        3316196985,
        3244833742,
        3425377559,
        3370778784,
        3601682597,
        3530312978,
        3744426955,
        3689838204,
        3819031489,
        3881883254,
        3928223919,
        4007849240,
        4037393693,
        4100235434,
        4180117107,
        4259748804,
        2310601993,
        2373574846,
        2151335527,
        2231098320,
        2596047829,
        2659030626,
        2470359227,
        2550115596,
        2947551409,
        2876312838,
        2788305887,
        2733848168,
        3165939309,
        3094707162,
        3040238851,
        2985771188
      ]);
      var CRC32 = function() {
        var crc = 4294967295;
        this.getCRC = function() {
          return ~crc >>> 0;
        };
        this.updateCRC = function(value) {
          crc = crc << 8 ^ crc32Lookup[(crc >>> 24 ^ value) & 255];
        };
        this.updateCRCRun = function(value, count) {
          while (count-- > 0) {
            crc = crc << 8 ^ crc32Lookup[(crc >>> 24 ^ value) & 255];
          }
        };
      };
      return CRC32;
    }();
  }
});

// node_modules/seek-bzip/package.json
var require_package = __commonJS({
  "node_modules/seek-bzip/package.json"(exports, module) {
    module.exports = "./package-4Y2EHMZ3.json";
  }
});

// node_modules/seek-bzip/lib/index.js
var require_lib = __commonJS({
  "node_modules/seek-bzip/lib/index.js"(exports, module) {
    var BitReader = require_bitreader();
    var Stream = require_stream();
    var CRC32 = require_crc32();
    var pjson = require_package();
    var MAX_HUFCODE_BITS = 20;
    var MAX_SYMBOLS = 258;
    var SYMBOL_RUNA = 0;
    var SYMBOL_RUNB = 1;
    var MIN_GROUPS = 2;
    var MAX_GROUPS = 6;
    var GROUP_SIZE = 50;
    var WHOLEPI = "314159265359";
    var SQRTPI = "177245385090";
    var mtf = function(array, index) {
      var src = array[index], i;
      for (i = index; i > 0; i--) {
        array[i] = array[i - 1];
      }
      array[0] = src;
      return src;
    };
    var Err = {
      OK: 0,
      LAST_BLOCK: -1,
      NOT_BZIP_DATA: -2,
      UNEXPECTED_INPUT_EOF: -3,
      UNEXPECTED_OUTPUT_EOF: -4,
      DATA_ERROR: -5,
      OUT_OF_MEMORY: -6,
      OBSOLETE_INPUT: -7,
      END_OF_BLOCK: -8
    };
    var ErrorMessages = {};
    ErrorMessages[Err.LAST_BLOCK] = "Bad file checksum";
    ErrorMessages[Err.NOT_BZIP_DATA] = "Not bzip data";
    ErrorMessages[Err.UNEXPECTED_INPUT_EOF] = "Unexpected input EOF";
    ErrorMessages[Err.UNEXPECTED_OUTPUT_EOF] = "Unexpected output EOF";
    ErrorMessages[Err.DATA_ERROR] = "Data error";
    ErrorMessages[Err.OUT_OF_MEMORY] = "Out of memory";
    ErrorMessages[Err.OBSOLETE_INPUT] = "Obsolete (pre 0.9.5) bzip format not supported.";
    var _throw = function(status, optDetail) {
      var msg = ErrorMessages[status] || "unknown error";
      if (optDetail) {
        msg += ": " + optDetail;
      }
      var e = new TypeError(msg);
      e.errorCode = status;
      throw e;
    };
    var Bunzip = function(inputStream, outputStream) {
      this.writePos = this.writeCurrent = this.writeCount = 0;
      this._start_bunzip(inputStream, outputStream);
    };
    Bunzip.prototype._init_block = function() {
      var moreBlocks = this._get_next_block();
      if (!moreBlocks) {
        this.writeCount = -1;
        return false;
      }
      this.blockCRC = new CRC32();
      return true;
    };
    Bunzip.prototype._start_bunzip = function(inputStream, outputStream) {
      var buf = new Buffer(4);
      if (inputStream.read(buf, 0, 4) !== 4 || String.fromCharCode(buf[0], buf[1], buf[2]) !== "BZh")
        _throw(Err.NOT_BZIP_DATA, "bad magic");
      var level = buf[3] - 48;
      if (level < 1 || level > 9)
        _throw(Err.NOT_BZIP_DATA, "level out of range");
      this.reader = new BitReader(inputStream);
      this.dbufSize = 1e5 * level;
      this.nextoutput = 0;
      this.outputStream = outputStream;
      this.streamCRC = 0;
    };
    Bunzip.prototype._get_next_block = function() {
      var i, j, k;
      var reader = this.reader;
      var h = reader.pi();
      if (h === SQRTPI) {
        return false;
      }
      if (h !== WHOLEPI)
        _throw(Err.NOT_BZIP_DATA);
      this.targetBlockCRC = reader.read(32) >>> 0;
      this.streamCRC = (this.targetBlockCRC ^ (this.streamCRC << 1 | this.streamCRC >>> 31)) >>> 0;
      if (reader.read(1))
        _throw(Err.OBSOLETE_INPUT);
      var origPointer = reader.read(24);
      if (origPointer > this.dbufSize)
        _throw(Err.DATA_ERROR, "initial position out of bounds");
      var t = reader.read(16);
      var symToByte = new Buffer(256), symTotal = 0;
      for (i = 0; i < 16; i++) {
        if (t & 1 << 15 - i) {
          var o = i * 16;
          k = reader.read(16);
          for (j = 0; j < 16; j++)
            if (k & 1 << 15 - j)
              symToByte[symTotal++] = o + j;
        }
      }
      var groupCount = reader.read(3);
      if (groupCount < MIN_GROUPS || groupCount > MAX_GROUPS)
        _throw(Err.DATA_ERROR);
      var nSelectors = reader.read(15);
      if (nSelectors === 0)
        _throw(Err.DATA_ERROR);
      var mtfSymbol = new Buffer(256);
      for (i = 0; i < groupCount; i++)
        mtfSymbol[i] = i;
      var selectors = new Buffer(nSelectors);
      for (i = 0; i < nSelectors; i++) {
        for (j = 0; reader.read(1); j++)
          if (j >= groupCount)
            _throw(Err.DATA_ERROR);
        selectors[i] = mtf(mtfSymbol, j);
      }
      var symCount = symTotal + 2;
      var groups = [], hufGroup;
      for (j = 0; j < groupCount; j++) {
        var length = new Buffer(symCount), temp = new Uint16Array(MAX_HUFCODE_BITS + 1);
        t = reader.read(5);
        for (i = 0; i < symCount; i++) {
          for (; ; ) {
            if (t < 1 || t > MAX_HUFCODE_BITS)
              _throw(Err.DATA_ERROR);
            if (!reader.read(1))
              break;
            if (!reader.read(1))
              t++;
            else
              t--;
          }
          length[i] = t;
        }
        var minLen, maxLen;
        minLen = maxLen = length[0];
        for (i = 1; i < symCount; i++) {
          if (length[i] > maxLen)
            maxLen = length[i];
          else if (length[i] < minLen)
            minLen = length[i];
        }
        hufGroup = {};
        groups.push(hufGroup);
        hufGroup.permute = new Uint16Array(MAX_SYMBOLS);
        hufGroup.limit = new Uint32Array(MAX_HUFCODE_BITS + 2);
        hufGroup.base = new Uint32Array(MAX_HUFCODE_BITS + 1);
        hufGroup.minLen = minLen;
        hufGroup.maxLen = maxLen;
        var pp = 0;
        for (i = minLen; i <= maxLen; i++) {
          temp[i] = hufGroup.limit[i] = 0;
          for (t = 0; t < symCount; t++)
            if (length[t] === i)
              hufGroup.permute[pp++] = t;
        }
        for (i = 0; i < symCount; i++)
          temp[length[i]]++;
        pp = t = 0;
        for (i = minLen; i < maxLen; i++) {
          pp += temp[i];
          hufGroup.limit[i] = pp - 1;
          pp <<= 1;
          t += temp[i];
          hufGroup.base[i + 1] = pp - t;
        }
        hufGroup.limit[maxLen + 1] = Number.MAX_VALUE;
        hufGroup.limit[maxLen] = pp + temp[maxLen] - 1;
        hufGroup.base[minLen] = 0;
      }
      var byteCount = new Uint32Array(256);
      for (i = 0; i < 256; i++)
        mtfSymbol[i] = i;
      var runPos = 0, dbufCount = 0, selector = 0, uc;
      var dbuf = this.dbuf = new Uint32Array(this.dbufSize);
      symCount = 0;
      for (; ; ) {
        if (!symCount--) {
          symCount = GROUP_SIZE - 1;
          if (selector >= nSelectors) {
            _throw(Err.DATA_ERROR);
          }
          hufGroup = groups[selectors[selector++]];
        }
        i = hufGroup.minLen;
        j = reader.read(i);
        for (; ; i++) {
          if (i > hufGroup.maxLen) {
            _throw(Err.DATA_ERROR);
          }
          if (j <= hufGroup.limit[i])
            break;
          j = j << 1 | reader.read(1);
        }
        j -= hufGroup.base[i];
        if (j < 0 || j >= MAX_SYMBOLS) {
          _throw(Err.DATA_ERROR);
        }
        var nextSym = hufGroup.permute[j];
        if (nextSym === SYMBOL_RUNA || nextSym === SYMBOL_RUNB) {
          if (!runPos) {
            runPos = 1;
            t = 0;
          }
          if (nextSym === SYMBOL_RUNA)
            t += runPos;
          else
            t += 2 * runPos;
          runPos <<= 1;
          continue;
        }
        if (runPos) {
          runPos = 0;
          if (dbufCount + t > this.dbufSize) {
            _throw(Err.DATA_ERROR);
          }
          uc = symToByte[mtfSymbol[0]];
          byteCount[uc] += t;
          while (t--)
            dbuf[dbufCount++] = uc;
        }
        if (nextSym > symTotal)
          break;
        if (dbufCount >= this.dbufSize) {
          _throw(Err.DATA_ERROR);
        }
        i = nextSym - 1;
        uc = mtf(mtfSymbol, i);
        uc = symToByte[uc];
        byteCount[uc]++;
        dbuf[dbufCount++] = uc;
      }
      if (origPointer < 0 || origPointer >= dbufCount) {
        _throw(Err.DATA_ERROR);
      }
      j = 0;
      for (i = 0; i < 256; i++) {
        k = j + byteCount[i];
        byteCount[i] = j;
        j = k;
      }
      for (i = 0; i < dbufCount; i++) {
        uc = dbuf[i] & 255;
        dbuf[byteCount[uc]] |= i << 8;
        byteCount[uc]++;
      }
      var pos = 0, current = 0, run = 0;
      if (dbufCount) {
        pos = dbuf[origPointer];
        current = pos & 255;
        pos >>= 8;
        run = -1;
      }
      this.writePos = pos;
      this.writeCurrent = current;
      this.writeCount = dbufCount;
      this.writeRun = run;
      return true;
    };
    Bunzip.prototype._read_bunzip = function(outputBuffer, len) {
      var copies, previous, outbyte;
      if (this.writeCount < 0) {
        return 0;
      }
      var gotcount = 0;
      var dbuf = this.dbuf, pos = this.writePos, current = this.writeCurrent;
      var dbufCount = this.writeCount, outputsize = this.outputsize;
      var run = this.writeRun;
      while (dbufCount) {
        dbufCount--;
        previous = current;
        pos = dbuf[pos];
        current = pos & 255;
        pos >>= 8;
        if (run++ === 3) {
          copies = current;
          outbyte = previous;
          current = -1;
        } else {
          copies = 1;
          outbyte = current;
        }
        this.blockCRC.updateCRCRun(outbyte, copies);
        while (copies--) {
          this.outputStream.writeByte(outbyte);
          this.nextoutput++;
        }
        if (current != previous)
          run = 0;
      }
      this.writeCount = dbufCount;
      if (this.blockCRC.getCRC() !== this.targetBlockCRC) {
        _throw(Err.DATA_ERROR, "Bad block CRC (got " + this.blockCRC.getCRC().toString(16) + " expected " + this.targetBlockCRC.toString(16) + ")");
      }
      return this.nextoutput;
    };
    var coerceInputStream = function(input) {
      if ("readByte" in input) {
        return input;
      }
      var inputStream = new Stream();
      inputStream.pos = 0;
      inputStream.readByte = function() {
        return input[this.pos++];
      };
      inputStream.seek = function(pos) {
        this.pos = pos;
      };
      inputStream.eof = function() {
        return this.pos >= input.length;
      };
      return inputStream;
    };
    var coerceOutputStream = function(output) {
      var outputStream = new Stream();
      var resizeOk = true;
      if (output) {
        if (typeof output === "number") {
          outputStream.buffer = new Buffer(output);
          resizeOk = false;
        } else if ("writeByte" in output) {
          return output;
        } else {
          outputStream.buffer = output;
          resizeOk = false;
        }
      } else {
        outputStream.buffer = new Buffer(16384);
      }
      outputStream.pos = 0;
      outputStream.writeByte = function(_byte) {
        if (resizeOk && this.pos >= this.buffer.length) {
          var newBuffer = new Buffer(this.buffer.length * 2);
          this.buffer.copy(newBuffer);
          this.buffer = newBuffer;
        }
        this.buffer[this.pos++] = _byte;
      };
      outputStream.getBuffer = function() {
        if (this.pos !== this.buffer.length) {
          if (!resizeOk)
            throw new TypeError("outputsize does not match decoded input");
          var newBuffer = new Buffer(this.pos);
          this.buffer.copy(newBuffer, 0, 0, this.pos);
          this.buffer = newBuffer;
        }
        return this.buffer;
      };
      outputStream._coerced = true;
      return outputStream;
    };
    Bunzip.Err = Err;
    Bunzip.decode = function(input, output, multistream) {
      var inputStream = coerceInputStream(input);
      var outputStream = coerceOutputStream(output);
      var bz = new Bunzip(inputStream, outputStream);
      while (true) {
        if ("eof" in inputStream && inputStream.eof())
          break;
        if (bz._init_block()) {
          bz._read_bunzip();
        } else {
          var targetStreamCRC = bz.reader.read(32) >>> 0;
          if (targetStreamCRC !== bz.streamCRC) {
            _throw(Err.DATA_ERROR, "Bad stream CRC (got " + bz.streamCRC.toString(16) + " expected " + targetStreamCRC.toString(16) + ")");
          }
          if (multistream && "eof" in inputStream && !inputStream.eof()) {
            bz._start_bunzip(inputStream, outputStream);
          } else
            break;
        }
      }
      if ("getBuffer" in outputStream)
        return outputStream.getBuffer();
    };
    Bunzip.decodeBlock = function(input, pos, output) {
      var inputStream = coerceInputStream(input);
      var outputStream = coerceOutputStream(output);
      var bz = new Bunzip(inputStream, outputStream);
      bz.reader.seek(pos);
      var moreBlocks = bz._get_next_block();
      if (moreBlocks) {
        bz.blockCRC = new CRC32();
        bz.writeCopies = 0;
        bz._read_bunzip();
      }
      if ("getBuffer" in outputStream)
        return outputStream.getBuffer();
    };
    Bunzip.table = function(input, callback, multistream) {
      var inputStream = new Stream();
      inputStream.delegate = coerceInputStream(input);
      inputStream.pos = 0;
      inputStream.readByte = function() {
        this.pos++;
        return this.delegate.readByte();
      };
      if (inputStream.delegate.eof) {
        inputStream.eof = inputStream.delegate.eof.bind(inputStream.delegate);
      }
      var outputStream = new Stream();
      outputStream.pos = 0;
      outputStream.writeByte = function() {
        this.pos++;
      };
      var bz = new Bunzip(inputStream, outputStream);
      var blockSize = bz.dbufSize;
      while (true) {
        if ("eof" in inputStream && inputStream.eof())
          break;
        var position = inputStream.pos * 8 + bz.reader.bitOffset;
        if (bz.reader.hasByte) {
          position -= 8;
        }
        if (bz._init_block()) {
          var start = outputStream.pos;
          bz._read_bunzip();
          callback(position, outputStream.pos - start);
        } else {
          var crc = bz.reader.read(32);
          if (multistream && "eof" in inputStream && !inputStream.eof()) {
            bz._start_bunzip(inputStream, outputStream);
            console.assert(
              bz.dbufSize === blockSize,
              "shouldn't change block size within multistream file"
            );
          } else
            break;
        }
      }
    };
    Bunzip.Stream = Stream;
    Bunzip.version = pjson.version;
    Bunzip.license = pjson.license;
    module.exports = Bunzip;
  }
});

// node_modules/quadtree-lib/build/js/quadtree.min.js
var require_quadtree_min = __commonJS({
  "node_modules/quadtree-lib/build/js/quadtree.min.js"(exports, module) {
    !function(e, t) {
      "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports && module.exports ? module.exports = t() : e.Quadtree = t();
    }(exports, function() {
      return function() {
        function e(t2) {
          var n2, i2;
          if (this.x = t2.x, this.y = t2.y, this.width = t2.width, this.height = t2.height, this.maxElements = t2.maxElements, null == this.width || null == this.height)
            throw new Error("Missing quadtree dimensions.");
          if (null == this.x && (this.x = 0), null == this.y && (this.y = 0), null == this.maxElements && (this.maxElements = 1), this.contents = [], this.oversized = [], this.size = 0, this.width < 1 || this.height < 1)
            throw new Error("Dimensions must be positive integers.");
          if (!Number.isInteger(this.x) || !Number.isInteger(this.y))
            throw new Error("Coordinates must be integers");
          if (this.maxElements < 1)
            throw new Error("The maximum number of elements before a split must be a positive integer.");
          i2 = this, this.children = { NW: { create: function() {
            return new e({ x: i2.x, y: i2.y, width: Math.max(Math.floor(i2.width / 2), 1), height: Math.max(Math.floor(i2.height / 2), 1), maxElements: i2.maxElements });
          }, tree: null }, NE: { create: function() {
            return new e({ x: i2.x + Math.max(Math.floor(i2.width / 2), 1), y: i2.y, width: Math.ceil(i2.width / 2), height: Math.max(Math.floor(i2.height / 2), 1), maxElements: i2.maxElements });
          }, tree: null }, SW: { create: function() {
            return new e({ x: i2.x, y: i2.y + Math.max(Math.floor(i2.height / 2), 1), width: Math.max(Math.floor(i2.width / 2), 1), height: Math.ceil(i2.height / 2), maxElements: i2.maxElements });
          }, tree: null }, SE: { create: function() {
            return new e({ x: i2.x + Math.max(Math.floor(i2.width / 2), 1), y: i2.y + Math.max(Math.floor(i2.height / 2), 1), width: Math.ceil(i2.width / 2), height: Math.ceil(i2.height / 2), maxElements: i2.maxElements });
          }, tree: null } };
          for (n2 in this.children)
            this.children[n2].get = function() {
              return null != this.tree ? this.tree : (this.tree = this.create(), this.tree);
            };
        }
        var t, n, i, r, h, l, o, s;
        return r = function(e2) {
          var t2, n2;
          return { x: Math.floor((null != (t2 = e2.width) ? t2 : 1) / 2) + e2.x, y: Math.floor((null != (n2 = e2.height) ? n2 : 1) / 2) + e2.y };
        }, t = function(e2, t2) {
          var n2, i2, r2, h2;
          return !(e2.x >= t2.x + (null != (n2 = t2.width) ? n2 : 1) || e2.x + (null != (i2 = e2.width) ? i2 : 1) <= t2.x || e2.y >= t2.y + (null != (r2 = t2.height) ? r2 : 1) || e2.y + (null != (h2 = e2.height) ? h2 : 1) <= t2.y);
        }, n = function(e2, t2) {
          var n2;
          return n2 = r(t2), e2.x < n2.x ? e2.y < n2.y ? "NW" : "SW" : e2.y < n2.y ? "NE" : "SE";
        }, s = function(e2) {
          if ("object" != typeof e2)
            throw new Error("Element must be an Object.");
          if (null == e2.x || null == e2.y)
            throw new Error("Coordinates properties are missing.");
          if ((null != e2 ? e2.width : void 0) < 0 || (null != e2 ? e2.height : void 0) < 0)
            throw new Error("Width and height must be positive integers.");
        }, l = function(e2) {
          var t2, n2, i2, r2;
          return n2 = Math.max(Math.floor(e2.width / 2), 1), i2 = Math.ceil(e2.width / 2), r2 = Math.max(Math.floor(e2.height / 2), 1), t2 = Math.ceil(e2.height / 2), { NW: { x: e2.x, y: e2.y, width: n2, height: r2 }, NE: { x: e2.x + n2, y: e2.y, width: i2, height: r2 }, SW: { x: e2.x, y: e2.y + r2, width: n2, height: t2 }, SE: { x: e2.x + n2, y: e2.y + r2, width: i2, height: t2 } };
        }, i = function(e2, n2) {
          var i2, r2, h2, o2;
          o2 = [], h2 = l(n2);
          for (r2 in h2)
            i2 = h2[r2], t(e2, i2) && o2.push(r2);
          return o2;
        }, h = function(e2, t2) {
          var n2;
          return (n2 = function(n3) {
            return e2["_" + n3] = e2[n3], Object.defineProperty(e2, n3, { set: function(e3) {
              return t2.remove(this, true), this["_" + n3] = e3, t2.push(this);
            }, get: function() {
              return this["_" + n3];
            }, configurable: true });
          })("x"), n2("y"), n2("width"), n2("height");
        }, o = function(e2) {
          var t2;
          return (t2 = function(t3) {
            if (null != e2["_" + t3])
              return delete e2[t3], e2[t3] = e2["_" + t3], delete e2["_" + t3];
          })("x"), t2("y"), t2("width"), t2("height");
        }, e.prototype.clear = function() {
          var e2, t2;
          this.contents = [], this.oversized = [], this.size = 0, t2 = [];
          for (e2 in this.children)
            t2.push(this.children[e2].tree = null);
          return t2;
        }, e.prototype.push = function(e2, t2) {
          return this.pushAll([e2], t2);
        }, e.prototype.pushAll = function(e2, t2) {
          var n2, r2, l2, o2, u, f, c, d, a, g, p, m, x, y, v, w, E, z, M, b;
          for (p = 0, y = e2.length; p < y; p++)
            g = e2[p], s(g), t2 && h(g, this);
          for (c = [{ tree: this, elements: e2 }]; c.length > 0; ) {
            for (b = (E = c.shift()).tree, d = { NW: null, NE: null, SW: null, SE: null }, m = 0, v = (f = E.elements).length; m < v; m++)
              if (u = f[m], b.size++, 1 !== (a = i(u, b)).length || 1 === b.width || 1 === b.height)
                b.oversized.push(u);
              else if (b.size - b.oversized.length <= b.maxElements)
                b.contents.push(u);
              else {
                for (o2 = a[0], M = b.children[o2], null == d[o2] && (d[o2] = { tree: M.get(), elements: [] }), d[o2].elements.push(u), x = 0, w = (z = b.contents).length; x < w; x++)
                  r2 = z[x], null == d[l2 = i(r2, b)[0]] && (d[l2] = { tree: b.children[l2].get(), elements: [] }), d[l2].elements.push(r2);
                b.contents = [];
              }
            for (o2 in d)
              null != (n2 = d[o2]) && c.push(n2);
          }
          return this;
        }, e.prototype.remove = function(e2, t2) {
          var i2, r2;
          return s(e2), (i2 = this.oversized.indexOf(e2)) > -1 ? (this.oversized.splice(i2, 1), this.size--, t2 || o(e2), true) : (i2 = this.contents.indexOf(e2)) > -1 ? (this.contents.splice(i2, 1), this.size--, t2 || o(e2), true) : !(null == (r2 = this.children[n(e2, this)]).tree || !r2.tree.remove(e2, t2) || (this.size--, 0 === r2.tree.size && (r2.tree = null), 0));
        }, e.prototype.colliding = function(e2, n2) {
          var r2, h2, l2, o2, u, f, c, d, a, g, p, m, x, y;
          for (null == n2 && (n2 = t), s(e2), u = [], l2 = [this]; l2.length > 0; ) {
            for (f = 0, a = (m = (y = l2.shift()).oversized).length; f < a; f++)
              (h2 = m[f]) !== e2 && n2(e2, h2) && u.push(h2);
            for (c = 0, g = (x = y.contents).length; c < g; c++)
              (h2 = x[c]) !== e2 && n2(e2, h2) && u.push(h2);
            for (0 === (o2 = i(e2, y)).length && (o2 = [], e2.x >= y.x + y.width && o2.push("NE"), e2.y >= y.y + y.height && o2.push("SW"), o2.length > 0 && (1 === o2.length ? o2.push("SE") : o2 = ["SE"])), d = 0, p = o2.length; d < p; d++)
              r2 = o2[d], null != y.children[r2].tree && l2.push(y.children[r2].tree);
          }
          return u;
        }, e.prototype.onCollision = function(e2, n2, r2) {
          var h2, l2, o2, u, f, c, d, a, g, p, m, x, y;
          for (null == r2 && (r2 = t), s(e2), o2 = [this]; o2.length > 0; ) {
            for (f = 0, a = (m = (y = o2.shift()).oversized).length; f < a; f++)
              (l2 = m[f]) !== e2 && r2(e2, l2) && n2(l2);
            for (c = 0, g = (x = y.contents).length; c < g; c++)
              (l2 = x[c]) !== e2 && r2(e2, l2) && n2(l2);
            for (0 === (u = i(e2, y)).length && (u = [], e2.x >= y.x + y.width && u.push("NE"), e2.y >= y.y + y.height && u.push("SW"), u.length > 0 && (1 === u.length ? u.push("SE") : u = ["SE"])), d = 0, p = u.length; d < p; d++)
              h2 = u[d], null != y.children[h2].tree && o2.push(y.children[h2].tree);
          }
          return null;
        }, e.prototype.get = function(e2) {
          return this.where(e2);
        }, e.prototype.where = function(e2) {
          var t2, i2, r2, h2, l2, o2, u, f, c, d, a, g, p;
          if ("object" == typeof e2 && (null == e2.x || null == e2.y))
            return this.find(function(t3) {
              var n2, i3;
              n2 = true;
              for (i3 in e2)
                e2[i3] !== t3[i3] && (n2 = false);
              return n2;
            });
          for (s(e2), h2 = [], r2 = [this]; r2.length > 0; ) {
            for (l2 = 0, f = (d = (p = r2.shift()).oversized).length; l2 < f; l2++) {
              i2 = d[l2], t2 = true;
              for (u in e2)
                e2[u] !== i2[u] && (t2 = false);
              t2 && h2.push(i2);
            }
            for (o2 = 0, c = (a = p.contents).length; o2 < c; o2++) {
              i2 = a[o2], t2 = true;
              for (u in e2)
                e2[u] !== i2[u] && (t2 = false);
              t2 && h2.push(i2);
            }
            null != (g = p.children[n(e2, p)]).tree && r2.push(g.tree);
          }
          return h2;
        }, e.prototype.each = function(e2) {
          var t2, n2, i2, r2, h2, l2, o2, s2, u, f;
          for (n2 = [this]; n2.length > 0; ) {
            for (r2 = 0, l2 = (s2 = (f = n2.shift()).oversized).length; r2 < l2; r2++)
              i2 = s2[r2], "function" == typeof e2 && e2(i2);
            for (h2 = 0, o2 = (u = f.contents).length; h2 < o2; h2++)
              i2 = u[h2], "function" == typeof e2 && e2(i2);
            for (t2 in f.children)
              null != f.children[t2].tree && n2.push(f.children[t2].tree);
          }
          return this;
        }, e.prototype.find = function(e2) {
          var t2, n2, i2, r2, h2, l2, o2, s2, u, f, c;
          for (n2 = [this], r2 = []; n2.length > 0; ) {
            for (h2 = 0, o2 = (u = (c = n2.shift()).oversized).length; h2 < o2; h2++)
              i2 = u[h2], ("function" == typeof e2 ? e2(i2) : void 0) && r2.push(i2);
            for (l2 = 0, s2 = (f = c.contents).length; l2 < s2; l2++)
              i2 = f[l2], ("function" == typeof e2 ? e2(i2) : void 0) && r2.push(i2);
            for (t2 in c.children)
              null != c.children[t2].tree && n2.push(c.children[t2].tree);
          }
          return r2;
        }, e.prototype.filter = function(t2) {
          var n2;
          return (n2 = function(i2) {
            var r2, h2, l2, o2, s2, u, f, c, d, a, g;
            (h2 = new e({ x: i2.x, y: i2.y, width: i2.width, height: i2.height, maxElements: i2.maxElements })).size = 0;
            for (r2 in i2.children)
              null != i2.children[r2].tree && (h2.children[r2].tree = n2(i2.children[r2].tree), h2.size += null != (c = null != (d = h2.children[r2].tree) ? d.size : void 0) ? c : 0);
            for (o2 = 0, u = (a = i2.oversized).length; o2 < u; o2++)
              l2 = a[o2], (null == t2 || ("function" == typeof t2 ? t2(l2) : void 0)) && h2.oversized.push(l2);
            for (s2 = 0, f = (g = i2.contents).length; s2 < f; s2++)
              l2 = g[s2], (null == t2 || ("function" == typeof t2 ? t2(l2) : void 0)) && h2.contents.push(l2);
            return h2.size += h2.oversized.length + h2.contents.length, 0 === h2.size ? null : h2;
          })(this);
        }, e.prototype.reject = function(e2) {
          return this.filter(function(t2) {
            return !("function" == typeof e2 ? e2(t2) : void 0);
          });
        }, e.prototype.visit = function(e2) {
          var t2, n2, i2;
          for (n2 = [this]; n2.length > 0; ) {
            i2 = n2.shift(), e2.bind(i2)();
            for (t2 in i2.children)
              null != i2.children[t2].tree && n2.push(i2.children[t2].tree);
          }
          return this;
        }, e.prototype.pretty = function() {
          var e2, t2, n2, i2, r2, h2, l2;
          for (h2 = "", n2 = function(e3) {
            var t3, n3, i3;
            for (i3 = "", t3 = n3 = e3; n3 <= 0 ? t3 < 0 : t3 > 0; n3 <= 0 ? ++t3 : --t3)
              i3 += "   ";
            return i3;
          }, t2 = [{ label: "ROOT", tree: this, level: 0 }]; t2.length > 0; ) {
            h2 += (i2 = n2((l2 = t2.shift()).level)) + "| " + l2.label + "\n" + i2 + "| ------------\n", l2.tree.oversized.length > 0 && (h2 += i2 + "| * Oversized elements *\n" + i2 + "|   " + l2.tree.oversized + "\n"), l2.tree.contents.length > 0 && (h2 += i2 + "| * Leaf content *\n" + i2 + "|   " + l2.tree.contents + "\n"), r2 = false;
            for (e2 in l2.tree.children)
              null != l2.tree.children[e2].tree && (r2 = true, t2.unshift({ label: e2, tree: l2.tree.children[e2].tree, level: l2.level + 1 }));
            r2 && (h2 += i2 + "\u2514\u2500\u2500\u2510\n");
          }
          return h2;
        }, e;
      }();
    });
  }
});

// node_modules/ws/lib/stream.js
var require_stream2 = __commonJS({
  "node_modules/ws/lib/stream.js"(exports, module) {
    "use strict";
    var { Duplex } = __require("stream");
    function emitClose(stream) {
      stream.emit("close");
    }
    function duplexOnEnd() {
      if (!this.destroyed && this._writableState.finished) {
        this.destroy();
      }
    }
    function duplexOnError(err) {
      this.removeListener("error", duplexOnError);
      this.destroy();
      if (this.listenerCount("error") === 0) {
        this.emit("error", err);
      }
    }
    function createWebSocketStream2(ws, options) {
      let terminateOnDestroy = true;
      const duplex = new Duplex({
        ...options,
        autoDestroy: false,
        emitClose: false,
        objectMode: false,
        writableObjectMode: false
      });
      ws.on("message", function message(msg, isBinary) {
        const data = !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;
        if (!duplex.push(data))
          ws.pause();
      });
      ws.once("error", function error(err) {
        if (duplex.destroyed)
          return;
        terminateOnDestroy = false;
        duplex.destroy(err);
      });
      ws.once("close", function close() {
        if (duplex.destroyed)
          return;
        duplex.push(null);
      });
      duplex._destroy = function(err, callback) {
        if (ws.readyState === ws.CLOSED) {
          callback(err);
          process.nextTick(emitClose, duplex);
          return;
        }
        let called = false;
        ws.once("error", function error(err2) {
          called = true;
          callback(err2);
        });
        ws.once("close", function close() {
          if (!called)
            callback(err);
          process.nextTick(emitClose, duplex);
        });
        if (terminateOnDestroy)
          ws.terminate();
      };
      duplex._final = function(callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._final(callback);
          });
          return;
        }
        if (ws._socket === null)
          return;
        if (ws._socket._writableState.finished) {
          callback();
          if (duplex._readableState.endEmitted)
            duplex.destroy();
        } else {
          ws._socket.once("finish", function finish() {
            callback();
          });
          ws.close();
        }
      };
      duplex._read = function() {
        if (ws.isPaused)
          ws.resume();
      };
      duplex._write = function(chunk, encoding, callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._write(chunk, encoding, callback);
          });
          return;
        }
        ws.send(chunk, callback);
      };
      duplex.on("end", duplexOnEnd);
      duplex.on("error", duplexOnError);
      return duplex;
    }
    module.exports = createWebSocketStream2;
  }
});

// node_modules/ws/lib/constants.js
var require_constants = __commonJS({
  "node_modules/ws/lib/constants.js"(exports, module) {
    "use strict";
    module.exports = {
      BINARY_TYPES: ["nodebuffer", "arraybuffer", "fragments"],
      EMPTY_BUFFER: Buffer.alloc(0),
      GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
      kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
      kListener: Symbol("kListener"),
      kStatusCode: Symbol("status-code"),
      kWebSocket: Symbol("websocket"),
      NOOP: () => {
      }
    };
  }
});

// node_modules/ws/lib/buffer-util.js
var require_buffer_util = __commonJS({
  "node_modules/ws/lib/buffer-util.js"(exports, module) {
    "use strict";
    var { EMPTY_BUFFER } = require_constants();
    function concat(list, totalLength) {
      if (list.length === 0)
        return EMPTY_BUFFER;
      if (list.length === 1)
        return list[0];
      const target = Buffer.allocUnsafe(totalLength);
      let offset = 0;
      for (let i = 0; i < list.length; i++) {
        const buf = list[i];
        target.set(buf, offset);
        offset += buf.length;
      }
      if (offset < totalLength)
        return target.slice(0, offset);
      return target;
    }
    function _mask(source, mask, output, offset, length) {
      for (let i = 0; i < length; i++) {
        output[offset + i] = source[i] ^ mask[i & 3];
      }
    }
    function _unmask(buffer, mask) {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] ^= mask[i & 3];
      }
    }
    function toArrayBuffer(buf) {
      if (buf.byteLength === buf.buffer.byteLength) {
        return buf.buffer;
      }
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }
    function toBuffer(data) {
      toBuffer.readOnly = true;
      if (Buffer.isBuffer(data))
        return data;
      let buf;
      if (data instanceof ArrayBuffer) {
        buf = Buffer.from(data);
      } else if (ArrayBuffer.isView(data)) {
        buf = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
      } else {
        buf = Buffer.from(data);
        toBuffer.readOnly = false;
      }
      return buf;
    }
    module.exports = {
      concat,
      mask: _mask,
      toArrayBuffer,
      toBuffer,
      unmask: _unmask
    };
    if (!process.env.WS_NO_BUFFER_UTIL) {
      try {
        const bufferUtil = __require("bufferutil");
        module.exports.mask = function(source, mask, output, offset, length) {
          if (length < 48)
            _mask(source, mask, output, offset, length);
          else
            bufferUtil.mask(source, mask, output, offset, length);
        };
        module.exports.unmask = function(buffer, mask) {
          if (buffer.length < 32)
            _unmask(buffer, mask);
          else
            bufferUtil.unmask(buffer, mask);
        };
      } catch (e) {
      }
    }
  }
});

// node_modules/ws/lib/limiter.js
var require_limiter = __commonJS({
  "node_modules/ws/lib/limiter.js"(exports, module) {
    "use strict";
    var kDone = Symbol("kDone");
    var kRun = Symbol("kRun");
    var Limiter = class {
      constructor(concurrency) {
        this[kDone] = () => {
          this.pending--;
          this[kRun]();
        };
        this.concurrency = concurrency || Infinity;
        this.jobs = [];
        this.pending = 0;
      }
      add(job) {
        this.jobs.push(job);
        this[kRun]();
      }
      [kRun]() {
        if (this.pending === this.concurrency)
          return;
        if (this.jobs.length) {
          const job = this.jobs.shift();
          this.pending++;
          job(this[kDone]);
        }
      }
    };
    module.exports = Limiter;
  }
});

// node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = __commonJS({
  "node_modules/ws/lib/permessage-deflate.js"(exports, module) {
    "use strict";
    var zlib2 = __require("zlib");
    var bufferUtil = require_buffer_util();
    var Limiter = require_limiter();
    var { kStatusCode } = require_constants();
    var TRAILER = Buffer.from([0, 0, 255, 255]);
    var kPerMessageDeflate = Symbol("permessage-deflate");
    var kTotalLength = Symbol("total-length");
    var kCallback = Symbol("callback");
    var kBuffers = Symbol("buffers");
    var kError = Symbol("error");
    var zlibLimiter;
    var PerMessageDeflate = class {
      constructor(options, isServer, maxPayload) {
        this._maxPayload = maxPayload | 0;
        this._options = options || {};
        this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
        this._isServer = !!isServer;
        this._deflate = null;
        this._inflate = null;
        this.params = null;
        if (!zlibLimiter) {
          const concurrency = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
          zlibLimiter = new Limiter(concurrency);
        }
      }
      static get extensionName() {
        return "permessage-deflate";
      }
      offer() {
        const params = {};
        if (this._options.serverNoContextTakeover) {
          params.server_no_context_takeover = true;
        }
        if (this._options.clientNoContextTakeover) {
          params.client_no_context_takeover = true;
        }
        if (this._options.serverMaxWindowBits) {
          params.server_max_window_bits = this._options.serverMaxWindowBits;
        }
        if (this._options.clientMaxWindowBits) {
          params.client_max_window_bits = this._options.clientMaxWindowBits;
        } else if (this._options.clientMaxWindowBits == null) {
          params.client_max_window_bits = true;
        }
        return params;
      }
      accept(configurations) {
        configurations = this.normalizeParams(configurations);
        this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
        return this.params;
      }
      cleanup() {
        if (this._inflate) {
          this._inflate.close();
          this._inflate = null;
        }
        if (this._deflate) {
          const callback = this._deflate[kCallback];
          this._deflate.close();
          this._deflate = null;
          if (callback) {
            callback(
              new Error(
                "The deflate stream was closed while data was being processed"
              )
            );
          }
        }
      }
      acceptAsServer(offers) {
        const opts = this._options;
        const accepted = offers.find((params) => {
          if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && !params.client_max_window_bits) {
            return false;
          }
          return true;
        });
        if (!accepted) {
          throw new Error("None of the extension offers can be accepted");
        }
        if (opts.serverNoContextTakeover) {
          accepted.server_no_context_takeover = true;
        }
        if (opts.clientNoContextTakeover) {
          accepted.client_no_context_takeover = true;
        }
        if (typeof opts.serverMaxWindowBits === "number") {
          accepted.server_max_window_bits = opts.serverMaxWindowBits;
        }
        if (typeof opts.clientMaxWindowBits === "number") {
          accepted.client_max_window_bits = opts.clientMaxWindowBits;
        } else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) {
          delete accepted.client_max_window_bits;
        }
        return accepted;
      }
      acceptAsClient(response) {
        const params = response[0];
        if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) {
          throw new Error('Unexpected parameter "client_no_context_takeover"');
        }
        if (!params.client_max_window_bits) {
          if (typeof this._options.clientMaxWindowBits === "number") {
            params.client_max_window_bits = this._options.clientMaxWindowBits;
          }
        } else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) {
          throw new Error(
            'Unexpected or invalid parameter "client_max_window_bits"'
          );
        }
        return params;
      }
      normalizeParams(configurations) {
        configurations.forEach((params) => {
          Object.keys(params).forEach((key) => {
            let value = params[key];
            if (value.length > 1) {
              throw new Error(`Parameter "${key}" must have only a single value`);
            }
            value = value[0];
            if (key === "client_max_window_bits") {
              if (value !== true) {
                const num = +value;
                if (!Number.isInteger(num) || num < 8 || num > 15) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value}`
                  );
                }
                value = num;
              } else if (!this._isServer) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else if (key === "server_max_window_bits") {
              const num = +value;
              if (!Number.isInteger(num) || num < 8 || num > 15) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
              value = num;
            } else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
              if (value !== true) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else {
              throw new Error(`Unknown parameter "${key}"`);
            }
            params[key] = value;
          });
        });
        return configurations;
      }
      decompress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._decompress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      compress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._compress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      _decompress(data, fin, callback) {
        const endpoint = this._isServer ? "client" : "server";
        if (!this._inflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib2.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._inflate = zlib2.createInflateRaw({
            ...this._options.zlibInflateOptions,
            windowBits
          });
          this._inflate[kPerMessageDeflate] = this;
          this._inflate[kTotalLength] = 0;
          this._inflate[kBuffers] = [];
          this._inflate.on("error", inflateOnError);
          this._inflate.on("data", inflateOnData);
        }
        this._inflate[kCallback] = callback;
        this._inflate.write(data);
        if (fin)
          this._inflate.write(TRAILER);
        this._inflate.flush(() => {
          const err = this._inflate[kError];
          if (err) {
            this._inflate.close();
            this._inflate = null;
            callback(err);
            return;
          }
          const data2 = bufferUtil.concat(
            this._inflate[kBuffers],
            this._inflate[kTotalLength]
          );
          if (this._inflate._readableState.endEmitted) {
            this._inflate.close();
            this._inflate = null;
          } else {
            this._inflate[kTotalLength] = 0;
            this._inflate[kBuffers] = [];
            if (fin && this.params[`${endpoint}_no_context_takeover`]) {
              this._inflate.reset();
            }
          }
          callback(null, data2);
        });
      }
      _compress(data, fin, callback) {
        const endpoint = this._isServer ? "server" : "client";
        if (!this._deflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib2.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._deflate = zlib2.createDeflateRaw({
            ...this._options.zlibDeflateOptions,
            windowBits
          });
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          this._deflate.on("data", deflateOnData);
        }
        this._deflate[kCallback] = callback;
        this._deflate.write(data);
        this._deflate.flush(zlib2.Z_SYNC_FLUSH, () => {
          if (!this._deflate) {
            return;
          }
          let data2 = bufferUtil.concat(
            this._deflate[kBuffers],
            this._deflate[kTotalLength]
          );
          if (fin)
            data2 = data2.slice(0, data2.length - 4);
          this._deflate[kCallback] = null;
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          if (fin && this.params[`${endpoint}_no_context_takeover`]) {
            this._deflate.reset();
          }
          callback(null, data2);
        });
      }
    };
    module.exports = PerMessageDeflate;
    function deflateOnData(chunk) {
      this[kBuffers].push(chunk);
      this[kTotalLength] += chunk.length;
    }
    function inflateOnData(chunk) {
      this[kTotalLength] += chunk.length;
      if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
        this[kBuffers].push(chunk);
        return;
      }
      this[kError] = new RangeError("Max payload size exceeded");
      this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
      this[kError][kStatusCode] = 1009;
      this.removeListener("data", inflateOnData);
      this.reset();
    }
    function inflateOnError(err) {
      this[kPerMessageDeflate]._inflate = null;
      err[kStatusCode] = 1007;
      this[kCallback](err);
    }
  }
});

// node_modules/ws/lib/validation.js
var require_validation = __commonJS({
  "node_modules/ws/lib/validation.js"(exports, module) {
    "use strict";
    var tokenChars = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      0
    ];
    function isValidStatusCode(code) {
      return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
    }
    function _isValidUTF8(buf) {
      const len = buf.length;
      let i = 0;
      while (i < len) {
        if ((buf[i] & 128) === 0) {
          i++;
        } else if ((buf[i] & 224) === 192) {
          if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) {
            return false;
          }
          i += 2;
        } else if ((buf[i] & 240) === 224) {
          if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || buf[i] === 237 && (buf[i + 1] & 224) === 160) {
            return false;
          }
          i += 3;
        } else if ((buf[i] & 248) === 240) {
          if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) {
            return false;
          }
          i += 4;
        } else {
          return false;
        }
      }
      return true;
    }
    module.exports = {
      isValidStatusCode,
      isValidUTF8: _isValidUTF8,
      tokenChars
    };
    if (!process.env.WS_NO_UTF_8_VALIDATE) {
      try {
        const isValidUTF8 = __require("utf-8-validate");
        module.exports.isValidUTF8 = function(buf) {
          return buf.length < 150 ? _isValidUTF8(buf) : isValidUTF8(buf);
        };
      } catch (e) {
      }
    }
  }
});

// node_modules/ws/lib/receiver.js
var require_receiver = __commonJS({
  "node_modules/ws/lib/receiver.js"(exports, module) {
    "use strict";
    var { Writable } = __require("stream");
    var PerMessageDeflate = require_permessage_deflate();
    var {
      BINARY_TYPES,
      EMPTY_BUFFER,
      kStatusCode,
      kWebSocket
    } = require_constants();
    var { concat, toArrayBuffer, unmask } = require_buffer_util();
    var { isValidStatusCode, isValidUTF8 } = require_validation();
    var GET_INFO = 0;
    var GET_PAYLOAD_LENGTH_16 = 1;
    var GET_PAYLOAD_LENGTH_64 = 2;
    var GET_MASK = 3;
    var GET_DATA = 4;
    var INFLATING = 5;
    var Receiver2 = class extends Writable {
      constructor(options = {}) {
        super();
        this._binaryType = options.binaryType || BINARY_TYPES[0];
        this._extensions = options.extensions || {};
        this._isServer = !!options.isServer;
        this._maxPayload = options.maxPayload | 0;
        this._skipUTF8Validation = !!options.skipUTF8Validation;
        this[kWebSocket] = void 0;
        this._bufferedBytes = 0;
        this._buffers = [];
        this._compressed = false;
        this._payloadLength = 0;
        this._mask = void 0;
        this._fragmented = 0;
        this._masked = false;
        this._fin = false;
        this._opcode = 0;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragments = [];
        this._state = GET_INFO;
        this._loop = false;
      }
      _write(chunk, encoding, cb) {
        if (this._opcode === 8 && this._state == GET_INFO)
          return cb();
        this._bufferedBytes += chunk.length;
        this._buffers.push(chunk);
        this.startLoop(cb);
      }
      consume(n) {
        this._bufferedBytes -= n;
        if (n === this._buffers[0].length)
          return this._buffers.shift();
        if (n < this._buffers[0].length) {
          const buf = this._buffers[0];
          this._buffers[0] = buf.slice(n);
          return buf.slice(0, n);
        }
        const dst = Buffer.allocUnsafe(n);
        do {
          const buf = this._buffers[0];
          const offset = dst.length - n;
          if (n >= buf.length) {
            dst.set(this._buffers.shift(), offset);
          } else {
            dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
            this._buffers[0] = buf.slice(n);
          }
          n -= buf.length;
        } while (n > 0);
        return dst;
      }
      startLoop(cb) {
        let err;
        this._loop = true;
        do {
          switch (this._state) {
            case GET_INFO:
              err = this.getInfo();
              break;
            case GET_PAYLOAD_LENGTH_16:
              err = this.getPayloadLength16();
              break;
            case GET_PAYLOAD_LENGTH_64:
              err = this.getPayloadLength64();
              break;
            case GET_MASK:
              this.getMask();
              break;
            case GET_DATA:
              err = this.getData(cb);
              break;
            default:
              this._loop = false;
              return;
          }
        } while (this._loop);
        cb(err);
      }
      getInfo() {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        const buf = this.consume(2);
        if ((buf[0] & 48) !== 0) {
          this._loop = false;
          return error(
            RangeError,
            "RSV2 and RSV3 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_2_3"
          );
        }
        const compressed = (buf[0] & 64) === 64;
        if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
          this._loop = false;
          return error(
            RangeError,
            "RSV1 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_1"
          );
        }
        this._fin = (buf[0] & 128) === 128;
        this._opcode = buf[0] & 15;
        this._payloadLength = buf[1] & 127;
        if (this._opcode === 0) {
          if (compressed) {
            this._loop = false;
            return error(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
          }
          if (!this._fragmented) {
            this._loop = false;
            return error(
              RangeError,
              "invalid opcode 0",
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
          }
          this._opcode = this._fragmented;
        } else if (this._opcode === 1 || this._opcode === 2) {
          if (this._fragmented) {
            this._loop = false;
            return error(
              RangeError,
              `invalid opcode ${this._opcode}`,
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
          }
          this._compressed = compressed;
        } else if (this._opcode > 7 && this._opcode < 11) {
          if (!this._fin) {
            this._loop = false;
            return error(
              RangeError,
              "FIN must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_FIN"
            );
          }
          if (compressed) {
            this._loop = false;
            return error(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
          }
          if (this._payloadLength > 125) {
            this._loop = false;
            return error(
              RangeError,
              `invalid payload length ${this._payloadLength}`,
              true,
              1002,
              "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"
            );
          }
        } else {
          this._loop = false;
          return error(
            RangeError,
            `invalid opcode ${this._opcode}`,
            true,
            1002,
            "WS_ERR_INVALID_OPCODE"
          );
        }
        if (!this._fin && !this._fragmented)
          this._fragmented = this._opcode;
        this._masked = (buf[1] & 128) === 128;
        if (this._isServer) {
          if (!this._masked) {
            this._loop = false;
            return error(
              RangeError,
              "MASK must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_MASK"
            );
          }
        } else if (this._masked) {
          this._loop = false;
          return error(
            RangeError,
            "MASK must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_MASK"
          );
        }
        if (this._payloadLength === 126)
          this._state = GET_PAYLOAD_LENGTH_16;
        else if (this._payloadLength === 127)
          this._state = GET_PAYLOAD_LENGTH_64;
        else
          return this.haveLength();
      }
      getPayloadLength16() {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        this._payloadLength = this.consume(2).readUInt16BE(0);
        return this.haveLength();
      }
      getPayloadLength64() {
        if (this._bufferedBytes < 8) {
          this._loop = false;
          return;
        }
        const buf = this.consume(8);
        const num = buf.readUInt32BE(0);
        if (num > Math.pow(2, 53 - 32) - 1) {
          this._loop = false;
          return error(
            RangeError,
            "Unsupported WebSocket frame: payload length > 2^53 - 1",
            false,
            1009,
            "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"
          );
        }
        this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
        return this.haveLength();
      }
      haveLength() {
        if (this._payloadLength && this._opcode < 8) {
          this._totalPayloadLength += this._payloadLength;
          if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
            this._loop = false;
            return error(
              RangeError,
              "Max payload size exceeded",
              false,
              1009,
              "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
            );
          }
        }
        if (this._masked)
          this._state = GET_MASK;
        else
          this._state = GET_DATA;
      }
      getMask() {
        if (this._bufferedBytes < 4) {
          this._loop = false;
          return;
        }
        this._mask = this.consume(4);
        this._state = GET_DATA;
      }
      getData(cb) {
        let data = EMPTY_BUFFER;
        if (this._payloadLength) {
          if (this._bufferedBytes < this._payloadLength) {
            this._loop = false;
            return;
          }
          data = this.consume(this._payloadLength);
          if (this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) {
            unmask(data, this._mask);
          }
        }
        if (this._opcode > 7)
          return this.controlMessage(data);
        if (this._compressed) {
          this._state = INFLATING;
          this.decompress(data, cb);
          return;
        }
        if (data.length) {
          this._messageLength = this._totalPayloadLength;
          this._fragments.push(data);
        }
        return this.dataMessage();
      }
      decompress(data, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        perMessageDeflate.decompress(data, this._fin, (err, buf) => {
          if (err)
            return cb(err);
          if (buf.length) {
            this._messageLength += buf.length;
            if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
              return cb(
                error(
                  RangeError,
                  "Max payload size exceeded",
                  false,
                  1009,
                  "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
                )
              );
            }
            this._fragments.push(buf);
          }
          const er = this.dataMessage();
          if (er)
            return cb(er);
          this.startLoop(cb);
        });
      }
      dataMessage() {
        if (this._fin) {
          const messageLength = this._messageLength;
          const fragments = this._fragments;
          this._totalPayloadLength = 0;
          this._messageLength = 0;
          this._fragmented = 0;
          this._fragments = [];
          if (this._opcode === 2) {
            let data;
            if (this._binaryType === "nodebuffer") {
              data = concat(fragments, messageLength);
            } else if (this._binaryType === "arraybuffer") {
              data = toArrayBuffer(concat(fragments, messageLength));
            } else {
              data = fragments;
            }
            this.emit("message", data, true);
          } else {
            const buf = concat(fragments, messageLength);
            if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
              this._loop = false;
              return error(
                Error,
                "invalid UTF-8 sequence",
                true,
                1007,
                "WS_ERR_INVALID_UTF8"
              );
            }
            this.emit("message", buf, false);
          }
        }
        this._state = GET_INFO;
      }
      controlMessage(data) {
        if (this._opcode === 8) {
          this._loop = false;
          if (data.length === 0) {
            this.emit("conclude", 1005, EMPTY_BUFFER);
            this.end();
          } else if (data.length === 1) {
            return error(
              RangeError,
              "invalid payload length 1",
              true,
              1002,
              "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"
            );
          } else {
            const code = data.readUInt16BE(0);
            if (!isValidStatusCode(code)) {
              return error(
                RangeError,
                `invalid status code ${code}`,
                true,
                1002,
                "WS_ERR_INVALID_CLOSE_CODE"
              );
            }
            const buf = data.slice(2);
            if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
              return error(
                Error,
                "invalid UTF-8 sequence",
                true,
                1007,
                "WS_ERR_INVALID_UTF8"
              );
            }
            this.emit("conclude", code, buf);
            this.end();
          }
        } else if (this._opcode === 9) {
          this.emit("ping", data);
        } else {
          this.emit("pong", data);
        }
        this._state = GET_INFO;
      }
    };
    module.exports = Receiver2;
    function error(ErrorCtor, message, prefix, statusCode, errorCode) {
      const err = new ErrorCtor(
        prefix ? `Invalid WebSocket frame: ${message}` : message
      );
      Error.captureStackTrace(err, error);
      err.code = errorCode;
      err[kStatusCode] = statusCode;
      return err;
    }
  }
});

// node_modules/ws/lib/sender.js
var require_sender = __commonJS({
  "node_modules/ws/lib/sender.js"(exports, module) {
    "use strict";
    var net2 = __require("net");
    var tls = __require("tls");
    var { randomFillSync } = __require("crypto");
    var PerMessageDeflate = require_permessage_deflate();
    var { EMPTY_BUFFER } = require_constants();
    var { isValidStatusCode } = require_validation();
    var { mask: applyMask, toBuffer } = require_buffer_util();
    var kByteLength = Symbol("kByteLength");
    var maskBuffer = Buffer.alloc(4);
    var Sender2 = class {
      constructor(socket, extensions, generateMask) {
        this._extensions = extensions || {};
        if (generateMask) {
          this._generateMask = generateMask;
          this._maskBuffer = Buffer.alloc(4);
        }
        this._socket = socket;
        this._firstFragment = true;
        this._compress = false;
        this._bufferedBytes = 0;
        this._deflating = false;
        this._queue = [];
      }
      static frame(data, options) {
        let mask;
        let merge = false;
        let offset = 2;
        let skipMasking = false;
        if (options.mask) {
          mask = options.maskBuffer || maskBuffer;
          if (options.generateMask) {
            options.generateMask(mask);
          } else {
            randomFillSync(mask, 0, 4);
          }
          skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
          offset = 6;
        }
        let dataLength;
        if (typeof data === "string") {
          if ((!options.mask || skipMasking) && options[kByteLength] !== void 0) {
            dataLength = options[kByteLength];
          } else {
            data = Buffer.from(data);
            dataLength = data.length;
          }
        } else {
          dataLength = data.length;
          merge = options.mask && options.readOnly && !skipMasking;
        }
        let payloadLength = dataLength;
        if (dataLength >= 65536) {
          offset += 8;
          payloadLength = 127;
        } else if (dataLength > 125) {
          offset += 2;
          payloadLength = 126;
        }
        const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);
        target[0] = options.fin ? options.opcode | 128 : options.opcode;
        if (options.rsv1)
          target[0] |= 64;
        target[1] = payloadLength;
        if (payloadLength === 126) {
          target.writeUInt16BE(dataLength, 2);
        } else if (payloadLength === 127) {
          target[2] = target[3] = 0;
          target.writeUIntBE(dataLength, 4, 6);
        }
        if (!options.mask)
          return [target, data];
        target[1] |= 128;
        target[offset - 4] = mask[0];
        target[offset - 3] = mask[1];
        target[offset - 2] = mask[2];
        target[offset - 1] = mask[3];
        if (skipMasking)
          return [target, data];
        if (merge) {
          applyMask(data, mask, target, offset, dataLength);
          return [target];
        }
        applyMask(data, mask, data, 0, dataLength);
        return [target, data];
      }
      close(code, data, mask, cb) {
        let buf;
        if (code === void 0) {
          buf = EMPTY_BUFFER;
        } else if (typeof code !== "number" || !isValidStatusCode(code)) {
          throw new TypeError("First argument must be a valid error code number");
        } else if (data === void 0 || !data.length) {
          buf = Buffer.allocUnsafe(2);
          buf.writeUInt16BE(code, 0);
        } else {
          const length = Buffer.byteLength(data);
          if (length > 123) {
            throw new RangeError("The message must not be greater than 123 bytes");
          }
          buf = Buffer.allocUnsafe(2 + length);
          buf.writeUInt16BE(code, 0);
          if (typeof data === "string") {
            buf.write(data, 2);
          } else {
            buf.set(data, 2);
          }
        }
        const options = {
          [kByteLength]: buf.length,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 8,
          readOnly: false,
          rsv1: false
        };
        if (this._deflating) {
          this.enqueue([this.dispatch, buf, false, options, cb]);
        } else {
          this.sendFrame(Sender2.frame(buf, options), cb);
        }
      }
      ping(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 9,
          readOnly,
          rsv1: false
        };
        if (this._deflating) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(Sender2.frame(data, options), cb);
        }
      }
      pong(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 10,
          readOnly,
          rsv1: false
        };
        if (this._deflating) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(Sender2.frame(data, options), cb);
        }
      }
      send(data, options, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        let opcode = options.binary ? 2 : 1;
        let rsv1 = options.compress;
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (this._firstFragment) {
          this._firstFragment = false;
          if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) {
            rsv1 = byteLength >= perMessageDeflate._threshold;
          }
          this._compress = rsv1;
        } else {
          rsv1 = false;
          opcode = 0;
        }
        if (options.fin)
          this._firstFragment = true;
        if (perMessageDeflate) {
          const opts = {
            [kByteLength]: byteLength,
            fin: options.fin,
            generateMask: this._generateMask,
            mask: options.mask,
            maskBuffer: this._maskBuffer,
            opcode,
            readOnly,
            rsv1
          };
          if (this._deflating) {
            this.enqueue([this.dispatch, data, this._compress, opts, cb]);
          } else {
            this.dispatch(data, this._compress, opts, cb);
          }
        } else {
          this.sendFrame(
            Sender2.frame(data, {
              [kByteLength]: byteLength,
              fin: options.fin,
              generateMask: this._generateMask,
              mask: options.mask,
              maskBuffer: this._maskBuffer,
              opcode,
              readOnly,
              rsv1: false
            }),
            cb
          );
        }
      }
      dispatch(data, compress, options, cb) {
        if (!compress) {
          this.sendFrame(Sender2.frame(data, options), cb);
          return;
        }
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        this._bufferedBytes += options[kByteLength];
        this._deflating = true;
        perMessageDeflate.compress(data, options.fin, (_, buf) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while data was being compressed"
            );
            if (typeof cb === "function")
              cb(err);
            for (let i = 0; i < this._queue.length; i++) {
              const params = this._queue[i];
              const callback = params[params.length - 1];
              if (typeof callback === "function")
                callback(err);
            }
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          this._deflating = false;
          options.readOnly = false;
          this.sendFrame(Sender2.frame(buf, options), cb);
          this.dequeue();
        });
      }
      dequeue() {
        while (!this._deflating && this._queue.length) {
          const params = this._queue.shift();
          this._bufferedBytes -= params[3][kByteLength];
          Reflect.apply(params[0], this, params.slice(1));
        }
      }
      enqueue(params) {
        this._bufferedBytes += params[3][kByteLength];
        this._queue.push(params);
      }
      sendFrame(list, cb) {
        if (list.length === 2) {
          this._socket.cork();
          this._socket.write(list[0]);
          this._socket.write(list[1], cb);
          this._socket.uncork();
        } else {
          this._socket.write(list[0], cb);
        }
      }
    };
    module.exports = Sender2;
  }
});

// node_modules/ws/lib/event-target.js
var require_event_target = __commonJS({
  "node_modules/ws/lib/event-target.js"(exports, module) {
    "use strict";
    var { kForOnEventAttribute, kListener } = require_constants();
    var kCode = Symbol("kCode");
    var kData = Symbol("kData");
    var kError = Symbol("kError");
    var kMessage = Symbol("kMessage");
    var kReason = Symbol("kReason");
    var kTarget = Symbol("kTarget");
    var kType = Symbol("kType");
    var kWasClean = Symbol("kWasClean");
    var Event = class {
      constructor(type) {
        this[kTarget] = null;
        this[kType] = type;
      }
      get target() {
        return this[kTarget];
      }
      get type() {
        return this[kType];
      }
    };
    Object.defineProperty(Event.prototype, "target", { enumerable: true });
    Object.defineProperty(Event.prototype, "type", { enumerable: true });
    var CloseEvent = class extends Event {
      constructor(type, options = {}) {
        super(type);
        this[kCode] = options.code === void 0 ? 0 : options.code;
        this[kReason] = options.reason === void 0 ? "" : options.reason;
        this[kWasClean] = options.wasClean === void 0 ? false : options.wasClean;
      }
      get code() {
        return this[kCode];
      }
      get reason() {
        return this[kReason];
      }
      get wasClean() {
        return this[kWasClean];
      }
    };
    Object.defineProperty(CloseEvent.prototype, "code", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "reason", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "wasClean", { enumerable: true });
    var ErrorEvent = class extends Event {
      constructor(type, options = {}) {
        super(type);
        this[kError] = options.error === void 0 ? null : options.error;
        this[kMessage] = options.message === void 0 ? "" : options.message;
      }
      get error() {
        return this[kError];
      }
      get message() {
        return this[kMessage];
      }
    };
    Object.defineProperty(ErrorEvent.prototype, "error", { enumerable: true });
    Object.defineProperty(ErrorEvent.prototype, "message", { enumerable: true });
    var MessageEvent = class extends Event {
      constructor(type, options = {}) {
        super(type);
        this[kData] = options.data === void 0 ? null : options.data;
      }
      get data() {
        return this[kData];
      }
    };
    Object.defineProperty(MessageEvent.prototype, "data", { enumerable: true });
    var EventTarget = {
      addEventListener(type, handler, options = {}) {
        for (const listener of this.listeners(type)) {
          if (!options[kForOnEventAttribute] && listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            return;
          }
        }
        let wrapper;
        if (type === "message") {
          wrapper = function onMessage(data, isBinary) {
            const event = new MessageEvent("message", {
              data: isBinary ? data : data.toString()
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "close") {
          wrapper = function onClose(code, message) {
            const event = new CloseEvent("close", {
              code,
              reason: message.toString(),
              wasClean: this._closeFrameReceived && this._closeFrameSent
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "error") {
          wrapper = function onError(error) {
            const event = new ErrorEvent("error", {
              error,
              message: error.message
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "open") {
          wrapper = function onOpen() {
            const event = new Event("open");
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else {
          return;
        }
        wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
        wrapper[kListener] = handler;
        if (options.once) {
          this.once(type, wrapper);
        } else {
          this.on(type, wrapper);
        }
      },
      removeEventListener(type, handler) {
        for (const listener of this.listeners(type)) {
          if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            this.removeListener(type, listener);
            break;
          }
        }
      }
    };
    module.exports = {
      CloseEvent,
      ErrorEvent,
      Event,
      EventTarget,
      MessageEvent
    };
    function callListener(listener, thisArg, event) {
      if (typeof listener === "object" && listener.handleEvent) {
        listener.handleEvent.call(listener, event);
      } else {
        listener.call(thisArg, event);
      }
    }
  }
});

// node_modules/ws/lib/extension.js
var require_extension = __commonJS({
  "node_modules/ws/lib/extension.js"(exports, module) {
    "use strict";
    var { tokenChars } = require_validation();
    function push(dest, name, elem) {
      if (dest[name] === void 0)
        dest[name] = [elem];
      else
        dest[name].push(elem);
    }
    function parse(header) {
      const offers = /* @__PURE__ */ Object.create(null);
      let params = /* @__PURE__ */ Object.create(null);
      let mustUnescape = false;
      let isEscaping = false;
      let inQuotes = false;
      let extensionName;
      let paramName;
      let start = -1;
      let code = -1;
      let end = -1;
      let i = 0;
      for (; i < header.length; i++) {
        code = header.charCodeAt(i);
        if (extensionName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1)
              start = i;
          } else if (i !== 0 && (code === 32 || code === 9)) {
            if (end === -1 && start !== -1)
              end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1)
              end = i;
            const name = header.slice(start, end);
            if (code === 44) {
              push(offers, name, params);
              params = /* @__PURE__ */ Object.create(null);
            } else {
              extensionName = name;
            }
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else if (paramName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1)
              start = i;
          } else if (code === 32 || code === 9) {
            if (end === -1 && start !== -1)
              end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1)
              end = i;
            push(params, header.slice(start, end), true);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            start = end = -1;
          } else if (code === 61 && start !== -1 && end === -1) {
            paramName = header.slice(start, i);
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else {
          if (isEscaping) {
            if (tokenChars[code] !== 1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (start === -1)
              start = i;
            else if (!mustUnescape)
              mustUnescape = true;
            isEscaping = false;
          } else if (inQuotes) {
            if (tokenChars[code] === 1) {
              if (start === -1)
                start = i;
            } else if (code === 34 && start !== -1) {
              inQuotes = false;
              end = i;
            } else if (code === 92) {
              isEscaping = true;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
          } else if (code === 34 && header.charCodeAt(i - 1) === 61) {
            inQuotes = true;
          } else if (end === -1 && tokenChars[code] === 1) {
            if (start === -1)
              start = i;
          } else if (start !== -1 && (code === 32 || code === 9)) {
            if (end === -1)
              end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1)
              end = i;
            let value = header.slice(start, end);
            if (mustUnescape) {
              value = value.replace(/\\/g, "");
              mustUnescape = false;
            }
            push(params, paramName, value);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            paramName = void 0;
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        }
      }
      if (start === -1 || inQuotes || code === 32 || code === 9) {
        throw new SyntaxError("Unexpected end of input");
      }
      if (end === -1)
        end = i;
      const token = header.slice(start, end);
      if (extensionName === void 0) {
        push(offers, token, params);
      } else {
        if (paramName === void 0) {
          push(params, token, true);
        } else if (mustUnescape) {
          push(params, paramName, token.replace(/\\/g, ""));
        } else {
          push(params, paramName, token);
        }
        push(offers, extensionName, params);
      }
      return offers;
    }
    function format(extensions) {
      return Object.keys(extensions).map((extension) => {
        let configurations = extensions[extension];
        if (!Array.isArray(configurations))
          configurations = [configurations];
        return configurations.map((params) => {
          return [extension].concat(
            Object.keys(params).map((k) => {
              let values = params[k];
              if (!Array.isArray(values))
                values = [values];
              return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
            })
          ).join("; ");
        }).join(", ");
      }).join(", ");
    }
    module.exports = { format, parse };
  }
});

// node_modules/ws/lib/websocket.js
var require_websocket = __commonJS({
  "node_modules/ws/lib/websocket.js"(exports, module) {
    "use strict";
    var EventEmitter = __require("events");
    var https = __require("https");
    var http = __require("http");
    var net2 = __require("net");
    var tls = __require("tls");
    var { randomBytes, createHash } = __require("crypto");
    var { Readable } = __require("stream");
    var { URL } = __require("url");
    var PerMessageDeflate = require_permessage_deflate();
    var Receiver2 = require_receiver();
    var Sender2 = require_sender();
    var {
      BINARY_TYPES,
      EMPTY_BUFFER,
      GUID,
      kForOnEventAttribute,
      kListener,
      kStatusCode,
      kWebSocket,
      NOOP
    } = require_constants();
    var {
      EventTarget: { addEventListener, removeEventListener }
    } = require_event_target();
    var { format, parse } = require_extension();
    var { toBuffer } = require_buffer_util();
    var closeTimeout = 30 * 1e3;
    var kAborted = Symbol("kAborted");
    var protocolVersions = [8, 13];
    var readyStates = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
    var subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
    var WebSocket3 = class extends EventEmitter {
      constructor(address, protocols, options) {
        super();
        this._binaryType = BINARY_TYPES[0];
        this._closeCode = 1006;
        this._closeFrameReceived = false;
        this._closeFrameSent = false;
        this._closeMessage = EMPTY_BUFFER;
        this._closeTimer = null;
        this._extensions = {};
        this._paused = false;
        this._protocol = "";
        this._readyState = WebSocket3.CONNECTING;
        this._receiver = null;
        this._sender = null;
        this._socket = null;
        if (address !== null) {
          this._bufferedAmount = 0;
          this._isServer = false;
          this._redirects = 0;
          if (protocols === void 0) {
            protocols = [];
          } else if (!Array.isArray(protocols)) {
            if (typeof protocols === "object" && protocols !== null) {
              options = protocols;
              protocols = [];
            } else {
              protocols = [protocols];
            }
          }
          initAsClient(this, address, protocols, options);
        } else {
          this._isServer = true;
        }
      }
      get binaryType() {
        return this._binaryType;
      }
      set binaryType(type) {
        if (!BINARY_TYPES.includes(type))
          return;
        this._binaryType = type;
        if (this._receiver)
          this._receiver._binaryType = type;
      }
      get bufferedAmount() {
        if (!this._socket)
          return this._bufferedAmount;
        return this._socket._writableState.length + this._sender._bufferedBytes;
      }
      get extensions() {
        return Object.keys(this._extensions).join();
      }
      get isPaused() {
        return this._paused;
      }
      get onclose() {
        return null;
      }
      get onerror() {
        return null;
      }
      get onopen() {
        return null;
      }
      get onmessage() {
        return null;
      }
      get protocol() {
        return this._protocol;
      }
      get readyState() {
        return this._readyState;
      }
      get url() {
        return this._url;
      }
      setSocket(socket, head, options) {
        const receiver = new Receiver2({
          binaryType: this.binaryType,
          extensions: this._extensions,
          isServer: this._isServer,
          maxPayload: options.maxPayload,
          skipUTF8Validation: options.skipUTF8Validation
        });
        this._sender = new Sender2(socket, this._extensions, options.generateMask);
        this._receiver = receiver;
        this._socket = socket;
        receiver[kWebSocket] = this;
        socket[kWebSocket] = this;
        receiver.on("conclude", receiverOnConclude);
        receiver.on("drain", receiverOnDrain);
        receiver.on("error", receiverOnError);
        receiver.on("message", receiverOnMessage);
        receiver.on("ping", receiverOnPing);
        receiver.on("pong", receiverOnPong);
        socket.setTimeout(0);
        socket.setNoDelay();
        if (head.length > 0)
          socket.unshift(head);
        socket.on("close", socketOnClose);
        socket.on("data", socketOnData);
        socket.on("end", socketOnEnd);
        socket.on("error", socketOnError);
        this._readyState = WebSocket3.OPEN;
        this.emit("open");
      }
      emitClose() {
        if (!this._socket) {
          this._readyState = WebSocket3.CLOSED;
          this.emit("close", this._closeCode, this._closeMessage);
          return;
        }
        if (this._extensions[PerMessageDeflate.extensionName]) {
          this._extensions[PerMessageDeflate.extensionName].cleanup();
        }
        this._receiver.removeAllListeners();
        this._readyState = WebSocket3.CLOSED;
        this.emit("close", this._closeCode, this._closeMessage);
      }
      close(code, data) {
        if (this.readyState === WebSocket3.CLOSED)
          return;
        if (this.readyState === WebSocket3.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          return abortHandshake(this, this._req, msg);
        }
        if (this.readyState === WebSocket3.CLOSING) {
          if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) {
            this._socket.end();
          }
          return;
        }
        this._readyState = WebSocket3.CLOSING;
        this._sender.close(code, data, !this._isServer, (err) => {
          if (err)
            return;
          this._closeFrameSent = true;
          if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) {
            this._socket.end();
          }
        });
        this._closeTimer = setTimeout(
          this._socket.destroy.bind(this._socket),
          closeTimeout
        );
      }
      pause() {
        if (this.readyState === WebSocket3.CONNECTING || this.readyState === WebSocket3.CLOSED) {
          return;
        }
        this._paused = true;
        this._socket.pause();
      }
      ping(data, mask, cb) {
        if (this.readyState === WebSocket3.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number")
          data = data.toString();
        if (this.readyState !== WebSocket3.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0)
          mask = !this._isServer;
        this._sender.ping(data || EMPTY_BUFFER, mask, cb);
      }
      pong(data, mask, cb) {
        if (this.readyState === WebSocket3.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number")
          data = data.toString();
        if (this.readyState !== WebSocket3.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0)
          mask = !this._isServer;
        this._sender.pong(data || EMPTY_BUFFER, mask, cb);
      }
      resume() {
        if (this.readyState === WebSocket3.CONNECTING || this.readyState === WebSocket3.CLOSED) {
          return;
        }
        this._paused = false;
        if (!this._receiver._writableState.needDrain)
          this._socket.resume();
      }
      send(data, options, cb) {
        if (this.readyState === WebSocket3.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof options === "function") {
          cb = options;
          options = {};
        }
        if (typeof data === "number")
          data = data.toString();
        if (this.readyState !== WebSocket3.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        const opts = {
          binary: typeof data !== "string",
          mask: !this._isServer,
          compress: true,
          fin: true,
          ...options
        };
        if (!this._extensions[PerMessageDeflate.extensionName]) {
          opts.compress = false;
        }
        this._sender.send(data || EMPTY_BUFFER, opts, cb);
      }
      terminate() {
        if (this.readyState === WebSocket3.CLOSED)
          return;
        if (this.readyState === WebSocket3.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          return abortHandshake(this, this._req, msg);
        }
        if (this._socket) {
          this._readyState = WebSocket3.CLOSING;
          this._socket.destroy();
        }
      }
    };
    Object.defineProperty(WebSocket3, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket3.prototype, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket3, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket3.prototype, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket3, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket3.prototype, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket3, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    Object.defineProperty(WebSocket3.prototype, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    [
      "binaryType",
      "bufferedAmount",
      "extensions",
      "isPaused",
      "protocol",
      "readyState",
      "url"
    ].forEach((property) => {
      Object.defineProperty(WebSocket3.prototype, property, { enumerable: true });
    });
    ["open", "error", "close", "message"].forEach((method) => {
      Object.defineProperty(WebSocket3.prototype, `on${method}`, {
        enumerable: true,
        get() {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute])
              return listener[kListener];
          }
          return null;
        },
        set(handler) {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) {
              this.removeListener(method, listener);
              break;
            }
          }
          if (typeof handler !== "function")
            return;
          this.addEventListener(method, handler, {
            [kForOnEventAttribute]: true
          });
        }
      });
    });
    WebSocket3.prototype.addEventListener = addEventListener;
    WebSocket3.prototype.removeEventListener = removeEventListener;
    module.exports = WebSocket3;
    function initAsClient(websocket, address, protocols, options) {
      const opts = {
        protocolVersion: protocolVersions[1],
        maxPayload: 100 * 1024 * 1024,
        skipUTF8Validation: false,
        perMessageDeflate: true,
        followRedirects: false,
        maxRedirects: 10,
        ...options,
        createConnection: void 0,
        socketPath: void 0,
        hostname: void 0,
        protocol: void 0,
        timeout: void 0,
        method: "GET",
        host: void 0,
        path: void 0,
        port: void 0
      };
      if (!protocolVersions.includes(opts.protocolVersion)) {
        throw new RangeError(
          `Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`
        );
      }
      let parsedUrl;
      if (address instanceof URL) {
        parsedUrl = address;
        websocket._url = address.href;
      } else {
        try {
          parsedUrl = new URL(address);
        } catch (e) {
          throw new SyntaxError(`Invalid URL: ${address}`);
        }
        websocket._url = address;
      }
      const isSecure = parsedUrl.protocol === "wss:";
      const isIpcUrl = parsedUrl.protocol === "ws+unix:";
      let invalidUrlMessage;
      if (parsedUrl.protocol !== "ws:" && !isSecure && !isIpcUrl) {
        invalidUrlMessage = `The URL's protocol must be one of "ws:", "wss:", or "ws+unix:"`;
      } else if (isIpcUrl && !parsedUrl.pathname) {
        invalidUrlMessage = "The URL's pathname is empty";
      } else if (parsedUrl.hash) {
        invalidUrlMessage = "The URL contains a fragment identifier";
      }
      if (invalidUrlMessage) {
        const err = new SyntaxError(invalidUrlMessage);
        if (websocket._redirects === 0) {
          throw err;
        } else {
          emitErrorAndClose(websocket, err);
          return;
        }
      }
      const defaultPort = isSecure ? 443 : 80;
      const key = randomBytes(16).toString("base64");
      const request = isSecure ? https.request : http.request;
      const protocolSet = /* @__PURE__ */ new Set();
      let perMessageDeflate;
      opts.createConnection = isSecure ? tlsConnect : netConnect;
      opts.defaultPort = opts.defaultPort || defaultPort;
      opts.port = parsedUrl.port || defaultPort;
      opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
      opts.headers = {
        ...opts.headers,
        "Sec-WebSocket-Version": opts.protocolVersion,
        "Sec-WebSocket-Key": key,
        Connection: "Upgrade",
        Upgrade: "websocket"
      };
      opts.path = parsedUrl.pathname + parsedUrl.search;
      opts.timeout = opts.handshakeTimeout;
      if (opts.perMessageDeflate) {
        perMessageDeflate = new PerMessageDeflate(
          opts.perMessageDeflate !== true ? opts.perMessageDeflate : {},
          false,
          opts.maxPayload
        );
        opts.headers["Sec-WebSocket-Extensions"] = format({
          [PerMessageDeflate.extensionName]: perMessageDeflate.offer()
        });
      }
      if (protocols.length) {
        for (const protocol of protocols) {
          if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) {
            throw new SyntaxError(
              "An invalid or duplicated subprotocol was specified"
            );
          }
          protocolSet.add(protocol);
        }
        opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
      }
      if (opts.origin) {
        if (opts.protocolVersion < 13) {
          opts.headers["Sec-WebSocket-Origin"] = opts.origin;
        } else {
          opts.headers.Origin = opts.origin;
        }
      }
      if (parsedUrl.username || parsedUrl.password) {
        opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
      }
      if (isIpcUrl) {
        const parts = opts.path.split(":");
        opts.socketPath = parts[0];
        opts.path = parts[1];
      }
      let req;
      if (opts.followRedirects) {
        if (websocket._redirects === 0) {
          websocket._originalIpc = isIpcUrl;
          websocket._originalSecure = isSecure;
          websocket._originalHostOrSocketPath = isIpcUrl ? opts.socketPath : parsedUrl.host;
          const headers = options && options.headers;
          options = { ...options, headers: {} };
          if (headers) {
            for (const [key2, value] of Object.entries(headers)) {
              options.headers[key2.toLowerCase()] = value;
            }
          }
        } else if (websocket.listenerCount("redirect") === 0) {
          const isSameHost = isIpcUrl ? websocket._originalIpc ? opts.socketPath === websocket._originalHostOrSocketPath : false : websocket._originalIpc ? false : parsedUrl.host === websocket._originalHostOrSocketPath;
          if (!isSameHost || websocket._originalSecure && !isSecure) {
            delete opts.headers.authorization;
            delete opts.headers.cookie;
            if (!isSameHost)
              delete opts.headers.host;
            opts.auth = void 0;
          }
        }
        if (opts.auth && !options.headers.authorization) {
          options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
        }
        req = websocket._req = request(opts);
        if (websocket._redirects) {
          websocket.emit("redirect", websocket.url, req);
        }
      } else {
        req = websocket._req = request(opts);
      }
      if (opts.timeout) {
        req.on("timeout", () => {
          abortHandshake(websocket, req, "Opening handshake has timed out");
        });
      }
      req.on("error", (err) => {
        if (req === null || req[kAborted])
          return;
        req = websocket._req = null;
        emitErrorAndClose(websocket, err);
      });
      req.on("response", (res) => {
        const location = res.headers.location;
        const statusCode = res.statusCode;
        if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
          if (++websocket._redirects > opts.maxRedirects) {
            abortHandshake(websocket, req, "Maximum redirects exceeded");
            return;
          }
          req.abort();
          let addr;
          try {
            addr = new URL(location, address);
          } catch (e) {
            const err = new SyntaxError(`Invalid URL: ${location}`);
            emitErrorAndClose(websocket, err);
            return;
          }
          initAsClient(websocket, addr, protocols, options);
        } else if (!websocket.emit("unexpected-response", req, res)) {
          abortHandshake(
            websocket,
            req,
            `Unexpected server response: ${res.statusCode}`
          );
        }
      });
      req.on("upgrade", (res, socket, head) => {
        websocket.emit("upgrade", res);
        if (websocket.readyState !== WebSocket3.CONNECTING)
          return;
        req = websocket._req = null;
        if (res.headers.upgrade.toLowerCase() !== "websocket") {
          abortHandshake(websocket, socket, "Invalid Upgrade header");
          return;
        }
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        if (res.headers["sec-websocket-accept"] !== digest) {
          abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Accept header");
          return;
        }
        const serverProt = res.headers["sec-websocket-protocol"];
        let protError;
        if (serverProt !== void 0) {
          if (!protocolSet.size) {
            protError = "Server sent a subprotocol but none was requested";
          } else if (!protocolSet.has(serverProt)) {
            protError = "Server sent an invalid subprotocol";
          }
        } else if (protocolSet.size) {
          protError = "Server sent no subprotocol";
        }
        if (protError) {
          abortHandshake(websocket, socket, protError);
          return;
        }
        if (serverProt)
          websocket._protocol = serverProt;
        const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
        if (secWebSocketExtensions !== void 0) {
          if (!perMessageDeflate) {
            const message = "Server sent a Sec-WebSocket-Extensions header but no extension was requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          let extensions;
          try {
            extensions = parse(secWebSocketExtensions);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          const extensionNames = Object.keys(extensions);
          if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate.extensionName) {
            const message = "Server indicated an extension that was not requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          try {
            perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          websocket._extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
        }
        websocket.setSocket(socket, head, {
          generateMask: opts.generateMask,
          maxPayload: opts.maxPayload,
          skipUTF8Validation: opts.skipUTF8Validation
        });
      });
      req.end();
    }
    function emitErrorAndClose(websocket, err) {
      websocket._readyState = WebSocket3.CLOSING;
      websocket.emit("error", err);
      websocket.emitClose();
    }
    function netConnect(options) {
      options.path = options.socketPath;
      return net2.connect(options);
    }
    function tlsConnect(options) {
      options.path = void 0;
      if (!options.servername && options.servername !== "") {
        options.servername = net2.isIP(options.host) ? "" : options.host;
      }
      return tls.connect(options);
    }
    function abortHandshake(websocket, stream, message) {
      websocket._readyState = WebSocket3.CLOSING;
      const err = new Error(message);
      Error.captureStackTrace(err, abortHandshake);
      if (stream.setHeader) {
        stream[kAborted] = true;
        stream.abort();
        if (stream.socket && !stream.socket.destroyed) {
          stream.socket.destroy();
        }
        process.nextTick(emitErrorAndClose, websocket, err);
      } else {
        stream.destroy(err);
        stream.once("error", websocket.emit.bind(websocket, "error"));
        stream.once("close", websocket.emitClose.bind(websocket));
      }
    }
    function sendAfterClose(websocket, data, cb) {
      if (data) {
        const length = toBuffer(data).length;
        if (websocket._socket)
          websocket._sender._bufferedBytes += length;
        else
          websocket._bufferedAmount += length;
      }
      if (cb) {
        const err = new Error(
          `WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`
        );
        cb(err);
      }
    }
    function receiverOnConclude(code, reason) {
      const websocket = this[kWebSocket];
      websocket._closeFrameReceived = true;
      websocket._closeMessage = reason;
      websocket._closeCode = code;
      if (websocket._socket[kWebSocket] === void 0)
        return;
      websocket._socket.removeListener("data", socketOnData);
      process.nextTick(resume, websocket._socket);
      if (code === 1005)
        websocket.close();
      else
        websocket.close(code, reason);
    }
    function receiverOnDrain() {
      const websocket = this[kWebSocket];
      if (!websocket.isPaused)
        websocket._socket.resume();
    }
    function receiverOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket._socket[kWebSocket] !== void 0) {
        websocket._socket.removeListener("data", socketOnData);
        process.nextTick(resume, websocket._socket);
        websocket.close(err[kStatusCode]);
      }
      websocket.emit("error", err);
    }
    function receiverOnFinish() {
      this[kWebSocket].emitClose();
    }
    function receiverOnMessage(data, isBinary) {
      this[kWebSocket].emit("message", data, isBinary);
    }
    function receiverOnPing(data) {
      const websocket = this[kWebSocket];
      websocket.pong(data, !websocket._isServer, NOOP);
      websocket.emit("ping", data);
    }
    function receiverOnPong(data) {
      this[kWebSocket].emit("pong", data);
    }
    function resume(stream) {
      stream.resume();
    }
    function socketOnClose() {
      const websocket = this[kWebSocket];
      this.removeListener("close", socketOnClose);
      this.removeListener("data", socketOnData);
      this.removeListener("end", socketOnEnd);
      websocket._readyState = WebSocket3.CLOSING;
      let chunk;
      if (!this._readableState.endEmitted && !websocket._closeFrameReceived && !websocket._receiver._writableState.errorEmitted && (chunk = websocket._socket.read()) !== null) {
        websocket._receiver.write(chunk);
      }
      websocket._receiver.end();
      this[kWebSocket] = void 0;
      clearTimeout(websocket._closeTimer);
      if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) {
        websocket.emitClose();
      } else {
        websocket._receiver.on("error", receiverOnFinish);
        websocket._receiver.on("finish", receiverOnFinish);
      }
    }
    function socketOnData(chunk) {
      if (!this[kWebSocket]._receiver.write(chunk)) {
        this.pause();
      }
    }
    function socketOnEnd() {
      const websocket = this[kWebSocket];
      websocket._readyState = WebSocket3.CLOSING;
      websocket._receiver.end();
      this.end();
    }
    function socketOnError() {
      const websocket = this[kWebSocket];
      this.removeListener("error", socketOnError);
      this.on("error", NOOP);
      if (websocket) {
        websocket._readyState = WebSocket3.CLOSING;
        this.destroy();
      }
    }
  }
});

// node_modules/ws/lib/subprotocol.js
var require_subprotocol = __commonJS({
  "node_modules/ws/lib/subprotocol.js"(exports, module) {
    "use strict";
    var { tokenChars } = require_validation();
    function parse(header) {
      const protocols = /* @__PURE__ */ new Set();
      let start = -1;
      let end = -1;
      let i = 0;
      for (i; i < header.length; i++) {
        const code = header.charCodeAt(i);
        if (end === -1 && tokenChars[code] === 1) {
          if (start === -1)
            start = i;
        } else if (i !== 0 && (code === 32 || code === 9)) {
          if (end === -1 && start !== -1)
            end = i;
        } else if (code === 44) {
          if (start === -1) {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
          if (end === -1)
            end = i;
          const protocol2 = header.slice(start, end);
          if (protocols.has(protocol2)) {
            throw new SyntaxError(`The "${protocol2}" subprotocol is duplicated`);
          }
          protocols.add(protocol2);
          start = end = -1;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      }
      if (start === -1 || end !== -1) {
        throw new SyntaxError("Unexpected end of input");
      }
      const protocol = header.slice(start, i);
      if (protocols.has(protocol)) {
        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
      }
      protocols.add(protocol);
      return protocols;
    }
    module.exports = { parse };
  }
});

// node_modules/ws/lib/websocket-server.js
var require_websocket_server = __commonJS({
  "node_modules/ws/lib/websocket-server.js"(exports, module) {
    "use strict";
    var EventEmitter = __require("events");
    var http = __require("http");
    var https = __require("https");
    var net2 = __require("net");
    var tls = __require("tls");
    var { createHash } = __require("crypto");
    var extension = require_extension();
    var PerMessageDeflate = require_permessage_deflate();
    var subprotocol = require_subprotocol();
    var WebSocket3 = require_websocket();
    var { GUID, kWebSocket } = require_constants();
    var keyRegex = /^[+/0-9A-Za-z]{22}==$/;
    var RUNNING = 0;
    var CLOSING = 1;
    var CLOSED = 2;
    var WebSocketServer2 = class extends EventEmitter {
      constructor(options, callback) {
        super();
        options = {
          maxPayload: 100 * 1024 * 1024,
          skipUTF8Validation: false,
          perMessageDeflate: false,
          handleProtocols: null,
          clientTracking: true,
          verifyClient: null,
          noServer: false,
          backlog: null,
          server: null,
          host: null,
          path: null,
          port: null,
          WebSocket: WebSocket3,
          ...options
        };
        if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) {
          throw new TypeError(
            'One and only one of the "port", "server", or "noServer" options must be specified'
          );
        }
        if (options.port != null) {
          this._server = http.createServer((req, res) => {
            const body = http.STATUS_CODES[426];
            res.writeHead(426, {
              "Content-Length": body.length,
              "Content-Type": "text/plain"
            });
            res.end(body);
          });
          this._server.listen(
            options.port,
            options.host,
            options.backlog,
            callback
          );
        } else if (options.server) {
          this._server = options.server;
        }
        if (this._server) {
          const emitConnection = this.emit.bind(this, "connection");
          this._removeListeners = addListeners(this._server, {
            listening: this.emit.bind(this, "listening"),
            error: this.emit.bind(this, "error"),
            upgrade: (req, socket, head) => {
              this.handleUpgrade(req, socket, head, emitConnection);
            }
          });
        }
        if (options.perMessageDeflate === true)
          options.perMessageDeflate = {};
        if (options.clientTracking) {
          this.clients = /* @__PURE__ */ new Set();
          this._shouldEmitClose = false;
        }
        this.options = options;
        this._state = RUNNING;
      }
      address() {
        if (this.options.noServer) {
          throw new Error('The server is operating in "noServer" mode');
        }
        if (!this._server)
          return null;
        return this._server.address();
      }
      close(cb) {
        if (this._state === CLOSED) {
          if (cb) {
            this.once("close", () => {
              cb(new Error("The server is not running"));
            });
          }
          process.nextTick(emitClose, this);
          return;
        }
        if (cb)
          this.once("close", cb);
        if (this._state === CLOSING)
          return;
        this._state = CLOSING;
        if (this.options.noServer || this.options.server) {
          if (this._server) {
            this._removeListeners();
            this._removeListeners = this._server = null;
          }
          if (this.clients) {
            if (!this.clients.size) {
              process.nextTick(emitClose, this);
            } else {
              this._shouldEmitClose = true;
            }
          } else {
            process.nextTick(emitClose, this);
          }
        } else {
          const server2 = this._server;
          this._removeListeners();
          this._removeListeners = this._server = null;
          server2.close(() => {
            emitClose(this);
          });
        }
      }
      shouldHandle(req) {
        if (this.options.path) {
          const index = req.url.indexOf("?");
          const pathname = index !== -1 ? req.url.slice(0, index) : req.url;
          if (pathname !== this.options.path)
            return false;
        }
        return true;
      }
      handleUpgrade(req, socket, head, cb) {
        socket.on("error", socketOnError);
        const key = req.headers["sec-websocket-key"];
        const version = +req.headers["sec-websocket-version"];
        if (req.method !== "GET") {
          const message = "Invalid HTTP method";
          abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
          return;
        }
        if (req.headers.upgrade.toLowerCase() !== "websocket") {
          const message = "Invalid Upgrade header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (!key || !keyRegex.test(key)) {
          const message = "Missing or invalid Sec-WebSocket-Key header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (version !== 8 && version !== 13) {
          const message = "Missing or invalid Sec-WebSocket-Version header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (!this.shouldHandle(req)) {
          abortHandshake(socket, 400);
          return;
        }
        const secWebSocketProtocol = req.headers["sec-websocket-protocol"];
        let protocols = /* @__PURE__ */ new Set();
        if (secWebSocketProtocol !== void 0) {
          try {
            protocols = subprotocol.parse(secWebSocketProtocol);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Protocol header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        const secWebSocketExtensions = req.headers["sec-websocket-extensions"];
        const extensions = {};
        if (this.options.perMessageDeflate && secWebSocketExtensions !== void 0) {
          const perMessageDeflate = new PerMessageDeflate(
            this.options.perMessageDeflate,
            true,
            this.options.maxPayload
          );
          try {
            const offers = extension.parse(secWebSocketExtensions);
            if (offers[PerMessageDeflate.extensionName]) {
              perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
              extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
            }
          } catch (err) {
            const message = "Invalid or unacceptable Sec-WebSocket-Extensions header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        if (this.options.verifyClient) {
          const info = {
            origin: req.headers[`${version === 8 ? "sec-websocket-origin" : "origin"}`],
            secure: !!(req.socket.authorized || req.socket.encrypted),
            req
          };
          if (this.options.verifyClient.length === 2) {
            this.options.verifyClient(info, (verified, code, message, headers) => {
              if (!verified) {
                return abortHandshake(socket, code || 401, message, headers);
              }
              this.completeUpgrade(
                extensions,
                key,
                protocols,
                req,
                socket,
                head,
                cb
              );
            });
            return;
          }
          if (!this.options.verifyClient(info))
            return abortHandshake(socket, 401);
        }
        this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
      }
      completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
        if (!socket.readable || !socket.writable)
          return socket.destroy();
        if (socket[kWebSocket]) {
          throw new Error(
            "server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration"
          );
        }
        if (this._state > RUNNING)
          return abortHandshake(socket, 503);
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        const headers = [
          "HTTP/1.1 101 Switching Protocols",
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Accept: ${digest}`
        ];
        const ws = new this.options.WebSocket(null);
        if (protocols.size) {
          const protocol = this.options.handleProtocols ? this.options.handleProtocols(protocols, req) : protocols.values().next().value;
          if (protocol) {
            headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
            ws._protocol = protocol;
          }
        }
        if (extensions[PerMessageDeflate.extensionName]) {
          const params = extensions[PerMessageDeflate.extensionName].params;
          const value = extension.format({
            [PerMessageDeflate.extensionName]: [params]
          });
          headers.push(`Sec-WebSocket-Extensions: ${value}`);
          ws._extensions = extensions;
        }
        this.emit("headers", headers, req);
        socket.write(headers.concat("\r\n").join("\r\n"));
        socket.removeListener("error", socketOnError);
        ws.setSocket(socket, head, {
          maxPayload: this.options.maxPayload,
          skipUTF8Validation: this.options.skipUTF8Validation
        });
        if (this.clients) {
          this.clients.add(ws);
          ws.on("close", () => {
            this.clients.delete(ws);
            if (this._shouldEmitClose && !this.clients.size) {
              process.nextTick(emitClose, this);
            }
          });
        }
        cb(ws, req);
      }
    };
    module.exports = WebSocketServer2;
    function addListeners(server2, map) {
      for (const event of Object.keys(map))
        server2.on(event, map[event]);
      return function removeListeners() {
        for (const event of Object.keys(map)) {
          server2.removeListener(event, map[event]);
        }
      };
    }
    function emitClose(server2) {
      server2._state = CLOSED;
      server2.emit("close");
    }
    function socketOnError() {
      this.destroy();
    }
    function abortHandshake(socket, code, message, headers) {
      message = message || http.STATUS_CODES[code];
      headers = {
        Connection: "close",
        "Content-Type": "text/html",
        "Content-Length": Buffer.byteLength(message),
        ...headers
      };
      socket.once("finish", socket.destroy);
      socket.end(
        `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r
` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message
      );
    }
    function abortHandshakeOrEmitwsClientError(server2, req, socket, code, message) {
      if (server2.listenerCount("wsClientError")) {
        const err = new Error(message);
        Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);
        server2.emit("wsClientError", err, socket, req);
      } else {
        abortHandshake(socket, code, message);
      }
    }
  }
});

// node_modules/bigi/package.json
var require_package2 = __commonJS({
  "node_modules/bigi/package.json"(exports, module) {
    module.exports = "./package-Y7KCZUKR.json";
  }
});

// node_modules/bigi/lib/bigi.js
var require_bigi = __commonJS({
  "node_modules/bigi/lib/bigi.js"(exports, module) {
    function BigInteger2(a, b, c) {
      if (!(this instanceof BigInteger2))
        return new BigInteger2(a, b, c);
      if (a != null) {
        if ("number" == typeof a)
          this.fromNumber(a, b, c);
        else if (b == null && "string" != typeof a)
          this.fromString(a, 256);
        else
          this.fromString(a, b);
      }
    }
    var proto = BigInteger2.prototype;
    proto.__bigi = require_package2().version;
    BigInteger2.isBigInteger = function(obj, check_ver) {
      return obj && obj.__bigi && (!check_ver || obj.__bigi === proto.__bigi);
    };
    var dbits;
    function am1(i, x, w, j, c, n) {
      while (--n >= 0) {
        var v = x * this[i++] + w[j] + c;
        c = Math.floor(v / 67108864);
        w[j++] = v & 67108863;
      }
      return c;
    }
    BigInteger2.prototype.am = am1;
    dbits = 26;
    BigInteger2.prototype.DB = dbits;
    BigInteger2.prototype.DM = (1 << dbits) - 1;
    var DV = BigInteger2.prototype.DV = 1 << dbits;
    var BI_FP = 52;
    BigInteger2.prototype.FV = Math.pow(2, BI_FP);
    BigInteger2.prototype.F1 = BI_FP - dbits;
    BigInteger2.prototype.F2 = 2 * dbits - BI_FP;
    var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
    var BI_RC = new Array();
    var rr;
    var vv;
    rr = "0".charCodeAt(0);
    for (vv = 0; vv <= 9; ++vv)
      BI_RC[rr++] = vv;
    rr = "a".charCodeAt(0);
    for (vv = 10; vv < 36; ++vv)
      BI_RC[rr++] = vv;
    rr = "A".charCodeAt(0);
    for (vv = 10; vv < 36; ++vv)
      BI_RC[rr++] = vv;
    function int2char(n) {
      return BI_RM.charAt(n);
    }
    function intAt(s, i) {
      var c = BI_RC[s.charCodeAt(i)];
      return c == null ? -1 : c;
    }
    function bnpCopyTo(r) {
      for (var i = this.t - 1; i >= 0; --i)
        r[i] = this[i];
      r.t = this.t;
      r.s = this.s;
    }
    function bnpFromInt(x) {
      this.t = 1;
      this.s = x < 0 ? -1 : 0;
      if (x > 0)
        this[0] = x;
      else if (x < -1)
        this[0] = x + DV;
      else
        this.t = 0;
    }
    function nbv(i) {
      var r = new BigInteger2();
      r.fromInt(i);
      return r;
    }
    function bnpFromString(s, b) {
      var self = this;
      var k;
      if (b == 16)
        k = 4;
      else if (b == 8)
        k = 3;
      else if (b == 256)
        k = 8;
      else if (b == 2)
        k = 1;
      else if (b == 32)
        k = 5;
      else if (b == 4)
        k = 2;
      else {
        self.fromRadix(s, b);
        return;
      }
      self.t = 0;
      self.s = 0;
      var i = s.length, mi = false, sh = 0;
      while (--i >= 0) {
        var x = k == 8 ? s[i] & 255 : intAt(s, i);
        if (x < 0) {
          if (s.charAt(i) == "-")
            mi = true;
          continue;
        }
        mi = false;
        if (sh == 0)
          self[self.t++] = x;
        else if (sh + k > self.DB) {
          self[self.t - 1] |= (x & (1 << self.DB - sh) - 1) << sh;
          self[self.t++] = x >> self.DB - sh;
        } else
          self[self.t - 1] |= x << sh;
        sh += k;
        if (sh >= self.DB)
          sh -= self.DB;
      }
      if (k == 8 && (s[0] & 128) != 0) {
        self.s = -1;
        if (sh > 0)
          self[self.t - 1] |= (1 << self.DB - sh) - 1 << sh;
      }
      self.clamp();
      if (mi)
        BigInteger2.ZERO.subTo(self, self);
    }
    function bnpClamp() {
      var c = this.s & this.DM;
      while (this.t > 0 && this[this.t - 1] == c)
        --this.t;
    }
    function bnToString(b) {
      var self = this;
      if (self.s < 0)
        return "-" + self.negate().toString(b);
      var k;
      if (b == 16)
        k = 4;
      else if (b == 8)
        k = 3;
      else if (b == 2)
        k = 1;
      else if (b == 32)
        k = 5;
      else if (b == 4)
        k = 2;
      else
        return self.toRadix(b);
      var km = (1 << k) - 1, d, m = false, r = "", i = self.t;
      var p = self.DB - i * self.DB % k;
      if (i-- > 0) {
        if (p < self.DB && (d = self[i] >> p) > 0) {
          m = true;
          r = int2char(d);
        }
        while (i >= 0) {
          if (p < k) {
            d = (self[i] & (1 << p) - 1) << k - p;
            d |= self[--i] >> (p += self.DB - k);
          } else {
            d = self[i] >> (p -= k) & km;
            if (p <= 0) {
              p += self.DB;
              --i;
            }
          }
          if (d > 0)
            m = true;
          if (m)
            r += int2char(d);
        }
      }
      return m ? r : "0";
    }
    function bnNegate() {
      var r = new BigInteger2();
      BigInteger2.ZERO.subTo(this, r);
      return r;
    }
    function bnAbs() {
      return this.s < 0 ? this.negate() : this;
    }
    function bnCompareTo(a) {
      var r = this.s - a.s;
      if (r != 0)
        return r;
      var i = this.t;
      r = i - a.t;
      if (r != 0)
        return this.s < 0 ? -r : r;
      while (--i >= 0)
        if ((r = this[i] - a[i]) != 0)
          return r;
      return 0;
    }
    function nbits(x) {
      var r = 1, t;
      if ((t = x >>> 16) != 0) {
        x = t;
        r += 16;
      }
      if ((t = x >> 8) != 0) {
        x = t;
        r += 8;
      }
      if ((t = x >> 4) != 0) {
        x = t;
        r += 4;
      }
      if ((t = x >> 2) != 0) {
        x = t;
        r += 2;
      }
      if ((t = x >> 1) != 0) {
        x = t;
        r += 1;
      }
      return r;
    }
    function bnBitLength() {
      if (this.t <= 0)
        return 0;
      return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM);
    }
    function bnByteLength() {
      return this.bitLength() >> 3;
    }
    function bnpDLShiftTo(n, r) {
      var i;
      for (i = this.t - 1; i >= 0; --i)
        r[i + n] = this[i];
      for (i = n - 1; i >= 0; --i)
        r[i] = 0;
      r.t = this.t + n;
      r.s = this.s;
    }
    function bnpDRShiftTo(n, r) {
      for (var i = n; i < this.t; ++i)
        r[i - n] = this[i];
      r.t = Math.max(this.t - n, 0);
      r.s = this.s;
    }
    function bnpLShiftTo(n, r) {
      var self = this;
      var bs = n % self.DB;
      var cbs = self.DB - bs;
      var bm = (1 << cbs) - 1;
      var ds = Math.floor(n / self.DB), c = self.s << bs & self.DM, i;
      for (i = self.t - 1; i >= 0; --i) {
        r[i + ds + 1] = self[i] >> cbs | c;
        c = (self[i] & bm) << bs;
      }
      for (i = ds - 1; i >= 0; --i)
        r[i] = 0;
      r[ds] = c;
      r.t = self.t + ds + 1;
      r.s = self.s;
      r.clamp();
    }
    function bnpRShiftTo(n, r) {
      var self = this;
      r.s = self.s;
      var ds = Math.floor(n / self.DB);
      if (ds >= self.t) {
        r.t = 0;
        return;
      }
      var bs = n % self.DB;
      var cbs = self.DB - bs;
      var bm = (1 << bs) - 1;
      r[0] = self[ds] >> bs;
      for (var i = ds + 1; i < self.t; ++i) {
        r[i - ds - 1] |= (self[i] & bm) << cbs;
        r[i - ds] = self[i] >> bs;
      }
      if (bs > 0)
        r[self.t - ds - 1] |= (self.s & bm) << cbs;
      r.t = self.t - ds;
      r.clamp();
    }
    function bnpSubTo(a, r) {
      var self = this;
      var i = 0, c = 0, m = Math.min(a.t, self.t);
      while (i < m) {
        c += self[i] - a[i];
        r[i++] = c & self.DM;
        c >>= self.DB;
      }
      if (a.t < self.t) {
        c -= a.s;
        while (i < self.t) {
          c += self[i];
          r[i++] = c & self.DM;
          c >>= self.DB;
        }
        c += self.s;
      } else {
        c += self.s;
        while (i < a.t) {
          c -= a[i];
          r[i++] = c & self.DM;
          c >>= self.DB;
        }
        c -= a.s;
      }
      r.s = c < 0 ? -1 : 0;
      if (c < -1)
        r[i++] = self.DV + c;
      else if (c > 0)
        r[i++] = c;
      r.t = i;
      r.clamp();
    }
    function bnpMultiplyTo(a, r) {
      var x = this.abs(), y = a.abs();
      var i = x.t;
      r.t = i + y.t;
      while (--i >= 0)
        r[i] = 0;
      for (i = 0; i < y.t; ++i)
        r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
      r.s = 0;
      r.clamp();
      if (this.s != a.s)
        BigInteger2.ZERO.subTo(r, r);
    }
    function bnpSquareTo(r) {
      var x = this.abs();
      var i = r.t = 2 * x.t;
      while (--i >= 0)
        r[i] = 0;
      for (i = 0; i < x.t - 1; ++i) {
        var c = x.am(i, x[i], r, 2 * i, 0, 1);
        if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
          r[i + x.t] -= x.DV;
          r[i + x.t + 1] = 1;
        }
      }
      if (r.t > 0)
        r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
      r.s = 0;
      r.clamp();
    }
    function bnpDivRemTo(m, q, r) {
      var self = this;
      var pm = m.abs();
      if (pm.t <= 0)
        return;
      var pt = self.abs();
      if (pt.t < pm.t) {
        if (q != null)
          q.fromInt(0);
        if (r != null)
          self.copyTo(r);
        return;
      }
      if (r == null)
        r = new BigInteger2();
      var y = new BigInteger2(), ts = self.s, ms = m.s;
      var nsh = self.DB - nbits(pm[pm.t - 1]);
      if (nsh > 0) {
        pm.lShiftTo(nsh, y);
        pt.lShiftTo(nsh, r);
      } else {
        pm.copyTo(y);
        pt.copyTo(r);
      }
      var ys = y.t;
      var y0 = y[ys - 1];
      if (y0 == 0)
        return;
      var yt = y0 * (1 << self.F1) + (ys > 1 ? y[ys - 2] >> self.F2 : 0);
      var d1 = self.FV / yt, d2 = (1 << self.F1) / yt, e = 1 << self.F2;
      var i = r.t, j = i - ys, t = q == null ? new BigInteger2() : q;
      y.dlShiftTo(j, t);
      if (r.compareTo(t) >= 0) {
        r[r.t++] = 1;
        r.subTo(t, r);
      }
      BigInteger2.ONE.dlShiftTo(ys, t);
      t.subTo(y, y);
      while (y.t < ys)
        y[y.t++] = 0;
      while (--j >= 0) {
        var qd = r[--i] == y0 ? self.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
        if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
          y.dlShiftTo(j, t);
          r.subTo(t, r);
          while (r[i] < --qd)
            r.subTo(t, r);
        }
      }
      if (q != null) {
        r.drShiftTo(ys, q);
        if (ts != ms)
          BigInteger2.ZERO.subTo(q, q);
      }
      r.t = ys;
      r.clamp();
      if (nsh > 0)
        r.rShiftTo(nsh, r);
      if (ts < 0)
        BigInteger2.ZERO.subTo(r, r);
    }
    function bnMod(a) {
      var r = new BigInteger2();
      this.abs().divRemTo(a, null, r);
      if (this.s < 0 && r.compareTo(BigInteger2.ZERO) > 0)
        a.subTo(r, r);
      return r;
    }
    function Classic(m) {
      this.m = m;
    }
    function cConvert(x) {
      if (x.s < 0 || x.compareTo(this.m) >= 0)
        return x.mod(this.m);
      else
        return x;
    }
    function cRevert(x) {
      return x;
    }
    function cReduce(x) {
      x.divRemTo(this.m, null, x);
    }
    function cMulTo(x, y, r) {
      x.multiplyTo(y, r);
      this.reduce(r);
    }
    function cSqrTo(x, r) {
      x.squareTo(r);
      this.reduce(r);
    }
    Classic.prototype.convert = cConvert;
    Classic.prototype.revert = cRevert;
    Classic.prototype.reduce = cReduce;
    Classic.prototype.mulTo = cMulTo;
    Classic.prototype.sqrTo = cSqrTo;
    function bnpInvDigit() {
      if (this.t < 1)
        return 0;
      var x = this[0];
      if ((x & 1) == 0)
        return 0;
      var y = x & 3;
      y = y * (2 - (x & 15) * y) & 15;
      y = y * (2 - (x & 255) * y) & 255;
      y = y * (2 - ((x & 65535) * y & 65535)) & 65535;
      y = y * (2 - x * y % this.DV) % this.DV;
      return y > 0 ? this.DV - y : -y;
    }
    function Montgomery(m) {
      this.m = m;
      this.mp = m.invDigit();
      this.mpl = this.mp & 32767;
      this.mph = this.mp >> 15;
      this.um = (1 << m.DB - 15) - 1;
      this.mt2 = 2 * m.t;
    }
    function montConvert(x) {
      var r = new BigInteger2();
      x.abs().dlShiftTo(this.m.t, r);
      r.divRemTo(this.m, null, r);
      if (x.s < 0 && r.compareTo(BigInteger2.ZERO) > 0)
        this.m.subTo(r, r);
      return r;
    }
    function montRevert(x) {
      var r = new BigInteger2();
      x.copyTo(r);
      this.reduce(r);
      return r;
    }
    function montReduce(x) {
      while (x.t <= this.mt2)
        x[x.t++] = 0;
      for (var i = 0; i < this.m.t; ++i) {
        var j = x[i] & 32767;
        var u0 = j * this.mpl + ((j * this.mph + (x[i] >> 15) * this.mpl & this.um) << 15) & x.DM;
        j = i + this.m.t;
        x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
        while (x[j] >= x.DV) {
          x[j] -= x.DV;
          x[++j]++;
        }
      }
      x.clamp();
      x.drShiftTo(this.m.t, x);
      if (x.compareTo(this.m) >= 0)
        x.subTo(this.m, x);
    }
    function montSqrTo(x, r) {
      x.squareTo(r);
      this.reduce(r);
    }
    function montMulTo(x, y, r) {
      x.multiplyTo(y, r);
      this.reduce(r);
    }
    Montgomery.prototype.convert = montConvert;
    Montgomery.prototype.revert = montRevert;
    Montgomery.prototype.reduce = montReduce;
    Montgomery.prototype.mulTo = montMulTo;
    Montgomery.prototype.sqrTo = montSqrTo;
    function bnpIsEven() {
      return (this.t > 0 ? this[0] & 1 : this.s) == 0;
    }
    function bnpExp(e, z) {
      if (e > 4294967295 || e < 1)
        return BigInteger2.ONE;
      var r = new BigInteger2(), r2 = new BigInteger2(), g = z.convert(this), i = nbits(e) - 1;
      g.copyTo(r);
      while (--i >= 0) {
        z.sqrTo(r, r2);
        if ((e & 1 << i) > 0)
          z.mulTo(r2, g, r);
        else {
          var t = r;
          r = r2;
          r2 = t;
        }
      }
      return z.revert(r);
    }
    function bnModPowInt(e, m) {
      var z;
      if (e < 256 || m.isEven())
        z = new Classic(m);
      else
        z = new Montgomery(m);
      return this.exp(e, z);
    }
    proto.copyTo = bnpCopyTo;
    proto.fromInt = bnpFromInt;
    proto.fromString = bnpFromString;
    proto.clamp = bnpClamp;
    proto.dlShiftTo = bnpDLShiftTo;
    proto.drShiftTo = bnpDRShiftTo;
    proto.lShiftTo = bnpLShiftTo;
    proto.rShiftTo = bnpRShiftTo;
    proto.subTo = bnpSubTo;
    proto.multiplyTo = bnpMultiplyTo;
    proto.squareTo = bnpSquareTo;
    proto.divRemTo = bnpDivRemTo;
    proto.invDigit = bnpInvDigit;
    proto.isEven = bnpIsEven;
    proto.exp = bnpExp;
    proto.toString = bnToString;
    proto.negate = bnNegate;
    proto.abs = bnAbs;
    proto.compareTo = bnCompareTo;
    proto.bitLength = bnBitLength;
    proto.byteLength = bnByteLength;
    proto.mod = bnMod;
    proto.modPowInt = bnModPowInt;
    function bnClone() {
      var r = new BigInteger2();
      this.copyTo(r);
      return r;
    }
    function bnIntValue() {
      if (this.s < 0) {
        if (this.t == 1)
          return this[0] - this.DV;
        else if (this.t == 0)
          return -1;
      } else if (this.t == 1)
        return this[0];
      else if (this.t == 0)
        return 0;
      return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0];
    }
    function bnByteValue() {
      return this.t == 0 ? this.s : this[0] << 24 >> 24;
    }
    function bnShortValue() {
      return this.t == 0 ? this.s : this[0] << 16 >> 16;
    }
    function bnpChunkSize(r) {
      return Math.floor(Math.LN2 * this.DB / Math.log(r));
    }
    function bnSigNum() {
      if (this.s < 0)
        return -1;
      else if (this.t <= 0 || this.t == 1 && this[0] <= 0)
        return 0;
      else
        return 1;
    }
    function bnpToRadix(b) {
      if (b == null)
        b = 10;
      if (this.signum() == 0 || b < 2 || b > 36)
        return "0";
      var cs = this.chunkSize(b);
      var a = Math.pow(b, cs);
      var d = nbv(a), y = new BigInteger2(), z = new BigInteger2(), r = "";
      this.divRemTo(d, y, z);
      while (y.signum() > 0) {
        r = (a + z.intValue()).toString(b).substr(1) + r;
        y.divRemTo(d, y, z);
      }
      return z.intValue().toString(b) + r;
    }
    function bnpFromRadix(s, b) {
      var self = this;
      self.fromInt(0);
      if (b == null)
        b = 10;
      var cs = self.chunkSize(b);
      var d = Math.pow(b, cs), mi = false, j = 0, w = 0;
      for (var i = 0; i < s.length; ++i) {
        var x = intAt(s, i);
        if (x < 0) {
          if (s.charAt(i) == "-" && self.signum() == 0)
            mi = true;
          continue;
        }
        w = b * w + x;
        if (++j >= cs) {
          self.dMultiply(d);
          self.dAddOffset(w, 0);
          j = 0;
          w = 0;
        }
      }
      if (j > 0) {
        self.dMultiply(Math.pow(b, j));
        self.dAddOffset(w, 0);
      }
      if (mi)
        BigInteger2.ZERO.subTo(self, self);
    }
    function bnpFromNumber(a, b, c) {
      var self = this;
      if ("number" == typeof b) {
        if (a < 2)
          self.fromInt(1);
        else {
          self.fromNumber(a, c);
          if (!self.testBit(a - 1))
            self.bitwiseTo(BigInteger2.ONE.shiftLeft(a - 1), op_or, self);
          if (self.isEven())
            self.dAddOffset(1, 0);
          while (!self.isProbablePrime(b)) {
            self.dAddOffset(2, 0);
            if (self.bitLength() > a)
              self.subTo(BigInteger2.ONE.shiftLeft(a - 1), self);
          }
        }
      } else {
        var x = new Array(), t = a & 7;
        x.length = (a >> 3) + 1;
        b.nextBytes(x);
        if (t > 0)
          x[0] &= (1 << t) - 1;
        else
          x[0] = 0;
        self.fromString(x, 256);
      }
    }
    function bnToByteArray() {
      var self = this;
      var i = self.t, r = new Array();
      r[0] = self.s;
      var p = self.DB - i * self.DB % 8, d, k = 0;
      if (i-- > 0) {
        if (p < self.DB && (d = self[i] >> p) != (self.s & self.DM) >> p)
          r[k++] = d | self.s << self.DB - p;
        while (i >= 0) {
          if (p < 8) {
            d = (self[i] & (1 << p) - 1) << 8 - p;
            d |= self[--i] >> (p += self.DB - 8);
          } else {
            d = self[i] >> (p -= 8) & 255;
            if (p <= 0) {
              p += self.DB;
              --i;
            }
          }
          if ((d & 128) != 0)
            d |= -256;
          if (k === 0 && (self.s & 128) != (d & 128))
            ++k;
          if (k > 0 || d != self.s)
            r[k++] = d;
        }
      }
      return r;
    }
    function bnEquals(a) {
      return this.compareTo(a) == 0;
    }
    function bnMin(a) {
      return this.compareTo(a) < 0 ? this : a;
    }
    function bnMax(a) {
      return this.compareTo(a) > 0 ? this : a;
    }
    function bnpBitwiseTo(a, op, r) {
      var self = this;
      var i, f, m = Math.min(a.t, self.t);
      for (i = 0; i < m; ++i)
        r[i] = op(self[i], a[i]);
      if (a.t < self.t) {
        f = a.s & self.DM;
        for (i = m; i < self.t; ++i)
          r[i] = op(self[i], f);
        r.t = self.t;
      } else {
        f = self.s & self.DM;
        for (i = m; i < a.t; ++i)
          r[i] = op(f, a[i]);
        r.t = a.t;
      }
      r.s = op(self.s, a.s);
      r.clamp();
    }
    function op_and(x, y) {
      return x & y;
    }
    function bnAnd(a) {
      var r = new BigInteger2();
      this.bitwiseTo(a, op_and, r);
      return r;
    }
    function op_or(x, y) {
      return x | y;
    }
    function bnOr(a) {
      var r = new BigInteger2();
      this.bitwiseTo(a, op_or, r);
      return r;
    }
    function op_xor(x, y) {
      return x ^ y;
    }
    function bnXor(a) {
      var r = new BigInteger2();
      this.bitwiseTo(a, op_xor, r);
      return r;
    }
    function op_andnot(x, y) {
      return x & ~y;
    }
    function bnAndNot(a) {
      var r = new BigInteger2();
      this.bitwiseTo(a, op_andnot, r);
      return r;
    }
    function bnNot() {
      var r = new BigInteger2();
      for (var i = 0; i < this.t; ++i)
        r[i] = this.DM & ~this[i];
      r.t = this.t;
      r.s = ~this.s;
      return r;
    }
    function bnShiftLeft(n) {
      var r = new BigInteger2();
      if (n < 0)
        this.rShiftTo(-n, r);
      else
        this.lShiftTo(n, r);
      return r;
    }
    function bnShiftRight(n) {
      var r = new BigInteger2();
      if (n < 0)
        this.lShiftTo(-n, r);
      else
        this.rShiftTo(n, r);
      return r;
    }
    function lbit(x) {
      if (x == 0)
        return -1;
      var r = 0;
      if ((x & 65535) == 0) {
        x >>= 16;
        r += 16;
      }
      if ((x & 255) == 0) {
        x >>= 8;
        r += 8;
      }
      if ((x & 15) == 0) {
        x >>= 4;
        r += 4;
      }
      if ((x & 3) == 0) {
        x >>= 2;
        r += 2;
      }
      if ((x & 1) == 0)
        ++r;
      return r;
    }
    function bnGetLowestSetBit() {
      for (var i = 0; i < this.t; ++i)
        if (this[i] != 0)
          return i * this.DB + lbit(this[i]);
      if (this.s < 0)
        return this.t * this.DB;
      return -1;
    }
    function cbit(x) {
      var r = 0;
      while (x != 0) {
        x &= x - 1;
        ++r;
      }
      return r;
    }
    function bnBitCount() {
      var r = 0, x = this.s & this.DM;
      for (var i = 0; i < this.t; ++i)
        r += cbit(this[i] ^ x);
      return r;
    }
    function bnTestBit(n) {
      var j = Math.floor(n / this.DB);
      if (j >= this.t)
        return this.s != 0;
      return (this[j] & 1 << n % this.DB) != 0;
    }
    function bnpChangeBit(n, op) {
      var r = BigInteger2.ONE.shiftLeft(n);
      this.bitwiseTo(r, op, r);
      return r;
    }
    function bnSetBit(n) {
      return this.changeBit(n, op_or);
    }
    function bnClearBit(n) {
      return this.changeBit(n, op_andnot);
    }
    function bnFlipBit(n) {
      return this.changeBit(n, op_xor);
    }
    function bnpAddTo(a, r) {
      var self = this;
      var i = 0, c = 0, m = Math.min(a.t, self.t);
      while (i < m) {
        c += self[i] + a[i];
        r[i++] = c & self.DM;
        c >>= self.DB;
      }
      if (a.t < self.t) {
        c += a.s;
        while (i < self.t) {
          c += self[i];
          r[i++] = c & self.DM;
          c >>= self.DB;
        }
        c += self.s;
      } else {
        c += self.s;
        while (i < a.t) {
          c += a[i];
          r[i++] = c & self.DM;
          c >>= self.DB;
        }
        c += a.s;
      }
      r.s = c < 0 ? -1 : 0;
      if (c > 0)
        r[i++] = c;
      else if (c < -1)
        r[i++] = self.DV + c;
      r.t = i;
      r.clamp();
    }
    function bnAdd(a) {
      var r = new BigInteger2();
      this.addTo(a, r);
      return r;
    }
    function bnSubtract(a) {
      var r = new BigInteger2();
      this.subTo(a, r);
      return r;
    }
    function bnMultiply(a) {
      var r = new BigInteger2();
      this.multiplyTo(a, r);
      return r;
    }
    function bnSquare() {
      var r = new BigInteger2();
      this.squareTo(r);
      return r;
    }
    function bnDivide(a) {
      var r = new BigInteger2();
      this.divRemTo(a, r, null);
      return r;
    }
    function bnRemainder(a) {
      var r = new BigInteger2();
      this.divRemTo(a, null, r);
      return r;
    }
    function bnDivideAndRemainder(a) {
      var q = new BigInteger2(), r = new BigInteger2();
      this.divRemTo(a, q, r);
      return new Array(q, r);
    }
    function bnpDMultiply(n) {
      this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
      ++this.t;
      this.clamp();
    }
    function bnpDAddOffset(n, w) {
      if (n == 0)
        return;
      while (this.t <= w)
        this[this.t++] = 0;
      this[w] += n;
      while (this[w] >= this.DV) {
        this[w] -= this.DV;
        if (++w >= this.t)
          this[this.t++] = 0;
        ++this[w];
      }
    }
    function NullExp() {
    }
    function nNop(x) {
      return x;
    }
    function nMulTo(x, y, r) {
      x.multiplyTo(y, r);
    }
    function nSqrTo(x, r) {
      x.squareTo(r);
    }
    NullExp.prototype.convert = nNop;
    NullExp.prototype.revert = nNop;
    NullExp.prototype.mulTo = nMulTo;
    NullExp.prototype.sqrTo = nSqrTo;
    function bnPow(e) {
      return this.exp(e, new NullExp());
    }
    function bnpMultiplyLowerTo(a, n, r) {
      var i = Math.min(this.t + a.t, n);
      r.s = 0;
      r.t = i;
      while (i > 0)
        r[--i] = 0;
      var j;
      for (j = r.t - this.t; i < j; ++i)
        r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
      for (j = Math.min(a.t, n); i < j; ++i)
        this.am(0, a[i], r, i, 0, n - i);
      r.clamp();
    }
    function bnpMultiplyUpperTo(a, n, r) {
      --n;
      var i = r.t = this.t + a.t - n;
      r.s = 0;
      while (--i >= 0)
        r[i] = 0;
      for (i = Math.max(n - this.t, 0); i < a.t; ++i)
        r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
      r.clamp();
      r.drShiftTo(1, r);
    }
    function Barrett(m) {
      this.r2 = new BigInteger2();
      this.q3 = new BigInteger2();
      BigInteger2.ONE.dlShiftTo(2 * m.t, this.r2);
      this.mu = this.r2.divide(m);
      this.m = m;
    }
    function barrettConvert(x) {
      if (x.s < 0 || x.t > 2 * this.m.t)
        return x.mod(this.m);
      else if (x.compareTo(this.m) < 0)
        return x;
      else {
        var r = new BigInteger2();
        x.copyTo(r);
        this.reduce(r);
        return r;
      }
    }
    function barrettRevert(x) {
      return x;
    }
    function barrettReduce(x) {
      var self = this;
      x.drShiftTo(self.m.t - 1, self.r2);
      if (x.t > self.m.t + 1) {
        x.t = self.m.t + 1;
        x.clamp();
      }
      self.mu.multiplyUpperTo(self.r2, self.m.t + 1, self.q3);
      self.m.multiplyLowerTo(self.q3, self.m.t + 1, self.r2);
      while (x.compareTo(self.r2) < 0)
        x.dAddOffset(1, self.m.t + 1);
      x.subTo(self.r2, x);
      while (x.compareTo(self.m) >= 0)
        x.subTo(self.m, x);
    }
    function barrettSqrTo(x, r) {
      x.squareTo(r);
      this.reduce(r);
    }
    function barrettMulTo(x, y, r) {
      x.multiplyTo(y, r);
      this.reduce(r);
    }
    Barrett.prototype.convert = barrettConvert;
    Barrett.prototype.revert = barrettRevert;
    Barrett.prototype.reduce = barrettReduce;
    Barrett.prototype.mulTo = barrettMulTo;
    Barrett.prototype.sqrTo = barrettSqrTo;
    function bnModPow(e, m) {
      var i = e.bitLength(), k, r = nbv(1), z;
      if (i <= 0)
        return r;
      else if (i < 18)
        k = 1;
      else if (i < 48)
        k = 3;
      else if (i < 144)
        k = 4;
      else if (i < 768)
        k = 5;
      else
        k = 6;
      if (i < 8)
        z = new Classic(m);
      else if (m.isEven())
        z = new Barrett(m);
      else
        z = new Montgomery(m);
      var g = new Array(), n = 3, k1 = k - 1, km = (1 << k) - 1;
      g[1] = z.convert(this);
      if (k > 1) {
        var g2 = new BigInteger2();
        z.sqrTo(g[1], g2);
        while (n <= km) {
          g[n] = new BigInteger2();
          z.mulTo(g2, g[n - 2], g[n]);
          n += 2;
        }
      }
      var j = e.t - 1, w, is1 = true, r2 = new BigInteger2(), t;
      i = nbits(e[j]) - 1;
      while (j >= 0) {
        if (i >= k1)
          w = e[j] >> i - k1 & km;
        else {
          w = (e[j] & (1 << i + 1) - 1) << k1 - i;
          if (j > 0)
            w |= e[j - 1] >> this.DB + i - k1;
        }
        n = k;
        while ((w & 1) == 0) {
          w >>= 1;
          --n;
        }
        if ((i -= n) < 0) {
          i += this.DB;
          --j;
        }
        if (is1) {
          g[w].copyTo(r);
          is1 = false;
        } else {
          while (n > 1) {
            z.sqrTo(r, r2);
            z.sqrTo(r2, r);
            n -= 2;
          }
          if (n > 0)
            z.sqrTo(r, r2);
          else {
            t = r;
            r = r2;
            r2 = t;
          }
          z.mulTo(r2, g[w], r);
        }
        while (j >= 0 && (e[j] & 1 << i) == 0) {
          z.sqrTo(r, r2);
          t = r;
          r = r2;
          r2 = t;
          if (--i < 0) {
            i = this.DB - 1;
            --j;
          }
        }
      }
      return z.revert(r);
    }
    function bnGCD(a) {
      var x = this.s < 0 ? this.negate() : this.clone();
      var y = a.s < 0 ? a.negate() : a.clone();
      if (x.compareTo(y) < 0) {
        var t = x;
        x = y;
        y = t;
      }
      var i = x.getLowestSetBit(), g = y.getLowestSetBit();
      if (g < 0)
        return x;
      if (i < g)
        g = i;
      if (g > 0) {
        x.rShiftTo(g, x);
        y.rShiftTo(g, y);
      }
      while (x.signum() > 0) {
        if ((i = x.getLowestSetBit()) > 0)
          x.rShiftTo(i, x);
        if ((i = y.getLowestSetBit()) > 0)
          y.rShiftTo(i, y);
        if (x.compareTo(y) >= 0) {
          x.subTo(y, x);
          x.rShiftTo(1, x);
        } else {
          y.subTo(x, y);
          y.rShiftTo(1, y);
        }
      }
      if (g > 0)
        y.lShiftTo(g, y);
      return y;
    }
    function bnpModInt(n) {
      if (n <= 0)
        return 0;
      var d = this.DV % n, r = this.s < 0 ? n - 1 : 0;
      if (this.t > 0)
        if (d == 0)
          r = this[0] % n;
        else
          for (var i = this.t - 1; i >= 0; --i)
            r = (d * r + this[i]) % n;
      return r;
    }
    function bnModInverse(m) {
      var ac = m.isEven();
      if (this.signum() === 0)
        throw new Error("division by zero");
      if (this.isEven() && ac || m.signum() == 0)
        return BigInteger2.ZERO;
      var u = m.clone(), v = this.clone();
      var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
      while (u.signum() != 0) {
        while (u.isEven()) {
          u.rShiftTo(1, u);
          if (ac) {
            if (!a.isEven() || !b.isEven()) {
              a.addTo(this, a);
              b.subTo(m, b);
            }
            a.rShiftTo(1, a);
          } else if (!b.isEven())
            b.subTo(m, b);
          b.rShiftTo(1, b);
        }
        while (v.isEven()) {
          v.rShiftTo(1, v);
          if (ac) {
            if (!c.isEven() || !d.isEven()) {
              c.addTo(this, c);
              d.subTo(m, d);
            }
            c.rShiftTo(1, c);
          } else if (!d.isEven())
            d.subTo(m, d);
          d.rShiftTo(1, d);
        }
        if (u.compareTo(v) >= 0) {
          u.subTo(v, u);
          if (ac)
            a.subTo(c, a);
          b.subTo(d, b);
        } else {
          v.subTo(u, v);
          if (ac)
            c.subTo(a, c);
          d.subTo(b, d);
        }
      }
      if (v.compareTo(BigInteger2.ONE) != 0)
        return BigInteger2.ZERO;
      while (d.compareTo(m) >= 0)
        d.subTo(m, d);
      while (d.signum() < 0)
        d.addTo(m, d);
      return d;
    }
    var lowprimes = [
      2,
      3,
      5,
      7,
      11,
      13,
      17,
      19,
      23,
      29,
      31,
      37,
      41,
      43,
      47,
      53,
      59,
      61,
      67,
      71,
      73,
      79,
      83,
      89,
      97,
      101,
      103,
      107,
      109,
      113,
      127,
      131,
      137,
      139,
      149,
      151,
      157,
      163,
      167,
      173,
      179,
      181,
      191,
      193,
      197,
      199,
      211,
      223,
      227,
      229,
      233,
      239,
      241,
      251,
      257,
      263,
      269,
      271,
      277,
      281,
      283,
      293,
      307,
      311,
      313,
      317,
      331,
      337,
      347,
      349,
      353,
      359,
      367,
      373,
      379,
      383,
      389,
      397,
      401,
      409,
      419,
      421,
      431,
      433,
      439,
      443,
      449,
      457,
      461,
      463,
      467,
      479,
      487,
      491,
      499,
      503,
      509,
      521,
      523,
      541,
      547,
      557,
      563,
      569,
      571,
      577,
      587,
      593,
      599,
      601,
      607,
      613,
      617,
      619,
      631,
      641,
      643,
      647,
      653,
      659,
      661,
      673,
      677,
      683,
      691,
      701,
      709,
      719,
      727,
      733,
      739,
      743,
      751,
      757,
      761,
      769,
      773,
      787,
      797,
      809,
      811,
      821,
      823,
      827,
      829,
      839,
      853,
      857,
      859,
      863,
      877,
      881,
      883,
      887,
      907,
      911,
      919,
      929,
      937,
      941,
      947,
      953,
      967,
      971,
      977,
      983,
      991,
      997
    ];
    var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
    function bnIsProbablePrime(t) {
      var i, x = this.abs();
      if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
        for (i = 0; i < lowprimes.length; ++i)
          if (x[0] == lowprimes[i])
            return true;
        return false;
      }
      if (x.isEven())
        return false;
      i = 1;
      while (i < lowprimes.length) {
        var m = lowprimes[i], j = i + 1;
        while (j < lowprimes.length && m < lplim)
          m *= lowprimes[j++];
        m = x.modInt(m);
        while (i < j)
          if (m % lowprimes[i++] == 0)
            return false;
      }
      return x.millerRabin(t);
    }
    function bnpMillerRabin(t) {
      var n1 = this.subtract(BigInteger2.ONE);
      var k = n1.getLowestSetBit();
      if (k <= 0)
        return false;
      var r = n1.shiftRight(k);
      t = t + 1 >> 1;
      if (t > lowprimes.length)
        t = lowprimes.length;
      var a = new BigInteger2(null);
      var j, bases = [];
      for (var i = 0; i < t; ++i) {
        for (; ; ) {
          j = lowprimes[Math.floor(Math.random() * lowprimes.length)];
          if (bases.indexOf(j) == -1)
            break;
        }
        bases.push(j);
        a.fromInt(j);
        var y = a.modPow(r, this);
        if (y.compareTo(BigInteger2.ONE) != 0 && y.compareTo(n1) != 0) {
          var j = 1;
          while (j++ < k && y.compareTo(n1) != 0) {
            y = y.modPowInt(2, this);
            if (y.compareTo(BigInteger2.ONE) == 0)
              return false;
          }
          if (y.compareTo(n1) != 0)
            return false;
        }
      }
      return true;
    }
    proto.chunkSize = bnpChunkSize;
    proto.toRadix = bnpToRadix;
    proto.fromRadix = bnpFromRadix;
    proto.fromNumber = bnpFromNumber;
    proto.bitwiseTo = bnpBitwiseTo;
    proto.changeBit = bnpChangeBit;
    proto.addTo = bnpAddTo;
    proto.dMultiply = bnpDMultiply;
    proto.dAddOffset = bnpDAddOffset;
    proto.multiplyLowerTo = bnpMultiplyLowerTo;
    proto.multiplyUpperTo = bnpMultiplyUpperTo;
    proto.modInt = bnpModInt;
    proto.millerRabin = bnpMillerRabin;
    proto.clone = bnClone;
    proto.intValue = bnIntValue;
    proto.byteValue = bnByteValue;
    proto.shortValue = bnShortValue;
    proto.signum = bnSigNum;
    proto.toByteArray = bnToByteArray;
    proto.equals = bnEquals;
    proto.min = bnMin;
    proto.max = bnMax;
    proto.and = bnAnd;
    proto.or = bnOr;
    proto.xor = bnXor;
    proto.andNot = bnAndNot;
    proto.not = bnNot;
    proto.shiftLeft = bnShiftLeft;
    proto.shiftRight = bnShiftRight;
    proto.getLowestSetBit = bnGetLowestSetBit;
    proto.bitCount = bnBitCount;
    proto.testBit = bnTestBit;
    proto.setBit = bnSetBit;
    proto.clearBit = bnClearBit;
    proto.flipBit = bnFlipBit;
    proto.add = bnAdd;
    proto.subtract = bnSubtract;
    proto.multiply = bnMultiply;
    proto.divide = bnDivide;
    proto.remainder = bnRemainder;
    proto.divideAndRemainder = bnDivideAndRemainder;
    proto.modPow = bnModPow;
    proto.modInverse = bnModInverse;
    proto.pow = bnPow;
    proto.gcd = bnGCD;
    proto.isProbablePrime = bnIsProbablePrime;
    proto.square = bnSquare;
    BigInteger2.ZERO = nbv(0);
    BigInteger2.ONE = nbv(1);
    BigInteger2.valueOf = nbv;
    module.exports = BigInteger2;
  }
});

// node_modules/bigi/lib/convert.js
var require_convert = __commonJS({
  "node_modules/bigi/lib/convert.js"() {
    var assert = __require("assert");
    var BigInteger2 = require_bigi();
    BigInteger2.fromByteArrayUnsigned = function(byteArray) {
      if (byteArray[0] & 128) {
        return new BigInteger2([0].concat(byteArray));
      }
      return new BigInteger2(byteArray);
    };
    BigInteger2.prototype.toByteArrayUnsigned = function() {
      var byteArray = this.toByteArray();
      return byteArray[0] === 0 ? byteArray.slice(1) : byteArray;
    };
    BigInteger2.fromDERInteger = function(byteArray) {
      return new BigInteger2(byteArray);
    };
    BigInteger2.prototype.toDERInteger = BigInteger2.prototype.toByteArray;
    BigInteger2.fromBuffer = function(buffer) {
      if (buffer[0] & 128) {
        var byteArray = Array.prototype.slice.call(buffer);
        return new BigInteger2([0].concat(byteArray));
      }
      return new BigInteger2(buffer);
    };
    BigInteger2.fromHex = function(hex) {
      if (hex === "")
        return BigInteger2.ZERO;
      assert.equal(hex, hex.match(/^[A-Fa-f0-9]+/), "Invalid hex string");
      assert.equal(hex.length % 2, 0, "Incomplete hex");
      return new BigInteger2(hex, 16);
    };
    BigInteger2.prototype.toBuffer = function(size) {
      var byteArray = this.toByteArrayUnsigned();
      var zeros = [];
      var padding = size - byteArray.length;
      while (zeros.length < padding)
        zeros.push(0);
      return new Buffer(zeros.concat(byteArray));
    };
    BigInteger2.prototype.toHex = function(size) {
      return this.toBuffer(size).toString("hex");
    };
  }
});

// node_modules/bigi/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/bigi/lib/index.js"(exports, module) {
    var BigInteger2 = require_bigi();
    require_convert();
    module.exports = BigInteger2;
  }
});

// src/Server.ts
var Server = class {
  constructor(settings2, services2) {
    this.settings = settings2;
    this.services = services2;
    Server.setInstance(this);
    this.init();
    setInterval(() => {
      this.tick();
    }, this.settings.tickRate);
    process.on("exit", () => {
      console.log("Process exit.");
    });
    process.on("SIGINT", () => {
      this.cleanup();
      setTimeout(() => {
        process.exit(2);
      }, 1e3);
    });
  }
  init() {
    console.log("Started Server.");
    for (const service of this.services) {
      service.init();
    }
  }
  tick() {
    for (const service of this.services) {
      service.tick();
    }
  }
  getSettings() {
    return this.settings;
  }
  cleanup() {
    for (const service of this.services) {
      service.cleanup();
    }
  }
  static getInstance() {
    return this.instance;
  }
  static setInstance(instance) {
    if (Server.instance != null) {
      throw new Error("Singleton already set!");
    }
    Server.instance = instance;
  }
};

// src/net/StreamBuffer.ts
var BIT_MASKS = [];
for (let i = 0; i < 32; i++) {
  BIT_MASKS.push((1 << i) - 1);
}
function stringToLong(s) {
  let l = BigInt(0);
  for (let i = 0; i < s.length && i < 12; i++) {
    const c = s.charAt(i);
    const cc = s.charCodeAt(i);
    l *= BigInt(37);
    if (c >= "A" && c <= "Z")
      l += BigInt(1 + cc - 65);
    else if (c >= "a" && c <= "z")
      l += BigInt(1 + cc - 97);
    else if (c >= "0" && c <= "9")
      l += BigInt(27 + cc - 48);
  }
  while (l % BigInt(37) == BigInt(0) && l != BigInt(0))
    l /= BigInt(37);
  return l;
}
var StreamBuffer = class {
  constructor(buffer) {
    this.writerIndex = 0;
    this.readerIndex = 0;
    this.buffer = buffer;
  }
  static create(size = 5e3) {
    const buffer = Buffer.alloc(size);
    return new StreamBuffer(buffer);
  }
  openBitChannel() {
    this.bitIndex = this.writerIndex * 8;
  }
  closeBitChannel() {
    this.writerIndex = Math.floor((this.bitIndex + 7) / 8);
  }
  ensureCapacity(remaining) {
    if (this.getReadable() < remaining) {
      const newBuffer = Buffer.alloc(remaining);
      this.buffer.copy(newBuffer, 0, 0);
      this.buffer = newBuffer;
    }
  }
  ensureWritableCapacity(space) {
    if (this.getWritable() < this.writerIndex + space) {
      const newBuffer = Buffer.alloc(this.writerIndex + space);
      this.buffer.copy(newBuffer, 0, 0);
      this.buffer = newBuffer;
    }
  }
  writeBytes(fromBuffer) {
    if (fromBuffer instanceof StreamBuffer) {
      fromBuffer = fromBuffer.getData();
    }
    this.ensureCapacity(this.writerIndex + fromBuffer.length);
    fromBuffer.copy(this.getBuffer(), this.getWriterIndex(), 0);
    this.setWriterIndex(this.getWriterIndex() + fromBuffer.length);
  }
  writeBits(bitCount, value) {
    const byteCount = Math.ceil(bitCount / 8) + 1;
    this.ensureWritableCapacity((this.bitIndex + 7) / 8 + byteCount);
    let byteIndex = this.bitIndex >> 3;
    let bitOffset = 8 - (this.bitIndex & 7);
    this.bitIndex += bitCount;
    for (; bitCount > bitOffset; bitOffset = 8) {
      this.buffer[byteIndex] &= ~BIT_MASKS[bitOffset];
      this.buffer[byteIndex++] |= value >> bitCount - bitOffset & BIT_MASKS[bitOffset];
      bitCount -= bitOffset;
    }
    if (bitCount == bitOffset) {
      this.buffer[byteIndex] &= ~BIT_MASKS[bitOffset];
      this.buffer[byteIndex] |= value & BIT_MASKS[bitOffset];
    } else {
      this.buffer[byteIndex] &= ~(BIT_MASKS[bitCount] << bitOffset - bitCount);
      this.buffer[byteIndex] |= (value & BIT_MASKS[bitCount]) << bitOffset - bitCount;
    }
  }
  readUnsignedByte() {
    return this.buffer.readUInt8(this.readerIndex++);
  }
  readByte() {
    return this.buffer.readInt8(this.readerIndex++);
  }
  readByteInverted() {
    return -this.buffer.readUInt8(this.readerIndex++);
  }
  readPreNegativeOffsetByte() {
    return 128 - (this.readByte() & 255);
  }
  readPostNegativeOffsetByte() {
    return (this.readByte() & 255) - 128;
  }
  readShortBE() {
    const value = this.buffer.readInt16BE(this.readerIndex);
    this.readerIndex += 2;
    return value;
  }
  readShortLE() {
    const value = this.buffer.readInt16LE(this.readerIndex);
    this.readerIndex += 2;
    return value;
  }
  readUnsignedShortBE() {
    const value = this.buffer.readUInt16BE(this.readerIndex);
    this.readerIndex += 2;
    return value;
  }
  readUnsignedShortLE() {
    const value = this.buffer.readUInt16LE(this.readerIndex);
    this.readerIndex += 2;
    return value;
  }
  readNegativeOffsetShortLE() {
    let value = this.readByte() - 128 & 255 | (this.readByte() & 255) << 8;
    if (value > 32767) {
      value -= 65536;
    }
    return value;
  }
  readNegativeOffsetShortBE() {
    let value = (this.readByte() & 255) << 8 | this.readByte() - 128 & 255;
    if (value > 32767) {
      value -= 65536;
    }
    return value;
  }
  readIntBE() {
    const value = this.buffer.readInt32BE(this.readerIndex);
    this.readerIndex += 4;
    return value;
  }
  readLongBE() {
    const value = this.buffer.readBigInt64BE(this.readerIndex);
    this.readerIndex += 8;
    return value;
  }
  readSmart() {
    const peek = this.buffer.readUInt8(this.readerIndex);
    if (peek < 128) {
      return this.readUnsignedByte();
    } else {
      return this.readUnsignedShortBE() - 32768;
    }
  }
  readString() {
    const bytes = [];
    let b;
    while ((b = this.readByte()) !== 10) {
      bytes.push(b);
    }
    return Buffer.from(bytes).toString();
  }
  readBytes(length) {
    const result = this.buffer.slice(this.readerIndex, this.readerIndex + length + 1);
    this.readerIndex += length;
    return result;
  }
  writeByte(value) {
    this.buffer.writeInt8(value, this.writerIndex++);
  }
  writeByteInverted(value) {
    this.writeByte(-value);
  }
  writeOffsetByte(value) {
    this.writeUnsignedByte(value + 128);
  }
  writeNegativeOffsetByte(value) {
    this.writeUnsignedByte(128 - value);
  }
  writeUnsignedByte(value) {
    this.buffer.writeUInt8(value, this.writerIndex++);
  }
  writeUnsignedByteInverted(value) {
    this.writeUnsignedByte(~value & 255);
  }
  writeUnsignedShortBE(value) {
    this.buffer.writeUInt16BE(value, this.writerIndex);
    this.writerIndex += 2;
  }
  writeShortBE(value) {
    this.buffer.writeInt16BE(value, this.writerIndex);
    this.writerIndex += 2;
  }
  writeShortLE(value) {
    this.buffer.writeInt16LE(value, this.writerIndex);
    this.writerIndex += 2;
  }
  writeUnsignedShortLE(value) {
    this.buffer.writeUInt16LE(value, this.writerIndex);
    this.writerIndex += 2;
  }
  writeOffsetShortBE(value) {
    this.writeUnsignedByte(value >> 8);
    this.writeUnsignedByte(value + 128 & 255);
  }
  writeUnsignedOffsetShortBE(value) {
    this.writeUnsignedByte(value >> 8 & 255);
    this.writeUnsignedByte(value + 128 & 255);
  }
  writeNegativeOffsetShortBE(value) {
    this.writeUnsignedByte(value >> 8);
    this.writeUnsignedByte(value - 128 & 255);
  }
  writeOffsetShortLE(value) {
    this.writeUnsignedByte(value + 128 & 255);
    this.writeUnsignedByte(value >> 8);
  }
  writeUnsignedOffsetShortLE(value) {
    this.writeUnsignedByte(value + 128 & 255);
    this.writeUnsignedByte(value >> 8 & 255);
  }
  writeNegativeOffsetShortLE(value) {
    this.writeUnsignedByte(value - 128 & 255);
    this.writeUnsignedByte(value >> 8);
  }
  writeMediumME(value) {
    this.writeUnsignedByte(value >> 8);
    this.writeUnsignedByte(value >> 16);
    this.writeUnsignedByte(value);
  }
  writeIntLE(value) {
    this.buffer.writeInt32LE(value, this.writerIndex);
    this.writerIndex += 4;
  }
  writeIntBE(value) {
    this.buffer.writeInt32BE(value, this.writerIndex);
    this.writerIndex += 4;
  }
  writeIntME1(value) {
    this.writeUnsignedByte(value >> 8 & 255);
    this.writeUnsignedByte(value & 255);
    this.writeUnsignedByte(value >> 24 & 255);
    this.writeUnsignedByte(value >> 16 & 255);
  }
  writeLongBE(value) {
    this.buffer.writeBigInt64BE(value, this.writerIndex);
    this.writerIndex += 8;
  }
  writeString(value) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(value);
    for (const byte of bytes) {
      this.writeByte(byte);
    }
    this.writeByte(10);
  }
  writeSmart(value) {
    if (value >= 128) {
      this.writeShortBE(value);
    } else {
      this.writeByte(value);
    }
  }
  getReadable() {
    return this.buffer.length - this.readerIndex;
  }
  getWritable() {
    return this.buffer.length - this.writerIndex;
  }
  getBuffer() {
    return this.buffer;
  }
  getData() {
    return this.buffer.slice(0, this.writerIndex);
  }
  getUnreadData() {
    return this.buffer.slice(this.readerIndex, this.buffer.length + 1);
  }
  getSlice(position, length) {
    return new StreamBuffer(this.buffer.slice(position, position + length));
  }
  flip() {
    this.buffer = this.getData().reverse();
    return this;
  }
  getWriterIndex() {
    return this.writerIndex;
  }
  getReaderIndex() {
    return this.readerIndex;
  }
  setWriterIndex(position) {
    this.writerIndex = position;
  }
  setReaderIndex(position) {
    this.readerIndex = position;
  }
};

// src/data/client/CacheArchive.ts
var seekBzip = require_lib();
var CacheArchive = class {
  constructor(cacheFile) {
    this._compressed = false;
    this._namedFiles = /* @__PURE__ */ new Map();
    let buffer = cacheFile.data;
    buffer.setReaderIndex(0);
    const uncompressed = buffer.readUnsignedByte() << 16 | buffer.readUnsignedByte() << 8 | buffer.readUnsignedByte();
    const compressed = buffer.readUnsignedByte() << 16 | buffer.readUnsignedByte() << 8 | buffer.readUnsignedByte();
    if (uncompressed !== compressed) {
      const compressedData = buffer.getUnreadData();
      buffer = this.decompress(new StreamBuffer(compressedData));
      this._compressed = true;
    }
    const dataSize = buffer.readShortBE() & 65535;
    let offset = buffer.getReaderIndex() + dataSize * 10;
    for (let i = 0; i < dataSize; i++) {
      const nameHash = buffer.readIntBE();
      const uncompressedSize = buffer.readUnsignedByte() << 16 | buffer.readUnsignedByte() << 8 | buffer.readUnsignedByte();
      const compressedSize = buffer.readUnsignedByte() << 16 | buffer.readUnsignedByte() << 8 | buffer.readUnsignedByte();
      const archiveFile = {
        nameHash,
        uncompressedSize,
        compressedSize,
        offset
      };
      this._namedFiles.set(nameHash, archiveFile);
      offset += compressedSize;
    }
    this.data = buffer;
  }
  decompress(data) {
    const buffer = Buffer.alloc(data.getBuffer().length + 4);
    data.getBuffer().copy(buffer, 4);
    buffer[0] = "B".charCodeAt(0);
    buffer[1] = "Z".charCodeAt(0);
    buffer[2] = "h".charCodeAt(0);
    buffer[3] = "1".charCodeAt(0);
    return new StreamBuffer(seekBzip.decode(buffer));
  }
  hashFileName(fileName) {
    const INT_MAX = 2147483648;
    let hash = 0;
    fileName = fileName.toUpperCase();
    for (let i = 0; i < fileName.length; i++) {
      hash = hash * 61 + fileName.charCodeAt(i) - 32;
      while (hash > INT_MAX) {
        const diff = hash - INT_MAX;
        hash = -INT_MAX + diff;
      }
      while (hash < -INT_MAX) {
        const diff = Math.abs(hash) - INT_MAX;
        hash = INT_MAX - diff;
      }
    }
    return hash;
  }
  getFileData(fileName) {
    const nameHash = this.hashFileName(fileName);
    const archiveFile = this._namedFiles.get(nameHash);
    if (archiveFile === null || archiveFile === void 0) {
      return null;
    } else {
      const data = Buffer.alloc(archiveFile.compressedSize);
      this.data.getBuffer().copy(data, 0, archiveFile.offset);
      const buffer = new StreamBuffer(data);
      if (this.compressed) {
        return buffer;
      } else {
        return this.decompress(buffer);
      }
    }
  }
  get compressed() {
    return this._compressed;
  }
  get namedFiles() {
    return this._namedFiles;
  }
};

// src/data/client/CacheIndices.ts
var CacheIndices = class {
  constructor(definitionArchive, versionListArchive) {
    this.definitionArchive = definitionArchive;
    this.versionListArchive = versionListArchive;
    this.parseItemDefinitionIndices();
    this.parseNpcDefinitionIndices();
    this.parseLandscapeObjectDefinitionIndices();
    this.parseMapRegionIndices();
  }
  parseLandscapeObjectDefinitionIndices() {
    this._landscapeObjectDefinitionIndices = this.parseDefinitionIndices("loc.idx");
  }
  parseNpcDefinitionIndices() {
    this._npcDefinitionIndices = this.parseDefinitionIndices("npc.idx");
  }
  parseItemDefinitionIndices() {
    this._itemDefinitionIndices = this.parseDefinitionIndices("obj.idx");
  }
  parseDefinitionIndices(fileName) {
    const buffer = this.definitionArchive.getFileData(fileName);
    const indexCount = buffer.readUnsignedShortBE();
    const indices = new Array(indexCount);
    let offset = 2;
    for (let id = 0; id < indexCount; id++) {
      indices[id] = { id, offset };
      offset += buffer.readUnsignedShortBE();
    }
    return indices;
  }
  parseMapRegionIndices() {
    const buffer = this.versionListArchive.getFileData("map_index");
    const indexCount = Math.floor(buffer.getBuffer().length / 7);
    const indices = new Array(indexCount);
    for (let i = 0; i < indexCount; i++) {
      const id = buffer.readUnsignedShortBE();
      const mapRegionFileId = buffer.readUnsignedShortBE();
      const landscapeFileId = buffer.readUnsignedShortBE();
      const members = buffer.readUnsignedByte() === 1;
      indices[i] = { id, mapRegionFileId, landscapeFileId, members };
    }
    this._mapRegionIndices = indices;
  }
  get itemDefinitionIndices() {
    return this._itemDefinitionIndices;
  }
  get npcDefinitionIndices() {
    return this._npcDefinitionIndices;
  }
  get landscapeObjectDefinitionIndices() {
    return this._landscapeObjectDefinitionIndices;
  }
  get mapRegionIndices() {
    return this._mapRegionIndices;
  }
};

// src/data/client/CacheMapRegions.ts
var MapRegionTile = class {
  constructor(x, y, level, flags) {
    this.x = x;
    this.y = y;
    this.level = level;
    this.flags = flags;
    this.bridge = (flags & 2) == 2;
    this.nonWalkable = (flags & 1) == 1;
  }
};
var CacheMapRegions = class {
  constructor() {
    this._mapRegionTileList = [];
    this._mapObjectList = [];
  }
  parseMapRegions(mapRegionIndices, gameCache) {
    console.info("Parsing map regions...");
    mapRegionIndices.forEach((mapRegionIndex) => {
      const mapRegionX = (mapRegionIndex.id >> 8 & 255) * 64;
      const mapRegionY = (mapRegionIndex.id & 255) * 64;
      const mapRegionBuffer = gameCache.unzip(gameCache.getCacheFile(4, mapRegionIndex.mapRegionFileId));
      const landscapeBuffer = gameCache.unzip(gameCache.getCacheFile(4, mapRegionIndex.landscapeFileId));
      for (let level = 0; level < 4; level++) {
        for (let x = 0; x < 64; x++) {
          for (let y = 0; y < 64; y++) {
            const mapRegionTile = this.parseTile(x + mapRegionX, y + mapRegionY, level, mapRegionBuffer);
            if (mapRegionTile.flags > 0) {
              this._mapRegionTileList.push(mapRegionTile);
            }
          }
        }
      }
      this.parseLandscape(landscapeBuffer, mapRegionX, mapRegionY);
    });
    console.info(`Parsed ${this._mapRegionTileList.length} map region tiles and ${this._mapObjectList.length} landscape objects.`);
  }
  parseLandscape(buffer, mapRegionX, mapRegionY) {
    let objectId = -1;
    while (true) {
      const objectIdOffset = buffer.readSmart();
      if (objectIdOffset === 0) {
        break;
      }
      objectId += objectIdOffset;
      let objectPositionInfo = 0;
      while (true) {
        const objectPositionInfoOffset = buffer.readSmart();
        if (objectPositionInfoOffset === 0) {
          break;
        }
        objectPositionInfo += objectPositionInfoOffset - 1;
        const x = (objectPositionInfo >> 6 & 63) + mapRegionX;
        const y = (objectPositionInfo & 63) + mapRegionY;
        const level = objectPositionInfo >> 12;
        const objectMetadata = buffer.readUnsignedByte();
        const type = objectMetadata >> 2;
        const rotation = objectMetadata & 3;
        this._mapObjectList.push({ objectId, x, y, level, type, rotation });
      }
    }
  }
  parseTile(x, y, level, buffer) {
    let flags = 0;
    while (true) {
      const opcode = buffer.readByte() & 255;
      if (opcode === 0) {
        return new MapRegionTile(x, y, level, flags);
      } else if (opcode === 1) {
        buffer.readByte();
        return new MapRegionTile(x, y, level, flags);
      } else if (opcode <= 49) {
        buffer.readByte();
      } else if (opcode <= 81) {
        flags = opcode - 49;
      }
    }
  }
  get mapRegionTileList() {
    return this._mapRegionTileList;
  }
  get mapObjectList() {
    return this._mapObjectList;
  }
};

// src/data/client/parsers/ClientItemParser.ts
var ClientItemParser = class {
  static ParseItemDefinitions(indices, archive) {
    const buffer = archive.getFileData("obj.dat");
    const itemDefinitions = /* @__PURE__ */ new Map();
    indices.forEach((cacheIndex) => {
      buffer.setReaderIndex(cacheIndex.offset);
      let name;
      let description;
      let stackable = false;
      let value = -1;
      let members = false;
      let groundOptions;
      let inventoryOptions;
      let notedVersionOf = -1;
      let teamIndex = -1;
      while (true) {
        const opcode = buffer.readUnsignedByte();
        if (opcode === 0) {
          break;
        }
        switch (opcode) {
          case 1:
            buffer.readShortBE();
            break;
          case 2:
            name = buffer.readString();
            break;
          case 3:
            description = buffer.readString();
            break;
          case 4:
          case 5:
          case 6:
          case 7:
          case 8:
          case 9:
          case 10:
            buffer.readShortBE();
            break;
          case 11:
            stackable = true;
            break;
          case 12:
            value = buffer.readIntBE();
            break;
          case 16:
            members = true;
            break;
          case 23:
            buffer.readShortBE();
            buffer.readByte();
            break;
          case 24:
            buffer.readShortBE();
            break;
          case 25:
            buffer.readShortBE();
            buffer.readByte();
            break;
          case 26:
            buffer.readShortBE();
            break;
          case 30:
          case 31:
          case 32:
          case 33:
          case 34:
            if (!groundOptions)
              groundOptions = new Array(5);
            let groundOption = buffer.readString();
            if (groundOption === "hidden")
              groundOption = null;
            groundOptions[opcode - 30] = groundOption;
            break;
          case 35:
          case 36:
          case 37:
          case 38:
          case 39:
            if (!inventoryOptions)
              inventoryOptions = new Array(5);
            inventoryOptions[opcode - 35] = buffer.readString();
            break;
          case 40:
            const colorCount = buffer.readUnsignedByte();
            for (let color = 0; color < colorCount; color++) {
              buffer.readShortBE();
              buffer.readShortBE();
            }
            break;
          case 78:
          case 79:
          case 90:
          case 91:
          case 92:
          case 93:
          case 95:
            buffer.readShortBE();
            break;
          case 97:
            notedVersionOf = buffer.readUnsignedShortBE();
            break;
          case 98:
            buffer.readShortBE();
            break;
          case 100:
          case 101:
          case 102:
          case 103:
          case 104:
          case 105:
          case 106:
          case 107:
          case 108:
          case 109:
            buffer.readShortBE();
            buffer.readShortBE();
            break;
          case 110:
          case 111:
          case 112:
            buffer.readShortBE();
            break;
          case 113:
          case 114:
            buffer.readByte();
            break;
          case 115:
            teamIndex = buffer.readUnsignedByte();
            break;
        }
      }
      if (notedVersionOf !== -1) {
        if (itemDefinitions.has(notedVersionOf)) {
          const originalItem = itemDefinitions.get(notedVersionOf);
          name = originalItem.name;
          value = originalItem.value;
          members = originalItem.members;
          stackable = true;
          const nameFirstChar = name.toUpperCase().charAt(0);
          const word = nameFirstChar == "A" || nameFirstChar == "E" || nameFirstChar == "I" || nameFirstChar == "O" || nameFirstChar == "U" ? "an" : "a";
          description = `Swap this note at any bank for ${word} ${name}.`;
        }
      }
      itemDefinitions.set(cacheIndex.id, {
        id: cacheIndex.id,
        name,
        description,
        stackable,
        value,
        members,
        groundOptions,
        inventoryOptions,
        notedVersionOf,
        teamIndex
      });
    });
    return itemDefinitions;
  }
};

// src/data/client/parsers/ClientNpcParser.ts
var ClientNpcParser = class {
  static ParseNpcDefinitions(indices, archive) {
    const buffer = archive.getFileData("npc.dat");
    const npcDefinitions = /* @__PURE__ */ new Map();
    indices.forEach((cacheIndex) => {
      buffer.setReaderIndex(cacheIndex.offset);
      let name;
      let description;
      let boundary = 1;
      let sizeX = 128;
      let sizeY = 128;
      let animations = {
        stand: -1,
        walk: -1,
        turnAround: -1,
        turnRight: -1,
        turnLeft: -1
      };
      let turnDegrees = 32;
      let actions;
      let headModels;
      let minimapVisible = true;
      let invisible = false;
      let combatLevel = -1;
      let headIcon = -1;
      let clickable = true;
      while (true) {
        const opcode = buffer.readUnsignedByte();
        if (opcode === 0) {
          break;
        }
        switch (opcode) {
          case 1:
            const modelCount = buffer.readUnsignedByte();
            for (let i = 0; i < modelCount; i++) {
              buffer.readUnsignedShortBE();
            }
            break;
          case 2:
            name = buffer.readString();
            break;
          case 3:
            description = buffer.readString();
            break;
          case 12:
            boundary = buffer.readByte();
            break;
          case 13:
            animations.stand = buffer.readUnsignedShortBE();
            break;
          case 14:
            animations.walk = buffer.readUnsignedShortBE();
            break;
          case 17:
            animations.walk = buffer.readUnsignedShortBE();
            animations.turnAround = buffer.readUnsignedShortBE();
            animations.turnRight = buffer.readUnsignedShortBE();
            animations.turnLeft = buffer.readUnsignedShortBE();
            break;
          case 30:
          case 31:
          case 32:
          case 33:
          case 34:
          case 35:
          case 36:
          case 37:
          case 38:
          case 39:
            if (!actions)
              actions = new Array(5);
            let action = buffer.readString();
            if (action === "hidden")
              action = null;
            actions[opcode - 30] = action;
            break;
          case 40:
            const colorCount = buffer.readUnsignedByte();
            for (let i = 0; i < colorCount; i++) {
              buffer.readUnsignedShortBE();
              buffer.readUnsignedShortBE();
            }
            break;
          case 60:
            const headModelCount = buffer.readUnsignedByte();
            headModels = new Array(headModelCount);
            for (let i = 0; i < headModelCount; i++) {
              headModels[i] = buffer.readUnsignedShortBE();
            }
            break;
          case 90:
            buffer.readUnsignedShortBE();
            break;
          case 91:
            buffer.readUnsignedShortBE();
            break;
          case 92:
            buffer.readUnsignedShortBE();
            break;
          case 93:
            minimapVisible = false;
            break;
          case 95:
            combatLevel = buffer.readUnsignedShortBE();
            break;
          case 97:
            sizeX = buffer.readUnsignedShortBE();
            break;
          case 98:
            sizeY = buffer.readUnsignedShortBE();
            break;
          case 99:
            invisible = true;
            break;
          case 100:
            buffer.readByte();
            break;
          case 101:
            buffer.readByte();
            break;
          case 102:
            headIcon = buffer.readUnsignedShortBE();
            break;
          case 103:
            turnDegrees = buffer.readUnsignedShortBE();
            break;
          case 106:
            let varBitId = buffer.readUnsignedShortBE();
            let settingId = buffer.readUnsignedShortBE();
            if (varBitId == 65535)
              varBitId = -1;
            if (settingId == 65535)
              settingId = -1;
            const childCount = buffer.readUnsignedByte();
            for (let i = 0; i < childCount; i++) {
              buffer.readUnsignedShortBE();
            }
            break;
        }
      }
      npcDefinitions.set(cacheIndex.id, {
        id: cacheIndex.id,
        name,
        description,
        boundary,
        sizeX,
        sizeY,
        animations,
        turnDegrees,
        actions,
        headModels,
        minimapVisible,
        invisible,
        combatLevel,
        headIcon,
        clickable
      });
    });
    return npcDefinitions;
  }
};

// src/data/client/parsers/ClientLandscapeObjectParser.ts
var ClientLandscapeObjectParser = class {
  static ParseLandscapeObjectDefinitions(indices, archive) {
    const buffer = archive.getFileData("loc.dat");
    const landscapeObjectDefinitions = /* @__PURE__ */ new Map();
    indices.forEach((cacheIndex) => {
      buffer.setReaderIndex(cacheIndex.offset);
      let name;
      let description;
      let sizeX = 1;
      let sizeY = 1;
      let solid = true;
      let walkable = true;
      let hasOptions = false;
      let options = null;
      let face = 0;
      let translateX = 0;
      let translateY = 0;
      let translateLevel = 0;
      while (true) {
        const opcode = buffer.readUnsignedByte();
        if (opcode === 0) {
          break;
        }
        switch (opcode) {
          case 1:
            const modelCount1 = buffer.readUnsignedByte();
            for (let modelIdx1 = 0; modelIdx1 < modelCount1; modelIdx1++) {
              buffer.readShortBE();
              buffer.readByte();
            }
            break;
          case 2:
            name = buffer.readString();
            break;
          case 3:
            description = buffer.readString();
            break;
          case 5:
            const modelCount2 = buffer.readUnsignedByte();
            for (let modelIdx2 = 0; modelIdx2 < modelCount2; modelIdx2++) {
              buffer.readShortBE();
            }
            break;
          case 14:
            sizeX = buffer.readUnsignedByte();
            break;
          case 15:
            sizeY = buffer.readUnsignedByte();
            break;
          case 17:
            solid = false;
            break;
          case 18:
            walkable = false;
            break;
          case 19:
            hasOptions = buffer.readUnsignedByte() === 1;
            options = new Array(9);
            break;
          case 21:
            break;
          case 22:
            break;
          case 23:
            break;
          case 24:
            buffer.readShortBE();
            break;
          case 28:
            buffer.readByte();
            break;
          case 29:
            buffer.readByte();
            break;
          case 39:
            buffer.readByte();
            break;
          case 30:
          case 31:
          case 32:
          case 33:
          case 34:
          case 35:
          case 36:
          case 37:
          case 38:
            if (options === null) {
              options = new Array(9);
            }
            options[opcode - 30] = buffer.readString();
            break;
          case 40:
            const colorCount = buffer.readUnsignedByte();
            for (let colorIdx = 0; colorIdx < colorCount; colorIdx++) {
              buffer.readShortBE();
              buffer.readShortBE();
            }
            break;
          case 60:
            buffer.readShortBE();
            break;
          case 62:
          case 64:
            break;
          case 65:
          case 66:
          case 67:
            buffer.readShortBE();
            break;
          case 68:
            buffer.readShortBE();
            break;
          case 69:
            face = buffer.readUnsignedByte();
            break;
          case 70:
            translateX = buffer.readShortBE();
            break;
          case 71:
            translateY = buffer.readShortBE();
            break;
          case 72:
            translateLevel = buffer.readShortBE();
            break;
          case 73:
            break;
          case 74:
            break;
          case 75:
            buffer.readUnsignedByte();
            break;
          case 77:
            buffer.readShortBE();
            buffer.readShortBE();
            const childrenCount = buffer.readUnsignedByte();
            for (let childIdx = 0; childIdx < childrenCount; childIdx++) {
              buffer.readShortBE();
            }
            break;
        }
      }
      landscapeObjectDefinitions.set(cacheIndex.id, {
        id: cacheIndex.id,
        name,
        description,
        sizeX,
        sizeY,
        solid,
        walkable,
        hasOptions,
        options,
        face,
        translateX,
        translateY,
        translateLevel
      });
    });
    return landscapeObjectDefinitions;
  }
};

// src/data/client/ClientData.ts
var fs = __require("fs");
var path = __require("path");
var zlib = __require("zlib");
var INDEX_FILE_COUNT = 5;
var INDEX_SIZE = 6;
var DATA_BLOCK_SIZE = 512;
var DATA_HEADER_SIZE = 8;
var DATA_SIZE = DATA_BLOCK_SIZE + DATA_HEADER_SIZE;
var ClientData = class {
  constructor(cacheDirectory) {
    this.indexFiles = [];
    this.dataFile = new StreamBuffer(fs.readFileSync(path.join(cacheDirectory, "main_file_cache.dat")));
    for (let i = 0; i < INDEX_FILE_COUNT; i++) {
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
    console.info("");
  }
  unzip(cacheFile) {
    const unzippedBuffer = zlib.gunzipSync(cacheFile.data.getBuffer());
    return new StreamBuffer(unzippedBuffer);
  }
  getCacheFile(cacheId, fileId) {
    const indexFile = this.indexFiles[cacheId];
    cacheId++;
    const index = indexFile.getSlice(INDEX_SIZE * fileId, INDEX_SIZE);
    const fileSize = index.readUnsignedByte() << 16 | index.readUnsignedByte() << 8 | index.readUnsignedByte();
    const fileBlock = index.readUnsignedByte() << 16 | index.readUnsignedByte() << 8 | index.readUnsignedByte();
    let remainingBytes = fileSize;
    let currentBlock = fileBlock;
    const fileBuffer = StreamBuffer.create(fileSize);
    let cycles = 0;
    while (remainingBytes > 0) {
      let size = DATA_SIZE;
      let remaining = this.dataFile.getReadable() - currentBlock * DATA_SIZE;
      if (remaining < DATA_SIZE) {
        size = remaining;
      }
      const block = this.dataFile.getSlice(currentBlock * DATA_SIZE, size);
      let nextFileId = block.readUnsignedShortBE();
      let currentPartId = block.readUnsignedShortBE();
      let nextBlockId = block.readUnsignedByte() << 16 | block.readUnsignedByte() << 8 | block.readUnsignedByte();
      let nextCacheId = block.readUnsignedByte();
      size -= 8;
      let bytesThisCycle = remainingBytes;
      if (bytesThisCycle > DATA_BLOCK_SIZE) {
        bytesThisCycle = DATA_BLOCK_SIZE;
      }
      block.getBuffer().copy(fileBuffer.getBuffer(), fileBuffer.getWriterIndex(), block.getReaderIndex(), block.getReaderIndex() + size);
      fileBuffer.setWriterIndex(fileBuffer.getWriterIndex() + bytesThisCycle);
      remainingBytes -= bytesThisCycle;
      if (cycles != currentPartId) {
        throw "Cycle does not match part id.";
      }
      if (remainingBytes > 0) {
        if (nextCacheId != cacheId) {
          throw "Unexpected next cache id.";
        }
        if (nextFileId != fileId) {
          throw "Unexpected next file id.";
        }
      }
      cycles++;
      currentBlock = nextBlockId;
    }
    return { cacheId, fileId, data: fileBuffer };
  }
};

// src/data/server/parsers/Parser.ts
var fs2 = __require("fs");
var Parser = class {
  static requestFile(location) {
    try {
      const file = fs2.readFileSync(`./dist/${location}`);
      const data = JSON.parse(file);
      return data;
    } catch (error) {
      throw Error(`Could not process file at ${location}.`);
    }
  }
  static createHashmap(data, key) {
    const map = /* @__PURE__ */ new Map();
    for (let entry of data) {
      if (!entry[key]) {
        throw Error("Key not found in data");
      }
      map.set(entry[key], entry);
    }
    return map;
  }
};

// src/data/server/parsers/ItemParser.ts
var ItemParser = class {
  static ParseNumber(str) {
    if (!str)
      return null;
    return parseInt(str);
  }
  static ParseBoolean(str) {
    if (!str)
      return null;
    return str == "1" ? true : false;
  }
  static ParseBonuses(bonuses) {
    if (!bonuses)
      return {
        attack_stab: 0,
        attack_slash: 0,
        attack_crush: 0,
        attack_magic: 0,
        attack_range: 0,
        defence_stab: 0,
        defence_slash: 0,
        defence_crush: 0,
        defence_magic: 0,
        defence_range: 0,
        melee_strength: 0,
        ranged_strength: 0,
        magic_damage: 0,
        prayer: 0
      };
    const bonusesArray = bonuses.split(",");
    return {
      attack_stab: parseInt(bonusesArray[0]),
      attack_slash: parseInt(bonusesArray[1]),
      attack_crush: parseInt(bonusesArray[2]),
      attack_magic: parseInt(bonusesArray[3]),
      attack_range: parseInt(bonusesArray[4]),
      defence_stab: parseInt(bonusesArray[5]),
      defence_slash: parseInt(bonusesArray[6]),
      defence_crush: parseInt(bonusesArray[7]),
      defence_magic: parseInt(bonusesArray[8]),
      defence_range: parseInt(bonusesArray[9]),
      melee_strength: parseInt(bonusesArray[10]),
      ranged_strength: parseInt(bonusesArray[11]),
      magic_damage: parseInt(bonusesArray[12]),
      prayer: parseInt(bonusesArray[13])
    };
  }
  static ParseRequirements(requirements) {
    if (!requirements)
      return [];
    const requirementsStrArray = requirements.split("-");
    const requirementsParsed = [];
    for (let requirementStr of requirementsStrArray) {
      const requirementArray = requirementStr.split(",");
      requirementsParsed.push({
        skillId: parseInt(requirementArray[0].replace("{", "")),
        level: parseInt(requirementArray[1].replace("}", ""))
      });
    }
    return requirementsParsed;
  }
  static ParseFromJson(json) {
    const item = {
      id: ItemParser.ParseNumber(json.id),
      name: json.name,
      examine: json.examine,
      tradeable: ItemParser.ParseBoolean(json.tradeable),
      lendable: ItemParser.ParseBoolean(json.lendable),
      low_alchemy: ItemParser.ParseNumber(json.low_alchemy),
      high_alchemy: ItemParser.ParseNumber(json.high_alchemy),
      destroy: ItemParser.ParseBoolean(json.destroy),
      destroy_message: json.destroy_message,
      shop_price: ItemParser.ParseNumber(json.shop_price),
      grand_exchange_price: ItemParser.ParseNumber(json.grand_exchange_price),
      remove_head: ItemParser.ParseBoolean(json.remove_head),
      remove_beard: ItemParser.ParseBoolean(json.remove_beard),
      remove_sleeves: ItemParser.ParseBoolean(json.remove_sleeves),
      stand_anim: ItemParser.ParseNumber(json.stand_anim),
      stand_turn_anim: ItemParser.ParseNumber(json.stand_turn_anim),
      walk_anim: ItemParser.ParseNumber(json.walk_anim),
      run_anim: ItemParser.ParseNumber(json.run_anim),
      turn180_anim: ItemParser.ParseNumber(json.turn180_anim),
      turn90cw_anim: ItemParser.ParseNumber(json.turn90cw_anim),
      turn90ccw_anim: ItemParser.ParseNumber(json.turn90ccw_anim),
      render_anim: ItemParser.ParseNumber(json.render_anim),
      equipment_slot: ItemParser.ParseNumber(json.equipment_slot),
      attack_speed: ItemParser.ParseNumber(json.attack_speed),
      absorb: json.absorb,
      bonuses: ItemParser.ParseBonuses(json.bonuses),
      weapon_interface: ItemParser.ParseNumber(json.weapon_interface),
      has_special: ItemParser.ParseBoolean(json.has_special),
      two_handed: ItemParser.ParseBoolean(json.two_handed),
      attack_anims: json.attack_anims,
      defence_anim: ItemParser.ParseNumber(json.defence_anim),
      attack_audios: json.attack_audios,
      requirements: ItemParser.ParseRequirements(json.requirements),
      weight: ItemParser.ParseNumber(json.weight),
      ge_buy_limit: ItemParser.ParseNumber(json.ge_buy_limit),
      bankable: ItemParser.ParseBoolean(json.bankable),
      rare_item: ItemParser.ParseBoolean(json.rare_item),
      tokkul_price: ItemParser.ParseNumber(json.tokkul_price),
      point_price: ItemParser.ParseNumber(json.point_price),
      fun_weapon: ItemParser.ParseBoolean(json.fun_weapon),
      archery_ticket_price: ItemParser.ParseNumber(json.archery_ticket_price)
    };
    return item;
  }
  static ParseItemDefinitions(location) {
    const data = Parser.requestFile(location);
    if (!data) {
      throw Error("Unable to process items data.");
    }
    const items = [];
    for (let entry of data) {
      items.push(ItemParser.ParseFromJson(entry));
    }
    return items;
  }
};

// src/data/server/parsers/NpcParser.ts
var NpcParser = class {
  static ParseNumber(str) {
    if (!str)
      return null;
    return parseInt(str);
  }
  static ParseFloat(str) {
    if (!str)
      return null;
    return parseFloat(str);
  }
  static ParseBoolean(str) {
    if (!str)
      return null;
    return str == "1" ? true : false;
  }
  static ParseBonuses(bonuses) {
    if (!bonuses)
      return {
        attack_stab: 0,
        attack_slash: 0,
        attack_crush: 0,
        attack_magic: 0,
        attack_range: 0,
        defence_stab: 0,
        defence_slash: 0,
        defence_crush: 0,
        defence_magic: 0,
        defence_range: 0,
        melee_strength: 0,
        ranged_strength: 0,
        magic_damage: 0,
        prayer: 0
      };
    const bonusesArray = bonuses.split(",");
    return {
      attack_stab: parseInt(bonusesArray[0]),
      attack_slash: parseInt(bonusesArray[1]),
      attack_crush: parseInt(bonusesArray[2]),
      attack_magic: parseInt(bonusesArray[3]),
      attack_range: parseInt(bonusesArray[4]),
      defence_stab: parseInt(bonusesArray[5]),
      defence_slash: parseInt(bonusesArray[6]),
      defence_crush: parseInt(bonusesArray[7]),
      defence_magic: parseInt(bonusesArray[8]),
      defence_range: parseInt(bonusesArray[9]),
      melee_strength: parseInt(bonusesArray[10]),
      ranged_strength: parseInt(bonusesArray[11]),
      magic_damage: parseInt(bonusesArray[12]),
      prayer: parseInt(bonusesArray[13])
    };
  }
  static ParseDrops(npcDropsEntry) {
    if (!npcDropsEntry)
      return [];
    const dropsStrArray = npcDropsEntry.split("~");
    const spanwsParsed = [];
    for (let dropstr of dropsStrArray) {
      const spawnArray = dropstr.split(",");
      spanwsParsed.push({
        itemId: NpcParser.ParseNumber(spawnArray[0].replace("{", "")),
        min_amount: NpcParser.ParseNumber(spawnArray[1]),
        max_amount: NpcParser.ParseNumber(spawnArray[2]),
        weight: NpcParser.ParseFloat(spawnArray[3]),
        drop_rate: spawnArray[4].replace("}", "")
      });
    }
    return spanwsParsed;
  }
  static ParseSpawn(npcSpawns) {
    if (!npcSpawns)
      return [];
    if (npcSpawns.loc_data == "")
      return [];
    const spawnsStrArray = npcSpawns.loc_data.split("-");
    const spanwsParsed = [];
    for (let spawnStr of spawnsStrArray) {
      const spawnArray = spawnStr.split(",");
      spanwsParsed.push({
        x: NpcParser.ParseNumber(spawnArray[0].replace("{", "")),
        y: NpcParser.ParseNumber(spawnArray[1]),
        z: NpcParser.ParseNumber(spawnArray[2]),
        is_walks: NpcParser.ParseBoolean(spawnArray[3]),
        direction: NpcParser.ParseNumber(spawnArray[4].replace("}", ""))
      });
    }
    return spanwsParsed;
  }
  static ParseFromJson(npcDefinition, npcDrops, npcSpawns) {
    const npc = {
      id: NpcParser.ParseNumber(npcDefinition.id),
      name: npcDefinition.name,
      examine: npcDefinition.examine,
      lifepoints: NpcParser.ParseNumber(npcDefinition.lifepoints),
      attack_level: NpcParser.ParseNumber(npcDefinition.attack_level),
      strength_level: NpcParser.ParseNumber(npcDefinition.strength_level),
      defence_level: NpcParser.ParseNumber(npcDefinition.defence_level),
      range_level: NpcParser.ParseNumber(npcDefinition.range_level),
      magic_level: NpcParser.ParseNumber(npcDefinition.magic_level),
      bonuses: NpcParser.ParseBonuses(npcDefinition.bonuses),
      poison_amount: NpcParser.ParseNumber(npcDefinition.poison_amount),
      poison_immune: NpcParser.ParseBoolean(npcDefinition.poison_immune),
      respawn_delay: NpcParser.ParseNumber(npcDefinition.respawn_delay),
      attack_speed: NpcParser.ParseNumber(npcDefinition.attack_speed),
      movement_radius: NpcParser.ParseNumber(npcDefinition.movement_radius),
      agg_radius: NpcParser.ParseNumber(npcDefinition.agg_radius),
      melee_animation: NpcParser.ParseNumber(npcDefinition.melee_animation),
      defence_animation: NpcParser.ParseNumber(npcDefinition.defence_animation),
      death_animation: NpcParser.ParseNumber(npcDefinition.death_animation),
      spawn_animation: NpcParser.ParseNumber(npcDefinition.spawn_animation),
      magic_animation: NpcParser.ParseNumber(npcDefinition.magic_animation),
      range_animation: NpcParser.ParseNumber(npcDefinition.range_animation),
      start_gfx: NpcParser.ParseNumber(npcDefinition.start_gfx),
      projectile: NpcParser.ParseNumber(npcDefinition.projectile),
      end_gfx: NpcParser.ParseNumber(npcDefinition.end_gfx),
      weakness: NpcParser.ParseNumber(npcDefinition.weakness),
      slayer_task: NpcParser.ParseNumber(npcDefinition.slayer_task),
      slayer_exp: NpcParser.ParseNumber(npcDefinition.slayer_exp),
      combat_style: NpcParser.ParseNumber(npcDefinition.combat_style),
      poisonous: NpcParser.ParseBoolean(npcDefinition.poisonous),
      aggressive: NpcParser.ParseBoolean(npcDefinition.aggressive),
      start_height: NpcParser.ParseNumber(npcDefinition.start_height),
      prj_height: NpcParser.ParseNumber(npcDefinition.prj_height),
      end_height: NpcParser.ParseNumber(npcDefinition.end_height),
      clue_level: NpcParser.ParseNumber(npcDefinition.clue_level),
      spell_id: NpcParser.ParseNumber(npcDefinition.spell_id),
      combat_audio: npcDefinition.combat_audio,
      protect_style: NpcParser.ParseNumber(npcDefinition.protect_style),
      force_talk: npcDefinition.force_talk,
      safespot: NpcParser.ParseBoolean(npcDefinition.safespot),
      drops: {
        default: npcDrops && npcDrops.default ? NpcParser.ParseDrops(npcDrops.default) : [],
        main: npcDrops && npcDrops.main ? NpcParser.ParseDrops(npcDrops.main) : [],
        charm: npcDrops && npcDrops.charm ? NpcParser.ParseDrops(npcDrops.charm) : []
      },
      spawn: NpcParser.ParseSpawn(npcSpawns)
    };
    return npc;
  }
  static ParseNpcDefinitions(npcConfigLocation, npcDropsLocation, npcSpawnsLocation) {
    const npcConfigData = Parser.requestFile(npcConfigLocation);
    const npcDropsData = Parser.requestFile(npcDropsLocation);
    const npcSpawnsData = Parser.requestFile(npcSpawnsLocation);
    if (!npcConfigData || !npcDropsData || !npcSpawnsData) {
      throw Error("Unable to process npcs data.");
    }
    const npcDropsMap = Parser.createHashmap(npcDropsData, "npc_id");
    const npcSpawnsMap = Parser.createHashmap(npcSpawnsData, "npc_id");
    const npcs = [];
    for (let npc of npcConfigData) {
      const drops = npcDropsMap.get(npc.id);
      const spawns = npcSpawnsMap.get(npc.id);
      if (!spawns)
        continue;
      if (!spawns.loc_data || spawns.loc_data == "")
        continue;
      const npcDefinition = NpcParser.ParseFromJson(npc, drops, spawns);
      const existingNpcDefinitions = npcs.filter((value) => value.id == npcDefinition.id);
      if (existingNpcDefinitions.length == 0) {
        npcs.push(npcDefinition);
      }
    }
    return npcs;
  }
};

// src/data/server/files/item_configs.json
var item_configs_default = "./item_configs-FYGMVYAX.json";

// src/data/server/files/npc_configs.json
var npc_configs_default = "./npc_configs-HM4MAUNF.json";

// src/data/server/files/npc_drops.json
var npc_drops_default = "./npc_drops-EYLGFAYP.json";

// src/data/server/files/npc_spawns.json
var npc_spawns_default = "./npc_spawns-AFJV4B6M.json";

// src/data/server/ServerData.ts
var ServerData = class {
  constructor() {
    this.items = ItemParser.ParseItemDefinitions(item_configs_default);
    this.npcs = NpcParser.ParseNpcDefinitions(npc_configs_default, npc_drops_default, npc_spawns_default);
    console.log(`[ServerData] Loaded ${this.items.length} items.`);
    console.log(`[ServerData] Loaded ${this.npcs.length} npcs.`);
  }
};

// src/game/map/MapObject.ts
var MapObject = class {
  constructor(id, position, type, rotation) {
    this.id = id;
    this.position = position;
    this.type = type;
    this.rotation = rotation;
  }
  getDefinition() {
    if (!DataService.getInstance().landscapeItems.has(this.id)) {
      throw Error("Unable to find object in Cache landscape items.");
    }
    return DataService.getInstance().landscapeItems.get(this.id);
  }
};

// src/game/entities/Position.ts
var _Position = class {
  constructor(x, y, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  static delta(a, b) {
    return new _Position(b.getX() - a.getX(), b.getY() - a.getY(), b.getZ() - a.getZ());
  }
  static direction(dx, dy) {
    if (dx < 0) {
      if (dy < 0) {
        return 5;
      } else if (dy > 0) {
        return 0;
      } else {
        return 3;
      }
    } else if (dx > 0) {
      if (dy < 0) {
        return 7;
      } else if (dy > 0) {
        return 2;
      } else {
        return 4;
      }
    } else {
      if (dy < 0) {
        return 6;
      } else if (dy > 0) {
        return 1;
      } else {
        return -1;
      }
    }
  }
  fromDirection(direction) {
    return new _Position(this.x + _Position.DIRECTION_DELTA_X[direction], this.y + _Position.DIRECTION_DELTA_Y[direction], this.z);
  }
  toString() {
    return "Position(" + this.x + ", " + this.y + ", " + this.z + ")";
  }
  equals(other) {
    if (other instanceof _Position) {
      return this.x == other.x && this.y == other.y && this.z == other.z;
    }
    return false;
  }
  setAs(other) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
  }
  move(amountX, amountY) {
    this.setX(this.getX() + amountX);
    this.setY(this.getY() + amountY);
  }
  getX() {
    return this.x;
  }
  setX(x) {
    this.x = x;
  }
  getY() {
    return this.y;
  }
  setY(y) {
    this.y = y;
  }
  getZ() {
    return this.z;
  }
  setZ(z) {
    this.z = z;
  }
  get regionX() {
    return (this.x >> 3) - 6;
  }
  get regionY() {
    return (this.y >> 3) - 6;
  }
  get regionLocalX() {
    return this.x - 8 * this.regionX;
  }
  get regionLocalY() {
    return this.y - 8 * this.regionY;
  }
  isViewableFrom(other) {
    const p = _Position.delta(this, other);
    return p.z == 0 && p.x <= 14 && p.x >= -15 && p.y <= 14 && p.y >= -15;
  }
  distanceBetween(other) {
    return Math.abs(Math.sqrt((this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y)));
  }
};
var Position = _Position;
Position.DIRECTION_DELTA_X = [-1, 0, 1, -1, 1, -1, 0, 1];
Position.DIRECTION_DELTA_Y = [1, 1, 1, 0, 0, -1, -1, -1];

// src/data/CacheData.ts
var CacheData = class {
  constructor() {
    this.npcs = /* @__PURE__ */ new Map();
    this.items = /* @__PURE__ */ new Map();
    const clientData = new ClientData("/Users/mac/Downloads/temp/runelite/runescape-web-client-377/client_cache");
    const serverData = new ServerData();
    for (let serverNpcDefinition of serverData.npcs) {
      const clientNpcDefinition = clientData.npcDefinitions.get(serverNpcDefinition.id);
      if (clientNpcDefinition && serverNpcDefinition.name == clientNpcDefinition.name) {
        const gameNpcDefinition = Object.assign({}, clientNpcDefinition, serverNpcDefinition);
        this.npcs.set(gameNpcDefinition.id, gameNpcDefinition);
      }
    }
    for (let serverItemDefinition of serverData.items) {
      const clientItemDefinition = clientData.itemDefinitions.get(serverItemDefinition.id);
      if (clientItemDefinition && serverItemDefinition.name == clientItemDefinition.name) {
        const gameItemDefinition = Object.assign({}, clientItemDefinition, serverItemDefinition);
        this.items.set(gameItemDefinition.id, gameItemDefinition);
      }
    }
    this.landscapeItems = clientData.landscapeObjectDefinitions;
    console.log(`[CacheData] Processed ${this.items.size} merged items.`);
    console.log(`[CacheData] Processed ${this.npcs.size} merged npcs.`);
    console.log(`[CacheData] Processed ${this.landscapeItems.size} landscape items.`);
    this.walkableTiles = [];
    for (let tile of clientData.mapRegions.mapRegionTileList) {
      if (!this.walkableTiles[tile.level])
        this.walkableTiles[tile.level] = [];
      if (!this.walkableTiles[tile.level][tile.x])
        this.walkableTiles[tile.level][tile.x] = [];
      this.walkableTiles[tile.level][tile.x][tile.y] = tile.nonWalkable;
    }
    this.mapObjects = /* @__PURE__ */ new Map();
    for (let mapObject of clientData.mapRegions.mapObjectList) {
      const key = `${mapObject.objectId},${mapObject.x},${mapObject.y}`;
      const newMapObject = new MapObject(
        mapObject.objectId,
        new Position(mapObject.x, mapObject.y, mapObject.level),
        mapObject.type,
        mapObject.rotation
      );
      this.mapObjects.set(key, newMapObject);
    }
  }
};

// src/service/DataService.ts
var DataService = class {
  get items() {
    return this.cacheData.items;
  }
  get npcs() {
    return this.cacheData.npcs;
  }
  get landscapeItems() {
    return this.cacheData.landscapeItems;
  }
  get mapObjects() {
    return this.cacheData.mapObjects;
  }
  constructor() {
    this.cacheData = new CacheData();
  }
  init() {
  }
  tick() {
  }
  cleanup() {
  }
  static getInstance() {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }
};

// src/util/Misc.ts
var Misc = class {
};
Misc.GENDER_MALE = 0;
Misc.GENDER_FEMALE = 1;

// src/game/entities/characters/player/attributes/PlayerBonuses.ts
var PlayerBonuses = class {
  constructor() {
    this.bonuses = [
      { id: 1675 /* ATTACK_STAB */, amount: 0, text: "Stab" },
      { id: 1676 /* ATTACK_SLASH */, amount: 0, text: "Slash" },
      { id: 1677 /* ATTACK_CRUSH */, amount: 0, text: "Crush" },
      { id: 1678 /* ATTACK_MAGIC */, amount: 0, text: "Magic" },
      { id: 1679 /* ATTACK_RANGE */, amount: 0, text: "Range" },
      { id: 1680 /* DEFENCE_STAB */, amount: 0, text: "Stab" },
      { id: 1681 /* DEFENCE_SLASH */, amount: 0, text: "Slash" },
      { id: 1682 /* DEFENCE_CRUSH */, amount: 0, text: "Crush" },
      { id: 1683 /* DEFENCE_MAGIC */, amount: 0, text: "Magic" },
      { id: 1684 /* DEFENCE_RANGE */, amount: 0, text: "Range" },
      { id: 1686 /* MELEE_STRENGTH */, amount: 0, text: "Strength" },
      { id: 1687 /* PRAYER */, amount: 0, text: "Prayer" }
    ];
  }
  setFromItem(itemDefinition) {
    this.bonuses[0].amount = itemDefinition.bonuses.attack_stab;
    this.bonuses[1].amount = itemDefinition.bonuses.attack_slash;
    this.bonuses[2].amount = itemDefinition.bonuses.attack_crush;
    this.bonuses[3].amount = itemDefinition.bonuses.attack_magic;
    this.bonuses[4].amount = itemDefinition.bonuses.attack_range;
    this.bonuses[5].amount = itemDefinition.bonuses.defence_stab;
    this.bonuses[6].amount = itemDefinition.bonuses.defence_slash;
    this.bonuses[7].amount = itemDefinition.bonuses.defence_crush;
    this.bonuses[8].amount = itemDefinition.bonuses.defence_magic;
    this.bonuses[9].amount = itemDefinition.bonuses.defence_range;
    this.bonuses[10].amount = itemDefinition.bonuses.melee_strength;
    this.bonuses[11].amount = itemDefinition.bonuses.prayer;
  }
};

// src/game/entities/characters/player/attributes/PlayerSettings.ts
var PlayerSettings = class {
  constructor() {
    this.mouseButtons = 1 /* TWO */;
    this.brightness = 1 /* NORMAL */;
    this.chatEffects = true;
    this.splitPrivateChat = false;
    this.acceptAid = false;
    this.runToggled = false;
    this.autoRetaliate = true;
    this.publicChatMode = 0;
    this.privateChatMode = 0;
    this.tradeMode = 0;
  }
};

// src/game/entities/characters/player/attributes/PlayerAttributes.ts
var defaultAppearance = () => {
  return {
    gender: 0,
    head: 0,
    torso: 10,
    arms: 26,
    legs: 36,
    hands: 33,
    feet: 42,
    facialHair: 18,
    hairColor: 0,
    torsoColor: 0,
    legColor: 0,
    feetColor: 0,
    skinColor: 0
  };
};
var PlayerAttributes = class {
  constructor() {
    this.settings = new PlayerSettings();
    this.gender = Misc.GENDER_MALE;
    this.runEnergy = 100;
    this.appearance = defaultAppearance();
    this.colors = [];
    this.privilege = 0 /* REGULAR */;
    this.colors[0] = 7;
    this.colors[1] = 8;
    this.colors[2] = 9;
    this.colors[3] = 5;
    this.colors[4] = 0;
    this.bonuses = new PlayerBonuses();
  }
  getPrivilege() {
    return this.privilege;
  }
  setPrivilege(privilege) {
    this.privilege = privilege;
  }
  getUserId() {
    return this.userId;
  }
  setUserId(userId) {
    this.userId = userId;
  }
  getUsername() {
    return this.username;
  }
  setUsername(username) {
    this.username = username;
  }
  getPassword() {
    return this.password;
  }
  setPassword(password) {
    this.password = password;
  }
  getRunEnergy() {
    return this.runEnergy;
  }
  setRunEnergy(runEnergy) {
    this.runEnergy = runEnergy;
  }
  hasRunEnergy() {
    return this.runEnergy > 0;
  }
  decreaseRunEnergy(amount) {
    this.runEnergy = Math.max(0, this.runEnergy - amount);
  }
  increaseRunEnergy(amount) {
    this.runEnergy = Math.min(100, this.runEnergy + amount);
  }
  getSettings() {
    return this.settings;
  }
  getBonuses() {
    return this.bonuses;
  }
};

// src/game/entities/characters/player/packets/incoming/action/NotImplemented.ts
var NotImplemented = class {
  static Process(player, packetId, packetSize, buffer) {
    console.log(`[TODO] handlePacket id: ${packetId}, size: ${packetSize}`);
  }
};

// src/game/entities/characters/player/packets/incoming/action/ButtonAction.ts
var ButtonAction = class {
  static ParseRequest(packetId, packetSize, buffer) {
    return buffer.readShortBE();
  }
  static Process(player, packetId, packetSize, buffer) {
    const buttonId = ButtonAction.ParseRequest(packetId, packetSize, buffer);
    if (buttonId == 152 /* WALK */) {
      player.attributes.getSettings().runToggled = false;
    } else if (buttonId == 153 /* RUN */) {
      player.attributes.getSettings().runToggled = true;
    } else {
      console.log(`Button ${buttonId} not implemented`);
    }
  }
};

// src/game/entities/characters/player/packets/incoming/action/WalkAction.ts
var WalkAction = class {
  static ParseRequest(packetId, packetSize, buffer) {
    let size = packetSize;
    if (packetId === 213) {
      size -= 14;
    }
    const output = [];
    const totalSteps = Math.floor((size - 5) / 2);
    const firstX = buffer.readNegativeOffsetShortLE();
    const runSteps = buffer.readByte() === 1;
    const firstY = buffer.readNegativeOffsetShortLE();
    console.log("walk to", runSteps, firstX, firstY);
    output.push(new Position(firstX, firstY));
    for (let i = 0; i < totalSteps; i++) {
      const x = buffer.readByte();
      const y = buffer.readPreNegativeOffsetByte();
      output.push(new Position(x + firstX, y + firstY));
    }
    return output;
  }
  static Process(player, packetId, packetSize, buffer) {
    const positions = WalkAction.ParseRequest(packetId, packetSize, buffer);
    player.movementHandler.reset();
    for (let position of positions) {
      player.movementHandler.addToPath(position);
    }
    player.movementHandler.finish();
  }
};

// src/game/Item.ts
var Item = class {
  constructor(definition) {
    this.definition = definition;
    this.amount = 0;
  }
};

// src/game/entities/characters/Inventory.ts
var Inventory = class {
  constructor(capacity) {
    this.capacity = capacity;
    this.items = new Array(this.capacity).fill(null);
    this.size = 0;
  }
  add(item) {
    if (this.size >= this.capacity) {
      console.log("This inventory is full.");
      return;
    }
    const emptySlot = this.getEmptySlot();
    this.items[emptySlot] = item;
    this.size++;
  }
  addById(id, amount = 1) {
    const itemDefinition = DataService.getInstance().items.get(id);
    if (!itemDefinition) {
      console.log(`Item with id ${id} not found`);
      return;
    }
    const item = new Item(itemDefinition);
    item.amount = amount;
    this.add(item);
  }
  set(item, slot) {
    if (slot >= this.capacity) {
      console.log("Slot can't be bigger than capacity.");
      return;
    }
    if (this.items[slot] !== null) {
      console.log("Slot not empty");
      return;
    }
    this.items[slot] = item;
    this.size++;
  }
  remove(slot) {
    if (slot > this.capacity) {
      console.log("Tried to get an item that has a slot bigger than inventory capacity.");
      return;
    }
    this.items[slot] = null;
    this.size--;
  }
  getItems() {
    return this.items;
  }
  get(slot) {
    if (slot > this.capacity) {
      console.log("Tried to get an item that has a slot bigger than inventory capacity.");
      return;
    }
    return this.items[slot];
  }
  slotOf(item) {
    if (item === null) {
      console.log("Invalid item.");
      return;
    }
    for (let i = 0; i < this.items.length; i++) {
      if (item === this.items[i])
        return i;
    }
    return -1;
  }
  getEmptySlot() {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i] === null)
        return i;
    }
    return -1;
  }
  swap(from, to) {
    if (from > this.capacity) {
      console.log(`Swap "from" or "to" bigger than capacity`);
      return;
    }
    const tempFrom = this.items[from];
    this.items[from] = this.items[to];
    this.items[to] = tempFrom;
  }
  getSize() {
    return this.size;
  }
};

// src/game/entities/characters/player/packets/incoming/action/ItemEquip.ts
var ItemEquip = class {
  static ValidateRequirements(player, requirements) {
    for (let requirement of requirements) {
      const playerSkill = player.skills.getById(requirement.skillId);
      if (playerSkill.getLevel() < requirement.level)
        return false;
    }
    return true;
  }
  static ParseRequest(packetId, packetSize, buffer) {
    const widgetId = buffer.readShortLE();
    const itemId = buffer.readShortLE();
    const slot = buffer.readNegativeOffsetShortBE();
    return {
      widgetId,
      itemId,
      slot
    };
  }
  static Process(player, packetId, packetSize, buffer) {
    const equipRequest = ItemEquip.ParseRequest(packetId, packetSize, buffer);
    if (equipRequest.widgetId !== 3214 /* INVENTORY */) {
      console.log(`${player.attributes.getUsername()} attempted to equip item from incorrect widget id ${equipRequest.widgetId}.`);
      return;
    }
    if (equipRequest.slot < 0 || equipRequest.slot > 27) {
      console.log(`${player.attributes.getUsername()} attempted to equip item ${equipRequest.itemId} in invalid slot ${equipRequest.slot}.`);
      return;
    }
    const itemInSlot = player.inventory.get(equipRequest.slot);
    if (!itemInSlot) {
      console.log(`${player.attributes.getUsername()} attempted to equip item ${equipRequest.itemId} in slot ${equipRequest.slot}, but they do not have that item.`);
      return;
    }
    if (itemInSlot.definition.id !== equipRequest.itemId) {
      console.log(`${player.attributes.getUsername()} attempted to equip item ${equipRequest.itemId} in slot ${equipRequest.slot}, but ${itemInSlot.definition.id} was found there instead.`);
      return;
    }
    const itemDefinition = DataService.getInstance().items.get(equipRequest.itemId);
    if (!itemDefinition) {
      console.log("Could not find item in DataService.");
      return;
    }
    if (!itemDefinition.equipment_slot) {
      console.log("Cannot equip this item");
      return;
    }
    const hasValidRequirements = ItemEquip.ValidateRequirements(player, itemDefinition.requirements);
    if (!hasValidRequirements) {
      console.log("Invalid requirements to wield item.");
      return;
    }
    const equipmentInSlot = player.equipment.get(itemDefinition.equipment_slot);
    if (equipmentInSlot) {
      const emptyInventorySlot = player.inventory.getEmptySlot();
      if (emptyInventorySlot == -1) {
        console.log("No available inventory space.");
        return;
      }
      player.equipment.remove(itemDefinition.equipment_slot);
      player.inventory.set(equipmentInSlot, emptyInventorySlot);
    }
    const item = new Item(itemDefinition);
    item.amount = itemInSlot.amount;
    console.log(`Equiping ${itemDefinition.name} in slot ${itemDefinition.equipment_slot}`);
    player.inventory.remove(equipRequest.slot);
    player.equipment.set(item, itemDefinition.equipment_slot);
    player.attributes.getBonuses().setFromItem(itemDefinition);
    player.updateInventory();
    player.updateEquipment();
    player.updateBonuses();
    player.updateFlags.appearanceUpdateRequired = true;
  }
};

// src/game/entities/characters/player/packets/incoming/action/FirstOptionClickAction.ts
var FirstOptionClickAction = class {
  static ParseRequest(packetId, packetSize, buffer) {
    console.log("ParseRequest", packetId);
    if (packetId == 203 /* MENU */) {
      const widgetId = buffer.readUnsignedShortLE();
      const slot = buffer.readShortLE();
      const itemId = buffer.readShortLE();
      return { widgetId, slot, itemId };
    } else if (packetId == 3 /* MOUSE_CLICK */) {
      const itemId = buffer.readNegativeOffsetShortBE();
      const widgetId = buffer.readShortBE();
      const slot = buffer.readShortBE();
      return { widgetId, slot, itemId };
    }
  }
  static Process(player, packetId, packetSize, buffer) {
    const firstOptionClickRequest = FirstOptionClickAction.ParseRequest(packetId, packetSize, buffer);
    const itemDefinition = DataService.getInstance().items.get(firstOptionClickRequest.itemId);
    if (!itemDefinition) {
      console.log("Invalid item");
      return;
    }
    console.log("firstOptionClickRequest", firstOptionClickRequest);
    const itemSlot = firstOptionClickRequest.slot;
    const inventoryItemSlot = player.inventory.get(itemSlot);
    if (!inventoryItemSlot) {
      console.log("Item not in player inventory");
      return;
    }
    player.skills.prayer.buryItem(inventoryItemSlot, itemSlot);
  }
};

// src/game/entities/characters/player/packets/incoming/action/NpcInteraction.ts
var NpcInteraction = class {
  static ParseRequest(packetId, packetSize, buffer) {
    const methods = {
      67: "readNegativeOffsetShortBE",
      112: "readUnsignedShortLE",
      13: "readNegativeOffsetShortLE",
      42: "readUnsignedShortLE",
      8: "readUnsignedShortLE"
    };
    const npcIndex = buffer[methods[packetId]]();
    const npc = GameService.getInstance().getNpcs()[npcIndex];
    if (!npc) {
      return;
    }
    return npc;
  }
  static Process(player, packetId, packetSize, buffer) {
    const npc = NpcInteraction.ParseRequest(packetId, packetSize, buffer);
    console.log("Interacted with", npc);
  }
};

// src/game/entities/characters/player/packets/incoming/action/DoorAction.ts
var Doors = class {
};
Doors.PositionTranslation = {
  [1 /* CLOSED */]: {
    [0 /* WEST */]: { x: -1, y: 0 },
    [2 /* EAST */]: { x: 1, y: 0 },
    [1 /* NORTH */]: { x: 0, y: 1 },
    [3 /* SOUTH */]: { x: 0, y: -1 }
  },
  [0 /* OPENED */]: {
    [0 /* WEST */]: { x: 1, y: 0 },
    [2 /* EAST */]: { x: -1, y: 0 },
    [1 /* NORTH */]: { x: 0, y: -1 },
    [3 /* SOUTH */]: { x: 0, y: 1 }
  }
};
Doors.RotationTranslation = {
  [1 /* CLOSED */]: {
    [0 /* LEFT */]: {
      [1 /* NORTH */]: 0 /* WEST */,
      [3 /* SOUTH */]: 2 /* EAST */,
      [0 /* WEST */]: 3 /* SOUTH */,
      [2 /* EAST */]: 1 /* NORTH */
    },
    [1 /* RIGHT */]: {
      [1 /* NORTH */]: 2 /* EAST */,
      [3 /* SOUTH */]: 0 /* WEST */,
      [0 /* WEST */]: 1 /* NORTH */,
      [2 /* EAST */]: 3 /* SOUTH */
    }
  },
  [0 /* OPENED */]: {
    [0 /* LEFT */]: {
      [1 /* NORTH */]: 2 /* EAST */,
      [3 /* SOUTH */]: 0 /* WEST */,
      [0 /* WEST */]: 1 /* NORTH */,
      [2 /* EAST */]: 3 /* SOUTH */
    },
    [1 /* RIGHT */]: {
      [1 /* NORTH */]: 0 /* WEST */,
      [3 /* SOUTH */]: 2 /* EAST */,
      [0 /* WEST */]: 3 /* SOUTH */,
      [2 /* EAST */]: 1 /* NORTH */
    }
  }
};
Doors.Definitions = {
  1516: { hinge: 0 /* LEFT */, state: 1 /* CLOSED */, actionId: 1517 },
  1517: { hinge: 0 /* LEFT */, state: 0 /* OPENED */, actionId: 1516 },
  1519: { hinge: 1 /* RIGHT */, state: 1 /* CLOSED */, actionId: 1520 },
  1520: { hinge: 1 /* RIGHT */, state: 0 /* OPENED */, actionId: 1519 },
  1530: { hinge: 1 /* RIGHT */, state: 1 /* CLOSED */, actionId: 1531 },
  1531: { hinge: 1 /* RIGHT */, state: 0 /* OPENED */, actionId: 1530 },
  1533: { hinge: 0 /* LEFT */, state: 1 /* CLOSED */, actionId: 1534 },
  1534: { hinge: 0 /* LEFT */, state: 0 /* OPENED */, actionId: 1533 },
  1536: { hinge: 0 /* LEFT */, state: 1 /* CLOSED */, actionId: 1537 },
  1537: { hinge: 0 /* LEFT */, state: 0 /* OPENED */, actionId: 1536 },
  4465: { hinge: 1 /* RIGHT */, state: 1 /* CLOSED */, actionId: 4466 },
  4466: { hinge: 1 /* RIGHT */, state: 0 /* OPENED */, actionId: 4465 }
};
var DoorAction = class {
  static translate_door_position(doorDefinition, doorObject) {
    const offset = Doors.PositionTranslation[doorDefinition.state][doorObject.rotation];
    return new Position(doorObject.position.getX() + offset.x, doorObject.position.getY() + offset.y);
    let xOffset = 0;
    let yOffset = 0;
    if (doorObject.rotation == 0 /* WEST */)
      xOffset = -1;
    else if (doorObject.rotation == 2 /* EAST */)
      xOffset = 1;
    else if (doorObject.rotation == 1 /* NORTH */)
      yOffset = 1;
    else if (doorObject.rotation == 3 /* SOUTH */)
      yOffset = -1;
    if (doorDefinition.state == 0 /* OPENED */) {
      xOffset *= -1;
      yOffset *= -1;
    }
    return new Position(doorObject.position.getX() + xOffset, doorObject.position.getY() + yOffset);
  }
  static translate_door_orientation(doorDefinition, doorObject) {
    return Doors.RotationTranslation[doorDefinition.state][doorDefinition.hinge][doorObject.rotation];
    if (doorDefinition.state == 1 /* CLOSED */) {
      if (doorDefinition.hinge == 0 /* LEFT */) {
        if (doorObject.rotation == 1 /* NORTH */)
          return 0 /* WEST */;
        else if (doorObject.rotation == 3 /* SOUTH */)
          return 2 /* EAST */;
        else if (doorObject.rotation == 0 /* WEST */)
          return 3 /* SOUTH */;
        else if (doorObject.rotation == 2 /* EAST */)
          return 1 /* NORTH */;
      } else if (doorDefinition.hinge == 1 /* RIGHT */) {
        if (doorObject.rotation == 1 /* NORTH */)
          return 2 /* EAST */;
        else if (doorObject.rotation == 3 /* SOUTH */)
          return 0 /* WEST */;
        else if (doorObject.rotation == 0 /* WEST */)
          return 1 /* NORTH */;
        else if (doorObject.rotation == 2 /* EAST */)
          return 3 /* SOUTH */;
      }
    } else if (doorDefinition.state == 0 /* OPENED */) {
      if (doorDefinition.hinge == 1 /* RIGHT */) {
        if (doorObject.rotation == 1 /* NORTH */)
          return 0 /* WEST */;
        else if (doorObject.rotation == 3 /* SOUTH */)
          return 2 /* EAST */;
        else if (doorObject.rotation == 0 /* WEST */)
          return 3 /* SOUTH */;
        else if (doorObject.rotation == 2 /* EAST */)
          return 1 /* NORTH */;
      } else if (doorDefinition.hinge == 0 /* LEFT */) {
        if (doorObject.rotation == 1 /* NORTH */)
          return 2 /* EAST */;
        else if (doorObject.rotation == 3 /* SOUTH */)
          return 0 /* WEST */;
        else if (doorObject.rotation == 0 /* WEST */)
          return 1 /* NORTH */;
        else if (doorObject.rotation == 2 /* EAST */)
          return 3 /* SOUTH */;
      }
    }
    return null;
  }
  static isDoor(objectId) {
    if (Doors.Definitions[objectId])
      return true;
    return false;
  }
  static isOpen(doorDefinition) {
    return doorDefinition.state == 0 /* OPENED */;
  }
  static OpenDoor(doorMapObject, doorDefinition) {
    GameService.getInstance().map.removeMapObject(doorMapObject);
    const newDoorId = doorDefinition.actionId;
    const actionLandscapeItem = new MapObject(
      newDoorId,
      DoorAction.translate_door_position(doorDefinition, doorMapObject),
      doorMapObject.type,
      DoorAction.translate_door_orientation(doorDefinition, doorMapObject)
    );
    GameService.getInstance().map.addMapObject(actionLandscapeItem);
  }
  static CloseDoor(doorMapObject, doorDefinition) {
    GameService.getInstance().map.removeMapObject(doorMapObject);
    const newDoorId = doorDefinition.actionId;
    const newDoor = new MapObject(
      newDoorId,
      doorMapObject.position,
      doorMapObject.type,
      DoorAction.translate_door_orientation(doorDefinition, doorMapObject)
    );
    const actionLandscapeItem = new MapObject(
      newDoor.id,
      DoorAction.translate_door_position(doorDefinition, newDoor),
      newDoor.type,
      newDoor.rotation
    );
    GameService.getInstance().map.addMapObject(actionLandscapeItem);
  }
  static ToggleDoor(player, objectId, x, y) {
    if (!DoorAction.isDoor(objectId)) {
      console.log(`Object ${objectId} is not a door.`);
      return;
    }
    const doorDefinition = Doors.Definitions[objectId];
    const doorMapObject = GameService.getInstance().map.getMapObject(objectId, new Position(x, y));
    if (!doorMapObject) {
      console.log("Could not find door in map.");
      return;
    }
    player.movementHandler.waitForCharacterToReachPosition(doorMapObject.position, 1).then((reached) => {
      if (!reached) {
        console.log("Failed to reach position.");
        return;
      }
      if (DoorAction.isOpen(doorDefinition)) {
        DoorAction.CloseDoor(doorMapObject, doorDefinition);
      } else {
        DoorAction.OpenDoor(doorMapObject, doorDefinition);
      }
    });
  }
};

// src/game/entities/characters/player/packets/incoming/action/ObjectInteraction.ts
var ObjectInteraction = class {
  static ParseRequest(packetId, packetSize, buffer) {
    if (packetId == 181 /* OPTION_1 */) {
      const x = buffer.readNegativeOffsetShortBE();
      const y = buffer.readUnsignedShortLE();
      const objectId = buffer.readUnsignedShortLE();
      return { objectId, x, y };
    } else if (packetId == 241 /* OPTION_2 */) {
      const objectId = buffer.readUnsignedShortBE();
      const x = buffer.readUnsignedShortBE();
      const y = buffer.readNegativeOffsetShortBE();
      return { objectId, x, y };
    } else if (packetId == 50 /* OPTION_3 */) {
      const y = buffer.readNegativeOffsetShortBE();
      const objectId = buffer.readUnsignedShortLE();
      const x = buffer.readNegativeOffsetShortLE();
      return { objectId, x, y };
    } else if (packetId == 136 /* OPTION_4 */) {
      const x = buffer.readUnsignedShortBE();
      const y = buffer.readUnsignedShortLE();
      const objectId = buffer.readUnsignedShortBE();
      return { objectId, x, y };
    } else if (packetId == 55 /* OPTION_5 */) {
      const objectId = buffer.readUnsignedShortLE();
      const y = buffer.readUnsignedShortLE();
      const x = buffer.readUnsignedShortBE();
      return { objectId, x, y };
    }
  }
  static Process(player, packetId, packetSize, buffer) {
    const request = ObjectInteraction.ParseRequest(packetId, packetSize, buffer);
    console.log("[ObjectInteraction]", request);
    DoorAction.ToggleDoor(player, request.objectId, request.x, request.y);
    player.skills.woodcutting.cutObject(request.objectId, request.x, request.y);
  }
};

// src/game/entities/characters/player/packets/incoming/action/MouseClicked.ts
var MouseClicked = class {
  static ParseRequest(packetId, packetSize, buffer) {
    const value = buffer.readIntBE();
    const delay = (value >> 20) * 50;
    const right = (value >> 19 & 1) == 1;
    const cords = value & 262143;
    const x = cords % 765;
    const y = cords / 765;
    return {
      delay,
      right,
      x,
      y
    };
  }
  static Process(player, packetId, packetSize, buffer) {
    const mouseClickedRequest = MouseClicked.ParseRequest(packetId, packetSize, buffer);
  }
};

// src/game/entities/characters/player/packets/incoming/action/TakeTileItem.ts
var TakeTileItem = class {
  static ParseRequest(packetId, packetSize, buffer) {
    const id = buffer.readNegativeOffsetShortLE();
    const x = buffer.readNegativeOffsetShortLE();
    const y = buffer.readNegativeOffsetShortBE();
    const position = new Position(x, y);
    return {
      id,
      position
    };
  }
  static Process(player, packetId, packetSize, buffer) {
    const takeTileRequest = TakeTileItem.ParseRequest(packetId, packetSize, buffer);
    if (!player.inventory.getEmptySlot()) {
      player.outgoingPacketHandler.sendMessage("Your inventory is full.");
      return;
    }
    const itemRegion = GameService.getInstance().getRegionForPosition(takeTileRequest.position);
    if (!itemRegion) {
      console.log("Invalid item region.");
      return;
    }
    const worldItem = itemRegion.getItem(takeTileRequest.id, takeTileRequest.position.getX(), takeTileRequest.position.getY());
    if (!worldItem) {
      console.log("Invalid world item.");
      return;
    }
    player.movementHandler.waitForCharacterToReachPosition(worldItem.position).then((reached) => {
      if (!reached) {
        console.log("Failed to reach position.");
        return;
      }
      const itemDefinition = DataService.getInstance().items.get(worldItem.itemId);
      if (itemDefinition) {
        const item = new Item(itemDefinition);
        item.amount = worldItem.amount;
        GameService.getInstance().removeWorldItem(worldItem);
        player.inventory.add(item);
        player.outgoingPacketHandler.sendMessage(`You picked up ${item.definition.name}.`);
        player.updateInventory();
      }
    });
  }
};

// src/game/entities/characters/player/packets/incoming/action/DropItem.ts
var DropItem = class {
  static ParseRequest(packetId, packetSize, buffer) {
    const slot = buffer.readShortLE();
    const itemId = buffer.readNegativeOffsetShortLE();
    const widgetId = buffer.readNegativeOffsetShortLE();
    return {
      slot,
      itemId,
      widgetId
    };
  }
  static Process(player, packetId, packetSize, buffer) {
    const dropItemRequest = DropItem.ParseRequest(packetId, packetSize, buffer);
    if (dropItemRequest.widgetId != 3214 /* INVENTORY */) {
      console.log("Attempted to drop item from incorrect widget.");
      return;
    }
    if (dropItemRequest.slot < 0 || dropItemRequest.slot > 27) {
      console.log("Attempted to drop item from invalid slot");
      return;
    }
    const itemInSlot = player.inventory.get(dropItemRequest.slot);
    if (!itemInSlot) {
      console.log("Attempted to drop non existing item.");
      return;
    }
    if (itemInSlot.definition.id !== dropItemRequest.itemId) {
      console.log("Item id in player slot does not match requested item id.");
      return false;
    }
    player.inventory.remove(dropItemRequest.slot);
    player.updateInventory();
    GameService.getInstance().addWorldItem({
      itemId: itemInSlot.definition.id,
      position: new Position(player.position.getX(), player.position.getY()),
      amount: 1
    });
  }
};

// src/game/entities/characters/player/packets/incoming/action/CameraTurnAction.ts
var CameraTurnAction = class {
  static Process(player, packetId, packetSize, buffer) {
  }
};

// src/game/entities/characters/player/packets/incoming/PlayerIncomingPackets.ts
var incomingPacketSizes = [
  0,
  12,
  0,
  6,
  6,
  0,
  0,
  0,
  2,
  0,
  0,
  0,
  0,
  2,
  0,
  0,
  0,
  0,
  0,
  4,
  0,
  0,
  2,
  0,
  6,
  0,
  0,
  0,
  -1,
  0,
  0,
  4,
  0,
  0,
  0,
  0,
  8,
  0,
  0,
  0,
  0,
  0,
  2,
  0,
  0,
  2,
  0,
  0,
  0,
  -1,
  6,
  0,
  0,
  0,
  6,
  6,
  -1,
  8,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  2,
  0,
  0,
  0,
  6,
  0,
  0,
  0,
  4,
  0,
  6,
  4,
  2,
  2,
  0,
  0,
  8,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  6,
  0,
  0,
  0,
  4,
  0,
  0,
  0,
  0,
  6,
  0,
  0,
  0,
  4,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  2,
  0,
  0,
  0,
  2,
  0,
  0,
  1,
  8,
  0,
  0,
  7,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  6,
  0,
  0,
  0,
  4,
  8,
  0,
  8,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  12,
  0,
  0,
  0,
  0,
  4,
  6,
  0,
  8,
  6,
  0,
  13,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  -1,
  0,
  3,
  0,
  0,
  3,
  6,
  0,
  0,
  0,
  6,
  0,
  0,
  10,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  2,
  0,
  0,
  4,
  0,
  0,
  0,
  0,
  0,
  6,
  0,
  0,
  8,
  0,
  0,
  0,
  8,
  12,
  0,
  -1,
  0,
  0,
  0,
  8,
  0,
  0,
  0,
  0,
  3,
  0,
  0,
  0,
  2,
  9,
  6,
  0,
  6,
  6,
  0,
  2,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  6,
  0,
  0,
  -1,
  2,
  0,
  -1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
];
var packets = {
  19: MouseClicked,
  140: CameraTurnAction,
  79: ButtonAction,
  226: NotImplemented,
  112: NpcInteraction,
  13: NpcInteraction,
  42: NpcInteraction,
  8: NpcInteraction,
  67: NpcInteraction,
  181: ObjectInteraction,
  241: ObjectInteraction,
  50: ObjectInteraction,
  136: ObjectInteraction,
  55: ObjectInteraction,
  28: WalkAction,
  213: WalkAction,
  247: WalkAction,
  163: NotImplemented,
  24: ItemEquip,
  3: FirstOptionClickAction,
  123: NotImplemented,
  4: DropItem,
  1: NotImplemented,
  49: NotImplemented,
  56: NotImplemented,
  177: NotImplemented,
  91: NotImplemented,
  231: NotImplemented,
  203: FirstOptionClickAction,
  71: TakeTileItem
};
var PlayerIncomingPackets = class {
  constructor(player) {
    this.activePacketId = null;
    this.activePacketSize = null;
    this.player = player;
  }
  static HandlePacket(player, packetId, packetSize, buffer) {
    const packetFunction = packets[packetId];
    if (!packetFunction) {
      console.log(`Unknown packet ${packetId} with size ${packetSize} received.`);
      return;
    }
    packetFunction.Process(player, packetId, packetSize, buffer);
  }
  parse(buffer) {
    if (!this.activeBuffer) {
      this.activeBuffer = buffer;
    } else if (buffer) {
      const newBuffer = new StreamBuffer(this.activeBuffer.getUnreadData());
      const activeLength = newBuffer.getBuffer().length;
      newBuffer.ensureCapacity(activeLength + buffer.getBuffer().length);
      buffer.getBuffer().copy(newBuffer.getBuffer(), activeLength, 0);
      this.activeBuffer = newBuffer;
    }
    if (this.activePacketId === null) {
      this.activePacketId = -1;
    }
    if (this.activePacketSize === null) {
      this.activePacketSize = -1;
    }
    const inCipher = this.player.client.getDecryptor();
    if (this.activePacketId === -1) {
      if (this.activeBuffer.getReadable() < 1) {
        return;
      }
      this.activePacketId = this.activeBuffer.readByte() & 255;
      this.activePacketId = this.activePacketId - inCipher.rand() & 255;
      this.activePacketSize = incomingPacketSizes[this.activePacketId];
    }
    if (this.activePacketSize === -1) {
      if (this.activeBuffer.getReadable() < 1) {
        return;
      }
      this.activePacketSize = this.activeBuffer.readByte() & 255;
    }
    if (this.activeBuffer.getReadable() < this.activePacketSize) {
      console.error("Not enough readable data for packet " + this.activePacketId + " with size " + this.activePacketSize + ", but only " + this.activeBuffer.getReadable() + " data is left of " + this.activeBuffer.getBuffer().length);
      return;
    }
    if (this.activePacketSize !== 0) {
      const packetData = this.activeBuffer.readBytes(this.activePacketSize);
      PlayerIncomingPackets.HandlePacket(this.player, this.activePacketId, this.activePacketSize, new StreamBuffer(packetData));
    }
    this.activePacketId = null;
    this.activePacketSize = null;
    if (this.activeBuffer.getReadable() > 0) {
      this.parse();
    }
  }
};

// src/net/Packet.ts
var Packet = class extends StreamBuffer {
  constructor(packetId, type = "FIXED" /* FIXED */, allocatedSize = 5e3) {
    super(Buffer.alloc(allocatedSize));
    this._type = "FIXED" /* FIXED */;
    this._packetId = packetId;
    this._type = type;
  }
  toBuffer(cipher) {
    const packetSize = this.getWriterIndex();
    let bufferSize = packetSize + 1;
    if (this.type !== "FIXED" /* FIXED */) {
      bufferSize += this.type === "DYNAMIC_SMALL" /* DYNAMIC_SMALL */ ? 1 : 2;
    }
    const buffer = StreamBuffer.create(bufferSize);
    buffer.writeUnsignedByte(this.packetId + (cipher !== null ? cipher.rand() : 0) & 255);
    let copyStart = 1;
    if (this.type === "DYNAMIC_SMALL" /* DYNAMIC_SMALL */) {
      buffer.writeUnsignedByte(packetSize);
      copyStart = 2;
    } else if (this.type === "DYNAMIC_LARGE" /* DYNAMIC_LARGE */) {
      buffer.writeShortBE(packetSize);
      copyStart = 3;
    }
    this.getBuffer().copy(buffer.getBuffer(), copyStart, 0, packetSize);
    return buffer.getBuffer();
  }
  get packetId() {
    return this._packetId;
  }
  get type() {
    return this._type;
  }
};

// src/game/entities/characters/player/packets/outgoing/PlayerOutgoingPackets.ts
var PlayerOutgoingPackets = class {
  constructor(player) {
    this.player = player;
  }
  updateEnergy(energy) {
    const packet = new Packet(125);
    packet.writeByte(energy);
    this.player.client.send(packet);
  }
  updateReferencePosition(position) {
    const offsetX = position.getX() - this.player.lastRegionPosition.regionX * 8;
    const offsetY = position.getY() - this.player.lastRegionPosition.regionY * 8;
    const packet = new Packet(75);
    packet.writeByteInverted(offsetX);
    packet.writeOffsetByte(offsetY);
    this.player.client.send(packet);
  }
  getChunkOffset(regionX, regionY) {
    let offsetX = (regionX + 6) * 8;
    let offsetY = (regionY + 6) * 8;
    offsetX -= this.player.lastRegionPosition.regionX * 8;
    offsetY -= this.player.lastRegionPosition.regionY * 8;
    return { offsetX, offsetY };
  }
  clearRegion(regionX, regionY) {
    const { offsetX, offsetY } = this.getChunkOffset(regionX, regionY);
    const packet = new Packet(40);
    packet.writeNegativeOffsetByte(offsetY);
    packet.writeByteInverted(offsetX);
    this.player.client.send(packet);
  }
  setWorldItem(worldItem, offset = 0) {
    this.updateReferencePosition(worldItem.position);
    const packet = new Packet(107);
    packet.writeShortBE(worldItem.itemId);
    packet.writeByteInverted(offset);
    packet.writeNegativeOffsetShortBE(worldItem.amount);
    this.player.client.send(packet);
  }
  removeWorldItem(worldItem, offset = 0) {
    this.updateReferencePosition(worldItem.position);
    const packet = new Packet(208);
    packet.writeNegativeOffsetShortBE(worldItem.itemId);
    packet.writeOffsetByte(offset);
    this.player.client.send(packet);
  }
  setMapObject(mapObject, offset = 0) {
    this.updateReferencePosition(mapObject.position);
    const packet = new Packet(152);
    packet.writeByteInverted((mapObject.type << 2) + (mapObject.rotation & 3));
    packet.writeOffsetShortLE(mapObject.id);
    packet.writeOffsetByte(offset);
    this.player.client.send(packet);
  }
  removeMapObject(mapObject, offset = 0) {
    this.updateReferencePosition(mapObject.position);
    console.log("[removemapObject] Removing door");
    const packet = new Packet(88);
    packet.writeNegativeOffsetByte(offset);
    packet.writeNegativeOffsetByte((mapObject.type << 2) + (mapObject.rotation & 3));
    this.player.client.send(packet);
  }
  updateMapRegion(regionX, regionY) {
    const packet = new Packet(222);
    packet.writeShortBE(regionY + 6);
    packet.writeOffsetShortLE(regionX + 6);
    this.player.client.send(packet);
  }
  updateAllWidgetItems(widgetId, itemsId, itemsAmounts) {
    const packet = new Packet(206, "DYNAMIC_LARGE" /* DYNAMIC_LARGE */);
    packet.writeShortBE(widgetId);
    packet.writeShortBE(itemsId.length);
    for (let i = 0; i < itemsId.length; i++) {
      const itemId = itemsId[i];
      const itemAmount = itemsAmounts[i];
      if (itemId === -1) {
        packet.writeOffsetShortLE(0);
        packet.writeUnsignedByteInverted(-1);
      } else {
        packet.writeOffsetShortLE(itemId + 1);
        if (itemAmount >= 255) {
          packet.writeUnsignedByteInverted(254);
          packet.writeIntLE(itemAmount);
        } else {
          packet.writeUnsignedByteInverted(itemAmount - 1);
        }
      }
    }
    this.player.client.send(packet);
  }
  updateWidgetSetting(settingId, value) {
    let packet;
    if (value > 255) {
    } else {
      packet = new Packet(182);
      packet.writeOffsetShortBE(settingId);
      packet.writeNegativeOffsetByte(value);
    }
    this.player.client.send(packet);
  }
  updateSkill(skillId, level, exp) {
    const packet = new Packet(49);
    packet.writeByteInverted(skillId);
    packet.writeUnsignedByte(level);
    packet.writeIntBE(exp);
    this.player.client.send(packet);
  }
  updateTabWidget(tabIndex, widgetId) {
    const packet = new Packet(10);
    packet.writeNegativeOffsetByte(tabIndex);
    packet.writeOffsetShortBE(widgetId);
    this.player.client.send(packet);
  }
  sendMessage(message) {
    const packet = new Packet(63, "DYNAMIC_SMALL" /* DYNAMIC_SMALL */);
    packet.writeString(message);
    this.player.client.send(packet);
  }
  updateClientSetting(settingId, value) {
    let packet;
    if (value > 255) {
    } else {
      packet = new Packet(182);
      packet.writeOffsetShortBE(settingId);
      packet.writeNegativeOffsetByte(value);
    }
    this.player.client.send(packet);
  }
  updateWidgetString(widgetId, value) {
    const packet = new Packet(232, "DYNAMIC_LARGE" /* DYNAMIC_LARGE */);
    packet.writeOffsetShortLE(widgetId);
    packet.writeString(value);
    this.player.client.send(packet);
  }
  playSong(songId) {
    const packet = new Packet(220);
    packet.writeOffsetShortLE(songId);
    this.player.client.send(packet);
  }
  playSound(soundId, volume, delay = 0) {
    const packet = new Packet(26);
    packet.writeShortBE(soundId);
    packet.writeByte(volume);
    packet.writeShortBE(delay);
    this.player.client.send(packet);
  }
  sendLogout() {
    this.player.client.send(new Packet(5));
  }
};

// src/util/Deque.ts
var Deque = class {
  constructor() {
    this.data = [];
    this.front = 0;
    this.back = 1;
    this.size = 0;
  }
  addFront(value) {
    if (this.size >= Number.MAX_SAFE_INTEGER)
      throw "Deque capacity overflow";
    this.size++;
    this.front = (this.front + 1) % Number.MAX_SAFE_INTEGER;
    this.data[this.front] = value;
  }
  removeFront() {
    if (!this.size)
      return;
    let value = this.peekFront();
    this.size--;
    delete this.data[this.front];
    this.front = (this.front || Number.MAX_SAFE_INTEGER) - 1;
    return value;
  }
  peekFront() {
    if (this.size)
      return this.data[this.front];
  }
  addBack(value) {
    if (this.size >= Number.MAX_SAFE_INTEGER)
      throw "Deque capacity overflow";
    this.size++;
    this.back = (this.back || Number.MAX_SAFE_INTEGER) - 1;
    this.data[this.back] = value;
  }
  removeBack() {
    if (!this.size)
      return;
    let value = this.peekBack();
    this.size--;
    delete this.data[this.back];
    this.back = (this.back + 1) % Number.MAX_SAFE_INTEGER;
    return value;
  }
  peekBack() {
    if (this.size)
      return this.data[this.back];
  }
  poll() {
    return this.removeFront();
  }
  clear() {
    this.data = [];
    this.front = 0;
    this.back = 1;
    this.size = 0;
  }
  add(value) {
    this.addBack(value);
  }
};

// src/game/entities/characters/CharacterActions.ts
var CharacterActions = class {
  constructor() {
    this.actions = new Deque();
    this.pendingActionExecution = false;
  }
  update() {
    if (this.actions.size == 0)
      return;
    if (this.pendingActionExecution)
      return;
    if (!this.pendingActionExecution) {
      this.pendingActionExecution = true;
      const action = this.actions.poll();
      action.run().then((done) => {
        if (done) {
          this.pendingActionExecution = false;
        }
      });
    }
  }
  lateUpdate() {
  }
  add(action) {
    this.actions.add(action);
  }
};

// src/game/entities/Entity.ts
var Entity = class {
  constructor() {
    this._position = new Position(0, 0, 0);
    this._lastRegionPosition = new Position(0, 0, 0);
  }
  get position() {
    return this._position;
  }
  set position(value) {
    if (!this._position) {
      this._lastRegionPosition = value;
    }
    this._position = value;
  }
  get lastRegionPosition() {
    return this._lastRegionPosition;
  }
  set lastRegionPosition(value) {
    this._lastRegionPosition = value;
  }
};

// src/game/entities/characters/skills/Skill.ts
var Skill = class {
  constructor(character) {
    this.character = character;
    this.exp = 0;
    this.level = 1;
  }
  getLevelForExp(exp) {
    let points = 0;
    let output = 0;
    for (let i = 1; i <= 99; i++) {
      points += Math.floor(i + 300 * Math.pow(2, i / 7));
      output = Math.floor(points / 4);
      if (output >= exp) {
        return i;
      }
    }
    return 99;
  }
  addExp(exp) {
    const currentExp = this.exp;
    let finalExp = currentExp + exp;
    if (finalExp > 2e8) {
      finalExp = 2e8;
    }
    const currentLevel = this.getLevelForExp(currentExp);
    const finalLevel = this.getLevelForExp(finalExp);
    if (currentLevel !== finalLevel) {
      this.setLevel(finalLevel);
      this.character.playGraphics({ id: 199, delay: 0, height: 125 });
      if (this.character instanceof Player) {
        this.character.outgoingPacketHandler.sendMessage(`Congratulations, you just advanced a ${this.info.name.toLowerCase()} level.`);
      }
    }
    this.setExp(finalExp);
    this.sync();
  }
  setExp(exp) {
    this.exp = exp;
  }
  setLevel(level) {
    this.level = level;
  }
  getExp() {
    return this.exp;
  }
  getLevel() {
    return this.level;
  }
  sync() {
    if (this.character instanceof Player) {
      this.character.outgoingPacketHandler.updateSkill(this.info.id, this.level, this.exp);
    }
  }
};

// src/game/entities/characters/skills/attack/Attack.ts
var Attack = class extends Skill {
  constructor(character) {
    super(character);
    this.info = SkillInfo.ATTACK;
  }
};

// src/game/entities/characters/skills/defence/Defence.ts
var Defence = class extends Skill {
  constructor(character) {
    super(character);
    this.info = SkillInfo.DEFENCE;
  }
};

// src/game/entities/characters/skills/strength/Strength.ts
var Strength = class extends Skill {
  constructor(character) {
    super(character);
    this.info = SkillInfo.STRENGTH;
  }
};

// src/game/entities/characters/skills/hitpoints/Hitpoints.ts
var Hitpoints = class extends Skill {
  constructor(character) {
    super(character);
    this.info = SkillInfo.HITPOINTS;
    this.exp = 1154;
    this.level = 10;
  }
};

// src/game/entities/characters/skills/ranged/Ranged.ts
var Ranged = class extends Skill {
  constructor(character) {
    super(character);
    this.info = SkillInfo.RANGED;
  }
};

// src/game/entities/characters/skills/prayer/Bone.ts
var _Bones = class {
  static getByItem(item) {
    for (let bone of _Bones.bones) {
      if (bone.id === item.definition.id)
        return bone;
    }
    return null;
  }
};
var Bones = _Bones;
Bones.bones = [
  { id: 526 /* REGULAR_BONES */, xp: 40 /* REGULAR_BONES */ },
  { id: 528 /* BURNT_BONES */, xp: 5 /* BURNT_BONES */ },
  { id: 530 /* BAT_BONES */, xp: 4 /* BAT_BONES */ },
  { id: 534 /* BABY_DRAGON_BONES */, xp: 30 /* BABY_DRAGON_BONES */ },
  { id: 536 /* DRAGON_BONES */, xp: 72 /* DRAGON_BONES */ },
  { id: 2859 /* WOLF_BONES */, xp: 14 /* WOLF_BONES */ },
  { id: 3123 /* SHAIKAHAN_BONES */, xp: 25 /* SHAIKAHAN_BONES */ },
  { id: 3125 /* JOGRE_BONES */, xp: 15 /* JOGRE_BONES */ },
  { id: 3127 /* BURNT_ZOGRE_BONES */, xp: 25 /* BURNT_ZOGRE_BONES */ },
  { id: 3179 /* MONKEY_BONES_SMALL_0 */, xp: 13 /* MONKEY_BONES_SMALL_0 */ },
  { id: 3180 /* MONKEY_BONES_MEDIUM */, xp: 14 /* MONKEY_BONES_MEDIUM */ },
  { id: 3181 /* MONKEY_BONES_LARGE_0 */, xp: 14 /* MONKEY_BONES_LARGE_0 */ },
  { id: 3182 /* MONKEY_BONES_LARGE_1 */, xp: 14 /* MONKEY_BONES_LARGE_1 */ },
  { id: 3187 /* SHAKING_BONES */, xp: 14 /* SHAKING_BONES */ },
  { id: 4830 /* FAYRG_BONES */, xp: 84 /* FAYRG_BONES */ },
  { id: 4832 /* RAURG_BONES */, xp: 96 /* RAURG_BONES */ },
  { id: 4834 /* OURG_BONES */, xp: 140 /* OURG_BONES */ }
];

// src/game/entities/characters/skills/prayer/Prayer.ts
var Prayer = class extends Skill {
  constructor(character) {
    super(character);
    this.info = SkillInfo.PRAYER;
  }
  buryItem(item, inventorySlot) {
    const bone = Bones.getByItem(item);
    if (!bone) {
      console.log("Tried to bury an item that is not a bone.");
      return;
    }
    if (!(this.character instanceof Player)) {
      console.log("Only a player can bury bones.");
    }
    const player = this.character;
    player.actions.add({
      run: () => new Promise((resolve) => {
        player.outgoingPacketHandler.sendMessage("You dig a hole in the gound...");
        player.inventory.remove(inventorySlot);
        player.playAnimation({ id: 827, delay: 0 });
        player.updateInventory();
        setTimeout(() => {
          player.outgoingPacketHandler.sendMessage("You bury the bones.");
          player.skills.prayer.addExp(bone.xp);
          resolve(true);
        }, 1e3);
      })
    });
  }
};

// src/game/entities/characters/skills/magic/Magic.ts
var Magic = class extends Skill {
  constructor(character) {
    super(character);
    this.info = SkillInfo.MAGIC;
  }
};

// src/game/entities/characters/skills/cooking/Cooking.ts
var Cooking = class extends Skill {
  constructor(character) {
    super(character);
    this.info = SkillInfo.COOKING;
  }
};

// src/game/entities/characters/skills/woodcutting/WoodcuttingTrees.ts
var WoodcuttingTrees = {
  NORMAL: {
    tree_ids: [
      1276,
      1277,
      1278,
      1279,
      1280,
      1282,
      1283,
      1284,
      1285,
      1285,
      1286,
      1289,
      1290,
      1291,
      1315,
      1316,
      1318,
      1330,
      1331,
      1332,
      1365,
      1383,
      1384,
      2409,
      3033,
      3034,
      3035,
      3036,
      3881,
      3882,
      3883,
      5902,
      5903,
      5904,
      10041
    ],
    log_id: 1511,
    stump_id: 1342,
    level: 1,
    exp: 25,
    chance: 100
  }
};

// src/game/entities/characters/skills/woodcutting/Woodcutting.ts
var Woodcutting = class extends Skill {
  constructor(character) {
    super(character);
    this.info = SkillInfo.WOODCUTTING;
  }
  cutObject(objectId, x, y) {
    if (!(this.character instanceof Player))
      return;
    const player = this.character;
    const landscapeItem = DataService.getInstance().landscapeItems.get(objectId);
    const treeId = WoodcuttingTrees.NORMAL.tree_ids.filter((id) => id === objectId);
    if (treeId.length == 0) {
      console.log("Tried to cut something else, but not a tree");
      return;
    }
    const woodcuttingAxeSlot = 3;
    const axeEquipment = player.equipment.get(woodcuttingAxeSlot);
    if (!axeEquipment) {
      player.outgoingPacketHandler.sendMessage("Need an axe to cut trees.");
      return;
    }
    if (axeEquipment.definition.id != 1351 /* BRONZE_AXE */) {
      player.outgoingPacketHandler.sendMessage("Need an axe to cut trees, got a sword.");
      return;
    }
    console.log(`Trying to cut ${objectId} at ${x}, ${y}`);
    console.log(landscapeItem);
    setTimeout(() => {
      player.playAnimation({ id: 879 });
    }, 1e3);
  }
};

// src/game/entities/characters/skills/fletching/Fletching.ts
var Fletching = class extends Skill {
  constructor(character) {
    super(character);
    this.info = SkillInfo.FLETCHING;
  }
};

// src/game/entities/characters/skills/fishing/Fishing.ts
var Fishing = class extends Skill {
  constructor(character) {
    super(character);
    this.info = SkillInfo.FISHING;
  }
};

// src/game/entities/characters/skills/firemaking/Firemaking.ts
var Firemaking = class extends Skill {
  constructor(character) {
    super(character);
    this.info = SkillInfo.FIREMAKING;
  }
};

// src/game/entities/characters/skills/crafting/Crafting.ts
var Crafting = class extends Skill {
  constructor(character) {
    super(character);
    this.info = SkillInfo.CRAFTING;
  }
};

// src/game/entities/characters/skills/smithing/Smithing.ts
var Smithing = class extends Skill {
  constructor(character) {
    super(character);
    this.info = SkillInfo.SMITHING;
  }
};

// src/game/entities/characters/skills/mining/Mining.ts
var Mining = class extends Skill {
  constructor(character) {
    super(character);
    this.info = SkillInfo.MINING;
  }
};

// src/game/entities/characters/skills/herblore/Herblore.ts
var Herblore = class extends Skill {
  constructor(character) {
    super(character);
    this.info = SkillInfo.HERBLORE;
  }
};

// src/game/entities/characters/skills/agility/Agility.ts
var Agility = class extends Skill {
  constructor(character) {
    super(character);
    this.info = SkillInfo.AGILITY;
  }
};

// src/game/entities/characters/skills/thieving/Thieving.ts
var Thieving = class extends Skill {
  constructor(character) {
    super(character);
    this.info = SkillInfo.THIEVING;
  }
};

// src/game/entities/characters/skills/slayer/Slayer.ts
var Slayer = class extends Skill {
  constructor(character) {
    super(character);
    this.info = SkillInfo.SLAYER;
  }
};

// src/game/entities/characters/skills/farming/Farming.ts
var Farming = class extends Skill {
  constructor(character) {
    super(character);
    this.info = SkillInfo.FARMING;
  }
};

// src/game/entities/characters/skills/runecrafting/Runecrafting.ts
var Runecrafting = class extends Skill {
  constructor(character) {
    super(character);
    this.info = SkillInfo.RUNECRAFTING;
  }
};

// src/game/entities/characters/skills/Skills.ts
var _SkillInfo = class {
  constructor(id, name, advancementWidget) {
    this.id = id;
    this.name = name;
    this.advancementWidget = advancementWidget;
  }
};
var SkillInfo = _SkillInfo;
SkillInfo.ATTACK = new _SkillInfo(0, "Attack", -1);
SkillInfo.DEFENCE = new _SkillInfo(1, "Defence", -1);
SkillInfo.STRENGTH = new _SkillInfo(2, "Strength", -1);
SkillInfo.HITPOINTS = new _SkillInfo(3, "Hitpoints", -1);
SkillInfo.RANGED = new _SkillInfo(4, "Ranged", -1);
SkillInfo.PRAYER = new _SkillInfo(5, "Prayer", -1);
SkillInfo.MAGIC = new _SkillInfo(6, "Magic", -1);
SkillInfo.COOKING = new _SkillInfo(7, "Cooking", -1);
SkillInfo.WOODCUTTING = new _SkillInfo(8, "Woodcutting", 4272);
SkillInfo.FLETCHING = new _SkillInfo(9, "Fletching", -1);
SkillInfo.FISHING = new _SkillInfo(10, "Fishing", -1);
SkillInfo.FIREMAKING = new _SkillInfo(11, "Firemaking", 4282);
SkillInfo.CRAFTING = new _SkillInfo(12, "Crafting", -1);
SkillInfo.SMITHING = new _SkillInfo(13, "Smithing", -1);
SkillInfo.MINING = new _SkillInfo(14, "Mining", -1);
SkillInfo.HERBLORE = new _SkillInfo(15, "Herblore", -1);
SkillInfo.AGILITY = new _SkillInfo(16, "Agility", -1);
SkillInfo.THIEVING = new _SkillInfo(17, "Thieving", -1);
SkillInfo.SLAYER = new _SkillInfo(18, "Slayer", -1);
SkillInfo.FARMING = new _SkillInfo(19, "Farming", -1);
SkillInfo.RUNECRAFTING = new _SkillInfo(20, "Runecrafting", -1);
var Skills = class {
  constructor(character) {
    this.character = character;
    this.attack = new Attack(this.character);
    this.defence = new Defence(this.character);
    this.strength = new Strength(this.character);
    this.hitpoints = new Hitpoints(this.character);
    this.ranged = new Ranged(this.character);
    this.prayer = new Prayer(this.character);
    this.magic = new Magic(this.character);
    this.cooking = new Cooking(this.character);
    this.woodcutting = new Woodcutting(this.character);
    this.fletching = new Fletching(this.character);
    this.fishing = new Fishing(this.character);
    this.firemaking = new Firemaking(this.character);
    this.crafting = new Crafting(this.character);
    this.smithing = new Smithing(this.character);
    this.mining = new Mining(this.character);
    this.herblore = new Herblore(this.character);
    this.agility = new Agility(this.character);
    this.thieving = new Thieving(this.character);
    this.slayer = new Slayer(this.character);
    this.farming = new Farming(this.character);
    this.runecrafting = new Runecrafting(this.character);
    this.skillIds = [
      this.attack,
      this.defence,
      this.strength,
      this.hitpoints,
      this.ranged,
      this.prayer,
      this.magic,
      this.cooking,
      this.woodcutting,
      this.fletching,
      this.fishing,
      this.firemaking,
      this.crafting,
      this.smithing,
      this.mining,
      this.herblore,
      this.agility,
      this.thieving,
      this.slayer,
      this.farming,
      this.runecrafting
    ];
  }
  syncSkills() {
    for (let skill of this.skillIds) {
      skill.sync();
    }
  }
  getById(id) {
    return this.skillIds[id];
  }
};

// src/game/entities/characters/UpdateFlags.ts
var UpdateFlags = class {
  constructor() {
    this._chatMessages = [];
    this.reset();
  }
  reset() {
    this._mapRegionUpdateRequired = false;
    this._appearanceUpdateRequired = false;
    this._facePosition = null;
    this._faceMob = void 0;
    this._graphics = null;
    this._animation = void 0;
    this._primaryHit = void 0;
    this._secondaryHit = void 0;
    this._transform = void 0;
    if (this._chatMessages.length !== 0) {
      this._chatMessages.shift();
    }
  }
  addChatMessage(chatMessage) {
    if (this._chatMessages.length > 4) {
      return;
    }
    this._chatMessages.push(chatMessage);
  }
  get updateBlockRequired() {
    return this._appearanceUpdateRequired || this._chatMessages !== null || this._facePosition !== null || this._graphics !== null || this._animation !== void 0 || this._faceMob !== void 0;
  }
  get mapRegionUpdateRequired() {
    return this._mapRegionUpdateRequired;
  }
  set mapRegionUpdateRequired(value) {
    this._mapRegionUpdateRequired = value;
  }
  get appearanceUpdateRequired() {
    return this._appearanceUpdateRequired;
  }
  set appearanceUpdateRequired(value) {
    this._appearanceUpdateRequired = value;
  }
  get chatMessages() {
    return this._chatMessages;
  }
  set chatMessages(value) {
    this._chatMessages = value;
  }
  get facePosition() {
    return this._facePosition;
  }
  set facePosition(value) {
    this._facePosition = value;
  }
  get faceMob() {
    return this._faceMob;
  }
  set faceMob(value) {
    this._faceMob = value;
  }
  get graphics() {
    return this._graphics;
  }
  set graphics(value) {
    this._graphics = value;
  }
  get animation() {
    return this._animation;
  }
  set animation(value) {
    this._animation = value;
  }
  get primaryHit() {
    return this._primaryHit;
  }
  set primaryHit(value) {
    this._primaryHit = value;
  }
  get secondaryHit() {
    return this._secondaryHit;
  }
  set secondaryHit(value) {
    this._secondaryHit = value;
  }
  get transform() {
    return this._transform;
  }
  set transform(value) {
    this._transform = value;
  }
};

// src/game/entities/characters/CharacterMovement.ts
var Point = class extends Position {
  constructor(x, y, direction) {
    super(x, y);
    this.setDirection(direction);
  }
  getDirection() {
    return this.direction;
  }
  setDirection(direction) {
    this.direction = direction;
  }
};
var CharacterMovement = class {
  constructor(character) {
    this.waypoints = new Deque();
    this.runPath = false;
    this.character = character;
  }
  update() {
    let walkPoint;
    let runPoint = null;
    walkPoint = this.waypoints.poll();
    if (this.character instanceof Player) {
      const player = this.character;
      if (player.attributes.getSettings().runToggled || this.isRunPath()) {
        if (player.attributes.hasRunEnergy()) {
          runPoint = this.waypoints.poll();
        } else {
          player.outgoingPacketHandler.updateClientSetting(173, 0);
          player.attributes.getSettings().runToggled = false;
          this.setRunPath(false);
          runPoint = null;
        }
      }
    } else if (this.isRunPath()) {
      runPoint = this.waypoints.poll();
    }
    if (walkPoint != null && walkPoint.getDirection() != -1) {
      if (!(this.character instanceof Player)) {
        const nonWalkable = DataService.getInstance().cacheData.walkableTiles[walkPoint.getZ()][walkPoint.getX()][walkPoint.getY()];
        let canWalk = true;
        if (nonWalkable === void 0)
          canWalk = false;
        if (nonWalkable === true)
          canWalk = false;
        if (!canWalk)
          return;
      }
      this.character.position.move(Position.DIRECTION_DELTA_X[walkPoint.getDirection()], Position.DIRECTION_DELTA_Y[walkPoint.getDirection()]);
      this.character.setWalkDirection(walkPoint.getDirection());
    }
    if (runPoint != null && runPoint.getDirection() != -1) {
      this.character.position.move(Position.DIRECTION_DELTA_X[runPoint.getDirection()], Position.DIRECTION_DELTA_Y[runPoint.getDirection()]);
      this.character.setRunDirection(runPoint.getDirection());
      if (this.character instanceof Player) {
        const player = this.character;
        player.attributes.decreaseRunEnergy(player.getRunEnergyDecrement());
        player.outgoingPacketHandler.updateEnergy(player.attributes.getRunEnergy());
      }
    } else {
      if (this.character instanceof Player) {
        const player = this.character;
        if (player.attributes.getRunEnergy() != 100) {
          player.attributes.increaseRunEnergy(player.getRunEnergyIncrement());
          player.outgoingPacketHandler.updateEnergy(player.attributes.getRunEnergy());
        }
      }
    }
    const deltaX = this.character.position.getX() - this.character.lastRegionPosition.regionX * 8;
    const deltaY = this.character.position.getY() - this.character.lastRegionPosition.regionY * 8;
    if (deltaX < 16 || deltaX >= 88 || deltaY < 16 || deltaY > 88) {
      if (this.character instanceof Player) {
        const player = this.character;
        player.updateFlags.mapRegionUpdateRequired = true;
        player.lastRegionPosition.setAs(player.position);
      }
    }
  }
  lateUpdate() {
  }
  reset() {
    this.setRunPath(false);
    this.waypoints.clear();
    const p = this.character.position;
    this.waypoints.add(new Point(p.getX(), p.getY(), -1));
  }
  finish() {
    this.waypoints.poll();
  }
  addToPath(position) {
    if (this.waypoints.size == 0) {
      this.reset();
    }
    const last = this.waypoints.peekBack();
    let deltaX = position.getX() - last.getX();
    let deltaY = position.getY() - last.getY();
    const max = Math.max(Math.abs(deltaX), Math.abs(deltaY));
    for (let i = 0; i < max; i++) {
      if (deltaX < 0) {
        deltaX++;
      } else if (deltaX > 0) {
        deltaX--;
      }
      if (deltaY < 0) {
        deltaY++;
      } else if (deltaY > 0) {
        deltaY--;
      }
      this.addStep(position.getX() - deltaX, position.getY() - deltaY);
    }
  }
  addStep(x, y) {
    if (this.waypoints.size >= 100) {
      return;
    }
    const last = this.waypoints.peekBack();
    const deltaX = x - last.getX();
    const deltaY = y - last.getY();
    const direction = Position.direction(deltaX, deltaY);
    if (direction > -1) {
      this.waypoints.add(new Point(x, y, direction));
    }
  }
  waitForCharacterToReachPosition(position, minDistance = 1) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.character.position.distanceBetween(position) <= minDistance) {
          clearInterval(interval);
          resolve(true);
        }
        if (this.pendingMovementsSize() == 0) {
          clearInterval(interval);
          resolve(false);
        }
      }, 100);
    });
  }
  isRunPath() {
    return this.runPath;
  }
  setRunPath(runPath) {
    this.runPath = runPath;
  }
  isWalking() {
    return this.waypoints.size != 0;
  }
  pendingMovementsSize() {
    return this.waypoints.size;
  }
};

// src/game/entities/characters/Character.ts
var Character = class extends Entity {
  constructor() {
    super();
    this.walkDirection = -1;
    this.runDirection = -1;
    this.faceDirection = -1;
    this.resetMovementQueue = false;
    this.needsPlacement = false;
    this.slot = -1;
    this.updateFlags = new UpdateFlags();
    this.equipment = new Inventory(14 /* EQUIPMENT_CAPACITY */);
    this.inventory = new Inventory(28 /* INVENTORY_CAPACITY */);
    this.skills = new Skills(this);
    this.actions = new CharacterActions();
    this.movementHandler = new CharacterMovement(this);
  }
  reset() {
    this.updateFlags.reset();
    this.setWalkDirection(-1);
    this.setRunDirection(-1);
    this.setFaceDirection(-1);
    this.setResetMovementQueue(false);
  }
  update() {
    this.actions.update();
    this.movementHandler.update();
  }
  lateUpdate() {
    this.actions.lateUpdate();
  }
  setWalkDirection(walkDirection) {
    this.walkDirection = walkDirection;
  }
  getWalkDirection() {
    return this.walkDirection;
  }
  setRunDirection(runDirection) {
    this.runDirection = runDirection;
  }
  getRunDirection() {
    return this.runDirection;
  }
  setFaceDirection(faceDirection) {
    this.faceDirection = faceDirection;
  }
  getFaceDirection() {
    return this.faceDirection;
  }
  playAnimation(animation) {
    this.updateFlags.animation = animation;
  }
  playGraphics(graphics) {
    this.updateFlags.graphics = graphics;
  }
  isResetMovementQueue() {
    return this.resetMovementQueue;
  }
  setResetMovementQueue(resetMovementQueue) {
    this.resetMovementQueue = resetMovementQueue;
  }
  dealDamage(damage, type, secondary) {
    const currentHealth = Math.max(this.skills.hitpoints.getLevel() - damage, 0);
    const maxHealth = this.skills.hitpoints.getLevelForExp(this.skills.hitpoints.getExp());
    if (secondary)
      this.updateFlags.secondaryHit = { damage, type, health: currentHealth, maxHealth };
    else
      this.updateFlags.primaryHit = { damage, type, health: currentHealth, maxHealth };
    this.skills.hitpoints.setLevel(currentHealth);
  }
  getSlot() {
    return this.slot;
  }
  setSlot(slot) {
    this.slot = slot;
  }
};

// src/game/entities/characters/CharacterUpdating.ts
var CharacterUpdating = class {
  static appendMovement(mob, packet) {
    const walkDirection = mob.getWalkDirection();
    const runDirection = mob.getRunDirection();
    if (walkDirection !== -1) {
      packet.writeBits(1, 1);
      if (runDirection === -1) {
        packet.writeBits(2, 1);
        packet.writeBits(3, walkDirection);
      } else {
        packet.writeBits(2, 2);
        packet.writeBits(3, walkDirection);
        packet.writeBits(3, runDirection);
      }
      packet.writeBits(1, mob.updateFlags.updateBlockRequired ? 1 : 0);
    } else {
      if (mob.updateFlags.updateBlockRequired) {
        packet.writeBits(1, 1);
        packet.writeBits(2, 0);
      } else {
        packet.writeBits(1, 0);
      }
    }
  }
};

// src/util/uuidv4.ts
function uuidv4() {
  var d = new Date().getTime();
  var d2 = typeof performance !== "undefined" && performance.now && performance.now() * 1e3 || 0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : r & 3 | 8).toString(16);
  });
}

// src/game/entities/characters/npc/Npc.ts
var Npc = class extends Character {
  constructor(definition) {
    super();
    this.worldIndex = 1;
    this.initialPosition = new Position(0, 0, 0);
    this.uuid = uuidv4();
    this.definition = definition;
    const position = new Position(this.definition.spawn[0].x, this.definition.spawn[0].y);
    this.position.setAs(position);
    this.initialPosition.setAs(position);
    this.skills.hitpoints.setLevel(this.definition.lifepoints);
    if (definition.drops.default.length > 0) {
      setInterval(() => {
        if (!this.movementHandler.isWalking()) {
          const movementChance = Math.random();
          if (movementChance < 0.7)
            return;
          const movementXChance = Math.random() < 0.5;
          const movementYChance = Math.random() < 0.5;
          const movement_radius = 10;
          const r = movement_radius * Math.sqrt(Math.random());
          const theta = Math.random() * 2 * Math.PI;
          const newX = this.initialPosition.getX() + r * Math.cos(theta);
          const newY = this.initialPosition.getY() + r * Math.sin(theta);
          const newPosition = new Position(
            movementXChance ? newX : this.position.getX(),
            movementYChance ? newY : this.position.getY()
          );
          this.movementHandler.reset();
          this.movementHandler.addToPath(newPosition);
          this.movementHandler.finish();
        }
      }, 1e3);
    }
  }
  initiateRandomMovement() {
    setInterval(() => {
      const movementChance = Math.floor(Math.random() * 10);
      const movementRadius = 20;
      if (movementChance < 7) {
        return;
      }
      let px;
      let py;
      let movementAllowed = false;
      while (!movementAllowed) {
        px = this.position.getX();
        py = this.position.getY();
        const moveXChance = Math.floor(Math.random() * 10);
        if (moveXChance > 6) {
          const moveXAmount = Math.floor(Math.random() * 5);
          const moveXMod = Math.floor(Math.random() * 2);
          if (moveXMod === 0) {
            px -= moveXAmount;
          } else {
            px += moveXAmount;
          }
        }
        const moveYChance = Math.floor(Math.random() * 10);
        if (moveYChance > 6) {
          const moveYAmount = Math.floor(Math.random() * 5);
          const moveYMod = Math.floor(Math.random() * 2);
          if (moveYMod === 0) {
            py -= moveYAmount;
          } else {
            py += moveYAmount;
          }
        }
        let valid = true;
        if (this instanceof Npc) {
          if (px > this.initialPosition.getX() + movementRadius || px < this.initialPosition.getX() - movementRadius || py > this.initialPosition.getY() + movementRadius || py < this.initialPosition.getY() - movementRadius) {
            valid = false;
          }
        }
        movementAllowed = valid;
      }
      if (px !== this.position.getX() || py !== this.position.getY()) {
        this.movementHandler.reset();
        this.movementHandler.addToPath(new Position(px, py));
        this.movementHandler.finish();
      }
    }, 1e3);
  }
  set position(position) {
    super.position = position;
  }
  get position() {
    return super.position;
  }
  update() {
    super.update();
  }
  lateUpdate() {
    super.lateUpdate();
  }
  equals(other) {
    if (!other) {
      return false;
    }
    return other.definition.id === this.definition.id && other.uuid === this.uuid;
  }
};

// src/game/entities/characters/CharacterTracker.ts
var CharacterTracker = class {
  constructor(player, type) {
    this.player = player;
    this.trackingType = type;
    this.tracked = /* @__PURE__ */ new Map();
    this.unregisteredCount = 0;
  }
  parseCharacters(characters) {
    for (const character of characters) {
      if (character instanceof Npc) {
        if (!GameService.getInstance().npcExists(character)) {
          continue;
        }
      } else if (character instanceof Player) {
        if (!GameService.getInstance().playerExists(character)) {
          continue;
        }
        if (character.equals(this.player)) {
          continue;
        }
      }
      if (this.tracked.has(character)) {
        continue;
      }
      if (!character.position.isViewableFrom(this.player.position)) {
        continue;
      }
      if (this.tracked.size >= 255) {
        return;
      }
      this.tracked.set(character, false);
      this.unregisteredCount++;
    }
  }
  update() {
    if (this.trackingType == 0 /* NPC */) {
      const npcs = GameService.getInstance().getNpcs();
      this.parseCharacters(npcs);
    } else if (this.trackingType == 1 /* PLAYER */) {
      const players = GameService.getInstance().getPlayers();
      this.parseCharacters(players);
    }
  }
  getTracked() {
    return this.tracked;
  }
  register(character) {
    if (!this.tracked.has(character)) {
      console.error("Tried to register non existing character.");
      return;
    }
    this.tracked.set(character, true);
    this.unregisteredCount--;
  }
  getUnregisteredCount() {
    return this.unregisteredCount;
  }
  getRegisteredCount() {
    return Math.abs(this.unregisteredCount - this.tracked.size);
  }
  remove(character) {
    return this.tracked.delete(character);
  }
};

// src/game/entities/characters/player/PlayerUpdateHandler.ts
var PlayerUpdateHandler = class {
  constructor(player) {
    this.player = player;
    this.playerTracker = new CharacterTracker(this.player, 1 /* PLAYER */);
  }
  update() {
    this.playerTracker.update();
  }
  lateUpdate() {
    const playerUpdatePacket = new Packet(90, "DYNAMIC_LARGE" /* DYNAMIC_LARGE */, 16);
    playerUpdatePacket.openBitChannel();
    const updateMaskData = StreamBuffer.create();
    if (this.player.updateFlags.mapRegionUpdateRequired) {
      this.appendUpdateMapRegionChanged(this.player, playerUpdatePacket);
    } else {
      CharacterUpdating.appendMovement(this.player, playerUpdatePacket);
    }
    this.appendUpdateMaskData(this.player, updateMaskData, false, true);
    this.appendNewPlayers(playerUpdatePacket, updateMaskData);
    if (updateMaskData.getWriterIndex() !== 0) {
      playerUpdatePacket.writeBits(11, 2047);
      playerUpdatePacket.closeBitChannel();
      playerUpdatePacket.writeBytes(updateMaskData);
    } else {
      playerUpdatePacket.closeBitChannel();
    }
    this.player.client.send(playerUpdatePacket);
  }
  appendNewPlayers(packet, updateMaskData) {
    packet.writeBits(8, this.playerTracker.getRegisteredCount());
    const trackedCharacters = this.playerTracker.getTracked();
    for (let trackedCharacterPair of trackedCharacters) {
      const otherPlayer = trackedCharacterPair[0];
      const isRegistered = trackedCharacterPair[1];
      if (!GameService.getInstance().playerExists(otherPlayer)) {
        packet.writeBits(1, 1);
        packet.writeBits(2, 3);
        this.playerTracker.remove(otherPlayer);
        continue;
      }
      if (!isRegistered) {
        const positionOffsetX = otherPlayer.position.getX() - this.player.position.getX();
        const positionOffsetY = otherPlayer.position.getY() - this.player.position.getY();
        packet.writeBits(11, otherPlayer.getSlot());
        packet.writeBits(5, positionOffsetX);
        packet.writeBits(1, otherPlayer.updateFlags.updateBlockRequired ? 1 : 0);
        packet.writeBits(1, 1);
        packet.writeBits(5, positionOffsetY);
        this.appendUpdateMaskData(otherPlayer, updateMaskData, true);
        this.playerTracker.register(otherPlayer);
        continue;
      }
      if (otherPlayer.position.isViewableFrom(this.player.position)) {
        CharacterUpdating.appendMovement(otherPlayer, packet);
        this.appendUpdateMaskData(otherPlayer, updateMaskData);
      } else {
        packet.writeBits(1, 1);
        packet.writeBits(2, 3);
        this.playerTracker.remove(otherPlayer);
      }
    }
  }
  appendUpdateMapRegionChanged(player, packet) {
    const posX = player.position.regionLocalX;
    const posY = player.position.regionLocalY;
    const posZ = player.position.getZ();
    packet.writeBits(1, 1);
    packet.writeBits(2, 3);
    packet.writeBits(1, 0);
    packet.writeBits(2, posZ);
    packet.writeBits(7, posY);
    packet.writeBits(7, posX);
    packet.writeBits(1, player.updateFlags.updateBlockRequired ? 1 : 0);
  }
  appendUpdateMaskData(player, updateMaskData, forceUpdate, currentPlayer) {
    const updateFlags = player.updateFlags;
    if (!updateFlags.updateBlockRequired && !forceUpdate) {
      return;
    }
    let mask = 0;
    if (updateFlags.appearanceUpdateRequired || forceUpdate) {
      mask |= 4;
    }
    if (updateFlags.faceMob !== void 0) {
      mask |= 1;
    }
    if (updateFlags.facePosition || forceUpdate) {
      mask |= 2;
    }
    if (updateFlags.chatMessages.length !== 0 && !currentPlayer) {
      mask |= 64;
    }
    if (updateFlags.graphics) {
      mask |= 512;
    }
    if (updateFlags.animation !== void 0) {
      mask |= 8;
    }
    if (mask >= 255) {
      mask |= 32;
      updateMaskData.writeByte(mask & 255);
      updateMaskData.writeByte(mask >> 8);
    } else {
      updateMaskData.writeByte(mask);
    }
    if (updateFlags.animation !== void 0) {
      const animation = updateFlags.animation;
      if (animation === null || animation.id === -1) {
        updateMaskData.writeShortBE(-1);
        updateMaskData.writeNegativeOffsetByte(0);
      } else {
        const delay = updateFlags.animation.delay || 0;
        updateMaskData.writeShortBE(updateFlags.animation.id);
        updateMaskData.writeNegativeOffsetByte(delay);
      }
    }
    if (updateFlags.chatMessages.length !== 0 && !currentPlayer) {
      const message = updateFlags.chatMessages[0];
      updateMaskData.writeUnsignedShortBE(((message.color & 255) << 8) + (message.effects & 255));
      updateMaskData.writeByteInverted(player.attributes.getPrivilege());
      updateMaskData.writeOffsetByte(message.data.length);
      for (let i = 0; i < message.data.length; i++) {
        updateMaskData.writeOffsetByte(message.data.readInt8(i));
      }
    }
    if (updateFlags.faceMob !== void 0) {
      const mob = updateFlags.faceMob;
      if (mob === null) {
        updateMaskData.writeOffsetShortBE(65535);
      } else {
        let mobIndex = mob.worldIndex;
        if (mob instanceof Player) {
          mobIndex += 32768 + 1;
        }
        updateMaskData.writeOffsetShortBE(mobIndex);
      }
    }
    if (updateFlags.facePosition || forceUpdate) {
      if (forceUpdate) {
        const position = player.position.fromDirection(player.getFaceDirection());
        updateMaskData.writeShortBE(position.getX() * 2 + 1);
        updateMaskData.writeShortBE(position.getY() * 2 + 1);
      } else {
        const position = updateFlags.facePosition;
        updateMaskData.writeShortBE(position.getX() * 2 + 1);
        updateMaskData.writeShortBE(position.getY() * 2 + 1);
      }
    }
    if (updateFlags.graphics) {
      const delay = updateFlags.graphics.delay || 0;
      updateMaskData.writeOffsetShortBE(updateFlags.graphics.id);
      updateMaskData.writeIntME1(updateFlags.graphics.height << 16 | delay & 65535);
    }
    if (updateFlags.appearanceUpdateRequired || forceUpdate) {
      const appearanceData = StreamBuffer.create();
      appearanceData.writeByte(player.attributes.appearance.gender);
      appearanceData.writeByte(-1);
      appearanceData.writeByte(-1);
      const equipment = player.equipment;
      for (let i = 0; i < 4; i++) {
        const item = equipment.get(i);
        if (item) {
          appearanceData.writeShortBE(512 + item.definition.id);
        } else {
          appearanceData.writeByte(0);
        }
      }
      const torsoItem = equipment.get(4 /* TORSO */);
      if (torsoItem) {
        appearanceData.writeShortBE(512 + torsoItem.definition.id);
      } else {
        appearanceData.writeShortBE(256 + player.attributes.appearance.torso);
      }
      const offHandItem = equipment.get(5 /* OFF_HAND */);
      if (offHandItem) {
        appearanceData.writeShortBE(512 + offHandItem.definition.id);
      } else {
        appearanceData.writeByte(0);
      }
      appearanceData.writeShortBE(256 + player.attributes.appearance.arms);
      this.appendBasicAppearanceItem(appearanceData, equipment, player.attributes.appearance.legs, 7 /* LEGS */);
      appearanceData.writeShortBE(256 + player.attributes.appearance.head);
      this.appendBasicAppearanceItem(appearanceData, player.equipment, player.attributes.appearance.hands, 9 /* GLOVES */);
      this.appendBasicAppearanceItem(appearanceData, player.equipment, player.attributes.appearance.feet, 10 /* BOOTS */);
      appearanceData.writeShortBE(256 + player.attributes.appearance.facialHair);
      [
        player.attributes.appearance.hairColor,
        player.attributes.appearance.torsoColor,
        player.attributes.appearance.legColor,
        player.attributes.appearance.feetColor,
        player.attributes.appearance.skinColor
      ].forEach((color) => appearanceData.writeByte(color));
      [
        808,
        823,
        819,
        820,
        821,
        822,
        824
      ].forEach((animationId) => appearanceData.writeShortBE(animationId));
      appearanceData.writeLongBE(stringToLong(player.attributes.getUsername()));
      appearanceData.writeByte(3);
      appearanceData.writeShortBE(0);
      const appearanceDataSize = appearanceData.getWriterIndex();
      updateMaskData.writeByte(appearanceDataSize);
      updateMaskData.writeBytes(appearanceData.getData().reverse());
    }
  }
  appendBasicAppearanceItem(buffer, equipment, appearanceInfo, equipmentSlot) {
    const item = equipment.get(equipmentSlot);
    if (item) {
      buffer.writeShortBE(512 + item.definition.id);
    } else {
      buffer.writeShortBE(256 + appearanceInfo);
    }
  }
};

// src/game/entities/characters/player/NpcUpdateHandler.ts
var NpcUpdateHandler = class {
  constructor(player) {
    this.player = player;
    this.npcTracker = new CharacterTracker(this.player, 0 /* NPC */);
  }
  update() {
    this.npcTracker.update();
  }
  lateUpdate() {
    const npcUpdatePacket = new Packet(71, "DYNAMIC_LARGE" /* DYNAMIC_LARGE */);
    const updateMaskData = StreamBuffer.create();
    npcUpdatePacket.openBitChannel();
    this.appendNewNpcs(npcUpdatePacket, updateMaskData);
    if (updateMaskData.getWriterIndex() !== 0) {
      npcUpdatePacket.writeBits(14, 16383);
      npcUpdatePacket.closeBitChannel();
      npcUpdatePacket.writeBytes(updateMaskData);
    } else {
      npcUpdatePacket.closeBitChannel();
    }
    this.player.client.send(npcUpdatePacket);
  }
  appendNewNpcs(packet, updateMaskData) {
    packet.writeBits(8, this.npcTracker.getRegisteredCount());
    const trackedCharacters = this.npcTracker.getTracked();
    for (let trackedCharacterPair of trackedCharacters) {
      const npcCharacter = trackedCharacterPair[0];
      const isRegistered = trackedCharacterPair[1];
      if (!isRegistered) {
        this.appendAddNpcUpdate(npcCharacter, packet);
        this.appendUpdateMaskData(npcCharacter, updateMaskData);
        this.npcTracker.register(npcCharacter);
        continue;
      }
      if (npcCharacter.position.isViewableFrom(this.player.position)) {
        CharacterUpdating.appendMovement(npcCharacter, packet);
        this.appendUpdateMaskData(npcCharacter, updateMaskData);
      } else {
        this.removeNpcUpdate(packet);
        this.npcTracker.remove(npcCharacter);
      }
    }
  }
  appendAddNpcUpdate(npc, packet) {
    const positionOffsetX = npc.position.getX() - this.player.position.getX();
    const positionOffsetY = npc.position.getY() - this.player.position.getY();
    packet.writeBits(14, npc.getSlot());
    packet.writeBits(1, npc.updateFlags.updateBlockRequired ? 1 : 0);
    packet.writeBits(5, positionOffsetY);
    packet.writeBits(5, positionOffsetX);
    packet.writeBits(1, 1);
    packet.writeBits(13, npc.definition.id);
  }
  removeNpcUpdate(packet) {
    packet.writeBits(1, 1);
    packet.writeBits(2, 3);
  }
  appendUpdateMaskData(npc, updateMaskData) {
    const updateFlags = npc.updateFlags;
    if (!updateFlags.updateBlockRequired) {
      return;
    }
    let mask = 0;
    if (updateFlags.transform !== void 0) {
      mask |= 1;
    }
    if (updateFlags.faceMob !== void 0) {
      mask |= 64;
    }
    if (updateFlags.primaryHit !== void 0) {
      mask |= 128;
    }
    if (updateFlags.chatMessages.length !== 0) {
      mask |= 32;
    }
    if (updateFlags.facePosition) {
      mask |= 8;
    }
    if (updateFlags.animation) {
      mask |= 2;
    }
    updateMaskData.writeUnsignedByte(mask);
    if (updateFlags.transform !== void 0) {
      this.appendTransform(npc, updateMaskData);
    }
    if (updateFlags.faceMob !== void 0) {
      this.appendFaceMob(npc, updateMaskData);
    }
    if (updateFlags.primaryHit !== void 0) {
      this.appendPrimaryHit(npc, updateMaskData);
    }
    if (updateFlags.chatMessages.length !== 0) {
      this.appendChatMessages(npc, updateMaskData);
    }
    if (updateFlags.facePosition) {
      this.appendFacePosition(npc, updateMaskData);
    }
    if (updateFlags.animation) {
      this.appendAnimation(npc, updateMaskData);
    }
  }
  appendTransform(npc, updateMaskData) {
    updateMaskData.writeUnsignedShortLE(npc.updateFlags.transform.id);
  }
  appendFaceMob(npc, updateMaskData) {
    const mob = npc.updateFlags.faceMob;
    if (mob === null) {
      updateMaskData.writeUnsignedShortLE(65535);
    } else {
      let mobIndex = mob.worldIndex;
      if (mob instanceof Player) {
        mobIndex += 32768 + 1;
      }
      updateMaskData.writeUnsignedShortLE(mobIndex);
    }
  }
  appendPrimaryHit(npc, updateMaskData) {
    updateMaskData.writeOffsetByte(npc.updateFlags.primaryHit.damage);
    updateMaskData.writeOffsetByte(npc.updateFlags.primaryHit.type);
    updateMaskData.writeByte(npc.updateFlags.primaryHit.health);
    updateMaskData.writeNegativeOffsetByte(npc.updateFlags.primaryHit.maxHealth);
  }
  appendGraphics(npc, updateMaskData) {
  }
  appendChatMessages(npc, updateMaskData) {
    const message = npc.updateFlags.chatMessages[0];
    if (message.message) {
      updateMaskData.writeString(message.message);
    } else {
      updateMaskData.writeString("Undefined Message");
    }
  }
  appendFacePosition(npc, updateMaskData) {
    const position = npc.updateFlags.facePosition;
    updateMaskData.writeOffsetShortLE(position.getX() * 2 + 1);
    updateMaskData.writeShortLE(position.getY() * 2 + 1);
  }
  appendAnimation(npc, updateMaskData) {
    const animation = npc.updateFlags.animation;
    if (animation === null || animation.id === -1) {
      updateMaskData.writeShortBE(-1);
      updateMaskData.writeNegativeOffsetByte(0);
    } else {
      const delay = npc.updateFlags.animation.delay || 0;
      updateMaskData.writeShortBE(animation.id);
      updateMaskData.writeNegativeOffsetByte(delay);
    }
  }
  appendSecondaryHit(npc, updateMaskData) {
  }
};

// src/game/entities/characters/player/Player.ts
var _Player = class extends Character {
  constructor(client) {
    super();
    this.worldIndex = 1;
    this.incomingPacketHandler = new PlayerIncomingPackets(this);
    this.outgoingPacketHandler = new PlayerOutgoingPackets(this);
    this.client = client;
    this.client.onDataReceivedCallback = (buffer) => {
      const dataParser = new PlayerIncomingPackets(this);
      dataParser.parse(buffer);
    };
    this.client.onDisconnected = () => {
      this.stopSession();
    };
    this.playerUpdateHandler = new PlayerUpdateHandler(this);
    this.npcUpdateHandler = new NpcUpdateHandler(this);
    this.attributes = new PlayerAttributes();
  }
  initSession(newPlayer) {
    this.updateFlags.mapRegionUpdateRequired = true;
    this.updateFlags.appearanceUpdateRequired = true;
    const settings2 = Server.getInstance().getSettings();
    this.position.setAs(new Position(3222, 3222, 0));
    this.skills.syncSkills();
    this.inventory.addById(1048);
    this.inventory.addById(1351);
    this.inventory.addById(1277);
    this.inventory.addById(526);
    this.inventory.addById(526);
    this.inventory.addById(526);
    this.updateInventory();
    this.updateEquipment();
    this.updateTabs();
    this.outgoingPacketHandler.updateEnergy(this.attributes.getRunEnergy());
    this.updateWidgetSettings();
    this.outgoingPacketHandler.sendMessage("Welcome to " + settings2.serverName + "!");
    console.log(this + " has logged in.");
    this.updateBonuses();
    setTimeout(() => {
      console.log("Playing song.");
      this.outgoingPacketHandler.playSong(76);
    }, 5e3);
  }
  stopSession() {
    GameService.getInstance().removePlayer(this);
    this.outgoingPacketHandler.sendLogout();
    this.client.disconnect();
    console.log(`${this.attributes.getUsername()} has logged out.`);
  }
  getRunEnergyIncrement() {
    return 0.6;
  }
  getRunEnergyDecrement() {
    return 0.6;
  }
  equals(player) {
    if (this.worldIndex !== player.worldIndex)
      return false;
    if (this.attributes.getUsername() !== player.attributes.getUsername())
      return false;
    if (this.attributes.getUserId() !== player.attributes.getUserId())
      return false;
    if (this.getSlot() !== player.getSlot())
      return false;
    return true;
  }
  update() {
    super.update();
    this.playerUpdateHandler.update();
    this.npcUpdateHandler.update();
    if (this.updateFlags.mapRegionUpdateRequired) {
      this.outgoingPacketHandler.updateMapRegion(this.position.regionX, this.position.regionY);
    }
  }
  lateUpdate() {
    super.lateUpdate();
    this.playerUpdateHandler.lateUpdate();
    this.npcUpdateHandler.lateUpdate();
  }
  reset() {
    super.reset();
  }
  updateWidgetSettings() {
    const settings2 = this.attributes.getSettings();
    this.outgoingPacketHandler.updateWidgetSetting(166 /* brightness */, settings2.brightness);
    this.outgoingPacketHandler.updateWidgetSetting(170 /* mouseButtons */, settings2.mouseButtons);
    this.outgoingPacketHandler.updateWidgetSetting(287 /* splitPrivateChat */, settings2.splitPrivateChat ? 1 : 0);
    this.outgoingPacketHandler.updateWidgetSetting(171 /* chatEffects */, settings2.chatEffects ? 0 : 1);
    this.outgoingPacketHandler.updateWidgetSetting(427 /* acceptAid */, settings2.acceptAid ? 1 : 0);
    this.outgoingPacketHandler.updateWidgetSetting(173 /* runMode */, 0);
  }
  updateInventoryForType(type, inventory) {
    let itemIds = [];
    let itemAmounts = [];
    const inventoryItems = inventory.getItems();
    for (let slot = 0; slot < inventoryItems.length; slot++) {
      const item = inventoryItems[slot];
      if (item === null) {
        itemIds.push(-1);
        itemAmounts.push(0);
      } else {
        itemIds.push(item.definition.id);
        itemAmounts.push(item.amount);
      }
    }
    this.outgoingPacketHandler.updateAllWidgetItems(type, itemIds, itemAmounts);
  }
  updateInventory() {
    this.updateInventoryForType(3214 /* INVENTORY */, this.inventory);
  }
  updateEquipment() {
    this.updateInventoryForType(1688 /* EQUIPMENT */, this.equipment);
  }
  updateBonuses() {
    for (let bonus of this.attributes.getBonuses().bonuses) {
      const text = `${bonus.text}: ${bonus.amount > 0 ? `+${bonus.amount}` : bonus.amount}`;
      this.outgoingPacketHandler.updateWidgetString(bonus.id, text);
    }
  }
  updateTabs() {
    for (let tabIndex = 0; tabIndex < _Player.SIDEBAR_INTERFACE_IDS.length; tabIndex++) {
      const widgetId = _Player.SIDEBAR_INTERFACE_IDS[tabIndex];
      if (widgetId !== -1) {
        this.outgoingPacketHandler.updateTabWidget(tabIndex, widgetId);
      }
    }
  }
};
var Player = _Player;
Player.SIDEBAR_INTERFACE_IDS = [
  2423,
  3917,
  638,
  3213,
  1644,
  5608,
  1151,
  -1,
  5065,
  5715,
  2449,
  904,
  147,
  962
];

// src/game/map/GameMap.ts
var import_quadtree_lib = __toESM(require_quadtree_min());
var GameMap = class {
  constructor() {
    this.quadtree = new import_quadtree_lib.default({
      width: 1e4,
      height: 1e4
    });
    this.quadtreePlayers = new import_quadtree_lib.default({
      width: 1e4,
      height: 1e4
    });
  }
  boundingBoxCollisionFromCenter(a, b) {
    const ax1 = a.x - a.width / 2;
    const ay1 = a.y - a.height / 2;
    const bx1 = b.x - b.width / 2;
    const by1 = b.y - b.height / 2;
    return !(ay1 + a.height <= by1 || ay1 >= by1 + b.height || ax1 + a.width <= bx1 || ax1 >= bx1 + b.width);
  }
  broadcastMapObject(mapObject, type) {
    const collidingPlayers = this.quadtreePlayers.colliding({
      x: mapObject.position.getX(),
      y: mapObject.position.getY(),
      width: 1,
      height: 1
    }, this.boundingBoxCollisionFromCenter);
    for (let player of collidingPlayers) {
      if (type == 0 /* ADD */) {
        player.player.outgoingPacketHandler.setMapObject(mapObject);
      } else if (type == 1 /* REMOVE */) {
        player.player.outgoingPacketHandler.removeMapObject(mapObject);
      }
    }
  }
  addMapObject(mapObject, shouldBroadcast = true) {
    this.quadtree.push({
      x: mapObject.position.getX(),
      y: mapObject.position.getY(),
      width: 1,
      height: 1,
      mapObject
    });
    this.broadcastMapObject(mapObject, 0 /* ADD */);
  }
  removeMapObject(mapObject) {
    this.quadtree.find((entry) => {
      if (entry.mapObject.id === mapObject.id && entry.x === mapObject.position.getX() && entry.y == mapObject.position.getY()) {
        this.quadtree.remove(entry);
        this.broadcastMapObject(mapObject, 1 /* REMOVE */);
        return true;
      }
      return false;
    });
  }
  getMapObject(id, position) {
    const entries = this.quadtree.find((entry) => {
      return entry.mapObject.id === id && entry.x === position.getX() && entry.y == position.getY();
    });
    if (entries.length > 0) {
      return entries[0].mapObject;
    }
    const key = `${id},${position.getX()},${position.getY()}`;
    const mapObject = DataService.getInstance().mapObjects.get(key);
    if (!mapObject) {
      throw Error(`Map object not found in cache ${key}.`);
    }
    this.addMapObject(mapObject, false);
    return mapObject;
  }
  update() {
    this.quadtreePlayers.clear();
    const players = GameService.getInstance().getPlayers();
    for (let player of players) {
      this.quadtreePlayers.push({
        x: player.position.getX(),
        y: player.position.getY(),
        width: 100,
        height: 100,
        player
      });
    }
  }
};

// src/service/GameService.ts
var _GameService = class {
  constructor() {
    this.players = /* @__PURE__ */ new Map();
    this.npcs = /* @__PURE__ */ new Map();
    this.map = new GameMap();
    global.GameService = this;
    global.Position = Position;
  }
  init() {
    console.log("Started GameServer service.");
    this.spawnNpcs();
  }
  spawnNpcs() {
    for (let npcDefinition of DataService.getInstance().npcs) {
      this.createNpc(npcDefinition[1]);
    }
  }
  tick() {
    try {
      this.map.update();
      this.players.forEach((player) => player.update());
      this.npcs.forEach((npc) => npc.update());
      this.players.forEach((player) => player.lateUpdate());
      this.npcs.forEach((npc) => npc.lateUpdate());
      this.players.forEach((player) => player.reset());
      this.npcs.forEach((npc) => npc.reset());
    } catch (error) {
      console.error(error);
    }
  }
  cleanup() {
    for (let player of this.players.values()) {
      player.stopSession();
    }
  }
  createPlayer(client, userId, username, password) {
    const newPlayer = true;
    const player = new Player(client);
    player.attributes.setUserId(userId);
    player.attributes.setUsername(username);
    player.attributes.setPassword(password);
    if (this.playerExists(player)) {
      console.error("Player is already registered");
      return;
    }
    this.registerPlayer(player);
    player.initSession(newPlayer);
    return player;
  }
  playerExists(player) {
    const _player = this.players.get(player.getSlot());
    if (!_player)
      return false;
    if (!_player.equals(player))
      return false;
    return true;
  }
  registerPlayer(player) {
    if (this.players.size > _GameService.MAX_PLAYERS) {
      console.log("World is full");
      return -1;
    }
    const slot = this.players.size;
    player.setSlot(slot);
    this.players.set(slot, player);
    return slot;
  }
  removePlayer(player) {
    this.players.delete(player.getSlot());
    return true;
  }
  createNpc(config) {
    const npc = new Npc(config);
    this.registerNpc(npc);
    return npc;
  }
  npcExists(npc) {
    const _npc = this.npcs.get(npc.getSlot());
    if (!_npc)
      return false;
    if (!_npc.equals(npc))
      return false;
    return true;
  }
  registerNpc(npc) {
    if (this.npcs.size > _GameService.MAX_NPCS) {
      console.log("World is full");
      return -1;
    }
    const slot = this.npcs.size;
    npc.setSlot(slot);
    this.npcs.set(slot, npc);
    return slot;
  }
  static getInstance() {
    if (!_GameService.instance) {
      _GameService.instance = new _GameService();
    }
    return _GameService.instance;
  }
  getPlayers() {
    let players = new Array();
    this.players.forEach((player) => players.push(player));
    return players;
  }
  getNpcs() {
    let npcs = new Array();
    this.npcs.forEach((npc) => npcs.push(npc));
    return npcs;
  }
};
var GameService = _GameService;
GameService.MAX_PLAYERS = 2e3;
GameService.MAX_NPCS = 1e4;

// node_modules/ws/wrapper.mjs
var import_stream = __toESM(require_stream2(), 1);
var import_receiver = __toESM(require_receiver(), 1);
var import_sender = __toESM(require_sender(), 1);
var import_websocket = __toESM(require_websocket(), 1);
var import_websocket_server = __toESM(require_websocket_server(), 1);

// src/game/client/ClientHandshake.ts
var ClientHandshake = class {
  static Parse(client, buffer) {
    if (!buffer) {
      throw "No data supplied for client handshake";
    }
    const handshakePacketId = buffer.readUnsignedByte();
    if (handshakePacketId != 14) {
      console.error("Invalid login request");
      client.disconnect();
      return { status: false };
    }
    const out = StreamBuffer.create();
    for (let i = 0; i < 8; i++) {
      out.writeByte(0);
    }
    out.writeByte(0);
    out.writeLongBE(BigInt(65537));
    client.getSocketChannel().send(out.getData());
    return { status: true };
  }
};

// src/game/client/ClientLoginRequest.ts
var import_bigi = __toESM(require_lib2());

// src/net/ISAACCipher.ts
var ISAACCipher = class {
  constructor(seed) {
    this.m = Array(256);
    this.acc = 0;
    this.brs = 0;
    this.cnt = 0;
    this.r = Array(256);
    this.gnt = 0;
    this.seed(seed);
  }
  getR() {
    return this.r;
  }
  add(x, y) {
    const lsb = (x & 65535) + (y & 65535);
    const msb = (x >>> 16) + (y >>> 16) + (lsb >>> 16);
    return msb << 16 | lsb & 65535;
  }
  reset() {
    this.acc = this.brs = this.cnt = 0;
    for (let i = 0; i < 256; ++i)
      this.m[i] = this.r[i] = 0;
    this.gnt = 0;
  }
  seed(s) {
    let a, b, c, d, e, f, g, h, i;
    a = b = c = d = e = f = g = h = 2654435769;
    this.reset();
    for (i = 0; i < s.length; i++)
      this.r[i & 255] += typeof s[i] === "number" ? s[i] : 0;
    const seed_mix = () => {
      a ^= b << 11;
      d = this.add(d, a);
      b = this.add(b, c);
      b ^= c >>> 2;
      e = this.add(e, b);
      c = this.add(c, d);
      c ^= d << 8;
      f = this.add(f, c);
      d = this.add(d, e);
      d ^= e >>> 16;
      g = this.add(g, d);
      e = this.add(e, f);
      e ^= f << 10;
      h = this.add(h, e);
      f = this.add(f, g);
      f ^= g >>> 4;
      a = this.add(a, f);
      g = this.add(g, h);
      g ^= h << 8;
      b = this.add(b, g);
      h = this.add(h, a);
      h ^= a >>> 9;
      c = this.add(c, h);
      a = this.add(a, b);
    };
    for (i = 0; i < 4; i++)
      seed_mix();
    for (i = 0; i < 256; i += 8) {
      if (s) {
        a = this.add(a, this.r[i + 0]);
        b = this.add(b, this.r[i + 1]);
        c = this.add(c, this.r[i + 2]);
        d = this.add(d, this.r[i + 3]);
        e = this.add(e, this.r[i + 4]);
        f = this.add(f, this.r[i + 5]);
        g = this.add(g, this.r[i + 6]);
        h = this.add(h, this.r[i + 7]);
      }
      seed_mix();
      this.m[i + 0] = a;
      this.m[i + 1] = b;
      this.m[i + 2] = c;
      this.m[i + 3] = d;
      this.m[i + 4] = e;
      this.m[i + 5] = f;
      this.m[i + 6] = g;
      this.m[i + 7] = h;
    }
    if (s) {
      for (i = 0; i < 256; i += 8) {
        a = this.add(a, this.m[i + 0]);
        b = this.add(b, this.m[i + 1]);
        c = this.add(c, this.m[i + 2]);
        d = this.add(d, this.m[i + 3]);
        e = this.add(e, this.m[i + 4]);
        f = this.add(f, this.m[i + 5]);
        g = this.add(g, this.m[i + 6]);
        h = this.add(h, this.m[i + 7]);
        seed_mix();
        this.m[i + 0] = a;
        this.m[i + 1] = b;
        this.m[i + 2] = c;
        this.m[i + 3] = d;
        this.m[i + 4] = e;
        this.m[i + 5] = f;
        this.m[i + 6] = g;
        this.m[i + 7] = h;
      }
    }
    this.prng();
    this.gnt = 256;
  }
  prng(n) {
    let i, x, y;
    n = n && typeof n === "number" ? Math.abs(Math.floor(n)) : 1;
    while (n--) {
      this.cnt = this.add(this.cnt, 1);
      this.brs = this.add(this.brs, this.cnt);
      for (i = 0; i < 256; i++) {
        switch (i & 3) {
          case 0:
            this.acc ^= this.acc << 13;
            break;
          case 1:
            this.acc ^= this.acc >>> 6;
            break;
          case 2:
            this.acc ^= this.acc << 2;
            break;
          case 3:
            this.acc ^= this.acc >>> 16;
            break;
        }
        this.acc = this.add(this.m[i + 128 & 255], this.acc);
        x = this.m[i];
        this.m[i] = y = this.add(this.m[x >>> 2 & 255], this.add(this.acc, this.brs));
        this.r[i] = this.brs = this.add(this.m[y >>> 10 & 255], x);
      }
    }
  }
  rand() {
    if (!this.gnt--) {
      this.prng();
      this.gnt = 255;
    }
    return this.r[this.gnt];
  }
  internals() {
    return { a: this.acc, b: this.brs, c: this.cnt, m: this.m, r: this.r };
  }
};

// src/game/client/ClientLoginRequest.ts
var ClientLoginRequest = class {
  static Parse(client, buffer) {
    if (!buffer) {
      throw "No data supplied for login";
    }
    const loginType = buffer.readUnsignedByte();
    console.log("loginType", loginType);
    if (loginType !== 16 && loginType !== 18) {
      throw "Invalid login type " + loginType;
    }
    let loginEncryptedSize = buffer.readUnsignedByte() - (36 + 1 + 1 + 2);
    console.log("loginEncryptedSize", loginEncryptedSize);
    if (loginEncryptedSize <= 0) {
      throw "Invalid login packet length " + loginEncryptedSize;
    }
    const packetId = buffer.readUnsignedByte();
    console.log("packetId", packetId);
    if (packetId !== 255) {
      throw "Invalid login packet id " + packetId;
    }
    const gameVersion = buffer.readUnsignedShortBE();
    console.log("gameVersion", gameVersion);
    if (gameVersion !== 377) {
      throw "Invalid game version " + gameVersion;
    }
    const isLowDetail = buffer.readByte() === 1;
    console.log("isLowDetail", isLowDetail);
    for (let i = 0; i < 9; i++) {
      buffer.readIntBE();
    }
    loginEncryptedSize--;
    const reportedSize = buffer.readUnsignedByte();
    console.log("reportedSize", reportedSize);
    if (loginEncryptedSize !== reportedSize) {
      throw `Packet size mismatch - ${loginEncryptedSize} vs ${reportedSize}`;
    }
    const encryptedBytes = Buffer.alloc(loginEncryptedSize);
    buffer.getBuffer().copy(encryptedBytes, 0, buffer.getReaderIndex());
    const rsaModulus = (0, import_bigi.default)(Server.getInstance().getSettings().rsaModulus);
    const rsaExponent = (0, import_bigi.default)(Server.getInstance().getSettings().rsaExponent);
    const decrypted = new StreamBuffer(import_bigi.default.fromBuffer(encryptedBytes).modPow(rsaExponent, rsaModulus).toBuffer());
    const rsaOpcode = decrypted.readByte();
    console.log("rsaOpcode", rsaOpcode);
    if (rsaOpcode !== 10) {
      console.log("dec", decrypted.getBuffer());
      throw "Invalid block id " + rsaOpcode;
    }
    const clientKey1 = decrypted.readIntBE();
    const clientKey2 = decrypted.readIntBE();
    const incomingServerKey = decrypted.readLongBE();
    console.log("clientKey1", clientKey1);
    console.log("clientKey2", clientKey2);
    console.log("incomingServerKey", incomingServerKey);
    const serverKey = BigInt(Server.getInstance().getSettings().serverKey);
    console.log(serverKey, incomingServerKey);
    if (serverKey !== incomingServerKey) {
      throw `Server key mismatch - ${serverKey} != ${incomingServerKey}`;
    }
    const sessionKey = [
      Number(clientKey1),
      Number(clientKey2),
      Number(serverKey >> BigInt(32)),
      Number(serverKey)
    ];
    client.setDecryptor(new ISAACCipher(sessionKey));
    for (let i = 0; i < 4; i++) {
      sessionKey[i] += 50;
    }
    client.setEncryptor(new ISAACCipher(sessionKey));
    const userId = decrypted.readIntBE();
    const username = decrypted.readString();
    const password = decrypted.readString();
    console.log("userId", userId);
    console.log("username", username);
    console.log("password", password);
    return {
      status: true,
      userId,
      username,
      password
    };
  }
};

// src/game/client/ClientLoginResponse.ts
var ClientLoginResponse = class {
  static Send(client, response, privilege) {
    const resp = StreamBuffer.create(3);
    resp.writeByte(response);
    resp.writeByte(privilege);
    resp.writeByte(0);
    client.getSocketChannel().send(resp.getData());
    return {
      status: true
    };
  }
};

// src/game/client/Client.ts
var Client = class {
  constructor(socket) {
    this.socketChannel = socket;
    this.setConnectionStage(0 /* CONNECTED */);
    this.socketChannel.on("message", (data) => {
      this.handleIncomingData(data);
    });
    this.socketChannel.on("close", (data) => {
      console.log("CLOSED CLIENT");
      if (this.onDisconnected) {
        this.onDisconnected();
      }
    });
  }
  disconnect() {
    console.log(this + " disconnecting.");
    try {
      this.socketChannel.close();
    } catch (error) {
      console.error(error);
    }
  }
  handleIncomingData(data) {
    try {
      const inData = new StreamBuffer(data);
      while (inData.getReaderIndex() != inData.getBuffer().length) {
        if (this.getConnectionStage() != 2 /* LOGGED_IN */) {
          this.handleLogin(inData);
          break;
        }
        if (this.onDataReceivedCallback) {
          this.onDataReceivedCallback(inData);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  send(packet) {
    try {
      this.socketChannel.send(packet.toBuffer(this.getEncryptor()));
    } catch (error) {
      console.error(error);
      this.disconnect();
    }
  }
  handleLogin(inData) {
    const connectionStage = this.getConnectionStage();
    if (connectionStage == 0 /* CONNECTED */) {
      const handshakeSuccessful = ClientHandshake.Parse(this, inData);
      if (handshakeSuccessful) {
        this.setConnectionStage(1 /* LOGGING_IN */);
      }
    } else if (connectionStage == 1 /* LOGGING_IN */) {
      const loginResponse = ClientLoginRequest.Parse(this, inData);
      if (loginResponse.status) {
        const response = 2 /* LOGIN_RESPONSE_OK */;
        console.log("TODO: Validate player credentials, save, load etc.");
        if (response != 2 /* LOGIN_RESPONSE_OK */) {
          this.disconnect();
          return;
        }
        const PRIVILEGE = 0 /* REGULAR */;
        const result = ClientLoginResponse.Send(this, response, PRIVILEGE);
        if (result) {
          GameService.getInstance().createPlayer(this, loginResponse.userId, loginResponse.username, loginResponse.password);
          this.setConnectionStage(2 /* LOGGED_IN */);
        }
      }
    }
  }
  getEncryptor() {
    return this.encryptor;
  }
  setEncryptor(encryptor) {
    this.encryptor = encryptor;
  }
  getDecryptor() {
    return this.decryptor;
  }
  setDecryptor(decryptor) {
    this.decryptor = decryptor;
  }
  getSocketChannel() {
    return this.socketChannel;
  }
  getConnectionStage() {
    return this.connectionStage;
  }
  setConnectionStage(connectionStage) {
    console.log("Changed connection stage to", connectionStage.valueOf());
    this.connectionStage = connectionStage;
  }
};

// src/service/NetworkService.ts
var net = __require("net");
var NetworkService = class {
  constructor() {
  }
  init() {
    this.clientMap = /* @__PURE__ */ new Map();
    console.log("Started NetworkService service.");
    this.serverChannel = new import_websocket_server.default({
      host: Server.getInstance().getSettings().serverHost,
      port: Server.getInstance().getSettings().serverPort
    });
    this.serverChannel.on("connection", (clientSocket) => {
      this.accept(clientSocket);
    });
  }
  acceptNet(socket) {
    const key = uuidv4();
    const client = new Client(socket);
    console.log("Accepted new Client");
    this.clientMap.set(key, client);
  }
  accept(socket) {
    const key = uuidv4();
    const client = new Client(socket);
    console.log("Accepted new Client");
    this.clientMap.set(key, client);
  }
  tick() {
  }
  cleanup() {
  }
  static getInstance() {
    if (!NetworkService.instance) {
      NetworkService.instance = new NetworkService();
    }
    return NetworkService.instance;
  }
};

// src/main.ts
var services = [
  GameService.getInstance(),
  NetworkService.getInstance(),
  DataService.getInstance()
];
var settings = {
  serverName: "RuneServer-TS",
  serverHost: "0.0.0.0",
  serverPort: 43594,
  tickRate: 600,
  rsaModulus: "119568088839203297999728368933573315070738693395974011872885408638642676871679245723887367232256427712869170521351089799352546294030059890127723509653145359924771433131004387212857375068629466435244653901851504845054452735390701003613803443469723435116497545687393297329052988014281948392136928774011011998343",
  rsaExponent: "12747337179295870166838611986189126026507945904720545965726999254744592875817063488911622974072289858092633084100280214658532446654378876853112046049506789703022033047774294965255097838909779899992870910011426403494610880634275141204442441976355383839981584149269550057129306515912021704593400378690444280161",
  serverKey: "65537"
};
var server = new Server(settings, services);
