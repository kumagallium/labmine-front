var PlanFigure = draw2d.shape.basic.Rectangle.extend({
    NAME:"PlanFigure",
    init : function( attr, setter, getter)
    {
        this._super( attr, setter, getter);

        this.alpha = 0.1;
        this.radius = 2;
        this.stroke = 0;
        this.color = new draw2d.util.Color("#555");
        this.width = 100;
        this.height = 25;
        //this.setGlow = false;

        //this.installEditPolicy(new draw2d.policy.figure.HorizontalEditPolicy());
        this.installEditPolicy(new draw2d.policy.figure.GlowSelectionFeedbackPolicy());
        this.installEditPolicy(new draw2d.policy.figure.DragDropEditPolicy({
          adjustPosition: function adjustPosition(figure, x, y) {
        	var newgrid = 50
            x = 25 * Math.round(x / 25);
            y = newgrid * Math.round(y / newgrid);

            return new draw2d.geo.Point(x, y);
          }
        }));
    },
    getPersistentAttributes : function()
    {
        var memento = this._super();
        memento.labels = [];
        this.children.each(function(i,e){
            var labelJSON = e.figure.getPersistentAttributes();
            labelJSON.locator=e.locator.NAME;
            memento.labels.push(labelJSON);
        });

        return memento;
    },
    setPersistentAttributes : function(memento)
    {
        this._super(memento);
        this.resetChildren();
        $.each(memento.labels, $.proxy(function(i,json){
            var figure =  eval("new "+json.type+"()");
            figure.attr(json);
            var locator =  eval("new "+json.locator+"()");
            this.add(figure, locator);
        },this));
    }
});
