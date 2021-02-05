#version 330 core
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aNormal;
layout (location = 2) in vec2 aTexCoords;
layout (location = 3) in vec3 tangent;
layout (location = 4) in vec3 bitangent;
layout (location = 5) in ivec4 bone_ids;
layout (location = 6) in vec4 weights;

out vec3 FragPos;
out vec3 Normal;
out vec2 TexCoords;
out vec3 TangentViewPos;
out vec3 TangentFragPos;
out mat3 TBN;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
uniform vec3 viewPos;

const int MAX_BONES = 100;
uniform mat4 bones[MAX_BONES];

void main()
{
	mat4 bone_transform = bones[bone_ids[0]] * weights[0];
		bone_transform += bones[bone_ids[1]] * weights[1];
		bone_transform += bones[bone_ids[2]] * weights[2];
		bone_transform += bones[bone_ids[3]] * weights[3];
		
	vec4 boned_position = bone_transform * vec4(aPos, 1.0); // transformed by bones

    FragPos = vec3(model * bone_transform);
    //Normal = mat3(transpose(inverse(model))) * aNormal; // Calcular normales fuera del shader 
	Normal = vec3 (bone_transform * vec4 (aNormal, 0.0)); // A lo mejor se cambia
	mat3 normalMatrix = transpose(inverse(mat3(model)));
	vec3 N = normalize(normalMatrix * Normal);
	vec3 T = normalize(normalMatrix * tangent);
	T = normalize(T - dot(T, N) * N);
	vec3 B = cross(N, T);
	TBN = transpose(mat3(T, B, N));
    TangentViewPos  = TBN * viewPos;
    TangentFragPos  = TBN * FragPos;
    gl_Position = projection * view * model * boned_position;
	TexCoords = aTexCoords;
}