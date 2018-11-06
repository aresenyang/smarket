import axios from 'axios'
import Cookie from '../cookie'

class Ajax {
    constructor(config){
        /* 初始化 cookie */
        this.cookie = new Cookie(config)

        /**
         * 初始化 ajax
         */
        this.ajax = axios.create({
            baseURL: config.api
        });

        /**
         * 拦截 ajax 请求
         */
        this.ajax.interceptors.request.use((request)=> {
            request.data.globalUserId = this.getGlobalUserId();
            return request;
        });

        /**
         * 拦截 ajax 响应
         */
        this.ajax.interceptors.response.use((response)=> {
            return response.data.body;
        });
    }
    /**
     * 获取 globalUserId
     */
    getGlobalUserId(){
        if(this.cookie.getCookie('globalUserId')){
            return this.cookie.getCookie('globalUserId')
        }else{
            let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c)=>{
                let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
            uuid = uuid.replace(/-/g,'');
            this.cookie.setCookie('globalUserId',uuid);
            return uuid
        }
    }
}

export default Ajax