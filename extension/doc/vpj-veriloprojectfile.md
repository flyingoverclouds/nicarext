# Verilog Project File (.vpj)

**.vpj** files are project files.
This files contains the definition of dependencies between your verilog module , your testbench verilog file specific compilation/simulation settings
A opened folder can contains only ONE .vpj.

## VPJ Structure
Structure of a **.vpj** is relatively easy to understand : 

```json
{
    "files": [ 
        { filename: "blink.v" },
        { filename: "premier.v", dependencies: [ "blink.v" ]}
    ],
    "startfile" : "premier.v",
    "output": "premier.vvp",
    "testbenches": [ 
        { filename: "tb/premier_tb.v", dependencies: ["premier.v"] }
    ]
}
```

**files** : is an array defining all compilable files

**filename** : name of a compilable verilog file

**dependencies** : Define other verilog file to compile with this file (if your module depends on another module). Dependencies inclusion is recursive : just write that file1.v depends on files2.v, and file2.v depends on file3.v : when compiling file1.v, extension will compile file1.v, file2.v and file3.v  

**startfile** : when compiling folder, define the .v file used as the compilation starting point

**output** : name of the 'compiled' verilog file when compiling folder. If you compile a specific verilog file, the compilation result filename derive from the main file (blink.v will generate blink.vvp) 

**testbenches** : works like _**files**_ but define verilog testbench. a testbench file is compilable (it contains verilog) AND its compilation result is runnable in VVP 

# Missing VPJ file or orphan .v file ?
If VSCode is opening a folder without **.vpj** file or if you open an orphan .v file (verilog file not declared in the .vpj), each .v filewill be treated as a testbench verilog file with no dependencies.

