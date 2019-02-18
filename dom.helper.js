class DomHelper {
    searchChildrenByTagName(dom, tag) {
        let res =  null;
        if(dom.children && dom.children.length > 0) {
            for(let i = 0; i < dom.children.length; i++ ) {
                if(dom.children[i].tagName == tag) {
                    res = dom.children[i];
                    // break;
                    return res;
                }
                if(!res && dom.children[i].children.length > 0) {
                    return this.searchChildrenByTagName(dom.children[i], tag)
                }
            } 
        }
        return res? res: null;
    }
}
let domHelper = new DomHelper();
export { domHelper }