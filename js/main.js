/*
 * @Author: Vir
 * @Date: 2019-11-28 14:32:57
 * @Last Modified by: Vir
 * @Last Modified time: 2020-05-07 09:51:48
 */

//配置变量
var searchFlag = true; //搜索引标记
var sideBarIconFlag = -1; //侧边栏按钮标记
var commonData = []; //常用网址数据
var changeWebsiteUrl = "";
var advancedSettingsFlag = true;
var sug = true;
var toDoStatus = 1;

//获取本地数据
const skinHref = getStorage("skin");
const uiHref = getStorage("uistyle");
const bg = getStorage("bg");
const commonUseData = getStorage("commonUseData");
const showCommonUse = getStorage("showCommonUse");
const customFilletValue = getStorage("customFilletValue");
const sugFlag = getStorage("sugFlag");
const todoData = getStorage("todoData");
const sentence = getStorage('sentence');
const logo = getStorage('logo');

/*
    导入模块
 */

//所有数据
import {
    jsonData,
    updateData
} from "./module/all.data.js";

//DOM元素
import {
    linkTag,
    uiTag,
    searchContent,
    selectEngine,
    selectOption,
    searchList,
    sideBarButton,
    sideBar,
    sideBarTitle,
    sideBarContent,
    scrollContent,
    commonUse,
    copyright,
    loading,
    messageList
} from "./module/dom.constant.js";

import {
    toggle
} from './module/animation.func.js';

//搜索相关函数
import {
    goSearch,
    setEngine,
    renderEngineOption
} from "./module/search.func.js";

//搜索智能提示函数
import {
    getSugValue
} from "./module/sug.func.js";

//本地存储相关函数
import {
    setStorage,
    getStorage,
    removeStorage
} from './module/storage.func.js';

//消息提示函数
import {
    openMessage
} from "./components/message.component.js";

//阻止事件冒泡函数
import {
    stopPropagation,
    findSettingInfo,
    getRandomColor,
    removeElement,
    generateId
} from "./module/global.func.js";

//网址相关函数
import {
    commonWebsite,
    setCommomUse,
    createWebsite
} from "./module/website.func.js";

//背景相关函数
import {
    setBingImage,
    setCustomizeImage,
    setdefault,
    globalImage,
    WoolGlass
} from "./module/bg.func.js";

//皮肤相关函数
import {
    changeSkin
} from "./module/skin.func.js";

//UI相关函数
import {
    changeUI,
    customFillet
} from "./module/ui.func.js";

//模态框相关函数
import {
    openDialog,
    closeDialog
} from "./components/dialog.component.js";

//侧边栏渲染函数
import {
    renderSideBarIcon,
    renderSideBarContent
} from "./module/sideBar.func.js";

import {
    createAdvancedSettings
} from "./module/setting.func.js";

import {
    saveDATA,
    getDATA
} from "./module/dataOperations.func.js";
/*
    导入模块结束
 */

//错误事件
import windowError from './event/error.event.js';

//键盘事件
import keyEvent from './event/keyCode.event.js';

//待办事件
import {
    addToDoItem,
    completeToDoItem,
    changeToDoItemState,
    changeToDoState,
    clearToDoItem
} from './event/toDo.event.js';

//语句事件
import {
    sentenceSetting,
    logoSetting,
    uiStyleSetting,
    skinSetting,
    bgSetting
} from "./event/setting.event.js";
import {
    timeLine
} from "./components/timeLine.component.js";

/*
    加载本地存储区域/自动加载区域
 */
if (sugFlag.value !== null) {
    sug = getStorage("sugFlag").toBoolean();
} else {
    setStorage("sugFlag", true);
}

if (todoData.value == null) {
    setStorage("todoData", "[]");
}

//添加语句本地存储
if (sentence.value == null && jinrishici) {
    setStorage('sentence', 'jinrishici');
    sentenceSetting(sentence.value, jinrishici, false);
}

if (sentence.value !== null && jinrishici) {
    sentenceSetting(sentence.value, jinrishici, false);
}

if (logo.value == null) {
    setStorage('logo', 'timeLogo');
    logoSetting(getStorage('logo').value, false);
}

if (logo.value !== null) {
    logoSetting(logo.value, false);
}

if (bg.value !== null && bg.value !== "setBingImage" && bg.value !== "setdefault") {
    globalImage(bg.value);
    // WoolGlass(bg.value);
}

if (bg.value == "setBingImage") {
    setBingImage();
}

// if (skinHref.value !== null) {
//     linkTag.href = skinHref.value;
// }

if (uiHref.value !== null && customFilletValue.value == null) {
    uiTag.href = uiHref.value;
}
if (customFilletValue.value !== null) {
    customFillet(customFilletValue.value)
}
//默认设置开启显示常用网址功能
if (showCommonUse.value == null) {
    setStorage("showCommonUse", "website_open");
}

if (commonUseData.value == null) {
    setStorage("commonUseData", "[]");
    setCommomUse(commonData.toJSON());
}

if (commonUseData.value !== null) {
    commonData = commonUseData.toJSON();
    setCommomUse(commonUseData.toJSON());
}

//拼接搜索栏左侧选择引擎
renderEngineOption();

// 动态创建侧边栏图标
renderSideBarIcon();

//诗词渲染


//版权信息渲染
if (jsonData.copyright.show) {
    let copyrightContent = jsonData.copyright.content;
    let nowDdate = new Date();
    copyrightContent = copyrightContent.replace("#before#", "2018");
    copyrightContent = copyrightContent.replace("#after#", nowDdate.getFullYear());
    copyrightContent = copyrightContent.replace("#author#", "Vir");
    copyright.innerHTML = `<a class="copyright" href="${jsonData.copyright.href}">${copyrightContent}</a>`
}

//网页文档加载完毕调用动画
document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        toggle(loading, 40);
    }
}
/*
    加载本地存储区域/自动加载区域结束
 */


/*
    事件监听/事件委托相关
 */
document.querySelector(".switch-box").addEventListener("click", (e) => {
    if (e.target.className == "switch-label") {
        document.querySelector(".switch-content").checked = !sug
        sug = !sug
        setStorage("sugFlag", sug)
    }
})

//监听点击事件
document.addEventListener("click", function (e) {
    //判断选择引擎
    if (e.target !== selectOption &&
        !searchFlag &&
        e.target.parentNode.className !== "option-title" &&
        e.target.className !== "switch-box" &&
        e.target.className !== "switch-label") {
        selectOption.style.display = "none";
        searchFlag = !searchFlag;
    }

    if (e.target == document.querySelector("#search") && sug) {
        getSugValue();
    }

    if (e.target !== searchList) {
        searchList.style.display = "none";
    }

    //判断侧边栏
    if (e.target !== sideBarTitle.children &&
        e.target !== sideBarContent &&
        sideBarIconFlag !== -1 &&
        document.querySelector(".dialog") == null &&
        e.target.nodeName !== "A" &&
        e.target.nodeName !== "INPUT") {
        sideBar.className = "moveRight";
        sideBarButton.className = "sideBarButtonMoveRight";
        sideBarButton.innerHTML = `<i class="fa fa-bars"></i>`;
        sideBarIconFlag = -1;
    }

    //监听模态框关闭图标
    if (e.target.id == "closeDialog") {
        closeDialog();
    }

    //模态框提交
    if (e.target.id == "submitDialog") {
        let name = document.querySelector("#nameDialog").children[1].value;
        let url = document.querySelector("#urlDialog").children[1].value;
        if (name == "" || url == "") {
            openMessage({
                title: "提示",
                type: "error",
                content: `名称或URL不能为空！！！`
            })
            return;
        }
        if (url.toLowerCase().slice(0, 8) !== "https://" && url.toLowerCase().slice(0, 7) !== "http://") {
            url = `https://${url}`;
        }
        commonWebsite({
            thisWebsite: {
                name: name,
                url: url,
                color: getRandomColor()
            },
            commonData: commonData,
            add: true
        })
        closeDialog();
    }

    //模态框取消
    if (e.target.id == "cancelDialog") {
        closeDialog();
    }

    //模态框修改
    if (e.target.id == "changeDialog") {
        let id = document.querySelector(".dialog").id;
        let name = document.querySelector("#nameDialog").children[1].value;
        commonWebsite({
            thisWebsite: {
                id: id,
                name: name
            },
            commonData: commonData,
            change: true
        })
        closeDialog();
    }

    //模态框删除
    if (e.target.id == "deleteDialog") {
        let id = document.querySelector(".dialog").id;
        commonWebsite({
            thisWebsite: {
                id: id
            },
            commonData: commonData,
            del: true
        })
        closeDialog();
    }

    //侧边栏保存自定义网址
    if (e.target.id == "saveDialog") {
        let classify = document.querySelector(".dialog").id;
        let name = document.querySelector("#nameDialog").children[1].value;
        let url = document.querySelector("#urlDialog").children[1].value;
        if (name == "" || url == "") {
            openMessage({
                title: "提示",
                type: "error",
                content: `名称或URL不能为空！！！`
            })
            return;
        }
        if (url.toLowerCase().slice(0, 8) !== "https://" && url.toLowerCase().slice(0, 7) !== "http://") {
            url = `https://${url}`;
        }
        let websiteData = getStorage("sideBarWebsiteData").toJSON();
        let thisClassify = websiteData.find(item => {
            if (classify.indexOf(item.value) !== -1) {
                return item;
            }
        });
        let thisWebsite = thisClassify.content.find(item => item.name == name);
        if (thisWebsite == undefined) {
            thisClassify.content.push({
                name: name,
                url: url,
                color: getRandomColor()
            })
            websiteData.forEach(item => {
                if (item.value == thisClassify.value) {
                    item = thisClassify;
                }
            })
            setStorage("sideBarWebsiteData", JSON.stringify(websiteData));
            closeDialog();
            openMessage({
                title: "提示",
                type: "success",
                content: `添加成功！！！`
            })
            scrollContent.innerHTML = createWebsite();
        } else {
            openMessage({
                title: "提示",
                type: "error",
                content: `请勿添加重复内容！！！`
            })
        }
    }

    //模态框点击背景隐藏
    if (e.target.className == "dialogWrapper") {
        closeDialog();
    }

    //删除网址数据
    if (e.target.className == "deleteData") {
        let key = e.target.getAttribute("data");
        let source = getStorage(e.target.getAttribute("source")).toJSON();
        let category = e.target.getAttribute("category");
        let tBody = document.querySelector(".show-data-table").children[1];
        let inHtml = "";
        if (e.target.getAttribute("source") == "commonUseData") {
            source.splice(key, 1);
            source.forEach((item, index) => {
                inHtml += `
                <tr>
                    <td>${index+1}</td>
                    <td>${item.name}</td>
                    <td><a href="${item.url}" target="_blank">${item.url}</a></td>
                    <td>${item.color}</td>
                    <td>${item.count}次</td>
                    <td><span class="deleteData" data="${index}" source="commonUseData">删除</span></td>
                </tr>`;
            })
            setCommomUse(source);
        } else if (e.target.getAttribute("source") == "sideBarWebsiteData") {
            source.forEach(item => {
                if (item.value == category) {
                    item.content.splice(key, 1);
                }
            })
            source.forEach(item => {
                if (item.content.length > 0) {
                    item.content.forEach((inner, index) => {
                        inHtml += `
                            <tr>
                                <td>${index+1}</td>
                                <td>${inner.name}</td>
                                <td><a href="${inner.url}" target="_blank">${inner.url}</a></td>
                                <td>${inner.color}</td>
                                <td>${item.name}</td>
                                <td><span class="deleteData" data="${index}" category="${item.name}" source="sideBarWebsiteData">删除</span></td>
                            </tr>`;
                    })
                }
            })
        } else if (e.target.getAttribute("source") == "searchHistory") {
            source.splice(key, 1);
            source.forEach((item, index) => {
                inHtml += `
                    <tr>
                        <td data-label="序号">${index+1}</td>
                        <td data-label="搜索内容"><a href="${item.engine.href}${item.content}" target="_blank"">${item.content}</a></td>
                        <td data-label="时间">${item.time}</td>
                        <td data-label="操作"><span class="deleteData" data="${index}" source="searchHistoryData">删除</span></td>
                    </tr>`;
            })
        }
        if (source == [] || source == null || source.length == 0) {
            inHtml = `
                <tr class="no-data">
                    <td colspan="5"><i class="fa fa-window-close"></i> 暂无数据</td>
                </tr>`
        }
        setStorage(e.target.getAttribute("source"), JSON.stringify(source));
        tBody.innerHTML = inHtml;
        openMessage({
            title: "提示",
            type: "success",
            content: `删除数据成功！！！`
        })
    }
});

//点击选择搜索引擎事件
selectEngine.addEventListener("click", () => {
    if (searchFlag) {
        selectOption.style.display = "block";
        document.querySelector(".switch-content").checked = sug;
        searchFlag = !searchFlag;
    } else {
        selectOption.style.display = "none";
        searchFlag = !searchFlag;
    }
    stopPropagation();
})

//监听搜索按钮
searchContent.querySelector("#searchBtn").addEventListener("click", () => {
    goSearch();
})

//监听选择引擎
selectOption.addEventListener("click", (e) => {
    let thisEngine = jsonData.engine.find(item => item.value == e.target.id);
    if (thisEngine !== undefined) {
        setEngine(thisEngine);
        searchFlag = !searchFlag;
    }
})

// 监听侧边栏开启，关闭按钮
sideBarButton.addEventListener("click", () => {
    let icon = sideBarTitle.querySelectorAll(".title-icon");
    Array.prototype.forEach.call(icon, item => {
        item.style.background = "";
        item.style.color = item.getAttribute('color');
    })
    if (sideBarIconFlag == -1) {
        sideBarButton.className = "sideBarButtonMoveLeft";
        sideBarButton.innerHTML = `<i class="fa fa-mail-forward"></i>`;
        sideBar.className = "moveLeft";
        icon[0].style.background = icon[0].getAttribute('color');
        icon[0].style.color = "#fff";
        sideBarIconFlag = "Website";
        renderSideBarContent("Website");
    } else {
        sideBarButton.className = "sideBarButtonMoveRight";
        sideBarButton.innerHTML = `<i class="fa fa-bars"></i>`;
        sideBar.className = "moveRight";
        sideBarIconFlag = -1;
    }
})

// 监听侧边栏选项卡
sideBarTitle.addEventListener("click", (e) => {
    stopPropagation();
    let icon = sideBarTitle.querySelectorAll(".title-icon");
    if (e.target.className == "title-icon") {
        Array.prototype.forEach.call(icon, item => {
            item.style.background = "";
            item.style.color = item.getAttribute('color');
        })
        e.target.style.background = e.target.getAttribute('color');
        e.target.style.color = "#fff";
        renderSideBarContent(e.target.id);
        if (e.target.id == "ToDo") {
            sideBarContent.style.overflow = "hidden";
            sideBarContent.scrollTop = 0;
            document.querySelector("#toDoContent").style.height = `${document.body.clientHeight - 184}px`;
        } else {
            sideBarContent.style.overflow = "auto";
        }
        sideBarIconFlag = e.target.id;
    } else {
        sideBarButton.className = "sideBarButtonMoveRight";
        sideBarButton.innerHTML = `<i class="fa fa-bars"></i>`;
        sideBar.className = "moveRight";
        sideBarIconFlag = -1;
    }
})

// 监听侧边栏内操作
sideBarContent.addEventListener("click", (e) => {
    stopPropagation();
    // 自动记录常用网址
    let thisWebsite = {};
    let websiteData = jsonData.sideBar.content.find(item => item.value == "Website").content;
    for (let item of websiteData) {
        thisWebsite = item.content.find(inner => inner.name == e.target.id);
        if (thisWebsite !== undefined) {
            thisWebsite.count = 1;
            commonWebsite({
                thisWebsite: thisWebsite,
                commonData: getStorage("commonUseData").toJSON()
            });
            return;
        }
    }
    for (let item of getStorage("sideBarWebsiteData").toJSON()) {
        thisWebsite = item.content.find(inner => inner.name == e.target.id);
        if (thisWebsite !== undefined && thisWebsite !== {}) {
            thisWebsite.count = 1;
            commonWebsite({
                thisWebsite: thisWebsite,
                commonData: getStorage("commonUseData").toJSON()
            });
            return;
        }
    }
    // 监听设置操作
    switch (true) {
        case e.target.getAttribute('item-type') == 'changebg':
            bgSetting(e.target.id, true);
            break;
            // 配色设置
        case e.target.getAttribute('item-type') == 'skin':
            skinSetting(e.target.id, true);
            break;
            // UI设置
        case e.target.getAttribute('item-type') == 'uistyle':
            uiStyleSetting(e.target.id, true);
            break;
            //Logo设置
        case e.target.getAttribute('item-type') == 'logoStyle':
            logoSetting(e.target.id, true);
            break;
            //语句设置
        case e.target.getAttribute('item-type') == 'sentence':
            sentenceSetting(e.target.id, jinrishici, true);
            break;
        case e.target.getAttribute('item-type') == 'updateRecord':
            openDialog({
                id: e.target.id,
                title: '更新记录',
                option: {
                    type: 'text',
                    height: '300px'
                },
                content: timeLine(updateData, 'inverted')
            })
            break;
            // 开启关闭常用网址功能
        case (e.target.id.indexOf("website") !== -1):
            commonWebsite({
                commonData: commonData,
                status: e.target.id
            });
            break;
            // 添加网址
        case (e.target.id.indexOf("AddCapsule") !== -1):
            openDialog({
                id: e.target.id,
                title: "添加自定义网址",
                option: {
                    type: "form",
                    content: [{
                        name: "名称",
                        value: "name",
                        type: "input",
                        defaultValue: ""
                    }, {
                        name: "URL",
                        value: "url",
                        type: "input",
                        defaultValue: ""
                    }]
                },
                button: [{
                    name: "保存",
                    value: "save"
                }, {
                    name: "取消",
                    value: "cancel"
                }]
            })
            break;
        case e.target.id == "commonUseData":
            let cData = getStorage("commonUseData").toJSON();
            let cinHtml = "";
            cData.forEach((item, index) => {
                cinHtml += `
                    <tr>
                        <td data-label="序号">${index+1}</td>
                        <td data-label="名称"><a href="${item.url}" target="_blank" style="color:${item.color}">${item.name}</a></td>
                        <td data-label="使用次数">${item.count}次</td>
                        <td data-label="操作"><span class="deleteData" data="${index}" source="commonUseData">删除</span></td>
                    </tr>`;
            })
            if (cinHtml == "") {
                cinHtml = `
                    <tr class="no-data">
                        <td colspan="5"><i class="fa fa-window-close"></i> 暂无数据</td>
                    </tr>`
            }
            openDialog({
                id: e.target.id,
                title: "常用网址数据",
                option: {
                    type: "table"
                },
                content: `
                    <div class="show-data">
                        <table class="show-data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>名称</th>
                                    <th>使用次数</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>${cinHtml}</tbody>
                        </table>
                    </div>`,
                button: [{
                    name: "关闭",
                    value: "cancel"
                }]
            })
            break;
        case e.target.id == "sidebarData":
            let sData = getStorage("sideBarWebsiteData").toJSON();
            let sinHtml = "";
            sData.forEach(item => {
                if (item.content.length > 0) {
                    item.content.forEach((inner, index) => {
                        sinHtml += `
                            <tr>
                                <td data-label="序号">${index+1}</td>
                                <td data-label="名称"><a href="${inner.url}" target="_blank" style="color:${inner.color}">${inner.name}</a></td>
                                <td data-label="类别">${item.name}</td>
                                <td data-label="操作"><span class="deleteData" data="${index}" category="${item.value}" source="sideBarWebsiteData">删除</span></td>
                            </tr>`;
                    })
                }
            })
            if (sinHtml == "") {
                sinHtml = `
                    <tr class="no-data">
                        <td colspan="5"><i class="fa fa-window-close"></i> 暂无数据</td>
                    </tr>`
            }
            openDialog({
                id: e.target.id,
                title: "侧边栏数据",
                option: {
                    type: "table"
                },
                content: `
                    <div class="show-data">
                        <table class="show-data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>名称</th>
                                    <th>类别</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>${sinHtml}</tbody>
                        </table>
                    </div>`,
                button: [{
                    name: "关闭",
                    value: "cancel"
                }]
            })
            break;
        case e.target.id == "searchData":
            let searchData = getStorage("searchHistory").toJSON();
            if (!searchData) setStorage('searchHistory', '[]');
            let searchHtml = "";
            if (searchData.length > 0) {
                searchData.forEach((item, index) => {
                    searchHtml += `
                        <tr>
                            <td data-label="序号">${index+1}</td>
                            <td data-label="搜索内容"><a href="${item.engine.href}${item.content}" target="_blank"">${item.content}</a></td>
                            <td data-label="时间">${item.time}</td>
                            <td data-label="操作"><span class="deleteData" data="${index}" source="searchHistory">删除</span></td>
                        </tr>`;
                })
            }
            if (searchHtml == "") {
                searchHtml = `
                    <tr class="no-data">
                        <td colspan="5"><i class="fa fa-window-close"></i> 暂无数据</td>
                    </tr>`
            }
            openDialog({
                id: e.target.id,
                title: "搜索历史数据",
                option: {
                    type: "table"
                },
                content: `
                    <div class="show-data">
                        <table class="show-data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>搜索内容</th>
                                    <th>时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>${searchHtml}</tbody>
                        </table>
                    </div>`,
                button: [{
                    name: "关闭",
                    value: "cancel"
                }]
            })
            break;
            //备份数据
        case e.target.id == "backupData":
            saveDATA({
                uistyle: getStorage("uistyle").value,
                sugFlag: getStorage("sugFlag").value,
                skin: getStorage("skin").value,
                showCommonUse: getStorage("showCommonUse").value,
                commonUseData: getStorage("commonUseData").toJSON(),
                sideBarWebsiteData: getStorage("sideBarWebsiteData").toJSON(),
                todoData: getStorage("todoData").toJSON(),
                searchHistory: getStorage("searchHistory").toJSON()
            })
            break;
            //恢复数据
        case e.target.id == "recoveryData":
            getDATA().then(resolve => {
                let data = JSON.parse(resolve.data);
                setStorage("uistyle", data.uistyle);
                setStorage("sugFlag", data.sugFlag);
                setStorage("skin", data.skin);
                setStorage("showCommonUse", JSON.stringify(data.showCommonUse));
                setStorage("commonUseData", JSON.stringify(data.commonUseData));
                setStorage("sideBarWebsiteData", JSON.stringify(data.sideBarWebsiteData));
                setStorage("todoData", JSON.stringify(data.todoData));
                setStorage("searchHistory", JSON.stringify(data.searchHistory));
                location.reload(true); //刷新页面
                openMessage({
                    title: "提示",
                    type: "success",
                    content: `${resolve.msg}`
                })
            }).catch(reject => {
                openMessage({
                    title: "提示",
                    type: "error",
                    content: `${reject.msg}`
                })
            })
            break;
            // 高级设置显示隐藏
        case e.target.id == "advancedSettings":
            if (advancedSettingsFlag == true) {
                createAdvancedSettings();
                advancedSettingsFlag = !advancedSettingsFlag;
            } else {
                removeElement(".advanced-settings-content");
                advancedSettingsFlag = !advancedSettingsFlag;
            }
            break;
            //提交待办事项
        case e.target.id == "submitToDo":
            addToDoItem(e.target);
            break;
            //点击完成待办事项
        case (e.target.className == "list-item" && toDoStatus == 1):
            completeToDoItem(e.target);
            break;
            //切换待办
        case e.target.getAttribute("status") == 1:
            toDoStatus = changeToDoState(e.target, 1);
            break;
            //切换至已完成
        case e.target.getAttribute("status") == 2:
            toDoStatus = changeToDoState(e.target, 2);
            break;
            //删除待办
        case e.target.className == "item-del":
            changeToDoItemState(e.target, 'delete');
            break;
            //撤销待办
        case e.target.className == "item-cancel":
            changeToDoItemState(e.target, 'cancel');
            break;
            //清空已完成内容
        case e.target.id == "clearToDo":
            clearToDoItem()
            break;
    }
});

// 监听文件上传change事件设置背景图片
scrollContent.addEventListener("change", function (e) {
    let setBackGround = document.querySelector("#setBackGround");
    if (e.target == setBackGround) {
        setCustomizeImage(setBackGround);
    }
    if (e.target.parentNode.className == "advanced-settings-input") {
        customFillet(e.target.value);
        setStorage("uistyle", "null");
    }
})

// 阻止消息提示事件冒泡
messageList.addEventListener("click", (e) => {
    stopPropagation();
})

// 监听常用网址中相关操作
commonUse.addEventListener("click", (e) => {
    // 添加网址
    if (e.target.className == "commons-addbtn") {
        openDialog({
            title: "添加常用网址",
            option: {
                type: "form",
                content: [{
                    name: "名称",
                    value: "name",
                    type: "input",
                    defaultValue: ""
                }, {
                    name: "URl",
                    value: "url",
                    type: "input",
                    defaultValue: ""
                }]
            },
            button: [{
                name: "确定",
                value: "submit"
            }, {
                name: "取消",
                value: "cancel"
            }]
        })
    }
    // 编辑网址
    if (e.target.className == "commons-btn") {
        changeWebsiteUrl = e.target.parentNode.querySelector("a");
        openDialog({
            id: changeWebsiteUrl.id,
            title: "修改常用网址",
            option: {
                type: "form",
                content: [{
                    name: "名称",
                    value: "name",
                    type: "input",
                    defaultValue: changeWebsiteUrl.innerHTML
                }],
            },
            button: [{
                name: "修改",
                value: "change"
            }, {
                name: "删除",
                value: "delete"
            }, {
                name: "取消",
                value: "cancel"
            }]
        })
    }
})

/*
    事件监听/事件委托相关结束
 */


/*
    键盘监听事件
 */
//监听按下键盘事件，实现按下Enter跳转搜索
keyEvent(sug);

/*
    键盘监听事件结束
 */


/*
    错误监听开始
 */
windowError();
/*
    错误监听结束
 */