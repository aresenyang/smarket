import url from '../url'
import Ajax from '../ajax'
import Cookie from '../cookie'
import wx from 'weixin-js-sdk'

class WeiXin {
    constructor(config){
        this.cookie = new Cookie(config);
        this.ajax = (new Ajax(config)).ajax;
        this.config = config;
        this.wxConfig();
        /**
         * 是否在微信
         */
        this.inWeChat = window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger'
    }

    /**
     * 注入微信配置信息
     */
    wxConfig(){
        this.ajax.post('/article/share', {
            url: window.location.href.split('#')[0]
        }).then((data)=> {
            let _rs = data.content;
            _rs.jsApiList =  [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'scanQRCode',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'hideAllNonBaseMenuItem',
                'checkJsApi',
                'hideMenuItems',
                'showMenuItems'
            ];
            wx.config(_rs);
        });
    }


    /**
     * 初始化微信授权
     */
    ready(){
        return new Promise((resolve, reject)=>{
            if(this.cookie.getCookie('openId')){
                this.getUser(this.config.wx.weChatId, this.cookie.getCookie('openId')).then((data)=>{
                    resolve(data.content)
                })
            }else if(url.urlParams('code')){
                this.getOpenId(url.urlParams('code')).then((data)=> {
                    let _rs = data.content;
                    if(_rs){
                        this.cookie.setCookie('openId', _rs.openId);
                        this.getUser(this.config.wx.weChatId, this.cookie.getCookie('openId')).then((data)=> {
                            resolve(data.content)
                        })
                    }else{
                        this.getCode(this.config.wx.weChatId);
                    }
                })
            }else{
                this.getCode(this.config.wx.weChatId);
            }
        })
        
    }
    /**
     * 获取code
     */
    getCode(weChatId){
        this.ajax.post('/weChat/getAppId',{
            weChatId: weChatId
        }).then((data)=> {
            let _rs = data.content;
            if(_rs.appId){
                let jumpUrl = this.config.wx.oAuth.weChatAuthProxy+ '?proUrl=' + encodeURIComponent(url.urlDelete('code'));

                let href = [
                    'https://open.weixin.qq.com/connect/oauth2/authorize?appid=',
                    _rs.appId,
                    '&redirect_uri=',
                    encodeURIComponent(jumpUrl),
                    '&response_type=code&scope=',
                    this.config.wx.oAuth.isSilentAuthorise ? 'snsapi_base' : 'snsapi_userinfo',
                    '&state=',
                    '&component_appid=',
                    this.config.wx.oAuth.componentAppId
                ];
                href.push('#wechat_redirect');
                window.location.href = href.join('');
            }
        })
    }
    /**
     * 获取openId
     */
    getOpenId(code){
        return this.ajax.post('/contact/getByCode', {
            weChatId: this.config.wx.weChatId,
            code: code
        });
    }
    /**
     * 通过openId获取用户信息
     */
    getUser(weChatId, openId){
        return this.ajax.post('/member/loginByOpenId', {
            weChatId: weChatId,
            openId: openId
        });
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
                options.shareSuccessCallback;
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
                options.shareSuccessCallback;
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
                options.shareSuccessCallback;
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
                options.shareSuccessCallback;
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
                options.shareSuccessCallback;
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