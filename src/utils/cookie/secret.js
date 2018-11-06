export default {
    /**
     * 加密
     * @param {需要加密的字符串} code 
     */
    compile(code){ 
        let c=String.fromCharCode(code.charCodeAt(0)+code.length);
        for(let i=1;i<code.length;i++){
            c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));
        }
        return escape(c)
    },
    /**
     * 解密
     * @param {需要解密的字符串} code 
     */
    uncompile(code){
        code=unescape(code);
        let c=String.fromCharCode(code.charCodeAt(0)-code.length);
        for(let i=1;i<code.length;i++){
            c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));
        }
        return c;
    }
}