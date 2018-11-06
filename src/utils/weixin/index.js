import url from '../url'
import Ajax from '../ajax'
import Cookie from '../cookie'
import wx from 'weixin-js-sdk'

let cookie,ajax,$config;

/**
 * 注入微信配置信息
 */
function wxConfig(){
    ajax.post('/article/share', {
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
 * 获取code
 */
function getCode(weChatId){
    ajax.post('/weChat/getAppId',{
        weChatId: weChatId
    }).then((data)=> {
        let _rs = data.content;
        if(_rs.appId){
            let jumpUrl = $config.wx.oAuth.weChatAuthProxy+ '?proUrl=' + encodeURIComponent(url.urlDelete('code'));

            let href = [
                'https://open.weixin.qq.com/connect/oauth2/authorize?appid=',
                _rs.appId,
                '&redirect_uri=',
                encodeURIComponent(jumpUrl),
                '&response_type=code&scope=',
                $config.wx.oAuth.isSilentAuthorise ? 'snsapi_base' : 'snsapi_userinfo',
                '&state=',
                '&component_appid=',
                $config.wx.oAuth.componentAppId
            ];
            href.push('#wechat_redirect');
            window.location.href = href.join('');
        }
    })
}
/**
 * 获取openId
 */
function getOpenId(code){
    return ajax.post('/contact/getByCode', {
        weChatId: $config.wx.weChatId,
        code: code
    });
}
/**
 * 通过openId获取用户信息
 */
function getUser(weChatId, openId){
    return ajax.post('/member/loginByOpenId', {
        weChatId: weChatId,
        openId: openId
    });
}



class WeiXin {
    constructor(config){
        cookie = new Cookie(config);
        ajax = new Ajax(config);
        $config = config;
        wxConfig();
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
            if(cookie.getCookie('openId')){
                getUser($config.wx.weChatId, cookie.getCookie('openId')).then((data)=>{
                    resolve(data.content)
                })
            }else if(url.urlParams('code')){
                getOpenId(url.urlParams('code')).then((data)=> {
                    let _rs = data.content;
                    if(_rs){
                        cookie.setCookie('openId', _rs.openId);
                        getUser($config.wx.weChatId, cookie.getCookie('openId')).then((data)=> {
                            resolve(data.content)
                        })
                    }else{
                        getCode($config.wx.weChatId);
                    }
                })
            }else{
                getCode($config.wx.weChatId);
            }
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