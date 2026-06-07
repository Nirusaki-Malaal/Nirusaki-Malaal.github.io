---
layout: post
title: "Cracking OverTheWire: Bandit Walkthrough (0 to 15)"
description: "A sick speedrun walkthrough of OverTheWire Bandit wargame covering levels 0 through 15."
tags: [Security, CTF, OverTheWire, Bandit, Linux, Bash]
---

What is good hackers! Today we are diving into the OverTheWire Bandit wargame. We are doing a full speedrun of the first 15 levels. I cranked this out in record time so you do not have to struggle. Let's get right into the terminal and crack some passwords! 💻🔥

![Hacker Typing](https://media.giphy.com/media/YQitE4YNQBroM/giphy.gif)

## Level 0: The Front Door 🚪

The first challenge is literally just getting in. We are given the login credentials and need to read a file called `readme`. 

```bash
ssh bandit0@bandit.labs.overthewire.org -p 2220
cat readme
```

**Why this works:** `ssh` is the Secure Shell protocol. We connect to their server on port 2220 (because port 22 is too mainstream, right?). Once we are in, `cat` just spits out the contents of the file directly to our screen. Too easy.

**Password:** `ZjLjTmM6FvvyRnrb2rfNWOZOTa6ip5If`

## Level 1: The Dashed File 🕵️‍♂️

Now they are trying to be sneaky. The file is named `-`. If you just type `cat -`, the terminal thinks you want it to read from standard input and just stares blankly at you like a total idiot.

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

**Why this works:** Wrapping the whole thing in quotes tells bash that everything inside is a single string. It forces the terminal to treat the entire mess as one file name. You could also escape the spaces with backslashes, but quotes are way cleaner.

**Password:** `MNk8KNH3Usiio41PRUEoDFPqfxLPlSmx`

## Level 3: Playing Hide and Seek 👻

The file is hidden in a directory. We know that files starting with a dot `.` are hidden by default in Linux.

```bash
cat ./*
# Or if you want to be precise:
cat ./"...Hiding from you"
```

**Why this works:** The `*` is a wildcard that grabs everything it can. However, usually `*` skips hidden files. The cool trick here is that if you know the file starts with dots, you can just type it out, or use `ls -la` to reveal its dirty secrets first. 

**Password:** `2WmrDFRmJIq3IPxneAaMGhap0pFhF3NJ`

![Sneaky](https://media.giphy.com/media/B2ux3sWFBd1c6EEqWE/giphy.gif)

## Level 4: The ASCII Needle in a Hex Stack 🧲

We have a bunch of files, but only one is human readable. The rest are straight garbage binary.

```bash
file ./* | grep "ASCII"
cat ./-file07
```

**Why this works:** The `file` command is a lifesaver. It actually looks inside the file to determine what kind of data it holds, ignoring whatever the file extension claims to be. `grep "ASCII"` filters the massive output down to the one file that contains plain text. Then we just `cat` it. Easy money. 💸

**Password:** `4oQYVPkxZOOEOO5pTW81FB8j8lxXGUQw`

## Level 5: Size Matters 📏

Now we have to find a file that is exactly 1033 bytes, not executable, and human readable.

```bash
find . -type f -size 1033c
# Or using disk usage:
du -ab | grep 1033
```

**Why this works:** `find` is the ultimate search tool. `-type f` means look for files, and `-size 1033c` looks for exactly 1033 bytes (the `c` stands for bytes). It instantly points us to the right file hiding in a massive directory tree.

**Password:** `HWasnPhtq9AVKe0dmk45nxy20cvUa6EG`

## Level 6: The Server Wide Hunt 🌍

The file is somewhere on the entire server. It is owned by `bandit7`, group `bandit6`, and is 33 bytes. This means we will hit a lot of "Permission denied" errors while searching.

```bash
cd /
find . -type f -size 33c -user bandit7 -group bandit6 2>/dev/null
```

**Why this works:** We start our search at the root directory `/`. The absolute magic here is `2>/dev/null`. In Linux, file descriptor 2 is standard error. By pointing it to `/dev/null` (which is basically a black hole), we silence all those annoying "Permission denied" errors and only see the one successful match. Absolute cinema. 🍿

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

# ... and it goes on and on ...
```

**Why this works:** The `xxd -r` command takes a hex dump and converts it back into actual binary data. From there, we are caught in a painful loop of using `file` to see what kind of compression was used, renaming the file to the right extension, and running the proper decompression tool (`gzip -d`, `bzip2 -d`, `tar -xvf`). It is tedious but deeply satisfying once you break out. 

**Password:** `FO5dwFsc0cbaIiH0h8J2eUks2vdTDwAn`

![Exhausted](https://media.giphy.com/media/zCj7oCAtsKyeA/giphy.gif)

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

![Hackerman](https://media.giphy.com/media/V4NSR1NG2p0KeTXHT4/giphy.gif)

And that is a wrap for the first 15 levels! Stay tuned for the rest of the run where things start getting properly nasty. Peace out! ✌️
