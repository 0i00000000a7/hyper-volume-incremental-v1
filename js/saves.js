"use strict";

const VERSION = 10
var formatsave = {
    encoder: new TextEncoder(),
    decoder: new TextDecoder(),
    startString: 'Multi-dimensional-Volume-SaveeyJkeWdtaml1c2hpZ2VkYXNoYWJpIjoiIiw',
    endString: 'LCJodWl5YW5neWVzaGkiOnRydWV9End-Of-Multi-dimensional-Volume-Save',
    steps: [
        {
            encode: JSON.stringify,
            decode: JSON.parse
        },
        {
            encode: x => formatsave.encoder.encode(x),
            decode: x => formatsave.decoder.decode(x)
        },
        {
            encode: x => pako.deflate(x),
            decode: x => pako.inflate(x)
        },
        {
            encode: x => Array.from(x).map(i => String.fromCharCode(i)).join(""),
            decode: x => Uint8Array.from(Array.from(x).map(i => i.charCodeAt(0)))
        },
        {
            encode: x => btoa(x),
            decode: x => atob(x)
        },
        {
            encode: x => x.replace(/=+$/g, "").replace(/0/g, "0a").replace(/\+/g, "0b").replace(/\//g, "0c"),
            decode: x => x.replace(/0b/g, "+").replace(/0c/g, "/").replace(/0a/g, "0")
        },
        {
            encode: x => x.replace("d","&"),
            decode: x => x.replace("&","d")
        },
        {
            encode: x => x.replace("8","`"),
            decode: x => x.replace("`","8")
        },
        {
            encode: x => formatsave.startString + x + formatsave.endString,
            decode: x => x.slice(formatsave.startString.length, -formatsave.endString.length),
        }
    ],
    encode(s) {
        return this.steps.reduce((x, f) => f.encode(x), s);
    },
    decode(s) {
        return this.steps.reduceRight((x, f) => f.decode(x), s);
    },
}
function reverseString(input) {
    let charArray = input.split('');
    charArray.reverse();
    return charArray.join('');
}

function encodeBase64(input) {
    let str = typeof input === 'string' ? input : String(input);
    return btoa(unescape(encodeURIComponent(str)));
}

function decodeBase64(input) {
    var encoded = typeof input === 'string' ? input : String(input);
    return decodeURIComponent(escape(atob(encoded)));
}

function export_copy(pure) {
    return navigator.clipboard.writeText(formatsave.encode(player))

}

function export_file() {
    let str = formatsave.encode(player)
    let file = new Blob([str], {type: "text/plain"})
    window.URL = window.URL || window.webkitURL;
    let a = document.createElement("a")
    a.href = window.URL.createObjectURL(file)
    a.download = "Volume Incremental Save - " + getCurrentBeijingTime() + ".txt"
    a.click()
    return navigator.clipboard.writeText(formatsave.encode(player));

}

function getCurrentBeijingTime() {
    const now = new Date();
    const utcYear = now.getUTCFullYear();
    const utcMonth = String(now.getUTCMonth() + 1).padStart(2, '0');
    const utcDate = String(now.getUTCDate()).padStart(2, '0');
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    const utcSeconds = now.getUTCSeconds();
    const utcMilliseconds = now.getUTCMilliseconds();
    let beijingHours = (utcHours + 8) % 24;
    if (beijingHours < 0) {
        now.setUTCDate(now.getUTCDate() + 1);
        beijingHours += 24;
    }

    return `${utcYear}-${utcMonth}-${utcDate} ${beijingHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}:${utcSeconds.toString().padStart(2, '0')}.${utcMilliseconds.toString().padStart(3, '0')}`;
}

function handle_export(save2) {
    let importing_player = formatsave.decode(save2);
    Object.assign(player, importing_player)
    fix();
    console.clear()
}
function importFromApp(){
    handle_export(app.save)
}
function import_save() {
    openPopup(1)

}
function fast_hard_reset(){

    setTimeout(()=>{hard_reset();
        location.href = location.href;},100)

}
function formated_hard_reset() {
    let redeem = prompt("您确定要硬重置吗？输入以下文字确认，此操作无法取消!："+
    "Did you think i am a sb? \n\n\na?")
    if (redeem === "Did you think i am a sb?" ||
        (app.developer_mode && redeem === "a")){
        hard_reset();
        location.href = location.href;
    }

    /*$("[data-ok-modal]").text("确认");
    modal.showModal();*/
}

function import_file() {
    let a = document.createElement("input")
    a.setAttribute("type", "file")
    a.click()
    a.onchange = () => {
        let fr = new FileReader();
        fr.onload = () => {
            let save2 = fr.result
            handle_export(save2);
            //transformToE(importing_player);
            Object.assign(player, importing_player)
            fix();
            console.clear()
        }
        fr.readAsText(a.files[0]);
    }
}

function save() {
    localStorage.setItem("volume-incremental", JSON.stringify(player))
    localStorage.setItem("developerSettings", JSON.stringify(developer))
}
