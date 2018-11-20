import $secret from './secret'
import $assist from './assist'

let cookie;
class Cookie {
    constructor(config){
        cookie = config.cookie;
    }
    /**
     * 存储/修改 cookie
     * @param {*} key 
     * @param {*} value 
     * @param {存储时间 可以不传} time 
     */
    setCookie(key, value, options){
        let val = JSON.stringify(value);
        let time = cookie.setData.expires;
        let domain = cookie.setData.domain;
        if(typeof options == 'object'){
            if(options.expires){
                time = options.expires
            }
            if(options.domain){
                domain = options.domain
            }
        }
        let d = new Date();
        d.setTime(d.getTime()+(time*24*60*60*1000));
        let expires = "expires="+d.toGMTString();
        document.cookie = `${key}=${$secret.compile(val)}; expires=${expires}; domain=${domain};path=/`
    }

    /**
     * 获取 cookie
     * @param {*} key 
     */
    getCookie(key){
        let $val = $assist.format()[key];
        if($val){
            let v = $secret.uncompile($val);
            let val = JSON.parse(v);
            return val
        }
    }

    /**
     * 删除 cookie
     * @param {*} key 
     */
    delCookie(key){
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
}

export default Cookie