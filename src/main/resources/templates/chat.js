// 接收和发生的消息保存类
class Message{
    constructor(message,createTime,msgType,receiveUser,sendUser) {
        this.message = message;
        this.createTime = createTime;
        this.msgType = msgType;
        this.receiveUser = receiveUser;//接收方
        this.sendUser = sendUser;//发送方
    }
}
Vue.component('chat-frame', {
    template: '<h1>自定义组件!</h1>'
})

let app = new Vue({
    el: '#app',
    data: {
        user: {
            "name": "",
            "imageUrl":""
        },
        message: "",
        websocket: null,
        isLogin: false,
        pattern: true,
        messageList: {},
        sendMessage: "",
        activeUser: null,
        contactList: [],
        toastShow: false,
        chatRoom: []
    },
    mounted:function() {
        window.addEventListener('beforeunload', e => this.beforeunloadFn(e));
    },
    methods:{
        beforeunloadFn(e) {
            if (this.websocket!=null){
                this.websocket.close();
            }
        },
        toLogin:function() {
            if (this.user.name !== "") {
                this.isLogin = true;
                this.getOnLine();
                let websocket = new WebSocket("ws://localhost:8081/chat/" + this.user.name);
                websocket.onopen = this.onopen;
                websocket.onmessage = this.onmessage;
                this.websocket = websocket;
                this.user.imageUrl = "";
                this.activeUser = {"name":"李四","imageUrl": null};
                this.messageList = {"李四":[new Message("nh",new Date(),1,this.activeUser)]}
            }
        },
        onopen: function () {
            this.toast("连接成功")
        },
        onmessage:function (ev){
            let message = JSON.parse(ev.data);
            console.log(message);
            switch (message['msgType']){
                // 1上线提醒
                case 1:
                    this.contactList.push(message['sendUser']);
                    this.$set(this.messageList,message['sendUser']['name'],[]);
                    if (this.activeUser === null){// 如果发送对象没选择就默认选择这个
                        this.activeUser = message['sendUser']['name']
                    }
                    this.toast(message['message'])
                    break;
                // 2下线提醒
                case 2:
                    this.$delete(this.messageList,message['sendUser']['name']);
                    for (let i = 0; i < this.contactList.length; i++) {
                        if (this.contactList[i]['sendUser']['name'] === message['sendUser']['name']){
                            this.$delete(this.contactList,i);
                        }
                    }
                    this.toast(message['message'])
                    if (this.contactList.length === 0) {//无人在线就没人可选中
                        this.activeUser = null
                    }
                    if(this.activeUser['sendUser']['name'] === message['sendUser']['name']) {//当前聊天的那个人下线后选择第一个
                        this.activeUser = this.contactList[0]
                    }
                    break;
                // 私发
                case 3:
                    this.messageList[message['sendUser']['name']].push(message);
                    this.scroll();
                    break;
                // 群聊
                case 4:
                    this.chatRoom.push(message);
                    this.scroll();
                    break;
            }
        },
        getOnLine:function (){//获取当前在线的人
            axios.get("/ws/getOnLine/"+this.user.name).then(res=>{
                let data = res.data;
                if (data != null && data.length>0){
                    this.contactList = data;
                    this.activeUser = this.contactList[0]['name']
                    data.forEach(item=>{
                        this.$set(this.messageList,item['name'],[]);
                    })
                }
            })
        },
        onclick:function (user){
            this.activeUser = user
            console.log(this.activeUser)
            console.log(user)
        },
        send:function (){
            console.log("进入0");
            if (this.sendMessage === "") {
                this.toast("你得输入信息");
                return;
            }
            let msg;
            if (this.pattern){
                console.log("进入1");
                if (this.activeUser === null) {
                    this.toast("当前没有选中的用户")
                    return;
                } else {
                    this.messageList[this.activeUser].push(new Message(this.sendMessage, this.formatDate(), 0, this.activeUser, this.user));
                    msg = new Message(this.sendMessage, this.formatDate(), 3, this.activeUser, this.user);
                }
            } else {
                console.log("进入2");
                this.chatRoom.push(new Message(this.sendMessage, this.formatDate(), 0, this.activeUser, this.user));
                msg = new Message(this.sendMessage, this.formatDate(), 4, this.activeUser, this.user);
            }
            this.websocket.send(JSON.stringify(msg));
            this.sendMessage = "";
            this.scroll();
        },
        toast:function (message){
            this.message = message + ",吊毛";
            this.toastShow = true;
            let that = this;
            setTimeout(function(){
                that.toastShow = false;
                that.msg = "";
            },3000);
        },
        scroll:function (){
            this.messagesContainerTimer = setTimeout(()=>{
                this.$refs.chatContent.scrollTop = this.$refs.chatContent.scrollHeight;
                // 清理定时器
                clearTimeout(this.messagesContainerTimer);
            },0);
        },


        formatDate() {
            let date = new Date(new Date().getTime());
            let fmt = 'yyyy-MM-dd hh:mm:ss';
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 -
                    RegExp.$1.length))
            }
            let o = {
                'M+': date.getMonth() + 1,
                'd+': date.getDate(),
                'h+': date.getHours(),
                'm+': date.getMinutes(),
                's+': date.getSeconds()
            }
            for (let k in o) {
                if (new RegExp(`(${k})`).test(fmt)) {
                    let str = o[k] + ''// o[M+]----------->8
                    console.log(fmt)
                    console.log(RegExp.$1);//匹配到的第一个
                    fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str :
                        ('00' + str).substr(str.length))
                }
            }
            console.log(fmt)
            return fmt
        }
    },
})
//this.formatDate(new Date(new Date().getTime()), );//2017-09-09 17:02:56
