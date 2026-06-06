---
layout: post
title: "DSA Chronicles - Single Linked List Functions"
description: "Breaking down the core functions of a Single Linked List in C++."
tags: [DSA, C++, Linked List, Data Structures, Algorithms]
---

Today we are going to fuckin crack linked list functions! Let's get right into it.

![Let's go](https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif)

## Inserting a Node at the Head (Prepend)

```cpp
void prepend(int val)
{
    if(head == nullptr)
    {
        Node* node = new Node(val);
        head = tail = node;
    }
    else
    {
        Node* node = new Node(val);
        node->next = head;
        head = node;
    }
}
```

*   **What it does:** It shoves a brand new node right at the very beginning of your linked list.
*   **The logic:** If the list is empty, this new guy becomes both the head and the tail. If it's not empty, the new node points to the old head, and then we officially crown the new node as the new head.
*   **Why it is cool:** It is super fast! It always takes the same amount of time no matter how huge your list is.

## Inserting a Node at the End (Append)

```cpp
void append(int val)
{
    if(head == nullptr)
    {
        Node* node = new Node(val);
        head = tail = node;
    }
    else
    {
        Node* node = new Node(val);
        tail->next = node;
        tail = node;
    }
}
```

*   **What it does:** It slaps a new node onto the very back of the line.
*   **The logic:** Just like prepend, if the list is completely empty, the new node is everything. But if there is already a line, we tell the current tail to point to our new node, and then we make our new node the official tail.
*   **Why it is cool:** Since we keep track of the tail, we don't have to walk through the entire list to add something to the end.

## Deletion At The Head (Pop Start)

```cpp
int pop_start()
{
    if(head == nullptr)
    {
        throw runtime_error("Error : LinkedList is empty");
    }
    else if (head == tail)
    {
        Node* temp = head;
        int val = temp->value;
        head = head->next;
        delete temp;
        tail = nullptr;
        return val;
    }
    Node* temp = head;
    int val = temp->value;
    head = head->next;
    delete temp;
    return val;
}
```

*   **What it does:** It chops off the very first node and hands you back its value.
*   **The logic:** First, we check if the list is empty because you cannot delete what isn't there! If there is only one item, we grab its value, delete it, and set both head and tail to nothing. If there are multiple items, we save the first node, move the head to the second node, delete the old head, and return the value.
*   **Why it is cool:** It cleans up after itself by deleting the node from memory so your computer doesn't get clogged up.

## Length of A LinkedList

### Method 1: Use a for loop

```cpp
length = 0
while ( head != null)
  length++
  head = head->next
```
*   **What it does:** It physically walks through every single node one by one and counts them.
*   **The logic:** You start at 0 and just keep stepping forward until you hit a dead end.
*   **Why it sucks:** Time Complexity is O(N). If you have a million nodes, you have to count a million times.

### Method 2: Create a length variable

*   **What it does:** You literally just keep a running tally.
*   **The logic:** Every time you add a node, you do `length++`. Every time you delete one, you do `length--`.
*   **Why it is cool:** Time Complexity is O(1)! You instantly know the length at any given second without counting.

## Searching In a Linked List

```cpp
bool search(int key)
{
    Node* temp = head;
    while(temp != nullptr)
    {
        if(temp->value == key)
            return true;
        temp = temp->next;
        
    }
    return false;
}
```

*   **What it does:** It looks for a specific number in your list like a detective.
*   **The logic:** You start at the head and check the value. If it is a match, boom, you return true! If not, you move to the next node. If you reach the end and find nothing, you return false.
*   **Why it is cool:** It is the most basic way to find stuff. Best case is you find it immediately, worst case is it is at the very end or not there at all.

## Memory Leaks Fixing (The Destructor)

```cpp
~LinkedList()
{
    Node* temp = head;
    while(temp != nullptr)
    {
        Node* next = temp->next;
        delete temp;
        temp = next;
    }
}
```

![Boom Blast](https://media.giphy.com/media/HhTXt43pk1I1W/giphy.gif)

*   **What it does:** It blows up the entire linked list and frees the heap memory.
*   **The logic:** It goes through each node, saves the address of the next guy, absolutely nukes the current node from memory using `delete`, and then moves on to the next victim.
*   **Why it is important:** Think of memory like an apartment. When you create a node with `new`, you are renting space on the heap. If you destroy your linked list object but forget to delete the nodes, those nodes are still taking up space in your computer memory forever. That is a memory leak. If you leak too much memory your computer slows down and eventually crashes. The destructor ensures that when the linked list dies it cleans out the apartment completely so someone else can use it. No more leaks.

## Middle of A Link List

### Method 1

*   **What it does:** It finds the exact center of your list.
*   **The logic:** If you already used that big brain Method 2 to track the length, you just divide the length by 2! Middle for odd is `n/2` and middle for even is `(n-2)/2`.
*   **Why it is cool:** It saves you from doing weird slow math by just cutting your pre calculated length right in half.

![Peace out](https://media.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif)
