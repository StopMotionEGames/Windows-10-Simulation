# Todo

## Build System

### Create basic test files

- [ ] create basic files with basic tests for ''Compiling`` system and linking system
- [ ] create a manifest like file to define what are the entry-points, what are the dependencies, and so on
- [ ] create libraries in a scpefic folder for libraries

### Implement the building system

- [ ] minifying system
  
  use  an existing powerful tool to minify the files

- [ ] linking system

  use manifest file from its folder to decide what is going to be packed in the executable or loaded dynamicaly (like a DLL, which stands for ''Dynamic Link Library``). Imported scripts which are a .d.ts are considered libraries, so in this case it'll be dynamic linked