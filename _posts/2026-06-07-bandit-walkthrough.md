---
layout: post
title: "Cracking OverTheWire: Bandit Walkthrough (Full Run 0-33)"
description: "A sick speedrun walkthrough of the ENTIRE OverTheWire Bandit wargame. Levels 0 to 33 baby."
tags: [Cyber Security, CTF, OverTheWire, Bandit, Linux, Bash, Ethical Hacking, Penetration Testing]
---

What is good hackers! Today we are diving into the complete OverTheWire Bandit wargame. We are doing a full speedrun of all 34 levels. I cranked this out in record time so you do not have to struggle. Let's get right into the terminal and crack some passwords! 💻🔥

![Let's go](https://i.giphy.com/maJfaPl0JNswFJvfoR.webp)

## Level 0: The Front Door 🚪

We are given the login credentials and need to read a file called `readme`.

```bash
ssh bandit0@bandit.labs.overthewire.org -p 2220
cat readme
```

**Why this works:** `ssh` gets us into their server securely. We connect to port 2220 because port 22 is too mainstream. Once we are in, `cat` just spits out the file contents directly to our screen. Too easy.
**Password:** `ZjLjTmM6FvvyRnrb2rfNWOZOTa6ip5If`

## Level 1: The Dashed File 🕵️‍♂️

The file is named `-`. If you just type `cat -`, the terminal thinks you want to read from standard input and just stares blankly at you like a total idiot.

```bash
cat ./"-"
```

**Why this works:** By adding `./`, we force the shell to look at the current directory for a literal file instead of treating the dash as a special argument. Sneaky admins trying to ruin our day, but we are smarter. 🧠
**Password:** `263JGJPfgU6LtdEvgfWU1XP5yac29mFx`

## Level 2: Spaced Out 🚀

The file is called `spaces in this filename`. Linux hates spaces in file names. If you type `cat spaces in this filename`, the command thinks you want to open four different files!

```bash
cat ./"---spaces in the filename---"
```

**Why this works:** Wrapping the whole thing in quotes tells bash that everything inside is a single string. It forces the terminal to treat the entire mess as one file name. Quotes are way cleaner than escaping spaces with backslashes.
**Password:** `MNk8KNH3Usiio41PRUEoDFPqfxLPlSmx`

## Level 3: Playing Hide and Seek 👻

The file is hidden in a directory. We know that files starting with a dot `.` are hidden by default in Linux.

```bash
cat ./*
# Or if you want to be precise:
cat ./"...Hiding from you"
```

**Why this works:** The `*` is a wildcard that grabs everything it can. However, usually `*` skips hidden files. The cool trick here is that if you know the file starts with dots, you can just type it out!
**Password:** `2WmrDFRmJIq3IPxneAaMGhap0pFhF3NJ`

## Level 4: The ASCII Needle in a Hex Stack 🧲

We have a bunch of files, but only one is human readable. The rest are straight garbage binary.

```bash
file ./* | grep "ASCII"
cat ./-file07
```

**Why this works:** The `file` command is a lifesaver. It actually looks inside the file to determine what kind of data it holds, ignoring whatever the file extension claims to be. `grep "ASCII"` filters the massive output down to the one file that contains plain text. Then we just `cat` it. Easy money. 💸
**Password:** `4oQYVPkxZOOEOO5pTW81FB8j8lxXGUQw`

## Level 5: Size Matters 📏

We have to find a file that is exactly 1033 bytes, not executable, and human readable.

```bash
find . -type f -size 1033c
```

**Why this works:** `find` is the ultimate search tool. `-type f` means look for files, and `-size 1033c` looks for exactly 1033 bytes (the `c` stands for bytes). It instantly points us to the right file hiding in a massive directory tree.
**Password:** `HWasnPhtq9AVKe0dmk45nxy20cvUa6EG`

## Level 6: The Server Wide Hunt 🌍

The file is somewhere on the entire server. It is owned by `bandit7`, group `bandit6`, and is 33 bytes. This means we will hit a lot of "Permission denied" errors while searching.

```bash
cd /
find . -type f -size 33c -user bandit7 -group bandit6 2>/dev/null
```

**Why this works:** We start our search at the root directory `/`. The absolute magic here is `2>/dev/null`. In Linux, file descriptor 2 is standard error. By pointing it to `/dev/null` (which is basically a black hole), we silence all those annoying permission errors and only see the one successful match. Absolute cinema. 🍿
**Password:** `morbNTDkSW6jIlUc0ymOdMaLnOlFVAaj`

## Level 7: The Millionth Word 📖

We have a massive text file and need to find the password next to the word `millionth`.

```bash
cat data.txt | grep -w "millionth"
```

**Why this works:** `grep` is our filtering god. The `-w` flag tells it to look for the exact word "millionth" rather than something that just contains those letters. It instantly spits out the single line we care about out of thousands.
**Password:** `dfwvzFQi4mU0wfNbFOe9RoWskMLg7eEc`

## Level 8: The Unique Snowflake ❄️

We need to find the one line that occurs exactly once in a file full of repeating lines.

```bash
sort data.txt | uniq -c | grep -w 1
```

**Why this works:** `uniq` only removes adjacent duplicate lines. If we do not sort the file first, `uniq` will miss duplicates that are spread out. So we `sort` the file, pipe it into `uniq -c` (which counts occurrences), and then `grep` for the number 1 to find the absolute loner.
**Password:** `4CKMh1JI91bUIZZPXDqGanal4xvAg0JM`

## Level 9: Binary Garbage 🗑️

The password is in a binary file, surrounded by lines starting with `===`.

```bash
strings data.txt | grep "==="
```

**Why this works:** If you `cat` a binary file, your terminal will likely crash or print alien text. The `strings` command extracts only the human readable characters from the binary mess. Then we just filter it with `grep` to find our prize.
**Password:** `FGUW5ilLVJrxX9kMYMmlN4MgbpfMiqey`

## Level 10: Base64 Madness 🧬

The file is encoded in base64.

```bash
base64 -d data.txt
```

**Why this works:** Base64 is an encoding scheme used to turn binary data into plain text. It is not encryption! The `-d` flag tells the `base64` tool to decode it back to its original form. Simple and clean.
**Password:** `dtR173fZKb0RRsDFSGsg2RWnpNVj3qRr`

## Level 11: ROT13 Cipher 🔄

The text is scrambled using ROT13, meaning every letter is rotated 13 positions forward in the alphabet.

```bash
cat data.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'
```

**Why this works:** The `tr` command translates characters. We map A to N, B to O, all the way through the alphabet. Because the alphabet has 26 letters, rotating by 13 twice gets you back to the start! It is a hilarious encryption method that a 5 year old could crack. 🤡
**Password:** `7x16WNeHIi5YkIhWsfFIqoognUTyj9Q4`

## Level 12: The Russian Nesting Doll 🪆

This one is brutal. It is a hex dump of a file that has been compressed multiple times with gzip, bzip2, and tar in completely random order.

```bash
mkdir /tmp/work && cd /tmp/work
cp ~/data.txt .

xxd -r data.txt > output.bin     # Reverses the hexdump

file output.bin                   # Oh look, it is gzip
mv output.bin output.gz
gzip -d output.gz

file output                       # Now it is bzip2
bzip2 -d output

# And it goes on and on with tar, gzip, bzip2...
```

**Why this works:** The `xxd -r` command takes a hex dump and converts it back into actual binary data. From there, we are caught in a painful loop of using `file` to see what kind of compression was used, renaming the file to the right extension, and running the proper decompression tool (`gzip -d`, `bzip2 -d`, `tar -xvf`). It is tedious but deeply satisfying once you break out.
**Password:** `FO5dwFsc0cbaIiH0h8J2eUks2vdTDwAn`

## Level 13: Private Keys 🗝️

No direct password here. We get an SSH private key to log into the next level.

```bash
# On our machine:
nano sshkey.private  # Paste the key from bandit13
chmod 600 sshkey.private
ssh -i sshkey.private bandit14@bandit.labs.overthewire.org -p 2220
```

**Why this works:** SSH keys are way more secure than passwords. You need to use `chmod 600` because SSH is incredibly paranoid and will flat out refuse to use your key if other users on your machine have permission to read it. The `-i` flag points SSH directly to the key file for authentication.

## Level 14: Localhost Ports 🔌

We need to submit the current level password to localhost on port 30000 to get the next one.

```bash
cat /etc/bandit_pass/bandit14  # Grab our password
nc localhost 30000
# (Paste the password)
```

**Why this works:** `nc` stands for Netcat. It is the absolute Swiss Army knife of networking. We use it to open a raw TCP connection to port 30000 on the local machine and send our string over the wire. The server eats the string and spits back our reward.
**Password:** `8xCjnmgoKbGLhHFAZlGE5Tmu4M2tKJQo`

## Level 15: SSL All The Things 🔒

Same deal as Level 14, but now the port uses SSL/TLS encryption. Netcat will not cut it anymore.

```bash
openssl s_client -connect localhost:30001
# (Paste the password)
```

**Why this works:** Netcat sends plain text, but the server expects a secure handshake. We use `openssl s_client` to handle the complicated math and cryptography required to establish a secure TLS connection. Once connected, we just paste the password like before.
**Password:** `kSkvUpMQ7lBYyCM4GBPvCvT1BfWRy0Dx`

## Level 16: Port Scanning & SSL 🕵️

Scan ports 31000 to 32000, find the one speaking SSL, submit the password, and receive an SSH private key for bandit17.

```bash
# Scan for open ports:
for port in {31000..32000}; do nc -z localhost $port; done

# Submit to the SSL port (31790):
echo "kSkvUpMQ7lBYyCM4GBPvCvT1BfWRy0Dx" | openssl s_client -connect localhost:31790 -quiet

# Save the returned private key, chmod 600, then:
ssh -i key17 bandit17@bandit.labs.overthewire.org -p 2220
cat /etc/bandit_pass/bandit17
```

**Why this works:** `nc -z` checks if a port is open without sending any data. Once we find the open port, we pipe our password directly into `openssl s_client`. The `-quiet` flag strips away the messy SSL handshake text so we just get the clean private key.
**Password:** `EReVavePLFHtFlFsjn3hyzMlvSuSAcRD`

## Level 17: Spot The Difference 🔍

Two password files exist: `passwords.old` and `passwords.new`. The changed line in `.new` is the password.

```bash
diff passwords.new passwords.old | grep ">"
```

**Why this works:** `diff` compares two files line by line. The `>` points to lines that exist in the first file but not the second. We `grep` for it to instantly see the updated password. Clean and surgical.
**Password:** `x2gLTTjFwMOhQ8oWNbMN362QKxfRqGlO`

## Level 18: The Trapdoor 🕳️

The `.bashrc` has been modified to log you out immediately on login. We bypass it by running a command directly over SSH without starting an interactive shell.

```bash
echo "cat readme" | ssh bandit18@bandit.labs.overthewire.org -p 2220
```

**Why this works:** When you pipe a command into `ssh`, it executes the command and exits before `.bashrc` even has a chance to ruin your day. Total galaxy brain move. 🧠
**Password:** `cGWpMaKXVwDUNgPAVJbWYuGHVn9zl3j8`

## Level 19: Setuid Hijack 🎭

Use a setuid binary (`bandit20-do`) that runs commands as `bandit20`.

```bash
./bandit20-do cat /etc/bandit_pass/bandit20
```

**Why this works:** A setuid (Set User ID) binary runs with the privileges of the file owner, not the person running it. Since `bandit20` owns it, we can use it to `cat` a file that only `bandit20` is allowed to read. Thanks for the free privileges! 🎟️
**Password:** `0qXahG8ZjOVMN9Ghs7iOWsCfZyXOUbYO`

## Level 20: The Reverse Connection 🪃

A setuid binary connects back to a port you are listening on, verifies the current password, and sends back the next one. We need two terminals, so we use `tmux`.

```bash
# Pane 1 (start listener):
tmux
nc -l -p 1234
# Ctrl+B, D  (detach)

# Pane 2 (run the binary):
tmux new-window
./suconnect 1234
# Ctrl+B, D

# Re-attach to pane 1 and paste bandit20 password:
tmux attach -t 0
# paste: 0qXahG8ZjOVMN9Ghs7iOWsCfZyXOUbYO
```

**Why this works:** We use `nc -l -p 1234` to listen on port 1234. In the other window, we run the binary to connect to our listener. `tmux` lets us manage multiple terminal sessions without getting disconnected. Once the connection is made, we feed it the current password and grab our prize.
**Password:** `EeoULMCra2q0dSkYj561DX7s1CpBuOBt`

## Level 21: Cron Job Snooping 🕒

A cron job runs as `bandit22` and writes its password to a temp file. We need to read the cron script to find the file path.

```bash
cat /etc/cron.d/* 2>/dev/null | grep "bandit22"
cat /usr/bin/cronjob_bandit22.sh
cat /tmp/t7O6lds9S0RqQh9aMcz6ShpAoZKF7fgv
```

**Why this works:** Cron jobs are scheduled tasks that run in the background. By digging into `/etc/cron.d/`, we can see exactly what scripts the server is running automatically. We find the script, read it, and it literally tells us where it dumps the password.
**Password:** `tRae0UfB9v0UzbCdn9cY0gQnds9GF58Q`

## Level 22: Hashing It Out 🧩

The cron script generates a filename using an md5 hash of `I am user bandit23`. We reproduce the hash to find the file.

```bash
cat /etc/cron.d/* 2>/dev/null | grep bandit23
cat /usr/bin/cronjob_bandit23.sh

# Reproduce the filename:
echo "I am user bandit23" | md5sum | cut -d ' ' -f 1
# Gives us: 8ca319486bfbbc3663ea0fbe81326349

cat /tmp/8ca319486bfbbc3663ea0fbe81326349
```

**Why this works:** The script is using `md5sum` to create a predictable but weird looking file name. We just run the exact same command to generate the exact same hash. `cut -d ' ' -f 1` grabs only the hash and ignores the rest of the output. 
**Password:** `0Zf11ioIjMVN551jX3CmStKLYqjk54Ga`

## Level 23: The Payload Drop 💣

The cron job for `bandit24` executes and deletes every script placed in `/var/spool/bandit24/foo/`. We drop a script there that writes bandit24's password to `/tmp`, wait 1 minute, and grab it.

```bash
cat /etc/cron.d/* 2>/dev/null | grep bandit24
cat /usr/bin/cronjob_bandit24.sh

# Write the payload script:
echo "cat /etc/bandit_pass/bandit24 > /tmp/dekhoyepass.txt" > /var/spool/bandit24/foo/hello.sh
chmod +x /var/spool/bandit24/foo/hello.sh

# Wait ~60 seconds, then:
cat /tmp/dekhoyepass.txt
```

**Why this works:** The cron job runs as `bandit24`, meaning any script it executes will have `bandit24` privileges! We just write a tiny bash script that copies the password file into `/tmp` where we can read it. `chmod +x` ensures the script is actually executable. Boom. 💥
**Password:** `gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8`

## Level 24: Brute Force 🔨

We have to brute force a 4 digit PIN (0000 to 9999) combined with the password, submitted to port 30002.

```bash
for i in {0..9999}; do echo "gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8 $i"; done | nc localhost 30002
```

**Why this works:** A simple `for` loop generates every single number from 0 to 9999. We format the string exactly how the server wants it and pipe the entire massive list directly into `nc`. The server checks them all at lightning speed and spits out the correct one. Brute force is rarely elegant, but it gets the job done. 🦾
**Password:** `iCi86ttT4KSNe1armKiwbQNmB3YJP3q4`

## Level 25: The Shell Game 🐚

An SSH key for `bandit26` is provided. The trick is that bandit26's shell is not `/bin/bash`.

```bash
ssh -i bandit26.sshkey bandit26@bandit.labs.overthewire.org -p 2220
```

**Why this works:** Standard login using the key. But spoiler alert, things are about to get weird in the next level because of their custom shell.
**Password for bandit26:** `s0773xxkk0MXfdqOfPRVr9L3jJBUOgCZ`

## Level 26: The Great Escape 🏃‍♂️

bandit26's shell is `more` (a pager). If you log in normally, it just closes immediately. Make your terminal window very small so `more` pauses instead of auto exiting, then escape into `vim` to spawn a real shell.

```bash
# 1. Resize terminal to ~5 lines tall
# 2. SSH in. 'more' will pause instead of exiting.
ssh -i bandit26.sshkey bandit26@bandit.labs.overthewire.org -p 2220

# Inside 'more':
v                              # open vim

# Inside vim:
:e /etc/bandit_pass/bandit26   # confirm bandit26 password
:set shell=/bin/bash
:shell                         # spawn bash as bandit26

# Now run the setuid binary for bandit27:
./bandit27-do cat /etc/bandit_pass/bandit27
```

**Why this works:** The `more` command pauses if the text is taller than your terminal window. Once paused, you can press `v` to open `vim` right inside the pager. Vim has a built in command `:shell` that spawns whatever shell is defined in its settings. We set it to `/bin/bash` and suddenly we have broken out of jail. Pure hacker movie stuff. 🕶️
**Password bandit26:** `s0773xxkk0MXfdqOfPRVr9L3jJBUOgCZ`  
**Password bandit27:** `upsNCc7vzaRDx6oZC6GiR6ERwe1MowGB`

## Level 27: Git Good 🐙

Clone a git repo over SSH and read the README.

```bash
# Run from local machine or /tmp:
git clone ssh://bandit27-git@bandit.labs.overthewire.org:2220/home/bandit27-git/repo
cd repo
cat README
```

**Why this works:** `git clone` pulls the entire repository locally. We specify the `ssh://` protocol and the custom port 2220. Easy grab.
**Password:** `Yz9IpL0sBcCeuG7m9uQFt8ZNpS4HZRcN`

## Level 28: Git History 🕰️

The password was committed to a git repo but then redacted. We check the git log for an earlier commit.

```bash
git clone ssh://bandit28-git@bandit.labs.overthewire.org:2220/home/bandit28-git/repo
cd repo
git log --oneline
git show <commit-hash-before-redaction>
```

**Why this works:** Git remembers everything. Even if you delete a file or change a line, the previous version lives forever in the commit history. `git log` shows us the timeline, and `git show` lets us peer into the past to see the password before it was scrubbed.
**Password:** `4pT1t5DENaYuqnqvadYs1oE4QLCdjmJ7`

## Level 29: Branching Out 🌿

The password isn't on the `master` branch, it is hiding on the `dev` branch.

```bash
git clone -b dev --single-branch ssh://bandit29-git@bandit.labs.overthewire.org:2220/home/bandit29-git/repo
cd repo
cat README.md
```

**Why this works:** Git repositories can have multiple parallel branches of code. The `-b dev` flag tells git to specifically clone the `dev` branch instead of the default `master` branch.
**Password:** `qp30ex3VLz5MDG1n91YowTv4Q8l7CDZL`

## Level 30: Tag, You Are It 🏷️

Nothing interesting in commits or branches. The password is stored as a git **tag**.

```bash
git clone ssh://bandit30-git@bandit.labs.overthewire.org:2220/home/bandit30-git/repo
cd repo
git tag
git show secret
```

**Why this works:** Git tags are usually used for version releases (like v1.0.0). However, they can contain custom messages. We use `git tag` to list them, spot one called `secret`, and `git show` reveals the hidden message.
**Password:** `fb5S2xb7bRyFmAvQYQGEqsbhVyJqhnDy`

## Level 31: Push It Real Good 🛒

Push a specific file to the remote repo. `.gitignore` blocks `*.txt`, so remove or empty it first.

```bash
git clone ssh://bandit31-git@bandit.labs.overthewire.org:2220/home/bandit31-git/repo
cd repo
echo 'May I come in?' > key.txt
rm .gitignore && touch .gitignore   # clear gitignore
git add .
git commit -m "add: added a key.txt"
git push
# Server responds with the password
```

**Why this works:** A `.gitignore` file tells git to ignore certain files. By deleting it and replacing it with an empty file, we bypass the restriction, allowing us to commit `key.txt` and push it to the server. The remote server has a script that checks our push and replies with the flag.
**Password:** `3O9RfhqyAlVBEZpVb6LYStshZoqoSx5K`

## Level 32: uppercase SHELL 📢

The shell converts all input to uppercase (UPPERCASE SHELL). `$0` is a special variable that expands to the shell name itself, effectively invoking `/bin/sh` and escaping the restriction.

```bash
$0
cat /etc/bandit_pass/bandit33
```

**Why this works:** `$0` represents the name of the currently running program (the shell). Since `$0` is purely symbols and numbers, it cannot be capitalized! The uppercase shell evaluates it, runs `/bin/sh`, and drops us into a normal, unrestricted shell. 🤯
**Password:** `tQdtbs5D5i2vJwkO8mEyYEyTL8izoeJ0`

## Level 33: The End 🏁

Final level! There are no more challenges beyond this point.

```bash
cat README.txt
# "At this moment, level 34 does not exist yet."
```

And that is an absolute wrap for the entire OverTheWire Bandit wargame! We tore through Linux like it was nothing. Peace out! ✌️

![Peace out](https://i.giphy.com/3o6EhGvKschtbrRjX2.webp)
