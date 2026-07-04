---
layout: post
title: "Lab - 2: Linux Networking Labs - Creating a Virtual Router"
description: "How to configure a virtual router using Linux network namespaces and enable IP forwarding between different subnets."
tags: [Linux, Networking, Sysadmin, CLI]
category: linux
image: https://nirusaki.me/assets/img/og/linux-networking-labs-day-2-router.png
---

### Day - 2 Lab: Creating a Router

A router is just a PC or a network device that forwards packets to different computers. Unlike a switch, it doesn't receive any frames for itself; it just looks at the destination IP address and forwards it to the next hop.

Let's build a virtual router inside Linux using network namespaces.

---

### Step 1: Create the Router Namespace

First, let's create a new namespace named `router1`:

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

This is the key step. By default, the Linux kernel drops any packets arriving on an interface that aren't addressed to the local machine. We need to enable IP forwarding to tell the kernel: "Hey, if a packet arrives here, forward the shit to the right next interface."

```bash
sudo ip netns exec router1 sysctl -w net.ipv4.ip_forward=1
```

This configure the kernel to route packets to different subnets based on the routing table.

---

### Homework

Write a Python or Bash script to automate this setup process.

![Router Setup](https://media.tenor.com/eRi6vI6hrykAAAAd/mrr-rrobot-elliotalderson.gif)

bye... signing out
