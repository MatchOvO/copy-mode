// setting
const defaultConfig = {
    version: "0.0.0.2",
    mode: false,
}

// DOM
const modeSwitch = document.querySelector('#modeSwitch');
const modeSwitch_ball = document.querySelector('#modeSwitch .ball')
const resetBtn = document.querySelector('#reset')
const checkUpdateBtn = document.querySelector('#checkUpdate')
const chenzsBtn = document.querySelector('#chenzsBtn')
const websiteBtn = document.querySelector('#websiteBtn')
// fun
function switchOn() {
    defaultConfig.mode = true
    modeSwitch.style.backgroundColor = "rgb(101,196,102)"
    modeSwitch_ball.style.left = "50%"
    modeSwitch_ball.style.boxShadow = "-1px 0 5px rgb(31, 31, 31)"
}
function switchOff() {
    defaultConfig.mode = false
    modeSwitch.style.backgroundColor = "rgb(233, 233, 235)"
    modeSwitch_ball.style.left = "0"
    modeSwitch_ball.style.boxShadow = "1px 0 5px rgb(31, 31, 31)"
}
function sendRequest(url) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
                url
            }
        )
    })
}
function sendAjax(url) {
    return new Promise((resolve,reject)=>{
        const xhr = new XMLHttpRequest()
        xhr.open('GET',url)
        xhr.send()
        xhr.responseType = 'json'
        xhr.onreadystatechange = ()=>{
            if(xhr.readyState === 4){
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response)
                }
            }
        }
    })
}
// bind
modeSwitch.onclick = ()=>{
    if (defaultConfig.mode == false) {
        switchOn()
        sendRequest('modeOn')
    } else {
        switchOff()
        sendRequest('modeOff')
    }
}
resetBtn.onclick = ()=>{
    sendRequest('reload')
    switchOff()
}
checkUpdateBtn.onclick = ()=>{
    async function main() {
        try{
            const response = await sendAjax('http://www.chenzs.com/api/copy-mode/checkUpdate')
            const newVersion = response.data
            if (newVersion == defaultConfig.version) {
                alert(`- 当前版本已是最新版本: V${newVersion}`)
            }else{
                alert(`- 检查到新版本: V${newVersion} \n- 当前版本: V${defaultConfig.version}\n- 可前往官网或扩展商店获取最新版本`)
            }
        }catch (err) {
            console.log('fail to check')
        }
    }
    main()
}
chenzsBtn.onclick = ()=>{
    sendRequest('https://www.chenzs.com')
}
websiteBtn.onclick = ()=>{
    sendRequest('https://www.chenzs.com/weblog/works/copy-mode/index.html')
}
// recive
sendRequest('checkMode')
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.url == 'on') {
        defaultConfig.mode = true
        switchOn()
        sendResponse({ fromecontent: "copy mode is on" }) 
    } else if (request.url == 'off') {
        defaultConfig.mode = false
        switchOff()
        sendResponse({ fromecontent: "copy mode is off" })
    }else if (request.url == 'close') {
        window.close()
        sendResponse({ fromecontent: "window is close" })
    }
})




