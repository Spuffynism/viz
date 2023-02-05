(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([[6514], {
  9251: function(e, n, r) {
    (window.__NEXT_P = window.__NEXT_P || []).push(['/refraction', function() {
      return r(7627)
    }])
  }, 7627: function(e, n, importLib) {
    'use strict'
    importLib.r(n), importLib.d(n, {
      default: function() {
        return RefractionWrapper
      }
    })
    var t = importLib(5893), o = importLib(3412), a = importLib(8626), drei = importLib(7597), s = importLib(6625), l = importLib(6665), c = importLib(5029), f = importLib(3310),
      u = importLib(5032), React = importLib(7294), THREE = importLib(9477),
      fragmentShader = '#define GLSLIFY 1\nuniform float uTransparent;\nuniform vec2 winResolution;\nuniform float uRefractPower;\nuniform sampler2D uSceneTex;\n\nvarying vec3 vNormal;\nvarying vec3 vViewPos;\n\n#define PI 3.141592653589793\n\n// Maybe try to use struct if scene gets more complex \ud83e\udd14\n// struct Geometry {\n// \tvec3 pos;\n// \tvec3 posWorld;\n// \tvec3 viewDir;\n// \tvec3 viewDirWorld;\n// \tvec3 normal;\n// \tvec3 normalWorld;\n// };\n\nfloat ggx( float dNH, float roughness ) {\n\t\n\tfloat a2 = roughness * roughness;\n\ta2 = a2 * a2;\n\tfloat dNH2 = dNH * dNH;\n\n\tif( dNH2 <= 0.0 ) return 0.0;\n\n\treturn a2 / ( PI * pow( dNH2 * ( a2 - 1.0 ) + 1.0, 2.0) );\n}\n\nfloat random(vec2 p){\n\treturn fract(sin(dot(p.xy ,vec2(12.9898,78.233))) * 43758.5453);\n}\n\n// Increase this value for a higher resolution color shift (more layers)\n// Descrease this for a lower resolution color shift (less layers)\nconst int LOOP = 16;\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / winResolution.xy;\n  vec2 refractNormal = vNormal.xy * (1.0 - vNormal.z * 0.85);\n  vec3 refractCol = vec3( 0.0 );\n\n  for ( int i = 0; i < LOOP; i ++ ) {\n    float noiseIntensity = 0.025;\n    // This makes the texture get "noisy": maybe worth adding noiseIntensity as a uniform\n    float noise = random(uv) * noiseIntensity;\n    // This makes layers "slide" and noisy to create the rgb color shift\n    float slide = float(i) / float(LOOP) * 0.1 + noise;\n \n    vec2 refractUvR = uv - refractNormal * ( uRefractPower + slide * 1.0 ) * uTransparent;\n    vec2 refractUvG = uv - refractNormal * ( uRefractPower + slide * 2.0 ) * uTransparent;\n    vec2 refractUvB = uv - refractNormal * ( uRefractPower + slide * 3.0 ) * uTransparent;\n\n    // Apply the color shift and refraction to each color channel (r,g,b) of the texture passed in uSceneTex; \n    refractCol.r += texture2D( uSceneTex, refractUvR ).r;\n    refractCol.g += texture2D( uSceneTex, refractUvG ).g;\n    refractCol.b += texture2D( uSceneTex, refractUvB ).b;\n  }\n  // Divide by the number of layers to normalize colors (rgg values can be worth up to the value of LOOP)\n  refractCol /= float( LOOP );\n\n  float shininess = 100.0;\n\n  vec3 lightVector = normalize( vec3( 1.0, 1.0, 1.0 ) );\n  vec3 viewVector = normalize( vViewPos );\n  vec3 normalVector = normalize( vNormal );\n\n  vec3 halfVector = normalize(viewVector + lightVector);\n\n  float NdotL = dot(normalVector, lightVector);\n  float NdotH = dot(normalVector, halfVector);\n\n  // TODO: study phong reflection model \n  // https://stackoverflow.com/questions/53950935/webgl-adding-specular-light-without-the-help-of-three-js\n  float kDiffuse = max(0.0, NdotL);\n\n  // float a2 = roughness * roughness;\n\t// a2 = a2 * a2;\n\t// float dNH2 = dNH * dNH;\n\n\t// if( dNH2 <= 0.0 ) return 0.0;\n\n\t// return a2 / ( PI * pow( dNH2 * ( a2 - 1.0 ) + 1.0, 2.0) );\n\n  float NdotH2 = NdotH * NdotH;\n  float kSpecular = pow(NdotH2, shininess);\n\n  refractCol += (kSpecular + kDiffuse * 0.05);\n\n  // vec3 halfVec = normalize( geoViewDir + lightDir );\n\n  // float dNH = clamp( dot( geoNormal, halfVec ), 0.0, 1.0 );\n\n  // refractCol += ggx( dNH, 0.1  );\n\n  gl_FragColor = vec4(refractCol, 1.0);\n}\n\n',
      vertexShader = '#define GLSLIFY 1\nvarying vec2 vUv;\nvarying vec3 vNormal;\nvarying vec3 vViewPos;\nvarying vec3 vWorldPos;\n\nvoid main() {\n\n  vec3 pos = position;\n  vec4 worldPos = modelMatrix * vec4( pos, 1.0 );\n\tvec4 mvPosition = viewMatrix * worldPos;\n\t\n\tgl_Position = projectionMatrix * mvPosition;\n\n  vec3 transformedNormal = normalMatrix * normal;\n\tvec3 normal = normalize( transformedNormal );\n\n  vUv = uv;\n  vNormal = normal;\n  vViewPos = -mvPosition.xyz;\n  vWorldPos = worldPos.xyz;\n}',
      Geometries = function(e) {
        var mesh = React.useRef(),
          scene = f.z().scene,
          nodes = a.L('./assets/shapes.gltf').nodes
        scene.background = new THREE.Color('#f1f1f5')
        var uniforms = React.useMemo((function() {
          return {
            uTime: { value: 0 },
            uSceneTex: { value: null },
            uTransparent: { value: .8 },
            uRefractPower: { value: .2 },
            color: { value: new THREE.Vector4 },
            winResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight).multiplyScalar(Math.min(window.devicePixelRatio, 2)) }
          }
        }), []), controls = u.M4({
          refractPower: { value: .3, min: 0, max: 1, step: .01 },
          transparent: { value: .5, min: 0, max: 1, step: .01 }
        }), refractPower = controls.refractPower, transparent = controls.transparent, mainRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight)
        return f.A((function(e) {
          var gl = e.gl, scene = e.scene, camera = e.camera
          mesh.current.material.uniforms.winResolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight).multiplyScalar(Math.min(window.devicePixelRatio, 2)),
            mesh.current.material.uniforms.uRefractPower.value = refractPower,
            mesh.current.material.uniforms.uTransparent.value = transparent,
            gl.setRenderTarget(mainRenderTarget),
            gl.render(scene, camera),
            mesh.current.material.uniforms.uSceneTex.value = mainRenderTarget.texture,
            gl.setRenderTarget(null)
        })), t.jsxs(t.Fragment, {
          children: [t.jsxs(React.Suspense, {
            fallback: null,
            children: [t.jsx(drei.b, {
              position: [-1.5, -1, 0],
              speed: 2,
              rotationIntensity: 4,
              floatIntensity: 2,
              children: t.jsx('mesh', {
                ref: mesh,
                scale: .1,
                geometry: nodes.Cube.geometry,
                children: t.jsx('shaderMaterial', {
                  fragmentShader: fragmentShader,
                  vertexShader: vertexShader,
                  uniforms: uniforms,
                  wireframe: false,
                  transparent: true
                })
              })
            }), t.jsx(drei.b, {
              position: [2.7, 1, -2],
              speed: 2,
              rotationIntensity: 4,
              floatIntensity: 2,
              children: t.jsx('mesh', {
                ref: mesh,
                scale: .1,
                geometry: nodes.Cylinder.geometry,
                children: t.jsx('shaderMaterial', {
                  fragmentShader: fragmentShader,
                  vertexShader: vertexShader,
                  uniforms: uniforms,
                  wireframe: false,
                  transparent: true
                })
              })
            }), t.jsx(drei.b, {
              position: [.8, .4, -1],
              speed: 2,
              rotationIntensity: 4,
              floatIntensity: 2,
              children: t.jsx('mesh', {
                ref: mesh,
                scale: .1,
                geometry: nodes.Torus.geometry,
                children: t.jsx('shaderMaterial', {
                  fragmentShader: fragmentShader,
                  vertexShader: vertexShader,
                  uniforms: uniforms,
                  wireframe: false,
                  transparent: true
                })
              })
            }), t.jsx(drei.b, {
              position: [0, 0, -2],
              speed: 2,
              rotationIntensity: 2,
              floatIntensity: 2,
              children: t.jsxs('mesh', {
                position: [0, 2, -2],
                scale: 1,
                children: [t.jsx('sphereGeometry', {}), t.jsx('meshStandardMaterial', { color: new THREE.Color('#FFFFFF') })]
              })
            })]
          }), t.jsx(s.x, {
            color: 'black',
            font: '/fonts/SpaceGrotesk-Medium.ttf',
            position: [0, 0, -4],
            scale: 15,
            rotation: [0, 0, Math.PI / 8],
            children: '3.1415926535'
          })]
        })
      }, Refraction = function() {
        return t.jsxs(c.Xz, {
          gl: { antialias: true, stencil: false },
          camera: { position: [0, 0, 11], fov: 25 },
          dpr: [1, 2],
          children: [t.jsx(l.z, { attach: 'orbitControls' }), t.jsx('ambientLight', { intensity: 1 }), t.jsx('directionalLight', {
            position: [1, 5, 4],
            intensity: 4
          }), t.jsx(Geometries, { position: [0, 0, 0] })]
        })
      }, g = {
        href: 'https://next.junni.co.jp',
        text: 'Inspired by next.junni.co.jp / Created with the help of @focru_ino'
      }, RefractionWrapper = function() {
        return t.jsx(o.Z, { link: g, title: 'Refraction', theme: 'light', children: t.jsx(Refraction, {}) })
      }
  }
}, function(e) {
  e.O(0, [3737, 5905, 6665, 5847, 5032, 8626, 6978, 3412, 9774, 2888, 179], (function() {
    return n = 9251, e(e.s = n)
    var n
  }))
  var n = e.O()
  _N_E = n
}])
