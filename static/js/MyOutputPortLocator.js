var MyOutputPortLocator = draw2d.layout.locator.PortLocator.extend({
    NAME:"MyOutputPortLocator",
    init:function( ){
      this._super();
    },
    relocate:function(index, figure){
        var p = figure.getParent();
        this.applyConsiderRotation(figure, p.getWidth()/2, p.getHeight());
    }
});
