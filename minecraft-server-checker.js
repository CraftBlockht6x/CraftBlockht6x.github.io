function initMinecraftServerChecker(config = {}) {
    // 默认配置
    const defaultConfig = {
        containerId: 'minecraft-server-checker',
        defaultServers: [{ address: "jm.rainplay.cn:59954" }],
        displaySettings: {
            motd: true,
            version: true,
            players: true,
            gamemode: true,
            edition: true,
            software: true,
            plugins: true,
            delay: true
        },
        allowUserInput: true,
        refreshInterval: 3000,
        smoothingSamples: 10,
        apiProviders: [
            {
                name: 'MCSrvStat',
                url: (host, port) => `https://api.mcsrvstat.us/2/${host}:${port}`,
                parser: (data) => ({
                    latency: data.debug?.ping,
                    online: data.online,
                    players: data.players?.online
                })
            },
            {
                name: 'MCAPI',
                url: (host, port) => `https://mcapi.xdefcon.com/server/${host}/status`,
                parser: (data) => ({
                    latency: data.ping,
                    online: data.serverStatus === 'online',
                    players: data.players
                })
            },
            {
                name: 'MCStatus',
                url: (host, port) => `https://api.mcstatus.io/v2/status/bedrock/${host}:${port}`,
                parser: (data) => ({
                    latency: data.roundTripLatency,
                    online: data.online,
                    players: data.players.online
                })
            }
        ],
        theme: {
            cardBackgroundColor: '#2D2D2D',
            textColor: '#fff',
            secondaryTextColor: '#A0A0A0',
            accentColor: '#00A3E8',
            successColor: '#55FF55',
            warningColor: '#FFAA00',
            errorColor: '#FF5555',
            borderColor: '#3D3D3D',
            primaryColor: '#2196F3',
            successButtonColor: '#4CAF50',
            warningButtonColor: '#FFC107',
            dangerButtonColor: '#F44336'
        }
    };

    // 合并用户配置和默认配置
    const finalConfig = { ...defaultConfig, ...config };
    const {
        containerId,
        defaultServers,
        displaySettings,
        allowUserInput,
        refreshInterval,
        smoothingSamples,
        apiProviders,
        theme
    } = finalConfig;

    // 创建HTML内容
    const htmlContent = `
        <div id="${containerId}" class="container">
            ${allowUserInput ? `
            <div class="controls" id="server-form-container">
                <form id="server-form">
                    <input type="text" id="server-address" placeholder="请输入服务器地址和端口（如：mc.example.com:19132）" required>
                    <button type="submit">添加服务器</button>
                </form>
            </div>
            ` : ''}
            <div class="server-list" id="server-list">
                <!-- 服务器卡片将动态添加在这里 -->
            </div>
        </div>
    `;

    // 查找容器并插入HTML
    const container = document.getElementById(containerId) || document.querySelector(`#${containerId}`);
    if (!container) {
        console.error(`未找到容器元素 #${containerId}`);
        return;
    }
    container.innerHTML = htmlContent;

    // 设置样式
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --mc-bg: ${theme.backgroundColor};
            --mc-card-bg: ${theme.cardBackgroundColor};
            --mc-text: ${theme.textColor};
            --mc-text-secondary: ${theme.secondaryTextColor};
            --mc-accent: ${theme.accentColor};
            --mc-success: ${theme.successColor};
            --mc-warning: ${theme.warningColor};
            --mc-error: ${theme.errorColor};
            --mc-border: ${theme.borderColor};
            --primary: ${theme.primaryColor};
            --success: ${theme.successButtonColor};
            --warning: ${theme.warningButtonColor};
            --danger: ${theme.dangerButtonColor};
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Minecraft', 'Minecraftia', monospace;
        }

        body {
            background-color: var(--mc-bg);
            color: var(--mc-text);
            padding: 20px;
            font-size: 16px;
            line-height: 1.5;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        h1 {
            text-align: center;
            margin-bottom: 30px;
            color: var(--mc-accent);
            text-shadow: 0 0 5px rgba(0, 163, 232, 0.5);
        }

        .controls {
            margin-bottom: 20px;
        }

        .server-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .server-card {
            background-color: var(--mc-card-bg);
            border-radius: 8px;
            border: 1px solid var(--mc-border);
            padding: 20px;
            position: relative;
            transition: transform 0.2s ease;
        }

        .server-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        }

        .server-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--mc-border);
        }

        .server-name {
            font-size: 1.2rem;
            font-weight: bold;
        }

        .server-status {
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 0.9rem;
            height: 24px;
            width: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .status-online {
            background-color: var(--mc-success);
            color: #000;
        }

        .status-offline {
            background-color: var(--mc-error);
            color: #000;
        }

        .server-address {
            font-size: 0.9rem;
            color: var(--mc-text-secondary);
            margin-bottom: 15px;
        }

        .server-motd {
            background-color: rgba(255, 255, 255, 0.1);
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
            font-family: 'Minecraft', 'Minecraftia', monospace;
            white-space: pre-line;
        }

        .server-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 15px;
        }

        .info-item {
            display: flex;
            flex-direction: column;
        }

        .info-label {
            font-size: 0.8rem;
            color: var(--mc-text-secondary);
            margin-bottom: 5px;
        }

        .info-value {
            font-size: 1rem;
        }

        .info-value.green {
            color: var(--mc-success);
        }

        .info-value.orange {
            color: var(--mc-warning);
        }

        .info-value.red {
            color: var(--mc-error);
        }

        .info-value.blue {
            color: var(--mc-accent);
        }

        .server-delay {
            background-color: rgba(255, 255, 255, 0.1);
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
        }

        .last-updated {
            font-size: 0.8rem;
            color: var(--mc-text-secondary);
            text-align: right;
            margin-top: 10px;
        }

        .hidden {
            display: none;
        }

        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: var(--mc-accent);
            animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .server-form {
            display: flex;
            margin-bottom: 20px;
        }

        .server-form input {
            flex: 1;
            padding: 10px;
            border: 1px solid var(--mc-border);
            background-color: rgba(255, 255, 255, 0.1);
            color: var(--mc-text);
            border-radius: 4px 0 0 4px;
            font-family: 'Minecraft', 'Minecraftia', monospace;
        }

        .server-form button {
            padding: 10px 15px;
            background-color: var(--mc-accent);
            color: white;
            border: none;
            border-radius: 0 4px 4px 0;
            cursor: pointer;
            font-family: 'Minecraft', 'Minecraftia', monospace;
        }

        .server-form button:hover {
            background-color: #0086C3;
        }

        .api-source {
            font-size: 0.9em;
            color: var(--mc-text-secondary);
            margin-top: 4px;
        }
    `;
    document.head.appendChild(style);

    // DOM元素引用
    const serverList = document.getElementById('server-list');
    const serverFormContainer = document.getElementById('server-form-container');
    const serverForm = document.getElementById('server-form');
    const serverAddressInput = document.getElementById('server-address');

    // 服务器列表
    let servers = defaultServers;
    // 存储延迟样本
    const latencySamples = {};
    // 是否是第一次加载
    let isFirstLoad = true;

    // 初始化页面
    function init() {
        // 初始化允许用户输入的开关
        if (!allowUserInput && serverFormContainer) {
            serverFormContainer.classList.add('hidden');
        }

        // 初始化默认服务器
        renderServers();

        // 添加事件监听器
        if (serverForm) {
            serverForm.addEventListener('submit', handleAddServer);
        }

        // 启动自动刷新
        setInterval(refreshServers, refreshInterval);
    }

    // 处理添加服务器
    function handleAddServer(e) {
        e.preventDefault();

        const address = serverAddressInput.value.trim();
        if (address) {
            // 检查是否已存在该服务器
            if (!servers.some(server => server.address === address)) {
                servers.push({ address });
                renderServers();
                serverAddressInput.value = '';
            } else {
                alert('该服务器已存在！');
            }
        }
    }

    // 渲染所有服务器
    function renderServers() {
        serverList.innerHTML = '';

        servers.forEach((server, index) => {
            const card = createServerCard(server, index);
            serverList.appendChild(card);
        });
    }

    // 创建服务器卡片
    function createServerCard(server, index) {
        const card = document.createElement('div');
        card.className = 'server-card';
        card.dataset.index = index;

        // 加载动画（仅在第一次加载时显示）
        if (isFirstLoad) {
            card.innerHTML = `
                <div class="server-header">
                    <span class="server-name">加载中...</span>
                    <span class="server-status">${loadingIcon()}</span>
                </div>
                <div class="server-address">正在获取服务器信息...</div>
                <div class="last-updated">上次更新: 正在获取...</div>
            `;
        }

        // 检查并更新服务器状态
        checkServerStatus(server.address)
            .then(status => {
                updateServerCard(card, server, status);
            })
            .catch(error => {
                console.error(`无法获取服务器 ${server.address} 的状态`, error);
                updateServerCard(card, server, {
                    online: false,
                    error: error.message || "未知错误"
                });
            });

        return card;
    }

    // 更新服务器卡片
    function updateServerCard(card, server, status) {
        const index = card.dataset.index;
        const oldStatusElem = card.querySelector('.server-status');

        card.innerHTML = '';

        // 获取当前时间
        const now = new Date();
        const formattedTime = now.toLocaleString();

        // 创建服务器头部
        const header = document.createElement('div');
        header.className = 'server-header';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'server-name';
        nameSpan.textContent = server.address.split(':')[0];
        header.appendChild(nameSpan);

        const statusSpan = document.createElement('span');
        statusSpan.className = `server-status ${status.online ? 'status-online' : 'status-offline'}`;
        statusSpan.textContent = status.online ? '在线' : '离线';
        header.appendChild(statusSpan);
        card.appendChild(header);

        // 创建服务器地址
        const addressDiv = document.createElement('div');
        addressDiv.className = 'server-address';
        addressDiv.textContent = server.address;
        card.appendChild(addressDiv);

        // 如果服务器在线，显示详细信息
        if (status.online) {
            // 如果有公告，显示公告
            if (displaySettings.motd && status.motd && status.motd.raw) {
                const motdDiv = document.createElement('div');
                motdDiv.className = 'server-motd';
                motdDiv.innerHTML = parseMinecraftColors(status.motd.raw);
                card.appendChild(motdDiv);
            }

            // API延迟信息
            const apiDelayDiv = document.createElement('div');
            apiDelayDiv.className = 'server-delay';
            apiDelayDiv.innerHTML = `
                <div class="info-label">服务器延迟</div>
                <div class="info-value">
                    ${status.apiLatency !== undefined ? 
                        `${status.apiLatency}ms via ${status.apiSource}` : 
                        '未检测到API延迟'
                    }
                </div>
            `;
            card.appendChild(apiDelayDiv);

            // 创建服务器信息部分
            const infoDiv = document.createElement('div');
            infoDiv.className = 'server-info';

            // 版本信息
            if (displaySettings.version && status.version) {
                const versionItem = document.createElement('div');
                versionItem.className = 'info-item';
                versionItem.innerHTML = `
                    <div class="info-label">版本</div>
                    <div class="info-value blue">${status.version.name}</div>
                `;
                infoDiv.appendChild(versionItem);
            }

            // 玩家信息
            if (displaySettings.players && status.players) {
                const playersItem = document.createElement('div');
                playersItem.className = 'info-item';
                playersItem.innerHTML = `
                    <div class="info-label">玩家</div>
                    <div class="info-value green">${status.players.online}/${status.players.max}</div>
                `;
                infoDiv.appendChild(playersItem);
            }

            // 游戏模式
            if (displaySettings.gamemode && status.gamemode) {
                const gamemodeItem = document.createElement('div');
                gamemodeItem.className = 'info-item';
                gamemodeItem.innerHTML = `
                    <div class="info-label">游戏模式</div>
                    <div class="info-value">${status.gamemode}</div>
                `;
                infoDiv.appendChild(gamemodeItem);
            }

            // 版本信息
            if (displaySettings.edition && status.edition) {
                const editionItem = document.createElement('div');
                editionItem.className = 'info-item';
                editionItem.innerHTML = `
                    <div class="info-label">版本</div>
                    <div class="info-value">${status.edition}</div>
                `;
                infoDiv.appendChild(editionItem);
            }

            // 软件信息
            if (displaySettings.software && status.software) {
                const softwareItem = document.createElement('div');
                softwareItem.className = 'info-item';
                softwareItem.innerHTML = `
                    <div class="info-label">软件</div>
                    <div class="info-value">${status.software}</div>
                `;
                infoDiv.appendChild(softwareItem);
            }

            // 插件信息
            if (displaySettings.plugins && status.plugins && status.plugins.length > 0) {
                const pluginsItem = document.createElement('div');
                pluginsItem.className = 'info-item';
                pluginsItem.innerHTML = `
                    <div class="info-label">插件</div>
                    <div class="info-value">${status.plugins.join(', ')}</div>
                `;
                infoDiv.appendChild(pluginsItem);
            }

            // 如果有信息添加，则添加信息容器
            if (infoDiv.children.length > 0) {
                card.appendChild(infoDiv);
            }

            // 更新时间
            const updatedDiv = document.createElement('div');
            updatedDiv.className = 'last-updated';
            updatedDiv.textContent = `上次更新: ${formattedTime}`;
            card.appendChild(updatedDiv);
        } else {
            // 服务器离线状态
            const errorDiv = document.createElement('div');
            errorDiv.className = 'server-delay';
            errorDiv.innerHTML = `
                <div class="info-label">错误</div>
                <div class="info-value red">${status.error || '无法连接到服务器'}</div>
            `;
            card.appendChild(errorDiv);

            // 更新时间
            const updatedDiv = document.createElement('div');
            updatedDiv.className = 'last-updated';
            updatedDiv.textContent = `上次更新: ${formattedTime}`;
            card.appendChild(updatedDiv);
        }
    }

    // 检查服务器状态并获取延迟
    async function checkServerStatus(address) {
        const [hostname, port] = address.split(':');

        try {
            // 从MCStatus API获取基础状态信息
            const mcStatusResponse = await fetch(`https://api.mcstatus.io/v2/status/bedrock/${hostname}:${port}`);
            if (!mcStatusResponse.ok) {
                throw new Error(`MCStatus API返回错误: ${mcStatusResponse.status}`);
            }

            const mcStatusData = await mcStatusResponse.json();

            // 并行请求其他API以获取延迟信息
            const results = await Promise.allSettled(
                apiProviders.map(provider => 
                    fetchAPI(provider.url(hostname, port || 19132), provider.parser)
                )
            );

            // 查找最可靠的延迟结果
            let bestLatency = null;
            let bestApiSource = null;
            let bestApiLatency = null;

            for (const result of results) {
                if (result.status === 'fulfilled' && result.value.success) {
                    if (bestLatency === null || result.value.latency < bestLatency) {
                        bestLatency = result.value.latency;
                        bestApiSource = result.value.source;
                        bestApiLatency = result.value.apiLatency;
                    }
                }
            }

            return {
                online: mcStatusData.online,
                error: mcStatusData.error_message,
                ...mcStatusData,
                latency: bestLatency,
                apiSource: bestApiSource,
                apiLatency: bestApiLatency
            };
        } catch (error) {
            console.error(`无法获取服务器 ${address} 的状态`, error);
            return {
                online: false,
                error: error.message || "无法连接到API"
            };
        }
    }

    // 获取API延迟数据
    async function fetchAPI(url, parser) {
        try {
            const startTime = Date.now();
            const response = await fetch(url);

            if (!response.ok) throw new Error('API请求失败');

            const data = await response.json();
            const apiLatency = Date.now() - startTime;

            return {
                success: true,
                ...parser(data),
                apiLatency,
                source: url.split('/')[2]
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                source: url.split('/')[2]
            };
        }
    }

    // 解析Minecraft颜色代码
    function parseMinecraftColors(text) {
        // Minecraft颜色代码映射
        const colorMap = {
            '0': '#000000', // 黑色
            '1': '#0000AA', // 深蓝色
            '2': '#00AA00', // 深绿色
            '3': '#00AAAA', // 深青色
            '4': '#AA0000', // 深红色
            '5': '#AA00AA', // 深紫色
            '6': '#FFAA00', // 金色
            '7': '#AAAAAA', // 灰色
            '8': '#555555', // 深灰色
            '9': '#5555FF', // 蓝色
            'a': '#55FF55', // 绿色
            'b': '#55FFFF', // 青色
            'c': '#FF5555', // 红色
            'd': '#FF55FF', // 粉红色
            'e': '#FFFF55', // 黄色
            'f': '#FFFFFF', // 白色
            'k': 'obfuscated', // 隐藏
            'l': 'bold', // 加粗
            'm': 'strikethrough', // 删除线
            'n': 'underline', // 下划线
            'o': 'italic', // 斜体
            'r': 'reset' // 重置
        };

        let result = '';
        let currentStyle = {};

        // 分割文本为段落
        const paragraphs = text.split('\n');

        paragraphs.forEach(paragraph => {
            let paragraphHtml = '';
            let currentColor = null;
            let currentStyles = [];

            // 分割文本为颜色代码和文本部分
            let i = 0;
            while (i < paragraph.length) {
                if (paragraph[i] === '§' && i + 1 < paragraph.length) {
                    const code = paragraph[i + 1].toLowerCase();
                    if (colorMap[code]) {
                        // 处理颜色代码
                        if (code === 'r') {
                            // 重置样式
                            currentColor = null;
                            currentStyles = [];
                        } else if (colorMap[code].startsWith('#')) {
                            // 颜色代码
                            currentColor = colorMap[code];
                        } else {
                            // 样式代码
                            if (!currentStyles.includes(colorMap[code])) {
                                currentStyles.push(colorMap[code]);
                            }
                        }

                        i += 2;
                        continue;
                    }
                }

                // 处理普通字符
                let char = paragraph[i];
                let spanHtml = '';

                if (currentColor || currentStyles.length > 0) {
                    spanHtml = `<span style="`;

                    if (currentColor) {
                        spanHtml += `color: ${currentColor}; `;
                    }

                    if (currentStyles.includes('bold')) {
                        spanHtml += 'font-weight: bold; ';
                    }

                    if (currentStyles.includes('italic')) {
                        spanHtml += 'font-style: italic; ';
                    }

                    if (currentStyles.includes('underline')) {
                        spanHtml += 'text-decoration: underline; ';
                    }

                    if (currentStyles.includes('strikethrough')) {
                        spanHtml += 'text-decoration: line-through; ';
                    }

                    if (currentStyles.includes('obfuscated')) {
                        // 隐藏文本
                        const hiddenChar = String.fromCharCode(Math.floor(Math.random() * 95) + 32);
                        spanHtml += '">';
                        char = hiddenChar;
                    } else {
                        spanHtml += '">';
                    }

                    spanHtml += char + '</span>';
                } else {
                    spanHtml = char;
                }

                paragraphHtml += spanHtml;
                i++;
            }

            // 添加段落结尾
            result += `<div>${paragraphHtml}</div>`;
        });

        return result;
    }

    // 加载动画
    function loadingIcon() {
        return `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="${theme.accentColor}" fill-opacity="0.3">
                    <animate attributeName="fill-opacity" values="0.3;0.6;0.3" dur="1s" repeatCount="indefinite" />
                </circle>
                <circle cx="12" cy="12" r="5" fill="${theme.accentColor}" fill-opacity="0.6">
                    <animate attributeName="r" values="5;8;5" dur="1s" repeatCount="indefinite" />
                </circle>
            </svg>
        `;
    }

    // 获取平均延迟
    function getAverageLatency(status) {
        if (status.latency !== undefined) {
            return status.latency;
        }
        return "测量中...";
    }

    // 根据延迟值获取颜色
    function getLatencyColor(latency) {
        if (latency < 100) return 'var(--mc-success)';
        if (latency < 200) return 'var(--mc-warning)';
        return 'var(--mc-error)';
    }

    // 刷新所有服务器状态
    async function refreshServers() {
        const serverCards = document.querySelectorAll('.server-card');

        serverCards.forEach((card, index) => {
            if (index >= servers.length) return;

            const server = servers[index];

            // 检查服务器状态并更新卡片
            checkServerStatus(server.address)
                .then(status => {
                    updateServerCard(card, server, status);
                })
                .catch(error => {
                    console.error(`无法刷新服务器 ${server.address} 的状态`, error);
                    updateServerCard(card, server, {
                        online: false,
                        error: error.message || "刷新失败"
                    });
                });
        });

        // 第一次加载完成后隐藏加载动画
        if (isFirstLoad) {
            isFirstLoad = false;
        }
    }

    // 页面加载完成后初始化
    if (document.readyState !== 'loading') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
}
