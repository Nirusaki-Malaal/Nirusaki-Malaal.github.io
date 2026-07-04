---
layout: post
title: "TCP-IP and OSI Model"
description: "A raw, unfiltered breakdown of network protocols, layers, and the encapsulation process."
tags: [Linux, Networking, Sysadmin, CLI]
math: true
category: linux
image: https://nirusaki.me/assets/img/og/tcp-ip-and-osi-model.png
---

Have you ever wondered how the fuck this internet works? Yeah, let me tell you, it is pretty damn complex, but we are going to break it down without the boring textbook bullshit.

![Network Pepe](https://media.tenor.com/No9Xk16W9HIAAAAM/pepe-internet.gif)

---

### 1. Protocols and Standards

In any network, communication relies on two main things:

*   **Protocols** are just a set of rules about how data should be formatted and communicated.
*   **Standards** are the agreed-upon specifications that describe how a protocol should work. This is the fucking reason why Apple devices can communicate with Linux servers without throwing a fit.

---

### 2. The TCP-IP Layer Model

The TCP-IP stack divides networking responsibilities into five layers. Here is the breakdown:

| Layer | Use | Key Protocols |
| :--- | :--- | :--- |
| **Application Layer** | Protocols for communication between applications | HTTP, HTTPS, SSH, DNS |
| **Transport Layer** | Provides end-to-end communication between applications and ports | TCP, UDP |
| **Internet Layer** | Provides end-to-end communication between hosts and networks using IP addresses | IP (IPv4, IPv6), ICMP |
| **Local Network Layer** | Provides hop-to-hop delivery in a Local Area Network (LAN) | Ethernet, ARP |
| **Physical Layer** | Deals with electrical bits, light in optical fibers, chipsets, etc. | RJ45, Fiber Optics |

---

### 3. Encapsulation and Decapsulation

As data travels down the stack from the sender, each layer wraps the payload with control headers. This is **Encapsulation** (packing a box inside a box inside another fucking box). When the recipient receives the data, it reverses the process, stripping the headers as it goes up the stack, which is **Decapsulation**.

Here is how data changes at each stage:

1.  **Data** (Level 5 or 7): Raw application data.
2.  **Segment** (Layer 4): The Transport Layer adds an L4 Header (TCP/UDP port information).

$$ \text{Segment} = \text{L4 Header} + \text{Data} $$

3.  **Packet** (Layer 3): The Internet Layer adds an L3 Header (IP address).

$$ \text{Packet} = \text{L3 Header} + \text{Segment} $$

4.  **Frame** (Layer 2): The Local Network Layer adds an L2 Header (MAC addresses) and an L2 Trailer.

$$ \text{Frame} = \text{L2 Header} + \text{Packet} + \text{L2 Trailer} $$

5.  **Electrical Bits** (Layer 1): The Physical Layer converts the frame into electrical bits to transfer over the wire.

Segment, packet, and frame are collectively called **PDUs** (Protocol Data Units) of Layer X.

---

### 4. Peer-to-Peer Interaction

In two systems, each layer logically interacts with its own equivalent. The transport layer on System A communicates only with the transport layer on System B, relying on the lower layers to handle the actual transit.

---

### 5. The 7-Layer OSI Model

While TCP-IP is the most widely used model, the academic **7-Layer OSI Model** is still used for reference:

1.  **Application**
2.  **Presentation** (Extra)
3.  **Session** (Extra)
4.  **Transport**
5.  **Network**
6.  **Data Link**
7.  **Physical**

---

### The Extra OSI Layers Explained

If you compare the two, the OSI model has two extra layers sandwiched between the Transport and Application layers. Here is what the fuck they actually do:

*   **Presentation Layer (Layer 6):** This layer acts as a data translator. It takes care of formatting, compressing, and encrypting data so that the Application layer can actually read it. Think of it as translating raw EBCDIC to ASCII, compressing JPEGs, or wrapping raw payloads in SSL/TLS encryption.
*   **Session Layer (Layer 5):** This layer handles setting up, managing, and tearing down communication sessions between applications on different systems. It coordinates the dialog control (half-duplex or full-duplex) and handles checkpoints so that if a massive download fails mid-transit, it can resume from the last checkpoint instead of starting the whole shit over again.

#### Why did TCP/IP collapse them?
In the real world, developers wanted to handle data compression, encryption (like TLS/SSL), and session state logic directly inside the applications they write, instead of forcing the operating system's kernel network stack to deal with it. So, the TCP/IP designers collapsed Session, Presentation, and Application into one big, flexible **Application Layer**.

---

That's all for today's lesson. Go grab a coffee or something.

sayonara... signing out
