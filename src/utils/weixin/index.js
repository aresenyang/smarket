import url from '../url'
import Cookie from '../cookie'
import Assist from './assist'

let cookie,$config,assist;

class WeiXin {
    constructor(config){
        cookie = new Cookie(config);
        $config = config;
        assist = new Assist(config)
        
        /**
         * 是否在微信
         */
        this.inWeChat = window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger'
    }

    /**
     * 初始化微信授权
     */
    ready(){
        return new Promise((resolve, reject)=>{
            assist.wxConfig().then(()=>{
                if(cookie.getCookie('openId')){
                    assist.getUser($config.wx.weChatId, cookie.getCookie('openId')).then((data)=>{
                        resolve(data.content)
                    })
                }else if(url.getParam('code')){
                    assist.getOpenId(url.getParam('code')).then((data)=> {
                        let _rs = data.content;
                        if(_rs){
                            cookie.setCookie('openId', _rs.openId);
                            assist.getUser($config.wx.weChatId, cookie.getCookie('openId')).then((data)=> {
                                resolve(data.content)
                            })
                        }else{
                            assist.getCode($config.wx.weChatId);
                        }
                    })
                }else{
                    assist.getCode($config.wx.weChatId);
                }
            });
        })
        
    }

    /**
     * 微信分享
     */
    initWeChatShare(options){
        /** 分享到朋友圈 */
        wx.onMenuShareTimeline({
            title: options.title, // 分享标题
            link: options.link, // 分享链接
            imgUrl: options.imgUrl, // 分享图标
            success() {
                // 用户确认分享后执行的回调函数
                options.shareSuccessCallback();
            }
        });

        /** 分享给朋友 */
        wx.onMenuShareAppMessage({
            title: options.title, // 分享标题
            desc: options.desc, // 分享描述
            link: options.link, // 分享链接
            imgUrl: options.imgUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success() {
                // 用户确认分享后执行的回调函数
                options.shareSuccessCallback();
            },
            cancel() {
                // 用户取消分享后执行的回调函数
                options.shareCancelCallback;
            }
        });

        /** 分享到QQ */
        wx.onMenuShareQQ({
            title: options.title, // 分享标题
            desc: options.desc, // 分享描述
            link: options.link, // 分享链接
            imgUrl: options.imgUrl, // 分享图标
            success() {
                // 用户确认分享后执行的回调函数
                options.shareSuccessCallback();
            }
        });

        /** 分享到腾讯微博 */
        wx.onMenuShareWeibo({
            title: options.title, // 分享标题
            desc: options.desc, // 分享描述
            link: options.link, // 分享链接
            imgUrl: options.imgUrl, // 分享图标
            success() {
                // 用户确认分享后执行的回调函数
                options.shareSuccessCallback();
            }
        });

        /** 分享到QQ空间 */
        wx.onMenuShareQZone({
            title: options.title, // 分享标题
            desc: options.desc, // 分享描述
            link: options.link, // 分享链接
            imgUrl: options.imgUrl, // 分享图标
            success() {
                // 用户确认分享后执行的回调函数
                options.shareSuccessCallback();
            }
        });
    }

    /**
     * 取消分享功能
     */
    noShare(){
        let onBridgeReady = ()=> {
            WeixinJSBridge.call('hideOptionMenu');
        };
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        } else {
            onBridgeReady();
        }
    }
}

export default WeiXin;