var MyInputPortLocator = draw2d.layout.locator.PortLocator.extend({
    NAME:"MyInputPortLocator",
    init:function( ){
      this._super();
    },
    relocate:function(index, figure){
        this.applyConsiderRotation(figure, figure.getParent().getWidth()/2, 0);
    }
});
