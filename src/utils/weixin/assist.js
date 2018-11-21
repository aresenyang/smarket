import url from '../url'
import Ajax from '../ajax'
import wx from 'weixin-js-sdk'

let ajax,$config;
class Assist{
    constructor(config){
        $config = config;
        ajax = new Ajax(config);
    }
    wxConfig(){
        ajax.post('/article/share', {
            url: window.location.href.split('#')[0]
        }).then((data)=> {
            let _rs = data.body.content;
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
    getCode(weChatId){
        ajax.post('/weChat/getAppId',{
            weChatId: weChatId
        }).then((data)=> {
            let _rs = data.body.content;
            if(_rs.appId){
                let jumpUrl = $config.wx.oAuth.weChatAuthProxy+ '?proUrl=' + encodeURIComponent(url.delParam('code'));
    
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
    getOpenId(code){
        return ajax.post('/contact/getByCode', {
            weChatId: $config.wx.weChatId,
            code: code
        });
    }
    /**
     * 通过openId获取用户信息
     */
    getUser(weChatId, openId){
        return ajax.post('/member/loginByOpenId', {
            weChatId: weChatId,
            openId: openId
        });
    }
}

export default Assist