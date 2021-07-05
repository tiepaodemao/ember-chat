// 接收和发生的消息保存类
class Message{
    constructor(msg, createTime,direction) {
        this.createTime = createTime;
        this.msg = msg;
        this.direction = direction;
    }
}
Vue.component('chat-frame', {
    template: '<h1>自定义组件!</h1>'
})

let app = new Vue({
    el: '#app',
    data: {
        username: "张三",
        message: "",
        websocket: null,
        isLogin: false,
        pattern:true,
        messageList: {},
        sendMessage:"",
        activeName: "",
        contactList: [],
        toastShow: false
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
            if (this.username != "") {
                this.isLogin = true;
                this.getOnLine();
                let websocket = new WebSocket("ws://localhost:8081/chat/" + this.username);
                websocket.onopen = this.onopen;
                websocket.onmessage = this.onmessage;
                // websocket.close()
                this.websocket = websocket;
            }
        },
        onopen: function () {
            this.toast("连接成功")
        },
        onmessage:function (ev){
            let message = JSON.parse(ev.data);
            console.log(message);
            let user = message['user'];
            switch (message.msgType){
                // 私发
                case 0:
                    let msg = new Message(message['message'],new Date(),1);
                    this.messageList[message['user']['name']].push(msg);
                    this.scroll();
                    break;
                // 1上线提醒
                case 1:
                    this.contactList.push(user);
                    this.$set(this.messageList,user['name'],[]);
                    if (this.activeName === ""){// 如果发送对象没选择就默认选择这个
                        this.activeName = user['name']
                    }
                    this.toast(message['message'])
                    break;
                // 2下线提醒
                case 2:
                    this.$delete(this.messageList,user['name']);
                    for (let i = 0; i < this.contactList.length; i++) {
                        if (this.contactList[i]['name'] === user['name']){
                            this.$delete(this.contactList,i);
                        }
                    }
                    this.toast(message['message'])
                    if (this.contactList.length === 0){
                        this.activeName = ""
                    }else {
                        this.activeName = this.contactList[0]
                    }
                    break;
                //群聊
                case 3:

            }
        },
        getOnLine:function (){
            axios.get("/ws/getOnLine/"+this.username).then(res=>{
                let data = res.data;
                if (data != null && data.length>0){
                    this.contactList = data;
                    this.activeName = this.contactList[0]["name"]
                    data.forEach(item=>{
                        this.$set(this.messageList,item['name'],[]);
                    })
                }
            })
        },
        onclick:function (username){
            this.activeName = username
            console.log(this.activeName)
            console.log(username)
        },
        send:function (){
            if (this.activeName === ""){
                this.toast("当前没有在线的用户")
            }else if (this.sendMessage === ""){
                this.toast("你得输入信息")
            }else {
                let senJson = {"toName":this.activeName,"message":this.sendMessage};
                this.messageList[this.activeName].push(new Message(this.sendMessage,new Date(),0));
                this.websocket.send(JSON.stringify(senJson));
                this.sendMessage = '';
                this.scroll();
                // this.$refs.chatContent.scrollTop = this.$refs.chatContent.scrollHeight;
            }
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
        }
    },
})