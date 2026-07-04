---
layout: post
title: "Lab - 3: Linux Networking Labs - Encapsulation and Sniffing"
description: "How to tap virtual network links using tcpdump to analyze ARP resolving and ICMP packet encapsulation layers."
tags: [Linux, Networking, Sysadmin, CLI]
category: linux
image: https://nirusaki.me/assets/img/og/linux-networking-labs-day-3-packet-analysis.png
---

Welcome to Day 3. Today, we are going to see the encapsulation and decapsulation of the TCP/IP model in action. We'll use the exact same network topology we built on Day 1: 2 PCs and one switch in Linux. Let's dig in.

![Switch Active](https://media.tenor.com/OQF2CQfjiG8AAAAC/mr-robot.gif)

First, we need to learn how to tap the ethernet wire so that we can look inside the frames. We're going to use ping again. Make sure you are using the same topology:
*   `pc1` -> Network Namespace 1 (IP: `192.168.1.1`)
*   `pc2` -> Network Namespace 2 (IP: `192.168.1.2`)
*   `sw1` -> Virtual Bridge Switch

---

### How to Tap the Network

We are going to use a package named `tcpdump` to listen on the switch:

```bash
sudo tcpdump -i sw1 -e -vvv -X -n
```

**Flag Breakdown:**
*   `-i sw1`: Specifies the interface to listen on (our bridge/switch `sw1`).
*   `-e`: Prints the link-level Ethernet header (MAC addresses).
*   `-vvv`: Set verbosity level to maximum.
*   `-X`: Prints hex and ASCII bytes side-by-side.
*   `-n`: Disables DNS resolution to prevent slow lookups.

---

### Flow Data and Analyze

Open another terminal and ping `pc2` from `pc1`:

```bash
sudo ip netns exec pc1 ping -c 1 192.168.1.2
```

In the tcpdump terminal, you will see the output stream:

```apl
tcpdump: listening on sw1, link-type EN10MB (Ethernet), snapshot length 262144 bytes
08:42:59.528989 8e:3e:51:86:a4:05 > 02:ca:ee:27:fa:15, ethertype IPv4 (0x0800), length 98: (tos 0x0, ttl 64, id 28248, offset 0, flags [DF], proto ICMP (1), length 84)
    192.168.1.1 > 192.168.1.2: ICMP echo request, id 2443, seq 1, length 64
    0x0000:  4500 0054 6e58 4000 4001 48fd c0a8 0101  E..TnX@.@.H.....
    0x0010:  c0a8 0102 0800 52aa 098b 0001 3b7a 486a  ......R.....;zHj
    0x0020:  0000 0000 5112 0800 0000 0000 1011 1213  ....Q...........
    0x0030:  1415 1617 1819 1a1b 1c1d 1e1f 2021 2223  .............!"#
    0x0040:  2425 2627 2829 2a2b 2c2d 2e2f 3031 3233  $%&'()*+,-./0123
    0x0050:  3435 3637                                4567

08:42:59.529013 02:ca:ee:27:fa:15 > 8e:3e:51:86:a4:05, ethertype IPv4 (0x0800), length 98: (tos 0x0, ttl 64, id 43466, offset 0, flags [none], proto ICMP (1), length 84)
    192.168.1.2 > 192.168.1.1: ICMP echo reply, id 2443, seq 1, length 64
    0x0000:  4500 0054 a9ca 0000 4001 4d8b c0a8 0102  E..T....@.M.....
    0x0010:  c0a8 0101 0000 5aaa 098b 0001 3b7a 486a  ......Z.....;zHj
    0x0020:  0000 0000 5112 0800 0000 0000 1011 1213  ....Q...........
    0x0030:  1415 1617 1819 1a1b 1c1d 1e1f 2021 2223  .............!"#
    0x0040:  2425 2627 2829 2a2b 2c2d 2e2f 3031 3233  $%&'()*+,-./0123
    0x0050:  3435 3637 
```

As you can see, there is an ICMP echo request sent to the target IP address through the switch. But the switch also needs the MAC address. To populate the MAC address table, it uses **ARP-Request** and **ARP-Reply** to resolve the MAC address first:

```apl
08:43:05.026567 02:ca:ee:27:fa:15 > 8e:3e:51:86:a4:05, ethertype ARP (0x0806), length 42: Ethernet (len 6), IPv4 (len 4), Request who-has 192.168.1.1 tell 192.168.1.2, length 28
    0x0000:  0001 0800 0604 0001 02ca ee27 fa15 c0a8  ...........'....
    0x0010:  0102 0000 0000 0000 c0a8 0101            ............

08:43:05.026581 8e:3e:51:86:a4:05 > 02:ca:ee:27:fa:15, ethertype ARP (0x0806), length 42: Ethernet (len 6), IPv4 (len 4), Request who-has 192.168.1.2 tell 192.168.1.1, length 28
    0x0000:  0001 0800 0604 0001 8e3e 5186 a405 c0a8  .........>Q.....
    0x0010:  0101 0000 0000 0000 c0a8 0102            ............

08:43:05.026649 8e:3e:51:86:a4:05 > 02:ca:ee:27:fa:15, ethertype ARP (0x0806), length 42: Ethernet (len 6), IPv4 (len 4), Reply 192.168.1.1 is-at 8e:3e:51:86:a4:05, length 28
    0x0000:  0001 0800 0604 0002 8e3e 5186 a405 c0a8  .........>Q.....
    0x0010:  0101 02ca ee27 fa15 c0a8 0102            .....'......

08:43:05.026658 02:ca:ee:27:fa:15 > 8e:3e:51:86:a4:05, ethertype ARP (0x0806), length 42: Ethernet (len 6), IPv4 (len 4), Reply 192.168.1.2 is-at 02:ca:ee:27:fa:15, length 28
    0x0000:  0001 0800 0604 0002 02ca ee27 fa15 c0a8  ...........'....
    0x0010:  0102 8e3e 5186 a405 c0a8 0101 
```

The first two are the ARP-Request and ARP-Reply. Without this, the switch wouldn't know where the fuck to send the frame.

---

### Mapping to TCP/IP and OSI Layers

Let's dissect this captured packet and map it to both the standard TCP/IP stack and the academic 7-layer OSI model:

*   **Layer 1 (OSI Physical):** The raw binary stream transmitted on the wire (displayed in our hex blocks).
*   **Layer 2 (OSI Data Link / TCP-IP Local Network):** Handling frame transit via hardware MAC addresses.
    *   Source MAC: `8e:3e:51:86:a4:05`
    *   Destination MAC: `02:ca:ee:27:fa:15`
    *   Ethertype: `0x0800` (IPv4) or `0x0806` (ARP)
*   **Layer 3 (OSI Network / TCP-IP Internet):** Routing logic.
    *   Source IP: `192.168.1.1`
    *   Destination IP: `192.168.1.2`
    *   Protocol: `ICMP (1)`
*   **Layer 4 (OSI/TCP-IP Transport):** End-to-end communication context. Since ICMP handles its own diagnostics, it operates as a control protocol directly over IP without using TCP or UDP ports.
*   **Layer 5 (OSI Session - COLLAPSED in TCP-IP):** Coordinates the communication session dialog. Since TCP/IP collapses this, the session state is managed directly by the `ping` application logic.
*   **Layer 6 (OSI Presentation - COLLAPSED in TCP-IP):** Translates raw binary data into a readable format. For our ping command, formatting the byte sequence (`0x1011 1213...`) into readable output strings is handled in application space.
*   **Layer 7 (OSI Application / TCP-IP Application):** The user-facing program itself, which is the CLI `ping` binary.

![Ping Success](https://media.tenor.com/gmCeby9sEi8AAAAC/mr-robot-elliot-alderson.gif)

byee.. signing out
