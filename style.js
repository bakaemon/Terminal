function applyDynamicStyle(css) {
    var styleTag = document.createElement('style');
    var dynamicStyleCss = document.createTextNode(css);
    styleTag.appendChild(dynamicStyleCss);
    var header = document.getElementsByTagName('head')[0];
    header.appendChild(styleTag);    
};

applyDynamicStyle('.log { color: pink; }');