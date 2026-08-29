[Home](#home)

# Compilers
Compilers is a software tools that converts a high level programming language such as **C** or **C++** into machine code.

Compilers are smart software that applies optimizations and further tools that help the developer to build more performant software alonngside cutting out extra instruction to execute the program unlike **Interpreted** languages such as **Python**.

However each time a change needs to be tested will require the program to be rebuilt using the compile meaning testing is slow for very large projects as with some projects could take half to an hour long to build the software. 

## Compiled languages:
* C and C++
* Rust
* Ada
* Go
* Swift
* Fortran

## Why compilers exist?

They're to bridge the gap between CPU and software Python and C code directly can't run on the CPU but require the source code to be converted or translated this can happen at runtime or compiled and then executed.

Each compiler can support or only support a certain architecture such as x86-64 or ARM these architecture don't use a compatable instruction set. The compiler can be configured to build the program for one or both meaning a build for ARM and x86 will only run on their respected platforms.

Unlike Interprted translates the instruction at runtime meaning the code will be operational on ARM and x86-64. 

Keep in mind not all instruction used in C and other languages may not be present in ARM or x86-64 meaning the developer may need to use patches to execute alternative instruction or work around to make the program functional on each platform. This is what intepreted languages help solve.

---

1. Checking that the source is valid (syntax and types, depending on the language).
2. Transforming the program into an equivalent lower-level representation.
3. Emitting code the target machine (or a VM) can run.

---

## Byte code compiled languages
Not all languages direcrtly compile into machine code but into byte code which is unreadable code but ran using a VM (Virtual Machine) where the code is then interprated and executed. Providing the partial benefits of compiled languages with interpreted languages, Allowing the program to be executed on any VM supported platforms.

Meaning Java code will execute on ARM and x86-64 platforms aslong as their a compatable VM for that platform the byte code can execute run on that platform.

Such languages that use this system are Java and C#.

## Compiler vs interpreter vs assembler

| Tool | Input | Output / behavior |
|------|--------|-------------------|
| **Compiler** | Source code | Machine code, object files, or bytecode (ahead of time) |
| **Interpreter** | Source code | Executes the program directly, statement by statement |
| **Assembler** | Assembly language | Machine code |
| **Linker** | Object files | Executable or library |

Many modern languages mix these ideas:

- **C / C++ / Rust / Go** — typically compiled to native machine code.
- **Java / C#** — compiled to bytecode, then run on a VM (often with JIT compilation).
- **Python** — usually interpreted (CPython), after compiling to bytecode internally.

---

## Main stages of a compiler

A common native compiler pipeline looks like this:

### 1. Lexical analysis
Breaks the character stream into **tokens** (keywords, identifiers, operators, literals).

Example: `return a + b;` → `return`, `a`, `+`, `b`, `;`

### 2. Syntax analysis
Builds a **parse tree** or **abstract syntax tree (AST)** according to the language grammar.

### 3. Semantic analysis
Checks meaning: types, undeclared variables, invalid operations, scope rules.

### 4. Intermediate representation
Converts the AST into a simpler, compiler-friendly form (for example LLVM IR). This makes optimization and retargeting easier.

### 5. Optimization
Improves the IR or machine code: remove dead code, inline functions, simplify expressions, and so on. Optimizations must preserve program behavior (aside from allowed language-defined differences).

### 6. Code generation
Emits assembly or machine code for a specific ISA (x86-64, AArch64, …).

### 7. Assembly and linking (often separate tools)
- **Assembler** turns assembly into object code (`.o` / `.obj`).
- **Linker** combines object files and libraries into an executable.

In practice, drivers like `gcc` or `clang` complete these steps for you.

---

## Compiling a basic program.

This guide will be assuming you're using a linux operting system expect some commands requiring alternative methods to compile a basic programs.

### First creating a basic C program

This program will add two number and print the result into terminal.

Create a new text file with the file extension of .c such as "main.c", Each source code file will require the correct file extension such as ".c" or ".h".

> For this example only use ".c".

Within the file write out this program.
```c
#include <stdio.h>

int main() {
    // Declare two integer variables.
    int number1 = 12;
    int number2 = 55;

    // Declare new integer variable with the sum of the two values.
    int result = number1 + number2;

    // Output the result into terminal.
    printf("%d\n", result);

    // Must provide the correct return.
    return 0;
}
```

Once written and saved ensure everything spelled and written correctly and all **semi-colons** are accounted for, Once you're happy we'll move to compiling.

### Second Compiling our program

Now we're going to compile the finished code. You must ensure you have gcc installed as this guide will only over the gcc compiler.

> For linux you can install gcc using this command. (This does depend on the flavour of linux you're using too.)
```bash
sudo apt install gcc
```

Once gcc is install you can now compile your program using the following command.
```bash
gcc main.c -o myProgram
```

Once gcc is done compiling there will be no message displayed only when an error or warning is present where the tool will recommend you to change something within your code. Ensure you read the error or warning carefully to find and fix the issue the compiler is having with your provided code.

Now you can execute the program you written with:
```bash
./myProgram
```
This should result 67 being outputted into the terminal. Try changing the value and then recompile the program and observe the changes.

---

TODO....

