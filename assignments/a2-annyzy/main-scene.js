window.Cube = window.classes.Cube =
class Cube extends Shape                 // Here's a complete, working example of a Shape subclass.  It is a blueprint for a cube.
  { constructor()
      { super( "positions", "normals" ); // Name the values we'll define per each vertex.  They'll have positions and normals.

        // First, specify the vertex positions -- just a bunch of points that exist at the corners of an imaginary cube.
        this.positions.push( ...Vec.cast( [-1,-1,-1], [1,-1,-1], [-1,-1,1], [1,-1,1], [1,1,-1],  [-1,1,-1],  [1,1,1],  [-1,1,1],
                                          [-1,-1,-1], [-1,-1,1], [-1,1,-1], [-1,1,1], [1,-1,1],  [1,-1,-1],  [1,1,1],  [1,1,-1],
                                          [-1,-1,1],  [1,-1,1],  [-1,1,1],  [1,1,1], [1,-1,-1], [-1,-1,-1], [1,1,-1], [-1,1,-1] ) );
        // Supply vectors that point away from each face of the cube.  They should match up with the points in the above list
        // Normal vectors are needed so the graphics engine can know if the shape is pointed at light or not, and color it accordingly.
        this.normals.push(   ...Vec.cast( [0,-1,0], [0,-1,0], [0,-1,0], [0,-1,0], [0,1,0], [0,1,0], [0,1,0], [0,1,0], [-1,0,0], [-1,0,0],
                                          [-1,0,0], [-1,0,0], [1,0,0],  [1,0,0],  [1,0,0], [1,0,0], [0,0,1], [0,0,1], [0,0,1],   [0,0,1],
                                          [0,0,-1], [0,0,-1], [0,0,-1], [0,0,-1] ) );

                 // Those two lists, positions and normals, fully describe the "vertices".  What's the "i"th vertex?  Simply the combined
                 // data you get if you look up index "i" of both lists above -- a position and a normal vector, together.  Now let's
                 // tell it how to connect vertex entries into triangles.  Every three indices in this list makes one triangle:
        this.indices.push( 0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
                          14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22 );
        // It stinks to manage arrays this big.  Later we'll show code that generates these same cube vertices more automatically.
      }
  }

window.Transforms_Sandbox = window.classes.Transforms_Sandbox =
class Transforms_Sandbox extends Tutorial_Animation   // This subclass of some other Scene overrides the display() function.  By only
{ display( graphics_state )                           // exposing that one function, which draws everything, this creates a very small code
                                                      // sandbox for editing a simple scene, and for experimenting with matrix transforms.
    { let model_transform = Mat4.identity();      // Variable model_transform will be a temporary matrix that helps us draw most shapes.
                                                  // It starts over as the identity every single frame - coordinate axes at the origin.
      graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
      /**********************************
      Start coding down here!!!!
      **********************************/         // From here on down it's just some example shapes drawn for you -- freely replace them
                                                  // with your own!  Notice the usage of the functions translation(), scale(), and rotation()
                                                  // to generate matrices, and the functions times(), which generates products of matrices.

      const blue  = Color.of( 1,1,1,1 ), yellow = Color.of( 1,1,0,1 );

      model_transform = model_transform.times( Mat4.translation([ 0, 0, 0 ]) );
      let body = model_transform.times( Mat4.scale([2,2.5,2]));
      this.shapes.box.draw( graphics_state, body, this.plastic.override({ color: yellow }) );   // Draw the top box.

      const t = this.t = graphics_state.animation_time/1000;     // Find how much time has passed in seconds, and use that to place shapes.

      let head = Mat4.identity();
      head = body.times( Mat4.translation([ 0, 1.57, 0 ]) );
      head = head.times( Mat4.scale([0.7,0.55,0.7]));
      // Tweak our coordinate system downward for the next shape.
      this.shapes.ball.draw( graphics_state, head, this.plastic.override({ color: yellow }) );    // Draw the ball.

      let arm_joint1 = model_transform.times( Mat4.translation([ -2.15, 1.78, 0 ]) )
          .times( Mat4.scale([ 0.4, 0.4, 0.4 ]) );
      this.shapes.ball.draw( graphics_state, arm_joint1, this.plastic.override({ color: yellow }) );

      let arm_joint2 = model_transform.times( Mat4.translation([ 2.15, 1.78, 0 ]) )
          .times( Mat4.scale([ 0.4, 0.4, 0.4 ]) );
      this.shapes.ball.draw( graphics_state, arm_joint2, this.plastic.override({ color: yellow }) );

      let left_leg = model_transform.times( Mat4.translation([ -1, -4.5, 0 ]) )
                    .times(Mat4.scale([ 0.5, 2, 0.5 ]));
      this.shapes.box.draw( graphics_state, left_leg, this.plastic.override({ color: yellow }) );

      let right_leg = model_transform.times( Mat4.translation([ 1, -4.5, 0 ]) )
          .times(Mat4.scale([ 0.5, 2, 0.5 ]));
      this.shapes.box.draw( graphics_state, right_leg, this.plastic.override({ color: yellow }) );

      //
      if( !this.hover )     // The first line below won't execute if the button on the page has been toggled:
        model_transform = model_transform.times( Mat4.rotation( t, Vec.of( 0,1,0 ) ) )  // Spin our coordinate frame as a function of time.
        model_transform   = model_transform.times( Mat4.rotation( 1, Vec.of( 0,0,1 ) ) )  // Rotate another axis by a constant value.
                                         .times( Mat4.scale      ([ 1,   2, 1 ]) )      // Stretch the coordinate frame.
                                         .times( Mat4.translation([ 0,-1.5, 0 ]) );     // Translate down enough for the two volumes to miss.
      //this.shapes.box.draw( graphics_state, model_transform, this.plastic.override({ color: yellow }) );   // Draw the bottom box.
    }
}

window.Cube_Outline = window.classes.Cube_Outline =
class Cube_Outline extends Shape
  { constructor()
      { super( "positions", "colors" ); // Name the values we'll define per each vertex.

        //  TODO (Requirement 5).
        const white_c = Color.of(1, 1, 1, 1);

                                // When a set of lines is used in graphics, you should think of the list entries as
                                // broken down into pairs; each pair of vertices will be drawn as a line segment.
        this.positions.push(
            ...Vec.cast(
                [-1, -1, -1], [-1, 1, -1], //x-y plane back
                [-1, 1, -1] ,[-1, 1, 1],
                [-1, 1, 1]  ,[-1, -1, 1],
                [-1, -1, 1] ,[-1, -1, -1],

                [1, -1, 1]  ,[1, -1, -1], //x-y plane front
                [1, -1, -1] ,[1, 1, -1],
                [1, 1, -1]  ,[1, 1, 1],
                [1, 1, 1]   ,[1, -1, 1],

                [1, 1, -1]  ,[-1,1,-1], //y-z plane right
                [1, 1, 1]   ,[-1, 1, 1],

                [1, -1, 1]  ,[-1, -1, 1], //x-z plane top
                [1, -1, -1] ,[-1, -1, -1], //x-z plan bottom
                [-1,-1,-1]  ,[-1,1,-1],)
        );


        this.colors = [
          white_c, white_c, white_c, white_c, white_c, white_c, white_c, white_c,
          white_c,white_c, white_c, white_c, white_c, white_c,white_c,white_c,
          white_c,white_c, white_c, white_c, white_c, white_c,white_c,white_c,
          white_c,white_c,
        ];

        this.indexed = false;       // Do this so we won't need to define "this.indices".
      }
  }

window.Cube_Single_Strip = window.classes.Cube_Single_Strip =
class Cube_Single_Strip extends Shape
  { constructor()
      { super( "positions", "normals" );

        // TODO (Extra credit part I)
        this.positions.push(
            ...Vec.cast([1,-1,1],[1,-1,-1],[1,1,-1],[-1,1,-1],
                (-1,-1,1),(-1,-1,-1),(-1,1,-1),(-1,1,1),
                )
        );

        this.normals.push(
            ...Vec.cast([1,-1,1],[1,-1,-1],[1,1,-1],[-1,1,-1],
                (-1,-1,1),(-1,-1,-1),(-1,1,-1),(-1,1,1),
            )
        );

        this.indices.push( 5,6,1, 1,5,4, 4,5,7, 7,4,0, 0,4,1, 1,0,7, 3,0,7, 7,3,2, 2,3,1, 1,2,6, 6,2,7, 7,6,5);
      }
  }

window.Assignment_One_Scene = window.classes.Assignment_One_Scene =
class Assignment_One_Scene extends Scene_Component
  { constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        if( !context.globals.has_controls   )
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) );

        const r = context.width/context.height;
        context.globals.graphics_state.    camera_transform = Mat4.translation([ 5,-10,-30 ]);  // Locate the camera here (inverted matrix).
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

        const shapes = { 'box': new Cube(),               // At the beginning of our program, load one of each of these shape
                       'strip': new Cube_Single_Strip(),  // definitions onto the GPU.  NOTE:  Only do this ONCE per shape
                     'outline': new Cube_Outline() }      // design.  Once you've told the GPU what the design of a cube is,
        this.submit_shapes( context, shapes );            // it would be redundant to tell it again.  You should just re-use
                                                          // the one called "box" more than once in display() to draw
                                                          // multiple cubes.  Don't define more than one blueprint for the
                                                          // same thing here.

                                     // Make some Material objects available to you:
        this.clay   = context.get_instance( Phong_Shader ).material( Color.of( .9,.5,.9, 1 ), { ambient: .4, diffusivity: .4 } );
        this.white  = context.get_instance( Basic_Shader ).material();
        this.plastic = this.clay.override({ specularity: .6 });

        this.lights = [ new Light( Vec.of( 0,5,5,1 ), Color.of( 1, .4, 1, 1 ), 100000 ) ];

        this.set_colors();

        //create new variables for botton control;
        this.still_button = false;
        this.outline_button = false;
        this.color_button;

      }
    set_colors() {
          // TODO:  Create a class member variable to store your cube's colors.
        this.color_button =
                        [Color.of(Math.random(),Math.random(),Math.random(),1),
                        Color.of(Math.random(),Math.random(),Math.random(),1),
                        Color.of(Math.random(),Math.random(),Math.random(),1),
                        Color.of(Math.random(),Math.random(),Math.random(),1),
                        Color.of(Math.random(),Math.random(),Math.random(),1),
                        Color.of(Math.random(),Math.random(),Math.random(),1),
                        Color.of(Math.random(),Math.random(),Math.random(),1),
                        Color.of(Math.random(),Math.random(),Math.random(),1),]
      }
    make_control_panel()             // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
      { this.key_triggered_button( "Change Colors", [ "c" ], this.set_colors );    // Add a button for controlling the scene.
        this.key_triggered_button( "Outline",       [ "o" ], () => {

          // TODO:  Requirement 5b:  Set a flag here that will toggle your outline on and off
          this.outline_button=!this.outline_button;
          }
          );
        this.key_triggered_button( "Sit still",     [ "m" ], () => {

          // TODO:  Requirement 3d:  Set a flag here that will toggle your swaying motion on and off.
          this.still_button=!this.still_button;
          }
          );
      }
    draw_box( graphics_state, model_transform, boxes)
      {
        // TODO:  Helper function for requirement 3 (see hint).
        //        This should make changes to the model_transform matrix, draw the next box, and return the newest model_transform.
        const t = this.t = graphics_state.animation_time / 1000;
        const color = this.color_button[boxes];
        if(this.still_button)
        {
          //maximum angle of .04*Math.PI
          var rotate_angle = -0.04 * Math.PI;
        }
        else if(boxes === 0)
        {
          var rotate_angle = 0;
        }
        else
        {
          //0.02 is told by TA
          var rotate_angle = -0.02 * Math.PI - (0.02 * Math.PI * Math.sin(t*Math.PI*3) );
        }

        //if pressing outline button
        if(boxes === 0)
        {
          model_transform   = model_transform.times( Mat4.translation( [1, 1.5, 0] ) )
                                             .times( Mat4.rotation( rotate_angle, Vec.of(0, 0, 1 ) ) )
                                             .times( Mat4.translation([-1, 1.5, 0]) )
                                             .times( Mat4.scale([ 1, 1.5, 1 ]) );
          this.shapes.strip.draw (graphics_state, model_transform, this.plastic.override({ color }), "TRIANGLE_STRIP");
          model_transform = model_transform.times(Mat4.scale([ 1, 0.667, 1 ]));
        }
        else if(this.outline_button)
        {
          model_transform = model_transform.times( Mat4.translation([1, 1.5, 0] ) )
                                           .times( Mat4.rotation( rotate_angle, Vec.of(0, 0, 1 ) ) )
                                           .times( Mat4.translation([-1, 1.5, 0]) )
                                           .times( Mat4.scale([ 1, 1.5, 1 ]) );
          this.shapes.outline.draw( graphics_state, model_transform, this.white, "LINES" );
          model_transform = model_transform.times(Mat4.scale([ 1, 0.667, 1 ]));
        }
        else
        {
          model_transform   = model_transform.times( Mat4.translation( [1, 1.5, 0] ) )
                                             .times( Mat4.rotation(rotate_angle, Vec.of(0, 0, 1 ) ))
                                             .times( Mat4.translation([-1, 1.5, 0]) )
                                             .times( Mat4.scale([ 1, 1.5, 1 ]) );
          this.shapes.box.draw( graphics_state, model_transform, this.plastic.override({color}) );
          model_transform = model_transform.times(Mat4.scale([ 1, 0.667, 1 ]));
        }
        return model_transform;
      }

    display( graphics_state )
      { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.

        let model_transform = Mat4.identity();


        // TODO:  Draw your entire scene here.  Use this.draw_box( graphics_state, model_transform ) to call your helper.

        for(let i = 0; i < 8; i++)
        {
          model_transform = this.draw_box(graphics_state, model_transform, i);
        }
      }
  }
