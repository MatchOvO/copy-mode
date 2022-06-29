chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
    if(request.url == ''){
    }else if (request.url == 'modeOn') {
        document.designMode = 'on'
        console.log('copy mode is on')
        sendResponse({ fromecontent: "copy mode is on" })
    }else if (request.url == 'modeOff') {
        document.designMode = 'off'
        sendResponse({ fromecontent: "copy mode is off" })
        console.log('copy mode is off')
    }else if(request.url == 'checkMode') {
        if(document.designMode == 'on'){
            chrome.runtime.sendMessage({ url: 'on' })
            sendResponse({ fromecontent: "copy mode is on" })
        }else{
            chrome.runtime.sendMessage({ url: 'off' })
            sendResponse({ fromecontent: "copy mode is off" })
        }
    }else if(request.url == 'reload'){
        window.location.reload(true)
    }else if(/^(http:\/\/)|^(https:\/\/)/.test(request.url)){
        chrome.runtime.sendMessage({ url: 'close' })
        window.open(request.url)
    }else{
        sendResponse({ fromecontent: "nonsense url" })
        // console.log('nonsense url')
    }
})

