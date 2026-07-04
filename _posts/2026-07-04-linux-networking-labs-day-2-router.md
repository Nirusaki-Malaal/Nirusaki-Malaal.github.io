---
layout: post
title: "Lab - 2: Linux Networking Labs - Creating a Virtual Router"
description: "How to configure a virtual router using Linux network namespaces and enable IP forwarding between different subnets."
tags: [Linux, Networking, Sysadmin, CLI]
category: linux
image: https://nirusaki.me/assets/img/og/linux-networking-labs-day-2-router.png
---

Welcome back, my fellow terminal junkies. Today we are going to build a virtual router. Now, what the fuck is a router?

A router is just a PC or a network device that forwards packets to different computers. Unlike a Layer 2 switch which acts like a dumb pipe forwarding frames in a local network using MAC addresses, a router works at Layer 3. It doesn't give a shit about the data itself; it just looks at the destination IP address and forwards the packet to the next hop.

Let's build a virtual router inside Linux using network namespaces.

![Plugging in Cables](https://media.tenor.com/eRi6vI6hrykAAAAd/mrr-rrobot-elliotalderson.gif)

---

### Step 1: Create the Router Namespace

First, let's create a new network namespace named `router1`:

```bash
sudo ip netns add router1
```

---

### Step 2: Configure the loopback interface

Every host needs its loopback interface up, including our virtual router:

```bash
sudo ip netns exec router1 ip link set lo up
```

---

### Step 3: Enable IP Forwarding

This is the most important step. By default, the Linux kernel is configured to drop any packets arriving on an interface that aren't addressed to the local machine (for safety, you know). To make our namespace act as a router, we have to enable IP forwarding to tell the kernel: "Hey, if a packet arrives here, forward the shit to the right interface."

```bash
sudo ip netns exec router1 sysctl -w net.ipv4.ip_forward=1
```

*   `sysctl` is a command used to change kernel variables at runtime.
*   `-w` writes the setting.
*   `net.ipv4.ip_forward=1` configures the IPv4 stack to route packets to different subnets based on the routing table. Without this, your router is just a useless, isolated space that drops everything.

---

### Homework

Write a Python or Bash script to automate this setup process.

bye... signing out
