---
layout: post
title: "DSA Chronicles - Linked List"
description: "Exploring the fundamentals of linked lists in Data Structures and Algorithms."
tags: [DSA, C++, Linked List, Data Structures, Algorithms]
---

Today we are going to explore linked lists!

![Linked List Intro](https://i.giphy.com/maJfaPl0JNswFJvfoR.webp)

- A linked list is a data structure containing two crucial pieces of information, the first being the **data** and the other being **the pointer to the next element**. The **‘head’** is the **first node**, and the **tail** is the **last node** in a linked list.

```c++
#include <iostream>
using namespace std;

int main()
{
    return 0;
}

class Node
{
    public:
        Node* next;
        int value;
        Node(int val)
        {
            value = val;
            next = nullptr;
        }

};

class LinkedList
{
    Node* head;
    Node* end;
    public:
        LinkedList()
        {
            head = end = nullptr;
        }
        void append(int val)
        {
            if(head == nullptr)
            {
                Node* node = new Node(val);
                head = end = node;
            }
            else
            {
                Node* node = new Node(val);
                end->next = node;
                end = node;
            }
        }
};
```

- The class has two data types: **data** which contains the value of the node and a **pointer next**, which points to the next node in the list.
- There is a **constructor** which assigns the values to a new node.
- A **new** keyword is used to dynamically allocate memory to a node with data as arr[0].

## Memory Space
- In a 32 Bit System 4 Bytes Int and 4 bytes pointer overall 8 Bytes
- In a 64 bit system 4 bytes int and 8 bytes pointer overall 12 bytes

## Types of Linked List
- Singly Linked Lists
- Doubly Linked Lists
- Circular Linked Lists

Bye Bye !!!! 
![Bye Bye](https://i.giphy.com/3o6EhGvKschtbrRjX2.webp)
