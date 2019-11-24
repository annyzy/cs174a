window.Assignment_Four_Scene = window.classes.Assignment_Four_Scene =
class Assignment_Four_Scene extends Scene_Component
  { constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        if( !context.globals.has_controls   ) 
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) ); 

        context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,0,5 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );

        const r = context.width/context.height;
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

        // TODO:  Create two cubes, including one with the default texture coordinates (from 0 to 1), and one with the modified
        //        texture coordinates as required for cube #2.  You can either do this by modifying the cube code or by modifying
        //        a cube instance's texture_coords after it is already created.
        const shapes = { box:   new Cube(),
                         box_2: new Cube(),
                         axis:  new Axis_Arrows()
                       }
          this.t2 = 0 ;

              shapes.box.texture_coords = shapes.box.texture_coords.map(v => Vec.of(v[0] * 1, v[1] * 1));

        shapes.box_2.texture_coords = shapes.box_2.texture_coords.map(v => Vec.of(v[0] * 2, v[1] * 2));
        this.submit_shapes( context, shapes );

        // TODO:  Create the materials required to texture both cubes with the correct images and settings.
        //        Make each Material from the correct shader.  Phong_Shader will work initially, but when 
        //        you get to requirements 6 and 7 you will need different ones.
        this.materials =
          { phong: context.get_instance( Phong_Shader ).material( Color.of( 1,1,0,1 ) ),
              box: context.get_instance(Texture_Rotate).material(
                  Color.of(0, 0, 0, 1), {
                      ambient: 1,
                      texture: context.get_instance("assets/haha.jpg",false) } ),

              box_2: context.get_instance(Texture_Scroll_X).material(
                  Color.of(0, 0, 0, 1), {
                      ambient: 1,
                      texture: context.get_instance("assets/al.jpeg",true) } )
          };

        this.lights = [ new Light( Vec.of( -5,5,5,1 ), Color.of( 0,1,1,1 ), 100000 ) ];

        // TODO:  Create any variables that needs to be remembered from frame to frame, such as for incremental movements over time.
          this.rotate_button = false;

      }
    make_control_panel()
      { // TODO:  Implement requirement #5 using a key_triggered_button that responds to the 'c' key.
          this.key_triggered_button( "Start/Stop Rotation", [ 'c' ], () => {
              this.rotate_button = !this.rotate_button;
          }
          );
      }
    display( graphics_state )
      { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;

        // TODO:  Draw the required boxes. Also update their stored matrices.
        //this.shapes.axis.draw( graphics_state, Mat4.identity(), this.materials.phong );

          //var t2 = 0;
          // let b1 = Mat4.identity();
          // b1 = b1.times(Mat4.translation([-2,0,0]))
          //         .times(Mat4.rotation(Math.PI * t, Vec.of(1, 0, 0) ) )
          //this.shapes.box.draw(graphics_state, b1, this.materials.box);

          if(!this.rotate_button)
          {
              this.t2 = this.t2 + dt;
          }
          else{
              this.t2 = this.t2 ;
          }

          let b1 = Mat4.identity();
          b1 = Mat4.translation([-2,0,0])
                  //.times(b1.times(Mat4.rotation(Math.PI * t_2, Vec.of(1, 0, 0))));

                  .times(Mat4.rotation(Math.PI * this.t2, Vec.of(1, 0, 0) ) );
              this.shapes.box.draw(graphics_state, b1, this.materials.box);
              //console.log(this.t2);
          // }
          // else{
          //     b1 = b1.times(Mat4.rotation(this.t2, Vec.of(1, 0, 0)))
          //     this.shapes.box.draw(graphics_state, b1, this.materials.box);
          // }
          //this.shapes.box.draw(graphics_state, b1, this.materials.box);

          //this.shapes.box.draw(graphics_state, b1, this.materials.box);


          let b2 = Mat4.identity();
          b2 = b2.times(Mat4.translation([2,0,0])
                 .times(Mat4.rotation(Math.PI * this.t2 * 2/3, Vec.of(1, 0, 0) ) ) );

          this.shapes.box_2.draw(graphics_state, b2, this.materials.box_2);
      }
  }

class Texture_Scroll_X extends Phong_Shader
{ fragment_glsl_code()           // ********* FRAGMENT SHADER ********* 
    {
      // TODO:  Modify the shader below (right now it's just the same fragment shader as Phong_Shader) for requirement #6.
      return `
        uniform sampler2D texture;
        void main()
        { if( GOURAUD || COLOR_NORMALS )    // Do smooth "Phong" shading unless options like "Gouraud mode" are wanted instead.
          { gl_FragColor = VERTEX_COLOR;    // Otherwise, we already have final colors to smear (interpolate) across vertices.            
            return;
          }                                 // If we get this far, calculate Smooth "Phong" Shading as opposed to Gouraud Shading.
                                            // Phong shading is not to be confused with the Phong Reflection Model.
          //vec4 tex_color = texture2D( texture, f_tex_coord );                         // Sample the texture image in the correct place.
                                                                                      // Compute an initial (ambient) color:
                                                                                      
          float theta = mod(animation_time, 1.0);
          // mat2 r = mat2( cos(theta), sin(theta), -sin(theta), cos(theta));
          float t = 2.0 ;
          vec2 new = vec2( f_tex_coord.x + t * theta, f_tex_coord.y);
          vec4 tex_color = texture2D( texture, new);
          
          
          if( USE_TEXTURE ) gl_FragColor = vec4( ( tex_color.xyz + shapeColor.xyz ) * ambient, shapeColor.w * tex_color.w ); 
          else gl_FragColor = vec4( shapeColor.xyz * ambient, shapeColor.w );
          gl_FragColor.xyz += phong_model_lights( N );                     // Compute the final color with contributions from lights.
        }`;
    }
}

class Texture_Rotate extends Phong_Shader
{ fragment_glsl_code()           // ********* FRAGMENT SHADER *********
    {
      // TODO:  Modify the shader below (right now it's just the same fragment shader as Phong_Shader) for requirement #7.
      return `
        uniform sampler2D texture;
        void main()
        { if( GOURAUD || COLOR_NORMALS )    // Do smooth "Phong" shading unless options like "Gouraud mode" are wanted instead.
          { gl_FragColor = VERTEX_COLOR;    // Otherwise, we already have final colors to smear (interpolate) across vertices.            
            return;
          }                                 // If we get this far, calculate Smooth "Phong" Shading as opposed to Gouraud Shading.
                                            // Phong shading is not to be confused with the Phong Reflection Model.
          //vec4 tex_color = texture2D( texture, f_tex_coord );                         // Sample the texture image in the correct place.
                                                 
                                   
                                                                                      // Compute an initial (ambient) color:
                                                                                      
           /* 2D rotation matrix */
          float theta = animation_time * 3.14 * 0.5;
          mat2 r = mat2( cos(theta), sin(theta), -sin(theta), cos(theta));
          float t = 0.5;
          vec4 tex_color = texture2D( texture, r * (f_tex_coord.xy - t) + t);
          
          
          if( USE_TEXTURE ) gl_FragColor = vec4( ( tex_color.xyz + shapeColor.xyz ) * ambient, shapeColor.w * tex_color.w ); 
          else gl_FragColor = vec4( shapeColor.xyz * ambient, shapeColor.w );
          gl_FragColor.xyz += phong_model_lights( N );                     // Compute the final color with contributions from lights.
        }`;
    }
}