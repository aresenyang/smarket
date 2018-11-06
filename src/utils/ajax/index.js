import axios from 'axios'
import Cookie from '../cookie'

let ajax,cookie;
class Ajax {
    constructor(config){
        /* 初始化 cookie */
        cookie = new Cookie(config)

        /**
         * 初始化 ajax
         */
        ajax = axios.create({
            baseURL: config.api
        });

        /**
         * 拦截 ajax 请求
         */
        ajax.interceptors.request.use((request)=> {
            request.data.globalUserId = this.getGlobalUserId();
            return request;
        });

        /**
         * 拦截 ajax 响应
         */
        ajax.interceptors.response.use((response)=> {
            return response.data.body;
        });
    }

    /**
     * post
     * @param {*} url 
     * @param {*} data 
     */
    post(url, data){
        return new Promise((resolve, reject)=>{
            ajax.post(url,data).then(data=>{
                resolve(data)
            }).catch((data)=>{
                reject(data)
            })
        })
    }

    /**
     * get
     * @param {*} url 
     * @param {*} data 
     */
    get(url, data){
        return new Promise((resolve, reject)=>{
            ajax.get(url,data).then(data=>{
                resolve(data)
            }).catch((data)=>{
                reject(data)
            })
        })
    }

    /**
     * 获取 globalUserId
     */
    getGlobalUserId(){
        if(cookie.getCookie('globalUserId')){
            return cookie.getCookie('globalUserId')
        }else{
            let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c)=>{
                let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
            uuid = uuid.replace(/-/g,'');
            cookie.setCookie('globalUserId',uuid);
            return uuid
        }
    }
}

export default Ajax