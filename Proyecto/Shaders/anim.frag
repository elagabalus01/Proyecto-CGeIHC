#version 330 core

struct Material {
    vec3 specular; // O vec3 specular para iluminacion plana
    float shininess;
};
struct DirLight {
    vec3 direction;
  
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

out vec4 FragColor;

in vec3 Normal;  
in vec3 FragPos;
in vec2 TexCoords;
in mat3 TBN;
in vec3 TangentViewPos;
in vec3 TangentFragPos;

uniform sampler2D texture_diffuse1;
uniform sampler2D texture_normal1;

uniform Material material;
uniform DirLight light;

// Function prototypes
vec3 CalcDirLight( DirLight light, vec3 normal, vec3 viewDir );

void main()
{
    vec3 norm;
    norm = texture(texture_normal1, TexCoords).rgb;
    norm = normalize((norm * 2.0) - 1.0);  // this normal is in tangent space
    vec3 viewDir = normalize( TangentViewPos - TangentFragPos );
    vec3 result = CalcDirLight( light, norm, viewDir);
    FragColor = vec4( result, 1.0);
}

// Calculates the color when using a directional light.
vec3 CalcDirLight(DirLight light, vec3 normal, vec3 viewDir)
{
    vec3 lightDir = normalize( -TBN*light.direction);
    
    // Diffuse shading
    float diff = max( dot( normal, lightDir ), 0.0 );
    
    // Specular shading
    vec3 reflectDir = reflect( -lightDir, normal );
    float spec = pow( max( dot( viewDir, reflectDir ), 0.0 ), material.shininess );
    
    // Combine results
    vec3 ambient = light.ambient * vec3(1.0,1.0,1.0);
    vec3 diffuse = light.diffuse * diff * vec3(1.0,1.0,1.0);
    vec3 specular = light.specular * pow(spec,5) * vec3(1.0,1.0,1.0);
    vec4 texColor = texture(texture_diffuse1, TexCoords);    
    vec3 result = ambient+diffuse+specular;
    result = vec3(texColor.xyz*result);
    return (result);
}
