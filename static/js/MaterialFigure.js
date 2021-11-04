var MaterialFigure = draw2d.shape.basic.Rectangle.extend({
    NAME:"MaterialFigure",
    init : function( attr, setter, getter)
    {
        this._super( attr, setter, getter);

        var show=function(){this.setVisible(true);};
        var hide=function(){this.setVisible(false);};

        var output= this.createPort("output",new MyOutputPortLocator());

        output.on("connect",show,output);
        output.on("disconnect",show,output);
        output.setRadius(6);
        output.setStroke(0);
        output.setBackgroundColor("#4169e1");
        output.setUserData({"is_data":false,"is_done":false})

        this.alpha = 0.7;
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
            labelJSON.margin=e.locator.margin;
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
            var margin =  eval(json.margin);
            var locator =  eval("new "+json.locator+"({margin:"+margin+"})");
            this.add(figure, locator);
        },this));
    }
});
