export default {
    /**
     * 读取url参数
     */
    urlParams(ref) {
        let rs = {},
            href = window.location.href,
            index = href.indexOf("?");
        if(index>0){
            let str = href.slice(index+1),
                arr = str.split("&");
            for (let i=0;i<arr.length;i++){
                rs[arr[i].split("=")[0]] = arr[i].split("=")[1]
            }
        }
        return rs[ref];
    },
    /**
     * 删除url中的参数
     */
    urlDelete(ref){
        let url = window.location.href;
        if (url.indexOf(ref) == -1){
            return url;
        }
        let arr_url = url.split('?');
        let base = arr_url[0];
        let arr_param = arr_url[1].split('&');
        let index = -1;
        for (let i = 0; i < arr_param.length; i++) {
            let paired = arr_param[i].split('=');
            if (paired[0] == ref) {
                index = i;
                break;
            }
        }
        if (index == -1) {
            return url;
        } else {
            arr_param.splice(index, 1);
            return base + "?" + arr_param.join('&');
        }
    },
    /**
     * 增加/修改
     */
    urlPut(ref, value) {
        let url = window.location.href;
        // 如果没有参数
        if (url.indexOf('?') == -1){
            return url + "?" + ref + "=" + value;
        }
        // 如果不包括此参数
        if (url.indexOf(ref) == -1){
            return url + "&" + ref + "=" + value;
        }
        let arr_url = url.split('?');
        let base = arr_url[0];
        let arr_param = arr_url[1].split('&');
        for (let i = 0; i < arr_param.length; i++) {
            let paired = arr_param[i].split('=');
            if (paired[0] == ref) {
                paired[1] = value;
                arr_param[i] = paired.join('=');
                break;
            }
        }
        return base + "?" + arr_param.join('&');
    }
};