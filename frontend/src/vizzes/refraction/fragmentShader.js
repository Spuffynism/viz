const fragmentShader = `#define GLSLIFY 1  
uniform float uTransparent;  
uniform vec2 winResolution;  
uniform float uRefractPower;  
uniform sampler2D uSceneTex;
  
varying vec3 vNormal;  
varying vec3 vViewPos;

#define PI 3.141592653589793

// Maybe try to use struct if scene gets more complex \ud83e\udd14
// struct Geometry {
//   vec3 pos;
//     vec3 posWorld;
//     vec3 viewDir;
//     vec3 viewDirWorld;
//     vec3 normal;
//     vec3 normalWorld;
// };
  
float ggx( float dNH, float roughness ) {
  
    float a2 = roughness * roughness;
    a2 = a2 * a2;
    float dNH2 = dNH * dNH;

    if( dNH2 <= 0.0 ) return 0.0;

    return a2 / ( PI * pow( dNH2 * ( a2 - 1.0 ) + 1.0, 2.0) );
}
  
float random(vec2 p){
    return fract(sin(dot(p.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

// Increase this value for a higher resolution color shift (more layers)
// Descrease this for a lower resolution color shift (less layers)  
const int LOOP = 16;
  
void main() {
  vec2 uv = gl_FragCoord.xy / winResolution.xy;
  vec2 refractNormal = vNormal.xy * (1.0 - vNormal.z * 0.85);
  vec3 refractCol = vec3( 0.0 );

  for ( int i = 0; i < LOOP; i ++ ) {
    float noiseIntensity = 0.025;
    // This makes the texture get "noisy": maybe worth adding noiseIntensity as a uniform
    float noise = random(uv) * noiseIntensity;
    // This makes layers "slide" and noisy to create the rgb color shift
    float slide = float(i) / float(LOOP) * 0.1 + noise;
 
    vec2 refractUvR = uv - refractNormal * ( uRefractPower + slide * 1.0 ) * uTransparent;
    vec2 refractUvG = uv - refractNormal * ( uRefractPower + slide * 2.0 ) * uTransparent;
    vec2 refractUvB = uv - refractNormal * ( uRefractPower + slide * 3.0 ) * uTransparent;

    // Apply the color shift and refraction to each color channel (r,g,b) of the texture passed in uSceneTex; 
    refractCol.r += texture2D( uSceneTex, refractUvR ).r;
    refractCol.g += texture2D( uSceneTex, refractUvG ).g;
    refractCol.b += texture2D( uSceneTex, refractUvB ).b;
  }
  // Divide by the number of layers to normalize colors (rgg values can be worth up to the value of LOOP)
  refractCol /= float( LOOP );

  float shininess = 100.0;

  vec3 lightVector = normalize( vec3( 1.0, 1.0, 1.0 ) );
  vec3 viewVector = normalize( vViewPos );
  vec3 normalVector = normalize( vNormal );

  vec3 halfVector = normalize(viewVector + lightVector);

  float NdotL = dot(normalVector, lightVector);
  float NdotH = dot(normalVector, halfVector);

  // TODO: study phong reflection model
  // https://stackoverflow.com/questions/53950935/webgl-adding-specular-light-without-the-help-of-three-js
  float kDiffuse = max(0.0, NdotL);

  // float a2 = roughness * roughness;
  // a2 = a2 * a2;
  // float dNH2 = dNH * dNH;

  // if( dNH2 <= 0.0 ) return 0.0;

  // return a2 / ( PI * pow( dNH2 * ( a2 - 1.0 ) + 1.0, 2.0) );

  float NdotH2 = NdotH * NdotH;
  float kSpecular = pow(NdotH2, shininess);

  refractCol += (kSpecular + kDiffuse * 0.05);

  // vec3 halfVec = normalize( geoViewDir + lightDir );

  // float dNH = clamp( dot( geoNormal, halfVec ), 0.0, 1.0 );

  // refractCol += ggx( dNH, 0.1  );

  gl_FragColor = vec4(refractCol, 1.0);
}`

export default fragmentShader
