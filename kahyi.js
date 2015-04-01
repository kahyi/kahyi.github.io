(function(GLOBAL) {
    GLOBAL.Kahyi = function(code) {
        return GLOBAL.Kahyi.initialise(code);
    };
    var Kahyi = GLOBAL.Kahyi;
    Kahyi.Cursor = function(code, x, y, d) {
        if (x === undefined || y === undefined) {
            x = 0;
            y = 0;
        }
        if (d === undefined)
            d = 13; //우
        var c = {
            _lastX: x,
            _lastY: y,
            _lastD: d,
            _x: x,
            _y: y,
            _d: d,
            get x() {
                return c._x;
            },
            get y() {
                return c._y;
            },
            get d() {
                return c._d;
            },
            set x(x) {
                while (x < 0)
                    x += code.width;
                while (x >= code.width)
                    x -= code.width;
                c._lastX = c._x || x;
                c._lastY = c._y;
                c._x = x;
            },
            set y(y) {
                while (y < 0)
                    y += code.height;
                while (y >= code.height)
                    y -= code.height;
                c._lastY = c._y || y;
                c._lastX = c._x;
                c._y = y;
            },
            set d(d) {
                c._lastD = c._d || d;
                c._d = d;
            },
            move: function(d, r) {
                if (d === undefined)
                    d = c._d;
                switch (typeof r) {
                    case 'undefined':
                        r = 1;
                        break;
                    case 'boolean':
                        r = r && -1 || 1;
                        break;
                }
                switch (d) {
                    case 0: //아
                        c.x += 1 * r;
                        if (r === -1)
                            d = 4;
                        break;
                    case 2: //야
                        c.x += 2 * r;
                        if (r === -1)
                            d = 6;
                        break;
                    case 4: //어
                        c.x -= 1 * r;
                        if (r === -1)
                            d = 0;
                        break;
                    case 6: //여
                        c.x -= 2 * r;
                        if (r === -1)
                            d = 2;
                        break;
                    case 8: //오
                        c.y -= 1 * r;
                        if (r === -1)
                            d = 13;
                        break;
                    case 12: //요
                        c.y -= 2 * r;
                        if (r === -1)
                            d = 17;
                        break;
                    case 13: //우
                        c.y += 1 * r;
                        if (r === -1)
                            d = 8;
                        break;
                    case 17: //유
                        c.y += 2 * r;
                        if (r === -1)
                            d = 12;
                        break;
                    case 18: //으
                        if (c._d === 0 || c._d === 2 || c._d === 4 || c._d === 6) {
                            c.move(c._d, r);
                            return;
                        }
                        c.move(c._d, -r);
                        return;
                    case 19: //의
                        c.move(c._d, -r);
                        return;
                    case 20: //이
                        if (c._d === 8 || c._d === 12 || c._d === 13 || c._d === 17) {
                            c.move(c._d, r);
                            return;
                        }
                        c.move(c._d, -r);
                        return;
                    default:
                        c.move(c._d, r);
                        return;
                }
                c.d = d;
            },
        }
        return c;
    }
    Kahyi.initialise = function(code) {
        var k = {
            code: {
                _map: undefined,
                _width: undefined,
                _height: undefined,
                get data() {
                    return k.code._map.join('\n');
                },
                set map(d) {
                    if (typeof code === 'string' && code.length > 0) {
                        k.code._map = d.split('\n');
                        k.code._width = 0;
                        for (k.code._height = 0; k.code._height < k.code._map.length; k.code._height++)
                            if (k.code._width < k.code._map[k.code._height].length)
                                k.code._width = k.code._map[k.code._height].length;
                    }
                },
                get width() {
                    return k.code._width;
                },
                get height() {
                    return k.code._height;
                },
                getChar: function(x, y) {
                    while (y < 0)
                        y += code.height;
                    while (y >= code.height)
                        y -= code.height;
                    while (x < 0)
                        x += code.width;
                    while (x >= code.width)
                        x -= code.width;
                    var l = k.code._map[y];
                    var r = '\x00';
                    if (l.length > x)
                        r = l[x];
                    return r;
                }
            },
            exitCode: undefined,
            instances: {},
            lastInstanceId: -1,
            mainInstanceId: 0,
            labels: [
                {x: 0, y: 0}, //가
                undefined, undefined, undefined, //각갂갃
                undefined, undefined, undefined, //간갅갆
                undefined, //갇
                undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, //갈갉갊갋갌갍갎갏
                undefined, //감
                undefined, undefined, //갑값
                undefined, undefined, //갓갔
                null, //강 (unused)
                undefined, //갖
                undefined, //갗
                undefined, //갘
                undefined, //같
                undefined, //갚
                null, //갛 (unused)
            ],
            spaces: [
                undefined, //아 (thread private)
                [], [], [], //악앆앇
                [], [], [], //안앉않
                [], //앋
                [], [], [], [], [], [], [], [], //알앍앎앏앐앑앒앓
                [], //암
                [], [], //압앖
                [], [], //앗았
                [], //앙
                [], //앚
                [], //앛
                [], //앜
                [], //앝
                [], //앞
                null, //앟 (null device: read ng, write ok)
            ],
            spaceTypes: [
                undefined, //아 (thread private)
                'stack', 'stack', 'stack', //악앆앇
                'stack', 'stack', 'stack', //안앉않
                'stack', //앋
                'stack', 'stack', 'stack', 'stack', 'stack', 'stack', 'stack', 'stack', //알앍앎앏앐앑앒앓
                'stack', //암
                'stack', 'stack', //압앖
                'stack', 'stack', //앗았
                'queue', //앙
                'stack', //앚
                'stack', //앛
                'stack', //앜
                'stack', //앝
                'stack', //앞
                'null', //앟 (null device: read ng, write ok)
            ],
            onOutput: [],
            onStep: [],
            onExit: [function(exitCode) {
                k.stop();
            }],
            run: function() {
                if (k.instances[k.mainInstanceId].live)
                    k.instances[k.mainInstanceId].instance.run();
            },
            stop: function() {
                for (var n = 0; n < k.lastInstanceId; n++)
                    if (k.instances[n].live)
                        k.instances[n].instance.stop();
            }
        };
        k.code.map = code;
        Kahyi.newInstance(k, 0);
        return k;
    };
    Kahyi.newInstance = function(k, label) {
        var i = {
            beginTime: undefined,
            cursor: [],
            fineTime: undefined,
            finished: false,
            handle: undefined,
            in: [],
            isRunning: false,
            kahyi: k,
            lastOutput: undefined,
            phase: 0,
            space: 0, //아
            spaces: [
                [], //아 (thread private)
                undefined, undefined, undefined, //악앆앇
                undefined, undefined, undefined, //안앉않
                undefined, //앋
                undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, //알앍앎앏앐앑앒앓
                undefined, //암
                undefined, undefined, //압앖
                undefined, undefined, //앗았
                undefined, //앙
                undefined, //앚
                undefined, //앛
                undefined, //앜
                undefined, //앝
                undefined, //앞
                undefined, //앟
            ],
            spaceTypes: [
                'stack', //아 (thread private)
                undefined, undefined, undefined, //악앆앇
                undefined, undefined, undefined, //안앉않
                undefined, //앋
                undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, //알앍앎앏앐앑앒앓
                undefined, //암
                undefined, undefined, //압앖
                undefined, undefined, //앗았
                undefined, //앙
                undefined, //앚
                undefined, //앛
                undefined, //앜
                undefined, //앝
                undefined, //앞
                undefined, //앟
            ],
            getSpace: function(space) {
                if (space === undefined)
                    space = i.space;
                if (i.spaces[space] === undefined)
                    return k.spaces[space];
                return i.spaces[space];
            },
            getSpaceType: function(space) {
                if (space === undefined)
                    space = i.space;
                if (i.spaceTypes[space] === undefined)
                    return k.spaceTypes[space];
                return i.spaceTypes[space];
            },
            run: function(wpt) {
                if (i.handle !== undefined)
                    return;
                if (i.beginTime === undefined)
                    i.beginTime = Date.now();
                if (wpt === undefined)
                    wpt = 1024;
                i.handle = setInterval(function() {
                    if (i.isRunning)
                        return;
                    i.isRunning = true;
                    var r;
                    for (var w = 0; w < wpt; w++) {
                        r = i.step();
                        if (!r)
                            break;
                    }
                    i.phase += w + 1;
                    i.isRunning = false;
                    if (!r) {
                        i.stop();
                        i.fineTime = Date.now();
                        if (i === k.instances[k.mainInstanceId].instance) {
                            k.exitCode = i.exitCode;
                            for (var handle in k.onExit)
                                k.onExit[handle](k.exitCode);
                        }
                    }
                });
            },
            step: function() {
                if (i.finished)
                    return false;
                var cursor = i.cursor[i.cursor.length - 1];
                var char = hangul.disassemble(k.code.getChar(cursor.x, cursor.y));
                if (char === null) {
                    cursor.move();
                    return true;
                }
                var lastOutput = i.lastOutput;
                function peek(s, n) {
                    if (s === undefined)
                        s = i.space;
                    if (n === undefined)
                        n = 0;
                    var space = i.getSpace(s);
                    var spaceType = i.getSpaceType(s);
                    if (spaceType === 'null')
                        return null;
                    if (space.length < 1 + n)
                        return;
                    if (spaceType === 'queue')
                        return space[n];
                    if (spaceType === 'stack')
                        return space[space.length - 1 - n];
                    return;
                }
                function pop(s) {
                    if (s === undefined)
                        s = i.space;
                    var space = i.getSpace(s);
                    var spaceType = i.getSpaceType(s);
                    if (spaceType === 'null')
                        return null;
                    if (spaceType === 'queue')
                        return space.shift();
                    if (spaceType === 'stack')
                        return space.pop();
                    return;
                }
                function unpop(s, v) {
                    if (s === undefined)
                        s = i.space;
                    var space = i.getSpace(s);
                    var spaceType = i.getSpaceType(s);
                    if (spaceType === 'queue')
                        return space.unshift(v);
                    if (spaceType === 'stack')
                        return space.push(v);
                }
                function push(s, v) {
                    if (s === undefined)
                        s = i.space;
                    var space = i.getSpace(s);
                    var spaceType = i.getSpaceType(s);
                    if (spaceType === 'null')
                        return true;
                    if (spaceType === 'queue' || spaceType === 'stack') {
                        space.push(v);
                        return true;
                    }
                    return false;
                }
                function swap(s) {
                    if (s === undefined)
                        s = i.space;
                    var space = i.getSpace(s);
                    var spaceType = i.getSpaceType(s);
                    if (space.length < 2)
                        return false;
                    if (spaceType === 'queue') {
                        var t = space[0];
                        space[0] = space[1];
                        space[1] = t;
                        return true;
                    }
                    if (spaceType === 'stack') {
                        var t = space[space.length - 1];
                        space[space.length - 1] = space[space.length - 2];
                        space[space.length - 2] = t;
                        return true;
                    }
                    return false;
                }
                function read() {
                    var v;
                    if (i.in === undefined)
                        return undefined;
                    if (i.in.length > 0)
                        v = i.in.shift();
                    else {
                        if (!isNode()) {
                            var t = GLOBAL.prompt();
                            if (t === null)
                                t = '';
                            i.in = i.in.concat(t.split(''));
                        }
                        //TODO: node.js?
                        if (i.in.length > 0)
                            v = i.in.shift();
                    }
                    if (v === undefined)
                        i.in = undefined;
                    return v;
                }
                function error(canHandle) {
                    if (canHandle === undefined)
                        canHandle = true;
                    if (canHandle && char.final > 0/*가*/ && char.final !== 21/*강*/ && char.final !== 27/*갛*/ && !isNullOrUndefined(k.labels[char.final])) {
                        var l = k.labels[char.final]
                        i.cursor.push(Kahyi.Cursor(k.code, l.x, l.y, k.code.getChar(l.x, l.y).final));
                    }
                    else
                        cursor.move(char.medial, true);
                }
                switch (char.initial) {
                    case 0: //ㄱ
                        if (char.final === 0) {
                            if (i.cursor.length < 2) {
                                error();
                                break;
                            }
                            i.cursor.pop();
                            cursor = i.cursor[i.cursor.length - 1];
                            cursor.move(k.code.getChar(cursor.x, cursor.y).medial);
                            break;
                        }
                        if (char.final !== 21 && char.final !== 27) {
                            if (k.labels[char.final] !== undefined) {
                                k.labels[char.final] = {x: cursor.x, y: cursor.y};
                                cursor.move(char.medial);
                            }
                            else
                                error();
                        }
                        break;
                    case 1: //ㄲ
                        cursor.move(char.medial);
                        var id = Kahyi.newInstance(k, char.final);
                        k.instances[id].instance.run();
                        break;
                    case 2: //ㄴ
                        if (isNullOrUndefined(peek(i.space)) || isNullOrUndefined(peek(i.space, 1))) {
                            error();
                            break;
                        }
                        var a = pop(i.space);
                        var b = pop(i.space);
                        if (a === 0) {
                            unpop(i.space, b);
                            unpop(i.space, a);
                            error();
                            break;
                        }
                        push(i.space, Math.floor(b / a));
                        cursor.move(char.medial);
                        break;
                    case 3: //ㄷ
                        if (isNullOrUndefined(peek(i.space)) || isNullOrUndefined(peek(i.space, 1))) {
                            error();
                            break;
                        }
                        var a = pop(i.space);
                        var b = pop(i.space);
                        push(i.space, b + a);
                        cursor.move(char.medial);
                        break;
                    case 4: //ㄸ
                        if (isNullOrUndefined(peek(i.space)) || isNullOrUndefined(peek(i.space, 1))) {
                            error();
                            break;
                        }
                        var a = pop(i.space);
                        var b = pop(i.space);
                        push(i.space, b * a);
                        cursor.move(char.medial);
                        break;
                    case 5: //ㄹ
                        if (isNullOrUndefined(peek(i.space)) || isNullOrUndefined(peek(i.space, 1))) {
                            error();
                            break;
                        }
                        var a = pop(i.space);
                        var b = pop(i.space);
                        if (a === 0) {
                            unpop(i.space, b);
                            unpop(i.space, a);
                            error();
                            break;
                        }
                        push(i.space, b % a);
                        cursor.move(char.medial);
                        break;
                    case 6: //ㅁ
                        if (isNullOrUndefined(peek(i.space))) {
                            error();
                            break;
                        }
                        var a = pop(i.space);
                        if (char.final === 21) { //앙
                            i.lastOutput = {
                                timestamp: Date.now(),
                                value: a
                            };
                        }
                        else if (char.final === 27) { //앟
                            i.lastOutput = {
                                timestamp: Date.now(),
                                value: String.fromCharCode(a)
                            };
                        }
                        cursor.move(char.medial);
                        break;
                    case 7: //ㅂ
                        var a = hangul.strokes[char.final];
                        if (char.final === 21) { //앙
                            a = read();
                            if (a === undefined)
                                a = -1;
                            else
                                a = Number(a);
                            if (isNaN(a))
                                a = -1;
                        }
                        else if (char.final === 27) { //앟
                            a = read();
                            if (a !== undefined)
                                a = a.charCodeAt(0);
                            else
                                a = -1;
                        }
                        push(i.space, a);
                        cursor.move(char.medial);
                        break;
                    case 8: //ㅃ
                        if (isNullOrUndefined(peek(i.space))) {
                            error();
                            break;
                        }
                        var a = pop(i.space);
                        unpop(i.space, a);
                        unpop(i.space, a);
                        cursor.move(char.medial);
                        break;
                    case 9: //ㅅ
                        i.space = char.final;
                        cursor.move(char.medial);
                        break;
                    case 10: //ㅆ
                        if (isNullOrUndefined(peek(i.space))) {
                            error();
                            break;
                        }
                        var a = pop(i.space);
                        push(char.final, a);
                        cursor.move(char.medial);
                        break;
                    case 11: //ㅇ
                        cursor.move(char.medial);
                        break;
                    case 12: //ㅈ
                        if (isNullOrUndefined(peek(i.space)) || isNullOrUndefined(peek(i.space, 1))) {
                            error();
                            break;
                        }
                        var a = pop(i.space);
                        var b = pop(i.space);
                        push(i.space, a <= b && 1 || 0);
                        cursor.move(char.medial);
                        break;
                    case 13: //ㅉ
                        if (isNullOrUndefined(peek(i.space))) {
                            error();
                            break;
                        }
                        var a = pop(i.space);
                        push(i.space, Math.floor(Math.random() * a));
                        cursor.move(char.medial);
                        break;
                    case 14: //ㅊ
                        if (isNullOrUndefined(peek(i.space))) {
                            error();
                            break;
                        }
                        var a = pop(i.space);
                        var m = char.medial;
                        if (a === 0) {
                            if (m === 0)
                                m = 4;
                            else if (m === 2)
                                m = 6;
                            else if (m === 4)
                                m = 0;
                            else if (m === 6)
                                m = 2;
                            else if (m === 8)
                                m = 13;
                            else if (m === 12)
                                m = 17;
                            else if (m === 13)
                                m = 8;
                            else if (m === 17)
                                m = 12;
                        }
                        cursor.move(m);
                        break;
                    case 15: //ㅋ
                        if (char.final === 0) {
                            if (i.cursor.length < 2) {
                                error();
                                break;
                            }
                            i.cursor.pop();
                            i.cursor[i.cursor.length - 1].move(cursor.d);
                            break;
                        }
                        if (char.final !== 21 && char.final !== 27) {
                            var p = k.labels[label];
                            if (p !== undefined) {
                                i.cursor.push(Kahyi.Cursor(k.code, p.x, p.y));
                                cursor = i.cursor[i.cursor.length - 1];
                            }
                            else {
                                error();
                                break;
                            }
                        }
                        cursor.move(char.medial);
                        break;
                    case 16: //ㅌ
                        if (isNullOrUndefined(peek(i.space)) || isNullOrUndefined(peek(i.space, 1))) {
                            error();
                            break;
                        }
                        var a = pop(i.space);
                        var b = pop(i.space);
                        push(i.space, b - a);
                        cursor.move(char.medial);
                        break;
                    case 17: //ㅍ
                        if (!swap(i.space))
                            error();
                        cursor.move(char.medial);
                        break;
                    case 18: //ㅎ
                        cursor.move(char.medial);
                        i.exitCode = pop(i.space);
                        if (isNullOrUndefined(i.exitCode))
                            i.exitCode = 0;
                        i.finished = true;
                        break;
                    default:
                        break;
                }
                if (lastOutput !== i.lastOutput)
                    for (var handler in k.onOutput)
                        k.onOutput[handler](i.lastOutput, lastOutput);
                for (var handler in k.onStep)
                    k.onStep[handler](i);
                return true;
            },
            stop: function() {
                if (i.handle === undefined)
                    return;
                i.handle = clearTimeout(i.handle);
            }
        };
        var p = k.labels[label];
        i.cursor.push(Kahyi.Cursor(k.code, p.x, p.y));
        k.instances[++k.lastInstanceId] = {
            id: k.lastInstanceId,
            instance: i,
            live: true
        };
        return k.lastInstanceId;
    };
    var hangul = {
        base: 0xac00,
        length: 0x2ba4,
        initialLength: 19,
        medialLength: 21,
        finalLength: 28,
        strokes: [0, 2, 4, 4, 2, 5, 5, 3, 5, 7, 9, 9, 7, 9, 9, 8, 4, 4, 6, 2, 4, 1, 3, 4, 3, 4, 4, 3],
        disassemble: function(c) {
            var r = null;
            if (isNullOrUndefined(c))
                return r;
            var v = c.charCodeAt(0) - hangul.base;
            if (v >= 0 && v <= hangul.length) {
                r = {char: c};
                r.initial = Math.floor(v / (hangul.medialLength * hangul.finalLength));
                v = v % (hangul.medialLength * hangul.finalLength);
                r.medial = Math.floor(v / hangul.finalLength);
                r.final = v % hangul.finalLength;
            }
            return r;
        }
    };
    function isNullOrUndefined(v) {
        if (v === null || v === undefined)
            return true;
        return false;
    }
    function isNode() {
        return !(typeof window !== 'undefined' && GLOBAL === window);
    }
})(this);
