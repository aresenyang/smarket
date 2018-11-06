export default {
    /**
     * 格式化所有 cookie
     */
    format(){
        let arr = document.cookie.split(';'),obj={};
        for(let i=0;i<arr.length;i++){
            arr[i] = arr[i].trim().split('=')
            obj[arr[i][0]]=arr[i][1];
        }
        return obj;
    }
}