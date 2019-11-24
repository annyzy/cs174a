window.Assignment_Three_Scene = window.classes.Assignment_Three_Scene =
    class Assignment_Three_Scene extends Scene_Component
    { constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
    { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
      if( !context.globals.has_controls   )
        context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) );

      context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,10,20 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );
      this.initial_camera_location = Mat4.inverse( context.globals.graphics_state.camera_transform );

      const r = context.width/context.height;
      context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

      const shapes = { torus:  new Torus( 15, 15 ),
        torus2: new ( Torus.prototype.make_flat_shaded_version() )( 15, 15 ),

        // TODO:  Fill in as many additional shape instances as needed in this key/value table.
        //        (Requirement 1)

        //Planet 1: Icy-gray, 2 subdivisions, flat shaded, diffuse only.
        s1: new ( Subdivision_Sphere.prototype.make_flat_shaded_version() )(2),

        //Planet 2: Swampy green-blue, 3 subdivisions, maximum specular, low diffuse.
        s2: new Subdivision_Sphere(3),

        //Planet 3: Muddy brown-orange, 4 subdivisions, maximum diffuse and specular.
        s3: new Subdivision_Sphere(4),

        //The moon has 1 subdivision, with flat shading, any material, and a small orbital distance around the planet.
        s4: new ( Subdivision_Sphere.prototype.make_flat_shaded_version() )(1),

        gridSphere: new ( Grid_Sphere.prototype.make_flat_shaded_version() ) (10, 10),

        treeBase: new ( Cylinder.prototype.make_flat_shaded_version() ) (10, 10)

      }
      this.submit_shapes( context, shapes );

      // Make some Material objects available to you:
      this.materials =
          { test:     context.get_instance( Phong_Shader ).material( Color.of( 1,1,0,1 ), { ambient:.2 } ),
            ring:     context.get_instance( Ring_Shader  ).material(),

            // TODO:  Fill in as many additional material objects as needed in this key/value table.
            //        (Requirement 1)
            sun:      context.get_instance( Phong_Shader ).material( Color.of(1,1,0,1), {ambient: 1} ),
            planet:   context.get_instance( Phong_Shader ).material( Color.of(1,1,1,1) ),
            planet1:  context.get_instance( Phong_Shader ).material( Color.of (0.42, 0.48, 0.55,1), {diffusivity: 1}),
            planet3:  context.get_instance( Phong_Shader ).material( Color.of(0.55, 0.27, 0.00, 1), {specularity: 1}, {diffusivity: 1}),
            planet4:  context.get_instance( Phong_Shader ).material( Color.of(0, 0.1, 0.6, 1), {specularity: 0.8}, {smoothness: 200}),
            ec3: context.get_instance( Phong_Shader ).material( Color.of(192/255, 192/255, 192/255, 1), {specularity: 1}, {diffusivity: 1}),
            tree_base: context.get_instance( Phong_Shader ).material( Color.of(0.48, 0.25, 0.00, 1), {ambient: 1}, {specularity: 1}, {diffusivity: 1})
    }

      this.lights = [ new Light( Vec.of( 5,-10,5,1 ), Color.of( 0, 1, 1, 1 ), 1000 ) ];

      this.attached = () => this.initial_camera_location;
    }
      make_control_panel()            // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
      { this.key_triggered_button( "View solar system",  [ "0" ], () => this.attached = () => this.initial_camera_location );
        this.new_line();
        this.key_triggered_button( "Attach to planet 1", [ "1" ], () => this.attached = () => this.planet_1 );
        this.key_triggered_button( "Attach to planet 2", [ "2" ], () => this.attached = () => this.planet_2 ); this.new_line();
        this.key_triggered_button( "Attach to planet 3", [ "3" ], () => this.attached = () => this.planet_3 );
        this.key_triggered_button( "Attach to planet 4", [ "4" ], () => this.attached = () => this.planet_4 ); this.new_line();
        this.key_triggered_button( "Attach to planet 5", [ "5" ], () => this.attached = () => this.planet_5 );
        this.key_triggered_button( "Attach to moon",     [ "m" ], () => this.attached = () => this.moon     );
        this.key_triggered_button( "Attach to planet 6", [ "6" ], () => this.attached = () => this.planet_6 );
      }
      display( graphics_state )
      { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;



        // TODO:  Fill in matrix operations and drawing code to draw the solar system scene (Requirements 2 and 3)

        //1. Place a spherical sun at the origin.
        let sun = Mat4.identity()
        let sun_center  = sun
        // var swelling_radius = 2 + Math.sin( ( (5/2) / 2) * t - (Math.PI/2))
        // var sun_blue = (1/2) - (1/2) * Math.sin( ( (5/2) / 2) * t - (Math.PI/2))
        // var sun_red = (1/2) + (1/2) * Math.sin( ( (5/2) / 2) * t - (Math.PI/2))

        var swelling_radius = 2 + Math.sin( ( (5/2) / 2) * t - (Math.PI/2))
        var sun_blue = (1/2) - (1/2) * Math.sin( ( (5/2) / 2) * t - (Math.PI/2))
        var sun_red = (1/2) + (1/2) * Math.sin( ( (5/2) / 2) * t - (Math.PI/2))
        sun  = sun.times(Mat4.scale([swelling_radius, swelling_radius, swelling_radius]))
        //this.shapes.s3.draw(graphics_state, sun, this.materials.sun.override( {color: Color.of (sun_red, 0, sun_blue, 1)}))

        //2.Make a point light source located in the center of the sun
        let sun_light  = [ new Light ( Vec.of( 0,0,0,1 ), Color.of(sun_red, 0, sun_blue, 1), 10 ** swelling_radius ) ]
        //graphics_state.lights = sun_light

        //tree
        let p6 = Mat4.identity()
        let p6_center = p6.times(Mat4.scale([1, 1, 1]))
        graphics_state.lights = this.lights
        this.planet_6 = p6_center;
        this.shapes.treeBase.draw(graphics_state, p6_center, this.materials.tree_base)

        //3.Place four orbiting planets.
        //Their radii shall all be 1.
        // The smallest orbit shall be 5 units away from the sun and each orbit after shall be 3 units farther,
        // with each farther planet revolving at a slightly slower rate than the previous.
        // Leave the ambient lighting of each planet the default value of zero.


        let p1 = sun_center.times(Mat4.rotation(1.25 * t , Vec.of(0, 1, 0)))
            .times(Mat4.translation([5,0,0]))
            .times(Mat4.rotation(-1.25 * t , Vec.of(0, 1, 0)))
            .times(Mat4.scale([1, 1, 1]))
        this.planet_1 = p1;
        //this.shapes.s1.draw(graphics_state, p1, this.materials.planet1)

        //Apply Gouraud shading to it every odd second, but regular smooth shading every even second
        let p2 = sun_center.times(Mat4.rotation(1.05 * t , Vec.of(0, 1, 0)))
            .times(Mat4.translation([8,0,0]))
            .times(Mat4.rotation(-1.05 * t, Vec.of(0, 1, 0)))
            .times(Mat4.scale([1, 1, 1]))

        var gouraud_color = Math.floor(t) % 2
        if ( gouraud_color == 0)
          gouraud_color = 0
        else
          gouraud_color = 1

        this.planet_2 = p2;
        //this.shapes.s2.draw(graphics_state,p2, this.materials.planet.override({color: Color.of(0.2, 1, 0.5, 1), specularity: 1, diffusivity: 0.3, gouraud: gouraud_color}))


        //brown orange
        let p3 = sun_center.times(Mat4.rotation(0.85 * t , Vec.of(0, 1, 0)))
            .times(Mat4.translation([11,0,0]))
            .times(Mat4.rotation(-0.85 * t , Vec.of(0, 1, 1)))
            .times(Mat4.scale([1, 1, 1]))

        let p3_rings = p3.times(Mat4.scale([1, 1, 0.05]))

        this.planet_3 = p3;
        //this.shapes.s3.draw(graphics_state, p3, this.materials.planet3)
        //this.shapes.torus.draw(graphics_state, p3_rings, this.materials.ring)


        //p4&moon
        let p4 = sun_center.times(Mat4.rotation(0.65 * t , Vec.of(0, 1, 0)))
            .times(Mat4.translation([14,0,0]))
            .times(Mat4.rotation(-0.65 * t, Vec.of(0, 1, 0)))
            .times(Mat4.scale([1, 1, 1]))

        let add_moon = p4.times(Mat4.rotation(0.45 * t, Vec.of(0, 1, 0)))
            .times(Mat4.translation([3,0,0]))
            .times(Mat4.rotation(2 * t , Vec.of(0, 1, 0)))
            .times(Mat4.scale([1, 1, 1]))

        this.planet_4 = p4;
        this.moon = add_moon;
        //this.shapes.s3.draw(graphics_state, p4, this.materials.planet4)
        //this.shapes.s4.draw(graphics_state, add_moon, this.materials.planet.override( {color: Color.of(0, 0.3, 0, 1)} ))

        let p5 = sun_center.times(Mat4.rotation(0.45 * t, Vec.of(0, 1, 0)))
            .times(Mat4.translation([17,0,0]))
            .times(Mat4.rotation(-0.45 * t, Vec.of(0, 1, 0)))
            .times(Mat4.scale([1, 1, 1]))
        this.planet_5 = p5;
        //this.shapes.gridSphere.draw(graphics_state, p5, this.materials.ec3)

        //this.planet_1 = planet1_transform;
        let matrix = this.attached();
        if (matrix === this.initial_camera_location)
          graphics_state.camera_transform = Mat4.inverse(matrix).map((x, i) => Vec.from(graphics_state.camera_transform[i]).mix(x, 0.1));
        else {
          matrix = matrix.times(Mat4.translation([0, 0, 5]));
          graphics_state.camera_transform = Mat4.inverse(matrix).map((x, i) => Vec.from(graphics_state.camera_transform[i]).mix(x, 0.1));
        }
      }
    }


// Extra credit begins here (See TODO comments below):

window.Ring_Shader = window.classes.Ring_Shader =
    class Ring_Shader extends Shader              // Subclasses of Shader each store and manage a complete GPU program.
    { material() { return { shader: this } }      // Materials here are minimal, without any settings.
      map_attribute_name_to_buffer_name( name )       // The shader will pull single entries out of the vertex arrays, by their data fields'
      {                                             // names.  Map those names onto the arrays we'll pull them from.  This determines
        // which kinds of Shapes this Shader is compatible with.  Thanks to this function,
        // Vertex buffers in the GPU can get their pointers matched up with pointers to
        // attribute names in the GPU.  Shapes and Shaders can still be compatible even
        // if some vertex data feilds are unused.
        return { object_space_pos: "positions" }[ name ];      // Use a simple lookup table.
      }
      // Define how to synchronize our JavaScript's variables to the GPU's:
      update_GPU( g_state, model_transform, material, gpu = this.g_addrs, gl = this.gl )
      { const proj_camera = g_state.projection_transform.times( g_state.camera_transform );
        // Send our matrices to the shader programs:
        gl.uniformMatrix4fv( gpu.model_transform_loc,             false, Mat.flatten_2D_to_1D( model_transform.transposed() ) );
        gl.uniformMatrix4fv( gpu.projection_camera_transform_loc, false, Mat.flatten_2D_to_1D(     proj_camera.transposed() ) );
      }
      shared_glsl_code()            // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
      { return `precision mediump float;
              varying vec4 position;
              varying vec4 center;
      `;
      }
      vertex_glsl_code()           // ********* VERTEX SHADER *********
      { return `
        attribute vec3 object_space_pos;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_transform;
        void main()
        {
          gl_Position = projection_camera_transform * model_transform * vec4(object_space_pos, 1.0);
          position = model_transform * vec4(object_space_pos, 1.0);
          center = model_transform * vec4(0.0, 0.0, 0.0, 1.0); 
        }`;           // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
      }
      fragment_glsl_code()           // ********* FRAGMENT SHADER *********
      { return `
        void main()
        {
          float d = distance(position, center);
          float width = -0.5;
          if (d <= 2.75)
          {
            if (sin(28.0 * d) > width)
              gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            else
              gl_FragColor = vec4(0.55, 0.27, 0.00, 1.0);   
          }       
        }`;           // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
      }
    }

window.Grid_Sphere = window.classes.Grid_Sphere =
    class Grid_Sphere extends Shape           // With lattitude / longitude divisions; this means singularities are at
    { constructor( rows, columns, texture_range )             // the mesh's top and bottom.  Subdivision_Sphere is a better alternative.
    { super( "positions", "normals", "texture_coords" );


      // TODO:  Complete the specification of a sphere with lattitude and longitude lines
      //        (Extra Credit Part III)

      const circle_points = Array( rows ).fill( Vec.of( 0,0,1 ) )
          .map( (p,i,a) => Mat4.translation([ 0,0,0 ])
              .times( Mat4.rotation( i/(a.length-1) * Math.PI, Vec.of( 1,0,0 ) ) )
              .times( p.to4(1) ).to3() );

      Surface_Of_Revolution.insert_transformed_copy_into( this, [ rows, columns, circle_points ] );
    } }

window.Cylinder = window.classes.Cylinder =
    class Cylinder extends Shape           // With lattitude / longitude divisions; this means singularities are at
    { constructor( rows, columns, texture_range )             // the mesh's top and bottom.  Subdivision_Sphere is a better alternative.
    { super( "positions", "normals", "texture_coords" );


      // TODO:  Complete the specification of a sphere with lattitude and longitude lines
      //        (Extra Credit Part III)

      const Cylinder_point1 = Array( rows ).fill( Vec.of( 0,0,0 ) )
          .map( (p,i,a) => Mat4.translation([i/(a.length-1),0,0] )
              .times( p.to4(1) ).to3() );

      const Cylinder_point2 = Array( rows ).fill( Vec.of( 1,0,0 ) )
          .map( (p,i,a) =>  Mat4.translation([0, 4*i/(a.length-1) ,0] )
              .times( p.to4(1) ).to3() );

      const Cylinder_point3 = Array( rows ).fill( Vec.of( 1,4,0 ) )
          .map( (p,i,a) => Mat4.translation([ -1*i/(a.length-1) ,0,0 ])
              .times( p.to4(1) ).to3() );

      const half_cylinder = (Cylinder_point1.concat(Cylinder_point2)).concat(Cylinder_point3);

      Surface_Of_Revolution_1.insert_transformed_copy_into( this, [ rows, columns, half_cylinder ] );
    }
}