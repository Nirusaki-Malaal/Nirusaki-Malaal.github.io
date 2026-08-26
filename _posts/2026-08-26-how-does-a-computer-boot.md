---
layout: post
title: "How Does a Computer Boot?"
description: "A deep dive into the computer boot process: POST routines, reset vectors, 16-bit Real Mode vs 32/64-bit Protected Mode, MBR vs GPT partition layouts, BIOS interrupts, UEFI architecture, ESP FAT filesystem, and Secure Boot key hierarchies."
tags: [Linux, Operating Systems, Computer Architecture, BIOS, UEFI, MBR, GPT, Hardware, Bootloader]
category: linux
image: https://nirusaki.me/assets/img/og/home.png
---

### Overview

Have you ever wondered what happens in the milliseconds between pressing the power button on your computer and seeing the operating system login screen? 

Booting a computer is a carefully orchestrated handoff of control across multiple hardware and software layers. The process moves from low-level silicon initialization to firmware routines, bootloaders, and finally the operating system kernel.

Here is the complete journey of how a computer boots, covering legacy BIOS/MBR mechanics as well as modern UEFI/GPT architectures.

---

### Phase 1: Power On & Power On Self Test (POST)

When you press the power button, the power supply unit (PSU) stabilizes its voltage output and sends a "Power Good" signal to the motherboard. Upon receiving this signal, the CPU is released from its reset state.

#### The Reset Vector

The moment the CPU wakes up, its registers are initialized to default values. In x86 processors, the instruction pointer (`CS:IP` or `RIP`) is set to point to a specific physical address known as the **Reset Vector**:

```asm
JMP F000:E05B
```

This address maps to non-volatile flash memory (ROM/Flash chip) on the motherboard containing the system firmware (BIOS/UEFI).

#### Cold Boot vs. Warm Boot

Memory fetching during boot depends on whether the system is performing a cold boot or a warm boot:

* **Cold Boot**: The machine starts from a completely powered-off state. The Northbridge / memory controller routes initial address fetches directly to the motherboard flash ROM. The firmware executes a full device discovery and hardware initialization from scratch.
* **Warm Boot**: The machine restarts without power being fully cut. Because the RAM retains its power state, the firmware can skip lengthier hardware diagnostic routines for faster POST execution.

#### Hardware Verification & Diagnostic Reporting

Before main system memory (RAM) is even available, the firmware performs a Power On Self Test (POST) directly from the firmware chip.

The POST verifies critical CPU registers by writing and reading alternating bit patterns:

```asm
MOV AX, 0xAAAA ; Binary pattern 1010101010101010
CMP AX, 0xAAAA
JNE HALT_ERROR

MOV AX, 0x5555 ; Binary pattern 0101010101010101
CMP AX, 0x5555
JNE HALT_ERROR
```

If a hardware component fails POST, the system emits diagnostic error codes. Early failures output raw POST code hex bytes to I/O port `0x80` (read by motherboard diagnostic cards) or trigger audible speaker beep codes.

---

### Phase 2: Legacy BIOS & 16-Bit Real Address Mode

Legacy BIOS (Basic Input/Output System) is low-level firmware flashed onto ROM or SPI Flash chips.

#### Real Mode Limitations

BIOS starts execution in **16-bit Real Address Mode**. In Real Mode:
1. Memory addresses map directly to physical RAM without virtual memory abstraction.
2. The CPU is limited to 20-bit address bus calculation (`Segment * 16 + Offset`), restricting maximum accessible memory to **1 MiB**.

Modern operating system bootloaders (such as GRUB2 or Windows Boot Manager) immediately switch the CPU from 16-bit Real Mode to 32-bit Protected Mode or 64-bit Long Mode to access full RAM capacity.

#### BIOS Software Interrupts

BIOS provides hardware abstraction routines invoked via software interrupts (`INT` instructions). For instance, printing a character to the screen using BIOS interrupt `0x10`:

```asm
mov ah, 0x0E ; Function 0x0E: Teletype output
mov al, '!'  ; Character to display
int 0x10     ; Trigger BIOS video service interrupt
```

The BIOS handles the low-level hardware communication, freeing bootloader developers from writing custom disk or display drivers for every hardware variant.

#### Hardware Interrupts & Keyboard Detection

While POST routines run, the motherboard initializes the keyboard controller (PS/2 or USB legacy emulation).

When a user spams keys like `F12` or `DEL` to open setup menus, the keyboard controller sends raw electrical scan codes over hardware interrupt line **IRQ 1**. The CPU pauses its task, jumps to the BIOS interrupt handler, reads the scan code, and opens the BIOS configuration interface.

If no key is pressed within the hardware timing window, the BIOS invokes interrupt `INT 0x19` to initiate disk boot loading.

---

### Phase 3: Master Boot Record (MBR) & Legacy Partitioning

When `INT 0x19` triggers, the BIOS scans storage devices in the configured boot order (stored in non-volatile CMOS SRAM powered by a CR2032 battery).

The BIOS reads the very first sector (Sector 0) of the boot drive into RAM at address `0x0000:0x7C00`. This 512-byte sector is the **Master Boot Record (MBR)**.

![MBR Sector Layout](/assets/img/posts/image_1787684288083_0.png)

#### MBR Structure

The 512-byte MBR sector is strictly partitioned into three sections:

1. **Bootstrap Code Area (446 bytes)**: Contains machine instructions to initialize hardware registers, scan the partition table, and load the active partition bootloader.
2. **Partition Table (64 bytes)**: Holds 4 primary partition entries (16 bytes per entry).
3. **Boot Signature (2 bytes)**: Must contain the magic word bytes `0x55AA` at offset `0x1FE`. If `0x55AA` is missing, the sector is rejected as non-bootable.

#### MBR Limitations

MBR uses 32-bit Logical Block Addressing (LBA) to represent sector counts. With standard 512-byte sector sizes, `2^32 * 512 bytes` yields a maximum disk capacity limit of **2 TiB**, and restricts disks to 4 primary partitions.

Workarounds like Extended Logical Partitions (ELP) linked lists and 4096-byte Advanced Format sectors helped extend MBR life, but created compatibility bottlenecks.

#### Bootstrapping via Volume Boot Record (VBR)

The MBR code does not load the OS kernel directly. Instead, it inspects the partition table, identifies the active partition, and loads that partition's **Volume Boot Record (VBR)**. The VBR then executes the main OS bootloader (e.g., GRUB stage 2).

---

### Phase 4: GUID Partition Table (GPT) & Modern Disk Layout

The **GUID Partition Table (GPT)** is the modern disk partitioning standard introduced alongside UEFI.

![GPT Disk Layout](/assets/img/posts/image_1787692271641_0.png)

#### Features of GPT

1. **64-bit LBA Addressing**: Supports disk capacities up to **8 ZiB** (Zettabytes).
2. **Unlimited Partitions**: Defaults to supporting 128 partitions without requiring extended partition hacks.
3. **UUID Identification**: Every partition and partition type is identified by a Universally Unique Identifier (UUID).
4. **Data Redundancy**: Keeps a secondary backup copy of the GPT header and partition array at the very end of the physical disk.

#### GPT Disk Structure

* **LBA 0 (Protective MBR)**: Contains a dummy legacy MBR partition spanning the whole drive. This prevents legacy disk tools from misidentifying the drive as unpartitioned and overwriting GPT data.
* **LBA 1 (Primary GPT Header)**: Stores disk metadata, unique GUIDs, and pointers to the partition entry array.
* **LBA 2 to 33 (Partition Entry Array)**: Defines partition boundaries, GUIDs, and flags.

---

### Phase 5: Unified Extensible Firmware Interface (UEFI)

**UEFI** is a modern firmware architecture designed from the ground up to replace legacy BIOS.

#### How UEFI Booting Works

Unlike legacy BIOS (which loads raw executable machine code from sector 0 into 16-bit Real Mode memory), UEFI operates like a lightweight operating system running in 32-bit or 64-bit mode.

UEFI includes built-in file system drivers capable of reading FAT filesystems (FAT12, FAT16, FAT32).

#### The EFI System Partition (ESP)

UEFI looks for a dedicated FAT32 partition called the **EFI System Partition (ESP)**. Inside the ESP, bootloader executables are stored as standard 32-bit or 64-bit **PE32+ (Portable Executable)** files ending in `.efi`.

You can view installed `.efi` bootloaders on a Linux system:

```bash
ls /boot/efi/EFI/archlinux
# Output: grubx64.efi
```

#### Boot Entries & NVRAM

UEFI does not rely on scanning physical active flags. Instead, it queries motherboard NVRAM variables (`efibootmgr` on Linux) which store exact paths to bootloader `.efi` binaries:

```text
BootCurrent: 0000
BootOrder: 0000,2001,2002
Boot0000* archlinux HD(1,GPT,39fdeb24...)/\EFI\archlinux\grubx64.efi
```

If NVRAM is cleared or a removable drive is inserted, UEFI falls back to a hardcoded default executable path:

```text
\EFI\BOOT\BOOTX64.EFI
```

---

### Phase 6: Secure Boot Architecture

Secure Boot is a UEFI security protocol designed to prevent bootkits and unauthorized rootkits from loading during boot.

Secure Boot establishes a cryptographic chain of trust using a key hierarchy:

1. **Platform Key (PK)**: The master key installed by the motherboard manufacturer, establishing root ownership of the firmware.
2. **Key Exchange Key (KEK)**: Signed by the PK, used to authenticate updates to the signature database.
3. **Signature Database (`db`)**: An allow-list containing public certificates of authorized operating system bootloaders (such as Microsoft or Red Hat signing authorities).
4. **Forbidden Signature Database (`dbx`)**: A revocation list containing hashes of compromised bootloaders blocked from executing.

When the machine powers on, UEFI verifies the cryptographic signature of the `.efi` bootloader against `db` before passing control to the kernel.

---

### Summary: BIOS vs. UEFI & MBR vs. GPT

| Feature | Legacy BIOS / MBR | Modern UEFI / GPT |
| :--- | :--- | :--- |
| **CPU Execution Mode** | 16-bit Real Address Mode (1 MiB memory limit) | 32-bit or 64-bit Protected Mode |
| **Max Disk Capacity** | 2 TiB limit | 8 ZiB (Zettabytes) |
| **Partition Limit** | 4 Primary Partitions | 128+ Partitions |
| **Boot Mechanism** | Loads raw sector 0 (MBR) to `0x7C00` | Mounts FAT32 ESP and executes `.efi` PE32+ binaries |
| **Configuration Storage** | Volatile CMOS SRAM (CR2032 battery) | Non-volatile NVRAM variables |
| **Boot Security** | None (Vulnerable to MBR bootkits) | Cryptographic Secure Boot (`PK`, `KEK`, `db`, `dbx`) |

Understanding how the boot sequence progresses from power-on to kernel initialization is essential for low-level system debugging, OS installation, storage partitioning, and firmware security.
