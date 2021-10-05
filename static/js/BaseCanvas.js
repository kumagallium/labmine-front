var BaseCanvas = draw2d.Canvas.extend({
    NAME:"BaseCanvas",
    init: function(canvasId, width, height){
      this._super(canvasId, width, height);

      this.installEditPolicy(new draw2d.policy.canvas.SnapToGridEditPolicy(25));
      this.installEditPolicy(new draw2d.policy.connection.DragConnectionCreatePolicy({
        createConnection: function() {
          return new draw2d.Connection({
            outlineStroke: 0,
            stroke: 2,
            radius: 5,
            alpha:0.5,
            color: "#aaa",
            router: new draw2d.layout.connection.ManhattanConnectionRouter(),
            targetDecorator: new draw2d.decoration.connection.ArrowDecorator()
          })
        }
      }));
    }
});
