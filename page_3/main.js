var over = false;
var me = true; // 当前是否是玩家回合
var _nowi = 0, _nowj = 0; // 记录玩家下棋的坐标
var _compi = 0, _compj = 0; // 记录计算机下棋的坐标
var _myWin = [], _compWin = []; // 记录玩家和计算机的赢法情况
var backAble = false, returnAble = false;
var hintAble = true; // 控制提示功能是否可用
var resultTxt = document.getElementById('result-wrap');
var chressBord = []; // 棋盘数组

// 初始化棋盘
for (var i = 0; i < 15; i++) {
    chressBord[i] = [];
    for (var j = 0; j < 15; j++) {
        chressBord[i][j] = 0;
    }
}

// 赢法统计数组
var myWin = [];
var computerWin = [];
var wins = []; // 赢法数组
var count = 0; // 赢法总数

// 初始化赢法数组
for (var i = 0; i < 15; i++) {
    wins[i] = [];
    for (var j = 0; j < 15; j++) {
        wins[i][j] = [];
    }
}

// 横线赢法
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i][j + k][count] = true;
        }
        count++;
    }
}

// 竖线赢法
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[j + k][i][count] = true;
        }
        count++;
    }
}

// 正斜线赢法
for (var i = 0; i < 11; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j + k][count] = true;
        }
        count++;
    }
}

// 反斜线赢法
for (var i = 0; i < 11; i++) {
    for (var j = 14; j > 3; j--) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true;
        }
        count++;
    }
}

// 初始化赢法统计数组
for (var i = 0; i < count; i++) {
    myWin[i] = 0;
    _myWin[i] = 0;
    computerWin[i] = 0;
    _compWin[i] = 0;
}

var chess = document.getElementById("chess");
var context = chess.getContext('2d');
context.strokeStyle = '#010003'; // 边框颜色

var backbtn = document.getElementById("goback");
var returnbtn = document.getElementById("return");

window.onload = function() {
    drawChessBoard(); // 画棋盘
};

document.getElementById("restart").onclick = function() {
    window.location.reload();
};

// 玩家下棋
chess.onclick = function(e) {
    if (over) {
        return;
    }
    if (!me) {
        return;
    }
    backbtn.className = backbtn.className.replace(new RegExp("(\\s|^)unable(\\s|$)"), " ");
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);
    _nowi = i;
    _nowj = j;
    if (chressBord[i][j] == 0) {
        oneStep(i, j, me);
        chressBord[i][j] = 1; // 玩家已占位置

        for (var k = 0; k < count; k++) { // 将可能赢的情况都加1
            if (wins[i][j][k]) {
                myWin[k]++;
                _compWin[k] = computerWin[k];
                computerWin[k] = 5; // 这个位置对方不可能赢了
                if (myWin[k] == 5) {
                    resultTxt.innerHTML = '--恭喜，您赢了--';
                    over = true;
                }
            }
        }
        if (!over) {
            me = !me;
            computerAI();
        }
    }
};

// 悔棋
backbtn.onclick = function(e) {
    if (!backAble) {
        return;
    }
    over = false;
    me = true;
    returnbtn.className = returnbtn.className.replace(new RegExp("(\\s|^)unable(\\s|$)"), " ");
    chressBord[_nowi][_nowj] = 0; // 玩家已占位置 还原
    minusStep(_nowi, _nowj); // 销毁棋子
    for (var k = 0; k < count; k++) { // 将可能赢的情况都减1
        if (wins[_nowi][_nowj][k]) {
            myWin[k]--;
            computerWin[k] = _compWin[k]; // 这个位置对方可能赢
        }
    }
    chressBord[_compi][_compj] = 0; // 计算机已占位置 还原
    minusStep(_compi, _compj); // 销毁棋子
    for (var k = 0; k < count; k++) { // 将可能赢的情况都减1
        if (wins[_compi][_compj][k]) {
            computerWin[k]--;
            myWin[k] = _myWin[k]; // 这个位置对方可能赢
        }
    }
    resultTxt.innerHTML = '--雨云AI五子棋--';
    returnAble = true;
    backAble = false;
};

// 撤销悔棋
returnbtn.onclick = function(e) {
    if (!returnAble) {
        return;
    }
    chressBord[_nowi][_nowj] = 1; // 玩家已占位置
    oneStep(_nowi, _nowj, me);
    for (var k = 0; k < count; k++) {
        if (wins[_nowi][_nowj][k]) {
            myWin[k]++;
            _compWin[k] = computerWin[k];
            computerWin[k] = 5; // 这个位置对方不可能赢
            if (myWin[k] == 5) {
                resultTxt.innerHTML = '--恭喜，您赢了--';
                over = true;
            }
        }
    }
    chressBord[_compi][_compj] = 2; // 计算机已占位置
    oneStep(_compi, _compj, false);
    for (var k = 0; k < count; k++) { // 将可能赢的情况都减1
        if (wins[_compi][_compj][k]) {
            computerWin[k]++;
            _myWin[k] = myWin[k];
            myWin[k] = 5; // 这个位置对方不可能赢
            if (computerWin[k] == 5) {
                resultTxt.innerHTML = '--雨云AI赢了，继续加油哦--';
                over = true;
            }
        }
    }
    returnbtn.className += ' unable';
    returnAble = false;
    backAble = true;
};

// 提示功能
document.getElementById("hint").onclick = function() {
    if (!hintAble || over) {
        return;
    }
    hintAble = false; // 设置提示功能为不可用状态
    computerAI(true); // 调用 AI 算法，传入 true 表示是提示模式
};

// 计算机下棋
var computerAI = function(isHint) {
    var myScore = [];
    var computerScore = [];
    var max = 0;
    var u = 0, v = 0;
    for (var i = 0; i < 15; i++) {
        myScore[i] = [];
        computerScore[i] = [];
        for (var j = 0; j < 15; j++) {
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            if (chressBord[i][j] == 0) {
                for (var k = 0; k < count; k++) {
                    if (wins[i][j][k]) {
                        if (myWin[k] == 1) {
                            myScore[i][j] += 200;
                        } else if (myWin[k] == 2) {
                            myScore[i][j] += 400;
                        } else if (myWin[k] == 3) {
                            myScore[i][j] += 2000;
                        } else if (myWin[k] == 4) {
                            myScore[i][j] += 10000;
                        }

                        if (computerWin[k] == 1) {
                            computerScore[i][j] += 220;
                        } else if (computerWin[k] == 2) {
                            computerScore[i][j] += 420;
                        } else if (computerWin[k] == 3) {
                            computerScore[i][j] += 2100;
                        } else if (computerWin[k] == 4) {
                            computerScore[i][j] += 20000;
                        }
                    }
                }

                if (myScore[i][j] > max) {
                    max = myScore[i][j];
                    u = i;
                    v = j;
                } else if (myScore[i][j] == max) {
                    if (computerScore[i][j] > computerScore[u][v]) {
                        u = i;
                        v = j;
                    }
                }

                if (computerScore[i][j] > max) {
                    max = computerScore[i][j];
                    u = i;
                    v = j;
                } else if (computerScore[i][j] == max) {
                    if (myScore[i][j] > myScore[u][v]) {
                        u = i;
                        v = j;
                    }
                }
            }
        }
    }
    if (isHint) {
        // 提示模式，仅显示推荐落子位置，不实际改变棋盘状态
        oneStep(u, v, true); // 画出推荐的落子位置
        setTimeout(function() {
            minusStep(u, v); // 延迟一段时间后清除推荐的落子位置
            hintAble = true; // 恢复提示功能的可用状态
        }, 500); // 延迟
    } else {
        // 正常模式，AI 走一步棋
        _compi = u;
        _compj = v;
        oneStep(u, v, false);
        chressBord[u][v] = 2; // 计算机占据位置
        for (var k = 0; k < count; k++) {
            if (wins[u][v][k]) {
                computerWin[k]++;
                _myWin[k] = myWin[k];
                myWin[k] = 6; // 这个位置对方不可能赢了
                if (computerWin[k] == 5) {
                    resultTxt.innerHTML = '--雨云AI赢了，继续加油哦--';
                    over = true;
                }
            }
        }
        if (!over) {
            me = !me;
        }
        backAble = true;
        returnAble = false;
        var hasClass = new RegExp('unable').test(' ' + returnbtn.className + ' ');
        if (!hasClass) {
            returnbtn.className += ' unable';
        }
    }
};

// 绘制棋盘
var drawChessBoard = function() {
    for (var i = 0; i < 15; i++) {
        context.moveTo(15 + i * 30, 15);
        context.lineTo(15 + i * 30, 435);
        context.stroke();
        context.moveTo(15, 15 + i * 30);
        context.lineTo(435, 15 + i * 30);
        context.stroke();
    }
};

// 画棋子
var oneStep = function(i, j, me) {
    context.beginPath();
    context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI); // 画圆
    context.closePath();
    // 渐变
    var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
    if (me) {
        gradient.addColorStop(0, '#010003');
        gradient.addColorStop(1, '#636766');
    } else {
        gradient.addColorStop(0, '#d1d1d1');
        gradient.addColorStop(1, '#f9f9f9');
    }
    context.fillStyle = gradient;
    context.fill();
};

// 删除棋子
var minusStep = function(i, j) {
    context.clearRect(i * 30, j * 30, 30, 30);
    context.beginPath();
    context.moveTo(15 + i * 30, j * 30);
    context.lineTo(15 + i * 30, j * 30 + 30);
    context.moveTo(i * 30, 15 + j * 30);
    context.lineTo((i + 1) * 30, 15 + j * 30);
    context.stroke();
};
