
float rotation=0;
int width = 500;
int height = 500;

void setup() {
  size(width, height, P3D);
  background(255);
}


void draw() {
  background(255);
  lights();
  
  //float orbitRadius= mouseX/2+50;
  //float ypos= mouseY/3;
  //float xpos= cos(radians(rotation))*orbitRadius;
  //float zpos= sin(radians(rotation))*orbitRadius;

  float xpos = 0;
  float ypos = 0;
  float zpos = 0;

  camera(xpos, ypos, zpos, 0, 0, 0, 0, -1, 0);

  box(25);

  rotation++;
}
