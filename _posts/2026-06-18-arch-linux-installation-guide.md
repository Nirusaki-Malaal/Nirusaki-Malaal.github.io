---
layout: post
title: "I Use Arch BTW: The Ultimate Arch Linux Installation Guide"
description: "A complete step-by-step walkthrough on installing Arch Linux, setting up audio, Bluetooth, graphics, XFCE, Hyprland, Niri, Noctalia dots, and enabling the AUR."
tags: [Linux, Arch Linux, Installation, Guide, Hyprland, Niri]
---

So, you may have heard about the legendary meme "I USE ARCH BTW". Why is this even a meme? Well, the reason actually hides behind the complexity of installing and setting up the operating system.

As a Linux user, I really like Arch Linux because of its customization and how I can run any desktop environment with any stack I want. Like, if I want only Plasma Wayland, I don't need to install X11. Heck yeah, I can do it, and it will be fully de-bloated compared to other operating systems.

In this guide, I am not only going to show you how to install Arch Linux, but also explain the reasoning behind each command. So setup a VM and follow these steps!

![Homer Typing](https://i.giphy.com/13HgwGsXF0aiGY.webp)

---

## Connecting to Wi-Fi

The Arch Linux disk image is completely vanilla. It does not come with any desktop environment or any GUI, so you need to download every package from the internet. To connect to the internet, we will use the `iwctl` utility.

Run the utility:
```bash
iwctl
```
Expected output:
```
Waiting for IWD network service...
[iwd]#
```

Now, connect to your Wi-Fi network (replace `wlan0` with your Wi-Fi interface and `YourWiFiSSID` with your actual network name):
```bash
station wlan0 connect YourWiFiSSID
```
Expected prompt:
```
Type passphrase:
```

Enter your passphrase, hit Enter, and boom! Your internet is connected. You can exit the utility by typing `exit`.

Check if the internet is actually working by pinging Google:
```bash
ping -c 4 google.com
```
Expected output:
```
PING google.com (142.250.190.46) 56(84) bytes of data.
64 bytes from 142.250.190.46: icmp_seq=1 ttl=115 time=12.4 ms
64 bytes from 142.250.190.46: icmp_seq=2 ttl=115 time=11.8 ms
64 bytes from 142.250.190.46: icmp_seq=3 ttl=115 time=14.1 ms
64 bytes from 142.250.190.46: icmp_seq=4 ttl=115 time=12.9 ms

--- google.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 11.821/12.812/14.112/0.844 ms
```

---

## Partitioning: The Dangerous Zone

This is a very crucial step and dangerous as well. Be extremely careful about how you partition your system. If you are dual-booting, doing this wrong may end up leaving your system in a soft-brick state.

![Here we go again](https://i.giphy.com/EldfUB6ptZ30KzQn2R.webp)

Generally, we want to create three partitions:
1. **Bootloader Partition (EFI):** Usually 512MB, formatted as FAT32. It stores the bootloader.
2. **Swap Partition:** Used for virtual memory. The community standard is twice your RAM size (e.g., 32GB if you have 16GB of RAM).
3. **Root Partition:** Holds your actual operating system files. It takes up the rest of the storage.

Wait, what is a bootloader anyway?

### The Bootloader

A bootloader is a program used to load the operating system. Think of it as an operating system starter. We will keep it simple: you do not need to understand exactly how a bootloader works under the hood to install Arch Linux. Common examples include GRUB, systemd-boot, Windows Boot Manager, and Limine. We will be using GRUB because it is one of the oldest, most reliable, and has the best theme support.

### How to Create Partitions

First, we need to divide the space on our drive using `cfdisk`. But first, we need the device ID of your drive. How do we get that?

Run `lsblk`:
```bash
lsblk
```
Expected output:
```
NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
loop0         7:0    0  73.9M  1 loop /run/archiso/airootfs
sda           8:0    0 931.5G  0 disk 
nvme0n1     259:0    0 953.9G  0 disk 
```

Identify your storage device ID by looking at the storage size. In this example, `/dev/nvme0n1` is our NVMe SSD in slot 1 (where `dev` stands for device and `nvme0n1` stands for slot 1).

Run `cfdisk` on your target drive:
```bash
cfdisk /dev/nvme0n1
```
Expected output: An interactive terminal interface.

Now you will see the interface. I want you to start resizing the free space. If you are dual-booting and coming from Windows, make sure you have shrunk your Windows partition to leave at least 100GB of free space. If you have not done this, stop here, reboot back into Windows, shrink your partition, and boot back into the installer.

Create three partitions in the free space:
1. Create a partition of **512MB** (select primary, set type to "EFI System").
2. Create a partition with twice your RAM size (e.g., **32GB** if you have 16GB RAM) (set type to "Linux swap").
3. Create a final partition with the rest of the available storage (set type to "Linux filesystem").

Select **Write**, type `yes` to confirm, and then select **Quit**.

### Formatting the Partitions

Now we need to format these partitions into specific file systems. Run `lsblk` again to check your new partition IDs:
```bash
lsblk
```
Expected output:
```
NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
nvme0n1     259:0    0 953.9G  0 disk 
├─nvme0n1p1 259:1    0   512M  0 part 
├─nvme0n1p2 259:2    0    32G  0 part 
└─nvme0n1p3 259:3    0 921.4G  0 part 
```

In this example:
* `/dev/nvme0n1p1` is the EFI bootloader partition.
* `/dev/nvme0n1p2` is the Swap partition.
* `/dev/nvme0n1p3` is the Root partition.

Let's format the EFI/bootloader partition to FAT32. `mkfs` stands for make filesystem:
```bash
mkfs.fat -F 32 /dev/nvme0n1p1
```
Expected output:
```
mkfs.fat 4.2 (2021-01-31)
```

Now let's format the Root partition where our operating system will live. We will format it as ext4 (if you want to use btrfs, just replace `ext4` with `btrfs` in the command):
```bash
mkfs.ext4 /dev/nvme0n1p3
```
Expected output:
```
mke2fs 1.47.0 (5-Feb-2024)
Discarding device blocks: done                            
Creating filesystem with 241515520 4k blocks and 60383232 inodes
Filesystem UUID: a7d2e46b-871d-4eb7-a4b5-5591fc726ff2
Superblock backups stored on blocks: 
	32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208, 
	4096000, 7962624, 11239424, 20480000, 23887872, 71663616, 78675968, 
	102400000, 214990848

Allocating group tables: done                            
Writing inode tables: done                            
Creating journal (262144 blocks): done
Writing superblocks and filesystem accounting information: done
```

Finally, set up and format the Swap partition:
```bash
mkswap /dev/nvme0n1p2
```
Expected output:
```
Setting up swapspace version 1, size = 32 GiB (34359734272 bytes)
no label, UUID=bc98da5f-d421-42ab-8c9e-52f1b4028c2e
```

---

## Mounting the Partitions

What the heck is a mount point? Chill dude, it is very simple. A partition exists physically on the hardware. How does the operating system access the hardware, and how do we control read/write permissions for different users?

We create a folder that links the hardware to the software. This is called a mount point. In simple terms, it is just a folder you open to access your partition. In Windows, mount points are assigned automatically as drive letters like C:, D:, or E:. Linux mounting is way superior because Windows is limited to 26 drive letters, while Linux can have infinite mount points since they are just folders!

We need to create the folders for our root and bootloader, and then mount them.

First, we mount our root partition (which is `/dev/nvme0n1p3`) to `/mnt` (this directory is already created in the live installer):
```bash
mount /dev/nvme0n1p3 /mnt
```

Now, create the directory for the bootloader mount point and mount the EFI partition (`/dev/nvme0n1p1`) there:
```bash
mkdir -p /mnt/boot/efi
mount /dev/nvme0n1p1 /mnt/boot/efi
```

Finally, enable the swap partition:
```bash
swapon /dev/nvme0n1p2
```

---

## Installing the Base System

Now we come to the main step: installing the operating system inside our root folder. We do this using a very simple command called `pacstrap`.

![Big Smoke Ordering](https://i.giphy.com/1WqyCAvVDu6x57x9t5.webp)

Run `pacstrap` to install the base system along with essential packages:
```bash
pacstrap /mnt base linux linux-firmware linux-headers sof-firmware base-devel grub git man-db efibootmgr nano networkmanager sudo intel-ucode
```
Expected output: A long list of packages being downloaded and installed.

Here is a breakdown of what these packages actually do:
* `base`, `linux`, `linux-firmware`, `linux-headers`: These provide the Linux kernel and minimal system utilities.
* `sof-firmware`: Provides firmware support for sound cards and audio output.
* `base-devel`: Contains basic compilation tools like the GCC compiler and Make.
* `grub`: The bootloader software.
* `git`: Version control (optional, but highly recommended).
* `man-db`: Contains manual pages so you can look up command options.
* `efibootmgr`: EFI Boot Manager, needed for GRUB to register itself with your motherboard.
* `sudo`: Gives you administrator access in a safe, controlled way.
* `intel-ucode`: CPU microcode updates for Intel processors. (If you are running an AMD CPU, replace this with `amd-ucode`).
* `nano`: A simple, user-friendly terminal-based text editor.

---

## Generating the File System Table (fstab)

Don't chase too much depth on this one. The `fstab` file tells your system which partitions to mount and how to mount them at boot.

Generate the `fstab` file:
```bash
genfstab -U /mnt > /mnt/etc/fstab
```

This command looks at the current mounting configurations under `/mnt` and writes them into our newly installed operating system configuration.

## Logging in (Chrooting) into the New System

Now we are going to log in to our new operating system:
```bash
arch-chroot /mnt
```
Expected output:
```
[root@archiso /]# 
```

You will notice that your prompt has changed to a pound/hashtag (`#`). You have successfully shifted yourself from the installer USB stick into your newly installed operating system!

---

## Basic System Configurations

### Time Zone

Set your timezone (replace `Asia/Kolkata` with your actual location):
```bash
ln -sf /usr/share/zoneinfo/Asia/Kolkata /etc/localtime
```

Sync your hardware clock to the system time:
```bash
hwclock --systohc
```

### Localization (Language and Keyboard)

Now we need to configure our language (locale). Open `/etc/locale.gen` using nano:

![Bart Chalkboard](https://i.giphy.com/3o6MbcV3ma4KBq7V6g.webp)
```bash
nano /etc/locale.gen
```

You will see a list of different languages with different encoding formats. If you use English, scroll down to `en_US.UTF-8 UTF-8` and uncomment it by removing the `#` from the beginning of the line. Save it by pressing `ctrl+o`, hit Enter, and exit with `ctrl+x`.

Generate the locales:
```bash
locale-gen
```
Expected output:
```
Generating locales...
  en_US.UTF-8... done
Generation complete.
```

Create the locale configuration file:
```bash
nano /etc/locale.conf
```
Add this line:
```
LANG=en_US.UTF-8
```
Save and exit (`ctrl+o`, Enter, `ctrl+x`).

If you want to configure your keyboard layout, create `/etc/vconsole.conf`:
```bash
nano /etc/vconsole.conf
```
Add the layout you want:
```
KEYMAP=us
```
Save and exit (`ctrl+o`, Enter, `ctrl+x`).

### Root Password

You do not want any random person messing with your system files. Set a root password:
```bash
passwd
```
Expected output:
```
New password: 
Retype new password: 
passwd: password updated successfully
```

### Creating Your User Account

Now, let's create a regular user account so we don't have to run as root all the time. Replace `nirusaki` with your username:
```bash
useradd -m -G wheel -s /bin/bash nirusaki
passwd nirusaki
```
Expected output:
```
New password: 
Retype new password: 
passwd: password updated successfully
```

This creates a user account with a home directory (`-m`) and adds them to the `wheel` group (`-G wheel`), which has access to administrator commands.

### Enabling Sudo for Your User

If you want to install programs or modify system settings later, you will need root access. Sudo gives you root access only for that specific command, which protects your system.

![Panic Computer](https://i.giphy.com/xT5LMHxhOfscxPfIfm.webp)

Open the sudo configuration file:
```bash
EDITOR=nano visudo
```

Scroll down until you find the following line and uncomment it by removing the `#` at the start:
```
%wheel ALL=(ALL:ALL) ALL
```
Save and exit (`ctrl+o`, Enter, `ctrl+x`). Now, any user in the `wheel` group can run commands with `sudo`.

### Enabling NetworkManager

Enable the NetworkManager system service so that your internet connects automatically when your computer boots:
```bash
systemctl enable NetworkManager
```
Expected output:
```
Created symlink /etc/systemd/system/multi-user.target.wants/NetworkManager.service -> /usr/lib/systemd/system/NetworkManager.service.
Created symlink /etc/systemd/system/dbus-org.freedesktop.nm-dispatcher.service -> /usr/lib/systemd/system/nm-dispatcher.service.
```

---

## Bootloader & Drivers Installation

### Installing the GRUB Bootloader

Now we install the bootloader to our EFI partition:
```bash
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=GRUB
```
Expected output:
```
Installing for x86_64-efi platform.
Installation finished. No error reported.
```

Next, generate the GRUB configuration file. This tells the bootloader what operating systems are installed and what settings to enable/disable:
```bash
grub-mkconfig -o /boot/grub/grub.cfg
```
Expected output:
```
Generating grub configuration file ...
Found linux image: /boot/vmlinuz-linux
Found initrd image: /boot/intel-ucode.img /boot/initramfs-linux.img
Found fallback initrd image(s) in /boot: initramfs-linux-fallback.img
done
```

### Installing Graphics Drivers

If you are an NVIDIA user, install the open-source DKMS kernel modules and utilities:
```bash
pacman -S nvidia-open-dkms nvidia-utils nvidia-settings
```

If you are on an AMD GPU, install the open-source AMD drivers and Mesa stack:
```bash
pacman -S xf86-video-amdgpu mesa lib32-mesa vulkan-radeon lib32-vulkan-radeon
```

### Audio and Bluetooth Drivers

For audio drivers, we will use PipeWire, which is the modern standard for Linux audio:
```bash
pacman -S pipewire pipewire-alsa pipewire-jack pipewire-pulse wireplumber
```

*Note: Since PipeWire is a user service, you will enable it after logging into your user account for the first time by running:*
`systemctl --user enable --now pipewire pipewire-pulse wireplumber`

For Bluetooth drivers and manager utilities:
```bash
pacman -S bluez bluez-utils blueman
systemctl enable bluetooth
```
Expected output:
```
Created symlink /etc/systemd/system/dbus-org.bluez.service -> /usr/lib/systemd/system/bluetooth.service.
Created symlink /etc/systemd/system/bluetooth.target.wants/bluetooth.service -> /usr/lib/systemd/system/bluetooth.service.
```

### Desktop Environments

Now for the most important part: the Desktop Environment (DE) or Window Manager. This is what actually gives you the graphical interface you interact with.

#### KDE Plasma
```bash
pacman -S plasma sddm konsole firefox
systemctl enable sddm
```

#### GNOME
```bash
pacman -S gnome gdm firefox
systemctl enable gdm
```

---

## Adding Extra Goodies: AUR, Hyprland, XFCE, and Niri

If GNOME and KDE are too boring or heavy for you, you can install lightweight desktop environments or tiling window managers. But first, let's enable the Arch User Repository (AUR), which is where all the cool community packages live.

![Homer Backing Into Bush](https://i.giphy.com/l0GiJaD8A29hdT9tC.webp)

### Enabling the AUR with yay

To enable the AUR, we will use a helper tool called `yay`. We need to clone it from the repository and build it. Run this as your normal user (not root, and you'll need to exit the chroot or run it once you've booted):
```bash
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
```

This will compile and install `yay` on your system. Now you can install any AUR package easily by running `yay -S <package_name>`.

### Installing XFCE (The Lightweight King)

If your system is low-end or you just want absolute raw speed, XFCE is a super lightweight desktop environment that gets the job done:
```bash
sudo pacman -S xfce4 xfce4-goodies lightdm lightdm-gtk-greeter
sudo systemctl enable lightdm
```

### Installing Hyprland (The Dynamic Wayland Compositor)

If you want those beautiful animations, blur effects, and tiling windows, Hyprland is the go-to Wayland compositor right now. Install it along with a terminal emulator (kitty) and portal:
```bash
sudo pacman -S hyprland kitty xdg-desktop-portal-hyprland
```

### Installing Niri with Noctalia Dots

Niri is a unique scrollable-tiling window manager for Wayland. It works horizontally, and it is incredibly satisfying to use.

First, install Niri:
```bash
sudo pacman -S niri xdg-desktop-portal-gnome
```

Now, let's make it look gorgeous with **Noctalia**, a sleek and minimal desktop shell built with Quickshell. To get Noctalia and setup the aesthetic dots:

Install Noctalia Shell from the AUR using yay:
```bash
yay -S noctalia-shell-git
```

Grab some sick community Noctalia-themed dotfiles for Niri (like the popular Catppuccin theme setup):
```bash
git clone https://github.com/thenotaryaa/niridots.git ~/.config/niri
git clone https://github.com/noctalia-dev/noctalia.git ~/.config/noctalia
```

Boom! You now have a high-performance, scrollable, and beautifully themed tiling desktop environment.

---

## Wrapping Up & Rebooting

You have now completely installed and set up Arch Linux! Time to reboot and enjoy your new system.

Exit the chroot environment:
```bash
exit
```

Unmount the partitions (and yes, it is `umount`, not `unmount` lol):
```bash
umount -a
```

Reboot:
```bash
reboot
```

If you ever get stuck or did not understand a step, you can always search for it on Google, check the legendary Arch Wiki, or ask an LLM.

![Mission Passed](https://i.giphy.com/pDsCoECKh1pa8.webp)

Thanks for reading!
Seeyaaaa!
