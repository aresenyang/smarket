import Cookie from './utils/cookie'
import wx from 'weixin-js-sdk'
import Ajax from './utils/ajax'
import url from './utils/url'
import WeiXin from './utils/weixin'

class Smarket {
    constructor(config){
        this.config = config;
        this.cookie = new Cookie(config);
        this.wx = wx;
        this.ajax = (new Ajax(config)).ajax;
        this.url = url;
        this.weixin = new WeiXin(config)
    }
}

export default Smarket