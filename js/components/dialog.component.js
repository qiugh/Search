import {
    body
} from "../module/dom.constant.js";

//开启模态框函数
export const openDialog = (data) => {
    let [title, option, button, btns, content] = ["", "", "", "", ""];
    title = data.title !== undefined ? data.title : "提示"; //模态框标题
    option = data.option !== undefined ? data.option : {}; //模态框配置数据
    button = data.button !== undefined ? data.button : [{
        name: "取消",
        value: "cancel"
    }]; //模态框按钮
    if (option.type == "form") {
        option.content.forEach(item => {
            if (item.type == "input") {
                content += `
                    <div id="${item.value}Dialog">
                        <span class="content-label">${item.name}：</span>
                        <input placeholder="请输入${item.name}" value="${item.defaultValue}" />
                    </div>`;
            } else if (item.type == "text") {
                content += `
                    <div>
                        <span class="content-label">${item.name}：</span>
                        <p>${item.value}</p>
                    </div>`;
            }
        })
    } else if (option.type == "table") {
        content = data.content;
    } else {
        content = data.content;
    }
    button.forEach(item => {
        btns += `
            <span>
                <button id="${item.value}Dialog">${item.name}</button>
            </span>`
    })
    let dialog = `
        <div class="dialog" id="${data.id}">
            <div class="dialog-header">${title}<span id="closeDialog"><i class="fa fa-close"></i></span></div>
            <div class="dialog-body" style="height:${option.height};overflow:auto;">${content}</div>
            <div class="dialog-footer">${btns}</div>
        </div>`;
    let dialogWrapper = document.createElement("div");
    dialogWrapper.setAttribute("class", "dialogWrapper");
    dialogWrapper.innerHTML = dialog;
    body.appendChild(dialogWrapper);
}

//关闭模态框函数
export const closeDialog = (id) => {
    let dialog = document.querySelector(".dialogWrapper");
    dialog.classList.add("dialogWrapperClose");
    setTimeout(() => {
        dialog.remove();
    }, 500);
}