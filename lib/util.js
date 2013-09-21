/*global window:true*/
window.util = (function(){
    function merge(target){
        var continuation = {};
        function and(options){
            for (var key in options) {
                target[key] = options[key];
            }
            return continuation;
        }
        continuation.and = and;
        return continuation;
    }

    return {
        merge: merge
    };
})();
