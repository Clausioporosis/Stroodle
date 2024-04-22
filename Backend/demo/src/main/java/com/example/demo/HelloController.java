package com.example.demo;

@Restcontroller
public class HelloController{
@RequestMapping("/hello") 
public String hello(){
    retrun "Hello World";
}
}