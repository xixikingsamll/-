// 初始化一些需要全局更新的数据

// 全局数据 郑
let potValue = [];  // 记录节点的数值
let lineValue = [];  // 记录边的数值
let playerSeleteRoute = []  // 记录玩家选择的路径
let pots = [];
let potNum = 0;  // 记录节点的数量
let step = 1;  // 记录删除的是否是第一行

// 一些模式的状态码
let changePattern = 0;  // 记录当前的模式（0表示玩家手动输入，1表示自动生成）
let start = 0;  // 记录是否开始了游戏（0表示未开始，1表示已经开始了）
let d = 0;  // 表示信息框是否显示(0表示不显示，1表示显示)

let n;          // 边和点个数
let minf, maxf; // 用于存放最小值和最大值的临时变量
let v;          // 点集，存放每个顶点的值
let op;         // 边集，存放每条边的操作符
let m;          // 存放最终计算结果
let result;     // 存放最大值和最小值

let ansMaxIndex = 1, ansMinIndex = 1; // 最后一步合并点标记
let maxMergePaths;  // 存放对于max的每个状态下的符号顺序
let minMergePaths;  // 存放对于min的每个状态下的符号顺序

// 获取玩家手动输入的节点和边的信息，将其放入potValue和lineValue中
function getPlayerInput() {
    let i = 1;
    let j = 2;
    document.getElementById("beginBuildPots").addEventListener("click", () => {
        potNum = parseInt(document.querySelector(".potNumValue").value);
        document.querySelector(".potNum").style.display = "none";
        document.querySelector(".aboutPot").style.display = "block";

    })
    document.getElementById("nextPot").addEventListener("click", () => {
        let label = document.querySelectorAll(".aboutPot label");
        if (i < potNum) {
            i += 1;
            j += 1;
            label[0].innerHTML = "节点" + i;
            if (i === potNum) {
                label[1].innerHTML = "边（" + i + "，" + "1" + "）";
            } else {
                label[1].innerHTML = "边（" + i + "，" + j + "）";
            }
            potValue.push(parseInt(document.querySelector(".aboutPotValue").value));
            lineValue.push(document.querySelector(".aboutLineValue").value);
            document.querySelector(".aboutPotValue").value = "";
            document.querySelector(".aboutLineValue").value = "";
        }
    });
}

// 添加点和边的标注
function addLabel(x, y, textContent) {
    // 创建一个text元素
    let svg = document.querySelector('.board'); // 获取SVG元素的引用
    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x); // 设置文本x坐标（通常为中心或旁边）  
    text.setAttribute("y", y - 32); // 设置文本y坐标（在circle上方一些）  
    text.setAttribute("text-anchor", "middle"); // 设置文本对齐方式  
    text.setAttribute("font-size", 24); // 设置字体大小  
    text.textContent = textContent; // 设置文本内容 
    text.setAttribute("fill", "black"); // 设置文本颜色

    // 将text添加到SVG中  
    svg.appendChild(text);
}

// 绘制多边形
function drawPolygon(pot, line) {
    let boardWidth = document.querySelector(".picture").offsetWidth; //获取画布的宽度
    let svg = document.querySelector('.board'); // 获取SVG元素的引用  
    let lineLengthInner = 100; //设置中心点到顶点的距离
    let i = 0;
    let j = 0;
    let potx = [];
    let poty = [];

    // 生成点
    pot.forEach((element, index) => {
        // 创建一个新的circle元素并设置circle元素的属性
        let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        let angleInDegrees = i * 360 / pot.length; // 计算每个顶点相对于x轴的角度
        let angleInRadians = angleInDegrees * (Math.PI / 180); // 角度转弧度
        let x = boardWidth / 2 - lineLengthInner * Math.sin(angleInRadians); // 计算每个顶点的x坐标
        let y = boardWidth / 2 - lineLengthInner * Math.cos(angleInRadians); // 计算每个顶点的y坐标
        let circleSize = 30; // 设置圆的初始半径
        if (lineValue.length > 4) {
            circleSize = 6 / -3 * lineValue.length + 130 / 3;
        }
        potx.push(x);
        poty.push(y);
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', circleSize);
        circle.setAttribute('fill', 'blue');
        circle.id = "pot"

        // 将circle元素添加到SVG画板中  
        svg.appendChild(circle);
        addLabel(x, y, index + 1); // 添加标注
        i += 1;
    });

    // 生成边
    line.forEach((element, index, array) => {
        // 创建一个新的line元素并设置line元素的属性
        if (index != line.length - 1) {
            // 创建一个line元素
            let line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
            let x1 = potx[j];
            let x2 = potx[j + 1];
            let y1 = poty[j];
            let y2 = poty[j + 1];
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.setAttribute("stroke", "blue"); // 设置线条颜色为蓝色  
            line.setAttribute("stroke-width", "2"); // 设置线条宽度为2  
            line.id = "line";
            // 将line元素添加到SVG画板中  
            svg.appendChild(line);
            // addLabel((x1 + x2) / 2, (y1 + y2) / 2, element); // 添加标注
            j += 1;
        } else {
            j = pot.length - 1;
            let line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
            let x1 = potx[j];
            let x2 = potx[0];
            let y1 = poty[j];
            let y2 = poty[0];
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.setAttribute("stroke", "blue"); // 设置线条颜色为蓝色  
            line.setAttribute("stroke-width", "2"); // 设置线条宽度为2  
            line.id = "line";
            // 将line元素添加到SVG画板中  
            // addLabel((x1 + x2) / 2, (y1 + y2) / 2, element); // 添加标注
            svg.appendChild(line);
        }
    });
}

// 显示最终得分
function showScore() {
    console.log(potValue)
    let startpots = [];
    //生成图形时点的数据
    for (let i = 0; i < potNum; i++) {
        if (i == 0) {
            let startpot1 = { id: i + 1, value: potValue[i], linkLine: [potNum, i + 1] };
            startpots.push(JSON.parse(JSON.stringify(startpot1)));

        } else {
            let startpot2 = { id: i + 1, value: potValue[i], linkLine: [i, i + 1] };
            startpots.push(JSON.parse(JSON.stringify(startpot2)));
        }
    }
    let showResult;
    pots.push(JSON.parse(JSON.stringify(startpots)));

    //删除第一条边时点的数据
    pots.push(JSON.parse(JSON.stringify(pots[0])));
    if (playerSeleteRoute[0] == lineValue.length) {
        pots[1][0].linkLine.splice(0, 1);
        pots[1][potNum - 1].linkLine.splice(1, 1);
    } else {
        pots[1][playerSeleteRoute[0] - 1].linkLine.splice(1, 1)
        pots[1][playerSeleteRoute[0]].linkLine.splice(0, 1)
    }

    for (let i = 1; i < playerSeleteRoute.length; i++) {
        pots.push(JSON.parse(JSON.stringify(pots[i])));
        let newPotLinkLine1 = [];
        let operand1 = [];
        for (let j = 0; j < pots[i + 1].length; j++) {
            if (pots[i + 1][j].linkLine[0] == playerSeleteRoute[i]) {
                pots[i + 1][j].linkLine.splice(0, 1);
                if (pots[i + 1][j].linkLine[0]) {
                    newPotLinkLine1.push(JSON.parse(JSON.stringify(pots[i + 1][j].linkLine[0])));
                }
                operand1.push(JSON.parse(JSON.stringify(pots[i + 1][j].value)));
                pots[i + 1][j].linkLine = [];
            } else if (pots[i + 1][j].linkLine[1] == playerSeleteRoute[i]) {
                pots[i + 1][j].linkLine.splice(1, 1);
                newPotLinkLine1.push(JSON.parse(JSON.stringify(pots[i + 1][j].linkLine[0])));
                operand1.push(JSON.parse(JSON.stringify(pots[i + 1][j].value)));
                pots[i + 1][j].linkLine = [];
            }
        }
        let operator = lineValue[playerSeleteRoute[i] - 1];
        let expression = operand1[0] + operator + operand1[1];
        let newResult = eval(expression);
        let newStepPot = { id: potNum + i, value: newResult, linkLine: newPotLinkLine1 };
        pots[i + 1].push(JSON.parse(JSON.stringify(newStepPot)));
        if (pots[i + 1].length == potNum * 2 - 1) {
            showResult = pots[i + 1][potNum * 2 - 2].value;
        }
    }
    document.querySelector(".getScore").innerHTML = `<strong>·</strong>&nbsp;最终得分：<strong style="color: red;">${showResult}</strong>`;
}

// 显示游戏信息
function showinfo() {
    for (let i = 0; i < potNum; i++) {
        // 创建新的li元素来记录节点和边的信息
        let li = document.createElement("li");
        li.className = "list-group-item";
        li.style.fontSize = "12px";
        li.style.color = 'black';
        li.style.position = "relative";
        if (i == potNum - 1) {
            li.innerHTML = `节点${i + 1}：${potValue[i]}，边（${i + 1}, 1）：${lineValue[i]} <button class="btn btn-danger deleteLine" style="padding:2px 6px; position:absolute; top:50%; right:-5px; transform: translate(-50%, -50%);" onclick="del(${i})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg></button>`
        } else {
            li.innerHTML = `节点${i + 1}：${potValue[i]}，边（${i + 1}, ${i + 2}）：${lineValue[i]} <button class="btn btn-danger deleteLine" style="padding:2px 6px; position:absolute; top:50%; right:-5px; transform: translate(-50%, -50%);" onclick="del(${i})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg></button>`
        }
        document.querySelector(".info_box ul").appendChild(li);
    }
    let li = document.createElement("li");
    li.className = "list-group-item";
    li.innerHTML = "-----------------------------"
    document.querySelector(".info_box ul").appendChild(li);

}

// 清除边的动画
function clearLine(li, button, index) {
    li[index].style.height = "0";
    button[index].style.display = "none";
    playerSeleteRoute.push(index + 1);
    document.querySelector(".getRoute").innerHTML = `<strong>·</strong>&nbsp;当前路径：<strong style="color: red;">${playerSeleteRoute}</strong>`;
    line[index].style.opacity = "0";
    step = step + 1;
}

// 删除按钮的点击事件 郑
function del(index) {
    let li = document.querySelectorAll(".info_box ul li");
    let button = document.querySelectorAll(".deleteLine");
    let line = document.querySelectorAll("#line");
    let pot = document.querySelectorAll("#pot");
    let svg = document.querySelector(".board");
    let text = document.querySelectorAll("text");
    // 第一条边只进行删除
    if (step == 1) {
        // 删除对应的右侧列表信息并记录下来
        clearLine(li, button, index);
        document.querySelector(".getScore").innerHTML = `<strong>·</strong>&nbsp;最终得分：计算中`;
    } else {
        // 画出新生成的点
        let newPot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        clearLine(li, button, index);
        let x1 = parseFloat(line[index].getAttribute("x1"));
        let y1 = parseFloat(line[index].getAttribute("y1"));
        let x2 = parseFloat(line[index].getAttribute("x2"));
        let y2 = parseFloat(line[index].getAttribute("y2"));
        let middleX = (x1 + x2) / 2;
        let middleY = (y1 + y2) / 2;
        newPot.setAttribute("cx", middleX);
        newPot.setAttribute("cy", middleY);
        newPot.setAttribute("r", "10");
        newPot.setAttribute("fill", "red");
        newPot.id = "newpot"
        svg.appendChild(newPot);
        let newpots = document.querySelectorAll("#newpot");
        // 将旧的点清除
        pot.forEach((element, index, array) => {
            if (parseFloat(element.getAttribute("cx")) === x1 && parseFloat(element.getAttribute("cy")) === y1) {
                element.style.display = "none";
            }
            if (parseFloat(element.getAttribute("cx")) === x2 && parseFloat(element.getAttribute("cy")) === y2) {
                element.style.display = "none";
            }
        });
        text.forEach((element, index, array) => {
            console.log(element.getAttribute("x"), element.getAttribute("y"));
            if (parseFloat(element.getAttribute("x")) === x1 && parseFloat(element.getAttribute("y")) === y1 - 32) {
                element.style.display = "none";
            }
            if (parseFloat(element.getAttribute("x")) === x2 && parseFloat(element.getAttribute("y")) === y2 - 32) {
                element.style.display = "none";
            }
        });
        newpots.forEach((element, index, array) => {
            if (parseFloat(element.getAttribute("cx")) === x1 && parseFloat(element.getAttribute("cy")) === y1) {
                element.style.display = "none";
            }
            if (parseFloat(element.getAttribute("cx")) === x2 && parseFloat(element.getAttribute("cy")) === y2) {
                element.style.display = "none";
            }
        });
        // 将新的边连到新的点上
        line.forEach((element, index, array) => {
            if (parseFloat(element.getAttribute("x1")) === x2 && parseFloat(element.getAttribute("y1")) === y2) {
                element.setAttribute("x1", middleX);
                element.setAttribute("y1", middleY);
            }
            if (parseFloat(element.getAttribute("x2")) === x1 && parseFloat(element.getAttribute("y2")) === y1) {
                element.setAttribute("x2", middleX);
                element.setAttribute("y2", middleY);
            }
        })
        if (step - 1 == potNum) {
            //计算得分
            showScore();
        }
    }
}


// 手动生成的点击事件
document.getElementById("human").addEventListener("click", () => {
    // 更新表单和标题
    changePattern = 0;
    document.querySelector(".potNum").style.display = "block";
    document.querySelector(".aboutPot").style.display = "none";
    document.querySelector(".machineForm").style.display = "block";
    document.querySelector(".humanForm").style.display = "none";
    document.querySelector(".modal-title").innerHTML = "请输入节点的值和边的值（建议不超过10个）";
    // 重置数值
    potValue = [];
    lineValue = [];
    // 获取玩家输入
    getPlayerInput();
});

// 随机生成的点击事件
document.getElementById("machine").addEventListener("click", () => {
    // 更新表单和标题
    changePattern = 1;
    document.querySelector(".machineForm").style.display = "none";
    document.querySelector(".humanForm").style.display = "block";
    document.querySelector(".modal-title").innerHTML = "请输入随机节点的数量和数值范围";
    // 重置数值
    potValue = [];
    lineValue = [];
});

// 生成图像的点击事件
document.querySelector(".game_create").addEventListener("click", () => {
    start = 1;
    // 为玩家手动输入生成图像
    if (changePattern === 0) {
        potValue.push(parseInt(document.querySelector(".aboutPotValue").value));
        lineValue.push(document.querySelector(".aboutLineValue").value);
        showinfo();
        drawPolygon(potValue, lineValue);
        console.log(potValue, lineValue)
    }
    // 为玩家随机生成图像
    else if (changePattern === 1) {
        // 获取用户输入的随机条件
        potNum = parseInt(document.querySelector(".randomNum").value);
        let min = document.querySelector(".randomMin").value;
        let max = document.querySelector(".randomMax").value;
        let operation = ['+', '*']
        //建立随机数
        for (let i = 0; i < potNum; i++) {
            let k = parseInt(Math.floor(Math.random() * (max - min + 1))) + parseInt(min); //生成节点的值随机数
            potValue.push(k); //将随机数赋值给节点
            let j = Math.floor(Math.random() * 2); //生成边的值随机数
            lineValue.push(operation[j]); //将随机数赋值给边; //将随机数赋值给边
        }
        showinfo();
        drawPolygon(potValue, lineValue);
    }
});

// 游戏信息的事件
document.querySelector(".info_button").addEventListener("click", () => {
    if (start === 1) {
        document.querySelector(".info_box ul").style.display = "block";
        if (d === 0) {
            d = 1;
            document.querySelector(".info_box").style.right = "0px";
            document.querySelector(".bi-arrow-right").style.transform = "rotate(180deg)";
        } else if (d === 1) {
            d = 0;
            document.querySelector(".info_box").style.right = "-240px";
            document.querySelector(".bi-arrow-right").style.transform = "rotate(360deg)";
        }
    } else if (start === 0) {
        alert("请先开始游戏");
    }
})

// 回退按钮  郑
document.getElementById("backOneStep").addEventListener("click", () => {
    // 当玩家有进行删除边的操作时
    let li = document.querySelectorAll(".info_box ul li");
    let button = document.querySelectorAll(".deleteLine");
    if (playerSeleteRoute.length > 0) {
        let line = document.querySelectorAll("#line");
        let pot = document.querySelectorAll("#pot");
        let newpots = document.querySelectorAll("#newpot");
        let text = document.querySelectorAll("text");
        step -= 1;
        // 页面右侧数据栏的回退事件
        li[playerSeleteRoute[playerSeleteRoute.length - 1] - 1].style.height = "56px";
        button[playerSeleteRoute[playerSeleteRoute.length - 1] - 1].style.display = "block";

        // 多边形的回退事件
        if (step === 1) {
            line[playerSeleteRoute[playerSeleteRoute.length - 1] - 1].style.opacity = "1";
        } else if (step > 1) {
            line[playerSeleteRoute[playerSeleteRoute.length - 1] - 1].style.opacity = "1";
            let x1 = parseFloat(line[playerSeleteRoute[playerSeleteRoute.length - 1] - 1].getAttribute("x1"));
            let x2 = parseFloat(line[playerSeleteRoute[playerSeleteRoute.length - 1] - 1].getAttribute("x2"));
            let y1 = parseFloat(line[playerSeleteRoute[playerSeleteRoute.length - 1] - 1].getAttribute("y1"));
            let y2 = parseFloat(line[playerSeleteRoute[playerSeleteRoute.length - 1] - 1].getAttribute("y2"));
            let middleX = (x1 + x2) / 2;
            let middleY = (y1 + y2) / 2;
            // 重新显示旧节点
            pot.forEach((element, index, array) => {
                if (parseFloat(element.getAttribute("cx")) === x1 && parseFloat(element.getAttribute("cy")) === y1) {
                    element.style.display = "block";
                }
                if (parseFloat(element.getAttribute("cx")) === x2 && parseFloat(element.getAttribute("cy")) === y2) {
                    element.style.display = "block";
                }
            });
            // 重新显示节点序号
            text.forEach((element, index, array) => {
                if (parseFloat(element.getAttribute("x")) === x1 && parseFloat(element.getAttribute("y")) === y1 - 32) {
                    element.style.display = "block";
                }
                if (parseFloat(element.getAttribute("x")) === x2 && parseFloat(element.getAttribute("y")) === y2 - 32) {
                    element.style.display = "block";
                }
            })
            // 将新生成的节点消除和重新显示旧节点
            newpots.forEach((element, index, array) => {
                if (parseFloat(element.getAttribute("cx")) === x1 && parseFloat(element.getAttribute("cy")) === y1) {
                    element.style.display = "block";
                }
                if (parseFloat(element.getAttribute("cx")) === x2 && parseFloat(element.getAttribute("cy")) === y2) {
                    element.style.display = "block";
                }
                if (parseFloat(element.getAttribute("cx")) === middleX && parseFloat(element.getAttribute("cy")) === middleY) {
                    element.style.display = "none";
                }
            });
            // 将新的边连到新的点上
            line.forEach((element, index, array) => {
                if (parseFloat(element.getAttribute("x1")) === middleX && parseFloat(element.getAttribute("y1")) === middleY) {
                    element.setAttribute("x1", x2);
                    element.setAttribute("y1", y2);
                }
                if (parseFloat(element.getAttribute("x2")) === middleX && parseFloat(element.getAttribute("y2")) === middleY) {
                    element.setAttribute("x2", x1);
                    element.setAttribute("y2", y1);
                }
            })
        }

        // 回退路径
        playerSeleteRoute.pop();
        pots = [];
        document.querySelector(".getScore").innerHTML = `<strong>·</strong>&nbsp;最终得分：计算中`;
        document.querySelector(".getRoute").innerHTML = `<strong>·</strong>&nbsp;当前路径：${playerSeleteRoute}`;

    } else {
        alert("不可以进行此操作！");
    }
});

// 重新开始按钮
document.getElementById("restart").addEventListener("click", () => {
    // 刷新页面清除所有全局变量
    location.reload();
})

// 获取用户输入
function getUserInput() {

    n = potValue.length;
    v = Array(potValue.length + 1);  // 顶点值数组
    op = Array(potValue.length + 1); // 边操作符数组
    for (let i = 1; i <= potValue.length; i++) {
        v[i] = potValue[i - 1];
        if (i === 1) {
            op[i] = lineValue[lineValue.length - 1];
        } else {
            op[i] = lineValue[i - 2];
        }
    }
}

// 初始化数组
function initArrays() {
    m = Array.from({ length: n + 1 }, () => Array.from({ length: n + 1 }, () => Array(2).fill(0))); // 初始化存放结果的数组
    for (let i = 1; i <= n; i++) {
        // 初始化长度为1的链的最大值和最小值
        m[i][1][1] = v[i];
        m[i][1][0] = v[i];
    }

    maxMergePaths = Array.from({ length: n + 1 }, () => Array.from({ length: n + 1 }, () => []));
    minMergePaths = Array.from({ length: n + 1 }, () => Array.from({ length: n + 1 }, () => []));
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            maxMergePaths[i][j] = [];
            minMergePaths[i][j] = [];
        }
    }
    for (let i = 1; i <= n; i++) {
        maxMergePaths[i][n].push(i);
        minMergePaths[i][n].push(i);
    }
}

// 计算多边形游戏的最大值和最小值
function calculateMinMax() {
    for (let j = 2; j <= n; j++) {  // 总长度遍历
        for (let i = 1; i <= n; i++) { //迭代首次删掉第i条边
            let maxIndex = -1, minIndex = -1;
            let maxLR = [-1, -1, -1, -1];
            let minLR = [-1, -1, -1, -1];
            for (let s = 1; s < j; s++) {  // 断开位置
                // 求m[i][j][1]和m[i][j][0]
                let tempIndex = minMax(i, s, j);
                // 更新最大值和最小值
                if (s == 1) {
                    m[i][j][0] = minf;
                    m[i][j][1] = maxf;
                    maxIndex = tempIndex[2];
                    minIndex = tempIndex[2];
                    for (let k = 0; k < 4; k++) {
                        maxLR[k] = tempIndex[k];
                        minLR[k] = tempIndex[k];
                    }
                }
                else {
                    if (maxf > m[i][j][1]) {
                        m[i][j][1] = maxf;
                        maxIndex = tempIndex[2];
                        for (let k = 0; k < 4; k++) {
                            maxLR[k] = tempIndex[k];
                        }
                    }
                    if (minf < m[i][j][0]) {
                        m[i][j][0] = minf;
                        minIndex = tempIndex[2];
                        for (let k = 0; k < 4; k++) {
                            minLR[k] = tempIndex[k];
                        }
                    }
                }
            }
            if (j == 2) {
                maxMergePaths[i][j].push(maxIndex);
                minMergePaths[i][j].push(minIndex);
            }
            else {
                maxMergePaths[i][j] = maxMergePaths[i][j].concat(maxMergePaths[maxLR[0]][maxLR[1]]);
                maxMergePaths[i][j] = maxMergePaths[i][j].concat(maxMergePaths[maxLR[2]][maxLR[3]]);
                maxMergePaths[i][j].push(maxIndex);
                minMergePaths[i][j] = minMergePaths[i][j].concat(minMergePaths[minLR[0]][minLR[1]]);
                minMergePaths[i][j] = minMergePaths[i][j].concat(minMergePaths[minLR[2]][minLR[3]]);
                minMergePaths[i][j].push(minIndex);
            }

        }
    }
    result = new Array(2).fill(0);
    result[0] = m[1][n][1]; // 最大值
    result[1] = m[1][n][0]; // 最小值
    // 找到所有起点中的最大值和最小值
    for (let i = 1; i <= n; i++) {
        if (result[0] < m[i][n][1]) {
            result[0] = m[i][n][1];
            ansMaxIndex = i;
        }

        if (result[1] > m[i][n][0]) {
            result[1] = m[i][n][0];
            ansMinIndex = i;
        }

    }
}

// 计算以i为起点，长度为j的子链的最大值和最小值
function minMax(i, s, j) {
    let e = Array(5).fill(0); // 用于存放乘法的结果
    // 在op[i+s] 处进行分割
    let a = m[i][s][0],  // 左半部分最小值
        b = m[i][s][1],  // 左半部分最大值
        r = (i + s - 1) % n + 1,  // 取余，防止溢出
        c = m[r][j - s][0],  // 右半部分最小值
        d = m[r][j - s][1];  // 右半部分最大值
    if (op[r] == '+') {
        // 加法
        minf = a + c;
        maxf = b + d;
    } else {
        // 乘法
        e[1] = a * c;
        e[2] = a * d;
        e[3] = b * c;
        e[4] = b * d;
        minf = e[1];
        maxf = e[1];
        // 找到乘法的最大值和最小值
        for (let k = 2; k < 5; k++) {
            if (minf > e[k])
                minf = e[k];
            if (maxf < e[k])
                maxf = e[k];
        }
    }
    return [i, s, r, j - s];
}

// 输出结果
function printResult() {
    // 创建新的li元素来记录最优结果信息
    let p1 = document.createElement("p");
    let p2 = document.createElement("p");
    let p3 = document.createElement("p");
    let p4 = document.createElement("p");
    let p5 = document.createElement("p");
    p3.style.color = "red";
    p5.style.color = "red";
    p1.innerHTML = `最大值：<strong style="color:red">${result[0]}</strong> &nbsp; 最小值：<strong style="color:red">${result[1]}</strong>`;
    document.querySelector(".resultItem").appendChild(p1);
    p2.innerHTML = "最大值合并队列：";
    document.querySelector(".resultItem").appendChild(p2);

    let queue = '';
    let n = lineValue.length
    for (let item of maxMergePaths[ansMaxIndex][n]) {
        if (parseInt(item) === 1) {
            queue = queue + n + " ";
        } else {
            queue = queue + (parseInt(item) - 1) + " ";
        }
    }
    p3.innerHTML = `${queue}`;
    document.querySelector(".resultItem").appendChild(p3);

    p4.innerHTML = "最小值合并队列：";
    document.querySelector(".resultItem").appendChild(p4);

    queue = '';
    for (let item of minMergePaths[ansMinIndex][n]) {
        if (parseInt(item) === 1) {
            queue = queue + n + " ";
        } else {
            queue = queue + (parseInt(item) - 1) + " ";
        }
    }
    p5.innerHTML = `${queue}`;
    document.querySelector(".resultItem").appendChild(p5);
}

document.getElementById("showResult").addEventListener("click", () => {
    getUserInput();
    initArrays();
    calculateMinMax();
    printResult();
    document.getElementById("showResult").style.display = "none";
})
