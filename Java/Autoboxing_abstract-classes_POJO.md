Q) Why only one public class pre file is allowed in java?
soln. JVM is outside the package and for it to run the file i.e compile and execute the class should be public , but if a file has more than one public file , it'd create ambiguity for JVM , which class to access.

Q)Why name of the public class should be same as filename?
Soln. 🔹 1. Java enforces one public class per file

If a class is declared public, it becomes globally accessible. To avoid ambiguity, Java enforces:

A .java file can contain only one public class, and the file name must match that class.

Example:

public class MyProgram {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}

✔ File name must be: MyProgram.java
❌ If you name it Test.java → compile-time error

🔹 2. Compiler (javac) mapping mechanism

The Java compiler (javac) works like this:

It reads the filename → expects a matching public class
It generates a .class file with the same name
MyProgram.java → MyProgram.class

If names don’t match, the compiler cannot reliably map:

source file → compiled bytecode
class → file system
🔹 3. Class loader dependency

At runtime, the JVM uses the class loader to load classes.

It assumes:

Class name = file name (without .java/.class)

So if you run:

java MyProgram

The JVM looks for:

MyProgram.class

If the names didn’t match, the JVM wouldn’t know where to find the class.

Wrapper class:

    int (primitive) --> Integer(Wrapper)

    int x=20;    a container is created in stack, whose name is x and value is 10
    Integer x=new Integer(20);  a container is created in heap whose value is 10 and is referenced by x in the stack

-> Collection framework only deals with classes and objects , they don't deal with primitives i.e why they need wrapper classes
-> wrapper classes have their own methods as well

Autoboxing: converts primitive to wrapper class
 int x=10;
 Integer y=x; //Autoboxing
 //Integer y =new Integer(x); (internally (old method)) (deprecated)
 //Integer y=Integer.valueOf(x); (internally (new method)) more optimized than old , b/c from inside it uses caching
 Note:- if u try to print  y, like System.out.println(y); here automatically unboxing doesn't happens,since y is an object
        we need it's value to print, like y.toString(), or even if u don't write it, by default it accesses, the method 
        and does not do the unboxing automatically.

Unboxing: converts wrapper to primitive
 Integer x=10;
 int y=x;
 // int y=x.intValue(); intvalue() won't be static , else x won't be able to access it.

Cases where autoboxing and unboxing applies:
1) Assignment (as discussed in definition)
2) Method call 
  main(){
    Integer x=50;
    printInteger(x);
  }
  void printInteger(int x){
    System.otu.prinltn(x);
  }
3. Arithmetic Operations
    Integer a=10;
    Integer b=10;
    int sum=a+b;

__Null Pointer Exception in AutoBoxing__:
Integer x= null; (can store since it's an object only)
int y=x;
System.out.println(y); //Throws Null Pointer exception .b/c primitives can't handle it 